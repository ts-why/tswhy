import { Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";

import "@std/dotenv/load";

interface GitPerson {
  name: string;
  email: string;
  date?: string;
}

interface CreatePROptions {
  title: string;
  body: string;
  head: string;
  author: GitPerson;
  files: Record<string, string | null>;
}

const GH_OWNER = Deno.env.get("GH_OWNER") ?? "ts-why";
const GH_REPO = Deno.env.get("GH_REPO") ?? "tswhy";
const GH_TOKEN = Deno.env.get("GH_TOKEN") ?? "";

const PluggedOctokit = Octokit.plugin(createPullRequest);

const octokit = new PluggedOctokit({
  auth: GH_TOKEN,
});

export async function getUser(username: string) {
  return (await octokit.rest.users.getByUsername({ username })).data;
}

export async function createPR(
  { title, body, head, author, files }: CreatePROptions,
) {
  return (await octokit.createPullRequest({
    owner: GH_OWNER,
    repo: GH_REPO,
    title,
    body,
    head,
    changes: {
      files,
      commit: title,
      author,
      committer: {
        email: "124547674+tswhy-bot@users.noreply.github.com",
        name: "tswhy? bot",
      },
    },
    update: true,
  }))?.data;
}
