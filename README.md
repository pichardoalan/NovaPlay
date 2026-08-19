# 🎬 NovaPlay Desktop

A modern, cross-platform desktop application designed for cinematic tracking, cataloging, and media playback. Built with a focus on performance, deep analytics, and a seamless native desktop experience.

---

## 🚀 Tech Stack

* **Core Framework:** [Electron](https://www.electronjs.org/)
* **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)

---

## ✨ Key Features

* 🔍 **Media Search & Discovery:** Fast metadata retrieval for movies and TV series using the TMDb API.
* 📊 **NovaStats (Deep Analytics):** A comprehensive dashboard that analyzes viewing habits, calculates total watch time, and determines top actors, directors, and favorite genres.
* 🖥️ **Desktop Native UI:** Frameless, modern interface optimized for desktop environments with custom window controls and fullscreen capabilities.
* 📌 **Personalized Catalog:** Add titles to your Watchlist, track recent views, and rate media with a built-in star rating system.
* ⚡ **Optimized Performance:** Fast rendering built on Vite and Electron IPC architecture with concurrent API requests for data processing.

---

## 🛠️ Local Setup & Installation

To run this application in your local development environment, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and Git installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/pichardoalan/novaplay-desktop.git](https://github.com/pichardoalan/novaplay-desktop.git)
   ```

2. **Navigate into the project directory:**
   ```bash
   cd novaplay-desktop
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Environment Variables Setup:**
   Create a `.env.local` file in the root directory (at the same level as `package.json`) and add your API keys based on the provided `.env.example` file:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_STREAM_BASE_URL=your_media_server_url_here
   ```

5. **Run in development mode:**
   ```bash
   npm run dev
   ```

### Building for Production
To package the application into a standalone executable for your operating system:
```bash
npm run dist
```

---

## 📄 License
This project is for educational and portfolio demonstration purposes.