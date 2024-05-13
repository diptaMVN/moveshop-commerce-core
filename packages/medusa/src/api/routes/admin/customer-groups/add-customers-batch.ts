import { Request, Response } from "express"

import { CustomerGroupService } from "../../../../services"
import { CustomerGroupsBatchCustomer } from "../../../../types/customer-groups"
import { EntityManager } from "typeorm"
import { Type } from "class-transformer"
import { ValidateNested , IsString} from "class-validator"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/customer-groups/{id}/customers/batch
 * operationId: "PostCustomerGroupsGroupCustomersBatch"
 * summary: "Add Customers to Group"
 * description: "Add a list of customers to a customer group."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the customer group.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostCustomerGroupsGroupCustomersBatchReq"
 * x-codegen:
 *   method: addCustomers
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.customerGroups.addCustomers(customerGroupId, {
 *         customer_ids: [
 *           {
 *             id: customerId
 *           }
 *         ]
 *       })
 *       .then(({ customer_group }) => {
 *         console.log(customer_group.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import {
 *         useAdminAddCustomersToCustomerGroup,
 *       } from "medusa-react"
 *
 *       type Props = {
 *         customerGroupId: string
 *       }
 *
 *       const CustomerGroup = ({ customerGroupId }: Props) => {
 *         const addCustomers = useAdminAddCustomersToCustomerGroup(
 *           customerGroupId
 *         )
 *         // ...
 *
 *         const handleAddCustomers= (customerId: string) => {
 *           addCustomers.mutate({
 *             customer_ids: [
 *               {
 *                 id: customerId,
 *               },
 *             ],
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default CustomerGroup
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/customer-groups/{id}/customers/batch' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "customer_ids": [
 *               {
 *                   "id": "cus_01G2Q4BS9GAHDBMDEN4ZQZCJB2"
 *               }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Customer Groups
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCustomerGroupsRes"
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

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const store_id = req.query.store_id as string
  req.body.store_id = store_id
  const validated = await validator(
    AdminPostCustomerGroupsGroupCustomersBatchReq,
    req.body
  )

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const customer_group = await manager.transaction(
    async (transactionManager) => {
      return await customerGroupService
        .withTransaction(transactionManager)
        .addCustomers(
            store_id,
          id,
          validated.customer_ids.map(({ id }) => id)
        )
    }
  )

  res.status(200).json({ customer_group })
}

/**
 * @schema AdminPostCustomerGroupsGroupCustomersBatchReq
 * type: object
 * description: "The customers to add to the customer group."
 * required:
 *   - customer_ids
 * properties:
 *   customer_ids:
 *     description: "The ids of the customers to add"
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: ID of the customer
 *           type: string
 */
export class AdminPostCustomerGroupsGroupCustomersBatchReq {
  @ValidateNested({ each: true })
  @Type(() => CustomerGroupsBatchCustomer)
  customer_ids: CustomerGroupsBatchCustomer[]

  @IsString()
  store_id: string
}
