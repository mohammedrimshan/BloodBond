import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export class TelegramService {
  private enabled: boolean;

  constructor() {
    this.enabled = !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);
    if (this.enabled) {
      console.log(`📱 Telegram Bot Service initialized (Chat ID: ${TELEGRAM_CHAT_ID})`);
    } else {
      console.warn("⚠️ Telegram Bot not configured (missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID)");
    }
  }

  async sendBloodRequestAlert(data: {
    patientName: string;
    bloodGroup: string;
    hospitalName: string;
    requesterName?: string;
    requesterPhone?: string;
    requestId?: string;
  }): Promise<void> {
    if (!this.enabled) return;

    const message = [
      `🚨 *NEW BLOOD REQUEST*`,
      ``,
      `👤 *Patient:* ${this.escape(data.patientName)}`,
      `🩸 *Blood Group:* ${this.escape(data.bloodGroup)}`,
      `🏥 *Hospital:* ${this.escape(data.hospitalName)}`,
      data.requesterName ? `📋 *Requested By:* ${this.escape(data.requesterName)}` : null,
      data.requesterPhone ? `📞 *Contact:* ${this.escape(data.requesterPhone)}` : null,
      ``,
      `⚡ _Action required — verify and approve in admin panel_`,
    ]
      .filter(Boolean)
      .join("\n");

    await this.sendMessage(message);
  }

  async sendDonationAlert(data: {
    donorName: string;
    bloodGroup: string;
  }): Promise<void> {
    if (!this.enabled) return;

    const message = [
      `🎉 *DONATION COMPLETED*`,
      ``,
      `👤 *Donor:* ${this.escape(data.donorName)}`,
      `🩸 *Blood Group:* ${this.escape(data.bloodGroup)}`,
      ``,
      `✅ _A life has been saved\\!_`,
    ].join("\n");

    await this.sendMessage(message);
  }

  private async sendMessage(text: string): Promise<void> {
    try {
      const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "MarkdownV2",
        }),
      });

      const result = await response.json();
      if (result.ok) {
        console.log("📱 [Telegram] Alert sent successfully");
      } else {
        console.error("📱 [Telegram] Failed to send:", result.description);
      }
    } catch (error: any) {
      console.error("📱 [Telegram] Error:", error.message);
    }
  }

  // Escape special chars for MarkdownV2
  private escape(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
  }
}
