# Discussify

Discussify is a feedback collection service that automates the process of creating GitHub Discussions from user feedback. It is built to run on Cloudflare Workers and leverages a powerful AI-driven workflow to triage and refine submissions.

## Features

-   **Seamless Feedback Submission:** A simple `POST` endpoint for easy integration with any frontend application.
-   **AI-Powered Triage:** Uses Google's Gemini Pro to intelligently determine if feedback is actionable, filtering out noise.
-   **AI-Powered Refinement:** Automatically translates, polishes, and prioritizes feedback, generating a clean title and body for the discussion.
-   **Secure GitHub Integration:** Authenticates using a GitHub App to create discussions on behalf of the application, not a user.
-   **Spam Protection:** Integrated with Cloudflare Turnstile to prevent automated spam.
-   **Secure by Design:** Includes CSRF protection, secure headers, and a configurable CORS policy.
-   **Interactive API Documentation:** Provides a beautiful, interactive API reference powered by Scalar, available at the `/docs` endpoint.

## API Reference

### Submit Feedback

Creates a new GitHub Discussion from the provided feedback.

-   **Method:** `POST`
-   **Endpoint:** `/feedback`
-   **Headers:**
    -   `Content-Type: text/plain`
    -   `X-CF-Turnstile-Token: <Your-Turnstile-Token>`
-   **Body:**
    -   Raw text of the user's feedback.

### Interactive Documentation

For a detailed and interactive API reference, please visit the `/docs` endpoint of the deployed application.

## Configuration

This application is configured entirely through environment variables and secrets. The method for setting them depends on whether you are running in a local development environment or deploying to production.

### Local Development

For local development using `wrangler dev`, you should create a `.dev.vars` file in the root of the project. Wrangler will automatically load all key-value pairs from this file as environment variables.

**Important:** The `.dev.vars` file is included in `.gitignore` by default and should never be committed to version control.

**Example `.dev.vars` file:**

```ini
# Cloudflare Turnstile
TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA"

# Google Gemini API
GEMINI_API_KEY="AIzaSy..."

# GitHub App
GITHUB_APP_ID="123456"
GITHUB_APP_INSTALLATION_ID="12345678"
GITHUB_REPOSITORY="owner/repo-name"
GITHUB_DISCUSSION_CATEGORY_ID="DIC_kwDO..."
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
```

### Production Deployment

When deploying to your Cloudflare account, you should use a combination of `vars` in your `wrangler.jsonc` file for non-sensitive configuration and encrypted secrets for sensitive credentials.

**1. Configure `wrangler.jsonc` (`vars`)**

Add the non-sensitive variables to the `vars` section of your `wrangler.jsonc`.

```json
{
    "name": "discussify",
    "main": "src/index.ts",
    "compatibility_date": "2023-10-30",
    "vars": {
        "GITHUB_APP_ID": "123456",
        "GITHUB_APP_INSTALLATION_ID": "12345678",
        "GITHUB_REPOSITORY": "owner/repo",
        "GITHUB_DISCUSSION_CATEGORY_ID": "DIC_kwDO...",
        "ALLOWED_ORIGINS": "https://your-frontend-domain.com"
    }
}
```

**2. Set Production Secrets**

The following values should be set as encrypted secrets using the Wrangler CLI.

| Secret                   | Description                                                                                             | Command                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `TURNSTILE_SECRET_KEY`   | The secret key for your Cloudflare Turnstile site.                                                      | `wrangler secret put TURNSTILE_SECRET_KEY`        |
| `GEMINI_API_KEY`         | Your API key for the Google Gemini Pro API.                                                             | `wrangler secret put GEMINI_API_KEY`              |
| `GITHUB_APP_PRIVATE_KEY` | The private key for your GitHub App.                                                                    | `wrangler secret put GITHUB_APP_PRIVATE_KEY`      |

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](./LICENSE) file for details.
