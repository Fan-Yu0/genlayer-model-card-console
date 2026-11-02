import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Check,
  CircleDashed,
  ExternalLink,
  FileText,
  ShieldAlert,
  X,
} from 'lucide-react'
import {
  CONTRACT_URL,
  DECISION_META,
  TIER_META,
  disclosureLabel,
  keysFromMask,
} from '../config'
import type { ModelAssessment } from '../types'

function shorten(value: string, start = 8, end = 6) {
  if (!value) return 'Unknown'
  if (value.length <= start + end + 3) return value
  return value.slice(0, start) + '...' + value.slice(-end)
}

function DecisionIcon({ decision }: { decision: number }) {
  if (decision === 1) return <BadgeCheck size={28} aria-hidden="true" />
  if (decision === 2) return <AlertTriangle size={28} aria-hidden="true" />
  if (decision === 3) return <ShieldAlert size={28} aria-hidden="true" />
  return <CircleDashed size={28} aria-hidden="true" />
}

export function AssessmentResult({
  result,
  reading,
}: {
  result: ModelAssessment | null
  reading: boolean
}) {
  if (reading) {
    return (
      <section className="result-panel loading-state" aria-live="polite">
        <CircleDashed className="spin" size={24} aria-hidden="true" />
        Reading the accepted contract state.
      </section>
    )
  }

  if (!result) {
    return (
      <section className="result-panel empty-state">
        <div className="empty-icon">
          <FileText size={26} aria-hidden="true" />
        </div>
        <div>
          <h2>No assessment loaded</h2>
          <p>
            Read an existing model ID or run the live sample to inspect the
            deployed contract.
          </p>
        </div>
      </section>
    )
  }

  const decision =
    DECISION_META[result.decision as keyof typeof DECISION_META] ??
    DECISION_META[0]
  const tier =
    TIER_META[result.riskTier as keyof typeof TIER_META] ?? TIER_META[0]
  const consistencyTone =
    result.sourceConsistency === 'consistent' ? 'ok' : 'warn'
  const required = keysFromMask(result.requiredMask)
  const disclosed = new Set(keysFromMask(result.disclosureMask))
  const missing = new Set(keysFromMask(result.missingMask))

  return (
    <section
      className={'result-panel decision-' + decision.tone}
      aria-labelledby="result-title"
    >
      <div className="decision-hero">
        <div className="decision-icon">
          <DecisionIcon decision={result.decision} />
        </div>
        <div className="decision-copy">
          <p className="eyebrow">On-chain assessment</p>
          <h2 id="result-title">{decision.label}</h2>
          <p>{result.summary || decision.description}</p>
        </div>
        <div className="decision-release">
          <span>{tier.label} tier</span>
          <strong>Required &le; {result.requiredTier}</strong>
          <code>{result.modelId}</code>
        </div>
      </div>

      <div className="metric-strip">
        <div>
          <span>Risk tier</span>
          <strong>{tier.label}</strong>
          <small>assessed</small>
        </div>
        <div>
          <span>Required</span>
          <strong>{required.length}</strong>
          <small>disclosures</small>
        </div>
        <div>
          <span>Disclosed</span>
          <strong className="metric-ok">{disclosed.size}</strong>
          <small>found in evidence</small>
        </div>
        <div>
          <span>Missing</span>
          <strong className={missing.size ? 'metric-warn' : 'metric-ok'}>
            {missing.size}
          </strong>
          <small>gaps</small>
        </div>
        <div>
          <span>Source</span>
          <strong className={consistencyTone}>{result.sourceConsistency}</strong>
          <small>consistency</small>
        </div>
        <div>
          <span>Round</span>
          <strong>{result.round}</strong>
          <small>latest assessment</small>
        </div>
      </div>

      <div className="result-grid">
        <div className="result-section">
          <div className="section-title-row">
            <h3>Required disclosures</h3>
            <span>{required.length} in policy</span>
          </div>
          {required.length > 0 ? (
            <div className="obligation-list">
              {required.map((key) => {
                const present = disclosed.has(key) && !missing.has(key)
                return (
                  <span
                    className={'obligation-chip ' + (present ? 'chip-ok' : 'chip-missing')}
                    key={key}
                  >
                    {present ? (
                      <Check size={13} aria-hidden="true" />
                    ) : (
                      <X size={13} aria-hidden="true" />
                    )}
                    {disclosureLabel(key)}
                  </span>
                )
              })}
            </div>
          ) : (
            <p className="muted-copy">No disclosures required by policy.</p>
          )}
          <p className="result-note">
            This is a public procurement signal, not legal advice or a conformity
            assessment.
          </p>
        </div>

        <div className="result-section">
          <div className="section-title-row">
            <h3>Evidence checks</h3>
            <span>Policy inputs</span>
          </div>
          <dl className="evidence-list">
            <div>
              <dt>Required tier</dt>
              <dd>Tier {result.requiredTier}</dd>
            </div>
            <div>
              <dt>Source consistency</dt>
              <dd className={consistencyTone}>{result.sourceConsistency}</dd>
            </div>
            <div>
              <dt>Provider</dt>
              <dd title={result.provider}>{shorten(result.provider)}</dd>
            </div>
            <div>
              <dt>Disclosure mask</dt>
              <dd>{result.disclosureMask} / {result.requiredMask}</dd>
            </div>
          </dl>
          <div className="result-links">
            <a href={result.modelCardUrl} target="_blank" rel="noreferrer">
              <BookOpen size={14} aria-hidden="true" />
              Model card
              <ExternalLink size={13} aria-hidden="true" />
            </a>
            <a href={result.systemCardUrl} target="_blank" rel="noreferrer">
              <FileText size={14} aria-hidden="true" />
              System card
              <ExternalLink size={13} aria-hidden="true" />
            </a>
            <a href={result.policyUrl} target="_blank" rel="noreferrer">
              Policy
              <ExternalLink size={13} aria-hidden="true" />
            </a>
            <a href={CONTRACT_URL} target="_blank" rel="noreferrer">
              Contract
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
