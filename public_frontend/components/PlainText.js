import { useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Button from "../components/Button"

const alpha = "abcdefghijklmnopqrstuvwxyz"

function convertSummaryToPlainText(checkboxes) {
  let doc = ""
  if (Array.isArray(checkboxes)) {
    checkboxes.forEach((ch, i) => {
      let item = `${i + 1}. ${ch.text}`
      if (ch.subcheckboxes.length !== 0) {
        item += "\n"
      }
      if (Array.isArray(ch.subcheckboxes)) {
        ch.subcheckboxes.forEach((sub, i) => {
          let subitem = sub.text
          item += `      ${alpha.charAt(i)}: ${subitem}`
          item += "\n"
        })
      }

      doc += item + "\n\n"
    })
  }
  return doc
}

export const PlainText = ({ category }) => {
  const doc = convertSummaryToPlainText(category.checkboxes)
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div>
      <noscript>
        <p className="text-xs leading-5 text-gray-500 whitespace-pre animate-fade-in">
          {doc}
        </p>
      </noscript>

      {expanded && (
        <div className="w-full p-4 overflow-scroll bg-white rounded-md">
          <p className="text-xs leading-5 text-gray-500 whitespace-pre animate-fade-in">
            {doc}
          </p>
        </div>
      )}
      <div className="p-1">
        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 md:text-md lg:text-lg">
          <Button icon="visibility" size="sm" onClick={handleExpandClick} dark>
            {expanded ? "Hide" : "View"}
          </Button>
          <CopyToClipboard text={doc}>
            <Button size="sm" icon="content_copy" dark>
              Copy
            </Button>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  )
}

export default PlainText
