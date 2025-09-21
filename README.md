# Payanaa

Payanaa is a React + Vite project with Firebase authentication, TailwindCSS styling, and i18n-based multilingual support. It provides a seamless experience for users with multiple language options and a clean, modern UI.

## 🚀 Features

* **React + Vite** – Fast development environment with HMR support
* **Firebase Authentication** – User registration, login, and authentication context
* **TailwindCSS** – Utility-first styling for a modern and responsive UI
* **i18n Support** – Multi-language support (English, Hindi, Kannada, Malayalam, Español)
* **React Router** – Smooth client-side navigation
* **Protected Routes** – Secure pages for authenticated users only

## 📂 Project Structure

```
📦 payanaa
 ┣ 📂 src
 ┃ ┣ 📂 pages       # App pages (Home, Login, Dashboard, etc.)
 ┃ ┣ 📂 contexts    # Authentication context
 ┃ ┣ 📂 components  # Reusable UI components
 ┃ ┣ 📜 App.jsx     # Main app file
 ┃ ┗ 📜 main.jsx    # Entry point
 ┣ 📜 index.css     # Tailwind base styles
 ┣ 📜 vite.config.js
 ┣ 📜 package.json
 ┗ 📜 README.md
```

## 🛠️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Bhuvijkottari/payanaa.git
   cd payanaa
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**

   ```bash
   npm run preview
   ```

## 🌐 Deployment

* Works seamlessly with **Vercel** or **Netlify**.
* Ensure you have a `build` script defined in `package.json`:

  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
  ```

## 🧑‍💻 Tech Stack

* **Frontend:** React, Vite, TailwindCSS
* **Auth:** Firebase Authentication
* **Routing:** React Router DOM
* **Internationalization:** react-i18next

---

💡 **Contributions are welcome!** Feel free to open issues or submit PRs.
