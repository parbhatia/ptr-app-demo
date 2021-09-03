import React from "react"
import EmailRecordItem from "./EmailRecordItem"

export default function EmailRecordList({ emailRecords }) {
  return (
    <>
      {emailRecords.map((record) => (
        <EmailRecordItem key={record.id} {...record} />
      ))}
    </>
  )
}
