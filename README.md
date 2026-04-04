# 🌿 Aranyani — Ecosystem Collapse Early Warning System

> *From Rigveda 10.146 — Aranyani, the unseen guardian of forests.*

## What Is Aranyani?

Aranyani is an AI system that detects early warning signals of 
ecosystem degradation in Indian forest zones by combining 4 years 
of NASA satellite data with traditional ecological indicators from 
Vrikshayurveda — the 2000-year-old Indian science of plant life.

Most systems show you a forest is degrading after it is already 
visible on the ground. Aranyani detects the signal earlier — in 
the data — before it becomes obvious.

---

## The Problem

Forest degradation in India is monitored reactively. Rangers report 
what they see on the ground. By the time a report is filed, 
significant damage has already occurred. There is no system that:

- Monitors all major Indian forest zones continuously
- Combines satellite signals with traditional ecological knowledge
- Gives forest authorities an early warning score they can act on

---

## What Aranyani Does

Aranyani monitors 3 major Indian forest zones and produces a 
collapse risk score from 0 to 100 for each zone based on:

- Vegetation health trends from satellite data (2020-2024)
- Anomaly detection against each zone's own seasonal baseline
- Fire hotspot data from NASA FIRMS
- Community-reported IKS ecological signals

| Zone | Region | IKS Knowledge System |
|---|---|---|
| Western Ghats | Kerala-Karnataka border | Kerala sacred groves — Kavus |
| Central India | Madhya Pradesh | Gond tribal forest knowledge |
| Northeast | Assam-Meghalaya | Khasi sacred forests — Law Kyntang |

---

## Current Risk Status

| Zone | Latest NDVI | Risk Score | Level |
|---|---|---|---|
| Western Ghats | 0.359 | 29.7/100 | MODERATE |
| Central India | 0.354 | 53.3/100 | HIGH |
| Northeast | 0.413 | 40.9/100 | MODERATE |

---

## How It Works

### Step 1 — Satellite Data
Fetches Sentinel-2 imagery via Microsoft Planetary Computer.
Calculates NDVI (vegetation health index) per zone per month
across 2020 to 2024.

### Step 2 — Anomaly Detection
Isolation Forest learns what is seasonally normal for each zone.
It flags readings that are abnormally low compared to that
zone's own 4-year baseline — not a global threshold.

### Step 3 — IKS Signal Integration
Community members submit ecological observations using traditional
Vrikshayurveda indicators:
- Unusual animal movement near forests
- River or stream color changes
- Plants flowering out of season
- Streams drying earlier than usual
- Unusual bird departure patterns

These signals, documented 2000 years ago, are now validated by
modern ecology. We digitize them as structured inputs.

### Step 4 — Risk Scoring
Combines anomaly scores, NDVI deviation, fire hotspot count,
and IKS signals into a single 0-100 risk score per zone.
Zones above 50 trigger alerts to forest authorities.

---

## What Makes This Different

Most forest monitoring tools use satellite data alone.
Aranyani is built on the idea that communities living near
forests have been observing ecological distress signals for
generations — and that this knowledge, formalized in
Vrikshayurveda, has scientific validity.

We combine both. That combination — satellite AI and traditional
Indian ecological knowledge — is what makes Aranyani distinct.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Satellite Data | Sentinel-2 via Microsoft Planetary Computer |
| Fire Data | NASA FIRMS VIIRS API |
| Anomaly Detection | Isolation Forest (scikit-learn) |
| Risk Scoring | XGBoost + weighted formula |
| Backend API | FastAPI (Python) |
| Frontend | React + Leaflet.js + Recharts |
| IKS Processing | Rule-based keyword extraction |

---

## Project Structure
aranyani/

├── ml/

│   └── Aranyani.ipynb

├── backend/

│   ├── main.py

│   ├── iks_extractor.py

│   ├── western_ghats_risk_scores.csv

│   ├── central_india_risk_scores.csv

│   └── northeast_risk_scores.csv
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── Map.jsx
│       └── Dashboard.jsx
└── README.md

---

## How To Run

### Backend
```bash
cd backend
pip install fastapi uvicorn pandas
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## Data Sources

| Source | What It Provides |
|---|---|
| Microsoft Planetary Computer | Sentinel-2 satellite imagery |
| NASA FIRMS | Fire hotspot data |
| ISRO Bhuvan | India land cover classification |
| Global Forest Watch | Forest cover ground truth |
| Vrikshayurveda (SSRN 2024) | IKS ecological indicators |

---

## IKS Foundation

Aranyani is named after the forest deity in Rigveda 10.146 —
described as the unseen presence that senses the forest's
condition before humans notice anything.

The ecological indicators in our community reporting system come
from Vrikshayurveda — documented 2000 years ago and now being
validated by peer-reviewed ecology research. We treat this
knowledge as a legitimate data source, not decoration.

---

## Limitations and Next Steps

This is a prototype built on 4 years of historical satellite data
with a small number of data points per zone. The risk scores
reflect current degradation signals, not guaranteed future
outcomes.

Next steps:
- Partner with Forest Survey of India for verified ground truth data
- Expand to more forest zones across India
- Build mobile reporting app for community IKS submissions
- Train on larger labeled dataset for improved accuracy

---

## Built For

Srishti Hackathon — Domain: Tech for Sustainable Impact
AI + Indian Knowledge Systems

---

## Acknowledgements

NASA FIRMS, ESA Sentinel-2, Microsoft Planetary Computer,
ISRO NRSC Bhuvan, Vrikshayurveda research community
