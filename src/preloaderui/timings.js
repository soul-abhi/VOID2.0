// Shared timing/constants for the About-page preloader. Kept out of the
// component file so it only exports components (react-refresh rule).
import { PRELOADER_PHOTOS, PHOTO_MS } from './photos';

export const WORDMARK = 'VOID SOCIETY';

// Overlay copy. NOTE: 'have' reads as a likely typo for 'of' — change here if so.
export const TAGLINE = 'Introducing the House have Hackers and Developers';

// Placeholder font — swap in the exact font once provided.
export const TEXT_FONT = "'CustomClubFont', 'Segoe UI', system-ui, sans-serif";

// Text animation knobs (ms). Everything is computed so the text completes at
// ~the same moment the background shutter settles on its final photo.
export const LETTER_START_MS = 300;
export const LETTER_STEP_MS = 60;
const LETTER_DUR_MS = 480;
const TAG_DUR_MS = 500;

// Time the shutter reaches the last (final) photo.
const LAST_PHOTO_MS = (PRELOADER_PHOTOS.length - 1) * PHOTO_MS;

// Read pause: after the tagline is fully shown we hold on the last screen this
// long before the exit swipe, so the blue line can actually be read.
export const READ_MS = 1500;

const LETTERS = WORDMARK.split('');
const LETTER_COUNT = LETTERS.filter((c) => c !== ' ').length;
const LAST_LETTER_END =
  LETTER_START_MS + (LETTER_COUNT - 1) * LETTER_STEP_MS + LETTER_DUR_MS;

// Tagline appears once the letters are done and the shutter is on its last
// still, then stays visible through the read pause.
export const TAG_DELAY_MS = Math.max(
  LAST_LETTER_END + 60,
  LAST_PHOTO_MS + 200,
);

// Fade done + read pause; when this elapses the parent starts the swap.
export const PRELOADER_MS = TAG_DELAY_MS + TAG_DUR_MS + READ_MS;

// Shared swipe transition (same as the @skiper-ui/skiper7 demo pattern):
// preloader exits y 0 -> -100% while the page enters y 100% -> 0.
export const SWIPE_TRANSITION = {
  duration: 0.65,
  ease: [0.785, 0.135, 0.15, 0.86],
};
