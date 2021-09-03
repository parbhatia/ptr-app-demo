import { useState } from "react"
import Pagination from "@material-ui/lab/Pagination"
import InputBase from "@material-ui/core/InputBase"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import SearchIcon from "@material-ui/icons/Search"
import Box from "@material-ui/core/Box"

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
}))

const usePagination = ({ searchPlaceHolder, searchDelay = 1000 }) => {
  const classes = useStyles()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const handleChange = (_, value) => {
    setPage(value)
  }
  const [searchQuery, setSearchQuery] = useState("")

  const PaginationComponent = (
    <Box
      width="100%"
      p={1}
      pt={6}
      pb={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Pagination count={totalPages} page={page} onChange={handleChange} />
    </Box>
  )

  const SearchBarComponent = (
    <Box p={1} width="100%">
      <Paper variant="outlined" className={classes.root}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <SearchIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder={searchPlaceHolder}
          inputProps={{ "aria-label": `${searchPlaceHolder}` }}
          onChange={(e) => {
            e.persist()
            // //if on a page other than page 1, resetPage
            if (page > 1) {
              setPage(1)
            }
            setTimeout(() => setSearchQuery(e.target.value), searchDelay)
          }}
        />
      </Paper>
    </Box>
  )

  return {
    page,
    setTotalPages,
    searchQuery,
    PaginationComponent,
    SearchBarComponent,
  }
}

export default usePagination
