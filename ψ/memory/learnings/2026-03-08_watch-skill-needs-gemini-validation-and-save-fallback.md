# Watch Skill Needs Gemini Validation and Save Fallback

The `/watch` workflow should not treat "prompt sent to Gemini" as equivalent to "learning captured successfully." In practice, the reliable pipeline has four separate checkpoints: resolve the actual script path in the current environment, confirm Gemini produced a usable response body, capture the conversation URL for traceability, and preserve a durable note even if the official save helper fails. During this session, the flow only became trustworthy after querying the Gemini tab directly and manually saving the learning note because `save-learning.ts` appears to contain a broken `SLUGS_FILE` reference.

The important pattern is that captions are not merely a fallback transcript source. They also serve as operational verification that the session still has recoverable content if the Gemini response is partial, delayed, or summarized differently than requested. That makes the best `/watch` design a validated, multi-path ingestion flow rather than a single optimistic automation path.

If this skill is going to remain dependable, it should explicitly check for transcript-body presence, record the Gemini conversation URL automatically, and fall back to a concise retained note when the save helper or response shape fails.
