const path = require("path")
// Define font files

const fontPath = path.join(process.cwd(), "doc", "fonts")

const makeFontPath = (font) => `${fontPath}/${font}.ttf`

const fonts = {
  Roboto: {
    normal: makeFontPath("Roboto-Regular"),
    bold: makeFontPath("Roboto-Medium"),
    italics: makeFontPath("Roboto-Italic"),
    bolditalics: makeFontPath("Roboto-Medium"),
  },
  Arial: {
    normal: makeFontPath("arial-black"),
    bold: makeFontPath("arial-black"),
    italics: makeFontPath("arial-black"),
    bolditalics: makeFontPath("arial-black"),
  },
  Noto: {
    normal: makeFontPath("NotoSans-Regular"),
    bold: makeFontPath("NotoSans-Bold"),
    italics: makeFontPath("NotoSans-Italic"),
    bolditalics: makeFontPath("NotoSans-BoldItalic"),
  },
  SourceSans: {
    normal: makeFontPath("SourceSansPro-Regular"),
    bold: makeFontPath("SourceSansPro-Bold"),
    italics: makeFontPath("SourceSansPro-Italic"),
    bolditalics: makeFontPath("SourceSansPro-BoldItalic"),
  },
  SourceSansLight: {
    normal: makeFontPath("SourceSansPro-SemiBold"),
    bold: makeFontPath("SourceSansPro-SemiBold"),
    italics: makeFontPath("SourceSansPro-SemiBold"),
    bolditalics: makeFontPath("SourceSansPro-SemiBold"),
  },
  SourceSansBold: {
    normal: makeFontPath("SourceSansPro-Black"),
    bold: makeFontPath("SourceSansPro-Black"),
    italics: makeFontPath("SourceSansPro-Black"),
    bolditalics: makeFontPath("SourceSansPro-Black"),
  },
}

module.exports = fonts
