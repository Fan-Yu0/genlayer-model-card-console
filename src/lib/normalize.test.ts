import { describe, expect, it } from 'vitest'
import { normalizeAssessment } from './normalize'

describe('normalizeAssessment', () => {
  it('maps the snake_case contract response', () => {
    const result = normalizeAssessment({
      provider: '0xabc',
      model_id: 'google/gemma-2-9b-it',
      model_card_url: 'https://huggingface.co/google/gemma-2-9b-it',
      system_card_url: 'https://arxiv.org/html/2408.00118',
      policy_url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      required_tier: 3,
      required_mask: 15,
      state: 1,
      decision: 1,
      risk_tier: 2,
      disclosure_mask: 15,
      missing_mask: 0,
      source_consistency: 'consistent',
      summary: 'Approved.',
      round: 1,
    })

    expect(result).toMatchObject({
      modelId: 'google/gemma-2-9b-it',
      decision: 1,
      riskTier: 2,
      disclosureMask: 15,
      missingMask: 0,
      sourceConsistency: 'consistent',
      round: 1,
    })
  })

  it('maps camelCase fields', () => {
    const result = normalizeAssessment({
      modelId: 'camel-model',
      riskTier: 3,
      disclosureMask: 8,
      sourceConsistency: 'consistent',
      round: 2,
    })

    expect(result).toMatchObject({
      modelId: 'camel-model',
      riskTier: 3,
      disclosureMask: 8,
      round: 2,
    })
  })

  it('returns null without a model id', () => {
    expect(normalizeAssessment({ decision: 1 })).toBeNull()
  })
})
