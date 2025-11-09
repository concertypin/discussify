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

#### Example Request

```http
POST /feedback HTTP/1.1
Host: your-worker-url.com
Content-Type: text/plain
X-CF-Turnstile-Token: 0x4AAAAAAAC3M2VK4w7p48s

The settings page is not loading correctly. It just shows a blank screen.
```

#### Success Response

-   **Code:** `200 OK`
-   **Content:**
    ```json
    {
      "url": "https://github.com/your-org/your-repo/discussions/123"
    }
    ```

### Interactive Documentation

For a detailed and interactive API reference, please visit the `/docs` endpoint of the deployed application.

## Configuration

The application is configured through environment variables and secrets in the `wrangler.jsonc` file. You will need to provide keys for:

-   Cloudflare Turnstile
-   Google Gemini API
-   GitHub App (ID, Installation ID, Private Key, Repository, and Discussion Category ID)
-   Allowed Origins for CORS

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](./LICENSE) file for details.
