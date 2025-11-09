import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";
import refinePrompt from "../refine_prompt.md?raw";
import triagePrompt from "../triage_prompt.md?raw";

const priorityEnum = z
    .enum(["low", "medium", "high"])
    .describe(
        "The priority level of the feedback. Must be one of the following values, based on its description: " +
            "\n\n- 'low': Low priority, non-urgent feedback. (Example: Feature request, suggestion.)" +
            "\n- 'medium': Medium priority, should be addressed soon. (Example: UI glitch, minor error.)" +
            "\n- 'high': High priority, needs immediate attention. (Example: Data loss, security issue, critical bug. This type of feedback should be rare.)"
    )
    .default("low");
const refineSchema = z.object({
    title: z.string().describe("A concise title for the feedback."),
    body: z.string().describe("A detailed description of the feedback."),
    priority: priorityEnum,
});
const triageSchema = z.object({
    actionable: z
        .boolean()
        .describe(
            "Indicates whether the feedback is valid and actionable (true) or not (false)."
        ),
});
async function callLlm<T extends z.ZodType>({
    apiKey,
    prompt,
    userInput,
    jsonSchema,
    think = false,
    model = "gemini-flash-lite-latest",
}: {
    apiKey: string;
    prompt: string;
    userInput: string;
    jsonSchema: T;
    think?: boolean;
    model?: string;
}) {
    const google = createGoogleGenerativeAI({
        apiKey: apiKey,
    });
    const response = await generateObject<T>({
        model: google(model),
        schema: jsonSchema,
        messages: [
            { role: "system", content: prompt },
            { role: "user", content: userInput },
        ],
        providerOptions: {
            google: {
                thinkingConfig: {
                    thinkingBudget: think ? -1 : 0,
                },
            },
        },
    });
    return response.object;
}

export async function triageFeedback(
    apiKey: string,
    feedback: string
): Promise<boolean> {
    console.log("Triage feedback:", feedback);
    const response = await callLlm({
        apiKey,
        prompt: triagePrompt,
        userInput: feedback,
        jsonSchema: triageSchema,
        think: true,
        // Light model is sufficient for triage... maybe? idk
    });
    console.log("Triage response:", response);
    return response.actionable;
}

export async function refineFeedback(
    apiKey: string,
    feedback: string
): Promise<{ title: string; body: string; priority: string }> {
    console.log("Refine feedback:", feedback);
    const response = await callLlm({
        apiKey,
        prompt: refinePrompt,
        userInput: feedback,
        jsonSchema: refineSchema,
        think: true,
        model: "gemini-flash-latest", // More brain for refinement
    });
    console.log("Refine response:", response);
    return {
        title: response.title,
        body: response.body,
        priority: response.priority,
    };
}
