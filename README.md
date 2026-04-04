# 🌿 Aranyani — Predictive Ecosystem Collapse Warning System

> *From Rigveda 10.146 — Aranyani, the unseen guardian of forests who senses danger before humans do.*

## What Is Aranyani?

Aranyani is an AI-powered system that predicts ecosystem collapse in Indian forest zones **6 to 18 months before it becomes visible** — by combining NASA satellite data with 2000-year-old Indian ecological wisdom from Vrikshayurveda.

India loses thousands of hectares of forest every year silently. By the time a ranger reaches the ground, the damage is done. Existing systems tell you a forest is dying after you can already see it. Aranyani tells you before.

---

## The Problem

- India has no predictive system for ecosystem collapse
- Manual monitoring is slow, sparse, and reactive
- Traditional ecological knowledge from Vrikshayurveda is undocumented digitally
- No system combines satellite AI with Indian Knowledge Systems

---

## Our Solution

Aranyani monitors 3 major Indian forest zones in real time:

| Zone | Region | IKS Knowledge System |
|---|---|---|
| Western Ghats | Kerala-Karnataka border | Kerala sacred groves — Kavus |
| Central India | Madhya Pradesh forests | Gond tribal forest knowledge |
| Northeast | Assam-Meghalaya | Khasi sacred forests — Law Kyntang |

---

## How It Works

### 1. Satellite Data Pipeline
- Fetches 4 years of Sentinel-2 satellite imagery via Microsoft Planetary Computer
- Calculates NDVI (Normalized Difference Vegetation Index) per zone per month
- Tracks vegetation health from 2020 to 2024

### 2. Anomaly Detection
- Isolation Forest algorithm detects abnormal NDVI patterns
- Learns what is normal for each zone's own seasonal baseline
- Flags readings that deviate from 4 years of historical patterns

### 3. IKS Integration
- Digitizes ecological distress indicators from Vrikshayurveda (2000 year old Indian plant science)
- Community members submit reports using traditional indicators:
  - Unusual animal migration
  - River color changes
  - Plants flowering out of season
  - Streams drying up unexpectedly
  - Unusual bird behavior

### 4. Risk Scoring
- Combines NDVI anomalies + fire hotspots (NASA FIRMS) + IKS community signals
- Produces a Collapse Risk Score from 0 to 100 per zone
- Classifies zones as LOW / MODERATE / HIGH / CRITICAL

### 5. Alert System
- Real-time risk dashboard with interactive India map
- Automatic alerts to forest authorities for HIGH and CRITICAL zones
- Community reporting interface for IKS signal submission

---

## Current Risk Status

| Zone | Latest NDVI | Risk Score | Risk Level |
|---|---|---|---|
| Western Ghats | 0.359 | 29.7/100 | MODERATE |
| Central India | 0.354 | 53.3/100 | HIGH |
| Northeast | 0.413 | 40.9/100 | MODERATE |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Satellite Data | Sentinel-2 via Microsoft Planetary Computer |
| Fire Data | NASA FIRMS VIIRS API |
| ML — Anomaly Detection | Isolation Forest (scikit-learn) |
| ML — Risk Scoring | XGBoost + weighted formula |
| Backend API | FastAPI (Python) |
| Frontend | React + Leaflet.js + Recharts |
| IKS Processing | Rule-based keyword extraction |
| Version Control | GitHub |

---

## Project Structure
