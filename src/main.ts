import * as core from "@actions/core";
import { setup } from "@/src/utils/setup";
import { validate } from "@/src/utils/validate";
import { SchemaType } from "@/src/types/schemas";
import { arbitrate } from "@/src/providers/arbitrator";
import dotenv from "dotenv";
import { upload } from "@/src/api/upload";
dotenv.config();
export var process: NodeJS.Process;

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const actionArguments = setup();
    await validate(actionArguments, SchemaType.action_inputs);

    let payload = await arbitrate(actionArguments);
    if (payload == undefined) {
      throw new Error(
        "Could not successfully fetch the SBOM document from the provider.",
      );
    }

    let uploadOperationResponseObject = await upload(actionArguments, payload);
    if (uploadOperationResponseObject.data.result.status !== "success") {
      core.setFailed("Could not upload SBOM to ServiceNow successfully.");
      if (uploadOperationResponseObject.data.result.message) {
        core.error(uploadOperationResponseObject.data.result.message);
      }
      return;
    }

    console.log("result", uploadOperationResponseObject);
    core.setOutput(
      "bomRecordId",
      uploadOperationResponseObject.data.result.bomRecordId,
    );
    core.setOutput("status", uploadOperationResponseObject.data.result.status);
    core.setOutput(
      "message",
      uploadOperationResponseObject.data.result.message,
    );
    core.setOutput(
      "apiResponseObject",
      JSON.stringify(uploadOperationResponseObject.data),
    );
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}
