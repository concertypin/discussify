import { describeRoute, resolver, validator } from "hono-openapi";
import z from "zod";

import { handleFeedback } from "./feedback-handler";
import { Hono } from "hono";
import type { HonoType } from "./types";

let app = new Hono<HonoType>();

const feedbackRoute: Parameters<typeof describeRoute>["0"] = {
    requestBody: {
        content: {
            "text/plain": {
                example: "Setting page is not loading properly.",
            },
        },
    },
    description: "Submit user feedback which creates a GitHub discussion.",
    responses: {
        200: {
            description: "Successful response",
            content: {
                "application/json": {
                    schema: resolver(
                        z.object({
                            url: z
                                .url()
                                .describe(
                                    "The URL of the created GitHub discussion."
                                ),
                        })
                    ),
                },
            },
        },
        400: {
            description: "Bad request",
            content: {
                "application/json": {
                    schema: resolver(
                        z.object({
                            error: z.string(),
                        })
                    ),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: resolver(
                        z.object({
                            error: z.string(),
                        })
                    ),
                },
            },
        },
    },
};

app = app.post(
    "/",
    describeRoute(feedbackRoute),
    validator(
        "header",
        z.object({
            "X-CF-Turnstile-Token": z
                .string()
                .describe("The Turnstile token from the client."),
        })
    ),
    async (c) => {
        const feedback = await c.req.text();
        const turnstileToken = c.req.header("X-CF-Turnstile-Token");

        if (!turnstileToken) {
            return c.json({ error: "Turnstile token is missing." }, 400);
        }
        try {
            const result = await handleFeedback(
                c.env,
                feedback,
                turnstileToken
            );
            return c.json({ url: result });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.";
            return c.json({ error: message }, 500);
        }
    }
);

export default app;
