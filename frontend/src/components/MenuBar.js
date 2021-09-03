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
import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined"
import HomeIcon from "@material-ui/icons/Home"
import MenuIcon from "@material-ui/icons/Menu"
import { motion } from "framer-motion"
import React, { memo, useContext } from "react"
import { Link, useHistory } from "react-router-dom"
import { useAuthDataContext } from "./Auth/AuthDataProvider"
import ThemeContext from "../Context/ThemeContext"
import useDrawer from "./../Hooks/useDrawerHook"
import useMenuBarTitle from "./../Hooks/useMenuBarTitle"
import CustomDrawer from "./Misc/CustomDrawer"
import IconMachine from "./Misc/IconMachine"
import Button from "./Misc/ReusableButtonLink"
import useAnchorMenu from "./../Hooks/useAnchorMenu"
import AppsIcon from "@material-ui/icons/Apps"
import { logoSmall, logoSmallDark } from "../config"

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

const AnimatedSideItem = ({ animate = true, children }) =>
  animate ? (
    <motion.div
      initial={{
        opacity: 0,
        y: 0,
        x: -100,
      }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      {children}
    </motion.div>
  ) : (
    <>{children}</>
  )

export const SideItemGenerator = (
  title,
  item,
  i,
  animate = true,
  size = "large",
) => {
  const classes = useStyles()
  return (
    <AnimatedSideItem key={`${item.label}${i}`} animate={animate}>
      <Button
        size={size}
        color={title === item.label ? "secondary" : "inherit"}
        aria-label="open drawer"
        edge="start"
        variant={title === item.label ? "outlined" : "text"}
        fullWidth
        className={classes.label}
        component={item.menu ? "button" : Link}
        to={item.menu ? null : item.url}
        startIcon={IconMachine(item.startIcon)}
        onClick={item.action ? item.action : null}
      >
        {item.label}
      </Button>
    </AnimatedSideItem>
  )
}

//handles displaying the app bar, and displaying the sidebar
const MenuBar = ({
  headerItems,
  sideItems,
  globalItems,
  actions,
  type = "inspection",
  titleMatchPath,
  inspectionInfoCard,
  updateInspectionStatus,
  pdfPreviewButton,
}) => {
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

  const HeaderItem = ({ item, i }) => (
    <Button
      key={`${item.label}${i}`}
      size="large"
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

  let GlobalList = (
    <List component="nav" aria-labelledby="nested-list-subheader">
      {globalItems.map((item, i) => SideItemGenerator(title, item, i))}
    </List>
  )

  let Sidelist = (
    <div
      role="presentation"
      onClick={toggleDrawer()}
      onKeyDown={toggleDrawer()}
    >
      <Box>
        <AnimatedSideItem>
          <img className={classes.logo} src={logo} alt="Logo" />
        </AnimatedSideItem>
      </Box>
      {type === "inspection" ? (
        <AnimatedSideItem>
          <Button
            size="large"
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
          <Divider />
          <ListSubheader>{`Inspection`}</ListSubheader>
          {inspectionInfoCard}
        </AnimatedSideItem>
      ) : null}

      <List component="nav" aria-labelledby="nested-list-subheader">
        {type === "inspection" ? (
          <AnimatedSideItem>
            <Divider />
            <ListSubheader>{`Pages`}</ListSubheader>
          </AnimatedSideItem>
        ) : null}
        {sideItems.map((item, i) => SideItemGenerator(title, item, i))}

        {actions.length !== 0 && (
          <>
            <AnimatedSideItem>
              <Divider />
              <ListSubheader>{`Actions`}</ListSubheader>
            </AnimatedSideItem>
            {actions.map((item, i) => SideItemGenerator(title, item, i))}
          </>
        )}
      </List>
    </div>
  )
  return (
    <div className={classes.root}>
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
                <Button
                  size="large"
                  aria-label="open drawer"
                  onClick={() => {
                    toggleDrawer()()
                  }}
                  startIcon={<MenuIcon />}
                  color="inherit"
                  edge="start"
                  // variant="outlined"
                >
                  {title}
                </Button>
              </Box>
            ) : (
              <Box>
                <Button
                  size="large"
                  aria-label="open drawer"
                  onClick={() => {
                    history.push({ pathname: "/" })
                  }}
                  color="inherit"
                  edge="start"
                  // variant="outlined"
                >
                  <img className={classes.logoAppBar} src={logo} alt="Logo" />
                </Button>
              </Box>
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
                {pdfPreviewButton}
              </Box>
            ) : null}

            {type === "inspection" ? (
              <Box pr={0.5} pl={0.5}>
                {updateInspectionStatus}
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
      {type !== "global" ? (
        <CustomDrawer
          permanent={true}
          anchor={anchorText}
          isOpen={isOpen}
          toggleDrawer={toggleDrawer}
          maxWidth={300}
        >
          {Sidelist}
        </CustomDrawer>
      ) : null}
    </div>
  )
}

export default memo(MenuBar)
