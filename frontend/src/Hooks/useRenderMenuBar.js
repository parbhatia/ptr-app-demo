import AppBar from "@material-ui/core/AppBar"
import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import Divider from "@material-ui/core/Divider"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { makeStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import AppsIcon from "@material-ui/icons/Apps"
import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined"
import HomeIcon from "@material-ui/icons/Home"
import MenuIcon from "@material-ui/icons/Menu"
import React, { useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { globalRoutesList } from "../App"
import { useAuthDataContext } from "../components/Auth/AuthDataProvider"
import UpdateInspectionStatus from "../components/Inspection/UpdateInspectionStatus"
import {
  AnimatedSideItem,
  SideItemGenerator,
} from "../components/MenuBar/SideItems"
import CustomDrawer from "../components/Misc/CustomDrawer"
import IconMachine from "../components/Misc/IconMachine"
import Button from "../components/Misc/ReusableButtonLink"
import { logoSmall, logoSmallDark } from "../config"
import ThemeContext from "../Context/ThemeContext"
import useDrawer from "./../Hooks/useDrawerHook"
import useMenuBarTitle from "./../Hooks/useMenuBarTitle"
import useAnchorMenu from "./useAnchorMenu"
import useToggle from "./useToggle"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
  },
  logoAppBar: {
    alignItems: "flex-start",
    width: 155,
    textAlign: "center",
  },
  logo: {
    alignItems: "flex-start",
    width: 200,
    margin: 10,
    textAlign: "center",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    ...theme.mixins.toolbar,
  },
  appBar: {
    display: "flex",
    flexDirection: "column",
    "border-bottom": "0",
  },
  label: {
    justifyContent: "start",
  },
}))

const useRenderMenuBar = ({
  type = "inspection",
  titleMatchPath,
  inspectionId,
  address,
  city,
  postalcode,
}) => {
  const previewRef = useRef()
  const [anchorElPdfPreview, setAnchorElPdfPreview] = useState(null)
  const handlePdfPreviewClick = () => {
    setAnchorElPdfPreview(previewRef.current)
  }
  const handlePdfPreviewClose = () => {
    setAnchorElPdfPreview(null)
  }

  const [headerItems, setHeaderItems] = useState([])
  const [sideItems, setSideItems] = useState([])
  const [actions, setActions] = useState([])
  const { onLogout, user } = useAuthDataContext()
  const history = useHistory()
  const { dark, toggle } = useContext(ThemeContext)
  const classes = useStyles(dark)
  const title = useMenuBarTitle(titleMatchPath)
  const logo = dark ? logoSmallDark : logoSmall
  const [anchorText, isOpen, toggleDrawer] = useDrawer("left")
  const {
    handleMenu: handleProfileMenu,
    handleClose: handleProfileClose,
    open: openProfile,
    anchorEl: anchorElProfile,
  } = useAnchorMenu()

  const {
    handleMenu: handleAllItemsMenu,
    handleClose: handleAllItemsClose,
    open: openAllItems,
    anchorEl: anchorElAllItems,
  } = useAnchorMenu()

  const [userCollapse, toggleUserCollapse] = useToggle(false)
  const minWidth = useMediaQuery(`(min-width:1000px)`)
  const permanentMenuBar = minWidth && !userCollapse
  const buttonSize = permanentMenuBar ? "small" : "large"

  const HeaderItem = ({ item, i }) => (
    <Button
      key={`${item.label}${i}`}
      size={buttonSize}
      color="inherit"
      aria-label="open drawer"
      component={item.menu ? "button" : Link}
      to={item.menu ? null : item.url}
      startIcon={IconMachine(item.startIcon)}
      onClick={item.action ? item.action : null}
    >
      {item.label}
    </Button>
  )

  const GlobalList = (
    <List component="nav" aria-labelledby="nested-list-subheader">
      {globalRoutesList.map((item, i) => (
        <SideItemGenerator title={title} item={item} key={`${i}-global`} />
      ))}
    </List>
  )

  const Sidelist = (
    <div
      role="presentation"
      onClick={toggleDrawer()}
      onKeyDown={toggleDrawer()}
    >
      {!permanentMenuBar && (
        <Box>
          <AnimatedSideItem>
            <img className={classes.logo} src={logo} alt="Logo" />
          </AnimatedSideItem>
        </Box>
      )}
      {type === "inspection" ? (
        <AnimatedSideItem>
          {!permanentMenuBar && (
            <Button
              size={buttonSize}
              aria-label="open drawer"
              onClick={() => {
                toggleDrawer()()
              }}
              component={Link}
              to={"/"}
              startIcon={<HomeIcon />}
              color="inherit"
              fullWidth
              className={classes.label}
              edge="start"
            >
              Home
            </Button>
          )}

          {!permanentMenuBar && <Divider />}
          <Box display="flex" justifyContent="space-between">
            <ListSubheader>{`Inspection`}</ListSubheader>
            {minWidth && (
              <IconButton
                size="small"
                aria-label="collapse mode"
                color="inherit"
                onClick={() => {
                  toggleUserCollapse()
                }}
              >
                {IconMachine("collapseMenu", "small")}
              </IconButton>
            )}
          </Box>
          <Box pl={2} pr={2} mt={1}>
            <Box flexGrow={1}>
              <Typography variant="body1" component="h6">
                {address}
              </Typography>
            </Box>
            <Typography variant="caption" color="textSecondary" component="p">
              {city} {postalcode}
            </Typography>
          </Box>
        </AnimatedSideItem>
      ) : null}

      <List component="nav" aria-labelledby="nested-list-subheader">
        {type === "inspection" ? (
          <AnimatedSideItem>
            <Divider />
            <ListSubheader>{`Pages`}</ListSubheader>
          </AnimatedSideItem>
        ) : null}
        {sideItems.map((item, i) => (
          <SideItemGenerator
            title={title}
            item={item}
            key={`${item.label}${i}`}
            size={buttonSize}
          />
        ))}

        {actions.length !== 0 && (
          <>
            <AnimatedSideItem>
              <Divider />
              <ListSubheader>{`Actions`}</ListSubheader>
            </AnimatedSideItem>
            {actions.map((item, i) => (
              <SideItemGenerator
                title={title}
                item={item}
                key={`${item.label}${i}`}
                size={buttonSize}
              />
            ))}
          </>
        )}
      </List>
    </div>
  )

  const ToolBarLogo = (
    <Button
      size={buttonSize}
      aria-label="open drawer"
      onClick={() => {
        history.push({ pathname: "/" })
      }}
      color="inherit"
      edge="start"
    >
      <img className={classes.logoAppBar} src={logo} alt="Logo" />
    </Button>
  )

  const PreviewButton = (
    <Button
      ref={previewRef}
      size={buttonSize}
      color="inherit"
      aria-label="open drawer"
      startIcon={IconMachine("preview")}
      onClick={handlePdfPreviewClick}
    >
      Preview
    </Button>
  )

  const AppBarComponent = (
    <AppBar
      elevation={0}
      className={classes.appBar}
      color="inherit"
      position="static"
    >
      <Toolbar disableGutters>
        <Box display="flex" flexGrow={1}>
          {type !== "global" ? (
            <Box>
              {permanentMenuBar ? (
                ToolBarLogo
              ) : (
                <Button
                  size={buttonSize}
                  aria-label="open drawer"
                  onClick={() => {
                    toggleDrawer()()
                  }}
                  startIcon={<MenuIcon />}
                  color="inherit"
                  edge="start"
                >
                  {title}
                </Button>
              )}
            </Box>
          ) : (
            <Box>{ToolBarLogo}</Box>
          )}
        </Box>
        <Hidden smDown>
          {headerItems.map((item, i) => (
            <React.Fragment key={`${i}-headeritem`}>
              <HeaderItem item={item} i={i} />
            </React.Fragment>
          ))}
          {type === "inspection" ? (
            <Box pr={0.5} pl={0.5}>
              {PreviewButton}
            </Box>
          ) : null}

          {type === "inspection" ? (
            <Box pr={0.5} pl={0.5}>
              <UpdateInspectionStatus inspectionId={inspectionId} />
            </Box>
          ) : null}
        </Hidden>

        <IconButton
          size="medium"
          aria-label="dark mode"
          color="inherit"
          onClick={() => toggle()}
        >
          <Brightness4OutlinedIcon />
        </IconButton>
        {title !== "Home" && (
          <Box>
            <IconButton
              aria-label="profile"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleAllItemsMenu}
              color="inherit"
              size="medium"
            >
              <AppsIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElAllItems}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={openAllItems}
              onClose={handleAllItemsClose}
            >
              {GlobalList}
            </Menu>
          </Box>
        )}
        <Box>
          <IconButton
            aria-label="profile"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenu}
            color="inherit"
            size="medium"
          >
            <Avatar
              alt={user.firstName + " " + user.lastName}
              src={`${process.env.REACT_APP_CDN_URL}/assets/${user.profile_pic_keyid}`}
            />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElProfile}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={openProfile}
            onClose={handleProfileClose}
          >
            <MenuItem
              onClick={async () => {
                handleProfileClose()
                await onLogout()
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )

  const DrawerComponent =
    type !== "global" ? (
      <CustomDrawer
        permanent={permanentMenuBar ? true : false}
        anchor={anchorText}
        isOpen={isOpen}
        toggleDrawer={toggleDrawer}
        maxWidth={permanentMenuBar ? 240 : 300}
      >
        {Sidelist}
      </CustomDrawer>
    ) : null

  return {
    DrawerComponent,
    AppBarComponent,
    setHeaderItems,
    setSideItems,
    setActions,
    previewRef,
    anchorElPdfPreview,
    handlePdfPreviewClick,
    handlePdfPreviewClose,
  }
}

export default useRenderMenuBar
