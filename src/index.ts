import { docxToString } from "./docxParser/docxToString";
import { diffChars, diffSentences, diffWords, diffWordsWithSpace } from 'diff'
import { JSDOM } from 'jsdom'
import { writeFileSync, readFileSync } from 'fs'

const compareTwoDocx = async (filePath1: string, filePath2: string) => {
  const firstDocx = await docxToString(filePath1)
  const secondDocx = await docxToString(filePath2)

  const diff = diffWords(secondDocx, firstDocx)
  return diff
}

const html = readFileSync('./src/diffTemplate.html', 'utf8')

compareTwoDocx("src/out.docx", "src/template.docx").then(diff => {
  const dom = new JSDOM(html)
  // count if add and remove has the same amount
  const removed = diff.filter(item => item.removed).length
  const added = diff.filter(item => item.added).length

  console.log("Removed: " + removed, ",Added: " + added)
  diff.forEach((part) => {
    // green for additions, red for deletions, grey for common parts
    const color = part.added ? 'green' :
      part.removed ? 'red' : 'white'

    const elementOne = dom.window.document.getElementById("output")
    const elementTwo = dom.window.document.getElementById("template")

    if (part.added) {
      if (elementOne) elementOne.innerHTML += `<span style="color: ${color}">${part.value}</span>`
    } else if (part.removed) {
      if (elementTwo) elementTwo.innerHTML += `<span style="color: ${color}">${part.value}</span>`
    } else {
      if (elementOne) elementOne.innerHTML += `<span>${part.value}</span>`
      if (elementTwo) elementTwo.innerHTML += `<span>${part.value}</span>`
    }

    // space in html: &nbsp;
  })

  const htmlDiff = dom.serialize()
  writeFileSync('src/diff.html', htmlDiff)
})