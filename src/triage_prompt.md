# Is this feedback actionable?

Respond with a JSON object with a single key "actionable" which is a boolean.
"actionable" means:
- The feedback describes a specific issue, bug, or feature request that can be addressed.
- The feedback provides enough context to understand the problem or request.
"actionable" does NOT mean:
- General praise or criticism without specific details.
- Questions or requests for help that do not indicate a problem with the product.
- Feedback that is vague or lacks context.
Your response must be a valid JSON object and nothing else.
The language of the feedback is not important. Only the content matters.

## Examples

- "팬이에요" -> `{"actionable": false}`
- "UI가 복잡해요" -> `{"actionable": true}`
- "이거 들어갈 때 에러가 나요" -> `{"actionable": true}`
- "설정 어떻게 해요" -> `{"actionable": false}`
