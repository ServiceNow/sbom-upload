export enum SchemaType {
  action_inputs = "action_inputs",
}

/**
 * GitHub Content Tree
 */
export interface GitHubContentTree {
  type: string;
  size: number;
  name: string;
  path: string;
  content?: string;
  sha: string;
  url: string;
  git_url: string | null;
  html_url: string | null;
  download_url: string | null;
  _links: {
    git: string | null;
    html: string | null;
    self: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
