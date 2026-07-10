export type ContactIntentConfig = {
  id: string;
  emailSubject: string;
  formBadge: string;
  formTitle: string;
  formSubheading: string;
  messagePlaceholder: string;
  thankYouTitle: string;
  thankYouMessage: string;
};

export const CONTACT_INTENTS: Record<string, ContactIntentConfig> = {
  general: {
    id: "general",
    emailSubject: "GELD Contact Inquiry from {name}",
    formBadge: "Contact Us",
    formTitle: "Get in touch",
    formSubheading: "Speak with our financial experts about your goals.",
    messagePlaceholder: "How can we help you?",
    thankYouTitle: "Thank you for reaching out!",
    thankYouMessage:
      "Your message has been sent successfully. Our wealth team will contact you shortly.",
  },
  home: {
    id: "home",
    emailSubject: "Homepage Contact Inquiry from {name}",
    formBadge: "Get In Touch",
    formTitle: "Let's build your financial future",
    formSubheading: "Our experts are ready to assist you.",
    messagePlaceholder: "Tell us about your financial goals...",
    thankYouTitle: "Thank you for getting in touch!",
    thankYouMessage:
      "We've received your message and will get back to you shortly with the next steps.",
  },
  "mutual-funds-sip": {
    id: "mutual-funds-sip",
    emailSubject: "SIP / Mutual Funds Inquiry from {name}",
    formBadge: "Mutual Funds",
    formTitle: "Start your SIP journey",
    formSubheading: "Tell us your goals and we'll help you pick the right schemes.",
    messagePlaceholder: "Share your monthly investment amount, timeline, or questions about SIPs...",
    thankYouTitle: "Thank you for your interest in starting a SIP!",
    thankYouMessage:
      "Our advisors will help you build a focused mutual fund portfolio with the right scheme mix and SIP allocation.",
  },
  "mini-stock-portfolio": {
    id: "mini-stock-portfolio",
    emailSubject: "Mini Stock Portfolio Inquiry from {name}",
    formBadge: "Mini Stock Portfolios",
    formTitle: "Start your portfolio journey",
    formSubheading: "Focused stock portfolios managed by India's top fund managers.",
    messagePlaceholder: "Tell us about your investment amount and portfolio goals...",
    thankYouTitle: "Thank you for your interest in mini stock portfolios!",
    thankYouMessage:
      "Our team will walk you through the next steps to get your professionally managed portfolio started.",
  },
  "mini-stock-portfolio-review": {
    id: "mini-stock-portfolio-review",
    emailSubject: "Mini Stock Portfolio Review Request from {name}",
    formBadge: "Mini Stock Portfolios",
    formTitle: "Review your portfolio",
    formSubheading: "We'll assess whether a professionally managed mini portfolio fits your goals.",
    messagePlaceholder: "Share your current holdings, investment amount, and timeline...",
    thankYouTitle: "Thank you for requesting a portfolio review!",
    thankYouMessage:
      "Our team will review your portfolio and reach out with the right mini stock portfolio options.",
  },
  pms: {
    id: "pms",
    emailSubject: "PMS Inquiry from {name}",
    formBadge: "Portfolio Management Services",
    formTitle: "Start your PMS journey",
    formSubheading: "Concentrated, conviction-led portfolios for serious investors.",
    messagePlaceholder: "Share your investable corpus, risk profile, or PMS questions...",
    thankYouTitle: "Thank you for your interest in PMS!",
    thankYouMessage:
      "A wealth manager will connect with you to review portfolio options and onboarding.",
  },
  "pms-review": {
    id: "pms-review",
    emailSubject: "PMS Portfolio Review Request from {name}",
    formBadge: "Portfolio Management Services",
    formTitle: "Review your portfolio for PMS",
    formSubheading: "Share your current holdings and we'll assess PMS fit.",
    messagePlaceholder: "Tell us about your current portfolio, investable corpus, and goals...",
    thankYouTitle: "Thank you for requesting a PMS portfolio review!",
    thankYouMessage:
      "Our wealth managers will review your portfolio and contact you with tailored PMS recommendations.",
  },
  aif: {
    id: "aif",
    emailSubject: "AIF Inquiry from {name}",
    formBadge: "Alternative Investment Fund",
    formTitle: "Explore AIF opportunities",
    formSubheading: "Alternative strategies for sophisticated investors.",
    messagePlaceholder: "Tell us about your investment horizon and alternative asset interests...",
    thankYouTitle: "Thank you for your interest in AIF!",
    thankYouMessage:
      "Our team will reach out to discuss eligible strategies and the onboarding process.",
  },
  "fixed-income": {
    id: "fixed-income",
    emailSubject: "Fixed Income Inquiry from {name}",
    formBadge: "Fixed Income",
    formTitle: "Explore fixed income options",
    formSubheading: "Steady income solutions for your debt portfolio.",
    messagePlaceholder: "Share your income needs and investment horizon...",
    thankYouTitle: "Thank you for your interest in fixed income!",
    thankYouMessage:
      "We'll help you evaluate fixed income options that match your risk and return goals.",
  },
  "algo-trading": {
    id: "algo-trading",
    emailSubject: "XAlgo Trading Inquiry from {name}",
    formBadge: "XAlgo Trading",
    formTitle: "Learn about XAlgo trading",
    formSubheading: "Research-backed algo strategies on your existing portfolio.",
    messagePlaceholder: "Tell us about your portfolio and what you'd like to achieve...",
    thankYouTitle: "Thank you for your interest in XAlgo!",
    thankYouMessage:
      "Our team will explain how the strategy works and whether it fits your portfolio.",
  },
  insurance: {
    id: "insurance",
    emailSubject: "Insurance Inquiry from {name}",
    formBadge: "Life & Health Insurance",
    formTitle: "Plan your insurance cover",
    formSubheading: "Protection planning based on your real-life responsibilities.",
    messagePlaceholder: "Share your family situation, existing cover, or protection goals...",
    thankYouTitle: "Thank you for your interest in insurance planning!",
    thankYouMessage:
      "We'll help you assess the right life and health cover for your financial plan.",
  },
  shariah: {
    id: "shariah",
    emailSubject: "Shariyat-Compliant Investment Inquiry from {name}",
    formBadge: "Shariyat-Compliant Investing",
    formTitle: "Explore Shariyat-compliant options",
    formSubheading: "Investments aligned with your values and long-term goals.",
    messagePlaceholder: "Tell us what you're looking for in compliant investing...",
    thankYouTitle: "Thank you for your interest in Shariyat-compliant investing!",
    thankYouMessage:
      "Our advisors will share suitable options across funds, PMS, and other compliant products.",
  },
  webinar: {
    id: "webinar",
    emailSubject: "Webinar Inquiry from {name}",
    formBadge: "Weekly Webinar",
    formTitle: "Connect with our experts",
    formSubheading: "Questions about our live market sessions and registration.",
    messagePlaceholder: "Ask about the next webinar, topics covered, or registration help...",
    thankYouTitle: "Thank you for your webinar interest!",
    thankYouMessage:
      "We'll help you with registration details and anything you need before the session.",
  },
  "expert-call": {
    id: "expert-call",
    emailSubject: "Expert Call Request from {name}",
    formBadge: "Speak to an Expert",
    formTitle: "Schedule an expert call",
    formSubheading: "Book time with a GELD wealth manager.",
    messagePlaceholder: "Share your preferred time and what you'd like to discuss...",
    thankYouTitle: "Thank you for requesting an expert call!",
    thankYouMessage:
      "Our wealth managers will contact you shortly to schedule a conversation.",
  },
};

export const DEFAULT_CONTACT_INTENT = "general";

export function getContactIntent(intent?: string | null): ContactIntentConfig {
  if (intent && CONTACT_INTENTS[intent]) {
    return CONTACT_INTENTS[intent];
  }
  return CONTACT_INTENTS[DEFAULT_CONTACT_INTENT];
}

export function formatEmailSubject(template: string, name: string): string {
  return template.replace("{name}", name);
}

export function contactPageHref(intent: string = DEFAULT_CONTACT_INTENT): string {
  return `/contact?intent=${encodeURIComponent(intent)}`;
}

export function thankYouPageHref(intent: string = DEFAULT_CONTACT_INTENT): string {
  return `/contact/thank-you?intent=${encodeURIComponent(intent)}`;
}

const CONTACT_INTENT_STORAGE_KEY = "geld-contact-intent";

export function persistContactIntent(intent: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CONTACT_INTENT_STORAGE_KEY, intent);
  } catch {
    // Ignore storage failures in private browsing, etc.
  }
}

export function readStoredContactIntent(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(CONTACT_INTENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function resolveContactIntent(urlIntent?: string | null): string {
  if (urlIntent && CONTACT_INTENTS[urlIntent]) {
    return urlIntent;
  }

  const storedIntent = readStoredContactIntent();
  if (storedIntent && CONTACT_INTENTS[storedIntent]) {
    return storedIntent;
  }

  return DEFAULT_CONTACT_INTENT;
}

export const CATALOG_CONTACT_INTENT: Record<string, string> = {
  "Fixed Income Offerings": "fixed-income",
  "XAlgo Trading Software": "algo-trading",
  "Life & Health Insurance": "insurance",
  "Shariyat-Compliant Investment Options": "shariah",
};

export const PRODUCT_TYPE_INTENT: Record<string, string> = {
  "Mini stock portfolios (Professionally managed)": "mini-stock-portfolio",
  PMS: "pms",
  AIF: "aif",
  "Mutual Funds": "mutual-funds-sip",
};

export const PRODUCT_REVIEW_INTENT: Record<string, string> = {
  "Mini stock portfolios (Professionally managed)": "mini-stock-portfolio-review",
  PMS: "pms-review",
};
