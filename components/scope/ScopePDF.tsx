"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ScopeDocument } from "@/lib/types";

const TEAL = "#2EC4B6";
const DARK = "#0D1B2A";
const MUTED = "#6B7C71";
const BORDER = "#E5EAE7";

const s = StyleSheet.create({
    page: { padding: 52, fontFamily: "Helvetica", color: DARK, backgroundColor: "#FFFFFF" },

    // Header
    productName: { fontSize: 24, fontFamily: "Helvetica-Bold", color: DARK, marginBottom: 3 },
    tagline: { fontSize: 11, color: MUTED, marginBottom: 32 },

    // Section
    sectionLabel: { fontSize: 7.5, textTransform: "uppercase", letterSpacing: 1.8, color: MUTED, marginBottom: 5, marginTop: 18 },
    divider: { borderTop: `1px solid ${BORDER}`, marginBottom: 10 },

    // Body text
    body: { fontSize: 10, lineHeight: 1.75, color: DARK },

    // Features
    featureRow: { marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid ${TEAL}` },
    featureName: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    featureDesc: { fontSize: 10, lineHeight: 1.6, color: DARK, marginBottom: 2 },
    featureWhy: { fontSize: 9, color: MUTED, lineHeight: 1.5 },

    // Anti-scope
    antiRow: { marginBottom: 8 },
    antiName: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 1 },
    antiReason: { fontSize: 9, color: MUTED, lineHeight: 1.5 },

    // Roadmap — stacked vertically like the app
    roadmapPhase: { marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` },
    phaseHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
    phaseNum: { fontSize: 8, color: TEAL, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1 },
    phaseTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    phaseDuration: { fontSize: 9, color: MUTED, marginBottom: 4 },
    phaseAction: { fontSize: 9, color: DARK, lineHeight: 1.6, marginBottom: 1 },

    // Stack & Risks
    itemRow: { marginBottom: 8 },
    itemName: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 1 },
    itemSub: { fontSize: 9, color: MUTED, lineHeight: 1.5 },

    // Metrics
    metricItem: { fontSize: 10, lineHeight: 1.6, marginBottom: 3 },

    // Next move — dark block
    nextMoveBox: { backgroundColor: DARK, borderRadius: 6, padding: 14, marginTop: 18 },
    nextMoveLabel: { fontSize: 7.5, textTransform: "uppercase", letterSpacing: 1.8, color: TEAL, marginBottom: 6 },
    nextMoveText: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#FFFFFF", lineHeight: 1.7 },

    // Footer
    footer: { position: "absolute", bottom: 28, left: 52, right: 52, flexDirection: "row", justifyContent: "space-between" },
    footerText: { fontSize: 8, color: MUTED },
    footerBrand: { fontSize: 8, color: TEAL, fontFamily: "Helvetica-Bold" },
});

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <View>
            <Text style={s.sectionLabel}>{label}</Text>
            <View style={s.divider} />
            {children}
        </View>
    );
}

export function ScopePDFDocument({ scope }: { scope: ScopeDocument }) {
    const phases = [scope.roadmap.phase_1, scope.roadmap.phase_2, scope.roadmap.phase_3];

    return (
        <Document>
            <Page size="A4" style={s.page}>
                {/* Header */}
                <Text style={s.productName}>{scope.product_name}</Text>
                <Text style={s.tagline}>{scope.tagline}</Text>

                {/* Problem */}
                <Section label="The Problem">
                    <Text style={s.body}>{scope.problem}</Text>
                </Section>

                {/* Target User */}
                <Section label="Target User">
                    <Text style={s.body}>{scope.target_user}</Text>
                </Section>

                {/* Product Goal */}
                <Section label="Product Goal">
                    <Text style={s.body}>{scope.product_goal}</Text>
                </Section>

                {/* MVP Features */}
                <Section label="What to Build (MVP)">
                    {scope.mvp_features.map((f, i) => (
                        <View key={i} style={s.featureRow}>
                            <Text style={s.featureName}>{f.name}</Text>
                            <Text style={s.featureDesc}>{f.description}</Text>
                            <Text style={s.featureWhy}>Why now: {f.why}</Text>
                        </View>
                    ))}
                </Section>

                {/* Anti-scope */}
                <Section label="What Not to Build">
                    {scope.anti_scope.map((a, i) => (
                        <View key={i} style={s.antiRow}>
                            <Text style={s.antiName}>— {a.item}</Text>
                            <Text style={s.antiReason}>{a.reason}</Text>
                        </View>
                    ))}
                </Section>

                {/* Roadmap */}
                <Section label="Roadmap">
                    {phases.map((p, i) => (
                        <View key={i} style={s.roadmapPhase}>
                            <Text style={s.phaseNum}>Phase {i + 1} · {p.duration}</Text>
                            <Text style={s.phaseTitle}>{p.title}</Text>
                            {p.actions.map((a, j) => (
                                <Text key={j} style={s.phaseAction}>· {a}</Text>
                            ))}
                        </View>
                    ))}
                </Section>

                {/* Tech Stack */}
                {scope.tech_stack?.length > 0 && (
                    <Section label="Recommended Stack">
                        {scope.tech_stack.map((t, i) => (
                            <View key={i} style={s.itemRow}>
                                <Text style={s.itemName}>{t.recommended}</Text>
                                <Text style={s.itemSub}>{t.reason}</Text>
                            </View>
                        ))}
                    </Section>
                )}

                {/* Risks */}
                {scope.risks?.length > 0 && (
                    <Section label="Risks & Mitigations">
                        {scope.risks.map((r, i) => (
                            <View key={i} style={s.itemRow}>
                                <Text style={s.itemName}>{r.risk}</Text>
                                <Text style={s.itemSub}>→ {r.mitigation}</Text>
                            </View>
                        ))}
                    </Section>
                )}

                {/* Success Metrics */}
                <Section label="Success Metrics">
                    {scope.success_metrics.map((m, i) => (
                        <Text key={i} style={s.metricItem}>· {m}</Text>
                    ))}
                </Section>

                {/* Next Move */}
                <View style={s.nextMoveBox}>
                    <Text style={s.nextMoveLabel}>Your Next Move</Text>
                    <Text style={s.nextMoveText}>{scope.next_move}</Text>
                </View>

                {/* Footer */}
                <View style={s.footer} fixed>
                    <Text style={s.footerText}>{scope.product_name} · Scope Document</Text>
                    <Text style={s.footerBrand}>ScopeIt</Text>
                </View>
            </Page>
        </Document>
    );
}
