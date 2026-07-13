const SUPPORT_EMAIL = "Support@geldwealth.com";

export function buildMailtoHref(subject: string, body: string): string {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildGmailComposeUrl(subject: string, body: string): string {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: SUPPORT_EMAIL,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Opens the system mail client. If nothing handles mailto (common on Windows
 * without a default app), falls back to Gmail compose in a new tab.
 */
export function openSupportEmail(subject: string, body: string): void {
  if (typeof window === "undefined") return;

  const mailtoHref = buildMailtoHref(subject, body);
  const gmailUrl = buildGmailComposeUrl(subject, body);

  const startedAt = Date.now();
  window.location.href = mailtoHref;

  window.setTimeout(() => {
    // If the mail app opened, the browser typically loses focus.
    // If we still have focus, mailto likely did nothing — open Gmail instead.
    if (document.hasFocus() && Date.now() - startedAt < 2500) {
      window.open(gmailUrl, "_blank", "noopener,noreferrer");
    }
  }, 900);
}
