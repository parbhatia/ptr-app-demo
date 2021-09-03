import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import React from "react"
import { CompactCustomContactCard } from "../../components/CustomContactCard"
import Descriptor from "../../components/Descriptor"
import FileManager from "../../components/FileManager"
import Icon from "../../components/MaterialIcon"
import PageLayout from "../../components/PageLayout"
import PlainText from "../../components/PlainText"
import {
  CDN_URL,
  fallBackCoverPhoto,
  legacyS3PhotosDomain,
  MAIN_DOMAIN
} from "../../config/index"

dayjs.extend(relativeTime)

const isProduction = process.env.NODE_ENV === "production"

export async function getServerSideProps(context) {
  const res = context.res
  const queryId = context.query.id
  try {
    //** Note: localhost is no longer actual host machine. Since we're using a bridge network, use nginx's container name as hostname
    const fetchUrl = isProduction
      ? `${MAIN_DOMAIN}/shared/${queryId}`
      : `http://proxy:80/shared/${queryId}`
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await response.json()
    const shareableLinkData = data.payload
    return {
      props: {
        data: shareableLinkData
      }
    }
  } catch (e) {
    // console.log("Error", e)
    //redirect to 404 on invalid link id
    res.statusCode = 302
    res.setHeader("Location", `/404`)
    return {
      props: {
        data: null
      }
    }
  }
}

const processDateTime = (dateTime, fromNow = false) => {
  return !fromNow
    ? dayjs(dateTime).format("MMMM DD YYYY")
    : dayjs(dateTime).fromNow()
}

const Subheading = ({ title }) => (
  <div className="p-2 mb-1 text-xs font-bold tracking-wide text-center text-gray-600 uppercase border-t border-gray-200 mt-7">
    {title}
  </div>
)

const ContactInfo = (
  <div className="p-2 rounded-lg bg-shade">
    <CompactCustomContactCard />
  </div>
)

const FixedWidth = ({ children }) => (
  <div className="flex flex-col justify-center max-w-lg mx-auto">
    {children}
  </div>
)

const cautionMessage =
  "Please refer to the Report for more details. This is only available for copy/paste purposes and forwarding the report matter to other parties"

const CategoryOverview = ({ title, children }) => (
  <div>
    <div className="mb-1 text-xs font-semibold text-center text-gray-800 sm:text-sm md:text-md lg:text-lg">
      {title}
    </div>
    {children}
  </div>
)

export default function Shared({ data }) {
  if (!data) {
    return <></>
  }
  let coverPhoto
  if (!data.cover_photo) {
    coverPhoto = fallBackCoverPhoto
  } else if (data.cover_photo.cdn_keyid) {
    coverPhoto = `${CDN_URL}/${data.cover_photo.cdn_keyid}`
  } else {
    coverPhoto = `${legacyS3PhotosDomain}/${data.cover_photo.keyid}`
  }

  return (
    <PageLayout pageTitle={`Inspection Package - ${data.inspection.address}`}>
      <Descriptor
        title="Inspection Package"
        description="Includes your inspection report, and other attachments"
      />
      <FixedWidth>
        <div className="w-full">
          <div className="flex justify-center p-2 text-center text-gray-700 ">
            <p className="flex items-center text-sm font-bold tracking-wide text-center uppercase">
              <Icon name="date_range" size="sm" />
              <span className="ml-1">
                {processDateTime(data.inspection.time_created)}
              </span>
            </p>
          </div>
          <Subheading title="Property" />
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="w-full">
              <img src={coverPhoto} width="100%" />
            </div>
            <div className="p-2">
              <p className="text-sm font-bold text-center text-gray-700 md:text-md lg:text-xl">
                {data.inspection.address}
              </p>
              <p className="text-xs font-bold tracking-wide text-center text-gray-500 uppercase lg:text-sm">
                {data.inspection.city}{" "}
                {data.inspection.postalcode
                  ? `• ${data.inspection.postalcode}`
                  : null}
              </p>
            </div>
          </div>
        </div>

        {data.pdf_file ? (
          <div>
            <Subheading title="Report" />
            <FileManager files={[data.pdf_file]} label="Report" />
          </div>
        ) : null}
        {data.attachments ? (
          <div>
            <Subheading title="Attachments" />
            <FileManager files={data.attachments} label="Attachments" />
          </div>
        ) : null}

        {data.summary.categories[0].checkboxes.length === 0 &&
        data.summary.categories[1].checkboxes.length === 0 ? null : (
          <>
            <Subheading title="Quick Access" />
            <div className="pl-2 mb-1 text-xs text-gray-600 border-l-8 border-yellow-300">
              {cautionMessage}
            </div>
            <div className="p-3 rounded-lg shadow-lg bg-shade">
              <CategoryOverview title={"Summary"}>
                <PlainText category={data.summary.categories[0]} />
              </CategoryOverview>
              <div className="m-4"></div>
              <CategoryOverview title={data.summary.categories[1].name}>
                <PlainText category={data.summary.categories[1]} />
              </CategoryOverview>
            </div>
          </>
        )}

        {/* <div>View Count : {data.view_count}</div> */}
        <Subheading title="Home Inspector" />
        <div className="rounded-lg shadow-lg">{ContactInfo}</div>
        <div className="p-2 mt-8 mb-1 text-xs font-thin text-center text-gray-700 uppercase">
          Last Updated: {processDateTime(data.last_modified, true)}
        </div>
      </FixedWidth>
    </PageLayout>
  )
}
