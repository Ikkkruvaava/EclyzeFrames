
# AIC Amal Web Platform

>A modern, feature-rich web application for AIC Amal, built with Next.js, React, Tailwind CSS, and a robust backend. Includes advanced notification systems, real-time admin dashboards, and seamless mobile app integration.

---

## 🚀 Overview

This project powers the AIC Amal web platform, providing:
- **Donation management**
- **Campaigns and sponsorships**
- **Admin dashboard with real-time notifications**
- **Mobile app-ready push notification system**
- **Modern, responsive UI**

---

## 💸 Donation Types Supported

The platform supports a wide range of donation and support options:

- **General Donation**: One-time contributions to the organization.
- **Subscription Donations**: Recurring support, either:
	- **Auto**: Automated monthly/periodic payments
	- **Manual**: User-initiated recurring payments
- **Sponsorships**: Sponsor a child, student, or specific cause.
- **Seasonal Fund Raising Campaigns**: Special drives for Ramadan, Eid, school reopening, etc.
- **Donation Box Payments**: Digital payment system for physical donation boxes placed at various locations.
- **Support Causes**:
	- **Yatheem (Orphan) Support**
	- **Hafiz (Quran Memorization) Support**
	- **Construction Projects**
- **Support Institutions**: Donate to support schools, madrasas, or other affiliated institutions.
- **Other Custom Causes**: Flexible support for new or urgent needs.

All donation types are accessible via the web platform and integrated with the admin dashboard, reporting, and notification systems.

---

## ✨ Key Features

- **Enhanced Notification System**: Send push notifications with images, custom buttons, and deep links (in-app or external URLs). Fully compatible with the mobile app.
- **Dynamic Notification Dropdown**: Real-time activity feed for admins, with auto-refresh, badges, and priority indicators.
- **Donation & Campaign Management**: Support for donations, campaigns, sponsorships, and volunteer registrations.
- **Comprehensive Admin Tools**: Manage users, view analytics, and monitor activities with a modern UI.
- **Mobile App Integration**: Notification payloads and APIs designed for seamless mobile experience.
- **Modern UI/UX**: Built with Tailwind CSS, Headless UI, and custom components for a professional look and feel.
- **Testing & Documentation**: Includes test scripts and interactive HTML pages for notification features.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Headless UI, Framer Motion
- **Backend/API**: Next.js API routes, Mongoose, Supabase, Firebase, Nodemailer, Razorpay
- **Notifications**: Expo Push, Twilio, Real-time activity feed
- **Charts & Maps**: ApexCharts, Chart.js, React Leaflet, JSVectormap
- **Testing**: Node.js scripts, HTML test pages

---

## 📦 Major Dependencies

See `package.json` for the full list. Highlights:
- next, react, mongoose, tailwindcss, apexcharts, firebase, nodemailer, razorpay, expo-server-sdk, twilio, zustand, zod, and more.

---

## 📋 Implementation Highlights

### Enhanced Notification System
- **Custom button configuration** (text/link, in-app/external)
- **Image support** in notifications
- **Automatic push token mapping** (all users, subscribers, box holders)
- **Comprehensive test scripts** (`test-enhanced-notifications.js`)
- **Interactive test page** (`public/test-notifications-enhanced.html`)
- **Full documentation** (`ENHANCED_NOTIFICATION_DOCS.md`)

### Dynamic Notification Dropdown
- **Real-time activities**: Donations, notifications, box/volunteer registrations
- **Auto-refresh** every 2 minutes
- **Priority indicators** and color-coded icons
- **Modern modal UI** with fixed footer, responsive design, and dark mode

---

## 🖥️ UI & UX Enhancements

- **Modern modal and dropdowns**
- **Card-style activity items**
- **Custom scrollbars, line clamping, and responsive layouts**
- **Loading, error, and empty states**
- **Dark mode support**

---

## 🚦 Getting Started

1. **Install dependencies:**
	```bash
	npm install
	# or
	yarn install
	```
2. **Run the development server:**
	```bash
	npm run dev
	# or
	yarn dev
	```
3. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧑‍💻 Usage

- **Admin Panel:** `/admin` for dashboard, `/admin/notifications/send-notifications` for sending push notifications
- **Test Notifications:** Use `test-enhanced-notifications.js` or open `/test-notifications-enhanced.html` in your browser
- **API:** See `ENHANCED_NOTIFICATION_DOCS.md` for API usage and payload examples

---

## 🤝 Contributing

1. Fork the repo and create a new branch
2. Make your changes with clear commit messages
3. Submit a pull request

---

## 📄 License

This project is private and not licensed for public use.

---

## 🙏 Acknowledgements

- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and many open-source libraries.

---

## 📢 Contact & Support

For issues or questions, check the documentation files or contact the project maintainer hello@aicamal.app.
