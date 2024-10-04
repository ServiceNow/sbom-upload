import {
  ActionArguments,
  FetchedSbomDocument,
  UploadApiResponseBody,
  UploadApiResponseObject,
} from "@/src/types/action";

import * as core from "@actions/core";
import * as uploadUtils from "./upload";
import * as process from "node:process";

export function generateUploadUrl(actionArguments: ActionArguments) {
  let { sbomRestApiUploadArguments } = actionArguments;
  let uploadSearchParams = new URLSearchParams();
  Object.entries(sbomRestApiUploadArguments ?? {})
    .filter(([_, value]) => !!value)
    .forEach(([key, value]) => {
      uploadSearchParams.append(key, value);
    });

  let url = new URL(
    "/api/sbom/core/upload",
    actionArguments.secrets.snInstanceUrl,
  );
  url.search = uploadSearchParams.toString();

  console.log(url.toString());

  return url;
}

export async function upload(
  actionArguments: ActionArguments,
  payload: FetchedSbomDocument,
) {
  console.log("Uploading SBOM to ServiceNow...");

  let uploadUrl = generateUploadUrl(actionArguments);
  let { snSbomUser, snSbomPassword } = actionArguments.secrets;

  let uploadOperationResponseObject = (await uploadUtils._performUpload(
    uploadUrl,
    snSbomUser,
    snSbomPassword,
    payload.document,
    payload.documentName,
  )) as UploadApiResponseObject;

  let successfulEnqueue =
    uploadOperationResponseObject.data.result.status === "success";

  process.env.NODE_ENV !== "test" &&
    (await core.summary
      .addHeading("Upload Status")
      .addQuote(
        `${successfulEnqueue ? "✅ Successfully enqueued SBOM..." : "❌ Could not successfully enqueue SBOM..."}`,
      )
      .addTable([
        ((headers) =>
          successfulEnqueue
            ? [...headers, { data: "BOM Record ID", header: true }]
            : headers)([
          { data: "Status", header: true },
          { data: "Message", header: true },
        ]),
        ((data) =>
          successfulEnqueue
            ? [
                ...data,
                `${uploadOperationResponseObject.data.result.bomRecordId}`,
              ]
            : data)([
          `${uploadOperationResponseObject.data.result.status}`,
          `${uploadOperationResponseObject.data.result.message}`,
        ]),
      ])
      .write());

  return uploadOperationResponseObject;
}

export async function _performUpload(
  uploadUrl: URL,
  snSbomUser: string,
  snSbomPassword: string,
  document: any,
  documentName: string,
) {
  return await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(snSbomUser + ":" + snSbomPassword).toString("base64")}`,
    },
    body: JSON.stringify(document),
  })
    .then((response) => response.json())
    .then(
      (data) =>
        ({
          data: data as UploadApiResponseBody,
          documentName: documentName,
        }) as UploadApiResponseObject,
    )
    .catch((error) => {
      core.warning(`An error occurred while uploading SBOM: ${error.message}`);
      throw error;
    });
}
