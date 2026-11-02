import { FilePlus2, RotateCcw, ShieldPlus } from 'lucide-react'
import type { FormErrors } from '../lib/validation'
import { DISCLOSURES, TIER_OPTIONS } from '../config'
import type { ModelForm } from '../types'
import { Field } from './Field'

interface RegisterPanelProps {
  form: ModelForm
  errors: FormErrors
  busy: boolean
  connected: boolean
  onChange: (field: keyof ModelForm, value: string) => void
  onToggleDisclosure: (key: string, checked: boolean) => void
  onReset: () => void
  onSubmit: () => void
}

export function RegisterPanel({
  form,
  errors,
  busy,
  connected,
  onChange,
  onToggleDisclosure,
  onReset,
  onSubmit,
}: RegisterPanelProps) {
  return (
    <section className="tool-panel register-panel" aria-labelledby="register-title">
      <div className="panel-heading">
        <div className="panel-icon">
          <FilePlus2 size={19} aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow">Provider action</p>
          <h2 id="register-title">Register a model</h2>
        </div>
        <button className="text-button" type="button" onClick={onReset}>
          <RotateCcw size={14} aria-hidden="true" />
          Sample
        </button>
      </div>

      <div className="form-stack">
        <Field label="Model ID" htmlFor="model-id" hint="Unique key" error={errors.modelId}>
          <input
            id="model-id"
            value={form.modelId}
            onChange={(event) => onChange('modelId', event.target.value)}
            placeholder="google/gemma-2-9b-it"
            autoComplete="off"
          />
        </Field>

        <Field label="Model card URL" htmlFor="model-card-url" hint="HTTPS only" error={errors.modelCardUrl}>
          <input
            id="model-card-url"
            value={form.modelCardUrl}
            onChange={(event) => onChange('modelCardUrl', event.target.value)}
            placeholder="https://huggingface.co/google/gemma-2-9b-it"
            inputMode="url"
          />
        </Field>

        <Field label="System card URL" htmlFor="system-card-url" hint="HTTPS only" error={errors.systemCardUrl}>
          <input
            id="system-card-url"
            value={form.systemCardUrl}
            onChange={(event) => onChange('systemCardUrl', event.target.value)}
            placeholder="https://arxiv.org/html/2408.00118"
            inputMode="url"
          />
        </Field>

        <Field label="Buyer policy URL" htmlFor="policy-url" hint="HTTPS only" error={errors.policyUrl}>
          <input
            id="policy-url"
            value={form.policyUrl}
            onChange={(event) => onChange('policyUrl', event.target.value)}
            placeholder="https://www.nist.gov/itl/ai-risk-management-framework"
            inputMode="url"
          />
        </Field>

        <Field label="Risk tier ceiling" htmlFor="required-tier" hint="Policy limit" error={errors.requiredTier}>
          <select
            id="required-tier"
            className="role-select"
            value={form.requiredTier}
            onChange={(event) => onChange('requiredTier', event.target.value)}
          >
            {TIER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Required disclosures" htmlFor="disclosures" hint="Policy mask" error={errors.disclosures}>
          <div className="disclosure-grid" id="disclosures">
            {DISCLOSURES.map((item) => (
              <label key={item.key} className="disclosure-item">
                <input
                  type="checkbox"
                  checked={form.disclosures.includes(item.key)}
                  onChange={(event) => onToggleDisclosure(item.key, event.target.checked)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </Field>
      </div>

      <button
        className="primary-button full-width"
        type="button"
        onClick={onSubmit}
        disabled={busy || !connected}
      >
        <ShieldPlus size={17} aria-hidden="true" />
        {connected ? 'Register on GenLayer' : 'Connect wallet to register'}
      </button>
    </section>
  )
}
