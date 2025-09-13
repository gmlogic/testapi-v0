import type { SchemaColumn, CreateSchemaColumn } from "@/types/schema-column"

let API_BASE_URL = "https://www.alfaeorders.com:19443/erpapi/panel" // fallback default

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

// Function to get the current API base URL
export const getApiBaseUrl = () => API_BASE_URL

// Function to set the API base URL from config
export const setApiBaseUrl = (baseUrl: string) => {
  API_BASE_URL = `${baseUrl}/erpapi/panel`
}

export const schemaColumnApi = {
  // GET: Fetch all columns with optional filters
  async getColumns(baseId?: number, seriesId?: number): Promise<SchemaColumn[]> {
    const params = new URLSearchParams()
    if (baseId !== undefined) params.append("baseId", baseId.toString())
    if (seriesId !== undefined) params.append("seriesId", seriesId.toString())

    const url = `${API_BASE_URL}/schema/columns${params.toString() ? `?${params.toString()}` : ""}`
    const response = await fetch(url)
    return handleResponse<SchemaColumn[]>(response)
  },

  // POST: Create new column
  async createColumn(column: CreateSchemaColumn): Promise<SchemaColumn> {
    const response = await fetch(`${API_BASE_URL}/schema/columns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(column),
    })
    return handleResponse<SchemaColumn>(response)
  },

  // PUT: Update existing column
  async updateColumn(id: number, column: CreateSchemaColumn): Promise<SchemaColumn> {
    const updateData = {
      columnId: id,
      baseCategory: column.baseCategory,
      seriesId: column.seriesId, // Don't default to 0, keep undefined/null
      priority: column.priority,
      field: column.field,
      title: column.title,
      colType: column.colType,
      editable: column.editable,
      values: column.values || "",
    }

    console.log("[v0] Updating column with ID:", id)
    console.log("[v0] Update data being sent:", JSON.stringify(updateData, null, 2))

    const response = await fetch(`${API_BASE_URL}/schema/columns/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    console.log("[v0] Update response status:", response.status)
    console.log("[v0] Update response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Update error response:", errorText)
      throw new ApiError(response.status, `HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] Update successful, response:", result)
    return result
  },

  // DELETE: Delete column
  async deleteColumn(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/schema/columns/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }
  },
}
