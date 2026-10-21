import { Fragment, type ElementType } from 'react';

interface Token {
  text: string;
  accent: boolean;
}

/** Text → Wörter; *Sternchen* markieren Akzent-Wörter; reine Satzzeichen hängen am Wort davor. */
function tokenize(text: string): Token[] {
  const out: Token[] = [];
  for (const part of text.split(/(\*[^*]+\*)/g).filter(Boolean)) {
    const accent = part.startsWith('*');
    const words = part.replace(/\*/g, '').split(/\s+/).filter(Boolean);
    words.forEach((w, i) => {
      const glued = i === 0 && !accent && !/^\s/.test(part) && /^[.,!?;:…“”]+/.test(w);
      const prev = out[out.length - 1];
      if (glued && prev) {
        const punct = w.match(/^[.,!?;:…“”]+/)![0];
        prev.text += punct;
        const rest = w.slice(punct.length);
        if (rest) out.push({ text: rest, accent });
      } else {
        out.push({ text: w, accent });
      }
    });
  }
  return out;
}

/**
 * Zerlegt Text serverseitig in Wörter, damit Reveals ohne DOM-Manipulation animieren können.
 * Wörter in *Sternchen* werden als kursive Serif-Akzente gesetzt.
 */
export function Split({
  text,
  as: Tag = 'span',
  className,
  reveal = 'words',
}: {
  text: string;
  as?: ElementType;
  className?: string;
  reveal?: 'words' | 'scrub' | 'none';
}) {
  const attrs = reveal === 'words' ? { 'data-reveal': 'words' } : reveal === 'scrub' ? { 'data-scrub': 'words' } : {};
  return (
    <Tag className={className} {...attrs} aria-label={text.replace(/\*/g, '')}>
      {tokenize(text).map((t, i) => (
        <Fragment key={i}>
          <span className={`w${t.accent ? ' w--accent' : ''}`} aria-hidden="true">
            <span className="wi">{t.text}</span>
          </span>{' '}
        </Fragment>
      ))}
    </Tag>
  );
}
