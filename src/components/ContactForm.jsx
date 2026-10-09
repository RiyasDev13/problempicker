import { useState } from "react";
import { copyText } from "../utils/clipboard.js";

const TELEGRAM_URL = "https://t.me/mohamaduriyas";

export default function ContactForm() {
  const [preparedMessage, setPreparedMessage] = useState("");
  const [status, setStatus] = useState("");

  const prepareMessage = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const issue = String(formData.get("issue") || "").trim();
    const message = [
      "Problem Picker support request",
      name && `Name: ${name}`,
      email && `Email: ${email}`,
      "",
      "Issue:",
      issue,
    ]
      .filter((line) => line !== false)
      .join("\n");

    setPreparedMessage(message);
    setStatus("Your message is ready. Copy it, then open Telegram and send it to @mohamaduriyas.");
  };

  const copyMessage = async () => {
    try {
      await copyText(preparedMessage);
      setStatus("Message copied. Open Telegram and paste it into the chat with @mohamaduriyas.");
    } catch (error) {
      console.error("Could not copy the support message.", error);
      setStatus(
        "Clipboard access is unavailable. Select the message below and copy it before opening Telegram.",
      );
    }
  };

  return (
    <section className="about-section contact-section" aria-labelledby="contact-title">
      <span className="eyebrow">NEED HELP?</span>
      <h2 id="contact-title">Contact us about an issue</h2>
      <p>
        Tell us what went wrong. We’ll prepare a message for you to send to our Telegram account.
        Nothing is submitted or sent from this form.
      </p>
      <form className="contact-form" onSubmit={prepareMessage}>
        <label>
          Name <span>(optional)</span>
          <input name="name" autoComplete="name" maxLength={100} />
        </label>
        <label>
          Email <span>(optional, if you’d like a reply)</span>
          <input name="email" type="email" autoComplete="email" maxLength={254} />
        </label>
        <label>
          What issue did you run into?
          <textarea name="issue" required rows={5} maxLength={2000} />
        </label>
        <button className="solid" type="submit">
          Prepare Telegram message
        </button>
      </form>
      {preparedMessage && (
        <div className="contact-message">
          <label htmlFor="prepared-support-message">Your message</label>
          <textarea
            id="prepared-support-message"
            value={preparedMessage}
            readOnly
            rows={7}
            onFocus={(event) => event.currentTarget.select()}
          />
          <div className="contact-actions">
            <button className="ghost" type="button" onClick={copyMessage}>
              Copy message
            </button>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
              Open Telegram @mohamaduriyas
            </a>
          </div>
          <p className="copy-status" role="status">
            {status}
          </p>
        </div>
      )}
    </section>
  );
}
