const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CODE_PATTERN = /^\d{6}$/;

export const MIN_PASSWORD_LENGTH = 8;
export const CODE_LENGTH = 6;

export const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export const validateEmail = (value: string): string | undefined => {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "That email doesn't look quite right.";
  return undefined;
};

export const validatePassword = (
  value: string,
  { requireStrength = false } = {},
): string | undefined => {
  if (!value) return "Enter your password.";
  if (requireStrength && value.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return undefined;
};

export const validateCode = (value: string): string | undefined => {
  if (!value) return "Enter the code we emailed you.";
  if (!CODE_PATTERN.test(value)) return `The code has ${CODE_LENGTH} digits.`;
  return undefined;
};

type ErrorLike = { longMessage?: string; message?: string } | null | undefined;

// Prefers the user-facing long message returned by the auth API.
export const getErrorMessage = (error: ErrorLike): string | undefined =>
  error?.longMessage ?? error?.message ?? undefined;
