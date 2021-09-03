import Image from "next/image"
import React from "react"
import Button from "../components/Button"
import NavItem from "../components/NavItem"
import Link from "next/link"
import { CDN_URL } from "../config/index"

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: "home"
  }
]

const Navbar = () => {
  const [openMobile, setOpenMobile] = React.useState(false)
  const handleMobileMenu = () =>
    openMobile ? setOpenMobile(false) : setOpenMobile(true)
  const logo = `${CDN_URL}/assets/ptrlogosmall.png`

  return (
    <div className="sticky top-0 z-50 justify-center w-full pt-1 pb-1 bg-shade ">
      <div className="flex flex-row flex-wrap items-baseline justify-evenly">
        <div className="relative h-10 p-2 rounded-lg md:mb-1 w-52 lg:w-48 lg:h-16 md:ml-5 ">
          <Link href="/">
            <a>
              <img src={logo} alt="ptrlogo" width="100%" />
            </a>
          </Link>
        </div>
        <div className="flex-wrap justify-center hidden space-x-1 md:flex">
          {navItems.map(({ label, icon, href }, i) => (
            <NavItem
              key={`navitem${i}`}
              icon={icon}
              label={label}
              href={href}
            />
          ))}
        </div>
        <div className="md:hidden">
          <Button icon="menu" onClick={handleMobileMenu} size="lg" dark />
        </div>
      </div>
      <div className="flex flex-col items-center w-full md:hidden">
        {openMobile && (
          <>
            {navItems.map(({ label, icon, href }, i) => (
              <NavItem
                key={`navitem${i}`}
                icon={icon}
                label={label}
                href={href}
                fullWidth
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
