export interface SchemaColumn {
  columnId: number
  basecategory: number
  series?: number | null
  priority?: number | null
  field: string
  title: string
  colType: string
  editable?: boolean
  required?: number
  values?: string
}

export interface CreateSchemaColumn {
  basecategory: number
  series?: number | null
  priority?: number | null
  field: string
  title: string
  colType: string
  editable?: boolean
  required?: number
  values?: string
}
