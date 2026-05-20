"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Calculator, Plus, RefreshCw, Wrench } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filters } from "@/components/filters"
import { SchemaColumnsTable } from "@/components/schema-columns-table"
import { SchemaColumnForm } from "@/components/schema-column-form"

import type { SchemaColumn, CreateSchemaColumn, CategoryItem } from "@/types/schema-column"
import { schemaColumnApi, ApiError, setApiBaseUrl, getCategoryItems } from "@/lib/api"

const API_SERVERS = {
  remote: {
    label: "Remote Server",
    value: "https://www.alfaeorders.com:19443",
  },
  local: {
    label: "Local Server",
    value: "https://gmapi.kfertilizers.gr:19581",
  },
  testlocal: {
    label: "test Local Server",
    value: "http://192.168.10.108:29581",
  },
} as const

type ServerKey = keyof typeof API_SERVERS

export default function SchemaColumnsPage() {
  const [columns, setColumns] = useState<SchemaColumn[]>([])
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingColumn, setEditingColumn] = useState<SchemaColumn | null>(null)
  const [currentFilters, setCurrentFilters] = useState<{ basecategory?: number; series?: number }>({})
  const [seriesInputValue, setSeriesInputValue] = useState<string>("")
  const [apiUrl, setApiUrl] = useState<string>("")
  const [selectedServer, setSelectedServer] = useState<ServerKey>("testlocal")
  const { toast } = useToast()

  useEffect(() => {
    fetch("/config.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) {
          console.log(`[v0] Config.json not found (${res.status}), using fallback URL`)
          throw new Error(`Config not available (${res.status})`)
        }
        const contentType = res.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.log("[v0] Config.json response is not JSON, using fallback URL")
          throw new Error("Config response is not JSON")
        }
        return res.json()
      })
      .then((cfg) => {
        setApiUrl(cfg.API_URL)
        setApiBaseUrl(cfg.API_URL)
        console.log("[v0] Loaded API URL from config:", cfg.API_URL)
      })
      .catch((err) => {
        console.log("[v0] Config.json not available, using fallback URL:", err.message)
        const fallbackUrl = API_SERVERS[selectedServer].value
        setApiUrl(fallbackUrl)
        setApiBaseUrl(fallbackUrl)
        console.log("[v0] Using fallback API URL:", fallbackUrl)
      })
  }, [])

  const handleServerChange = (key: ServerKey) => {
    setSelectedServer(key)
    const url = API_SERVERS[key].value
    setApiUrl(url)
    setApiBaseUrl(url)
    loadColumns(currentFilters.basecategory, currentFilters.series)
  }

  const loadColumns = async (basecategory?: number, series?: number) => {
    setIsLoading(true)
    try {
      const data = await schemaColumnApi.getColumns(basecategory, series)
      const uniqueCategories = basecategory !== undefined
        ? [basecategory]
        : [...new Set(data.map((c) => c.basecategory).filter((v) => v != null))]
      const itemArrays = await Promise.all(uniqueCategories.map((cat) => getCategoryItems(cat)))
      const items = itemArrays.flat()
      setColumns(data)
      setCategoryItems(items)
      setCurrentFilters({ basecategory, series })
    } catch (error) {
      console.error("Failed to load columns:", error)
      toast({
        title: "Error",
        description: error instanceof ApiError ? `Failed to load columns: ${error.message}` : "Failed to load columns",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateColumn = async (data: CreateSchemaColumn) => {
    try {
      await schemaColumnApi.createColumn(data)
      toast({
        title: "Success",
        description: "Column created successfully",
      })
      setIsDialogOpen(false)
      await loadColumns(currentFilters.basecategory, currentFilters.series)
    } catch (error) {
      console.error("Failed to create column:", error)
      toast({
        title: "Error",
        description:
          error instanceof ApiError ? `Failed to create column: ${error.message}` : "Failed to create column",
        variant: "destructive",
      })
    }
  }

  const handleUpdateColumn = async (data: CreateSchemaColumn) => {
    if (!editingColumn) return

    console.log("[v0] Starting update for column:", editingColumn)
    console.log("[v0] Column ID from editingColumn:", editingColumn.columnId)
    console.log("[v0] Form data to update:", data)

    try {
      await schemaColumnApi.updateColumn(editingColumn.columnId, data)
      toast({
        title: "Success",
        description: "Column updated successfully",
      })
      setIsDialogOpen(false)
      setEditingColumn(null)
      await loadColumns(currentFilters.basecategory, currentFilters.series)
    } catch (error) {
      console.error("[v0] Failed to update column:", error)
      toast({
        title: "Error",
        description:
          error instanceof ApiError ? `Failed to update column: ${error.message}` : "Failed to update column",
        variant: "destructive",
      })
    }
  }

  const handleDeleteColumn = async (id: number) => {
    if (!confirm("Are you sure you want to delete this column?")) return

    try {
      await schemaColumnApi.deleteColumn(id)
      toast({
        title: "Success",
        description: "Column deleted successfully",
      })
      await loadColumns(currentFilters.basecategory, currentFilters.series)
    } catch (error) {
      console.error("Failed to delete column:", error)
      toast({
        title: "Error",
        description:
          error instanceof ApiError ? `Failed to delete column: ${error.message}` : "Failed to delete column",
        variant: "destructive",
      })
    }
  }

  const handleFixFromSeries = async () => {
    const { basecategory, series } = currentFilters
    if (basecategory === undefined || series === undefined) return

    const refItem = categoryItems.find((i) => i.id === series)
    const groupSeriesIds = refItem
      ? categoryItems.filter((i) => i.priceC === refItem.priceC && i.id !== series).map((i) => i.id)
      : []

    const confirmed = confirm(
      `Θα ενημερωθούν τα πεδία priority, colType, editable, required, visible\nσε ${groupSeriesIds.length} σειρές του group ${refItem?.priceC ?? ""}.\n\nΣυνέχεια;`
    )
    if (!confirmed) return

    setIsLoading(true)
    try {
      const allColumns = await schemaColumnApi.getColumns(basecategory)
      const refMap = new Map(columns.map((c) => [c.field, c]))
      const toUpdate = allColumns.filter(
        (c) => c.series != null && groupSeriesIds.includes(c.series) && refMap.has(c.field)
      )

      let successCount = 0
      let errorCount = 0
      for (const col of toUpdate) {
        const ref = refMap.get(col.field)!
        try {
          await schemaColumnApi.updateColumn(col.columnId, {
            basecategory: col.basecategory,
            series: col.series ?? undefined,
            priority: ref.priority,
            field: col.field,
            title: col.title,
            colType: ref.colType,
            editable: ref.editable,
            visible: ref.visible,
            required: ref.required,
            values: col.values,
          })
          successCount++
        } catch {
          errorCount++
        }
      }

      toast({
        title: errorCount === 0 ? "Success" : "Partial success",
        description: `Ενημερώθηκαν ${successCount} records${errorCount > 0 ? `, ${errorCount} απέτυχαν` : ""}`,
        variant: errorCount === 0 ? "default" : "destructive",
      })
      await loadColumns(basecategory, series)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToGroup = async (column: SchemaColumn, targetSeries: number[]) => {
    setIsLoading(true)
    let successCount = 0
    let errorCount = 0
    for (const seriesId of targetSeries) {
      try {
        await schemaColumnApi.createColumn({
          basecategory: column.basecategory,
          series: seriesId,
          priority: column.priority,
          field: column.field,
          title: column.title,
          colType: column.colType,
          editable: column.editable,
          visible: column.visible,
          required: column.required,
          values: column.values,
        })
        successCount++
      } catch {
        errorCount++
      }
    }
    toast({
      title: errorCount === 0 ? "Success" : "Partial success",
      description: `Δημιουργήθηκαν ${successCount} αντίγραφα${errorCount > 0 ? `, ${errorCount} απέτυχαν` : ""}`,
      variant: errorCount === 0 ? "default" : "destructive",
    })
    await loadColumns(currentFilters.basecategory, currentFilters.series)
  }

  const handleEdit = (column: SchemaColumn) => {
    console.log("[v0] Edit button clicked for column:", column)
    console.log("[v0] Column ID:", column.columnId)
    setEditingColumn(column)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingColumn(null)
  }

  useEffect(() => {
    if (apiUrl) {
      loadColumns()
    }
  }, [apiUrl])

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schema Columns Management</h1>
          <p className="text-muted-foreground">Manage your database schema columns with full CRUD operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedServer} onValueChange={(v) => handleServerChange(v as ServerKey)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(API_SERVERS) as ServerKey[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {API_SERVERS[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => loadColumns(currentFilters.basecategory, currentFilters.series)}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
        </div>
      </div>

      <Filters onFilter={loadColumns} onSeriesInputChange={setSeriesInputValue} isLoading={isLoading} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Schema Columns ({columns.length})</CardTitle>
            {seriesInputValue !== "" && (
              <Button variant="outline" size="sm" onClick={handleFixFromSeries} disabled={isLoading}>
                <Calculator className="h-4 w-4 mr-2" />
                Fix from selected series
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <SchemaColumnsTable
            columns={columns}
            categoryItems={categoryItems}
            onEdit={handleEdit}
            onDelete={handleDeleteColumn}
            onCopyToGroup={handleCopyToGroup}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingColumn ? "Edit Column" : "Create New Column"}</DialogTitle>
          </DialogHeader>
          <SchemaColumnForm
            column={editingColumn || undefined}
            onSubmit={editingColumn ? handleUpdateColumn : handleCreateColumn}
            onCancel={handleCloseDialog}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
