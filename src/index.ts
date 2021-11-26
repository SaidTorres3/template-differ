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
  const elementOne = dom.window.document.getElementById("output")
  const elementTwo = dom.window.document.getElementById("template")
  if (!elementOne || !elementTwo) { return }
  console.log('init forEach')
  diff.forEach((change) => {
    // green for additions, red for deletions, grey for common parts
    if (change.added) {
      elementOne.innerHTML += `<span style="color:green">${change.value}</span>`
    } else if (change.removed) {
      elementTwo.innerHTML += `<span style="color:red">${change.value}</span>`
    } else {
      elementOne.innerHTML += `<span>${change.value}</span>`
      elementTwo.innerHTML += `<span>${change.value}</span>`
    }
  })
  console.log('finished')

  const dataShowerElement = dom.window.document.getElementById('data-shower')
  const data: JSON = JSON.parse(readFileSync('src/data.json', 'utf8'))
  function printObject(object: JSON, path: string) {
    if (object instanceof Object) {
      Object.entries(object).forEach(([key, value]) => printObject(value, `${path}.${key}`))
    } else {
      if (dataShowerElement) dataShowerElement.innerHTML += (path + ": " + object + `\r\n`)
      // console.log(path, object)
    }
  }
  printObject(data, 'data')
  // add data to dom in 'data-shower' element

  const htmlDiff = dom.serialize()
  writeFileSync('src/diff.html', htmlDiff)
})