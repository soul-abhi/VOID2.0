const EMAIL_RE = /^[^\s@]+@kiet\.edu$/i;
const WHATSAPP_RE = /^\+?[\d\s-]{10,15}$/;

const BRANCHES = new Set([
  'CSE', 'CS', 'CSE (AI)', 'CSE (AI & ML)', 'IT', 'CSIT', 'CSE (DS)', 'CSE (CS)',
  'ECE', 'EEE', 'EC', 'ECE (VLSI)', 'ME', 'AMIA', 'MBA', 'MCA',
]);
const ACCOMMODATIONS = new Set(['Hosteller', 'Outside']);
const YEARS = new Set(['1st Year', '2nd Year']);
const DOMAINS = new Set([
  'Web Security', 'Web Development', 'Machine Learning',
  'Graphic Designing', 'Video Editing',
]);

export const validateRegistration = (fields) => {
  const errors = {};
  if (!fields.name) errors.name = 'Name is required.';
  if (!fields.branch || !BRANCHES.has(fields.branch)) errors.branch = 'Select a valid branch.';
  if (!fields.year || !YEARS.has(fields.year)) errors.year = 'Select a valid year.';
  if (!EMAIL_RE.test(fields.email)) errors.email = 'Only @kiet.edu email addresses are allowed.';
  if (!fields.whatsapp || !WHATSAPP_RE.test(fields.whatsapp)) {
    errors.whatsapp = 'Enter a valid WhatsApp number.';
  }
  if (!fields.accommodation || !ACCOMMODATIONS.has(fields.accommodation)) {
    errors.accommodation = 'Select a valid mode of accommodation.';
  }
  if (!fields.domain || !DOMAINS.has(fields.domain)) errors.domain = 'Select a valid domain.';
  return errors;
};
