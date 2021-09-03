import AddAPhotoIcon from "@material-ui/icons/AddAPhoto"
import AssignmentIcon from "@material-ui/icons/Assignment"
import CreateIcon from "@material-ui/icons/Create"
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined"
import DescriptionIcon from "@material-ui/icons/Description"
import EmailIcon from "@material-ui/icons/Email"
import HomeIcon from "@material-ui/icons/Home"
import LibraryAddCheckOutlinedIcon from "@material-ui/icons/LibraryAddCheckOutlined"
import MenuBookOutlinedIcon from "@material-ui/icons/MenuBookOutlined"
import PrintIcon from "@material-ui/icons/Print"
import ShareIcon from "@material-ui/icons/Share"
import VisibilityIcon from "@material-ui/icons/Visibility"
import SubtitlesIcon from "@material-ui/icons/Subtitles"
import PhoneIcon from "@material-ui/icons/Phone"
import PeopleIcon from "@material-ui/icons/People"
import MenuOpenIcon from "@material-ui/icons/MenuOpen"
import React from "react"

const IconMachine = (icon, fontSize = "large") =>
  ({
    edit: <CreateIcon fontSize={fontSize} />,
    photos: <AddAPhotoIcon fontSize={fontSize} />,
    print: <PrintIcon fontSize={fontSize} />,
    page: <DescriptionIcon fontSize={fontSize} />,
    summaryPage: <AssignmentIcon fontSize={fontSize} />,
    home: <HomeIcon fontSize={fontSize} />,
    store: <LibraryAddCheckOutlinedIcon fontSize={fontSize} />,
    pageStore: <MenuBookOutlinedIcon fontSize={fontSize} />,
    email: <EmailIcon fontSize={fontSize} />,
    share: <ShareIcon fontSize={fontSize} />,
    preview: <VisibilityIcon fontSize={fontSize} />,
    file: <CreateNewFolderOutlinedIcon fontSize={fontSize} />,
    photoCaptions: <SubtitlesIcon fontSize={fontSize} />,
    phone: <PhoneIcon fontSize={fontSize} />,
    person: <PeopleIcon fontSize={fontSize} />,
    collapseMenu: <MenuOpenIcon fontSize={fontSize} />,
  }[icon])

export default IconMachine
