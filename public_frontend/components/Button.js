import Icon from "./MaterialIcon"
import { forwardRef } from "react"

const paddingMap = {
  sm: 0.5,
  md: 1,
  lg: 2,
}
const mapPadding = (size) => paddingMap[size]

const Button = forwardRef(
  (
    {
      children,
      onClick,
      icon,
      label,
      fullWidth = false,
      href,
      rel,
      target,
      size = "md",
      dark = false,
      ...rest
    },
    ref
  ) => {
    let parsedStyles = "font-semibold border-transparent border-0 rounded"
    if (fullWidth) {
      parsedStyles += " w-full"
    } else {
      parsedStyles += " w-auto"
    }
    parsedStyles += ` p-${mapPadding(size)}`
    if (dark) {
      parsedStyles +=
        " hover:bg-company-light hover:text-gray-darkest text-shade-black bg-shade-darker"
    } else {
      parsedStyles +=
        " hover:bg-gray-darkest hover:text-gray-lightest text-black"
    }
    return (
      <button onClick={onClick} className={parsedStyles} ref={ref} {...rest}>
        <a
          href={href}
          rel={rel}
          target={target}
          className="flex items-center justify-center"
        >
          {icon && <Icon name={icon} size={size} />}
          {(label || children) && (
            <span className="ml-2">{label ? label : children}</span>
          )}
        </a>
      </button>
    )
  }
)

export default Button
