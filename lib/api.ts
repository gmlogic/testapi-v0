import type { SchemaColumn, CreateSchemaColumn } from "@/types/schema-column"

const API_BASE_URL = "https://www.alfaeorders.com:19443/erpapi/panel"

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
  async updateColumn(id: number, column: Partial<CreateSchemaColumn>): Promise<SchemaColumn> {
    const response = await fetch(`${API_BASE_URL}/schema/columns/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(column),
    })
    return handleResponse<SchemaColumn>(response)
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
