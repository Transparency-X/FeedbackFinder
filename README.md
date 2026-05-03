# 🎤🔍 FeedbackFinder PWA

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange.svg)](#)

<div align="center">
  <i>A modern Progressive Web App for detecting, mapping, and resolving audio feedback in real-time.</i>
</div>

---

**FeedbackFinder** is a Progressive Web App (PWA) designed to help sound engineers, musicians, and venue managers instantly identify and eliminate feedback issues in live sound systems. Built entirely with modern web technologies (Web Audio API & AudioWorklet), it transforms your Android device or laptop into a professional, offline-capable acoustic diagnostic tool.

🔗 **[Live Demo](#)** *(Replace with your Netlify/GitHub Pages link)*  
📥 **[Install the PWA](#1-install-as-a-pwa-for-users)**  

---

## 📑 Table of Contents
- [📌 Overview](#-overview)
- [✨ Features](#-features)
-[🛠️ Setup & Installation](#️-setup--installation)
- [🎯 Usage Guide](#-usage-guide)
- [🚀 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## 📌 Overview

Acoustic feedback—the screeching or howling noise caused when a microphone picks up sound from a speaker and re-amplifies it—is the bane of live audio. 

**FeedbackFinder solves this by allowing you to:**
1. **Detect** exact feedback frequencies in real-time using your device's built-in microphone.
2. **Test** audio systems proactively using automated sine wave sweeps.
3. **Map** problem areas in a venue using GPS coordinates or manual location tags.
4. **Analyze** data post-event by exporting detailed JSON reports of your session.

Because it is built as a PWA, FeedbackFinder operates entirely **offline** once installed, making it perfect for basements, remote venues, and thick-walled theaters where cell service drops out.

---

## ✨ Features

*   🔴 **Real-Time Detection:** Utilizes `AudioWorklet` for ultra-low-latency frequency analysis to instantly pinpoint howling feedback.
*   📊 **Live Spectrogram:** A dynamic visual interface showing the audio spectrum, highlighting problematic spikes in red.
*   🔊 **Automated Sound Tests:** Generate precision sine waves and frequency sweeps (e.g., 20 Hz to 20 kHz) to stress-test your PA system.
*   🗺️ **Hotspot Mapping:** Tag feedback locations on an interactive map (powered by Leaflet.js) using device GPS or manual text entry (e.g., "Stage Left Monitor").
*   📴 **100% Offline Capability:** Works completely without an internet connection after the initial installation.
*   💾 **Exportable Data:** Download session logs as JSON files for post-gig analysis or sharing with your audio engineering team.
*   🎛️ **Custom Sensitivity:** Adjustable threshold sliders ensure the app works accurately in both whisper-quiet rooms and loud rock concerts.

---

## 🛠️ Setup & Installation

FeedbackFinder can be used natively as an app on your phone, or run locally for development. 

### 1. Install as a PWA (For End-Users)
No app store required! To install FeedbackFinder on your Android device:
1. Navigate to the **[Live Demo URL](#)** in Google Chrome on your Android device.
2. Tap the **three-dot menu** in the top right corner of the browser.
3. Select **"Add to Home Screen"** (or "Install App").
4. Launch the app directly from your home screen.
5. *Note: You must grant **Microphone** and **Location** permissions on the first launch.*

### 2. Run Locally (For Developers)
To modify the code or run it locally on your machine:

**Prerequisites:** You need [Node.js](https://nodejs.org/) installed to run a local server.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/feedback-finder-pwa.git

# 2. Navigate into the directory
cd feedback-finder-pwa

# 3. Install a simple local server (if you don't have one)
npm install -g http-server

# 4. Serve the application
http-server -p 8080
```
Open `http://localhost:8080` in your browser. 
*(Note: Browsers require HTTPS or `localhost` to allow microphone access via the Web Audio API).*

---

## 🎯 Usage Guide

### 🎤 Live Monitoring
1. Open the app and tap **"Start Live Monitoring"**.
2. Adjust the **Sensitivity Threshold** slider to match your room's ambient volume.
3. Walk the venue with your microphone. The app will automatically log frequencies that breach the feedback threshold.

### 🧪 System Testing
1. Navigate to the **Test Mode** tab.
2. Select **Frequency Sweep** and set your range (e.g., `20 Hz` to `20,000 Hz`).
3. Send your device's audio output into your mixing console, and tap **Run Sweep** to see which room resonances trigger feedback.

### 📍 Mapping Hotspots
1. When feedback is detected, go to the **Map** tab.
2. Tap **Get Current Location** (outdoors/GPS) or **Add Manual Tag** (indoors, e.g., "FOH Booth").
3. View your venue's feedback hotspots overlaid on the map.

---

## 🚀 Roadmap

We are constantly improving FeedbackFinder. Here is our development roadmap:

| Version | Feature / Goal | Status | Target ETA |
| :--- | :--- | :---: | :--- |
| **v1.0** | Core PWA: Real-time detection, Mapping, JSON Export | ✅ Live | *Current* |
| **v1.1** | **Preset Profiles:** Save/load threshold and EQ profiles for different venues. | 🚧 In Dev | Q3 2026 |
| **v1.2** | **Multi-Device Sync:** Sync live data across multiple phones via WebSockets for arena setups. | 📋 Planned | Q4 2026 |
| **v1.3** | **Machine Learning Filter:** Use TensorFlow.js to ignore loud non-feedback sounds (cymbals, cheering). | 📋 Planned | Q1 2027 |
| **v1.4** | **Cloud Sync:** Optional Firebase integration to backup venue maps to the cloud. | 📋 Planned | Q2 2027 |
| **v2.0** | **AR Integration:** Overlay feedback hotspots in the room using your device's camera (WebXR). | 🌟 Future | 2028 |

---

## 🤝 Contributing

We love contributions from the audio and dev community! If you'd like to help improve FeedbackFinder:

1. **Fork** the repository.
2. **Create a branch** for your feature: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**.

Please ensure your code follows standard ES6 conventions and that you've tested it on Chrome for Android.

---

## 📜 License

This project is distributed under the **MIT License**. See the `LICENSE` file for more details.
