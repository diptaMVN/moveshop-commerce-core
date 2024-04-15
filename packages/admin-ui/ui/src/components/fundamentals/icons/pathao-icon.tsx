import React from "react"
import IconProps from "./types/icon-type"

const PathaoIcon: React.FC<IconProps> = ({
  size = "24px",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...attributes}
    >
      <rect width="28" height="28" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_1883_13402"
            transform="translate(-0.115385) scale(0.00480769)"
          />
        </pattern>
        <image
          id="image0_1883_13402"
          width="256"
          height="300"
          xlink:href="data:image/png;base64,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"
        />
      </defs>
    </svg>
  )
}

export default PathaoIcon
