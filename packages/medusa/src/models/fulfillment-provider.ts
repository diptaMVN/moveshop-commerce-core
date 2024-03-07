import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { Store } from "./store"

@Entity()
export class FulfillmentProvider {
  // new added filed

  @Column({ type: "text", nullable: true })
  store_id: string | null

  @ManyToOne(() => Store, { onDelete: "CASCADE" })
  @JoinColumn({ name: "store_id" })
  store: Store
  @PrimaryColumn()
  id: string

  @Column({ default: true })
  is_installed: boolean
}

/**
 * @schema FulfillmentProvider
 * title: "Fulfillment Provider"
 * description: "A fulfillment provider represents a fulfillment service installed in the Medusa backend, either through a plugin or backend customizations.
 *  It holds the fulfillment service's installation status."
 * type: object
 * required:
 *   - id
 *   - is_installed
 * properties:
 *   id:
 *     description: The ID of the fulfillment provider as given by the fulfillment service.
 *     type: string
 *     example: manual
 *   is_installed:
 *     description: Whether the fulfillment service is installed in the current version. If a fulfillment service is no longer installed, the `is_installed` attribute is set to `false`.
 *     type: boolean
 *     default: true
 */
