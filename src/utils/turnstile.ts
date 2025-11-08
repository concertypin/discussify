export async function verifyTurnstile(
    secretKey: string,
    token: string
): Promise<void> {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            body: formData,
        }
    );
    const data = await response.json<TurnstileResponse>();
    if (!data.success) {
        throw new Error("Turnstile verification failed");
    }
}
type TurnstileResponse = TurnstileSuccessResponse | TurnstileErrorResponse;
interface TurnstileSuccessResponse {
    success: true;
    challenge_ts: string;
    hostname: string;
    "error-codes": never[];
    action: string;
    cdata: string;
    metadata?: {
        ephemeral_id?: string;
    };
}
interface TurnstileErrorResponse {
    success: false;
    "error-codes": string[];
}
