// import { SetupDetailsNotFound } from '../errors'
import { TIntegrationConfig, EAuthType } from '../auth/v3/types'

interface ICommonUserAttributes {
  serviceName: string
  userId: string
  updatedAt: number
  setupId: string
  scopes?: any
  tokenResponseJSON?: string
  callbackParamsJSON?: string
  connectParams?: any
}

export type TOAuth1UserAttributes = ICommonUserAttributes & {
  accessToken: string
  tokenSecret: string
  consumerKey?: string
  consumerSecret?: string
  expiresIn: number
}

export type TOAuth2UserAttributes = ICommonUserAttributes & {
  accessToken: string
  clientID?: string
  clientSecret?: string
  refreshToken?: string
  expiresIn?: number
  idToken?: string
  idTokenJwt?: any
}

// const nameUserId = ({ clientId, buid, authId }: { clientId: string; buid: string; authId: string }) =>
//   [clientId, buid, authId].join(':')

// interface IAuthParams {
//   servicesTableName: string
//   clientId: string
//   buid: string
//   authId: string
// }

export type TAuthUserAttributes = TOAuth1UserAttributes | TOAuth2UserAttributes

// export const updateAuthV3 = async ({
//   servicesTableName,
//   clientId,
//   buid,
//   authId,
//   userAttributes
// }: IAuthParams & { userAttributes: TAuthUserAttributes }) => {
//   const { UpdateExpression, ExpressionAttributeValues } = buildExpression(userAttributes)
//   const updateParams = {
//     UpdateExpression,
//     ExpressionAttributeValues,
//     TableName: servicesTableName,
//     Key: {
//       nameUserId: nameUserId({ clientId, buid, authId })
//     }
//   }

//   await dynamoDb.update(updateParams).promise()
// }

// export const revokeAuthV3 = async ({ servicesTableName, clientId, buid, authId }: IAuthParams) => {
//   const revokeParams = {
//     TableName: servicesTableName,
//     Key: {
//       nameUserId: nameUserId({ clientId, buid, authId })
//     }
//   }

//   await dynamoDb.delete(revokeParams).promise()
// }

// tslint:disable-next-line:max-line-length
// export const getAuth = async <T = TAuthUserAttributes>({ servicesTableName, clientId, buid, authId }: IAuthParams) => {
//   const getParams = {
//     TableName: servicesTableName,
//     Key: {
//       nameUserId: nameUserId({ clientId, buid, authId })
//     }
//   }

//   const item = (await dynamoDb.get(getParams).promise()).Item

//   return item as T | undefined
// }

export const getConfig = async ({ buid }: { buid: string }) => {
  let item = {} as any
  try {
    item = require(`../functions/integrations/${buid}.json`)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return false
    }
  }

  const configItem = item.config as TIntegrationConfig

  if (configItem.authType) {
    configItem.authType = configItem.authType.toUpperCase() as EAuthType
  }

  return { ...configItem, requestConfig: item.request }
}

// export const getConfigV3 = async ({
//   integrationConfigTableName,
//   buid
// }: {
//   integrationConfigTableName: string
//   buid: string
// }) => {
//   const getParams = {
//     TableName: integrationConfigTableName,
//     Key: {
//       integrationUuid: buid
//     }
//   }

//   const configItem = (await dynamoDb.get(getParams).promise()).Item as TIntegrationConfig | undefined

//   if (!configItem) {
//     throw new InvalidBuid(buid)
//   }

//   if (configItem.authType) {
//     configItem.authType = configItem.authType.toUpperCase() as EAuthType
//   }

//   return configItem
// }

// export const getSetupDetails = async ({
//   scopedUserDataTableName,
//   clientId,
//   buid,
//   setupId
// }: {
//   scopedUserDataTableName: string
//   clientId: string
//   buid: string
//   setupId: string
// }) => {
//   const params = {
//     TableName: scopedUserDataTableName,
//     Key: {
//       referenceId: setupId,
//       scopeId: [clientId, buid].join(':')
//     }
//   }

//   const setupItem = (await dynamoDb.get(params).promise()).Item

//   if (!setupItem) {
//     throw new SetupDetailsNotFound({ clientId, buid, setupId })
//   }

//   // following this change https://github.com/Bearer/bearer/pull/606
//   // the data are now scoped and we need to use data
//   return setupItem.data || setupItem
// }

// export const saveSetupDetails = async ({
//   scopedUserDataTableName,
//   clientId,
//   buid,
//   setupId,
//   data
// }: {
//   scopedUserDataTableName: string
//   clientId: string
//   buid: string
//   setupId: string
//   data: any
// }) => {
//   const params = {
//     TableName: scopedUserDataTableName,
//     Item: {
//       data,
//       referenceId: setupId,
//       scopeId: [clientId, buid].join(':')
//     }
//   }

//   await dynamoDb.put(params).promise()
// }

// type TMap = { [key: string]: any }
// function buildExpression(attributesMap: TMap) {
//   const expression: string[] = []
//   const removeExpression: string[] = []
//   const attributes: TMap = {}
//   for (const [key, value] of Object.entries(attributesMap)) {
//     if (value === undefined) {
//       removeExpression.push(key)
//     } else {
//       expression.push(`${key}=:${key}`)
//       attributes[`:${key}`] = value
//     }
//   }

//   const removeExpressionStr = removeExpression.length > 0 ? ` remove ${removeExpression.join(', ')}` : ''

//   return {
//     UpdateExpression: `set ${expression.join(', ')}${removeExpressionStr}`,
//     ExpressionAttributeValues: attributes
//   }
// }