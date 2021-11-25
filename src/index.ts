import { docxToString } from "./docxParser/docxToString";
import { diffWords } from 'diff'
import { JSDOM } from 'jsdom'
import { writeFileSync } from 'fs'

const compareTwoDocx = async (filePath1: string, filePath2: string) => {
  const firstDocx = await docxToString(filePath1)
  const secondDocx = await docxToString(filePath2)
  // const firstDocx = "hola test what is that and what does the count number mean... change one one one, this continue the text, until suddently: 54"
  // const secondDocx = "Hola test what is that and what does the count number mean... change two one one, this continue the text, until suddently: 45"

  const diff = diffWords(secondDocx, firstDocx)
  return diff
}

compareTwoDocx("src/out.docx", "src/template.docx").then(diff => {
  const dom = new JSDOM()
  diff.forEach((part) => {
    // green for additions, red for deletions, grey for common parts
    const color = part.added ? 'green' :
      part.removed ? 'red' : 'white'
    const span = dom.window.document.createElement('span')
    span.style.color = color
    span.append(part.value)
    dom.window.document.body.append(span)
  })

  const htmlDiff = dom.serialize()
  writeFileSync('src/diff.html', htmlDiff)
})