import { Change } from "diff";
import { readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";

export const createDiffVisualizer = (opts: { diff: Change[], savePath: string, dataPath?: string }) => {
  const html = readFileSync('src/diffVisualizer/diffTemplate.html', 'utf8')
  const dom = new JSDOM(html)
  let outputPart = ''; let templatePart = '';
  opts.diff.forEach((change) => {
    if (change.added) {
      outputPart += `<span class="addedElement">${change.value}</span>`
    } else if (change.removed) {
      templatePart += `<span class="deletedElement">${change.value}</span>`
    } else {
      outputPart += `<span>${change.value}</span>`
      templatePart += `<span>${change.value}</span>`
    }
  })
  dom.window.document.getElementById("output")!.innerHTML = outputPart
  dom.window.document.getElementById("template")!.innerHTML = templatePart

  if (opts.dataPath) {
    const data = JSON.parse(readFileSync(opts.dataPath, 'utf8'))
    const dataShowerElement = dom.window.document.getElementById('data-shower')!
    const addDataToHTML = (object: JSON, path: string) => {
      if (object instanceof Object) {
        Object.entries(object).forEach(([key, value]) => addDataToHTML(value, `${path}.${key}`))
      } else {
        if (dataShowerElement) dataShowerElement.innerHTML += `<span>${(path + ": " + object + '\r\n')}</span>`
      }
    }
    addDataToHTML(data, 'data')
  }

  const htmlDiff = dom.serialize()
  writeFileSync(opts.savePath, htmlDiff)
}