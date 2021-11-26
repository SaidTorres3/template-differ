import { docxToString } from "./docxParser/docxToString";
import { Change, diffWords } from 'diff'
import { JSDOM } from 'jsdom'
import { writeFileSync, readFileSync } from 'fs'

const compareTwoDocx = async (filePath1: string, filePath2: string) => {
  const firstDocx = await docxToString(filePath1)
  const secondDocx = await docxToString(filePath2)

  const diff = diffWords(secondDocx, firstDocx)
  return diff
}

compareTwoDocx("src/out.docx", "src/template.docx").then(diff => {
  createHTMLThatShowsDiff(diff)
})

const createHTMLThatShowsDiff = (diff: Change[]) => {
  const html = readFileSync('./src/diffTemplate.html', 'utf8')
  const dom = new JSDOM(html)
  let outputPart = ''; let templatePart = '';
  diff.forEach((change) => {
    if (change.added) {
      outputPart += `<span style="color:green">${change.value}</span>`
    } else if (change.removed) {
      templatePart += `<span style="color:red">${change.value}</span>`
    } else {
      outputPart += `<span>${change.value}</span>`
      templatePart += `<span>${change.value}</span>`
    }
  })
  dom.window.document.getElementById("output")!.innerHTML = outputPart
  dom.window.document.getElementById("template")!.innerHTML = templatePart
  
  const data: JSON = JSON.parse(readFileSync('src/data.json', 'utf8'))
  const dataShowerElement = dom.window.document.getElementById('data-shower')!
  function addDataToHTML(object: JSON, path: string) {
    if (object instanceof Object) {
      Object.entries(object).forEach(([key, value]) => addDataToHTML(value, `${path}.${key}`))
    } else {
      if (dataShowerElement) dataShowerElement.innerHTML += (path + ": " + object + `\r\n`)
    }
  }
  addDataToHTML(data, 'data')

  const htmlDiff = dom.serialize()
  writeFileSync('src/diff.html', htmlDiff)
}