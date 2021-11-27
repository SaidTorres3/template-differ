import { diffWords } from "diff"
import { docxToString } from "../docxParser/docxToString"

export const compareTwoDocx = async (filePath1: string, filePath2: string) => {
  const firstDocx = await docxToString(filePath1)
  const secondDocx = await docxToString(filePath2)

  const diff = diffWords(secondDocx, firstDocx)
  return diff
}