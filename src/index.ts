import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { describeRoute, openAPIRouteHandler } from "hono-openapi";
import feedback from "./route";
import type { HonoType } from "./types";

let app = new Hono<HonoType>();

app = app.use("*", (c, next) => {
    return cors({
        origin: c.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()),
        allowHeaders: ["Content-Type", "Authorization", "X-CF-Turnstile-Token"],
    })(c, next);
});
app = app.use(
    "*",
    bodyLimit({
        maxSize: 1024 * 2, // 2KB, feedback is all plaintext
    })
);
app = app.use("*", (c, next) => {
    const allowedOrigins = c.env.ALLOWED_ORIGINS.split(",").map((origin) =>
        origin.trim()
    );
    return csrf({
        origin: allowedOrigins,
    })(c, next);
});
app = app.use(
    "*",
    secureHeaders({
        strictTransportSecurity: false,
    })
);

app = app.get(
    "/",
    describeRoute({
        description: "Oh hi",
    }),
    (c) => c.text("Oh hi! This is the Discussify API.")
);
app = app.route("/feedback", feedback);
app = app.get(
    "/openapi.json",
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: "Discussify API",
                version: "1.0.0",
                description:
                    "API for Discussify, a feedback collection tool using GitHub Discussions.",
            },
        },
    })
);

app = app.get("/docs", Scalar({ url: "/openapi.json" }));

export default app;
