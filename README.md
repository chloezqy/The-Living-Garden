# 🌿 The Living Garden – A generative, shared world of AI-grown spirits 🌿

> **Nova Hackathon 2025 — Generative Technology Track**
> Created by **Team Chiikawa**

---

## Overview

**The Living Garden** is an interactive, AI-driven ecosystem where each participant grows a unique **spirit** — a plant, animal, or cloud — born from their personality.

Each user answers a short quiz (e.g. *Moon or Cloud? Land or Sky?*), and AI interprets those answers to generate a **Spirit Profile** (traits, color palette, growth rhythm).
All spirits live together in a **shared garden**, rendered in **p5.js** with breathing, glowing, and idle/sleep states synchronized via **socket.io**.

---

## Features

* 🧬 **AI-generated spirit profiles** via OpenRouter (`gpt-4o-mini`)
* 🌈 **Dynamic visual ecosystem** (plants sway, clouds drift, animals float)
* 💫 **Shared real-time garden** — everyone’s spirits coexist and evolve
* 🌿 **Activity awareness** — idle users’ spirits “sleep”; active users’ spirits glow
* 🎨 **Pre-generated Midjourney assets** for visuals (no live image calls)

---

## Tech Stack

| Layer          | Technology                                               |
| -------------- | -------------------------------------------------------- |
| Frontend       | React + Vite + TypeScript + p5.js                        |
| Real-time Sync | Socket.io                                                |
| AI             | OpenRouter (OpenAI API-compatible)                       |
| Assets         | Midjourney-generated sprites (plants / animals / clouds) |
| Styling        | Tailwind CSS                                             |

---

## ⚙️ Setup & Run

### 1️⃣ Clone

```bash
git clone https://github.com/YOUR_USERNAME/the-living-garden.git
cd the-living-garden
```

### 2️⃣ Install dependencies

```bash
npm install
# or
pnpm install
```

### 3️⃣ Create a `.env.local` file in `/web`

```bash
VITE_OPENROUTER_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
```

### 4️⃣ Run the app

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## 🚨 API Key Notice

For the hackathon demo, this project uses the **OpenAI SDK in the browser**. This is **for local/demo use only.**

---

## 🧑‍💻 Contributors

Chloe Zhu, Monica Wan, Cara Feng, Savannah Cheng