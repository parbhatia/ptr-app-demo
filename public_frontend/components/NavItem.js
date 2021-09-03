import Icon from "./MaterialIcon"
import Link from "next/link"

export const LinkItem = ({ label, href, icon }) => (
  <Link href={href} replace>
    <a className="flex items-center justify-center w-full p-1 pl-4 pr-4 space-x-1 text-base rounded md:text-lg hover:bg-company-light dark:hover:bg-gray-dark">
      {icon && <Icon name={icon} size="lg" />}
      <div>{label}</div>
    </a>
  </Link>
)

const NavItem = ({ children, icon, href, label, fullWidth = false }) => (
  <div
    className={
      fullWidth
        ? "w-full flex items-center font-bold"
        : "w-auto flex items-center font-bold"
    }
  >
    <LinkItem label={label} href={href} icon={icon} />
    {children}
  </div>
)

export default NavItem
