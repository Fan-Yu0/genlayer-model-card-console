export interface ModelForm {
  modelId: string
  modelCardUrl: string
  systemCardUrl: string
  policyUrl: string
  requiredTier: '1' | '2' | '3' | '4'
  disclosures: string[]
}

export interface ModelAssessment {
  provider: string
  modelId: string
  modelCardUrl: string
  systemCardUrl: string
  policyUrl: string
  requiredTier: number
  requiredMask: number
  state: number
  decision: number
  riskTier: number
  disclosureMask: number
  missingMask: number
  sourceConsistency: string
  summary: string
  round: number
}

export type TransactionPhase =
  | 'idle'
  | 'preparing'
  | 'signing'
  | 'submitted'
  | 'finalized'
  | 'error'

export interface TransactionState {
  phase: TransactionPhase
  action?: 'register' | 'assess'
  hash?: string
  message?: string
}

export interface Notice {
  tone: 'success' | 'error' | 'info'
  message: string
}
