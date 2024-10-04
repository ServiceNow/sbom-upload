import { ErrorObject } from "ajv";

interface SbomActionError {
  message: string;
}

type AjvError =
  | ErrorObject<string, Record<string, any>, unknown>[]
  | null
  | undefined;

export const UNABLE_TO_RESOLVE_SCHEMA = {
  message: "Unable to identify which schema to validate.",
} as SbomActionError;
export const INVALID_INPUT_VALUES = (errors: AjvError): SbomActionError => ({
  message: `The provided input values are invalid. Please review inputs before continuing: ${JSON.stringify(errors)}`,
});
export const INVALID_ARGS_FOR_DEPENDENCY_GRAPH_FETCH = {
  message:
    "Missing required argument for generating SBOM from target repository.",
} as SbomActionError;
export const FETCH_DEPENDENCY_GRAPH_STATUS_404 = (
  error: string,
): SbomActionError => ({
  message: `Could not find supplied resource: ${error}`,
});
export const FETCH_DEPENDENCY_GRAPH_STATUS_403 = (
  error: string,
): SbomActionError => ({
  message: `Could not find access supplied resource: ${error}`,
});

export const INVALID_ARGS_FOR_REPOSITORY_FETCH = {
  message:
    "Missing required argument for generating SBOM from target repository.",
} as SbomActionError;

export const REQUEST_BUILDER_ERROR_INSUFFICIENT_DATA = (
  error: string,
): SbomActionError => ({
  message: `Could not successfully build request due to insufficient data: ${error}`,
});

export const REQUEST_STATUS_ERROR_INSUFFICIENT_DATA = (
  error: string,
): SbomActionError => ({
  message: `Could not perform status API request due to insufficient data: ${error}`,
});
