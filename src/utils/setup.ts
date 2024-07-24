import * as core from '@actions/core'
import {
  ActionArguments,
  ActionSecretArguments,
  LifecycleStage,
  Provider,
  SbomRestApiUploadArguments
} from '../types/action'

/**
 * Assembles the requisite input arguments provided to the GitHub Action.
 * @returns {*} An object of secret and public arguments.
 */
export function setup(): ActionArguments {
  core.debug(`Collecting run time arguments...`)
  let actionArguments = _actionArguments()

  core.info(`Action Arguments: ${JSON.stringify(actionArguments, null, 2)}`)

  return actionArguments
}

export function _secretArguments(): ActionSecretArguments {
  return {
    snSbomUser: core.getInput('snSbomUser'),
    snSbomPassword: core.getInput('snSbomPassword'),
    snInstanceUrl: core.getInput('snInstanceUrl'),
    ghToken: core.getInput('ghToken')
  }
}

export function _sbomRestApiArguments(): SbomRestApiUploadArguments {
  return {
    businessApplicationId: core.getInput('businessApplicationId'),
    businessApplicationName: core.getInput('businessApplicationName'),
    buildId: core.getInput('buildId'),
    productModelId: core.getInput('productModelId'),
    requestedBy: core.getInput('requestedBy'),
    lifecycleStage: core.getInput('lifecycleStage') as LifecycleStage,
    fetchVulnerabilityInfo: core.getInput('fetchVulnerabilityInfo') === 'true',
    fetchPackageInfo: core.getInput('fetchPackageInfo') === 'true',
    sbomSource: core.getInput('sbomSource')
  }
}

export function _actionArguments(): ActionArguments {
  return {
    ghAccountOwner: core.getInput('ghAccountOwner'),
    provider: core.getInput('provider') as Provider,
    repository: core.getInput('repository'),
    path: core.getInput('path'),
    secrets: _secretArguments(),
    sbomRestApiUploadArguments: _sbomRestApiArguments()
  }
}
