import type { Request, Response } from "express";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handleContactForm = async (req: Request, res: Response) => {
  const { message, email, type, token } = req.body;

  if (!message || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
      { method: "POST" },
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.success || verifyData.score < 0.5) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    const formatted = `
New ${type === "collab" ? "collaboration request" : "message"} from The Not Project:

${message}

---
Email: ${email?.trim() ? email : "not provided"}
    `.trim();

    await resend.emails.send({
      from: "The Not Project <contact@thenotproject.com>",
      to: [
        "lorenzo@thenotproject.com",
        "elghayate02@gmail.com",
        "sebastian.torres.codes@gmail.com",
      ],
      subject:
        type === "collab"
          ? "New Collaboration Request"
          : "New Message from The Not Project",
      text: formatted,
    });

    if (email?.trim()) {
      await resend.emails.send({
        from: "The Not Project <contact@thenotproject.com>",
        to: [email.trim()],
        subject:
          type === "collab"
            ? "Thanks for reaching out to collaborate"
            : "Thanks for your message",
        text:
          type === "collab"
            ? "Thanks for reaching out to collaborate! We'll read your message and get back to you soon."
            : "Hey! We got your message. If needed, we’ll get back to you soon.",
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
