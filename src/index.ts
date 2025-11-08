import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { handleFeedback } from './feedback-handler';
import { Scalar } from '@scalar/hono-api-reference';

type Bindings = {
    TURNSTILE_SECRET_KEY: string;
    OPENAI_API_KEY: string;
    GITHUB_APP_ID: string;
    GITHUB_APP_INSTALLATION_ID: string;
    GITHUB_APP_PRIVATE_KEY: string;
    GITHUB_REPOSITORY: string;
    GITHUB_DISCUSSION_CATEGORY_ID: string;
};

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.use('*', cors());

const feedbackRoute = createRoute({
    method: 'post',
    path: '/',
    request: {
        headers: z.object({
            'X-CF-Turnstile-Token': z.string().openapi({
                example: '0x4AAAAAAAC3M2VK4w7p48s',
            }),
        }),
        body: {
            content: {
                'text/plain': {
                    schema: z.string().openapi({
                        example: '이거 들어갈 때 에러가 나요',
                    }),
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: z.object({
                        url: z.string().url(),
                    }),
                },
            },
        },
        400: {
            description: 'Bad request',
            content: {
                'application/json': {
                    schema: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
        500: {
            description: 'Internal server error',
            content: {
                'application/json': {
                    schema: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
    },
});

app.openapi(feedbackRoute, async (c) => {
    const feedback = await c.req.text();
    const turnstileToken = c.req.header('X-CF-Turnstile-Token');

    if (!turnstileToken) {
        return c.json({ error: 'Turnstile token is missing.' }, 400);
    }

    try {
        const result = await handleFeedback(c.env, feedback, turnstileToken);
        return c.json({ url: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return c.json({ error: message }, 500);
    }
});

app.doc('/openapi.json', {
    info: {
        title: 'Feedback API',
        version: '1.0.0',
    },
    openapi: '3.1.0',
});

app.get('/docs', Scalar({ url: '/openapi.json' }));

export default app;
