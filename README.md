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

For local development, you should create a `.dev.vars` file in the root of the project. Wrangler will automatically load all key-value pairs from this file as environment variables.

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
#### How to get Github Discussion ID
Change `{OWNER}` and `{REPO}` with your repository's owner and name respectively, then run the following command in your terminal to list the discussion categories and their IDs:
```bash
gh api graphql -F owner={OWNER} -F repo={REPO} -f query='
query($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    discussionCategories(first: 20) {
      nodes {
        id
        name
      }
    }
  }
}
'
```
### Production Deployment
When deploying to production using `wrangler publish`, you should set the required environment variables and secrets. Just use `wrangler secret bulk .prod.vars` to set multiple secrets at once from a file.

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](./LICENSE) file for details.
