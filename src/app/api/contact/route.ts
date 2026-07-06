import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "../../lib/submitContactForm";

interface ContactRequestBody {
  name?: string;
  email?: string;
  message?: string;
  source?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  const source = body.source?.trim() || "website";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
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
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

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
      from: smtpFrom,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `GELD Contact Form: ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Source: ${source}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Source:</strong> ${escapeHtml(source)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
