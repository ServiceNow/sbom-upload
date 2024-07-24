import { ActionArguments, FetchedSbomDocument, Provider } from '@/src/types/action'
import * as dependencyGraphProvider from '@/src/providers/dependencyGraph'
import * as repositoryProvider from '@/src/providers/repository'

export async function arbitrate(actionArguments: ActionArguments) {
  const { provider } = actionArguments
  let documentTuple: FetchedSbomDocument | undefined

  if (provider === Provider.dependencyGraph) {
    documentTuple = await dependencyGraphProvider.fetchFromDependencyGraph(actionArguments)
  } else if (provider === Provider.repository) {
    documentTuple = await repositoryProvider.fetchFromRepository(actionArguments)
  } else {
    documentTuple = undefined
  }

  return documentTuple
}
