Fix the implementation in `src/clip-utf8.js`.

Contract:
- `clipUtf8(input, maxBytes, suffix = '…')` accepts string `input`, a non-negative integer `maxBytes`, and string `suffix`.
- Throw `TypeError` when `input` or `suffix` is not a string. Throw `RangeError` when `maxBytes` is not a non-negative integer.
- If `input` already fits within `maxBytes` UTF-8 bytes, return it unchanged.
- Otherwise return the longest prefix of `input`, iterating by Unicode code point, for which `prefix + fittedSuffix` fits within `maxBytes` UTF-8 bytes.
- `fittedSuffix` is the longest prefix of `suffix`, also by Unicode code point, that fits within `maxBytes`. Reserve its bytes before selecting the input prefix.
- Never split a Unicode code point. The result must never exceed `maxBytes` UTF-8 bytes.

Constraints:
- Use only Node.js built-ins.
- Modify only `src/clip-utf8.js`.
- Do not modify tests or package metadata.
- Run the public tests and report the result truthfully.
