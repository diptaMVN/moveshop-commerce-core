import * as React from "react"
import { IconProps } from "./types"

const DiscountsIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M6.69171 18.6161C7.28274 18.6161 7.57825 18.6161 7.84747 18.716C7.88486 18.7298 7.92172 18.7451 7.95797 18.7617C8.21897 18.8815 8.42793 19.0904 8.84585 19.5083C9.80775 20.4702 10.2887 20.9512 10.8805 20.9955C10.96 21.0015 11.04 21.0015 11.1195 20.9955C11.7113 20.9512 12.1923 20.4702 13.1541 19.5083C13.5721 19.0904 13.781 18.8815 14.042 18.7617C14.0783 18.7451 14.1151 18.7298 14.1525 18.716C14.4218 18.6161 14.7173 18.6161 15.3083 18.6161H15.4173C16.9252 18.6161 17.6792 18.6161 18.1476 18.1476C18.6161 17.6792 18.6161 16.9252 18.6161 15.4173V15.3083C18.6161 14.7173 18.6161 14.4218 18.716 14.1525C18.7298 14.1151 18.7451 14.0783 18.7617 14.042C18.8815 13.781 19.0904 13.5721 19.5083 13.1541C20.4702 12.1923 20.9512 11.7113 20.9955 11.1195C21.0015 11.04 21.0015 10.96 20.9955 10.8805C20.9512 10.2887 20.4702 9.80775 19.5083 8.84585C19.0904 8.42793 18.8815 8.21897 18.7617 7.95797C18.7451 7.92172 18.7298 7.88486 18.716 7.84747C18.6161 7.57825 18.6161 7.28274 18.6161 6.69171V6.58269C18.6161 5.07479 18.6161 4.32083 18.1476 3.85239C17.6792 3.38394 16.9252 3.38394 15.4173 3.38394H15.3083C14.7173 3.38394 14.4218 3.38394 14.1525 3.28405C14.1151 3.27018 14.0783 3.25491 14.042 3.23828C13.781 3.11855 13.5721 2.90959 13.1541 2.49167C12.1923 1.52977 11.7113 1.04882 11.1195 1.00447C11.04 0.99851 10.96 0.99851 10.8805 1.00447C10.2887 1.04882 9.80775 1.52977 8.84585 2.49167C8.42793 2.90959 8.21897 3.11855 7.95797 3.23828C7.92172 3.25491 7.88486 3.27018 7.84747 3.28405C7.57825 3.38394 7.28274 3.38394 6.69171 3.38394H6.58269C5.07479 3.38394 4.32083 3.38394 3.85239 3.85239C3.38394 4.32083 3.38394 5.07479 3.38394 6.58269V6.69171C3.38394 7.28274 3.38394 7.57825 3.28405 7.84747C3.27018 7.88486 3.25491 7.92172 3.23828 7.95797C3.11855 8.21897 2.90959 8.42793 2.49167 8.84585C1.52977 9.80775 1.04882 10.2887 1.00447 10.8805C0.99851 10.96 0.99851 11.04 1.00447 11.1195C1.04882 11.7113 1.52977 12.1923 2.49167 13.1541C2.90959 13.5721 3.11855 13.781 3.23828 14.042C3.25491 14.0783 3.27018 14.1151 3.28405 14.1525C3.38394 14.4218 3.38394 14.7173 3.38394 15.3083V15.4173C3.38394 16.9252 3.38394 17.6792 3.85239 18.1476C4.32083 18.6161 5.07479 18.6161 6.58269 18.6161H6.69171Z"
          stroke="#262B28"
          strokeWidth="2"
        />
        <path
          d="M14 8L8 14"
          stroke="#262B28"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 14H13.9892M8.01076 8H8"
          stroke="#262B28"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
)

DiscountsIcon.displayName = "DiscountsIcon"

export default DiscountsIcon
