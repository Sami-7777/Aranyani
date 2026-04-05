import { useState, useEffect } from 'react';
import Map from './Map';
import Dashboard from './Dashboard';
import axios from 'axios';

export default function App() {
    const [zones, setZones]         = useState([]);
    const [selected, setSelected]   = useState(null);
    const [activeTab, setActiveTab] = useState('map');
    const [dark, setDark]           = useState(false);
    const [report, setReport]       = useState('');
    const [reportResult, setReportResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const T = {
        bg:        dark ? '#0a0f0a' : '#ffffff',
        surface:   dark ? '#111a11' : '#f9fafb',
        card:      dark ? '#162016' : '#ffffff',
        border:    dark ? '#1e3a1e' : '#e5e7eb',
        text:      dark ? '#e2f5e2' : '#111827',
        subtext:   dark ? '#7aab7a' : '#6b7280',
        green:     dark ? '#4ade80' : '#16a34a',
        darkgreen: dark ? '#22c55e' : '#14532d',
        header:    dark ? '#071507' : '#14532d',
    };

    useEffect(() => {
        axios.get('http://localhost:8000/zones')
            .then(res => setZones(res.data))
            .catch(() => {});
    }, []);

    const submitReport = async () => {
        if (!report.trim()) return;
        setSubmitting(true);
        try {
            const res = await axios.post(
                'http://localhost:8000/report',
                { report_text: report }
            );
            setReportResult(res.data);
            setReport('');
        } catch (e) {
            setReportResult({ error: 'Failed to submit' });
        }
        setSubmitting(false);
    };

    const RISK_COLORS = {
        LOW: '#22c55e', MODERATE: '#f59e0b',
        HIGH: '#f97316', CRITICAL: '#ef4444',
        UNKNOWN: '#888'
    };

    return (
        <div style={{
            background: T.bg,
            minHeight: '100vh',
            color: T.text,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'all 0.3s'
        }}>
            {/* Header */}
            <div style={{
                background: T.header,
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '64px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span style={{fontSize: '28px'}}>🌿</span>
                    <div>
                        <div style={{
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: '20px',
                            letterSpacing: '-0.5px'
                        }}>
                            Aranyani
                        </div>
                        <div style={{
                            color: 'rgba(255,255,255,0.65)',
                            fontSize: '11px'
                        }}>
                            Ecosystem Collapse Early Warning — Rigveda 10.146
                        </div>
                    </div>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setDark(!dark)}
                    style={{
                        background: dark
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    {dark ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>

            {/* Tab Bar */}
            <div style={{
                display: 'flex',
                background: T.surface,
                borderBottom: `1px solid ${T.border}`,
                padding: '0 24px'
            }}>
                {[
                    {id: 'map',    label: '🗺️ Risk Map'},
                    {id: 'alerts', label: '🚨 Alerts'},
                    {id: 'report', label: '📝 IKS Report'}
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '14px 20px',
                            border: 'none',
                            borderBottom: activeTab === tab.id
                                ? `3px solid ${T.green}`
                                : '3px solid transparent',
                            background: 'transparent',
                            color: activeTab === tab.id
                                ? T.green : T.subtext,
                            cursor: 'pointer',
                            fontWeight: activeTab === tab.id
                                ? '600' : '400',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Map Tab */}
            {activeTab === 'map' && (
                <div>
                    <Map
                        zones={zones}
                        onZoneClick={setSelected}
                        dark={dark}
                        T={T}
                    />
                    {selected && (
                        <Dashboard zone={selected} dark={dark} T={T}/>
                    )}
                    {!selected && (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 24px',
                            color: T.subtext
                        }}>
                            <div style={{fontSize: '48px', marginBottom: '16px'}}>
                                🌿
                            </div>
                            <div style={{fontSize: '18px', fontWeight: '600',
                                        color: T.text}}>
                                Click anywhere on the map
                            </div>
                            <div style={{fontSize: '14px', marginTop: '8px'}}>
                                or click a zone circle to see forest condition
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
                <div style={{padding: '24px', maxWidth: '900px', margin: '0 auto'}}>
                    <h2 style={{color: T.darkgreen, marginBottom: '20px'}}>
                        🚨 Active Forest Alerts
                    </h2>
                    {zones.filter(z => z.score > 30).length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: T.subtext
                        }}>
                            No active alerts
                        </div>
                    )}
                    {zones
                        .sort((a, b) => b.score - a.score)
                        .map((zone, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setSelected(zone);
                                setActiveTab('map');
                            }}
                            style={{
                                background: T.card,
                                border: `1px solid ${T.border}`,
                                borderLeft: `5px solid ${RISK_COLORS[zone.level]}`,
                                borderRadius: '10px',
                                padding: '20px',
                                marginBottom: '16px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                            }}
                            onMouseOver={e =>
                                e.currentTarget.style.transform = 'translateX(4px)'
                            }
                            onMouseOut={e =>
                                e.currentTarget.style.transform = 'translateX(0)'
                            }
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '12px'
                            }}>
                                <h3 style={{margin: 0, color: T.text}}>
                                    {zone.name}
                                </h3>
                                <span style={{
                                    background: RISK_COLORS[zone.level],
                                    color: '#fff',
                                    padding: '4px 14px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '700'
                                }}>
                                    {zone.level} — {zone.score}/100
                                </span>
                            </div>
                            {zone.causes?.slice(0, 2).map((c, j) => (
                                <div key={j} style={{
                                    fontSize: '13px',
                                    color: T.subtext,
                                    marginTop: '4px'
                                }}>
                                    {c.icon} {c.cause}: {c.detail}
                                </div>
                            ))}
                            <div style={{
                                fontSize: '12px',
                                color: T.green,
                                marginTop: '10px'
                            }}>
                                Click to view details →
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* IKS Report Tab */}
            {activeTab === 'report' && (
                <div style={{
                    padding: '32px 24px',
                    maxWidth: '680px',
                    margin: '0 auto'
                }}>
                    <h2 style={{color: T.darkgreen}}>
                        📝 Submit IKS Community Report
                    </h2>
                    <p style={{color: T.subtext, fontSize: '14px',
                               lineHeight: '1.6'}}>
                        Report ecological changes using traditional
                        Vrikshayurveda indicators. Your observation
                        feeds directly into the early warning system
                        and helps protect Indian forests.
                    </p>

                    {/* IKS Examples */}
                    <div style={{
                        background: dark ? '#0d1f0d' : '#f0fdf4',
                        border: `1px solid ${T.border}`,
                        borderRadius: '10px',
                        padding: '16px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            fontWeight: '600',
                            color: T.green,
                            marginBottom: '10px',
                            fontSize: '13px'
                        }}>
                            🌿 Examples of Vrikshayurveda indicators:
                        </div>
                        {[
                            '🐘 Unusual animal movement near forest',
                            '🌊 River or stream color change',
                            '🌸 Plants flowering out of season',
                            '💧 Streams drying earlier than usual',
                            '🦅 Birds leaving nesting sites early',
                            '🟤 Soil color or texture changes'
                        ].map((ex, i) => (
                            <div key={i} style={{
                                fontSize: '13px',
                                color: T.subtext,
                                padding: '4px 0',
                                borderBottom: i < 5
                                    ? `1px solid ${T.border}` : 'none'
                            }}>
                                {ex}
                            </div>
                        ))}
                    </div>

                    {/* Text Area */}
                    <textarea
                        value={report}
                        onChange={e => setReport(e.target.value)}
                        placeholder="Describe what you observed near the forest in plain language..."
                        style={{
                            width: '100%',
                            height: '130px',
                            padding: '14px',
                            border: `1px solid ${T.border}`,
                            borderRadius: '10px',
                            fontSize: '14px',
                            resize: 'vertical',
                            boxSizing: 'border-box',
                            background: T.card,
                            color: T.text,
                            outline: 'none',
                            lineHeight: '1.6'
                        }}
                    />

                    <button
                        onClick={submitReport}
                        disabled={submitting || !report.trim()}
                        style={{
                            background: submitting
                                ? T.subtext : T.green,
                            color: '#fff',
                            padding: '12px 28px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            marginTop: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'background 0.2s'
                        }}
                    >
                        {submitting ? 'Submitting...' : 'Submit Report'}
                    </button>

                    {/* Result */}
                    {reportResult && !reportResult.error && (
                        <div style={{
                            marginTop: '20px',
                            background: dark ? '#0d2a0d' : '#f0fdf4',
                            border: `1px solid ${T.green}`,
                            borderRadius: '10px',
                            padding: '20px'
                        }}>
                            <div style={{
                                fontWeight: '700',
                                color: T.green,
                                fontSize: '16px',
                                marginBottom: '12px'
                            }}>
                                ✅ Report Processed Successfully
                            </div>

                            {reportResult.iks_signals_detected?.length > 0 ? (
                                <>
                                    <div style={{
                                        fontSize: '13px',
                                        color: T.subtext,
                                        marginBottom: '8px'
                                    }}>
                                        {reportResult.iks_signals_detected.length} IKS
                                        signal(s) detected from your report:
                                    </div>
                                    {reportResult.iks_signals_detected.map((s, i) => (
                                        <div key={i} style={{
                                            display: 'inline-block',
                                            background: T.green,
                                            color: '#fff',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            margin: '3px',
                                            fontWeight: '600'
                                        }}>
                                            {s.replace(/_/g, ' ')}
                                        </div>
                                    ))}
                                    <div style={{
                                        marginTop: '14px',
                                        padding: '12px',
                                        background: dark
                                            ? 'rgba(239,68,68,0.1)'
                                            : '#fef2f2',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: '#ef4444',
                                        fontWeight: '600'
                                    }}>
                                        🚨 Alert sent to nearest Forest
                                        Department authority
                                    </div>
                                </>
                            ) : (
                                <div style={{
                                    fontSize: '13px',
                                    color: T.subtext
                                }}>
                                    No specific IKS signals detected.
                                    Report logged for manual review.
                                </div>
                            )}
                        </div>
                    )}

                    {reportResult?.error && (
                        <div style={{
                            marginTop: '16px',
                            color: '#ef4444',
                            fontSize: '13px'
                        }}>
                            ❌ {reportResult.error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
