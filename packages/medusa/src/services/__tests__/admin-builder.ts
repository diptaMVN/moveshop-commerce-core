import AdminBuilderService from "../admin-builder"
import { IAdminBuildersCreate } from "../../interfaces/admin-builder"
import EventBusService from "../event-bus"
import { MockManager, MockRepository } from "medusa-test-utils"
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

  describe("get", () => {
    it("should retrieve all admin builder data", async () => {
      const mockResults = [
        {
          property_id: "theme_color",
          value: "blue",
          type: "text",
          store_id: "1",
        },
        {
          property_id: "font_size",
          value: "16px",
          type: "text",
          store_id: "2",
        },
      ]

      // Mocking the behavior of the repository's find method
      adminBuilderRepositoryMock.find = jest.fn().mockResolvedValue(mockResults)

      const results = await adminBuilderService.get()

      // Assertions
      expect(adminBuilderRepositoryMock.find).toHaveBeenCalledTimes(1)
      expect(results).toEqual(mockResults)
    })
  })

  describe("update", () => {
    it("should update existing admin builder data", async () => {
      const propertyId = "theme_color"
      const updateData = {
        property_id: "theme_color",
        value: "red",
        type: "text",
        store_id: "1",
      }

      const mockExistingData = {
        property_id: "theme_color",
        value: "blue",
        type: "text",
        store_id: "1",
      }

      // Mocking the behavior of the service's getByPropertyId method
      adminBuilderService.getByPropertyId = jest
        .fn()
        .mockResolvedValue(mockExistingData)

      // Mocking the behavior of the repository's save method
      adminBuilderRepositoryMock.save = jest
        .fn()
        .mockImplementation((data) => Promise.resolve(data))

      const result = await adminBuilderService.update(updateData, propertyId)

      // Assertions
      expect(adminBuilderService.getByPropertyId).toHaveBeenCalledTimes(1)
      expect(adminBuilderService.getByPropertyId).toHaveBeenCalledWith(
        propertyId
      )
      expect(adminBuilderRepositoryMock.save).toHaveBeenCalledTimes(1)
      expect(adminBuilderRepositoryMock.save).toHaveBeenCalledWith({
        ...mockExistingData,
        ...updateData,
      })
      expect(result).toEqual({
        ...mockExistingData,
        ...updateData,
      })
    })

    it("should return null if no existing data is found", async () => {
      const propertyId = "non_existent_id"
      const updateData = {
        property_id: "non_existent_id",
        value: "red",
        type: "text",
        store_id: "1",
      }

      // Mocking the behavior of the service's getByPropertyId method
      adminBuilderService.getByPropertyId = jest.fn().mockResolvedValue(null)

      const result = await adminBuilderService.update(updateData, propertyId)

      // Assertions
      expect(adminBuilderService.getByPropertyId).toHaveBeenCalledTimes(1)
      expect(adminBuilderService.getByPropertyId).toHaveBeenCalledWith(
        propertyId
      )
      expect(result).toBeNull()
    })
  })
})
