import type { ModelForm } from './types'

export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0x20e1Bf44997dC3Bf89A776f95dB672fD712e1a5e'

export const GENLAYER_RPC_URL =
  import.meta.env.VITE_GENLAYER_RPC_URL || 'https://studio.genlayer.com/api'

export const EXPLORER_URL = 'https://explorer-studio.genlayer.com'
export const CONTRACT_URL = EXPLORER_URL + '/address/' + CONTRACT_ADDRESS
export const SOURCE_URL =
  'https://github.com/Fan-Yu0/genlayer-model-card-gate'
export const POLICY_REFERENCE_URL =
  'https://www.nist.gov/itl/ai-risk-management-framework'

export const SAMPLE_MODEL_ID = 'google/gemma-2-9b-it'

export const SAMPLE_FORM: ModelForm = {
  modelId: SAMPLE_MODEL_ID,
  modelCardUrl: 'https://huggingface.co/google/gemma-2-9b-it',
  systemCardUrl: 'https://arxiv.org/html/2408.00118',
  policyUrl: 'https://www.nist.gov/itl/ai-risk-management-framework',
  requiredTier: '3',
  disclosures: ['intended_use', 'limitations', 'training_data', 'evaluation'],
}

export interface Disclosure {
  key: string
  bit: number
  label: string
}

export const DISCLOSURES: Disclosure[] = [
  { key: 'intended_use', bit: 1, label: 'Intended use' },
  { key: 'limitations', bit: 2, label: 'Limitations' },
  { key: 'training_data', bit: 4, label: 'Training data' },
  { key: 'evaluation', bit: 8, label: 'Evaluation' },
  { key: 'human_oversight', bit: 16, label: 'Human oversight' },
  { key: 'security', bit: 32, label: 'Security' },
  { key: 'environmental_impact', bit: 64, label: 'Environmental impact' },
]

export const ALL_DISCLOSURES_MASK = 127

export function maskFromKeys(keys: string[]): number {
  return keys.reduce((mask, key) => {
    const item = DISCLOSURES.find((entry) => entry.key === key)
    return item ? mask | item.bit : mask
  }, 0)
}

export function keysFromMask(mask: number): string[] {
  return DISCLOSURES.filter((entry) => (mask & entry.bit) !== 0).map(
    (entry) => entry.key,
  )
}

export function disclosureLabel(key: string): string {
  return (
    DISCLOSURES.find((entry) => entry.key === key)?.label ||
    key.replace(/_/g, ' ')
  )
}

export const TIER_OPTIONS = [
  { value: '1', label: 'Tier 1 - Minimal' },
  { value: '2', label: 'Tier 2 - Limited' },
  { value: '3', label: 'Tier 3 - High' },
  { value: '4', label: 'Tier 4 - Unacceptable' },
] as const

export const DECISION_META = {
  0: {
    label: 'Not assessed',
    tone: 'neutral',
    description: 'This model has no completed assessment yet.',
  },
  1: {
    label: 'Approved',
    tone: 'clear',
    description: 'Required disclosures are present within the policy tier.',
  },
  2: {
    label: 'Conditional',
    tone: 'review',
    description:
      'Some required disclosures are missing; complete them before use.',
  },
  3: {
    label: 'Rejected',
    tone: 'blocked',
    description:
      'Risk tier exceeds policy, or evidence conflicts or is insufficient.',
  },
} as const

export const TIER_META = {
  0: { label: 'Unknown', tone: 'neutral' },
  1: { label: 'Minimal', tone: 'clear' },
  2: { label: 'Limited', tone: 'review' },
  3: { label: 'High', tone: 'review' },
  4: { label: 'Unacceptable', tone: 'blocked' },
} as const
