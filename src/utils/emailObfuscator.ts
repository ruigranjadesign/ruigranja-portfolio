/**
 * Utility for obfuscating and dynamically assembling email addresses
 * to protect against automated web scrapers and spambots.
 */

// Char codes for "ruigranja.studio@gmail.com"
const EMAIL_CHAR_CODES = [
  114, 117, 105, 103, 114, 97, 110, 106, 97, 46, 115, 116, 117, 100, 105, 111,
  64, 103, 109, 97, 105, 108, 46, 99, 111, 109
];

/**
 * Dynamically decodes the obfuscated email address at runtime.
 */
export const getObfuscatedEmail = (): string => {
  return String.fromCharCode(...EMAIL_CHAR_CODES);
};

/**
 * Dynamically generates a mailto: URL with optional subject line.
 */
export const getMailtoHref = (subject?: string): string => {
  const email = getObfuscatedEmail();
  if (!subject) return `mailto:${email}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
};
