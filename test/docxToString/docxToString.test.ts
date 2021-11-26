import { docxToString } from '../../src/docxParser/docxToString'
import fs from 'fs'

jest.setTimeout(20000)

test('Parse simple document.', async () => {
  const output = await docxToString('test/docxToString/simpleDocument/docx.docx');
  const expectedOutput = fs.readFileSync('test/docxToString/simpleDocument/expectedOutput.txt', { encoding: 'utf8' });
  expect(output).toBe(expectedOutput);
});

test('Parse document with a image.', async () => {
  const output = await docxToString('test/docxToString/documentWithImg/eldestierrodelrayo.docx');
  const expectedOutput = fs.readFileSync('test/docxToString/documentWithImg/expectedOutput.txt', { encoding: 'utf8' });
  expect(output).toBe(expectedOutput);
});

test('Parse a large document.', async () => {
  const output = await docxToString('test/docxToString/largeDocument/template.docx');
  const expectedOutput = fs.readFileSync('test/docxToString/largeDocument/expectedOutput.txt', { encoding: 'utf8' });
  fs.writeFileSync('test/docxToString/largeDocument/output.txt', output);
  expect(output).toBe(expectedOutput);
});