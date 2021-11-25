import fs from 'fs';
import JSZip from 'jszip'
import { parseString } from 'xml2js'

export const docxToString = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const docxFile = fs.readFileSync(filePath);
    // unzip the file
    const zip = new JSZip();
    zip.loadAsync(docxFile).then(function (zip) {
      // get the content of the document.xml file
      const wordFolder = zip.folder('word')
      if (!wordFolder) { reject(`An error ocurred attempting to enter to the folder 'word' of the docx file.`); return }
      const file = wordFolder.file("document.xml")
      if (!file) { reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`); return }
      file.async('string').then(function (XMLContent) {
        parseString(XMLContent, function (err, result) {
          const paragraphs = result['w:document']['w:body'][0]['w:p']
          let docxInTxt: string = ''

          paragraphs.forEach((paragraph: { [x: string]: { [x: string]: any[]; }[]; }) => {
            const WRLabel = paragraph['w:r']
            if (!WRLabel || !WRLabel.length) return
            let textInTheParagraph: string = '';
            WRLabel.forEach((WR: { [x: string]: any[]; }) => {
              let text: string = '';
              const WTLabel = WR['w:t']
              // check if WTLabel is an object and has the "_" property
              if (WTLabel && WTLabel.length && WTLabel[0]['_']) {
                text = WTLabel[0]['_']
              } else {
                if (WTLabel && WTLabel.length && typeof WTLabel[0] === 'string') {
                  text = WTLabel[0]
                } else {
                  if (WTLabel && WTLabel.length && WTLabel[0]['$']) {
                    text = " "
                  }
                }
              }
              textInTheParagraph += text
            })
            textInTheParagraph += '\n'
            docxInTxt += textInTheParagraph
          })

          resolve(docxInTxt)
        });
      })
    });
  })
}