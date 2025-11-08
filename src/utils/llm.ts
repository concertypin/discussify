import triagePrompt from '../triage_prompt.md';
import refinePrompt from '../refine_prompt.md';

async function callLlm(apiKey: string, prompt: string, userInput: string): Promise<any> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4o",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: userInput },
            ],
        }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

export async function triageFeedback(apiKey: string, feedback: string): Promise<boolean> {
    const response = await callLlm(apiKey, triagePrompt, feedback);
    return response.actionable;
}

export async function refineFeedback(apiKey: string, feedback:string): Promise<{ title: string, body: string, priority: string }> {
    const response = await callLlm(apiKey, refinePrompt, feedback);
    return {
        title: response.title,
        body: response.body,
        priority: response.priority,
    };
}
