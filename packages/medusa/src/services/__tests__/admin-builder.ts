import { EntityManager } from "typeorm"
import AdminBuilderService from "../admin-builder"
import { IAdminBuildersCreate } from "../../interfaces/admin-builder"
import EventBusService from "../event-bus"
import { MockManager, MockRepository } from "medusa-test-utils"
import { buildQuery } from "../../utils"
const createData: IAdminBuildersCreate = {
  property_id: "theme_name",
  value: "Apple Theme 4",
  type: "text",
  store_id: "1",
}
const eventBusServiceMock = {
  emit: jest.fn(),
  withTransaction: function () {
    return this
  },
} as unknown as EventBusService
const adminBuilderRepositoryMock = MockRepository({
  create: jest.fn().mockImplementation((data) => {
    return data
  }),
  save: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ ...data })
  }),
})
describe("AdminBuilderService", () => {
  const adminBuilderService = new AdminBuilderService({
    manager: MockManager,
    adminBuilderRepository: adminBuilderRepositoryMock,
    eventBusService: eventBusServiceMock,
  })

  describe("create", () => {
    it("should create a new admin builder", async () => {
      // Mocking behavior of the repository's save method
      const result = await adminBuilderService.create(createData)
      // Assertions
      expect(adminBuilderRepositoryMock.save).toHaveBeenCalledTimes(1) // Ensure save method of repository is called once
      expect(adminBuilderRepositoryMock.create).toHaveBeenCalledWith(createData)
      expect(result).toEqual(createData)
      expect(result.property_id).toEqual(createData.property_id)
      expect(result.store_id).toEqual(createData.store_id)
      expect(result.value).toEqual(createData.value)
      expect(result.type).toEqual(createData.type)
    })
  })
  describe("getByPropertyId", () => {
    it("should retrieve data by property id", async () => {
      const propertyId = "theme_name"
      const mockResult = {
        property_id: "theme_name",
        value: "Apple Theme 4",
        type: "text",
        store_id: "1",
      }

      // Mocking the behavior of the repository's findOne method
      adminBuilderRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValue(mockResult)

      const result = await adminBuilderService.getByPropertyId(propertyId)

      // Assertions
      expect(adminBuilderRepositoryMock.findOne).toHaveBeenCalledTimes(1)
      expect(adminBuilderRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { property_id: propertyId },
      })
      expect(result).toEqual(mockResult)
    })
  })
  // describe("get data by property id ", () => {
  //   it("should get data by id", async () => {
  //     // Mocking behavior of the repository's save method

  //     const result = await adminBuilderService.getByPropertyId("theme_name2")
  //     console.log(result, "Line 57")

  //     expect(result).toEqual(createData)
  //     // expect(result.property_id).toEqual(createData.property_id)
  //     // expect(result.store_id).toEqual(createData.store_id)
  //     // expect(result.value).toEqual(createData.value)
  //     // expect(result.type).toEqual(createData.type)
  //   })
  // })
})
