import GithubProvider from "next-auth/providers/github";

export const options = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ""
        })
    ]
}