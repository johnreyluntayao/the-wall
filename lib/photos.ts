import { getSupabase } from "./supabase";

export const PHOTO_BUCKET = "wall-images";
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
};

export async function validatePhoto(file: File) {
  if (!extensions[file.type]) throw new Error("Choose a JPEG, PNG, or WebP photo.");
  if (!file.size) throw new Error("This file is empty. Please choose another photo.");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("Your photo is too large. Choose one under 5 MB.");
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const signature = file.type === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : file.type === "image/png" ? [137,80,78,71,13,10,26,10].every((value,index) => bytes[index] === value)
    : String.fromCharCode(...bytes.slice(0,4)) === "RIFF" && String.fromCharCode(...bytes.slice(8,12)) === "WEBP";
  if (!signature) throw new Error("That file isn’t a valid photo. Please choose another.");
}

export async function uploadPhoto(file: File, postId: string) {
  await validatePhoto(file);
  const path = postId + "." + extensions[file.type];
  const { error } = await getSupabase().storage.from(PHOTO_BUCKET).upload(path, file, {
    contentType: file.type, cacheControl: "3600", upsert: false,
  });
  // Retrying the same immutable draft reuses its already uploaded file.
  if (error && !["409", "Duplicate"].includes(String(error.statusCode)) && error.message !== "The resource already exists") {
    throw new Error("The photo couldn’t upload. Check your connection and try Share again.");
  }
  return path;
}

export function getPhotoUrl(path: string) {
  return getSupabase().storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}
