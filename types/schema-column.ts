export interface SchemaColumn {
  columnId: number
  basecategory: number
  series?: number | null // Allow null values for series
  priority?: number | null
  field: string
  title: string
  colType: string
  editable?: boolean
  values?: string
}

export interface CreateSchemaColumn {
  basecategory: number
  series?: number | null // Allow null values for series
  priority?: number | null
  field: string
  title: string
  colType: string
  editable?: boolean
  values?: string
}
