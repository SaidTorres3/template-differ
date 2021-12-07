
export interface Phrase {
  value: string,
  paragraphIndex: number,
  sentenseIndex: number
}


export interface EditableObjectToDocxOpts {
  modifiedObjects: Phrase[]
  fileInPath: string,
  fileOutPath: string
}

export interface PhraseCoords {
  paragraphIndex: number,
  sentenseIndex: number
}