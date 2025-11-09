# Is this feedback actionable?

Respond with a JSON object with a single key "actionable" which is a boolean.

## Examples

- "팬이에요" -> `{"actionable": false}`
- "UI가 복잡해요" -> `{"actionable": true}`
- "이거 들어갈 때 에러가 나요" -> `{"actionable": true}`
- "설정 어떻게 해요" -> `{"actionable": false}`
