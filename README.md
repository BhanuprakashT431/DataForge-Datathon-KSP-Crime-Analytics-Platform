# 🛡️ Karnataka State Police (KSP) - AI Crime Analytics Platform

An enterprise-grade, offline-first tactical intelligence and predictive policing platform designed for the **Karnataka State Police** and the **State Crime Records Bureau (SCRB)**.

This platform transforms multi-precinct incident records into real-time tactical intelligence using geospatial clustering, graph link analysis, risk forecasting, and automated recidivism tracking.

## 🌟 Key Capabilities

### 🏢 Enterprise Command Center
A unified strategic dashboard providing high-level KPIs across all 31 districts of Karnataka. Displays active FIRs, emerging crime hotspots, live situation room feeds, and AI-driven executive summaries.

### 🗺️ Offline Tactical GIS Mapping
A fully offline geospatial intelligence system mapped explicitly to the Karnataka administrative hierarchy (State ➔ District ➔ Taluk ➔ Police Station). Features hotspot visualization, crime clustering, and localized risk scoring without relying on external internet APIs.

### 🧠 Predictive AI Intelligence (KSP AI Engine)
An embedded AI copilot that forecasts crime trends, evaluates risk probabilities, and offers tactical deployment recommendations. Features an intent-based local fallback engine to ensure 100% operational readiness even when central cloud networks are unreachable.

### 🕸️ Criminal Network Graphing
Advanced degree-centrality and community detection mapping. Identifies inter-suspect connections, syndicate hierarchies, and key orchestrator nodes to disrupt organized crime.

### 📄 Enterprise PDF Reporting
1-click intelligence report generation across all modules. Exports professional, government-styled PDFs containing risk assessments, AI findings, and actionable recommendations.

---

## 🛠️ Technology Stack

* **Frontend:** React 18, TypeScript, Vite, React Router
* **Styling:** Vanilla CSS, CSS Modules (Deep Slate Navy theme)
* **Icons & UI:** Lucide React, Custom SVG Assets (KSP Badge)
* **PDF Generation:** jsPDF, jspdf-autotable
* **Backend / Data:** Standalone Python Mock Generator (`backend/data/enterprise_mock_generator.py`)
* **AI:** Local intent-based fallback engine + Google Gemini API (when online)

---

## 🚀 Setup & Installation (Hackathon / Demo Mode)

This platform is designed to be demonstrated locally with a bundled synthetic enterprise dataset.

### 1. Clone the repository
```bash
git clone https://github.com/BhanuprakashT431/DataForge-Datathon-KSP-Crime-Analytics-Platform.git
cd DataForge-Datathon-KSP-Crime-Analytics-Platform
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. (Optional) Generate the Enterprise Dataset
The massive offline synthetic KSP dataset (10,000+ records) is already bundled. If you need to regenerate it:
```bash
cd backend
python data/enterprise_mock_generator.py
```
*(Requires Python 3.9+)*

---

## 🔐 Data Sovereignty & Offline Compliance

This platform was built adhering to strict operational constraints:
* **Zero External Data Leaks:** All GeoJSON assets (Karnataka districts/taluks) are bundled locally.
* **Offline AI Fallback:** The copilot defaults to a local intelligence heuristic engine if the external network is severed.
* **Presentation Ready:** The UI includes built-in Light/Dark mode toggles and scales perfectly for large command-center displays.

---
*Designed for DataForge Datathon 2026 • Official Intelligence System Mockup*
