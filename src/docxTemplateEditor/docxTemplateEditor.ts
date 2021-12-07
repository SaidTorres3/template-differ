import { readFileSync, writeFileSync } from "fs"
import { docxToEditableObjects } from "../docxParser/docxToEditableObjects"
import { editableObjectToDocx } from "../docxParser/editableObjectToDocx"
import { JSDOM } from "jsdom";
import { Phrase } from "../types";

// const ñ = {
//   value: ', se dio NADA, ESTO SE HA MODIFICADO CORRECTAMENTE',
//   paragraphIndex: 57,
//   sentenseIndex: 12
// }

// const editDocx = () => {
//   editableObjectToDocx({
//     modifiedObjects: [ñ],
//     fileInPath: "src/template.docx",
//     fileOutPath: "src/templateModified.docx"
//   })
// }

// editDocx()

const createTemplateEditor = async () => {
  const editableObjects = await docxToEditableObjects("src/template.docx")
  const html = readFileSync('src/docxTemplateEditor/templateEditor.html', 'utf8')
  const dom = new JSDOM(html);
  
  let labels: string = '';
  editableObjects.forEach(({ value, paragraphIndex, sentenseIndex }) => {
    labels += `<span>${value}</span>`
  })

  const textElement = dom.window.document.getElementById('text')!
  textElement.innerHTML = labels;

  // export dom
  const templateEditor = dom.serialize()
  writeFileSync('src/templateEditor.html', templateEditor)
}

createTemplateEditor()