import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine
} from 'recharts';

const RISK_COLORS = {
    LOW: '#22c55e', MODERATE: '#f59e0b',
    HIGH: '#f97316', CRITICAL: '#ef4444',
    UNKNOWN: '#888'
};

export default function Dashboard({ zone, dark, T }) {
    if (!zone) return null;

    const color = RISK_COLORS[zone.level] || '#888';

    const chartData = (zone.dates || []).map((date, i) => ({
        date: date.toString().slice(0, 10),
        ndvi: parseFloat(
            (zone.ndvi_trend?.[i] || 0).toFixed(3)
        )
    }));

    const avgNdvi = chartData.length
        ? chartData.reduce((s, d) => s + d.ndvi, 0) / chartData.length
        : 0;

    return (
        <div style={{
            background: T.bg,
            borderTop: `4px solid ${color}`
        }}>

            {/* Zone Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 28px',
                background: T.surface,
                borderBottom: `1px solid ${T.border}`,
                flexWrap: 'wrap',
                gap: '12px'
            }}>
                <div>
                    <h2 style={{
                        margin: 0,
                        fontSize: '20px',
                        color: T.text
                    }}>
                        {zone.name || zone.zone_name}
                    </h2>
                    {zone.iks?.guardian_system && (
                        <div style={{
                            fontSize: '12px',
                            color: T.subtext,
                            marginTop: '4px'
                        }}>
                            🌿 {zone.iks.guardian_system}
                        </div>
                    )}
                </div>

                {/* Big Risk Badge */}
                <div style={{
                    background: color,
                    borderRadius: '12px',
                    padding: '12px 24px',
                    textAlign: 'center',
                    boxShadow: `0 4px 14px ${color}55`
                }}>
                    <div style={{
                        color: '#fff',
                        fontSize: '28px',
                        fontWeight: '800',
                        lineHeight: 1
                    }}>
                        {zone.score}
                    </div>
                    <div style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '11px',
                        marginTop: '2px'
                    }}>
                        out of 100 — {zone.level}
                    </div>
                </div>
            </div>

            <div style={{padding: '24px 28px'}}>

                {/* Stats Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    marginBottom: '28px'
                }}>
                    <StatCard
                        label="Current NDVI"
                        value={zone.ndvi?.toFixed(3) || 'N/A'}
                        sub="Vegetation health index"
                        color="#16a34a"
                        dark={dark}
                        T={T}
                        note={zone.ndvi < 0.4
                            ? '⚠️ Below healthy range'
                            : '✅ Within range'
                        }
                    />
                    <StatCard
                        label="Fire Hotspots"
                        value={zone.fire_count
                            ? Math.round(zone.fire_count)
                            : 0}
                        sub="Last 5 days — NASA FIRMS"
                        color="#f97316"
                        dark={dark}
                        T={T}
                        note={zone.fire_count > 500
                            ? '🔥 High fire pressure'
                            : '✅ Normal'
                        }
                    />
                    <StatCard
                        label="Anomalies"
                        value={zone.anomalies || 0}
                        sub="Detected in 4yr baseline"
                        color="#8b5cf6"
                        dark={dark}
                        T={T}
                        note="Isolation Forest detections"
                    />
                </div>

                {/* NDVI Chart */}
                {chartData.length > 0 && (
                    <Section
                        title="📈 Vegetation Health Trend (2020–2024)"
                        T={T}
                    >
                        <div style={{
                            background: T.card,
                            border: `1px solid ${T.border}`,
                            borderRadius: '10px',
                            padding: '16px'
                        }}>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={chartData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={dark
                                            ? '#1e3a1e' : '#e5e7eb'}
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{
                                            fontSize: 10,
                                            fill: T.subtext
                                        }}
                                        interval={Math.floor(
                                            chartData.length / 6
                                        )}
                                    />
                                    <YAxis
                                        domain={[0, 1]}
                                        tick={{
                                            fontSize: 10,
                                            fill: T.subtext
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: T.card,
                                            border: `1px solid ${T.border}`,
                                            color: T.text,
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <ReferenceLine
                                        y={avgNdvi}
                                        stroke={T.subtext}
                                        strokeDasharray="4 4"
                                        label={{
                                            value: 'avg',
                                            fill: T.subtext,
                                            fontSize: 10
                                        }}
                                    />
                                    <ReferenceLine
                                        y={0.3}
                                        stroke="#f97316"
                                        strokeDasharray="3 3"
                                        label={{
                                            value: 'warning',
                                            fill: '#f97316',
                                            fontSize: 10
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="ndvi"
                                        stroke="#16a34a"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{
                                            r: 4,
                                            fill: '#16a34a'
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                            <div style={{
                                display: 'flex',
                                gap: '20px',
                                fontSize: '11px',
                                color: T.subtext,
                                marginTop: '8px',
                                paddingLeft: '8px'
                            }}>
                                <span>
                                    — Green line: NDVI readings
                                </span>
                                <span style={{color: T.subtext}}>
                                    - - Dashed: historical average
                                </span>
                                <span style={{color: '#f97316'}}>
                                    - - Orange: warning threshold (0.3)
                                </span>
                            </div>
                        </div>
                    </Section>
                )}

                {/* Why Is This Happening */}
                {zone.causes?.length > 0 && (
                    <Section title="🔍 Why Is This Happening?" T={T}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            {zone.causes.map((cause, i) => {
                                const bg = {
                                    HIGH:     dark ? '#2a0d0d' : '#fef2f2',
                                    MODERATE: dark ? '#2a1f0d' : '#fffbeb',
                                    LOW:      dark ? '#0d2a0d' : '#f0fdf4'
                                }[cause.severity] || T.card;
                                const bc = {
                                    HIGH: '#ef4444',
                                    MODERATE: '#f59e0b',
                                    LOW: '#22c55e'
                                }[cause.severity] || T.border;
                                return (
                                    <div key={i} style={{
                                        background: bg,
                                        borderLeft: `4px solid ${bc}`,
                                        borderRadius: '8px',
                                        padding: '14px 16px'
                                    }}>
                                        <div style={{
                                            fontWeight: '700',
                                            fontSize: '14px',
                                            color: T.text,
                                            marginBottom: '4px'
                                        }}>
                                            {cause.icon} {cause.cause}
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: T.subtext,
                                            lineHeight: '1.5'
                                        }}>
                                            {cause.detail}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>
                )}

                {/* Outcome */}
                {zone.outcome && (
                    <Section
                        title="📊 What Happens If Nothing Is Done?"
                        T={T}
                    >
                        <div style={{
                            background: T.card,
                            border: `1px solid ${T.border}`,
                            borderRadius: '10px',
                            overflow: 'hidden',
                            marginBottom: '8px'
                        }}>
                            {Object.entries(
                                zone.outcome.if_no_action || {}
                            ).map(([period, text], i, arr) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    gap: '16px',
                                    padding: '14px 20px',
                                    borderBottom: i < arr.length - 1
                                        ? `1px solid ${T.border}`
                                        : 'none',
                                    alignItems: 'flex-start'
                                }}>
                                    <span style={{
                                        fontWeight: '700',
                                        color: [
                                            '#22c55e',
                                            '#f59e0b',
                                            '#ef4444'
                                        ][i],
                                        minWidth: '80px',
                                        fontSize: '13px',
                                        paddingTop: '1px'
                                    }}>
                                        {period.replace(/_/g, ' ')}
                                    </span>
                                    <span style={{
                                        fontSize: '13px',
                                        color: T.subtext,
                                        lineHeight: '1.5'
                                    }}>
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            fontSize: '12px',
                            color: T.subtext
                        }}>
                            <span>
                                Trend: <b style={{color: T.text}}>
                                    {zone.outcome.trend}
                                </b>
                            </span>
                            <span>
                                Urgency: <b style={{
                                    color: color
                                }}>
                                    {zone.outcome.urgency}
                                </b>
                            </span>
                        </div>
                    </Section>
                )}

                {/* IKS Indicators */}
                {zone.iks?.indicators && (
                    <Section
                        title="🌿 Traditional IKS Warning Indicators"
                        T={T}
                    >
                        <div style={{
                            background: dark ? '#0d1f0d' : '#f0fdf4',
                            border: `1px solid ${T.border}`,
                            borderRadius: '10px',
                            padding: '4px 0',
                            marginBottom: '8px'
                        }}>
                            {zone.iks.indicators.map((ind, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '11px 16px',
                                    borderBottom: i < zone.iks.indicators.length - 1
                                        ? `1px solid ${T.border}` : 'none',
                                    fontSize: '13px',
                                    color: T.text
                                }}>
                                    <span style={{
                                        color: '#16a34a',
                                        fontWeight: '700',
                                        fontSize: '16px'
                                    }}>›</span>
                                    {ind}
                                </div>
                            ))}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: T.subtext,
                            fontStyle: 'italic'
                        }}>
                            Source: {zone.iks.guardian_system}
                            — Vrikshayurveda ecological knowledge system
                        </div>
                    </Section>
                )}

                {/* Reversal Actions */}
                {zone.iks?.reversal_actions && (
                    <Section
                        title="🔄 How To Reverse The Degradation"
                        T={T}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            {zone.iks.reversal_actions.map((action, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    gap: '14px',
                                    alignItems: 'flex-start',
                                    padding: '12px 16px',
                                    background: i % 2 === 0
                                        ? (dark ? '#0d1f0d' : '#f0fdf4')
                                        : T.card,
                                    borderRadius: '8px',
                                    border: `1px solid ${T.border}`
                                }}>
                                    <span style={{
                                        background: '#16a34a',
                                        color: '#fff',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        flexShrink: 0
                                    }}>
                                        {i + 1}
                                    </span>
                                    <span style={{
                                        fontSize: '13px',
                                        color: T.text,
                                        lineHeight: '1.5',
                                        paddingTop: '3px'
                                    }}>
                                        {action}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

            </div>
        </div>
    );
}

function StatCard({ label, value, sub, color, dark, T, note }) {
    return (
        <div style={{
            padding: '20px',
            background: T.card,
            borderRadius: '12px',
            border: `1px solid ${T.border}`,
            textAlign: 'center'
        }}>
            <div style={{
                fontSize: '30px',
                fontWeight: '800',
                color: color,
                lineHeight: 1
            }}>
                {value}
            </div>
            <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: T.text,
                marginTop: '6px'
            }}>
                {label}
            </div>
            <div style={{
                fontSize: '11px',
                color: T.subtext,
                marginTop: '2px'
            }}>
                {sub}
            </div>
            {note && (
                <div style={{
                    fontSize: '11px',
                    color: T.subtext,
                    marginTop: '8px',
                    padding: '3px 8px',
                    background: dark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.04)',
                    borderRadius: '4px',
                    display: 'inline-block'
                }}>
                    {note}
                </div>
            )}
        </div>
    );
}

function Section({ title, children, T }) {
    return (
        <div style={{marginBottom: '28px'}}>
            <h3 style={{
                color: T.darkgreen,
                fontSize: '15px',
                fontWeight: '700',
                marginBottom: '14px',
                paddingBottom: '10px',
                borderBottom: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                {title}
            </h3>
            {children}
        </div>
    );
}
