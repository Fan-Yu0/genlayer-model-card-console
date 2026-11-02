# Portal submission - Model Card Conformance Console

## Category

Developer -> Projects

## Contribution date

2026-11-02

## Title

Model Card Conformance Console

## Description (992/1000)

Model Card Conformance Console is a complete GenLayer application for AI model procurement. Providers register a model card, system card, buyer policy, risk-tier ceiling, and required disclosure set; anyone can run a validator-backed assessment. The contract fetches all three official sources, uses validator consensus on a constrained evidence record, and records a deterministic APPROVED, CONDITIONAL, or REJECTED decision. The console handles the full transaction lifecycle: wallet signing, submitted hash, finalization, execution result checks, and a fresh read. It displays the risk tier, disclosure mask, missing disclosures, source consistency, and round. The interface also offers public read-only inspection, Explorer links, responsive layouts, and a live sample. The repository includes contract source, tests, documentation, and GitHub Pages deployment. Writes use standard eth_sendTransaction after switching the wallet to gasless StudioNet; no MetaMask Snaps plugin is required.

## Links

- Website: https://Fan-Yu0.github.io/genlayer-model-card-console/
- Repository: https://github.com/Fan-Yu0/genlayer-model-card-console
- Contract: https://explorer-studio.genlayer.com/address/0x20e1Bf44997dC3Bf89A776f95dB672fD712e1a5e
- Underlying gate repo: https://github.com/Fan-Yu0/genlayer-model-card-gate

## Live sample

- model_id: google/gemma-2-9b-it
- decision: APPROVED (decision = 1)
- risk tier: limited (2), required tier ceiling 3
- disclosure mask: 47 (required 15), missing mask 0
- source consistency: consistent
- round: 1
