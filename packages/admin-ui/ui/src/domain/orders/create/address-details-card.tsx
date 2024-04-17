import { Pencil } from "@medusajs/icons"
import React, { useState } from "react"
import Modal from "../../../components/molecules/modal"
import InputField from "../../../components/molecules/input"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Button from "../../../components/fundamentals/button"
import { useNewOrderForm } from "../new/form"
import { useWatch } from "react-hook-form"
import useViewportSize from "../../../hooks/use-view-port-size"
import { Drawer } from "vaul"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"

type Field = {
  label: string
  value: string
  register: string
}

interface AddressDetails {
  title: string
  content: Field[]
}

const AddressDetailsCard: React.FC<AddressDetails> = ({ title, content }) => {
  const [isAddressDetailsModalOpen, setIsAddressDetailsModalOpen] =
    useState(false)

  const openModal = () => {
    setIsAddressDetailsModalOpen(true)
  }

  const closeModal = () => {
    setIsAddressDetailsModalOpen(false)
  }
    const {
      context: { validCountries },
      form,
    } = useNewOrderForm()

  /* Decide is it mobile */
  const {isMobile} = useViewportSize()

  return (
    <>
      <div className="border-t-2">
        <div className="my-2 flex items-center justify-between py-4">
          <div>
            <h2 className="text-[20px] font-bold">{title}</h2>
          </div>
          <div>
            <Pencil
              className="cursor-pointer"
              color="gray"
              onClick={openModal}
            />
          </div>
        </div>
        <div className="pb-2">
          {content.map((detail, index) => (
            <p key={index}>{detail.value}</p>
          ))}
        </div>
      </div>
      {isAddressDetailsModalOpen && !isMobile && (
        <Modal open={isAddressDetailsModalOpen} handleClose={closeModal}>
          <Modal.Header
            className="h-[56px]"
            iconClass="self-center"
            handleClose={closeModal}
          >
            <div className="flex items-end justify-center gap-2 ">
              <PlusIcon size={20} />
              <p className="font-bold">{title}</p>
            </div>
          </Modal.Header>
          <Modal.Body className="!w-[780px] p-6">
            <div className="mb-4 grid grid-cols-2 gap-6">
              {content.map((detail, index) => (
                <InputField
                  key={index}
                  placeholder={detail.value}
                  title={detail.label}
                  label={detail.label}
                  {...form.register(detail.register as any)}
                />
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-end !px-4">
            <div className="flex gap-4">
              <Button
                className="bg-gray-110 h-[40px]"
                variant="secondary"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                className="h-[40px]"
                variant="primary"
                onClick={closeModal}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
      {isAddressDetailsModalOpen && isMobile && (
        <Drawer.Root dismissible={false} open={isAddressDetailsModalOpen}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px] bg-zinc-100">
              <div className="mt-2 flex items-center justify-between px-4">
                <h2 className="text-sm font-bold">Create New Customer</h2>
                <Button
                  className=""
                  variant="ghost"
                  onClick={() => setIsAddressDetailsModalOpen(false)}
                >
                  <CrossIcon size={20} />
                </Button>
              </div>
              <div className="h-fit overflow-y-auto">
                <div className="px-4 py-6">
                  <div className="mb-4 grid grid-cols-2 gap-6">
                    {content.map((detail, index) => (
                      <InputField
                        key={index}
                        placeholder={detail.value}
                        title={detail.label}
                        label={detail.label}
                        {...form.register(detail.register as any)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </>
  )
}

export default AddressDetailsCard
