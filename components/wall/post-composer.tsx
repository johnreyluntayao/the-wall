"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Button, Globe2, LoaderCircle, PenLine, Textarea } from "@/lib/imports";
import { countCharacters, MAX_POST_LENGTH } from "@/lib/posts";
import { UserAvatar } from "./user-avatar";

type PostComposerProps = {
  onShare: (message: string) => Promise<void>;
};

export function PostComposer({ onShare }: PostComposerProps) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const submitting = useRef(false);
  const length = countCharacters(message);
  const tooLong = length > MAX_POST_LENGTH;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !message.trim() || tooLong) return;
    submitting.current = true;
    setPending(true);
    setError(null);
    setShared(false);
    try {
      await onShare(message);
      setMessage("");
      setShared(true);
    } catch {
      setError("Your message wasn’t shared. Please try again.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <section className="composer" aria-labelledby="composer-heading">
      <div className="composer-heading"><PenLine size={15} /><h2 id="composer-heading">Write on the wall</h2><span>A little hello goes a long way.</span></div>
      <form onSubmit={handleSubmit}>
        <div className="composer-body">
          <UserAvatar />
          <div className="composer-input">
            <label htmlFor="wall-message" className="sr-only">Your message</label>
            <Textarea id="wall-message" placeholder="What’s on your mind?" value={message}
              disabled={pending} aria-invalid={tooLong} aria-describedby="message-count share-feedback"
              onChange={(event) => { setMessage(event.target.value); setShared(false); setError(null); }}
              className="min-h-24 resize-y border-0 bg-transparent p-0 text-[14px] shadow-none focus-visible:ring-0" />
            <span id="message-count" className={tooLong ? "character-count over-limit" : "character-count"}>{length} / {MAX_POST_LENGTH}</span>
          </div>
        </div>
        <div className="composer-footer">
          <span><Globe2 size={13} /> Public · Posting as Wall Visitor</span>
          <Button type="submit" disabled={pending || !message.trim() || tooLong} className="share-button">
            {pending ? <LoaderCircle className="animate-spin" size={14} /> : null}
            {pending ? "Sharing…" : "Share"}{!pending && <ArrowRight size={14} />}
          </Button>
        </div>
        <div id="share-feedback" aria-live="polite">
          {error && <p className="form-feedback text-destructive" role="alert">{error}</p>}
          {shared && <p className="form-feedback">Your thought has found its place on the wall.</p>}
          {tooLong && <p className="form-feedback text-destructive">Keep your message to {MAX_POST_LENGTH} characters.</p>}
        </div>
      </form>
    </section>
  );
}
