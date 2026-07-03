# Go Business — Referral Dashboard Application

A secure, responsive, and high-fidelity referral management system designed for **Go Business** to help users track referral registrations, summaries, and earnings metrics in a clean, modern user interface.

This application is built with **React**, **React Router DOM**, **js-cookie** for session handling, and **Vanilla CSS** for premium styling, animations, and layouts.

---

## 🚀 Key Features

*   **Secure Authentication**: Log in using a mock sign-in endpoint. Upon validation, the JSON Web Token is securely saved as a cookie named `jwt_token`.
*   **Protected Routing**: Automatically intercepts unauthenticated entry attempts to `/` and `/referral/:id` and redirects them to `/login`. If logged in, users cannot access the `/login` route.
*   **Overview & Metrics HUD**: Pulls real-time statistics (e.g. Your Referrals, Active Referrals, Total Referral Earnings) from the base referrals API.
*   **Interactive Data Grid**:
    *   **Live Search**: Filters referrals dynamically by Name or Service.
    *   **Date Sorting**: Toggle results between "Newest first" and "Oldest first".
    *   **Client-Side Pagination**: Slices rows into pages of exactly 10 entries with custom page numbers.
*   **Deep-Linkable Detail Page**: Selecting any row navigates the user to `/referral/:id`, which fetches record data based on query ID and maps fields (Referral ID, Service Name, Date, Profit) to an accessible definition list.
*   **Clipboard Copying**: Integrated copy buttons to quickly share referral links and code.
*   **Clean Light-Mode Theme**: Premium minimalist aesthetic using Google Fonts (Outfit, Inter), drop-shadow elevation levels, glassmorphic headers, and micro-transitions on hover.

---

## 🛠️ Tech Stack & Dependencies

*   **Core framework**: React (bootstrapped with Vite)
*   **Routing**: React Router DOM (v6)
*   **Cookies**: js-cookie (for secure token storage)
*   **Icons**: Lucide React
*   **Styles**: Vanilla CSS (modular CSS variables, grid, flexbox, and HSL palettes)

---

## 📦 Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18.x or higher) installed on your system.

### 2. Installation
Clone this repository and install the dependencies:
```bash
npm install
```

### 3. Running Locally
Launch the local development server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 4. Building for Production
To build and optimize the project for deployment (e.g., Vercel, Netlify):
```bash
npm run build
```

---

## 💡 Architectural Notes

*   **Robust API Parsing**: The data parser is designed to handle payload structures where list values (`referrals`, `metrics`, `serviceSummary`) sit either nested inside a `data` parameter or alongside it at the root object level, making it highly resilient to backend model modifications.
*   **Accessible Markup**: Employs landmark elements (`<nav>`, `<main>`, `<footer>`), explicit aria-labels, definition lists (`<dl>`), and semantic headers to ensure compatibility with screen readers.
*   **Cookie Authentication**: Uses state checking coupled with `Cookies.get('jwt_token')` to render components or trigger fallback navigations.

---

## 🔑 Test Credentials
Use the following credentials on the login screen to access the protected dashboard:
*   **Email**: `admin@example.com`
*   **Password**: `admin123`
