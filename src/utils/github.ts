import { SignJWT, importPKCS8 } from "jose";

interface InstallationTokenResponse {
    token: string;
}

interface GraphQLResponse<T> {
    data: T;
}

interface RepositoryData {
    repository: {
        id: string;
    };
}

interface CreateDiscussionData {
    createDiscussion: {
        discussion: {
            url: string;
        };
    };
}

async function createJwt(appId: string, privateKey: string): Promise<string> {
    const pkcs8Key = await importPKCS8(privateKey, "RS256");

    return await new SignJWT({})
        .setProtectedHeader({ alg: "RS256", typ: "JWT" })
        .setIssuer(appId)
        .setIssuedAt(Math.floor(Date.now() / 1000) - 60)
        .setExpirationTime(Math.floor(Date.now() / 1000) + 10 * 60)
        .sign(pkcs8Key);
}

async function getInstallationAccessToken(
    appId: string,
    installationId: string,
    jwt: string
): Promise<string> {
    const response = await fetch(
        `https://api.github.com/app/installations/${installationId}/access_tokens`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "cloudflare-worker-feedback-app",
            },
        }
    );

    const data = await response.json<InstallationTokenResponse>();
    if (!data.token) {
        throw new Error(
            `Failed to get installation access token: ${JSON.stringify(data)}`
        );
    }
    return data.token;
}

async function getRepositoryId(
    repository: string,
    token: string
): Promise<string> {
    const [owner, repo] = repository.split("/");
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "cloudflare-worker-feedback-app",
        },
        body: JSON.stringify({
            query: `
                query($owner: String!, $repo: String!) {
                    repository(owner: $owner, name: $repo) {
                        id
                    }
                }
            `,
            variables: { owner, repo },
        }),
    });
    const data = await response.json<GraphQLResponse<RepositoryData>>();
    return data.data.repository.id;
}

export async function createGithubDiscussion(
    appId: string,
    installationId: string,
    privateKey: string,
    repository: string,
    categoryId: string,
    title: string,
    body: string
): Promise<string> {
    const jwt = await createJwt(appId, privateKey);
    const token = await getInstallationAccessToken(appId, installationId, jwt);
    const repositoryId = await getRepositoryId(repository, token);

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "cloudflare-worker-feedback-app",
        },
        body: JSON.stringify({
            query: `
                mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
                    createDiscussion(input: {
                        repositoryId: $repositoryId,
                        categoryId: $categoryId,
                        title: $title,
                        body: $body
                    }) {
                        discussion {
                            url
                        }
                    }
                }
            `,
            variables: { repositoryId, categoryId, title, body },
        }),
    });

    const data = await response.json<GraphQLResponse<CreateDiscussionData>>();
    if (!data.data || !data.data.createDiscussion) {
        throw new Error(
            `Failed to create GitHub discussion: ${JSON.stringify(data)}`
        );
    }
    return data.data.createDiscussion.discussion.url;
}
