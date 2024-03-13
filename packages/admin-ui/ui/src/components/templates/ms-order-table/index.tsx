import clsx from "clsx"
import { isEmpty } from "lodash"
import { useAdminOrders } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import { useAnalytics } from "../../../providers/analytics-provider"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import useOrderTableColums from "./use-order-column"
import { useOrderFilters } from "./use-order-filters"
import MsTableContainer from "../../organisms/ms-table-container"
import MsTable from "../../molecules/ms-table"
import MsOrderFilters from "../ms-order-filter-dropdown"
import useOrderActions from "./use-order-action"
import { useRowSelect } from "react-table"
import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
import { clx } from "../../../utils/clx"
// import image from asset/icon/orders
import Button from "../../fundamentals/button"
import { Link } from "react-router-dom"
import TableEmptyState from "./table-empty-state"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  expand: "customer,shipping_address",
  fields:
    "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
}

type OrderTableProps = {
  setContextFilters: (filters: Record<string, { filter: string[] }>) => void
}

const MsOrderTable = ({ setContextFilters }: OrderTableProps) => {
  const location = useLocation()

  const { isFeatureEnabled } = useFeatureFlag()
  const { trackNumberOfOrders } = useAnalytics()

  let hiddenColumns = ["sales_channel"]
  if (isFeatureEnabled("sales_channels")) {
    if (!defaultQueryProps.expand.includes("sales_channel")) {
      defaultQueryProps.expand = defaultQueryProps.expand + ",sales_channel"
    }
    hiddenColumns = []
  }

  const {
    removeTab,
    setTab,
    saveTab,
    availableTabs: filterTabs,
    activeFilterTab,
    reset,
    paginate,
    setFilters,
    filters,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useOrderFilters(location.search, defaultQueryProps)
  const filtersOnLoad = queryObject

  const offs = parseInt(filtersOnLoad?.offset) || 0
  const lim = parseInt(filtersOnLoad.limit) || DEFAULT_PAGE_SIZE

  const [query, setQuery] = useState(filtersOnLoad?.query)
  const [numPages, setNumPages] = useState(0)
  const [closeFilter, setCloseFilter] = useState(false)

  const { orders, isLoading, count } = useAdminOrders(queryObject, {
    keepPreviousData: true,
    onSuccess: ({ count }) => {
      trackNumberOfOrders({
        count,
      })
    },
  })

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit)
    setNumPages(controlledPageCount)
  }, [orders])

  useEffect(() => {
    setContextFilters(filters as {})
  }, [filters])

  const [columns] = useOrderTableColums()
  const { getActions } = useOrderActions()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: orders || [],
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
        hiddenColumns,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setFreeText(query)
        gotoPage(0)
      } else {
        // if we delete query string, we reset the table view
        reset()
      }
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleNext = () => {
    if (canNextPage) {
      paginate(1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      paginate(-1)
      previousPage()
    }
  }

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj)
    window.history.replaceState(`/a/orders`, "", `${`?${stringified}`}`)
  }

  const refreshWithFilters = () => {
    const filterObj = representationObject

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    } else {
      updateUrlFromFilter(filterObj)
    }
  }

  const clearFilters = () => {
    reset()
    setQuery("")
  }

  useEffect(() => {
    refreshWithFilters()
  }, [representationObject])

  return (
    <div>
      <MsTableContainer
        isLoading={isLoading}
        hasPagination={orders?.length ? true : false}
        numberOfRows={lim}
        pagingState={{
          count: count!,
          offset: queryObject.offset,
          pageSize: queryObject.offset + rows.length,
          title: "Orders",
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
      >
        <MsTable
          filteringOptions={
            <MsOrderFilters
              filters={filters}
              submitFilters={setFilters}
              clearFilters={clearFilters}
              tabs={filterTabs}
              onTabClick={setTab}
              activeTab={activeFilterTab}
              onRemoveTab={removeTab}
              onSaveTab={saveTab}

            />
          }
          enableSearch
          searchClassName="mr-32 w-[400px] mt-0 h-[44px]"
          searchPlaceholder="Search by order id, email, or customer name"
          handleSearch={setQuery}
          searchValue={query}
          {...getTableProps()}
          className={clsx({ ["relative"]: isLoading })}
        >
          <MsTable.Head className="h-[64px]">
            {headerGroups?.map((headerGroup) => (
              <MsTable.HeadRow
                {...headerGroup.getHeaderGroupProps()}
                className="bg-grey-100"
              >
                {headerGroup.headers.map((col) => (
                  <MsTable.HeadCell {...col.getHeaderProps()}>
                    {col.render("Header")}
                  </MsTable.HeadCell>
                ))}
              </MsTable.HeadRow>
            ))}
          </MsTable.Head>
          <MsTable.Body {...getTableBodyProps()} className="shadow-none">
            {!orders ? (
              <TableEmptyState />
            ) : (
              rows.map((row) => {
                prepareRow(row)
                return (
                  <MsTable.Row
                    color={"inherit"}
                    // linkTo={row.original.id}
                    {...row.getRowProps()}
                    className="group"
                    actions={getActions(row.original.id)}
                    clickable={true}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <MsTable.Cell {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </MsTable.Cell>
                      )
                    })}
                  </MsTable.Row>
                )
              })
            )}
          </MsTable.Body>
        </MsTable>
      </MsTableContainer>
    </div>
  )
}

export default React.memo(MsOrderTable)
