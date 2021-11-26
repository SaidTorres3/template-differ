import { docxToString } from '../../src/docxParser/docxToString'
import fs from 'fs'

jest.setTimeout(20000)

test('Parse simple document.', () => {
  return docxToString('test/docxToString/simpleDocument/docx.docx').then((output: string) => {
    const expectedOutput = fs.readFileSync('test/docxToString/simpleDocument/expectedOutput.txt', {encoding: 'utf8'})
    expect(output).toBe(expectedOutput)
  });
});

test('Parse document with a image.', () => {
  return docxToString('test/docxToString/documentWithImg/eldestierrodelrayo.docx').then((output: string) => {
    const expectedOutput = fs.readFileSync('test/docxToString/documentWithImg/expectedOutput.txt', {encoding: 'utf8'})
    expect(output).toBe(expectedOutput)
  });
});

test('Parse a large document.', () => {
  return docxToString('test/docxToString/largeDocument/template.docx').then((output: string) => {
    const expectedOutput = fs.readFileSync('test/docxToString/largeDocument/expectedOutput.txt', {encoding: 'utf8'})
    fs.writeFileSync('test/docxToString/largeDocument/output.txt', output)
    expect(output).toBe(expectedOutput)
  });
});