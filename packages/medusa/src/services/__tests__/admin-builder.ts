import { EntityManager } from "typeorm"
import AdminBuilderService from "../admin-builder"
import { IAdminBuildersCreate } from "../../interfaces/admin-builder"
import EventBusService from "../event-bus"
import { MockManager, MockRepository } from "medusa-test-utils"
import { AdminBuilder } from "../../models/admin-builder"
const eventBusServiceMock = {
  emit: jest.fn(),
  withTransaction: function () {
    return this
  },
} as unknown as EventBusService

const adminBuilderRepositoryMock = MockRepository({
  save: jest.fn().mockImplementation((data) => {
    return Object.assign(new AdminBuilder(), data)
  }),
})

describe("AdminBuilderService", () => {
  const adminBuilderService = new AdminBuilderService({
    manager: MockManager,
    adminBuilderRepository: adminBuilderRepositoryMock,
    eventBusService: eventBusServiceMock,
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  const createData: IAdminBuildersCreate = {
    property_id: "theme_name",
    value: "Apple Theme 4",
    type: "text",
    store_id: "1",
  }
  describe("create", () => {
    it("should create a new admin builder", async () => {
      // Mocking behavior of the repository's save method
      await adminBuilderService.create(createData)
      // console.log(createData)
      // Assertions
      expect(adminBuilderRepositoryMock.save).toHaveBeenCalledTimes(1) // Ensure save method of repository is called once
      expect(adminBuilderRepositoryMock.create).toHaveBeenCalledWith(createData)
    })
  })
})
