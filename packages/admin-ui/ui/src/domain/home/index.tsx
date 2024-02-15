import { useMemo, useState } from "react"
import { Link, Route, Routes, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { useAdminCreateBatchJob } from "medusa-react"
import RouteContainer from "../../components/extensions/route-container"
import WidgetContainer from "../../components/extensions/widget-container"
import Button from "../../components/fundamentals/button"
import ExportIcon from "../../components/fundamentals/icons/export-icon"
import BodyCard from "../../components/organisms/body-card"

import ExportModal from "../../components/organisms/export-modal"

import useNotification from "../../hooks/use-notification"
import useToggleState from "../../hooks/use-toggle-state"
import { usePolling } from "../../providers/polling-provider"
import { useRoutes } from "../../providers/route-provider"
import { useWidgets } from "../../providers/widget-provider"
import { getErrorMessage } from "../../utils/error-messages"
import { transformFiltersAsExportContext } from "./utils"
import IconCircle from "../../components/fundamentals/icon-circle"
import IconSquare from "../../components/fundamentals/icon-square"
import InputField from "../../components/molecules/input"

import Accordion from "../../components/organisms/accordion"
import ProgressCircle from "./progress-circle"
import { clx } from "../../utils/clx"
import CopyToClipboard from "../../components/atoms/copy-to-clipboard"
import CopyIcon from "../../components/fundamentals/icons/copy-icon"
import Step from "../onboarding/onboarding-stepper/step"
import { v4 as uuidv4 } from "uuid"
import { Check } from "@medusajs/icons"
// eslint-disable-next-line no-undef
const copy_value = "raptorshopping.moveshop.store"
const Prepare = () => {
  const [stepsCompleted, setStepsCompleted] = useState(1)

  const handleStepCompletion = () => {
    if (stepsCompleted < 5) {
      setStepsCompleted((c) => stepsCompleted + 1)
    }
  }
  return (
    <>
      <div className="rounded-lg border bg-white p-4 shadow">
        <div className="  ">
          <div className="medium:items-center medium:flex-row flex flex-col items-start justify-between gap-4">
            <div className="medium:items-center medium:flex-row flex flex-col  items-start gap-3">
              <div>
                <div className="-ml-2 -mt-2">
                  <ProgressCircle stepsCompleted={stepsCompleted} />
                </div>
              </div>
              <div>
                <p className=" text-xl font-medium">
                  Set up your MoveShop Account
                </p>
                <button onClick={handleStepCompletion}>
                  {stepsCompleted}/5 steps completed
                </button>
              </div>
            </div>

            <div className=" flex flex-col ">
              <div className="flex flex-col space-y-2">
                <Link
                  to={"/a/home"}
                  className="rounded-lg border bg-white p-3 text-base"
                >
                  Updated Profile
                </Link>
              </div>
            </div>
          </div>

          <p className="mb-2 mt-6 text-xl font-semibold">Raptor Shop</p>
          <div className=" inline-flex  h-11 w-[442px] items-center justify-between rounded-lg bg-neutral-100 py-1 pl-4 pr-1">
            <div className="font-['Inter'] text-base font-normal leading-normal text-black">
              raptorshopping.moveshop.store
            </div>
            <div className="flex items-center justify-start gap-2">
              <div className="relative h-6 w-6">
                <div className="absolute left-[4px] top-[4px] flex h-4 w-4 items-center">
                  <CopyToClipboard
                    icon={<CopyIcon />}
                    value={copy_value}
                    onCopy={() => {}}
                  />
                </div>
              </div>
              <Link
                to={"raptorshopping.moveshop.store"}
                className="flex items-center justify-center gap-2.5 rounded border border-neutral-200 bg-white px-4 py-2"
              >
                <div className="font-['Inter'] text-sm font-medium leading-tight text-black">
                  Share Shop
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const MoveOnGlobalCard = () => {
  return (
    <div className=" medium:flex hidden items-center justify-between rounded-lg bg-white p-4">
      <div>
        <h2 className="medium:text-2xl mb-3 text-xl font-bold">
          MoveOn Global
        </h2>
        <p>
          Write a description, add photos, and set pricing for the products you
          plan to sell.
        </p>
        <Button size="small" variant="secondary" className="mt-3">
          Explore now
        </Button>
      </div>
      <div className="h-[200px] w-[400px] rounded-xl  bg-black"></div>
    </div>
  )
}

const MoveOnGlobalCardSmall = () => {
  return (
    <div className="p-small rounded-lg bg-white ">
      <div className="h-[100px] w-[200px] rounded-xl  bg-black"></div>
      <div className="mt-3">
        <h2 className="mb-3 text-2xl font-bold">MoveOn Global</h2>
        <p>
          Write a description, add photos, and set pricing for the products you
          plan to sell.
        </p>
      </div>
      <Button size="small" variant="secondary" className="mt-3">
        Explore now
      </Button>
    </div>
  )
}
const MoveOnGlobal = () => {
  return (
    <>
      <div className="mb-7 mt-12">
        <div className="grid grid-cols-3 items-center justify-center gap-5">
          <div className="h-1 w-full bg-black"></div>
          <div className="flex items-center justify-center gap-3">
            <IconSquare className="h-7 w-7" />
            <div className="medium:text-2xl text-xl font-bold">
              Introducing MoveOn
            </div>
          </div>
          <div className="h-1  bg-black"></div>
        </div>
      </div>
      <div className="p-small rounded-3xl bg-[#E7E7E7]">
        <MoveOnGlobalCard />
        <div className={"small:block medium:hidden"}>
          <MoveOnGlobalCardSmall />
        </div>
        <div className="medium:flex-row mt-3 flex flex-col items-center justify-between gap-3">
          <MoveOnGlobalCardSmall />
          <MoveOnGlobalCardSmall />
          <MoveOnGlobalCardSmall />
        </div>
      </div>
    </>
  )
}

const stepperData = [
  { id: 1, title: "Step 1", content: "Add Product", status: "complete" },
  { id: 2, title: "Step 2", content: "Shipping", status: "complete" },
  { id: 3, title: "Step 3", content: "Payments", status: "current" },
  { id: 4, title: "Step 4", content: "Online Store", status: "incoming" },
  { id: 5, title: "Step 5", content: "Launch", status: "incoming" },
]

const AccordionHeader = ({ label }: { label: string }): JSX.Element => {
  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <IconCircle />
        <p className="medium:text-2xl text-base font-bold ">{label}</p>
      </div>
    </>
  )
}

const CardBar = ({ label, desc }: { label: string; desc: string }) => {
  return (
    <>
      <div className=" mt-4 w-full">
        <Accordion type="multiple">
          <Accordion.Item
            // @ts-ignore
            title={<AccordionHeader label={label} />}
            value="providers"
            headingSize={"large"}
            className={" rounded-lg bg-[#E7E7E7] p-4"}
          >
            <div className={"py-4"}>
              <div className={"h-[2px] w-full bg-white "}></div>
              <p className="inter-base-regular text-grey-50 mt-4">{desc}</p>
            </div>

            <div
              className={
                "medium:flex-row flex flex-col items-center justify-between gap-3"
              }
            >
              <div>
                <Button variant={"secondary"} className={"my-3"}>
                  Started
                </Button>
                <div className={"flex items-center gap-3 "}>
                  <label htmlFor="shipping-plan">
                    <InputField
                      type="checkbox"
                      name="shipping-plan"
                      id={"shipping-plan"}
                    />
                  </label>

                  <p>Mark as completed</p>
                </div>
              </div>
              <div className={"medium:block hidden"}>
                <IconSquare className={"h-32 w-32"} />
              </div>
            </div>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  )
}

const Setup = () => {
  return (
    <div className="mt-9">
      <div className="mb-3 mt-5">
        <h1 className="text-xl font-bold">Setup with your store</h1>
        <p>
          Write a description, add photos, and set pricing for the products you
          plan to sell.
        </p>
      </div>

      <>
        <div className=" relative left-[12px] mb-[18px] flex justify-between rounded-lg px-4  ">
          {stepperData?.map((item, i) => {
            if (item.status === "complete") {
              return (
                <Step
                  key={uuidv4()}
                  icon={<Check />}
                  textColor="text-white"
                  label="Complete Step"
                  color="green"
                />
              )
            }

            if (item.status === "current") {
              return (
                <Step
                  key={uuidv4()}
                  label="Current Step"
                  color="black"
                  textColor="text-white"
                />
              )
            }

            return (
              <Step key={uuidv4()} label="Coming Step" textColor="text-black" />
            )
          })}
        </div>
      </>

      <div className="mb-5 mt-12">
        <CardBar
          label={"Add your first product"}
          desc={
            "Choose where you ship and how much you charge so your customers can see their shipping costs at checkout. Learn more ..."
          }
        />
        <CardBar
          label={"Setup your shipping plan"}
          desc={
            "Choose where you ship and how much you charge so your customers can see their shipping costs at checkout. Learn more ..."
          }
        />
        <CardBar
          label={"Add your first product"}
          desc={
            "Choose where you ship and how much you charge so your customers can see their shipping costs at checkout. Learn more ..."
          }
        />
        <CardBar
          label={"Add your first product"}
          desc={
            "Choose where you ship and how much you charge so your customers can see their shipping costs at checkout. Learn more ..."
          }
        />
        <CardBar
          label={"Add your first product"}
          desc={
            "Choose where you ship and how much you charge so your customers can see their shipping costs at checkout. Learn more ..."
          }
        />
      </div>
    </div>
  )
}

const HomeIndex = () => {
  const view = "orders"

  const { t } = useTranslation()
  const { resetInterval } = usePolling()
  const navigate = useNavigate()
  const createBatchJob = useAdminCreateBatchJob()
  const notification = useNotification()

  const [contextFilters, setContextFilters] =
    useState<Record<string, { filter: string[] }>>()

  const {
    open: openExportModal,
    close: closeExportModal,
    state: exportModalOpen,
  } = useToggleState(false)

  const { getWidgets } = useWidgets()

  const actions = useMemo(() => {
    return [
      <Button
        key="export"
        variant="secondary"
        size="small"
        onClick={() => openExportModal()}
      >
        <ExportIcon size={20} />
        Export Orders
      </Button>,
    ]
  }, [view])

  const handleCreateExport = () => {
    const reqObj = {
      dry_run: false,
      type: "order-export",
      context: contextFilters
        ? transformFiltersAsExportContext(contextFilters)
        : {},
    }

    createBatchJob.mutate(reqObj, {
      onSuccess: () => {
        resetInterval()
        notification(
          t("orders-success", "Success"),
          t(
            "orders-successfully-initiated-export",
            "Successfully initiated export"
          ),
          "success"
        )
      },
      onError: (err) => {
        notification(t("orders-error", "Error"), getErrorMessage(err), "error")
      },
    })

    closeExportModal()
  }

  return (
    <>
      <div className="gap-y-xsmall flex h-full grow flex-col">
        {getWidgets("order.list.before").map((w, i) => {
          return (
            <WidgetContainer
              key={i}
              injectionZone={"order.list.before"}
              widget={w}
              entity={undefined}
            />
          )
        })}
        <div className="flex w-full grow flex-col">
          <BodyCard>
            <Prepare />
            <Setup />
            <div className="mb-32 mt-12">
              <MoveOnGlobal />
            </div>
          </BodyCard>
        </div>
        {getWidgets("order.list.after").map((w, i) => {
          return (
            <WidgetContainer
              key={i}
              injectionZone={"order.list.after"}
              widget={w}
              entity={undefined}
            />
          )
        })}
      </div>
      {exportModalOpen && (
        <ExportModal
          title={t("orders-export-orders", "Export Orders")}
          handleClose={() => closeExportModal()}
          onSubmit={handleCreateExport}
          loading={createBatchJob.isLoading}
        />
      )}
    </>
  )
}

const Home = () => {
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/products")

  return (
    <Routes>
      <Route index element={<HomeIndex />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={<RouteContainer route={r} previousPath={"/orders"} />}
          />
        )
      })}
    </Routes>
  )
}

export default Home
