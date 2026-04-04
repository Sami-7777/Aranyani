import { MapContainer, TileLayer, CircleMarker,
         Popup, useMapEvents, Marker } from 'react-leaflet';
import { useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const COLORS = {
    LOW:      '#22c55e',
    MODERATE: '#eab308',
    HIGH:     '#f97316',
    CRITICAL: '#ef4444',
    UNKNOWN:  '#888888'
};

// Handles click anywhere on map
function ClickHandler({ onAreaClick, setLoading }) {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setLoading(true);
            try {
                const res = await axios.get(
                    `http://localhost:8000/area?lat=${lat}&lng=${lng}`
                );
                onAreaClick(res.data);
            } catch (err) {
                console.log("Area fetch failed:", err);
            } finally {
                setLoading(false);
            }
        }
    });
    return null;
}

export default function Map({ zones, onZoneClick }) {
    const [clickedArea, setClickedArea] = useState(null);
    const [loading, setLoading]         = useState(false);
    const [clickPos, setClickPos]       = useState(null);

    const handleAreaClick = (data) => {
        setClickedArea(data);
        setClickPos([data.lat, data.lng]);
        onZoneClick(data);
    };

    return (
        <div>
            {/* Instruction bar */}
            <div style={{
                background: '#f0fdf4',
                padding: '8px 16px',
                fontSize: '13px',
                color: '#166534',
                borderBottom: '1px solid #bbf7d0'
            }}>
                🌿 Click anywhere on India to check forest condition
                {loading && " — Loading..."}
            </div>

            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: '480px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="OpenStreetMap"
                />

                {/* Click anywhere handler */}
                <ClickHandler
                    onAreaClick={handleAreaClick}
                    setLoading={setLoading}
                />

                {/* Zone markers */}
                {zones.map((zone, i) => (
                    <CircleMarker
                        key={i}
                        center={[zone.lat, zone.lng]}
                        radius={Math.max(8, zone.score / 5)}
                        fillColor={COLORS[zone.level]}
                        color={COLORS[zone.level]}
                        fillOpacity={0.7}
                        eventHandlers={{
                            click: () => onZoneClick(zone)
                        }}
                    >
                        <Popup>
                            <div style={{minWidth: '150px'}}>
                                <b>{zone.name}</b><br/>
                                <span style={{
                                    color: COLORS[zone.level],
                                    fontWeight: 'bold'
                                }}>
                                    {zone.level}
                                </span>
                                <br/>
                                Risk Score: {zone.score}/100<br/>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {/* Clicked location marker */}
                {clickPos && (
                    <CircleMarker
                        center={clickPos}
                        radius={6}
                        fillColor="#3b82f6"
                        color="#1e40af"
                        fillOpacity={0.9}
                        weight={2}
                    >
                        <Popup>
                            <div style={{minWidth: '180px'}}>
                                <b>📍 Selected Location</b><br/>
                                Lat: {clickPos[0].toFixed(3)},
                                Lng: {clickPos[1].toFixed(3)}<br/>
                                <hr style={{margin: '4px 0'}}/>
                                <b>{clickedArea?.zone_name}</b><br/>
                                Risk: <span style={{
                                    color: COLORS[clickedArea?.level],
                                    fontWeight: 'bold'
                                }}>
                                    {clickedArea?.level}
                                </span>
                                {' '}({clickedArea?.score}/100)<br/>
                                <i style={{
                                    fontSize: '11px',
                                    color: '#666'
                                }}>
                                    {clickedArea?.message}
                                </i>
                            </div>
                        </Popup>
                    </CircleMarker>
                )}
            </MapContainer>

            {/* Info panel below map */}
            {clickedArea && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 20px',
                    background: COLORS[clickedArea.level] + '18',
                    borderLeft: `4px solid ${COLORS[clickedArea.level]}`,
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <span style={{fontSize: '12px', color: '#666'}}>
                            Selected Location
                        </span>
                        <br/>
                        <b style={{fontSize: '14px'}}>
                            {clickedArea.lat.toFixed(3)}°N,
                            {clickedArea.lng.toFixed(3)}°E
                        </b>
                    </div>

                    <div style={{
                        width: '1px',
                        height: '36px',
                        background: '#ddd'
                    }}/>

                    <div>
                        <span style={{fontSize: '12px', color: '#666'}}>
                            Nearest Zone
                        </span>
                        <br/>
                        <b style={{fontSize: '14px'}}>
                            {clickedArea.zone_name}
                        </b>
                    </div>

                    <div style={{
                        width: '1px',
                        height: '36px',
                        background: '#ddd'
                    }}/>

                    <div>
                        <span style={{fontSize: '12px', color: '#666'}}>
                            Risk Score
                        </span>
                        <br/>
                        <b style={{
                            fontSize: '18px',
                            color: COLORS[clickedArea.level]
                        }}>
                            {clickedArea.score}/100
                        </b>
                    </div>

                    <div style={{
                        width: '1px',
                        height: '36px',
                        background: '#ddd'
                    }}/>

                    <div>
                        <span style={{fontSize: '12px', color: '#666'}}>
                            Risk Level
                        </span>
                        <br/>
                        <b style={{
                            fontSize: '14px',
                            color: COLORS[clickedArea.level],
                            textTransform: 'uppercase'
                        }}>
                            {clickedArea.level}
                        </b>
                    </div>

                    <div style={{marginLeft: 'auto'}}>
                        <span style={{
                            fontSize: '11px',
                            color: '#888',
                            fontStyle: 'italic'
                        }}>
                            {clickedArea.message}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}