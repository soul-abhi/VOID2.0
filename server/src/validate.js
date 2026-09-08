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
const MAX_DOMAINS = 3;

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
  const domains = fields.domains;
  if (!Array.isArray(domains) || domains.length === 0) {
    errors.domains = 'Select at least one domain.';
  } else if (domains.length > MAX_DOMAINS) {
    errors.domains = `Select up to ${MAX_DOMAINS} domains.`;
  } else if (domains.some((d) => !DOMAINS.has(d))) {
    errors.domains = 'Select a valid domain.';
  } else if (new Set(domains).size !== domains.length) {
    errors.domains = 'Domains must not be repeated.';
  }
  return errors;
};
