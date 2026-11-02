# Model Card Conformance Console

A complete GenLayer application for AI model procurement. A provider registers a
model card, a system card, a buyer policy, and a required disclosure set, then
anyone can run a validator-backed assessment. The contract fetches the three
official sources, uses validator consensus on a constrained evidence record, and
records a deterministic **APPROVED / CONDITIONAL / REJECTED** decision.

This console is the frontend for the deployed
[`genlayer-model-card-gate`](https://github.com/Fan-Yu0/genlayer-model-card-gate)
Intelligent Contract. GenLayer is central to the workflow: the risk tier and
disclosure mask are extracted from live web sources inside a nondeterministic
block, and independent validators re-fetch the same evidence before consensus.

## What it does

1. **Register** a model with its model card URL, system card URL, buyer policy
   URL, a risk-tier ceiling, and the required disclosure set.
2. **Assess** the model. The contract renders the model card, system card, and
   policy, asks an LLM to extract only the risk tier, a disclosure mask, source
   consistency, and a short summary, then computes the decision deterministically.
3. **Inspect** the on-chain record: decision, risk tier, disclosure mask, missing
   disclosures, source consistency, and the round number.

## Decision logic

- Source inconsistency or insufficient evidence -> **REJECTED**
- Risk tier above the policy ceiling -> **REJECTED**
- Required disclosures missing -> **CONDITIONAL**
- Everything within policy -> **APPROVED**

Disclosures tracked: intended use, limitations, training data, evaluation, human
oversight, security, environmental impact.

## Live contract

- Contract: `0x20e1Bf44997dC3Bf89A776f95dB672fD712e1a5e`
- Explorer: https://explorer-studio.genlayer.com/address/0x20e1Bf44997dC3Bf89A776f95dB672fD712e1a5e
- Network: GenLayer StudioNet (gasless)

## Develop

```bash
npm install
npm run dev        # local dev server
npm run check      # lint + tests + production build
npm run deploy     # build + publish to GitHub Pages
```

## Stack

React + TypeScript + Vite + `genlayer-js`. Writes use standard
`eth_sendTransaction` after the app adds and switches the wallet to StudioNet, so
any EIP-1193 wallet works and no MetaMask Snaps plugin is required.
