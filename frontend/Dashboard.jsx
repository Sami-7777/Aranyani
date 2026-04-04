import { LineChart, Line, XAxis, YAxis,
         CartesianGrid, Tooltip, Legend,
         ResponsiveContainer } from 'recharts';

const COLORS = {
    LOW: '#22c55e', MODERATE: '#eab308',
    HIGH: '#f97316', CRITICAL: '#ef4444',
    UNKNOWN: '#888888'
};

export default function Dashboard({ zone }) {
    if (!zone) return null;

    const chartData = (zone.dates || []).map((date, i) => ({
        date: date.toString().slice(0, 10),
        ndvi: parseFloat((zone.ndvi_trend?.[i] || 0).toFixed(3))
    }));

    return (
        <div style={{padding: '0 0 24px'}}>

            {/* Zone Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb'
            }}>
                <div>
                    <h2 style={{margin: 0, fontSize: '18px'}}>
                        {zone.name || zone.zone_name}
                    </h2>
                    {zone.iks?.guardian_system && (
                        <p style={{
                            margin: '2px 0 0',
                            fontSize: '12px',
                            color: '#6b7280'
                        }}>
                            🌿 {zone.iks.guardian_system}
                        </p>
                    )}
                    {zone.message && (
                        <p style={{
                            margin: '2px 0 0',
                            fontSize: '12px',
                            color: '#6b7280',
                            fontStyle: 'italic'
                        }}>
                            📍 {zone.message}
                        </p>
                    )}
                </div>
                <div style={{
                    background: COLORS[zone.level] || '#888',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '24px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '22px',
                        fontWeight: 'bold'
                    }}>
                        {zone.score}/100
                    </div>
                    <div style={{fontSize: '12px'}}>
                        {zone.level}
                    </div>
                </div>
            </div>

            <div style={{padding: '0 24px'}}>

                {/* Stats Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    margin: '16px 0'
                }}>
                    <StatCard
                        label="Current NDVI"
                        value={zone.ndvi?.toFixed(3) || 'N/A'}
                        sub="Vegetation health index"
                        color="#16a34a"
                    />
                    <StatCard
                        label="Fire Hotspots"
                        value={zone.fire_count
                            ? Math.round(zone.fire_count)
                            : 0}
                        sub="Last 5 days (NASA FIRMS)"
                        color="#f97316"
                    />
                    <StatCard
                        label="Anomalies"
                        value={zone.anomalies || 0}
                        sub="Detected in 4yr baseline"
                        color="#8b5cf6"
                    />
                </div>

                {/* NDVI Chart */}
                {chartData.length > 0 && (
                    <div style={{marginBottom: '24px'}}>
                        <h3 style={{
                            color: '#14532d',
                            marginBottom: '8px'
                        }}>
                            Vegetation Health Trend (2020–2024)
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={chartData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    opacity={0.3}
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{fontSize: 10}}
                                    interval={Math.floor(
                                        chartData.length / 6
                                    )}
                                />
                                <YAxis
                                    domain={[0, 1]}
                                    tick={{fontSize: 10}}
                                />
                                <Tooltip/>
                                <Line
                                    type="monotone"
                                    dataKey="ndvi"
                                    stroke="#16a34a"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Why Is This Happening */}
                {zone.causes && zone.causes.length > 0 && (
                    <Section title="🔍 Why Is This Happening?">
                        {zone.causes.map((cause, i) => (
                            <div key={i} style={{
                                padding: '12px',
                                background: cause.severity === 'HIGH'
                                    ? '#fef2f2'
                                    : cause.severity === 'MODERATE'
                                    ? '#fffbeb'
                                    : '#f0fdf4',
                                borderRadius: '8px',
                                marginBottom: '8px',
                                borderLeft: `3px solid ${
                                    cause.severity === 'HIGH'
                                    ? '#ef4444'
                                    : cause.severity === 'MODERATE'
                                    ? '#f59e0b'
                                    : '#22c55e'
                                }`
                            }}>
                                <b style={{fontSize: '14px'}}>
                                    {cause.icon} {cause.cause}
                                </b>
                                <p style={{
                                    margin: '4px 0 0',
                                    fontSize: '13px',
                                    color: '#374151'
                                }}>
                                    {cause.detail}
                                </p>
                            </div>
                        ))}
                    </Section>
                )}

                {/* Outcome Projection */}
                {zone.outcome && (
                    <Section title="📊 What Happens If Nothing Is Done?">
                        <div style={{
                            background: '#fafafa',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            {Object.entries(
                                zone.outcome.if_no_action || {}
                            ).map(([period, text], i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderBottom: i < 2
                                        ? '1px solid #e5e7eb'
                                        : 'none'
                                }}>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: '#6b7280',
                                        minWidth: '80px',
                                        fontSize: '13px'
                                    }}>
                                        {period.replace('_', ' ')}
                                    </span>
                                    <span style={{
                                        fontSize: '13px',
                                        color: '#374151'
                                    }}>
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '8px'
                        }}>
                            Trend: {zone.outcome.trend} |
                            Urgency: <b>{zone.outcome.urgency}</b>
                        </p>
                    </Section>
                )}

                {/* IKS Indicators */}
                {zone.iks?.indicators && (
                    <Section title="🌿 Traditional IKS Warning Indicators">
                        <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            marginBottom: '8px'
                        }}>
                            Based on {zone.iks.guardian_system} —
                            traditional ecological knowledge for
                            this region:
                        </p>
                        {zone.iks.indicators.map((ind, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: '8px',
                                padding: '6px 0',
                                fontSize: '13px',
                                borderBottom: '1px solid #f3f4f6'
                            }}>
                                <span style={{color: '#16a34a'}}>
                                    ›
                                </span>
                                {ind}
                            </div>
                        ))}
                    </Section>
                )}

                {/* How To Reverse */}
                {zone.iks?.reversal_actions && (
                    <Section title="🔄 How To Reverse The Degradation">
                        <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            marginBottom: '8px'
                        }}>
                            Recommended actions combining modern
                            conservation science and traditional
                            IKS practices:
                        </p>
                        {zone.iks.reversal_actions.map((action, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: '8px',
                                padding: '8px 12px',
                                background: i % 2 === 0
                                    ? '#f0fdf4' : 'white',
                                borderRadius: '4px',
                                fontSize: '13px',
                                marginBottom: '4px'
                            }}>
                                <span style={{
                                    color: '#16a34a',
                                    fontWeight: 'bold',
                                    minWidth: '20px'
                                }}>
                                    {i + 1}.
                                </span>
                                {action}
                            </div>
                        ))}
                    </Section>
                )}

            </div>
        </div>
    );
}

function StatCard({ label, value, sub, color }) {
    return (
        <div style={{
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
        }}>
            <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: color
            }}>
                {value}
            </div>
            <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginTop: '4px'
            }}>
                {label}
            </div>
            <div style={{
                fontSize: '11px',
                color: '#9ca3af',
                marginTop: '2px'
            }}>
                {sub}
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{marginBottom: '24px'}}>
            <h3 style={{
                color: '#14532d',
                fontSize: '15px',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid #e5e7eb'
            }}>
                {title}
            </h3>
            {children}
        </div>
    );
}