import { createJwt } from "./crypto";

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

async function getInstallationAccessToken(
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

    const data = (await response.json()) satisfies InstallationTokenResponse;
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
    const data =
        (await response.json()) satisfies GraphQLResponse<RepositoryData>;
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
    const token = await getInstallationAccessToken(installationId, jwt);
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
