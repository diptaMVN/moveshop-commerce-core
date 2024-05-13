import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import { ProductCategoryService } from "../../../../services"
import { FindParams } from "../../../../types/common"
import { AdminProductCategoriesReqBase } from "../../../../types/product-category"

/**
 * @oas [post] /admin/product-categories/{id}
 * operationId: "PostProductCategoriesCategory"
 * summary: "Update a Product Category"
 * description: "Updates a Product Category."
 * x-authenticated: true
 * x-featureFlag: "product_categories"
 * parameters:
 *   - (path) id=* {string} The ID of the Product Category.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each product category.
 *   - (query) fields {string} (Comma separated) Which fields should be retrieved in each product category.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductCategoriesCategoryReq"
 * x-codegen:
 *   method: update
 *   queryParams: AdminPostProductCategoriesCategoryParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productCategories.update(productCategoryId, {
 *         name: "Skinny Jeans"
 *       })
 *       .then(({ product_category }) => {
 *         console.log(product_category.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminUpdateProductCategory } from "medusa-react"
 *
 *       type Props = {
 *         productCategoryId: string
 *       }
 *
 *       const Category = ({
 *         productCategoryId
 *       }: Props) => {
 *         const updateCategory = useAdminUpdateProductCategory(
 *           productCategoryId
 *         )
 *         // ...
 *
 *         const handleUpdate = (
 *           name: string
 *         ) => {
 *           updateCategory.mutate({
 *             name,
 *           }, {
 *             onSuccess: ({ product_category }) => {
 *               console.log(product_category.id)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default Category
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/product-categories/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "Skinny Jeans"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Product Categories
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminProductCategoriesCategoryRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const store_id = req.query.store_id as string
  const { validatedBody } = req as {
    validatedBody: AdminPostProductCategoriesCategoryReq
  }

  const productCategoryService: ProductCategoryService = req.scope.resolve(
    "productCategoryService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const updated = await manager.transaction(async (transactionManager) => {
    return await productCategoryService
      .withTransaction(transactionManager)
      .update(store_id,id, validatedBody)
  })

  const productCategory = await productCategoryService.retrieve(
    store_id,
    updated.id,
    req.retrieveConfig
  )

  res.status(200).json({ product_category: productCategory })
}

/**
 * @schema AdminPostProductCategoriesCategoryReq
 * type: object
 * description: "The details to update of the product category."
 * properties:
 *   name:
 *     type: string
 *     description:  The name to identify the Product Category by.
 *   description:
 *     type: string
 *     description: An optional text field to describe the Product Category by.
 *   handle:
 *     type: string
 *     description:  A handle to be used in slugs.
 *   is_internal:
 *     type: boolean
 *     description: A flag to make product category an internal category for admins
 *   is_active:
 *     type: boolean
 *     description: A flag to make product category visible/hidden in the store front
 *   parent_category_id:
 *     type: string
 *     description: The ID of the parent product category
 *   rank:
 *     type: number
 *     description: The rank of the category in the tree node (starting from 0)
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
// eslint-disable-next-line max-len
export class AdminPostProductCategoriesCategoryReq extends AdminProductCategoriesReqBase {
  @IsString()
  @IsOptional()
  store_id?: string

  @IsString()
  @IsOptional()
  name?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  handle?: string

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  rank?: number

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostProductCategoriesCategoryParams extends FindParams {
  @IsString()
  store_id?: string
}
