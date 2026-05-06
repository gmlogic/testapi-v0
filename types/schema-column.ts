export interface SchemaColumn {
  columnId: number
  basecategory: number
  series?: number | null
  priority?: number | null
  field: string
  title: string
  colType: string
  editable?: boolean
  visible?: boolean
  values?: string | Record<string, unknown> | Array<Record<string, unknown>>
}

export interface CreateSchemaColumn {
  basecategory: number
  series?: number | null
  priority?: number | null
  field: string
  title: string
  colType: string
  editable?: boolean
  visible?: boolean
  values?: string | Record<string, unknown> | Array<Record<string, unknown>>
}
