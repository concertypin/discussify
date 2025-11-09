import type { HonoType } from "./types";
import { createGithubDiscussion } from "./utils/github";
import { refineFeedback, triageFeedback } from "./utils/llm";
import { verifyTurnstile } from "./utils/turnstile";

export async function handleFeedback(
    env: HonoType["Bindings"],
    feedback: string,
    turnstileToken: string
): Promise<string> {
    await verifyTurnstile(env.TURNSTILE_SECRET_KEY, turnstileToken);

    const isActionable = await triageFeedback(env.GEMINI_API_KEY, feedback);
    if (!isActionable) {
        throw new Error("Feedback is not actionable.");
    }

    const { title, body, priority } = await refineFeedback(
        env.GEMINI_API_KEY,
        feedback
    );

    const discussionBody = `**Priority:** ${priority}\n\n${body}`;

    const discussionUrl = await createGithubDiscussion(
        env.GITHUB_APP_ID,
        env.GITHUB_APP_INSTALLATION_ID,
        env.GITHUB_APP_PRIVATE_KEY,
        env.GITHUB_REPOSITORY,
        env.GITHUB_DISCUSSION_CATEGORY_ID,
        title,
        discussionBody
    );

    return discussionUrl;
}
