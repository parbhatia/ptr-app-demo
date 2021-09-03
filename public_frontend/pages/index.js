import Link from "next/link"
import React from "react"
import { Card } from "../components/Card"
import CustomContactCard from "../components/CustomContactCard"
import PageLayout from "../components/PageLayout"
import Descriptor from "../components/Descriptor"

export default function Index() {
  return (
    <PageLayout pageTitle={""}>
      <CustomContactCard card />
    </PageLayout>
  )
}
