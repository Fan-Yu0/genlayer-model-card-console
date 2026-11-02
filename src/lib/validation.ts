import type { ModelForm } from '../types'
import { ALL_DISCLOSURES_MASK, maskFromKeys } from '../config'

export type FormErrors = Partial<Record<keyof ModelForm | 'disclosures', string>>

export function validateModelForm(form: ModelForm): FormErrors {
  const errors: FormErrors = {}
  const modelId = form.modelId.trim()
  const modelCardUrl = form.modelCardUrl.trim()
  const systemCardUrl = form.systemCardUrl.trim()
  const policyUrl = form.policyUrl.trim()

  if (!modelId) errors.modelId = 'Model ID is required.'
  else if (modelId.length > 200)
    errors.modelId = 'Model ID must be 200 characters or fewer.'

  const urls: Array<[keyof ModelForm, string, string]> = [
    ['modelCardUrl', modelCardUrl, 'model card'],
    ['systemCardUrl', systemCardUrl, 'system card'],
    ['policyUrl', policyUrl, 'policy'],
  ]
  for (const [field, value, label] of urls) {
    if (!value.startsWith('https://'))
      errors[field] = 'Use an official HTTPS ' + label + ' URL.'
    else if (value.length > 500)
      errors[field] = 'URL must be 500 characters or fewer.'
  }

  if (modelCardUrl && systemCardUrl && modelCardUrl === systemCardUrl)
    errors.systemCardUrl = 'Use a different system card URL.'
  if (policyUrl && modelCardUrl && policyUrl === modelCardUrl)
    errors.policyUrl = 'Use a different policy URL.'

  if (!['1', '2', '3', '4'].includes(form.requiredTier))
    errors.requiredTier = 'Choose a risk tier ceiling.'

  const mask = maskFromKeys(form.disclosures)
  if (mask < 1 || mask > ALL_DISCLOSURES_MASK)
    errors.disclosures = 'Select at least one required disclosure.'

  return errors
}

export function validateModelId(modelId: string): string | null {
  const normalized = modelId.trim()
  if (!normalized) return 'Enter a model ID to inspect.'
  if (normalized.length > 200) return 'Model ID is too long.'
  return null
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0
}
