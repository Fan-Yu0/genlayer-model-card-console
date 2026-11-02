import { describe, expect, it } from 'vitest'
import { hasErrors, validateModelForm, validateModelId } from './validation'
import type { ModelForm } from '../types'

const valid: ModelForm = {
  modelId: 'google/gemma-2-9b-it',
  modelCardUrl: 'https://huggingface.co/google/gemma-2-9b-it',
  systemCardUrl: 'https://arxiv.org/html/2408.00118',
  policyUrl: 'https://www.nist.gov/itl/ai-risk-management-framework',
  requiredTier: '3',
  disclosures: ['intended_use', 'limitations', 'training_data', 'evaluation'],
}

describe('validateModelForm', () => {
  it('accepts a complete form', () => {
    expect(hasErrors(validateModelForm(valid))).toBe(false)
  })

  it('requires a model id', () => {
    expect(validateModelForm({ ...valid, modelId: '   ' }).modelId).toMatch(/required/i)
  })

  it('rejects non-HTTPS model card urls', () => {
    expect(validateModelForm({ ...valid, modelCardUrl: 'http://x.com' }).modelCardUrl).toMatch(/HTTPS/i)
  })

  it('rejects non-HTTPS policy urls', () => {
    expect(validateModelForm({ ...valid, policyUrl: 'http://x.com' }).policyUrl).toMatch(/HTTPS/i)
  })

  it('rejects identical model and system card urls', () => {
    expect(validateModelForm({ ...valid, systemCardUrl: valid.modelCardUrl }).systemCardUrl).toMatch(/different/i)
  })

  it('requires at least one disclosure', () => {
    expect(validateModelForm({ ...valid, disclosures: [] }).disclosures).toMatch(/at least one/i)
  })

  it('rejects an overlong model id', () => {
    expect(validateModelForm({ ...valid, modelId: 'a'.repeat(201) }).modelId).toMatch(/200/)
  })
})

describe('validateModelId', () => {
  it('accepts a normal id', () => {
    expect(validateModelId('google/gemma-2-9b-it')).toBeNull()
  })

  it('rejects an empty id', () => {
    expect(validateModelId('   ')).toMatch(/Enter/)
  })
})
