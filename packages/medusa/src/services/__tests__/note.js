import { IdMap, MockManager, MockRepository } from "medusa-test-utils"

import { EventBusServiceMock } from "../__mocks__/event-bus"
import NoteService from "../note"

describe("NoteService", () => {
  describe("list", () => {
    const noteRepo = MockRepository({
      find: (q) => {
        return Promise.resolve([
          { id: IdMap.getId("note"), value: "some note" },
        ])
      },
      findAndCount: (q) => {
        return Promise.resolve([
          [{ id: IdMap.getId("note"), value: "some note" }],
          1,
        ])
      },
    })

    const noteService = new NoteService({
      manager: MockManager,
      noteRepository: noteRepo,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls note model functions", async () => {
      await noteService.list(
        "1",
        { resource_id: IdMap.getId("note") },
        {
          relations: ["author"],
        }
      )

      expect(noteRepo.findAndCount).toHaveBeenCalledTimes(1)
      expect(noteRepo.findAndCount).toHaveBeenCalledWith({
        where: { store_id: "1" },
        relations: { author: true },
      })
    })
  })

  describe("retrieve", () => {
    const noteRepo = MockRepository({
      findOne: (q) => {
        switch (q.where.id) {
          case IdMap.getId("note"):
            return Promise.resolve({
              id: IdMap.getId("note"),
              value: "some note",
            })
          default:
            return Promise.resolve()
        }
      },
    })

    const noteService = new NoteService({
      manager: MockManager,
      noteRepository: noteRepo,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls note model functions", async () => {
      await noteService.retrieve("1", IdMap.getId("note"), {
        relations: ["author"],
      })

      expect(noteRepo.findOne).toHaveBeenCalledTimes(1)
      expect(noteRepo.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("note") },
        relations: { author: true },
      })
    })

    it("fails when note is not found", async () => {
      await expect(
        noteService.retrieve("1", IdMap.getId("not-existing"))
      ).rejects.toThrow(
        `Note with id: ${IdMap.getId("not-existing")} was not found.`
      )
    })
  })

  describe("create", () => {
    const note = {
      id: IdMap.getId("note"),
      author_id: IdMap.getId("user"),
      store_id: "1",
    }

    const noteRepo = MockRepository({
      create: (f) => note,
      save: (f) => Promise.resolve(note),
    })

    const noteService = new NoteService({
      manager: MockManager,
      noteRepository: noteRepo,
      eventBusService: EventBusServiceMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls note model functions", async () => {
      await noteService.create({
        resource_id: IdMap.getId("resource-id"),
        resource_type: "type",
        value: "my note",
        author_id: IdMap.getId("user"),
        store_id: "1",
      })

      expect(noteRepo.create).toHaveBeenCalledTimes(1)
      expect(noteRepo.create).toHaveBeenCalledWith({
        resource_id: IdMap.getId("resource-id"),
        resource_type: "type",
        value: "my note",
        author_id: IdMap.getId("user"),
        metadata: {},
        store_id: "1",
      })

      expect(noteRepo.save).toHaveBeenCalledTimes(1)
      expect(noteRepo.save).toHaveBeenCalledWith({
        id: IdMap.getId("note"),
        author_id: IdMap.getId("user"),
        store_id: "1",
      })

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        NoteService.Events.CREATED,
        { id: IdMap.getId("note") }
      )
    })
  })

  describe("update", () => {
    const note = { id: IdMap.getId("note"), store_id: "1" }

    const noteRepo = MockRepository({
      findOne: (f) => Promise.resolve(note),
      save: (f) => Promise.resolve(note),
    })

    const noteService = new NoteService({
      manager: MockManager,
      noteRepository: noteRepo,
      eventBusService: EventBusServiceMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls note model functions", async () => {
      await noteService.update("1", IdMap.getId("note"), "new note")

      expect(noteRepo.save).toHaveBeenCalledTimes(1)
      expect(noteRepo.save).toHaveBeenCalledWith({
        ...note,
        value: "new note",
      })

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        NoteService.Events.UPDATED,
        { id: IdMap.getId("note") }
      )
    })
  })

  describe("delete", () => {
    const note = { id: IdMap.getId("note") }

    const noteRepo = MockRepository({
      softRemove: (f) => Promise.resolve(),
      findOne: (f) => Promise.resolve(note),
    })

    const noteService = new NoteService({
      manager: MockManager,
      noteRepository: noteRepo,
      eventBusService: EventBusServiceMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls note model functions", async () => {
      await noteService.delete("1", IdMap.getId("note"))

      expect(noteRepo.softRemove).toHaveBeenCalledTimes(1)
      expect(noteRepo.softRemove).toHaveBeenCalledWith(note)

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        NoteService.Events.DELETED,
        { id: IdMap.getId("note") }
      )
    })
  })
})
