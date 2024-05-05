import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { BaseEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { Store } from "./store"
@Entity()
export class AdminBuilder extends BaseEntity {
  @Index()
  @Column({ type: "varchar", nullable: true })
  property_id: string

  @Column({ type: "varchar", nullable: true })
  type: string

  @Column({ type: "varchar", nullable: true })
  value: string

  @Column()
  store_id: string
  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  @BeforeInsert()
  generateId() {
    // Generate the id using the generateEntityId function
    this.id = generateEntityId(this.id, "adminBuilder")
  }
}
