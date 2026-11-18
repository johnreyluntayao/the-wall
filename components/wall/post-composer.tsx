"use client";

import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowRight, Button, Globe2, Image, ImagePlus, LoaderCircle, PenLine, Textarea, X } from "@/lib/imports";
import { countCharacters, MAX_POST_LENGTH } from "@/lib/posts";
import { validatePhoto } from "@/lib/photos";
import { UserAvatar } from "./user-avatar";
import { profile } from "@/lib/profile";

type PostComposerProps = {
  onShare: (message: string, photo?: File, requestId?: string) => Promise<void>;
};

export function PostComposer({ onShare }: PostComposerProps) {
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState("");
  const [pending, setPending] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const draftId = useRef<string | undefined>(undefined);
  const selection = useRef(0);
  const length = countCharacters(message);
  const tooLong = length > MAX_POST_LENGTH;
  const busy = pending || validating;

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  function changed() {
    draftId.current = undefined;
    setShared(false);
    setError(null);
  }

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const current = ++selection.current;
    setValidating(true);
    setError(null);
    try {
      await validatePhoto(file);
      const bitmap = await createImageBitmap(file);
      const tooLarge = bitmap.width * bitmap.height > 40000000;
      bitmap.close();
      if (tooLarge) throw new Error("This photo’s dimensions are too large. Please resize it below 40 megapixels.");
      if (current !== selection.current) return;
      changed();
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    } catch (cause) {
      if (current === selection.current) setError(cause instanceof Error && cause.name !== "InvalidStateError" ? cause.message : "This photo couldn’t be read. Please choose another.");
    } finally {
      if (current === selection.current) setValidating(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || busy || (!message.trim() && !photo) || tooLong) return;
    submitting.current = true;
    draftId.current ??= crypto.randomUUID();
    setPending(true);
    setError(null);
    setShared(false);
    try {
      await onShare(message, photo, draftId.current);
      setMessage("");
      setPhoto(undefined);
      setPreview("");
      draftId.current = undefined;
      setShared(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your post couldn’t be shared. Your draft is safe; please try again.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return <section className="composer" aria-labelledby="composer-heading">
    <div className="composer-heading"><PenLine size={14} /><h2 id="composer-heading">Update Status</h2><span>Share a little of your day.</span></div>
    <form onSubmit={handleSubmit}>
      <div className="composer-body"><UserAvatar /><div className="composer-input">
        <label htmlFor="wall-message" className="sr-only">Your message</label>
        <Textarea id="wall-message" placeholder="What’s on your mind?" value={message} disabled={pending}
          aria-invalid={tooLong} aria-describedby="message-count share-feedback"
          onChange={(event) => { setMessage(event.target.value); changed(); }}
          className="min-h-16 resize-y border-0 bg-transparent p-0 text-[13px] shadow-none focus-visible:ring-0" />
        {photo && preview && <div className="attachment-preview">
          <Image src={preview} alt="Selected photo preview" width={240} height={160} unoptimized />
          <div><span>{photo.name}</span><small>{(photo.size / 1024 / 1024).toFixed(1)} MB</small></div>
          <Button type="button" variant="ghost" size="icon" disabled={busy} aria-label="Remove attached photo" onClick={() => { changed(); setPhoto(undefined); setPreview(""); }}><X size={14} /></Button>
        </div>}
        <span id="message-count" className={tooLong ? "character-count over-limit" : "character-count"}>{length} / {MAX_POST_LENGTH}</span>
      </div></div>
      <div className="photo-toolbar">
        <input ref={fileInput} id="wall-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="sr-only" disabled={busy} aria-label="Attach a photo" />
        <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => fileInput.current?.click()}><ImagePlus size={14} />{validating ? "Checking photo…" : photo ? "Change photo" : "Add photo"}</Button>
        <span>JPG, PNG, WebP · up to 5 MB</span>
      </div>
      <div className="composer-footer"><span><Globe2 size={13} /> Public · Posting as {profile.name}</span>
        <Button type="submit" disabled={busy || (!message.trim() && !photo) || tooLong} className="share-button">
          {pending && <LoaderCircle className="animate-spin" size={14} />}{pending ? "Sharing…" : "Share"}{!pending && <ArrowRight size={14} />}
        </Button>
      </div>
      <div id="share-feedback" aria-live="polite">
        {error && <p className="form-feedback text-destructive" role="alert">{error}</p>}
        {shared && <p className="form-feedback">Your post has been shared on the wall.</p>}
        {tooLong && <p className="form-feedback text-destructive">Keep your message to {MAX_POST_LENGTH} characters.</p>}
      </div>
    </form>
  </section>;
}
