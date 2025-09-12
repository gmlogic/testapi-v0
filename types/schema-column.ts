export interface SchemaColumn {
  ColumnId: number
  BaseCategory: number
  SeriesId?: number
  Field: string
  Title: string
  ColType: string
  Editable?: boolean
  Values?: string
}

export interface CreateSchemaColumn {
  BaseCategory: number
  SeriesId?: number
  Field: string
  Title: string
  ColType: string
  Editable?: boolean
  Values?: string
}
