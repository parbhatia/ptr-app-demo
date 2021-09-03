import { saveAs } from "file-saver"
import React from "react"
import Button from "../components/Button"
import { CDN_URL } from "../config/index"
import humanFileSize from "../utils/humanFileSize"

const File = ({ name, size, extension, keyid }) => {
  const fileUrl = `${CDN_URL}/${keyid}`
  return (
    <div className="p-1 rounded-lg shadow-md bg-shade">
      <div className="flex p-1">
        <div className="flex items-center w-8 md:w-10">
          <img
            src={extension === "pdf" ? "/assets/pdf.svg" : "/assets/file.svg"}
            height={"100%"}
            width={"100%"}
          />
        </div>

        <div className="flex flex-col justify-center pl-2">
          <div className="text-xs font-semibold text-gray-800 sm:text-sm md:text-md lg:text-xl">
            {name}
          </div>
          <div className="text-xs text-gray-700">
            <span>
              {extension.toUpperCase()} • {humanFileSize(size, true)}
            </span>
          </div>
        </div>
      </div>
      <div className="p-1">
        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 md:text-md lg:text-lg">
          <Button
            icon="download"
            onClick={() => saveAs(fileUrl, `${name}.${extension}`)}
            size="sm"
            fullWidth
            dark
          >
            Download
          </Button>
          <Button
            href={`${CDN_URL}/${keyid}`}
            target="_blank"
            rel="noopener noreferrer"
            icon="open_in_new"
            size="sm"
            fullWidth
            dark
          >
            Open
          </Button>
        </div>
      </div>
      <div>
        <noscript>
          Your browser Javascript is disabled. Download button will not work.
          Select Open Button
        </noscript>
      </div>
      {/* <div>
        <noscript>
          Your browser Javascript is disabled.
          <iframe src={fileUrl} width="100%" height="500px" title="awesome" />
        </noscript>
      </div> */}
    </div>
  )
}

export default File
