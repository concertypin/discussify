# Refine Feedback

Please refine the following user feedback. Translate it to Korean if it's not already, and format it into a structured JSON object with "title", "body", and "priority" fields. The priority should be one of "High", "Medium", or "Low".

## Example 1

Feedback: "UI가 복잡해요"
Output:
```json
{
  "title": "UI 복잡성 개선 제안",
  "body": "사용자로부터 UI가 복잡하다는 피드백이 있었습니다. 전체적인 디자인 단순화와 사용자 경험 개선이 필요해 보입니다.",
  "priority": "Low"
}
```

## Example 2

Feedback: "이거 들어갈 때 에러가 나요"
Output:
```json
{
  "title": "진입 시 발생하는 오류 보고",
  "body": "애플리케이션의 특정 섹션에 진입할 때 오류가 발생한다는 보고가 있었습니다. 긴급한 조사가 필요합니다.",
  "priority": "High"
}
```
