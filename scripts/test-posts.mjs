// Compile the small data layer in memory; no browser, database writes, or extra runner.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import Module from "node:module";
import ts from "typescript";
const cache = new Map();
function load(name) {
  const filename = path.resolve(import.meta.dirname, "../lib", name + ".ts");
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = new Module(filename);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  cache.set(filename, mod);
  const original = mod.require.bind(mod);
  mod.require = (id) => id.startsWith("./") ? load(id.slice(2)) : original(id);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
  return mod.exports;
}

(async () => {
  const photos = load("photos");
  const posts = load("posts");
  const supabase = load("supabase");
  const jpeg = new File([Buffer.from([255,216,255,224])], "photo.jpg", { type: "image/jpeg" });
  await photos.validatePhoto(jpeg);
  await assert.rejects(photos.validatePhoto(new File(["text"], "text.txt", { type: "text/plain" })), /JPEG/);
  await assert.rejects(photos.validatePhoto(new File(["fake"], "fake.jpg", { type: "image/jpeg" })), /valid photo/);
  await assert.rejects(photos.validatePhoto(new File([Buffer.alloc(5 * 1024 * 1024 + 1)], "big.png", { type: "image/png" })), /too large/);
  await assert.rejects(posts.createPost("   "), /message or photo/);
  await assert.rejects(posts.createPost("x".repeat(281)), /280/);
  assert.equal(posts.countCharacters("😀"), 1);
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { onLine: false } });
  await assert.rejects(posts.createPost("Offline draft"), /offline.*draft is safe/);
  if (originalNavigator) Object.defineProperty(globalThis, "navigator", originalNavigator);
  else delete globalThis.navigator;

  const existing = { id: "retry-id", body: "already saved", image_path: null };
  let inserts = 0;
  supabase.getSupabase = () => ({ from: () => ({
    select() { return this; }, eq() { return this; }, abortSignal() { return this; },
    async maybeSingle() { return { data: existing, error: null }; },
    insert() { inserts++; throw new Error("Retry must not insert again"); },
  }) });
  assert.equal(await posts.createPost("already saved", undefined, "retry-id"), existing);
  assert.equal(inserts, 0);
  supabase.getSupabase = () => ({ from: () => ({
    select() { return this; }, eq() { return this; }, abortSignal() { return this; },
    async maybeSingle() { return { data: null, error: { message: "network failure" } }; },
  }) });
  await assert.rejects(posts.createPost("Keep this draft"), /draft is safe/);
  supabase.getSupabase = () => ({ storage: { from: () => ({
    async upload() { return { error: { statusCode: "500", message: "unavailable" } }; },
  }) } });
  await assert.rejects(photos.uploadPhoto(jpeg, "test"), /couldn’t upload/);
  supabase.getSupabase = () => ({ storage: { from: () => ({
    async upload() { return { error: { statusCode: "409" } }; },
  }) } });
  assert.equal(await photos.uploadPhoto(jpeg, "test"), "test.jpg");
  const pageRows = [{ id: "older-post" }];
  let pageResult = { status: 206, data: pageRows, count: 25, error: null };
  supabase.getSupabase = () => ({ from: () => ({
    select(_columns, options) { assert.equal(options.count, "exact"); return this; },
    order() { return this; },
    range(first, last) { assert.deepEqual([first, last], [20, 29]); return this; },
    async abortSignal() { return pageResult; },
  }) });
  assert.deepEqual(await posts.listPosts(2), { posts: pageRows, total: 25 });
  pageResult = { status: 416, data: null, count: 12, error: { code: "PGRST103" } };
  assert.deepEqual(await posts.listPosts(2), { posts: [], total: 12 });
  console.log("Passed: page ranges, total count, and a page that no longer exists.");
  console.log("Passed: file type, signature, size, text limits, Unicode, safe retry, fetch failure, upload failure, and upload reuse.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
