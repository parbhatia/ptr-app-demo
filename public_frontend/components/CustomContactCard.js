import React from "react"
import { CDN_URL } from "../config/index"
import Button from "./Button"

const profilePic = `${CDN_URL}/assets/profile_small.png`

export default function CustomContactCard({
  avatarWidthSize = 152,
  buttonSize = "md"
}) {
  return (
    <div className="flex flex-col justify-center rounded-md">
      <div className="flex flex-wrap justify-center w-full">
        <div className="m-3">
          <img
            alt={"INSPECTOR IMAGE"}
            src={profilePic}
            width={avatarWidthSize}
            height={avatarWidthSize}
            className="border rounded-full shadow-xl border-shade-darkest"
          />
        </div>
        <div className="flex flex-col justify-center ml-2">
          <div className="text-xl font-bold md:text-2xl">INSPECTOR NAME</div>
          <div className="text-sm text-gray-800">INSPECTOR DESCRIPTION</div>
          <div className="text-sm tracking-tighter text-gray-800 md:text-lg">
            INSPECTOR TAG
          </div>
          <div className="text-base sm:text-md">
            <Button icon={"phone"} href={"tel:PHONE"} size={buttonSize}>
              INSPECTOR PHONE
            </Button>
          </div>
          <div className="text-base sm:text-md">
            <Button icon={"email"} href={"tel:EMAIL"} size={buttonSize}>
              INSPECTOR EMAIL
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CompactCustomContactCard() {
  return (
    <div className="flex flex-wrap items-center justify-center rounded-md bg-inherit">
      <div className="m-1">
        <img
          alt={"INSPECTOR IMAGE"}
          src={profilePic}
          width={65}
          height={65}
          className="border rounded-full shadow-xl border-shade-darkest"
        />
      </div>
      <div className="ml-2">
        <div className="text-sm font-bold">INSPECTOR IMAGE</div>
        <div className="text-xs">
          <Button icon={"phone"} href={"tel:PHONENUMBER"} size="sm">
            PHONENUMBER
          </Button>
        </div>
        <div className="text-xs ">
          <Button icon={"email"} href={"tel:EMAIL"} size="sm">
            EMAIL
          </Button>
        </div>
      </div>
    </div>
  )
}
