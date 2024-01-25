import { IsEmail, IsOptional, IsString } from "class-validator"

import { MedusaError } from "medusa-core-utils"
import { User } from "../../../.."
import UserService from "../../../../services/user"
import _ from "lodash"
import jwt from "jsonwebtoken"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /admin/users/reset-password
 * operationId: "PostUsersUserPassword"
 * summary: "Reset Password"
 * description: "Reset the password of an admin User using their reset password token. A user must request to reset their password first before attempting to reset their
 * password with this request."
 * externalDocs:
 *   description: How to reset a user's password
 *   url: https://docs.medusajs.com/modules/users/admin/manage-profile#reset-password
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminResetPasswordRequest"
 * x-codegen:
 *   method: resetPassword
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.resetPassword({
 *         token: "supersecrettoken",
 *         password: "supersecret"
 *       })
 *       .then(({ user }) => {
 *         console.log(user.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/users/reset-password' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "token": "supersecrettoken",
 *           "password": "supersecret"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Users
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminUserRes"
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
export default async (req, res) => {
  const { store_id } = req.query
  const validated = await validator(AdminResetPasswordRequest, req.body)

  try {
    const userService: UserService = req.scope.resolve("userService")

    const decoded = jwt.decode(validated.token) as payload

    let user: User
    try {
      user = await userService.retrieveByEmail(store_id,
        validated.email || decoded?.email,
        {
          select: ["id", "password_hash"],
        }
      )
    } catch (err) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "invalid token")
    }

    const verifiedToken = jwt.verify(
      validated.token,
      user.password_hash
    ) as payload
    if (!verifiedToken || verifiedToken.user_id !== user.id) {
      res.status(401).send("Invalid or expired password reset token")
      return
    }

    const manager: EntityManager = req.scope.resolve("manager")
    const userResult = await manager.transaction(async (transactionManager) => {
      return await userService
        .withTransaction(transactionManager)
        .setPassword_(store_id,user.id, validated.password)
    })

    res.status(200).json({ user: _.omit(userResult, ["password_hash"]) })
  } catch (error) {
    if (error.message === "invalid token") {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error.message)
    }
    throw error
  }
}

export type payload = {
  store_id: string
  email: string
  user_id: string
  password: string
}

/**
 * @schema AdminResetPasswordRequest
 * type: object
 * required:
 *   - token
 *   - password
 * properties:
 *   email:
 *     description: "The User's email."
 *     type: string
 *     format: email
 *   token:
 *     description: "The password-reset token generated when the password reset was requested."
 *     type: string
 *   password:
 *     description: "The User's new password."
 *     type: string
 *     format: password
 */
export class AdminResetPasswordRequest {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  token: string

  @IsString()
  password: string
}
