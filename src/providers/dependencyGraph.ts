import { ActionArguments, FetchedSbomDocument, FetchFromDependencyGraphArguments } from '@/src/types/action'
import { allPropertiesDefined } from '@/src/utils/utils'
import {
  FETCH_DEPENDENCY_GRAPH_STATUS_404,
  FETCH_DEPENDENCY_GRAPH_STATUS_403,
  INVALID_ARGS_FOR_DEPENDENCY_GRAPH_FETCH
} from '@/src/types/errors'
import * as utils from '@/src/providers/requestBuilder'

export async function fetchFromDependencyGraph(
  actionArguments: ActionArguments
): Promise<FetchedSbomDocument | undefined> {
  let requestArguments: FetchFromDependencyGraphArguments = {
    ghAccountOwner: actionArguments.ghAccountOwner,
    ghToken: actionArguments.secrets.ghToken,
    repository: actionArguments.repository
  }

  if (!allPropertiesDefined<FetchFromDependencyGraphArguments>(requestArguments)) {
    throw new Error(INVALID_ARGS_FOR_DEPENDENCY_GRAPH_FETCH.message)
  }

  let response = await new utils.RequestBuilder()
    .url(
      new URL(
        `https://api.github.com/repos/${requestArguments.ghAccountOwner}/${requestArguments.repository}/dependency-graph/sbom`
      )
    )
    .header('Accept', 'application/vnd.github+json')
    .header('Authorization', `Bearer ${requestArguments.ghToken}`)
    .header('X-GitHub-Api-Version', '2022-11-28')
    .build()

  let body = await response.json()

  if (response.status === 404) {
    throw new Error(FETCH_DEPENDENCY_GRAPH_STATUS_404(JSON.stringify(body)).message)
  } else if (response.status === 403) {
    throw new Error(FETCH_DEPENDENCY_GRAPH_STATUS_403(JSON.stringify(body)).message)
  } else {
    return { document: body.sbom, documentName: body.sbom.name, type: 'spdx' }
  }
}
