
export interface Phrase {
  value: string,
  paragraphIndex: number,
  sentenseIndex: number
}

export interface EditableObjectToDocxOpts {
  modifiedObjects: Phrase[]
  fileIn: Buffer,
}

export interface PhraseCoords {
  paragraphIndex: number,
  sentenseIndex: number
}

export interface CreateTemplateOutputDiffVisualizerOpts {
  template: Buffer,
  output: Buffer,
  data: JSON|undefined,
}