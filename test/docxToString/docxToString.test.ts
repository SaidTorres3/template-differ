import { docxToString } from '../../src/docxParser/docxToString'
import fs from 'fs'

jest.setTimeout(20000)

test('Does the the function parse correctly the text of the docx', () => {
  return docxToString('test/docxToString/docx.docx').then((data: string) => {
    const txt = fs.readFileSync('test/docxToString/docx.txt', {encoding: 'utf8'})
    expect(data).toBe(txt)
  });
});