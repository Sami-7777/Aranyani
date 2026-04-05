import { MapContainer, TileLayer, CircleMarker,
         Popup, useMapEvents } from 'react-leaflet';
import { useState, useRef } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const RISK_COLORS = {
    LOW: '#22c55e', MODERATE: '#f59e0b',
    HIGH: '#f97316', CRITICAL: '#ef4444',
    UNKNOWN: '#888'
};

function ClickHandler({ onAreaClick, setLoading }) {
    const clickTimer = useRef(null);

    useMapEvents({
        click: (e) => {
            // Debounce — ignore rapid clicks
            if (clickTimer.current) return;
            clickTimer.current = setTimeout(() => {
                clickTimer.current = null;
            }, 500);

            const { lat, lng } = e.latlng;
            setLoading(true);
            axios.get(
                `http://localhost:8000/area?lat=${lat}&lng=${lng}`
            )
            .then(res => onAreaClick(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
        }
    });
    return null;
}

export default function Map({ zones, onZoneClick, dark, T }) {
    const [clickedArea, setClickedArea] = useState(null);
    const [loading, setLoading]         = useState(false);
    const [clickPos, setClickPos]       = useState(null);

    const handleArea = (data) => {
        setClickedArea(data);
        setClickPos([data.lat, data.lng]);
        onZoneClick(data);
    };

    return (
        <div>
            {/* Instruction bar */}
            <div style={{
                background: dark ? '#0d1f0d' : '#f0fdf4',
                padding: '10px 20px',
                fontSize: '13px',
                color: dark ? '#4ade80' : '#166534',
                borderBottom: `1px solid ${T?.border || '#e5e7eb'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span>🌿</span>
                <span>
                    Click anywhere on India to check forest condition
                </span>
                {loading && (
                    <span style={{
                        marginLeft: 'auto',
                        color: T?.subtext
                    }}>
                        Loading...
                    </span>
                )}
            </div>

            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{height: '480px', width: '100%'}}
                doubleClickZoom={false}
            >
                <TileLayer
                    url={dark
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                    attribution="OpenStreetMap"
                />

                <ClickHandler
                    onAreaClick={handleArea}
                    setLoading={setLoading}
                />

                {/* Zone markers */}
                {zones.map((zone, i) => (
                    <CircleMarker
                        key={i}
                        center={[zone.lat, zone.lng]}
                        radius={Math.max(10, zone.score / 4)}
                        fillColor={RISK_COLORS[zone.level]}
                        color={RISK_COLORS[zone.level]}
                        fillOpacity={0.75}
                        weight={2}
                        eventHandlers={{
                            click: () => onZoneClick(zone)
                        }}
                    >
                        <Popup>
                            <div style={{minWidth: '160px'}}>
                                <b style={{fontSize: '14px'}}>
                                    {zone.name}
                                </b>
                                <br/>
                                <span style={{
                                    color: RISK_COLORS[zone.level],
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}>
                                    {zone.score}/100
                                </span>
                                <span style={{
                                    color: RISK_COLORS[zone.level],
                                    marginLeft: '6px',
                                    fontSize: '12px'
                                }}>
                                    {zone.level}
                                </span>
                                <br/>
                                <span style={{
                                    fontSize: '11px',
                                    color: '#666'
                                }}>
                                    Click for full analysis
                                </span>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {/* Clicked location */}
                {clickPos && (
                    <CircleMarker
                        center={clickPos}
                        radius={7}
                        fillColor="#3b82f6"
                        color="#1d4ed8"
                        fillOpacity={1}
                        weight={2}
                    >
                        <Popup>
                            <b>📍 Selected</b><br/>
                            {clickPos[0].toFixed(3)}°N,
                            {clickPos[1].toFixed(3)}°E<br/>
                            <span style={{color: '#666', fontSize: '11px'}}>
                                {clickedArea?.message}
                            </span>
                        </Popup>
                    </CircleMarker>
                )}
            </MapContainer>

            {/* Info bar */}
            {clickedArea && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0',
                    background: dark ? '#0d1a0d' : '#fff',
                    borderTop: `3px solid ${RISK_COLORS[clickedArea.level]}`,
                    flexWrap: 'wrap'
                }}>
                    {[
                        {
                            label: 'Selected Location',
                            value: `${clickedArea.lat.toFixed(3)}°N, ${clickedArea.lng.toFixed(3)}°E`
                        },
                        {
                            label: 'Nearest Zone',
                            value: clickedArea.zone_name
                        },
                        {
                            label: 'Risk Score',
                            value: `${clickedArea.score}/100`,
                            color: RISK_COLORS[clickedArea.level]
                        },
                        {
                            label: 'Risk Level',
                            value: clickedArea.level,
                            color: RISK_COLORS[clickedArea.level]
                        }
                    ].map((item, i) => (
                        <div key={i} style={{
                            padding: '14px 24px',
                            borderRight: `1px solid ${T?.border || '#e5e7eb'}`,
                            minWidth: '160px'
                        }}>
                            <div style={{
                                fontSize: '11px',
                                color: T?.subtext || '#6b7280',
                                marginBottom: '2px'
                            }}>
                                {item.label}
                            </div>
                            <div style={{
                                fontWeight: '700',
                                fontSize: '15px',
                                color: item.color || T?.text || '#111'
                            }}>
                                {item.value}
                            </div>
                        </div>
                    ))}
                    <div style={{
                        padding: '14px 24px',
                        fontSize: '12px',
                        color: T?.subtext,
                        marginLeft: 'auto',
                        fontStyle: 'italic'
                    }}>
                        {clickedArea.message}
                    </div>
                </div>
            )}
        </div>
    );
}
