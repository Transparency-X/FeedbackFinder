# FeedbackFinder PWA 🎤🔍

![FeedbackFinder Logo](https://via.placeholder.com/150/2196F3/FFFFFF?text=FeedbackFinder) *(Replace with your logo)*

**FeedbackFinder** is a **Progressive Web App (PWA)** designed to detect, analyze, and map audio feedback in real-time using the **Web Audio API** and **AudioWorklet**. It works on **Android devices** (e.g., Samsung S24+) and helps sound engineers, musicians, audiologists, and venue managers identify and eliminate feedback issues in live sound systems, hearing aids, PA systems, and more.

🔗 **[Live Demo](#)** *(Add your demo link here)*
📥 **[Download PWA](#)** *(Add installation instructions below)*

---

---

## **📌 Overview**
Feedback is a common issue in audio systems, where sound from a speaker is picked up by a microphone, re-amplified, and sent back through the speaker, creating a **screeching or howling noise**. FeedbackFinder helps you:
- **Detect feedback frequencies** in real-time using your device’s microphone.
- **Run automated tests** (e.g., frequency sweeps) to proactively identify feedback-prone frequencies.
- **Map feedback hotspots** in a venue using GPS or manual location tagging.
- **Export results** for further analysis or sharing with your team.

Built with **modern web technologies** (Web Audio API, AudioWorklet, PWA), FeedbackFinder works **offline** and can be installed directly on your Android device.

---

---

## **✨ Features**
| Feature                     | Description                                                                                     |
|-----------------------------|-------------------------------------------------------------------------------------------------|
| **Real-Time Feedback Detection** | Uses `AudioWorklet` and `AnalyserNode` to detect feedback frequencies in live audio input.   |
| **Spectrogram Visualization** | Visualize audio frequencies in real-time, with feedback frequencies highlighted.         |
| **Automated Sound Tests**   | Generate **sine waves** or **frequency sweeps** to test for feedback in your audio system.     |
| **Location Mapping**        | Tag feedback hotspots with **GPS coordinates** or manual labels (e.g., "Stage Left").       |
| **Offline Support**         | Works **without an internet connection** after the first load (PWA).                        |
| **Exportable Results**      | Save feedback data, test results, and locations as **JSON** for further analysis.            |
| **Customizable Thresholds** | Adjust the **sensitivity** of feedback detection to suit your environment.                 |
| **PWA Installation**        | Install directly on your **Android home screen** for app-like access.                        |
| **Multi-Device Ready**      | Works on any **modern browser** (Chrome, Firefox, Edge) with Web Audio API support.           |

---

---

## **🛠️ Setup & Installation**
### **Option 1: Install as a PWA (Recommended)**
1. **Host the Files**:
   - Upload the project files to a **web server** (e.g., [Netlify Drop](https://app.netlify.com/drop), [GitHub Pages](https://pages.github.com/), or a local server like [`http-server`](https://www.npmjs.com/package/http-server)).
   - Example with `http-server`:
     ```bash
     npm install -g http-server
     http-server
     ```
     Open `http://localhost:8080` in your browser.

2. **Open in Chrome on Android**:
   - Navigate to the hosted URL on your **Android device** (e.g., Samsung S24+).
   - Tap the **three-dot menu** in Chrome and select **"Add to Home Screen"**.
   - The app will install as a **standalone PWA** (no browser chrome).

3. **Grant Permissions**:
   - Allow **microphone access** (for live monitoring and tests).
   - Allow **location access** (for GPS-based location tagging).

---

### **Option 2: Run Locally for Development**
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/your-username/feedback-finder-pwa.git
   cd feedback-finder-pwa
