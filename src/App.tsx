import {
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Info,
  ShieldCheck,
  TerminalSquare,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { RegisterPanel } from './components/RegisterPanel'
import { AssessPanel } from './components/AssessPanel'
import { AssessmentResult } from './components/AssessmentResult'
import { TransactionBanner } from './components/TransactionBanner'
import {
  CONTRACT_URL,
  POLICY_REFERENCE_URL,
  SAMPLE_FORM,
  SAMPLE_MODEL_ID,
  SOURCE_URL,
} from './config'
import { useWallet } from './hooks/useWallet'
import { assessModel, readAssessment, registerModel } from './lib/contract'
import {
  hasErrors,
  validateModelForm,
  validateModelId,
  type FormErrors,
} from './lib/validation'
import type {
  ModelAssessment,
  ModelForm,
  Notice,
  TransactionState,
} from './types'
import './App.css'

function App() {
  const wallet = useWallet()
  const [registerForm, setRegisterForm] = useState<ModelForm>(SAMPLE_FORM)
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({})
  const [assessId, setAssessId] = useState(SAMPLE_MODEL_ID)
  const [assessError, setAssessError] = useState<string>()
  const [assessment, setAssessment] = useState<ModelAssessment | null>(null)
  const [reading, setReading] = useState(true)
  const [transaction, setTransaction] = useState<TransactionState>({
    phase: 'idle',
  })
  const [notice, setNotice] = useState<Notice | null>(null)

  const busy =
    transaction.phase === 'preparing' ||
    transaction.phase === 'signing' ||
    transaction.phase === 'submitted'

  async function loadRecord(modelId: string, announce = true) {
    const error = validateModelId(modelId)
    if (error) {
      setAssessError(error)
      return
    }

    setAssessError(undefined)
    setReading(true)
    if (announce) setNotice(null)
    try {
      const result = await readAssessment(modelId)
      setAssessment(result)
      if (!result && announce) {
        setNotice({ tone: 'info', message: 'No model record was found.' })
      }
    } catch (cause) {
      setNotice({
        tone: 'error',
        message:
          cause instanceof Error
            ? cause.message
            : 'Could not read the contract state.',
      })
    } finally {
      setReading(false)
    }
  }

  useEffect(() => {
    let active = true
    readAssessment(SAMPLE_MODEL_ID)
      .then((result) => {
        if (active) setAssessment(result)
      })
      .catch((cause) => {
        if (!active) return
        setNotice({
          tone: 'error',
          message:
            cause instanceof Error
              ? cause.message
              : 'Could not read the sample model.',
        })
      })
      .finally(() => {
        if (active) setReading(false)
      })
    return () => {
      active = false
    }
  }, [])

  function updateForm(field: keyof ModelForm, value: string) {
    setRegisterForm((current) => ({ ...current, [field]: value }) as ModelForm)
    setRegisterErrors((current) => ({ ...current, [field]: undefined }))
  }

  function toggleDisclosure(key: string, checked: boolean) {
    setRegisterForm((current) => {
      const next = new Set(current.disclosures)
      if (checked) next.add(key)
      else next.delete(key)
      return { ...current, disclosures: Array.from(next) }
    })
    setRegisterErrors((current) => ({ ...current, disclosures: undefined }))
  }

  function phaseHandler(action: 'register' | 'assess') {
    return (
      phase: TransactionState['phase'],
      message: string,
      hash?: string,
    ) => {
      setTransaction({ phase, action, message, hash })
    }
  }

  async function handleRegister() {
    const errors = validateModelForm(registerForm)
    setRegisterErrors(errors)
    if (hasErrors(errors)) return
    if (!wallet.address) {
      setNotice({ tone: 'error', message: 'Connect a wallet first.' })
      return
    }

    setNotice(null)
    setTransaction({
      phase: 'preparing',
      action: 'register',
      message: 'Preparing registration.',
    })
    try {
      await registerModel(wallet.address, registerForm, phaseHandler('register'))
      const normalizedId = registerForm.modelId.trim().toLowerCase()
      setAssessId(normalizedId)
      setNotice({
        tone: 'success',
        message: 'Model registered. Run an assessment when ready.',
      })
      await loadRecord(normalizedId, false)
    } catch (cause) {
      setTransaction({
        phase: 'error',
        action: 'register',
        message: cause instanceof Error ? cause.message : 'Registration failed.',
      })
    }
  }

  async function handleAssess() {
    const error = validateModelId(assessId)
    setAssessError(error ?? undefined)
    if (error) return
    if (!wallet.address) {
      setNotice({ tone: 'error', message: 'Connect a wallet first.' })
      return
    }

    setNotice(null)
    setTransaction({
      phase: 'preparing',
      action: 'assess',
      message: 'Preparing assessment.',
    })
    try {
      await assessModel(wallet.address, assessId, phaseHandler('assess'))
      setNotice({
        tone: 'success',
        message: 'Assessment finalized and recorded on GenLayer Studio.',
      })
      await loadRecord(assessId, false)
    } catch (cause) {
      setTransaction({
        phase: 'error',
        action: 'assess',
        message: cause instanceof Error ? cause.message : 'Assessment failed.',
      })
    }
  }

  return (
    <div className="app-shell">
      <Header
        address={wallet.address}
        connecting={wallet.connecting}
        hasProvider={wallet.hasProvider}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
      />

      {notice && (
        <div className={'notice notice-' + notice.tone} role="status">
          {notice.tone === 'success' ? (
            <CheckCircle2 size={17} aria-hidden="true" />
          ) : (
            <Info size={17} aria-hidden="true" />
          )}
          <span>{notice.message}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      )}

      <main className="main-content">
        <section className="page-heading">
          <div>
            <p className="eyebrow">AI model procurement workbench</p>
            <h1>Model Card Conformance Console</h1>
            <p>
              Register a model card, run a validator-backed assessment, and
              inspect the deterministic disclosure-conformance decision.
            </p>
          </div>
          <div className="heading-meta">
            <span>
              <ShieldCheck size={16} aria-hidden="true" />
              Consensus-backed
            </span>
            <span>
              <TerminalSquare size={16} aria-hidden="true" />
              Real contract writes
            </span>
          </div>
        </section>

        <TransactionBanner state={transaction} />

        <div className="workbench-grid">
          <RegisterPanel
            form={registerForm}
            errors={registerErrors}
            busy={busy}
            connected={Boolean(wallet.address)}
            onChange={updateForm}
            onToggleDisclosure={toggleDisclosure}
            onReset={() => {
              setRegisterForm(SAMPLE_FORM)
              setRegisterErrors({})
            }}
            onSubmit={handleRegister}
          />
          <AssessPanel
            modelId={assessId}
            error={assessError}
            busy={busy}
            reading={reading}
            connected={Boolean(wallet.address)}
            result={assessment}
            onChange={(value) => {
              setAssessId(value)
              setAssessError(undefined)
            }}
            onRead={() => void loadRecord(assessId)}
            onAssess={handleAssess}
            onSample={() => {
              setAssessId(SAMPLE_MODEL_ID)
              void loadRecord(SAMPLE_MODEL_ID)
            }}
          />
        </div>

        <AssessmentResult result={assessment} reading={reading} />

        <section className="reference-band">
          <div className="reference-intro">
            <p className="eyebrow">How the gate decides</p>
            <h2>One record, three procurement states.</h2>
            <p>
              The contract fetches the model card, system card, and buyer policy
              in a validator-backed nondeterministic block. The final decision
              is deterministic: tier ceiling, required disclosures, and source
              consistency.
            </p>
          </div>
          <div className="policy-list">
            <div>
              <span className="policy-dot clear" />
              <div>
                <strong>Approved</strong>
                <p>Required disclosures present within the policy tier.</p>
              </div>
            </div>
            <div>
              <span className="policy-dot review" />
              <div>
                <strong>Conditional</strong>
                <p>Required disclosures missing; complete before use.</p>
              </div>
            </div>
            <div>
              <span className="policy-dot blocked" />
              <div>
                <strong>Rejected</strong>
                <p>Tier exceeds policy, or evidence conflicts / is insufficient.</p>
              </div>
            </div>
          </div>
          <div className="reference-links">
            <a href={SOURCE_URL} target="_blank" rel="noreferrer">
              <GitBranch size={16} aria-hidden="true" />
              Contract source
            </a>
            <a href={POLICY_REFERENCE_URL} target="_blank" rel="noreferrer">
              <BadgeCheck size={16} aria-hidden="true" />
              NIST AI RMF
            </a>
            <a href={CONTRACT_URL} target="_blank" rel="noreferrer">
              <ExternalLink size={16} aria-hidden="true" />
              Deployed contract
            </a>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>Model Card Conformance Console</span>
        <span>Built on GenLayer StudioNet</span>
      </footer>
    </div>
  )
}

export default App
