import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import VisibilityIcon from "@material-ui/icons/Visibility"
import Skeleton from "@material-ui/lab/Skeleton"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import Dialog from "../PDF/Dialog"
import Chip from "@material-ui/core/Chip"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import IconButton from "@material-ui/core/IconButton"
import humanFileSize from "../../utils/humanFileSize"

const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  cardContent: {
    paddingBottom: 0,
  },
  pdf: {
    // border: "1px solid lightgrey",
    background: "lightgrey",
  },
}))

export default function FileItem({
  id,
  name,
  keyid,
  extension,
  size,
  time_created,
  s3ResourceFileType,
}) {
  const classes = useStyles()
  const [loading, setLoading] = React.useState(true)
  const [openPreview, setOpenPreview] = useState(false)
  const handleDialogClose = () => setOpenPreview(false)
  const [imageUrl, setImageUrl] = React.useState("")
  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()
    const fetchCoverPhoto = async () => {
      try {
        const { data } = await axios.get(
          `/api/requests3resource/pdfthumbnail?type=${s3ResourceFileType}&keyid=${keyid}`,
          {
            responseType: "blob",
            cancelToken: cancelTokenSource.token,
          },
        )
        const imageBlob = data
        const imageUrl = URL.createObjectURL(imageBlob)
        setImageUrl(imageUrl)
        //image sets loading State to false when it's done rendering image
      } catch (e) {
        cancelTokenSource.cancel()
      }
    }
    fetchCoverPhoto()
    return () => {
      cancelTokenSource.cancel()
    }
  }, [keyid, s3ResourceFileType])

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Box
        width="100%"
        p={1}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Box
          width="100%"
          className={classes.pdf}
          display="flex"
          justifyContent="center"
          p={2}
        >
          {loading && <Skeleton variant="rect" width={200} height={260} />}
          <img
            src={imageUrl}
            alt="pdfpreview"
            width={200}
            style={loading ? { display: "none" } : {}}
            onLoad={() => {
              setLoading(false)
            }}
          />
        </Box>
        <Box p={1}>
          <Box display="flex" alignItems="center">
            <Typography
              gutterBottom={false}
              color="textPrimary"
              variant="subtitle1"
            >
              {name}
            </Typography>
            <Box ml={2}>
              <Chip
                size="small"
                variant="outlined"
                label={extension.toUpperCase()}
              />
            </Box>
          </Box>
          <Box>
            <Typography
              gutterBottom={false}
              variant="caption"
              color="textSecondary"
            >
              {humanFileSize(size, true)} - Created{" "}
              {moment(time_created).fromNow()}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" width="100%">
          <Box flexGrow={1}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setOpenPreview(true)}
              fullWidth
              startIcon={<VisibilityIcon />}
            >
              Preview
            </Button>
          </Box>
          <Box>
            <IconButton
              href={`${process.env.REACT_APP_CDN_URL}/${keyid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OpenInNewIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={openPreview}
        handleDialogClose={handleDialogClose}
        action="fetch"
        fetchUrl={`/api/requests3resource/streamfile?type=${s3ResourceFileType}&keyid=${keyid}`}
        pdfName={name}
      />
    </Box>
  )
}
