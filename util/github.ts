import { Octokit } from "octokit";
import { type Api } from "@octokit/plugin-rest-endpoint-methods";
import { createPullRequest } from "octokit-plugin-create-pull-request";

import "@std/dotenv/load";

type CreatePullRequest = ReturnType<typeof createPullRequest>;

export interface GitPerson {
  /** @description The name of the author (or committer) of the commit */
  name: string;
  /** @description The email of the author (or committer) of the commit */
  email: string;
  /**
   * Format: date-time
   * @description Indicates when this commit was authored (or committed). This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
   */
  date?: string;
}

const GH_OWNER = globalThis.Deno?.env.get("GH_OWNER") ?? "ts-why";
const GH_REPO = globalThis.Deno?.env.get("GH_REPO") ?? "tswhy";
const GH_TOKEN = globalThis.Deno?.env.get("GH_TOKEN") ?? "";

const PluggedOctokit = Octokit.plugin(createPullRequest);

const octokit: Api & CreatePullRequest = new PluggedOctokit({
  auth: GH_TOKEN,
});

export interface CreatePROptions {
  title: string;
  body: string;
  head: string;
  author: GitPerson;
  files: Record<string, string | null>;
}

export async function getUser(username: string) {
  return (await octokit.rest.users.getByUsername({ username })).data;
}

/** Create a PR by creating a branch and committing the files as changes. */
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
  }))?.data ?? undefined;
}
