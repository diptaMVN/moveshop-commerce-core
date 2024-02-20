/* eslint-disable no-undef */
import { Check } from "@medusajs/icons"

import { v4 as uuidv4 } from "uuid"
import StepperArrowSetupStoreIcon from "./arrow-stepper-setup-store-icon"
import Step from "../../../components/atoms/step"

const stepperData = [
  { id: 1, title: "Step 1", content: "Add Product", status: "complete" },
  { id: 2, title: "Step 2", content: "Shipping", status: "complete" },
  { id: 3, title: "Step 3", content: "Payments", status: "current" },
  { id: 4, title: "Step 4", content: "Online Store", status: "incoming" },
  { id: 5, title: "Step 5", content: "Launch", status: "incoming" },
]

export const SetupStore = () => {
  return (
    <div className="my-6 ">
      <div>
        <h1 className="mb-2 text-xl font-bold">SetupStore with your store</h1>
        <p className="mb-6">
          Write a description, add photos, and set pricing for the products you
          plan to sell.
        </p>
      </div>

      <>
        <div className=" relative left-[17px]  flex justify-between rounded-lg px-4  ">
          {stepperData?.map((item, i) => {
            if (item.status === "complete") {
              return (
                <Step
                  key={uuidv4()}
                  icon={<Check />}
                  textColor="text-white"
                  label="Complete "
                  IconArrowBg={<StepperArrowSetupStoreIcon color="green" />}
                />
              )
            }

            if (item.status === "current") {
              return (
                <Step
                  key={uuidv4()}
                  label="Current "
                  textColor="text-white"
                  IconArrowBg={<StepperArrowSetupStoreIcon color="black" />}
                />
              )
            }

            return (
              <Step
                key={uuidv4()}
                label="Coming "
                textColor="text-black"
                IconArrowBg={<StepperArrowSetupStoreIcon color="gray" />}
              />
            )
          })}
        </div>
      </>
    </div>
  )
}
