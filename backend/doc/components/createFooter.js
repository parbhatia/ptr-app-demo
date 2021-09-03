module.exports = function (currentPage, pageCount) {
  if (currentPage === 1) {
    return null
  } else {
    return {
      text: "Page " + currentPage.toString(),
      style: "footer",
      margin: [0, 0, 50, 0],
    }
  }
}
