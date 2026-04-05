import { useState, useEffect } from 'react';
import Map from './Map';
import Dashboard from './Dashboard';
import axios from 'axios';

export default function App() {
    const [zones, setZones]       = useState([]);
    const [selected, setSelected] = useState(null);
    const [report, setReport]     = useState('');
    const [status, setStatus]     = useState('');
    const [activeTab, setActiveTab] = useState('map');

    useEffect(() => {
        axios.get('http://localhost:8000/zones')
            .then(res => setZones(res.data))
            .catch(err => console.log('Backend not running:', err));
    }, []);

    const submitReport = async () => {
        if (!report) return;
        const res = await axios.post('http://localhost:8000/report', {
            zone_id: selected?.zone_id || 'unknown',
            report_text: report
        });
        setStatus(res.data);
        setReport('');
    };

    return (
        <div style={{
            fontFamily: 'system-ui, sans-serif',
            maxWidth: '1200px',
            margin: '0 auto',
            background: '#fff'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #14532d, #166534)',
                color: 'white',
                padding: '20px 24px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{fontSize: '32px'}}>🌿</span>
                    <div>
                        <h1 style={{margin: 0, fontSize: '24px'}}>
                            Aranyani
                        </h1>
                        <p style={{
                            margin: 0,
                            fontSize: '13px',
                            opacity: 0.85
                        }}>
                            Ecosystem Collapse Early Warning System
                            — Rigveda 10.146
                        </p>
                    </div>
                </div>
            </div>

            {/* Tab Bar */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb'
            }}>
                {["map", "alerts", "report"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            background: activeTab === tab
                                ? 'white' : 'transparent',
                            borderBottom: activeTab === tab
                                ? '2px solid #16a34a' : 'none',
                            color: activeTab === tab
                                ? '#16a34a' : '#6b7280',
                            cursor: 'pointer',
                            fontWeight: activeTab === tab
                                ? '600' : '400',
                            fontSize: '14px',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab === 'map'     ? '🗺️ Risk Map'   : ''}
                        {tab === 'alerts'  ? '🚨 Alerts'     : ''}
                        {tab === 'report'  ? '📝 IKS Report' : ''}
                    </button>
                ))}
            </div>

            {/* Map Tab */}
            {activeTab === 'map' && (
                <div>
                    <Map zones={zones} onZoneClick={setSelected}/>
                    {selected && (
                        <Dashboard zone={selected}/>
                    )}
                </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
                <AlertsPanel zones={zones}/>
            )}

            {/* IKS Report Tab */}
            {activeTab === 'report' && (
                <ReportPanel
                    report={report}
                    setReport={setReport}
                    submitReport={submitReport}
                    status={status}
                />
            )}
        </div>
    );
}

function AlertsPanel({ zones }) {
    const COLORS = {
        LOW: '#22c55e', MODERATE: '#eab308',
        HIGH: '#f97316', CRITICAL: '#ef4444'
    };
    return (
        <div style={{padding: '24px'}}>
            <h2 style={{color: '#14532d'}}>Active Alerts</h2>
            {zones.filter(z => z.score > 40).map((zone, i) => (
                <div key={i} style={{
                    border: `1px solid ${COLORS[zone.level]}`,
                    borderLeft: `4px solid ${COLORS[zone.level]}`,
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    background: COLORS[zone.level] + '11'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{margin: 0}}>{zone.name}</h3>
                        <span style={{
                            background: COLORS[zone.level],
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            {zone.level} — {zone.score}/100
                        </span>
                    </div>
                    {zone.causes && zone.causes.slice(0, 2).map((c, j) => (
                        <p key={j} style={{
                            margin: '8px 0 0',
                            fontSize: '13px',
                            color: '#374151'
                        }}>
                            {c.icon} {c.cause}: {c.detail}
                        </p>
                    ))}
                </div>
            ))}
            {zones.filter(z => z.score > 40).length === 0 && (
                <p style={{color: '#6b7280'}}>
                    No active alerts. All zones within normal range.
                </p>
            )}
        </div>
    );
}

function ReportPanel({ report, setReport, submitReport, status }) {
    return (
        <div style={{padding: '24px', maxWidth: '600px'}}>
            <h2 style={{color: '#14532d'}}>
                Submit IKS Community Report
            </h2>
            <p style={{color: '#6b7280', fontSize: '14px'}}>
                Report ecological changes using traditional
                Vrikshayurveda indicators. Your observation
                helps improve the early warning system.
            </p>
            <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                fontSize: '13px'
            }}>
                <b>Examples of IKS indicators to report:</b>
                <ul style={{margin: '8px 0 0', paddingLeft: '20px'}}>
                    <li>Unusual animal movement near forest</li>
                    <li>River or stream color change</li>
                    <li>Plants flowering out of season</li>
                    <li>Streams drying earlier than usual</li>
                    <li>Birds leaving nesting sites early</li>
                    <li>Soil color or texture changes</li>
                </ul>
            </div>
            <textarea
                value={report}
                onChange={e => setReport(e.target.value)}
                placeholder="Describe what you observed near the forest..."
                style={{
                    width: '100%',
                    height: '120px',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                }}
            />
            <button
                onClick={submitReport}
                style={{
                    background: '#16a34a',
                    color: 'white',
                    padding: '10px 24px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '8px',
                    fontSize: '14px'
                }}
            >
                Submit Report
            </button>
            {status && status.iks_signals_detected && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0'
                }}>
                    <b style={{color: '#14532d'}}>
                        ✅ Report processed
                    </b>
                    <p style={{margin: '4px 0', fontSize: '13px'}}>
                        IKS signals detected: {
                            status.iks_signals_detected.length > 0
                            ? status.iks_signals_detected.join(', ')
                            : 'None detected'
                        }
                    </p>
                    <p style={{margin: '4px 0', fontSize: '13px',
                               color: '#6b7280'}}>
                        {status.status}
                    </p>
                </div>
            )}
        </div>
    );
}
