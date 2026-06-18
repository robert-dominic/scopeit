"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ScopeDocument } from "@/lib/types";

const s = StyleSheet.create({
    page: { padding: 48, fontFamily: "Helvetica", color: "#0F1A12", backgroundColor: "#FFFFFF" },
    productName: { fontSize: 26, fontFamily: "Helvetica-Bold", marginBottom: 4 },
    tagline: { fontSize: 12, color: "#16A34A", marginBottom: 24 },
    sectionLabel: { fontSize: 8, textTransform: "uppercase", letterSpacing: 1.5, color: "#6B7C71", marginBottom: 6 },
    box: { border: "1px solid #D1D9D4", borderRadius: 8, padding: 12, marginBottom: 16 },
    body: { fontSize: 10, lineHeight: 1.7 },
    featureName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    featureDesc: { fontSize: 10, lineHeight: 1.6, marginBottom: 2 },
    featureWhy: { fontSize: 9, color: "#6B7C71", lineHeight: 1.5, marginBottom: 8 },
    antiName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    antiReason: { fontSize: 10, color: "#6B7C71", lineHeight: 1.5, marginBottom: 8 },
    roadmapRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
    roadmapPhase: { flex: 1, border: "1px solid #D1D9D4", borderRadius: 8, padding: 10 },
    phaseNum: { fontSize: 9, color: "#16A34A", fontFamily: "Helvetica-Bold", marginBottom: 2 },
    phaseTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    phaseDuration: { fontSize: 9, color: "#6B7C71", marginBottom: 6 },
    phaseAction: { fontSize: 9, color: "#0F1A12", lineHeight: 1.5, marginBottom: 2 },
    metricItem: { fontSize: 10, lineHeight: 1.6, marginBottom: 4 },
    nextMoveBox: { backgroundColor: "#0F1A12", borderRadius: 8, padding: 14 },
    nextMoveText: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#FFFFFF", lineHeight: 1.6 },
    stackName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    stackReason: { fontSize: 10, color: "#6B7C71", lineHeight: 1.5, marginBottom: 6 },
    riskName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    riskMit: { fontSize: 10, color: "#6B7C71", lineHeight: 1.5, marginBottom: 6 },
});

export function ScopePDFDocument({ scope }: { scope: ScopeDocument }) {
    return (
        <Document>
            <Page size="A4" style={s.page}>
                <Text style={s.productName}>{scope.product_name}</Text>
                <Text style={s.tagline}>{scope.tagline}</Text>

                <Text style={s.sectionLabel}>The Problem</Text>
                <View style={s.box}><Text style={s.body}>{scope.problem}</Text></View>

                <Text style={s.sectionLabel}>Target User</Text>
                <View style={s.box}><Text style={s.body}>{scope.target_user}</Text></View>

                <Text style={s.sectionLabel}>Product Goal</Text>
                <View style={s.box}><Text style={s.body}>{scope.product_goal}</Text></View>

                <Text style={s.sectionLabel}>What to Build (MVP)</Text>
                <View style={{ backgroundColor: "#F0FDF4", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                    {scope.mvp_features.map((f, i) => (
                        <View key={i}>
                            <Text style={s.featureName}>{i + 1}. {f.name}</Text>
                            <Text style={s.featureDesc}>{f.description}</Text>
                            <Text style={s.featureWhy}>Why now: {f.why}</Text>
                        </View>
                    ))}
                </View>

                <Text style={s.sectionLabel}>What NOT to Build</Text>
                <View style={{ backgroundColor: "#FEF2F2", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                    {scope.anti_scope.map((a, i) => (
                        <View key={i}>
                            <Text style={s.antiName}>✕ {a.item}</Text>
                            <Text style={s.antiReason}>{a.reason}</Text>
                        </View>
                    ))}
                </View>

                <Text style={s.sectionLabel}>Roadmap</Text>
                <View style={s.roadmapRow}>
                    {[scope.roadmap.phase_1, scope.roadmap.phase_2, scope.roadmap.phase_3].map((p, i) => (
                        <View key={i} style={s.roadmapPhase}>
                            <Text style={s.phaseNum}>Phase {i + 1}</Text>
                            <Text style={s.phaseTitle}>{p.title}</Text>
                            <Text style={s.phaseDuration}>{p.duration}</Text>
                            {p.actions.map((a, j) => (
                                <Text key={j} style={s.phaseAction}>• {a}</Text>
                            ))}
                        </View>
                    ))}
                </View>

                {scope.tech_stack?.length > 0 && (
                    <View>
                        <Text style={s.sectionLabel}>Recommended Stack</Text>
                        <View style={s.box}>
                            {scope.tech_stack.map((t, i) => (
                                <View key={i}>
                                    <Text style={s.stackName}>{t.recommended}</Text>
                                    <Text style={s.stackReason}>{t.reason}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {scope.risks?.length > 0 && (
                    <View>
                        <Text style={s.sectionLabel}>Risks & Mitigations</Text>
                        <View style={s.box}>
                            {scope.risks.map((r, i) => (
                                <View key={i}>
                                    <Text style={s.riskName}>{r.risk}</Text>
                                    <Text style={s.riskMit}>→ {r.mitigation}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <Text style={s.sectionLabel}>Success Metrics</Text>
                <View style={s.box}>
                    {scope.success_metrics.map((m, i) => (
                        <Text key={i} style={s.metricItem}>• {m}</Text>
                    ))}
                </View>

                <Text style={s.sectionLabel}>Your Next Move</Text>
                <View style={s.nextMoveBox}>
                    <Text style={s.nextMoveText}>{scope.next_move}</Text>
                </View>
            </Page>
        </Document>
    );
}
