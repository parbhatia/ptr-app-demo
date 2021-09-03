// Take an image URL, downscale it to the given width, and return a new image URL.
export default async function downscaleImage(
  dataUrl,
  newWidth,
  imageType,
  imageArguments
) {
  var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl
  // Provide default values
  imageType = imageType || "image/jpeg"
  imageArguments = imageArguments || 0.7

  // Create a temporary image so that we can compute the height of the downscaled image.
  await new Promise((resolve) => {
    image = new Image()
    image.src = dataUrl
    image.onload = function () {
      oldWidth = image.width
      oldHeight = image.height
      resolve()
    }
  })

  newHeight = Math.floor((oldHeight / oldWidth) * newWidth)
  // Create a temporary canvas to draw the downscaled image on.
  canvas = document.createElement("canvas")
  canvas.width = newWidth
  canvas.height = newHeight

  // Draw the downscaled image on the canvas and return the new data URL.
  ctx = canvas.getContext("2d")
  ctx.drawImage(image, 0, 0, newWidth, newHeight)
  newDataUrl = canvas.toDataURL(imageType, imageArguments)
  return newDataUrl
}
