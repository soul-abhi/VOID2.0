import { useEffect, useRef, useState } from 'react';
import { PRELOADER_PHOTOS, PHOTO_MS } from './photos';
import {
  WORDMARK,
  TAGLINE,
  TEXT_FONT,
  LETTER_START_MS,
  LETTER_STEP_MS,
  TAG_DELAY_MS,
  PRELOADER_MS,
} from './timings';

const LETTERS = WORDMARK.split('');

export default function AboutPreloader({ onDone }) {
  const [idx, setIdx] = useState(0);
  const timers = useRef([]);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const after = (ms, fn) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };

    // Shutter: step through the photos once (every PHOTO_MS) and hold the last
    // one on screen so the tagline stays readable during the read pause.
    const step = (n) => {
      if (n >= PRELOADER_PHOTOS.length) return;
      setIdx(n);
      after(PHOTO_MS, () => step(n + 1));
    };
    step(0);

    // Content + read pause done -> let the parent start the exit/enter swap.
    after(PRELOADER_MS, () => doneRef.current());

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <>
      {/* Background photo shutter. */}
      <div className="about-preloader__stage" aria-hidden="true">
        {PRELOADER_PHOTOS.map((p, i) => (
          <img
            key={p.id}
            src={p.src}
            alt=""
            draggable="false"
            className={`about-preloader__img ${i === idx ? 'about-preloader__img--active' : ''}`}
          />
        ))}
        <div className="about-preloader__shade" />
      </div>

      {/* Foreground wordmark + tagline, timed to match the shutter. */}
      <div className="about-preloader__inner">
        <svg className="about-preloader__swoosh" viewBox="0 0 400 110" aria-hidden="true">
          <path
            d="M18 96 C 60 18, 120 6, 150 44 C 178 79, 208 98, 246 82 C 284 66, 318 46, 382 42"
            pathLength="1"
          />
        </svg>

        <div className="about-preloader__word">
          {LETTERS.map((ch, i) => {
            if (ch === ' ') {
              return <span key={i} className="about-preloader__space" aria-hidden="true" />;
            }
            const letterIndex = LETTERS.slice(0, i).filter((c) => c !== ' ').length;
            return (
              <span
                key={i}
                className="about-preloader__char"
                style={{
                  animationDelay: `${LETTER_START_MS + letterIndex * LETTER_STEP_MS}ms`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        <p
          className="about-preloader__tagline"
          style={{ fontFamily: TEXT_FONT, animationDelay: `${TAG_DELAY_MS}ms` }}
        >
          {TAGLINE}
        </p>
      </div>
    </>
  );
}
