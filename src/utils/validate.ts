import { SchemaType } from '@/src/types/schemas'
import Ajv, { ErrorObject } from 'ajv'
import { INVALID_INPUT_VALUES, UNABLE_TO_RESOLVE_SCHEMA } from '@/src/types/errors'
import actionInputSchema from '../../static/actionInputSchema.json'
import * as core from '@actions/core'
import { process } from '@/src/main'
import { ActionArguments } from '@/src/types/action'

const ajv = new Ajv()

async function generateValidationErrorSummary(errors?: ErrorObject[] | null) {
  if (errors == undefined || errors.length === 0) {
    return
  }
  await core.summary
    .addHeading('Invalid runtime arguments')
    .addTable([
      [
        { data: 'Property Name', header: true },
        { data: 'Error Message', header: true }
      ],
      errors.flatMap(error => [`${error.instancePath.split('/').pop()}`, `${error.message}`])
    ])
    .write()
}

export async function validate(data: any, schema: SchemaType = SchemaType.action_inputs) {
  let jsonSchema

  switch (schema) {
    case SchemaType.action_inputs:
      jsonSchema = actionInputSchema
      break
    default:
      throw new Error(UNABLE_TO_RESOLVE_SCHEMA.message)
  }

  const validator = ajv.compile(jsonSchema)
  const isValid = validator(data)
  if (!isValid) {
    if (process && process.env.NODE_ENV !== 'test') await generateValidationErrorSummary(validator.errors)
    throw new Error(INVALID_INPUT_VALUES(validator.errors).message)
  }
  return isValid
}
