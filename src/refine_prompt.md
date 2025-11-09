# Refine Feedback

Please refine the following user feedback. Translate it to English if it's not already, and format it into a structured JSON object with "title", "body", and "priority" fields. The priority should be one of "low", "medium", or "high" based on the urgency and impact of the feedback.

## Example 1

## Example 1

Feedback: "UI가 복잡해요"
Output:
```json
{
  "title": "UI Complexity Improvement Suggestion",
  "body": "There was feedback from users that the UI is complex. It seems necessary to simplify the overall design and improve user experience.",
  "priority": "low"
}
```

## Example 2

Feedback: "이거 들어갈 때 에러가 나요"
Output:
```json
{
  "title": "Error Report on Entry",
  "body": "There was a report that an error occurs when entering a specific section of the application. Urgent investigation is needed.",
  "priority": "high"
}
```
