import { AdminBuilderRepository } from "./../repositories/admin-builder"
import { EntityManager } from "typeorm"
import { AdminBuilder } from "../models/admin-builder"
import { TransactionBaseService } from "../interfaces"
import { buildQuery } from "../utils"
import { IAdminBuildersCreate } from "../interfaces/admin-builder"
import EventBusService from "./event-bus"
type InjectedDependencies = {
  manager: EntityManager
  adminBuilderRepository: typeof AdminBuilderRepository
  eventBusService: EventBusService
}

class AdminBuilderService extends TransactionBaseService {
  protected readonly adminRepository_: typeof AdminBuilderRepository
  protected readonly eventBusService_: EventBusService
  constructor({
    adminBuilderRepository,
    eventBusService,
  }: InjectedDependencies) {
    super(arguments[0])
    this.adminRepository_ = adminBuilderRepository
    this.eventBusService_ = eventBusService
  }

  async create(createData: IAdminBuildersCreate) {
    const adminBuilderRepository = this.activeManager_.withRepository(
      this.adminRepository_
    )
    try {
      // Exist
      const exist = await this.update(createData, createData.property_id)
      if (exist) {
        exist.property_id = createData.property_id
        exist.type = createData.type
        exist.value = createData.value
        exist.store_id = createData.store_id
        const result = await adminBuilderRepository.save(exist)
        return result
      } else {
        const data = adminBuilderRepository.create(createData)
        const result = await adminBuilderRepository.save(data)
        return result
      }
    } catch (error: any) {
      throw error
    }
  }
  async update(createData: IAdminBuildersCreate, property_id: string) {
    const adminBuilderRepository = this.activeManager_.withRepository(
      this.adminRepository_
    )
    try {
      const exist = await this.getByPropertyId(property_id)
      if (exist) {
        exist.property_id = createData.property_id
        exist.type = createData.type
        exist.value = createData.value

        const result = await adminBuilderRepository.save(exist)
        return result
      } else {
        // TODO: need to handle later
        return null
      }
    } catch (error: any) {
      throw error
    }
  }
  async get() {
    const adminBuilderRepository = this.activeManager_.withRepository(
      this.adminRepository_
    )
    try {
      const result = await adminBuilderRepository.find()

      return result
    } catch (error: any) {
      throw error
    }
  }

  async getByPropertyId(id: string) {
    const adminBuilderRepository = this.activeManager_.withRepository(
      this.adminRepository_
    )
    try {
      const query = buildQuery({ property_id: id })
      // console.log(adminBuilderRepository)
      const result = await adminBuilderRepository.findOne(query)

      return result
    } catch (error: any) {
      throw error
    }
  }
}

export default AdminBuilderService
