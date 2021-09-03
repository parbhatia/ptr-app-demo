import Box from "@material-ui/core/Box"
import Divider from "@material-ui/core/Divider"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Alert from "@material-ui/lab/Alert"
import axios from "axios"
import React from "react"
import useSWR from "swr"
import Grid from "@material-ui/core/Grid"

const useStyles = makeStyles((theme) => ({
  weeklyOverview: {
    background: theme.palette.background.paper,
    borderRadius: 8,
    border: `1px solid ${theme.palette.action.disabledBackground}`,
  },
  bold: {
    fontWeight: 600,
  },
  incompleteText: {
    fontWeight: 700,
  },
  alertIcon: {
    "& .MuiAlert-icon": {
      alignItems: "center",
    },
    justifyContent: "center",
  },
}))

const WeeklyStat = ({ numericValue, label }) => {
  const classes = useStyles()
  return (
    <Box pl={3} pr={3}>
      <Typography align="center" variant="h5" className={classes.bold}>
        {numericValue}
      </Typography>
      <Typography variant="caption">{label}</Typography>
    </Box>
  )
}

export default function OverView() {
  const classes = useStyles()
  const fetchUrl = "/api/overview"
  const { data } = useSWR(fetchUrl, async () => {
    const { data } = await axios.get(fetchUrl)
    return data
  })

  let incompleteInspectionsMessageComponent = (
    <Alert className={classes.alertIcon} severity="success">
      You are up to date
    </Alert>
  )
  if (data && data.inspections_in_progress !== "0") {
    incompleteInspectionsMessageComponent = (
      <Alert severity="warning" className={classes.alertIcon}>
        You have{" "}
        <Typography display="inline" className={classes.incompleteText}>
          {data.inspections_in_progress}
        </Typography>{" "}
        {data.inspections_in_progress === "1"
          ? "incomplete Inspection"
          : "incomplete Inspections"}
      </Alert>
    )
  }

  return (
    <>
      {data && (
        <Grid container spacing={3} className={classes.weeklyOverview}>
          <Grid item xs={12} md={6}>
            <Box
              p={2}
              display="flex"
              alignItems="stretch"
              width="100%"
              flexDirection="column"
            >
              <Box display="flex" justifyContent="center">
                <Typography variant="h6" className={classes.bold}>
                  Welcome Back, {data.firstname}
                </Typography>
              </Box>
              {incompleteInspectionsMessageComponent}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="center" flexDirection="column">
              <Typography align="center" variant="overline">
                Weekly Overview
              </Typography>
            </Box>
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
              >
                <WeeklyStat
                  numericValue={data.inspections_completed_weekly}
                  label="New Inspections"
                />
                <Divider orientation="vertical" flexItem />
                <WeeklyStat
                  numericValue={data.clients_created_weekly}
                  label="New Clients"
                />
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
              >
                <WeeklyStat
                  numericValue={data.realtors_created_weekly}
                  label="New Realtors"
                />
                <Divider orientation="vertical" flexItem />
                <WeeklyStat
                  numericValue={data.emails_sent_weekly}
                  label="Emails Sent"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  )
}
// import Box from "@material-ui/core/Box"
// import Divider from "@material-ui/core/Divider"
// import { makeStyles } from "@material-ui/core/styles"
// import Typography from "@material-ui/core/Typography"
// import Alert from "@material-ui/lab/Alert"
// import axios from "axios"
// import React from "react"
// import useSWR from "swr"

// const useStyles = makeStyles((theme) => ({
//   weeklyOverview: {
//     background: theme.palette.background.paper,
//     borderRadius: 8,
//     border: `1px solid ${theme.palette.action.disabledBackground}`,
//   },
//   bold: {
//     fontWeight: 700,
//   },
//   incompleteText: {
//     fontWeight: 700,
//   },
//   alertIcon: {
//     "& .MuiAlert-icon": {
//       alignItems: "center",
//     },
//   },
// }))

// const WeeklyStat = ({ numericValue, label }) => {
//   const classes = useStyles()
//   return (
//     <Box pl={3} pr={3}>
//       <Typography align="center" variant="h5" className={classes.bold}>
//         {numericValue}
//       </Typography>
//       <Typography variant="caption">{label}</Typography>
//     </Box>
//   )
// }

// export default function OverView() {
//   const classes = useStyles()
//   const fetchUrl = "/api/overview"
//   const { data } = useSWR(fetchUrl, async () => {
//     const { data } = await axios.get(fetchUrl)
//     return data
//   })

//   let incompleteInspectionsMessageComponent = (
//     <Box width="100%">
//       <Alert className={classes.alertIcon} severity="success">
//         You are up to date
//       </Alert>
//     </Box>
//   )
//   if (data && data.inspections_in_progress !== "0") {
//     incompleteInspectionsMessageComponent = (
//       <Alert severity="warning" className={classes.alertIcon}>
//         You have{" "}
//         <Typography display="inline" className={classes.incompleteText}>
//           {data.inspections_in_progress}
//         </Typography>{" "}
//         {data.inspections_in_progress === "1"
//           ? "incomplete Inspection"
//           : "incomplete Inspections"}
//       </Alert>
//     )
//   }

//   return (
//     <>
//       {data && (
//         <Box
//           width="100%"
//           display="flex"
//           flexWrap="wrap"
//           alignItems="center"
//           justifyContent="center"
//           className={classes.weeklyOverview}
//         >
//           <Box display="flex" flexDirection="column" p={2}>
//             <Typography variant="h6" className={classes.bold}>
//               Welcome Back, {data.firstname}
//             </Typography>
//             {incompleteInspectionsMessageComponent}
//           </Box>
//           <Box p={2}>
//             <Box
//               // pb={1}
//               display="flex"
//               justifyContent="center"
//               flexDirection="column"
//             >
//               <Typography align="center" variant="overline">
//                 Weekly Overview
//               </Typography>
//             </Box>
//             <Box
//               display="flex"
//               flexWrap="wrap"
//               alignItems="center"
//               justifyContent="center"
//             >
//               <Box
//                 display="flex"
//                 flexWrap="wrap"
//                 alignItems="center"
//                 justifyContent="center"
//               >
//                 <WeeklyStat
//                   numericValue={data.inspections_completed_weekly}
//                   label="New Inspections"
//                 />
//                 <Divider orientation="vertical" flexItem />
//                 <WeeklyStat
//                   numericValue={data.clients_created_weekly}
//                   label="New Clients"
//                 />
//               </Box>
//               <Divider orientation="vertical" flexItem />
//               <Box
//                 display="flex"
//                 flexWrap="wrap"
//                 alignItems="center"
//                 justifyContent="center"
//               >
//                 <WeeklyStat
//                   numericValue={data.realtors_created_weekly}
//                   label="New Realtors"
//                 />
//                 <Divider orientation="vertical" flexItem />
//                 <WeeklyStat
//                   numericValue={data.emails_sent_weekly}
//                   label="Emails Sent"
//                 />
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       )}
//     </>
//   )
// }
