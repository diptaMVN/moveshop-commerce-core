import { IsArray, ValidateNested, IsString } from "class-validator"
import { Request, Response } from "express"
import { Type } from "class-transformer"
import { EntityManager } from "typeorm"

import { ProductBatchSalesChannel } from "../../../../types/sales-channels"
import PublishableApiKeyService from "../../../../services/publishable-api-key"

/**
 * @oas [post] /admin/publishable-api-keys/{id}/sales-channels/batch
 * operationId: "PostPublishableApiKeySalesChannelsChannelsBatch"
 * summary: "Add Sales Channels"
 * description: "Add a list of sales channels to a publishable API key."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Publishable Api Key.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostPublishableApiKeySalesChannelsBatchReq"
 * x-codegen:
 *   method: addSalesChannelsBatch
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.publishableApiKeys.addSalesChannelsBatch(publishableApiKeyId, {
 *         sales_channel_ids: [
 *           {
 *             id: channelId
 *           }
 *         ]
 *       })
 *       .then(({ publishable_api_key }) => {
 *         console.log(publishable_api_key.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/publishable-api-keys/{pak_id}/batch' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "sales_channel_ids": [
 *             {
 *               "id": "{sales_channel_id}"
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Publishable Api Keys
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPublishableApiKeysRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response): Promise<void> => {
  const validatedBody =
    req.validatedBody as AdminPostPublishableApiKeySalesChannelsBatchReq

  const { id } = req.params
  const store_id = req.query.store_id as string
  const publishableApiKeyService: PublishableApiKeyService = req.scope.resolve(
    "publishableApiKeyService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const publishableApiKey = await manager.transaction(
    async (transactionManager) => {
      await publishableApiKeyService
        .withTransaction(transactionManager)
        .addSalesChannels(
          id,
          validatedBody.sales_channel_ids.map((p) => p.id)
        )

      return await publishableApiKeyService.retrieve(store_id,id)
    }
  )

  res.status(200).json({ publishable_api_key: publishableApiKey })
}

/**
 * @schema AdminPostPublishableApiKeySalesChannelsBatchReq
 * type: object
 * required:
 *   - sales_channel_ids
 * properties:
 *   sales_channel_ids:
 *     description: The IDs of the sales channels to add to the publishable API key
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the sales channel
 */
export class AdminPostPublishableApiKeySalesChannelsBatchReq {
  @IsString()
  store_id: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBatchSalesChannel)
  sales_channel_ids: ProductBatchSalesChannel[]
}
