const fs = require("fs")
const path = require("path")
const mjml = require("mjml")
const mjmlFolder = path.join(__dirname, "..", "mjml")

fs.readdir(mjmlFolder, (err, files) => {
  if (err) {
    return console.error(err)
  }
  let fileContent

  files.forEach((file) => {
    console.warn("Template: " + file)
    fileContent = fs.readFileSync(path.join(__dirname, "..", "mjml", file))
    fileContent = mjml(fileContent.toString(), {
      keepComments: false,
      minify: true,
    })
    const newHbsFilePath = path.join(
      __dirname,
      "..",
      "templates",
      "email",
      file.replace(".mjml", ".hbs"),
    )
    fs.writeFileSync(newHbsFilePath, fileContent.html)
  })
})
