// Local photos for the About-page preloader background shutter, served from
// the Vite public dir (public/assets/shutter). Add/remove files freely — the
// shutter loops over whatever is listed here.
const BASE = `${import.meta.env.BASE_URL}assets/shutter/`;
const img = (name) => `${BASE}${encodeURIComponent(name)}`;

export const PRELOADER_PHOTOS = [
  { id: 1, src: img('Gemini_Generated_Image_47n8ap47n8ap47n8.png') },
  { id: 2, src: img('Gemini_Generated_Image_8ofzpn8ofzpn8ofz.png') },
  { id: 3, src: img('Gemini_Generated_Image_gkzaj8gkzaj8gkza.png') },
  { id: 4, src: img('Gemini_Generated_Image_u4pvh4u4pvh4u4pv.png') },
  { id: 5, src: img('Gemini_Generated_Image_y0ppl5y0ppl5y0pp.png') },
  { id: 6, src: img('WhatsApp Image 2026-08-21 at 7.43.30 PM.jpeg') },
  { id: 7, src: img('WhatsApp Image 2026-09-06 at 11.31.56 AM.jpeg') },
];

// Time each photo is shown: 0.2s per change.
export const PHOTO_MS = 200;
