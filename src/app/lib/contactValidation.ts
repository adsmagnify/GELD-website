/**
 * Shared contact-form validation for all contact UIs + API.
 */

export const CONTACT_LIMITS = {
  MAX_NAME: 100,
  MAX_EMAIL: 254,
  MAX_PHONE_DIGITS: 10,
  MAX_PHONE: 20,
  MAX_MESSAGE: 4000,
  MIN_NAME: 3,
  MIN_MESSAGE: 11,
} as const;

/** At least 3 letters; allows spaces, hyphens, apostrophes, periods between/after letters */
export const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]{1,98}[A-Za-z.]$/;

/** Must not start with a digit */
export const EMAIL_PATTERN =
  /^[A-Za-z][A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]*@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

/** Digits only for counting; display may include + / spaces / dashes */
export const PHONE_DIGIT_PATTERN = /^\d{1,10}$/;

export type ContactFieldKey = "name" | "email" | "phone" | "message";
export type ContactFieldErrors = Partial<Record<ContactFieldKey, string>>;

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export function getPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < CONTACT_LIMITS.MIN_NAME || trimmed.length > CONTACT_LIMITS.MAX_NAME) {
    return false;
  }
  const letterCount = (trimmed.match(/[A-Za-z]/g) || []).length;
  if (letterCount < CONTACT_LIMITS.MIN_NAME) return false;
  return NAME_PATTERN.test(trimmed);
}

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed || trimmed.length > CONTACT_LIMITS.MAX_EMAIL) return false;
  if (/^\d/.test(trimmed)) return false;
  return EMAIL_PATTERN.test(trimmed);
}

export function isValidPhone(phone: string): boolean {
  const digits = getPhoneDigits(phone);
  if (digits.length === 0 || digits.length > CONTACT_LIMITS.MAX_PHONE_DIGITS) return false;
  // Require a full 10-digit number (common for IN contact forms)
  return digits.length === CONTACT_LIMITS.MAX_PHONE_DIGITS;
}

export function isValidMessage(message: string): boolean {
  const trimmed = message.trim();
  return (
    trimmed.length >= CONTACT_LIMITS.MIN_MESSAGE &&
    trimmed.length <= CONTACT_LIMITS.MAX_MESSAGE
  );
}

export function validateContactFields(fields: ContactFields): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const phone = fields.phone.trim();
  const message = fields.message.trim();

  if (!name) {
    errors.name = "Full name is required.";
  } else if ((name.match(/[A-Za-z]/g) || []).length < CONTACT_LIMITS.MIN_NAME) {
    errors.name = "Name must be more than 2 letters.";
  } else if (!isValidName(name)) {
    errors.name = "Enter a valid name (letters only; more than 2 letters).";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (/^\d/.test(email)) {
    errors.email = "Email cannot start with a number.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address (e.g. name@company.com).";
  }

  if (!phone) {
    errors.phone = "Contact number is required.";
  } else {
    const digits = getPhoneDigits(phone);
    if (digits.length > CONTACT_LIMITS.MAX_PHONE_DIGITS) {
      errors.phone = "Phone number cannot have more than 10 digits.";
    } else if (digits.length < CONTACT_LIMITS.MAX_PHONE_DIGITS) {
      errors.phone = "Enter a valid 10-digit phone number.";
    }
  }

  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length <= 10) {
    errors.message = "Message must be more than 10 characters.";
  } else if (message.length > CONTACT_LIMITS.MAX_MESSAGE) {
    errors.message = `Message must be ${CONTACT_LIMITS.MAX_MESSAGE} characters or fewer.`;
  }

  return errors;
}

export function validateContactField(
  field: ContactFieldKey,
  value: string,
  options?: { requireFilled?: boolean }
): string | undefined {
  const requireFilled = options?.requireFilled ?? false;
  const trimmed = value.trim();

  if (!trimmed) {
    if (!requireFilled) return undefined;
    if (field === "name") return "Full name is required.";
    if (field === "email") return "Email address is required.";
    if (field === "phone") return "Contact number is required.";
    return "Message is required.";
  }

  if (field === "name") {
    if ((trimmed.match(/[A-Za-z]/g) || []).length < CONTACT_LIMITS.MIN_NAME) {
      return "Name must be more than 2 letters.";
    }
    if (!isValidName(trimmed)) {
      return "Enter a valid name (letters only; more than 2 letters).";
    }
    return undefined;
  }

  if (field === "email") {
    if (/^\d/.test(trimmed)) {
      return "Email cannot start with a number.";
    }
    // While typing an incomplete address, only warn once it looks intentional
    if (!trimmed.includes("@") && trimmed.length < 3) return undefined;
    if (!isValidEmail(trimmed)) {
      return "Please enter a valid email address (e.g. name@company.com).";
    }
    return undefined;
  }

  if (field === "phone") {
    const digits = getPhoneDigits(trimmed);
    if (digits.length > CONTACT_LIMITS.MAX_PHONE_DIGITS) {
      return "Phone number cannot have more than 10 digits.";
    }
    if (digits.length > 0 && digits.length < CONTACT_LIMITS.MAX_PHONE_DIGITS) {
      return "Enter a valid 10-digit phone number.";
    }
    return undefined;
  }

  // message
  if (trimmed.length <= 10) {
    return "Message must be more than 10 characters.";
  }
  if (trimmed.length > CONTACT_LIMITS.MAX_MESSAGE) {
    return `Message must be ${CONTACT_LIMITS.MAX_MESSAGE} characters or fewer.`;
  }
  return undefined;
}

export function firstContactError(errors: ContactFieldErrors): string {
  return errors.name || errors.email || errors.phone || errors.message || "";
}
