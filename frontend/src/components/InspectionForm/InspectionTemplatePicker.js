import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import React, { useEffect } from "react"
import MasterPageStoreItem from "../Master Storage/Master Page Store/MasterPageStoreItem"
import useGetMasterPageStores from "../../Hooks/useGetMasterPageStores"
import StyledContainer from "../StyledContainers/StyledContainer"

export default function InspectionTemplatePicker({
  nextStep,
  selectedTemplateId,
  setSelectedTemplateId,
}) {
  const fetchMasterPageStoreTemplates = "/api/masterpagestore"

  const [templateData, ,] = useGetMasterPageStores({
    fetchUrl: fetchMasterPageStoreTemplates,
    stopRefresh: true,
  })

  useEffect(() => {
    if (templateData && selectedTemplateId === null) {
      setSelectedTemplateId(templateData.templates[0].id)
    }
  }, [templateData])

  const [templateAnchorEl, setTemplateAnchorEl] = React.useState(null)

  const handleTemplateOpen = (event) => {
    setTemplateAnchorEl(event.currentTarget)
  }

  const handleTemplateClose = (event) => {
    if (event.target.value) {
      setSelectedTemplateId(event.target.value)
      nextStep()
    }
    setTemplateAnchorEl(null)
  }

  return (
    <>
      {!templateData || !selectedTemplateId ? null : (
        <StyledContainer>
          <Box
            display="flex"
            // justifyContent="center"
            // alignContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Box>
              <Button onClick={handleTemplateOpen}>
                Select Inspection Template
              </Button>
            </Box>
            <Box>
              <Menu
                id="simple-menu"
                anchorEl={templateAnchorEl}
                keepMounted
                open={Boolean(templateAnchorEl)}
                onClose={handleTemplateClose}
              >
                {templateData.templates.map((template) => (
                  <MenuItem
                    onClick={handleTemplateClose}
                    key={template.id}
                    value={template.id}
                  >
                    {template.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box width="100%">
              <MasterPageStoreItem
                template={
                  templateData.templates.filter(
                    (template) => template.id === selectedTemplateId,
                  )[0]
                }
                dumbComponent
              />
            </Box>
          </Box>
        </StyledContainer>
      )}
    </>
  )
}
