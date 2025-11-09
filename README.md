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

This application is configured entirely through environment variables and secrets. Below is a detailed guide for setting up your `wrangler.jsonc` file.

### Environment Variables (`vars`)

| Variable                        | Description                                                                                                                              | Example                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `TURNSTILE_SECRET_KEY`          | The secret key for your Cloudflare Turnstile site.                                                                                       | `1x0000000000000000000000000000000AA` |
| `GEMINI_API_KEY`                | Your API key for the Google Gemini Pro API.                                                                                              | `AIzaSy...`                           |
| `GITHUB_APP_ID`                 | The App ID of your GitHub App.                                                                                                           | `123456`                              |
| `GITHUB_APP_INSTALLATION_ID`    | The Installation ID for your GitHub App's installation in the target repository.                                                         | `12345678`                            |
| `GITHUB_REPOSITORY`             | The full name of the repository where discussions will be created.                                                                       | `owner/repo-name`                     |
| `GITHUB_DISCUSSION_CATEGORY_ID` | The GraphQL Node ID of the discussion category. [Learn how to find this ID](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions#finding-the-node-id-of-a-discussion-category). | `DIC_kwDO...`                         |
| `ALLOWED_ORIGINS`               | A comma-separated list of origins that are allowed to make requests.                                                                     | `https://example.com,http://localhost:3000` |

### Secrets

| Secret                   | Description                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| `GITHUB_APP_PRIVATE_KEY` | The private key for your GitHub App, used to authenticate with the GitHub API. This should be kept secure. |

### Example `wrangler.jsonc`

```json
{
    "name": "discussify",
    "main": "src/index.ts",
    "compatibility_date": "2023-10-30",
    "vars": {
        "TURNSTILE_SECRET_KEY": "your-turnstile-secret-key",
        "GEMINI_API_KEY": "your-gemini-api-key",
        "GITHUB_APP_ID": "your-github-app-id",
        "GITHUB_APP_INSTALLATION_ID": "your-github-app-installation-id",
        "GITHUB_REPOSITORY": "owner/repo",
        "GITHUB_DISCUSSION_CATEGORY_ID": "your-github-discussion-category-id",
        "ALLOWED_ORIGINS": "https://your-frontend-domain.com"
    }
}
```

To set the `GITHUB_APP_PRIVATE_KEY` secret, run the following command:

```sh
npx wrangler secret put GITHUB_APP_PRIVATE_KEY
```

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](./LICENSE) file for details.
