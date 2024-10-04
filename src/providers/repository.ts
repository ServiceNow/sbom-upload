import {
  ActionArguments,
  FetchedSbomDocument,
  FetchFromDependencyGraphArguments,
  FetchFromRepository,
} from "@/src/types/action";
import { allPropertiesDefined } from "@/src/utils/utils";
import * as utils from "@/src/providers/requestBuilder";
import { INVALID_ARGS_FOR_REPOSITORY_FETCH } from "@/src/types/errors";
import { GitHubContentTree } from "@/src/types/schemas";
import * as core from "@actions/core";

export async function fetchFromRepository(
  actionArguments: ActionArguments,
): Promise<FetchedSbomDocument | undefined> {
  let requestArguments: FetchFromRepository = {
    ghAccountOwner: actionArguments.ghAccountOwner,
    ghToken: actionArguments.secrets.ghToken,
    repository: actionArguments.repository,
    path: actionArguments.path,
  };

  if (!allPropertiesDefined<FetchFromRepository>(requestArguments)) {
    throw new Error(INVALID_ARGS_FOR_REPOSITORY_FETCH.message);
  }

  let url = new URL(
    `https://api.github.com/repos/${requestArguments.ghAccountOwner}/${requestArguments.repository}/contents/${actionArguments.path}`,
  );
  if (actionArguments.ref) {
    url.search = new URLSearchParams({ ref: actionArguments.ref }).toString();
  }

  let response = await new utils.RequestBuilder()
    .url(url)
    .header("Accept", "application/vnd.github+json")
    .header("Authorization", `Bearer ${requestArguments.ghToken}`)
    .header("X-GitHub-Api-Version", "2022-11-28")
    .build();

  if (response.status === 200) {
    let body: GitHubContentTree = await response.json();
    if (body.content == undefined) {
      core.setFailed("The contents of targeted SBOM is empty.");
      return;
    }
    if (body.type === "dir") {
      core.setFailed(
        `Action does not support directory paths. Please provide a path to a file.`,
      );
      return;
    } else if (body.type === "file") {
      if (body.download_url == undefined) {
        core.setFailed("Action is unable to download the targeted SBOM file.");
        return;
      }
      let document = await fetch(body.download_url).then((resp) => resp.json());
      return { document, documentName: body.name, type: "spdx" };
    } else {
      core.setFailed(
        `Action does not support uploading of targeted resource type: ${body.type}`,
      );
    }
  }
}
