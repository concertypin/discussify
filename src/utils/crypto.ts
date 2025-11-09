import { importPKCS8, SignJWT } from "jose";

/**
 * Imports a PEM-formatted RSA private key for signing.
 */
export async function importPrivateKey(pemKey: string) {
    return await importPKCS8(pemKey.replaceAll(" RSA", ""), "RS256");
}
export async function createJwt(
    appId: string,
    privateKey: string
): Promise<string> {
    console.log("Creating JWT for GitHub App authentication.");
    const pkcs8Key = await importPrivateKey(privateKey);
    console.log("Private key imported successfully.");
    return await new SignJWT({})
        .setProtectedHeader({ alg: "RS256", typ: "JWT" })
        .setIssuer(appId)
        //.setIssuedAt(Math.floor(Date.now() / 1000) - 60)
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(pkcs8Key)
        .finally(() => console.log("JWT signed successfully."));
}
