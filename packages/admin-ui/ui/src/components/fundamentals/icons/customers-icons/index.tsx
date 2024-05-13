import * as React from "react"
import { IconProps } from "./types"

const CustomersIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", width = 24, height = 24, ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M1.5 11C1.5 6.52166 1.5 4.28249 2.89124 2.89124C4.28249 1.5 6.52166 1.5 11 1.5C15.4783 1.5 17.7175 1.5 19.1088 2.89124C20.5 4.28249 20.5 6.52166 20.5 11C20.5 15.4783 20.5 17.7175 19.1088 19.1088C17.7175 20.5 15.4783 20.5 11 20.5C6.52166 20.5 4.28249 20.5 2.89124 19.1088C1.5 17.7175 1.5 15.4783 1.5 11Z"
          stroke="#262B28"
          strokeWidth="2"
        />
        <path
          d="M6.5 16C8.8317 13.5578 13.1432 13.4428 15.5 16M13.4951 8.5C13.4951 9.88071 12.3742 11 10.9915 11C9.60885 11 8.48797 9.88071 8.48797 8.5C8.48797 7.11929 9.60885 6 10.9915 6C12.3742 6 13.4951 7.11929 13.4951 8.5Z"
          stroke="#262B28"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }
)

CustomersIcon.displayName = "CustomersIcon"

export default CustomersIcon
