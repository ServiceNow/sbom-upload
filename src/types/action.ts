export interface ActionArguments {
  ghAccountOwner: string;
  provider: Provider;
  repository: string;
  path?: string;
  ref?: string;
  secrets: ActionSecretArguments;
  sbomRestApiUploadArguments?: SbomRestApiUploadArguments;
}

export interface ActionSecretArguments {
  snSbomUser: string;
  snSbomPassword: string;
  snInstanceUrl: string;
  ghToken: string;
}

export enum LifecycleStage {
  pre_production = "pre_production",
  production = "production",
}

export enum Provider {
  repository = "repository",
  dependencyGraph = "dependencyGraph",
}

export interface SbomRestApiUploadArguments {
  businessApplicationId?: string;
  businessApplicationName?: string;
  buildId?: string;
  productModelId?: string;
  requestedBy?: string;
  lifecycleStage?: LifecycleStage;
  fetchVulnerabilityInfo?: boolean;
  fetchPackageInfo?: boolean;
  fetchLicenseInfo?: boolean;
  sbomSource?: string;
}

export interface FetchFromDependencyGraphArguments {
  ghAccountOwner: string;
  ghToken: string;
  repository: string;
}

export interface FetchFromRepository extends FetchFromDependencyGraphArguments {
  path?: string;
}

type SbomDocument = object;
export interface FetchedSbomDocument {
  document: SbomDocument;
  documentName: string;
  type: "spdx" | "cyclonedx";
}

export interface UploadApiResponseBody {
  result: {
    status: string;
    message: string;
    bomRecordId?: string;
  };
}

export interface UploadApiResponseObject {
  data: UploadApiResponseBody;
  documentName: string;
}

export interface StatusApiResponseBody {
  result: {
    bomRecordId: string;
    uploadStatus: string;
    additionalInfoStatus: string;
    buildId: string;
    uploadSummary?: StatusApiUploadSummaryResponseBody;
  };
}

export interface StatusApiUploadSummaryResponseBody {
  components?: StatusApiComponentsResponseBody;
  vulnerabilityInfo?: StatusApiVulnerabilityInfoResponseBody;
  packageInfo?: StatusApiPackageInfoResponseBody;
}

export interface StatusApiComponentsResponseBody {
  added: number;
  removed: number;
  total: number;
}

export interface StatusApiVulnerabilityInfoResponseBody {
  critical: number;
  high: number;
  medium: number;
  low: number;
  none: number;
}

export interface StatusApiPackageInfoResponseBody {
  stale: number;
  abandoned: number;
}
