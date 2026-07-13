import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { formatEmailSubject, getContactIntent } from "../../lib/contactContext";
import {
  firstContactError,
  validateContactFields,
} from "../../lib/contactValidation";
import { CONTACT_EMAIL } from "../../lib/submitContactForm";

interface ContactRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: string;
  intent?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: ContactRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() || "";
  const email = body.email?.trim() || "";
  const phone = body.phone?.trim() || "";
  const message = body.message?.trim() || "";
  const source = body.source?.trim() || "website";
  const intent = body.intent?.trim() || "general";
  const intentConfig = getContactIntent(intent);

  const fieldErrors = validateContactFields({ name, email, phone, message });
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: firstContactError(fieldErrors) },
      { status: 400 }
    );
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpHost || !smtpUser || !smtpPassword) {
    console.error("Contact form misconfigured: missing SMTP environment variables.");
    return NextResponse.json(
      { error: "Email service is not configured. Please try again later." },
      { status: 503 }
    );
  }

  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpSecure = process.env.SMTP_SECURE === "true";
  const recipient =
    process.env.CONTACT_EMAIL?.trim() || CONTACT_EMAIL;

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: {
        name,
        address: email,
      },
      to: recipient,
      replyTo: email,
      envelope: {
        from: smtpUser,
        to: recipient,
      },
      subject: formatEmailSubject(intentConfig.emailSubject, name),
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone Number: ${phone}`,
        `Source: ${source}`,
        `Intent: ${intentConfig.formBadge}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone Number:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Source:</strong> ${escapeHtml(source)}</p>
        <p><strong>Intent:</strong> ${escapeHtml(intentConfig.formBadge)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ success: true, intent: intentConfig.id });
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
