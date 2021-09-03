import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import ButtonBase from "@material-ui/core/ButtonBase"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Grid from "@material-ui/core/Grid"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined"
import axios from "axios"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import useSWR from "swr"
import { globalRoutesList } from "../App"
import usePagination from "./../Hooks/usePagination"
import InspectionCard from "./Inspection/InspectionCard"
import InspectionForm from "./InspectionForm/InspectionForm"
import LinearLoading from "./LoadingComponents/LinearLoading"
import IconMachine from "./Misc/IconMachine"
import OverView from "./OverView"

const useStyles = makeStyles((theme) => ({
  globalItemsList: {},
  globalButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center:",
    border: `1px solid ${theme.palette.action.disabledBackground}`,
    borderRadius: 10,
    background: theme.palette.background.paper,
  },
}))

const maxItemsOnPage = 10

export default function Home() {
  const classes = useStyles()
  const {
    page,
    setTotalPages,
    searchQuery,
    PaginationComponent,
    SearchBarComponent,
  } = usePagination({
    searchPlaceHolder: "Search Inspections",
  })
  const [openAddPage, setOpenAddPage] = useState(false)
  const handleClose = () => {
    setOpenAddPage(false)
  }
  const [inspectionStatusTypeFilter, setInspectionStatusTypeFilter] =
    useState("all") //in_progress or completed
  const handleRadioChange = (event) => {
    setInspectionStatusTypeFilter(event.target.value)
  }

  const fetchUrl = `/api/inspection?page=${page}&search=${searchQuery}&limit=${maxItemsOnPage}&filter=${inspectionStatusTypeFilter}`
  const {
    data,
    mutate: mutateInspections,
    isValidating,
  } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    if (data.length > 0) {
      const calculatedPages = Math.round(
        Number(data[0].total_count / maxItemsOnPage),
      )
      setTotalPages(calculatedPages)
      // console.log("data:", data);
      return data
    } else {
      setTotalPages(0)
      return null
    }
  })
  return (
    <>
      {isValidating ? <LinearLoading /> : null}
      <Box mr={3} ml={3} mt={3}>
        <OverView />
      </Box>
      <Box mr={3} ml={3} mt={3}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          item
          spacing={1}
        >
          {globalRoutesList.slice(1).map((item, i) => (
            <Grid key={`route-item${i}`} item xs={6} sm={4} md={3} lg={3}>
              <ButtonBase
                focusRipple
                onClick={item.action ? item.action : null}
                component={item.menu ? "button" : Link}
                to={item.menu ? null : item.url}
                className={classes.globalButton}
              >
                <Box
                  p={0.3}
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  {IconMachine(item.startIcon, "small")}

                  <Typography
                    align="center"
                    variant="subtitle2"
                    component="div"
                  >
                    {item.label}
                  </Typography>
                </Box>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box p={2} display="flex" width="100%" flexWrap="wrap">
          <Box flexGrow={1}>{SearchBarComponent}</Box>
          <Box p={1} display="flex" flexWrap="wrap">
            <Box alignSelf="center">
              <RadioGroup
                row
                width="100%"
                aria-label="quiz"
                name="quiz"
                value={inspectionStatusTypeFilter}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="all"
                  labelPlacement="end"
                  control={<Radio />}
                  label={<Typography variant="overline">All</Typography>}
                />
                <FormControlLabel
                  value="in_progress"
                  labelPlacement="end"
                  control={<Radio />}
                  label={
                    <Typography variant="overline">In Progress</Typography>
                  }
                />
                <FormControlLabel
                  value="completed"
                  labelPlacement="end"
                  control={<Radio />}
                  label={<Typography variant="overline">Complete</Typography>}
                />
              </RadioGroup>
            </Box>
          </Box>
        </Box>

        <Box p={1}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            color="default"
            onClick={() => setOpenAddPage(true)}
            startIcon={<AddBoxOutlinedIcon fontSize="large" />}
          >
            Create Inspection
          </Button>
        </Box>

        {data && (
          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
          >
            {data.map((i) => (
              <Box key={`insp:${i.id}`} p={2}>
                <InspectionCard info={i} />
              </Box>
            ))}
          </Box>
        )}
        {PaginationComponent}
        <InspectionForm
          request={"createNew"}
          open={openAddPage}
          handleClose={handleClose}
          mutateInspections={mutateInspections}
        />
      </Box>
    </>
  )
}
