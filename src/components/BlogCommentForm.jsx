'use client';
import { useState } from 'react';

export default function BlogCommentForm({ postTitle, postSlug }) {
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/blog/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postTitle, postSlug, ...form }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', email: '', comment: '' });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-cream border border-gold/30 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
          <CheckIcon />
        </div>
        <h3 className="font-display font-bold text-navy text-lg mb-2">
          Thanks for your comment!
        </h3>
        <p className="text-navy/60 text-sm">
          We read every message. If you left a question, we'll follow up by email.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm font-semibold text-navy/60 underline underline-offset-2 hover:text-navy transition-colors"
        >
          Leave another comment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="comment-name" className="text-xs font-semibold text-navy/60 uppercase tracking-wider">
            Name <span className="text-gold">*</span>
          </label>
          <input
            id="comment-name"
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Jane Smith"
            required
            className="field"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="comment-email" className="text-xs font-semibold text-navy/60 uppercase tracking-wider">
            Email <span className="text-gold">*</span>
          </label>
          <input
            id="comment-email"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="jane@email.com"
            required
            className="field"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="comment-body" className="text-xs font-semibold text-navy/60 uppercase tracking-wider">
          Comment <span className="text-gold">*</span>
        </label>
        <textarea
          id="comment-body"
          value={form.comment}
          onChange={set('comment')}
          placeholder="Share your thoughts, questions, or experience…"
          required
          rows={5}
          className="field resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          Something went wrong. Please try again, or call us at{' '}
          <a href="tel:+18125659585" className="font-semibold underline">
            (812) 565-9585
          </a>
          .
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold text-navy font-semibold text-[15px] shadow-gold hover:bg-gold-deep hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {status === 'loading' ? (
            <>
              <SpinIcon /> Sending…
            </>
          ) : (
            'Post Comment'
          )}
        </button>
        <p className="text-xs text-navy/40">
          Your email is only used to follow up — never shared.
        </p>
      </div>
    </form>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fdbd2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SpinIcon() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
