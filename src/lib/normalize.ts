import type { ModelAssessment } from '../types'

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value instanceof Map) {
    return Object.fromEntries(value.entries()) as Record<string, unknown>
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return null
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function normalizeAssessment(raw: unknown): ModelAssessment | null {
  const record = asRecord(raw)
  if (!record) return null
  const modelId = String(record.model_id ?? record.modelId ?? '')
  if (!modelId) return null

  return {
    provider: String(record.provider ?? ''),
    modelId,
    modelCardUrl: String(record.model_card_url ?? record.modelCardUrl ?? ''),
    systemCardUrl: String(record.system_card_url ?? record.systemCardUrl ?? ''),
    policyUrl: String(record.policy_url ?? record.policyUrl ?? ''),
    requiredTier: asNumber(record.required_tier ?? record.requiredTier),
    requiredMask: asNumber(record.required_mask ?? record.requiredMask),
    state: asNumber(record.state),
    decision: asNumber(record.decision),
    riskTier: asNumber(record.risk_tier ?? record.riskTier),
    disclosureMask: asNumber(record.disclosure_mask ?? record.disclosureMask),
    missingMask: asNumber(record.missing_mask ?? record.missingMask),
    sourceConsistency: String(
      record.source_consistency ?? record.sourceConsistency ?? 'insufficient',
    ),
    summary: String(record.summary ?? ''),
    round: asNumber(record.round),
  }
}
