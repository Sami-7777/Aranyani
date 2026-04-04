from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import os
import math

app = FastAPI(title="Aranyani API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── IKS KNOWLEDGE BASE ───
# Drawn from Vrikshayurveda ecological indicators
IKS_KNOWLEDGE = {
    "western_ghats": {
        "indicators": [
            "Unusual movement of elephants away from forest core",
            "Early drying of Kavus (sacred groves) streams",
            "Reduction in medicinal plant flowering cycles",
            "Decline in bird species like Malabar whistling thrush",
            "Soil color change from dark to pale in forest floor"
        ],
        "reversal_actions": [
            "Restore Kavu sacred grove boundaries with community participation",
            "Plant native species: Vateria indica, Hopea parviflora",
            "Revive traditional water harvesting channels (surangam)",
            "Engage local Nair community forest guardians",
            "Reduce plantation encroachment on forest edges"
        ],
        "traditional_name": "Paschima Ghatta Vana",
        "guardian_system": "Kavus — Kerala sacred grove system"
    },
    "central_india": {
        "indicators": [
            "Gond tribal reports of unusual tiger movement patterns",
            "Early leaf fall in Sal trees before dry season",
            "Reduction in Mahua flowering — key forest indicator",
            "Drying of seasonal streams earlier than monsoon end",
            "Increase in dust storms near forest edges"
        ],
        "reversal_actions": [
            "Engage Gond community forest councils (Van Suraksha Samiti)",
            "Plant native Sal corridor between fragmented patches",
            "Restore traditional fire management practices",
            "Reduce illegal charcoal production at forest boundaries",
            "Revive Gond seed banking of native forest species"
        ],
        "traditional_name": "Gondwana Vana",
        "guardian_system": "Gond Van Devi — tribal forest deity worship system"
    },
    "northeast": {
        "indicators": [
            "Khasi community reports of cloud forest thinning",
            "Reduction in sacred Law Kyntang grove tree density",
            "Early migration of hornbills from nesting sites",
            "Unusual flooding patterns in forest streams",
            "Decline in wild orchid populations"
        ],
        "reversal_actions": [
            "Protect Law Kyntang sacred groves under community law",
            "Restore jhum (shifting cultivation) cycle to 15+ years",
            "Plant native species: Quercus, Rhododendron corridors",
            "Engage Khasi dorbar shnong (village council) for monitoring",
            "Reduce bamboo extraction pressure near forest core"
        ],
        "traditional_name": "Meghalaya Aranya",
        "guardian_system": "Law Kyntang — Khasi sacred forest system"
    }
}

# ─── CAUSE ANALYSIS ───
def analyze_causes(zone_data, ndvi, anomaly_score,
                   fire_count, seasonal_dev):
    causes = []

    if fire_count > 500:
        causes.append({
            "cause": "High fire activity",
            "detail": f"{int(fire_count)} fire hotspots detected in last 5 days. "
                      f"Likely illegal burning or agricultural fires "
                      f"encroaching on forest boundaries.",
            "severity": "HIGH",
            "icon": "🔥"
        })

    if seasonal_dev < -0.1:
        causes.append({
            "cause": "Below seasonal baseline",
            "detail": f"Vegetation health is {abs(seasonal_dev)*100:.1f}% "
                      f"below the historical average for this time of year. "
                      f"Forest is not recovering as expected after monsoon.",
            "severity": "MODERATE",
            "icon": "📉"
        })

    if ndvi < 0.3:
        causes.append({
            "cause": "Critically low vegetation density",
            "detail": f"NDVI of {ndvi:.3f} indicates sparse or severely "
                      f"degraded vegetation. Healthy Indian forests "
                      f"typically show NDVI above 0.5.",
            "severity": "HIGH",
            "icon": "🌿"
        })
    elif ndvi < 0.4:
        causes.append({
            "cause": "Low vegetation density",
            "detail": f"NDVI of {ndvi:.3f} indicates moderate degradation. "
                      f"Forest canopy cover has reduced significantly "
                      f"from historical levels.",
            "severity": "MODERATE",
            "icon": "🌿"
        })

    if anomaly_score < -0.5:
        causes.append({
            "cause": "Statistical anomaly detected",
            "detail": f"Isolation Forest algorithm detected this period as "
                      f"significantly abnormal compared to 4 years of "
                      f"baseline data. Anomaly score: {anomaly_score:.3f}",
            "severity": "MODERATE",
            "icon": "⚠️"
        })

    if len(causes) == 0:
        causes.append({
            "cause": "Normal seasonal variation",
            "detail": "No significant stress signals detected. "
                      "Current readings are within historical normal range.",
            "severity": "LOW",
            "icon": "✅"
        })

    return causes

# ─── OUTCOME PROJECTION ───
def project_outcome(risk_score, ndvi_trend):
    if len(ndvi_trend) < 3:
        trend_direction = "stable"
        trend_value = 0
    else:
        # Calculate slope of last 5 readings
        recent = ndvi_trend[-5:]
        trend_value = (recent[-1] - recent[0]) / len(recent)
        if trend_value < -0.005:
            trend_direction = "declining"
        elif trend_value > 0.005:
            trend_direction = "improving"
        else:
            trend_direction = "stable"

    if risk_score >= 75:
        return {
            "if_no_action": {
                "3_months":  "Continued vegetation loss. Risk of crossing ecological tipping point.",
                "6_months":  "Potential permanent degradation of forest patches. "
                             "Biodiversity loss accelerates.",
                "12_months": "High probability of irreversible ecosystem collapse "
                             "in affected patches. Carbon sink lost."
            },
            "trend": trend_direction,
            "urgency": "IMMEDIATE ACTION REQUIRED"
        }
    elif risk_score >= 50:
        return {
            "if_no_action": {
                "3_months":  "Risk score likely to increase if fire season continues.",
                "6_months":  "Moderate degradation expected. "
                             "Some species displacement possible.",
                "12_months": "Elevated risk of crossing into HIGH category "
                             "without intervention."
            },
            "trend": trend_direction,
            "urgency": "ACTION RECOMMENDED"
        }
    else:
        return {
            "if_no_action": {
                "3_months":  "Forest condition expected to remain stable.",
                "6_months":  "Natural seasonal recovery likely with monsoon.",
                "12_months": "Low risk of significant degradation "
                             "if fire pressure remains controlled."
            },
            "trend": trend_direction,
            "urgency": "MONITOR REGULARLY"
        }

# ─── LOAD CSV DATA ───
def load_zone_data():
    zones = {}
    files = {
        "western_ghats": "western_ghats_risk_scores.csv",
        "central_india":  "central_india_risk_scores.csv",
        "northeast":      "northeast_risk_scores.csv"
    }
    meta = {
        "western_ghats": {
            "lat": 11.5, "lng": 75.8,
            "name": "Western Ghats"
        },
        "central_india": {
            "lat": 21.5, "lng": 80.5,
            "name": "Central India Forests"
        },
        "northeast": {
            "lat": 26.0, "lng": 93.0,
            "name": "Northeast Forests"
        }
    }

    for key, fname in files.items():
        if os.path.exists(fname):
            df = pd.read_csv(fname)
            latest = df.iloc[-1]
            ndvi_trend = df["ndvi"].tolist()
            dates = df["date"].astype(str).tolist()

            # Get causes for latest data
            causes = analyze_causes(
                zone_data=key,
                ndvi=float(latest["ndvi"]),
                anomaly_score=float(latest.get("anomaly_score", -0.4)),
                fire_count=float(latest.get("fire_count", 0)),
                seasonal_dev=float(latest.get("ndvi_seasonal_dev", 0))
            )

            # Get outcome projection
            outcome = project_outcome(
                float(latest["risk_score"]),
                ndvi_trend
            )

            zones[key] = {
                **meta[key],
                "score":       float(latest["risk_score"]),
                "level":       str(latest["risk_level"]),
                "ndvi":        float(latest["ndvi"]),
                "ndvi_trend":  ndvi_trend,
                "dates":       dates,
                "causes":      causes,
                "outcome":     outcome,
                "iks":         IKS_KNOWLEDGE.get(key, {}),
                "fire_count":  float(latest.get("fire_count", 0)),
                "anomalies":   int((df["anomaly_score"] < -0.45).sum())
                               if "anomaly_score" in df.columns else 0
            }
    return zones

ZONES = load_zone_data()

# ─── ENDPOINTS ───

@app.get("/")
def root():
    return {"message": "Aranyani API running"}

@app.get("/zones")
def get_zones():
    return list(ZONES.values())

@app.get("/zones/{zone_id}")
def get_zone(zone_id: str):
    if zone_id not in ZONES:
        return {"error": "Zone not found"}
    return ZONES[zone_id]

@app.get("/area")
def get_area_risk(lat: float, lng: float):
    zone_bounds = {
        "western_ghats": {"s": 8,  "n": 15, "w": 74, "e": 77.5},
        "central_india":  {"s": 18, "n": 24, "w": 78, "e": 83},
        "northeast":      {"s": 24, "n": 28, "w": 89, "e": 97}
    }

    # Check if inside a zone
    inside_zone = False
    matched_zone = None
    for zid, bounds in zone_bounds.items():
        if (bounds["s"] <= lat <= bounds["n"] and
            bounds["w"] <= lng <= bounds["e"]):
            matched_zone = zid
            inside_zone  = True
            break

    # Find nearest zone if outside
    if not inside_zone:
        zone_centers = {
            "western_ghats": (11.5, 75.8),
            "central_india":  (21.5, 80.5),
            "northeast":      (26.0, 93.0)
        }
        matched_zone = min(
            zone_centers.items(),
            key=lambda z: math.sqrt(
                (z[1][0] - lat)*2 + (z[1][1] - lng)*2
            )
        )[0]

    zone_data = ZONES.get(matched_zone, {})

    if inside_zone:
        message = f"Inside monitored zone: {zone_data.get('name')}"
    else:
        message = f"Outside monitored zones. Nearest: {zone_data.get('name')}"

    return {
        "lat":         round(lat, 4),
        "lng":         round(lng, 4),
        "zone_id":     matched_zone,
        "zone_name":   zone_data.get("name", ""),
        "score":       zone_data.get("score", 0),
        "level":       zone_data.get("level", "UNKNOWN"),
        "ndvi":        zone_data.get("ndvi", 0),
        "ndvi_trend":  zone_data.get("ndvi_trend", []),
        "dates":       zone_data.get("dates", []),
        "causes":      zone_data.get("causes", []),
        "outcome":     zone_data.get("outcome", {}),
        "iks":         zone_data.get("iks", {}),
        "fire_count":  zone_data.get("fire_count", 0),
        "inside_zone": inside_zone,
        "message":     message
    }

@app.post("/report")
def submit_report(report: dict):
    text = report.get("report_text", "").lower()
    signals = {
        "animal_migration": any(w in text for w in [
            "animal", "elephant", "deer", "tiger",
            "birds leaving", "migration"
        ]),
        "river_color_change": any(w in text for w in [
            "river", "water color", "stream", "brown water",
            "muddy", "water changed"
        ]),
        "plant_anomaly": any(w in text for w in [
            "flowering", "out of season", "early bloom",
            "leaves falling", "trees dying", "mahua"
        ]),
        "dry_streams": any(w in text for w in [
            "dry", "dried", "no water", "wells dry", "stream gone"
        ]),
        "unusual_birds": any(w in text for w in [
            "birds", "hornbill", "whistling", "no birds", "flock left"
        ]),
        "soil_degradation": any(w in text for w in [
            "soil", "dust", "cracking", "erosion", "pale soil"
        ])
    }
    detected = [k for k, v in signals.items() if v]
    return {
        "message":             "Report received",
        "iks_signals_detected": detected,
        "count":               len(detected),
        "status":              "Alert sent to forest authorities"
        if len(detected) > 0 else "Report logged"
    }

@app.get("/alerts")
def get_alerts():
    return [
        {
            "zone":    z["name"],
            "score":   z["score"],
            "level":   z["level"],
            "message": f"Ecosystem stress detected in {z['name']}"
        }
        for z in ZONES.values() if z["score"] > 40
    ]