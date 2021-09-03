import Avatar from "@material-ui/core/Avatar"
import Badge from "@material-ui/core/Badge"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import ButtonBase from "@material-ui/core/ButtonBase"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import EditIcon from "@material-ui/icons/Edit"
import PeopleIcon from "@material-ui/icons/People"
import AvatarGroup from "@material-ui/lab/AvatarGroup"
import Skeleton from "@material-ui/lab/Skeleton"
import axios from "axios"
import moment from "moment"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import PersonItem from "../Contact Management/Persons/PersonItem"
import EmailRecords from "../Email/EmailRecords"
import DialogHOC from "../Misc/DialogHOC"
import IconMachine from "../Misc/IconMachine"
import UpdateInspectionStatus from "./UpdateInspectionStatus"

const useStyles = ({ dynamicSize }) =>
  makeStyles((theme) => ({
    root: {
      width: dynamicSize.cardWidth,
      // maxWidth: dynamicSize.cardWidth,
    },
    media: {
      height: dynamicSize.imageHeight,
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    cardContent: {
      paddingBottom: 0,
    },
  }))

const smallSizeCardDim = {
  cardWidth: 350,
  imageHeight: 250,
}
const mediumSizeCardDim = {
  cardWidth: 450,
  imageHeight: 400,
}

const InspectionCard = ({ info }) => {
  const mediumSize = useMediaQuery("(min-width:600px)")
  const dynamicSize = mediumSize ? mediumSizeCardDim : smallSizeCardDim
  const classes = useStyles({ dynamicSize })()
  const inspectionPersons = info.persons
  const [openPersonDialog, setOpenPersonDialog] = useState(false)
  const [openEmailRecordsDialog, setOpenEmailRecordsDialog] = useState(false)
  const [loading, setLoading] = React.useState(true)
  const [imageUrl, setImageUrl] = React.useState("")
  let ImageComponent
  if (!loading) {
    ImageComponent = <CardMedia className={classes.media} image={imageUrl} />
  } else {
    ImageComponent = (
      <Skeleton
        variant="rect"
        width={dynamicSize.cardWidth}
        height={dynamicSize.imageHeight}
      />
    )
  }

  React.useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()
    const preferredWidth = dynamicSize.cardWidth
    const fetchCoverPhoto = async ({
      keyid,
      defaultCoverPhoto = false,
      legacy,
    }) => {
      try {
        const { data } = await axios.post(
          `/api/imageprocess/resize`,
          {
            keyid,
            width: preferredWidth,
            defaultCoverPhoto,
            legacy,
          },
          {
            responseType: "blob",
            cancelToken: cancelTokenSource.token,
          },
        )
        const imageBlob = data
        const imageUrl = URL.createObjectURL(imageBlob)
        setImageUrl(imageUrl)
        setLoading(false)
      } catch (e) {
        cancelTokenSource.cancel()
      }
    }
    if (!info.cover_photo) {
      fetchCoverPhoto({ defaultCoverPhoto: true })
    } else if (info.cover_photo.cdn_keyid) {
      fetchCoverPhoto({ keyid: info.cover_photo.cdn_keyid })
    } else if (info.cover_photo.keyid) {
      fetchCoverPhoto({ keyid: info.cover_photo.keyid, legacy: true })
    } else {
      console.log("Error parsing inspection cover photo")
    }
    return () => {
      cancelTokenSource.cancel()
    }
  }, [info])

  return (
    <Card variant="outlined" className={classes.root}>
      {ImageComponent}
      <CardContent className={classes.cardContent}>
        <Box flexGrow={1}>
          <Typography variant="body1" component="h6">
            {info.info.address}
          </Typography>
        </Box>
        <Typography variant="caption" color="textSecondary" component="p">
          {info.info.city} {info.info.postalcode}
        </Typography>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Box flexGrow={1} display="flex" alignItems="center">
            <Box
              pr={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CalendarTodayIcon style={{ fontSize: 15 }} />
            </Box>
            <Box>
              <Typography variant="overline">
                {moment(info.info.date).format("MMMM DD YYYY")} {""}
              </Typography>
            </Box>
          </Box>

          <Box>
            <UpdateInspectionStatus inspectionId={info.id} size="small" />
          </Box>
        </Box>
      </CardContent>

      {/* {"rendering actions"} */}

      <Divider />
      <CardActions>
        <Box p={1} flexGrow={1} display="flex" alignItems="center">
          {inspectionPersons ? (
            <ButtonBase
              disableRipple
              disableTouchRipple
              onClick={() => setOpenPersonDialog(true)}
            >
              <AvatarGroup max={5}>
                {inspectionPersons?.map(({ name }, i) => (
                  <Avatar key={`av-sm-${name}${i}`}>
                    {name.charAt(0).toUpperCase()}
                  </Avatar>
                ))}
                <Avatar>
                  <PeopleIcon fontSize="small" />
                </Avatar>
              </AvatarGroup>
            </ButtonBase>
          ) : null}
          {parseInt(info.email_history_count) !== 0 && (
            <IconButton
              // size="small"
              disableFocusRipple
              disableRipple
              onClick={() => setOpenEmailRecordsDialog(true)}
            >
              <Badge
                badgeContent={parseInt(info.email_history_count)}
                color="primary"
              >
                {IconMachine("email", "small")}
              </Badge>
            </IconButton>
          )}

          <DialogHOC
            fullScreen={false}
            dialogTitle="Persons"
            openDialog={openPersonDialog}
            setOpenDialog={setOpenPersonDialog}
            closeDialogText="Close"
          >
            {inspectionPersons?.map(({ id, name, type }, i) => (
              <PersonItem
                key={id}
                id={id}
                name={name}
                type={type}
                displayAttributes
              />
            ))}
          </DialogHOC>
          <DialogHOC
            fullScreen={false}
            dialogTitle="Outbox"
            openDialog={openEmailRecordsDialog}
            setOpenDialog={setOpenEmailRecordsDialog}
            closeDialogText="Close"
          >
            <EmailRecords
              // header="Outbox"
              // caption="Record of sent Emails"
              fetchUrl={`/api/inspection/${info.id}/emailrecords/ofInspection`}
              disablePagination={false}
            />
          </DialogHOC>
        </Box>
        <Box pb={1} pt={1}></Box>
        <Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            component={Link}
            to={`/Inspection/${info.id}/Summary`}
          >
            Edit
          </Button>
        </Box>
      </CardActions>
    </Card>
  )
}

export default InspectionCard
