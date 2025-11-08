export type HonoType = {
    Bindings: {
        TURNSTILE_SECRET_KEY: string;
        GEMINI_API_KEY: string;
        GITHUB_APP_ID: string;
        GITHUB_APP_INSTALLATION_ID: string;
        GITHUB_APP_PRIVATE_KEY: string;
        GITHUB_REPOSITORY: string;
        GITHUB_DISCUSSION_CATEGORY_ID: string;

        ALLOWED_ORIGINS: string; // Comma-separated list of allowed origins for CORS
    };
};
