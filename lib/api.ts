import type { SchemaColumn, CreateSchemaColumn, CategoryItem } from "@/types/schema-column"

let API_SERVER_URL = "https://www.alfaeorders.com:19443"
let API_BASE_URL = "https://www.alfaeorders.com:19443/erpapi/panel"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const getApiBaseUrl = () => API_BASE_URL

export const setApiBaseUrl = (baseUrl: string) => {
  API_SERVER_URL = baseUrl
  API_BASE_URL = `${baseUrl}/erpapi/panel`
}

export async function getCategoryItems(category: number): Promise<CategoryItem[]> {
  const pars = encodeURIComponent(JSON.stringify({ Company: 20, BOption: 70, JToken: { Category: String(category) } }))
  const url = `${API_SERVER_URL}/erpapi/getitems/obj?pars=${pars}`
  console.log("[v0] getCategoryItems calling:", url)
  const response = await fetch(url)
  const data = await handleResponse<CategoryItem[]>(response)
  console.log("[v0] getCategoryItems response:", data)
  return data
}

function mapToBackendFields(data: CreateSchemaColumn) {
  return {
    baseCategory: data.basecategory,
    series: data.series,
    priority: data.priority,
    field: data.field,
    title: data.title,
    colType: data.colType,
    editable: data.editable === true,
    visible: data.visible === true,
    required: data.required === 1 ? true : false,
    values: data.values == null
      ? null
      : typeof data.values === "string"
        ? data.values
        : JSON.stringify(data.values),
  }
}

function mapFromBackendFields(data: any): SchemaColumn {
  const columnId = typeof data.columnId === "number" ? data.columnId : (typeof data.id === "number" ? data.id : parseInt(data.columnId) || 0)
  const basecategory = typeof data.baseCategory === "number" ? data.baseCategory : parseInt(data.baseCategory) || 0
  const series = typeof data.series === "number" ? data.series : (data.series ? parseInt(data.series) : null)
  const priority = typeof data.priority === "number" ? data.priority : (data.priority ? parseInt(data.priority) : null)

  const required = (() => {
    if (typeof data.required === "number") return data.required ? 1 : 0
    if (typeof data.required === "boolean") return data.required ? 1 : 0
    return 0
  })()

  return {
    columnId,
    basecategory,
    series,
    priority,
    field: data.field || "",
    title: data.title || "",
    colType: data.colType || data.type || "string",
    editable: data.editable === true || data.editable === 1,
    visible: data.visible === true || data.visible === 1,
    required,
    values: data.values,
  }
}

export const schemaColumnApi = {
  async getColumns(basecategory?: number, series?: number): Promise<SchemaColumn[]> {
    const params = new URLSearchParams()
    if (basecategory !== undefined) params.append("baseCategory", basecategory.toString())
    if (series !== undefined) params.append("series", series.toString())

    const url = `${API_BASE_URL}/schema/columns${params.toString() ? `?${params.toString()}` : ""}`
    console.log("[v0] API GET URL:", url)
    const response = await fetch(url)
    const data = await handleResponse<any[]>(response)
    return data.map(mapFromBackendFields)
  },

  async createColumn(column: CreateSchemaColumn): Promise<SchemaColumn> {
    const backendData = mapToBackendFields(column)
    console.log("[v0] Creating column with backend data:", backendData)

    const response = await fetch(`${API_BASE_URL}/schema/columns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendData),
    })
    const data = await handleResponse<any>(response)
    return mapFromBackendFields(data)
  },

  async updateColumn(id: number, column: CreateSchemaColumn): Promise<SchemaColumn> {
    const backendData = mapToBackendFields(column)
    const updateData = {
      columnId: id,
      ...backendData,
      values: backendData.values ?? null,
    }

    console.log("[v0] Updating column with ID:", id)
    console.log("[v0] Update data being sent:", JSON.stringify(updateData, null, 2))

    const response = await fetch(`${API_BASE_URL}/schema/columns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    })

    console.log("[v0] Update response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Update error response:", errorText)
      throw new ApiError(response.status, `HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] Update successful, response:", result)
    return mapFromBackendFields(result)
  },

  async deleteColumn(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/schema/columns/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }
  },
}
