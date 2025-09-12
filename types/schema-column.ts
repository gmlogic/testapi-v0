export interface SchemaColumn {
  columnId: number
  baseCategory: number
  seriesId?: number
  field: string
  title: string
  colType: string
  editable?: boolean
  values?: string
}

export interface CreateSchemaColumn {
  baseCategory: number
  seriesId?: number
  field: string
  title: string
  colType: string
  editable?: boolean
  values?: string
}
