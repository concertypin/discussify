export async function verifyTurnstile(secretKey: string, token: string): Promise<void> {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            secret: secretKey,
            response: token,
        }),
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error("Turnstile verification failed.");
    }
}
