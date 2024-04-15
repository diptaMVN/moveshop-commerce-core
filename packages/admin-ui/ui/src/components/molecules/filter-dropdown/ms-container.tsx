import * as RadixPopover from "@radix-ui/react-popover"

import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"

import { useWindowDimensions } from "../../../hooks/use-window-dimensions"
import Button from "../../fundamentals/button"
import { FilterMenu } from "../filter-menu"

type FilterDropdownContainerProps = {
  submitFilters: () => void
  clearFilters: () => void
  triggerElement: ReactNode
}

/**
 * @deprecated Use `FilterMenu` instead
 */
const FilterDropdownContainer = ({
  submitFilters,
  clearFilters,
  triggerElement,
  children,
}: PropsWithChildren<FilterDropdownContainerProps>) => {
  const { height } = useWindowDimensions()
  const ref = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [heightStyle, setHeightStyle] = useState({
    maxHeight: height,
  })

  useEffect(() => {
    setHeightStyle({
      maxHeight: height - (ref?.current?.getBoundingClientRect().y ?? 0) - 50,
    })
  }, [ref])

  const onSubmit = () => {
    setIsOpen(false)
    submitFilters()
  }

  const onClear = () => {
    setIsOpen(false)
    clearFilters()
  }

  return (
    <>
      <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
        <RadixPopover.Trigger ref={ref} asChild>
          {triggerElement}
        </RadixPopover.Trigger>
        <RadixPopover.Content
          sideOffset={8}
          side="bottom"
          style={heightStyle}
          className="bg-grey-0 rounded-rounded shadow-dropdown animate-slide-right z-40 mr-7 w-[432px] overflow-y-auto pt-1 transition-all duration-200 ease-in-out"
        >
          {React.Children.toArray(children)
            .filter(Boolean)
            .map((child, idx) => {
              return (
                <div
                  key={idx}
                  className="mb-1"
                >
                  {child}
                </div>
              )
            })}
          <div className="border-grey-20 gap-x-small flex grid grid-cols-2 border-b px-3 py-2.5">
            <Button
              size="small"
              tabIndex={-1}
              className="border-grey-20 mr-2 w-full border"
              variant="ghost"
              onClick={() => onClear()}
            >
              Clear
            </Button>
            <Button
              tabIndex={-1}
              variant="primary"
              className="w-full justify-center"
              size="small"
              onClick={() => onSubmit()}
            >
              Apply
            </Button>
          </div>
        </RadixPopover.Content>
      </RadixPopover.Root>
    </>
  )
}

export default FilterDropdownContainer
