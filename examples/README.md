# Live example inputs

Use these values in the deployed Studio contract and in the console:

- model_id: google/gemma-2-9b-it
- model_card_url: https://huggingface.co/google/gemma-2-9b-it
- system_card_url: https://arxiv.org/html/2408.00118
- policy_url: https://www.nist.gov/itl/ai-risk-management-framework
- required_tier: 3
- required_mask: 15  (intended_use | limitations | training_data | evaluation)

The recorded live assessment returned APPROVED (decision = 1), risk tier
limited, disclosure_mask = 47, missing_mask = 0, source_consistency = consistent,
round = 1.
