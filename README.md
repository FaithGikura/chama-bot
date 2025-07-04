# Chama Payment Reminder Bot

A WhatsApp-based bot to help Chamas (informal savings groups) stay on top of their monthly contributions through smart reminders, real-time tracking, and automated balance updates.

---

## Problem

Chama members often forget to send their monthly contributions, leading to delays, missed goals, and poor group coordination.

---

##  Solution

This bot automates the reminder and tracking process. It sends contribution reminders via WhatsApp, allows members to check their payment status, and provides real-time balance updates — making Chama management seamless and stress-free.

---

## 🧠 Features

- ✅ **Automated Payment Reminders**  
  Members get WhatsApp reminders before contribution due dates.

- 💰 **Contribution Tracking**  
  Members can check if they’ve paid and how much is outstanding.

- 📤 **Auto-Send Balance Updates**  
  Weekly summary of group balances sent to all members.

- 🧑‍💼 **Admin Panel**  
  Treasurer can update payment status, customize messages, and manage members.

- 🌍 **Bilingual Support**  
  Supports English and Swahili for local usability.

---

## 📲 Tech Stack

| Component      | Technology                |
|----------------|---------------------------|
| Messaging      | WhatsApp Cloud API        |
| Backend        | Node.js / Python          |
| Database       | Firebase / Google Sheets  |
| SMS (Optional) | Twilio / Africa’s Talking |
| Hosting        | Render / Heroku / Vercel  |

---

##  Monetization Strategy

- 💼 **Basic Plan**: KES 100/month per Chama
- 📄 **Add-ons**:
  - Monthly PDF reports with savings insights
  - Premium SMS reminders for KES 20/member/month

---

## 🛠️ Installation

> Clone the repo:

```bash
git clone https://github.com/yourusername/chama-payment-bot.git
cd chama-payment-bot
```

> Install dependencies:

```bash
npm install
```

> Add your environment variables in a `.env` file:

```env
WHATSAPP_API_TOKEN=your_token_here
FIREBASE_API_KEY=your_firebase_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

> Start the server:

```bash
npm start
```

---

##  Usage

- Add members to the bot by phone number
- Set contribution amount and due date via admin dashboard
- Sit back as the bot reminds, tracks, and updates everyone 💫

---

##  Acknowledgments

This project was ideated and initially generated using **[Lovable AI](https://www.lovable.so/)** – an AI assistant for building lovable MVPs fast.  
Big thanks to the platform for inspiring the first functional version of this WhatsApp bot.



##  Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork the repo and submit a pull request.

---

## Contact
**Email:** faithnjerigikura@gmail.com  
**Phone:** 0112832837 
** link:** https://chama-sahani-reminders-bot.lovable.app


---
