"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Plus, RefreshCw } from "lucide-react"

import type { SchemaColumn, CreateSchemaColumn } from "@/types/schema-column"
import { schemaColumnApi, ApiError } from "@/lib/api"
import { SchemaColumnsTable } from "@/components/schema-columns-table"
import { SchemaColumnForm } from "@/components/schema-column-form"
import { Filters } from "@/components/filters"

export default function SchemaColumnsPage() {
  const [columns, setColumns] = useState<SchemaColumn[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingColumn, setEditingColumn] = useState<SchemaColumn | null>(null)
  const [currentFilters, setCurrentFilters] = useState<{ baseId?: number; seriesId?: number }>({})
  const { toast } = useToast()

  const loadColumns = async (baseId?: number, seriesId?: number) => {
    setIsLoading(true)
    try {
      const data = await schemaColumnApi.getColumns(baseId, seriesId)
      setColumns(data)
      setCurrentFilters({ baseId, seriesId })
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
      await loadColumns(currentFilters.baseId, currentFilters.seriesId)
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

    try {
      await schemaColumnApi.updateColumn(editingColumn.ColumnId, data)
      toast({
        title: "Success",
        description: "Column updated successfully",
      })
      setIsDialogOpen(false)
      setEditingColumn(null)
      await loadColumns(currentFilters.baseId, currentFilters.seriesId)
    } catch (error) {
      console.error("Failed to update column:", error)
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
      await loadColumns(currentFilters.baseId, currentFilters.seriesId)
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

  const handleEdit = (column: SchemaColumn) => {
    setEditingColumn(column)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingColumn(null)
  }

  useEffect(() => {
    loadColumns()
  }, [])

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schema Columns Management</h1>
          <p className="text-muted-foreground">Manage your database schema columns with full CRUD operations</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => loadColumns(currentFilters.baseId, currentFilters.seriesId)}
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

      <Filters onFilter={loadColumns} isLoading={isLoading} />

      <Card>
        <CardHeader>
          <CardTitle>Schema Columns ({columns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <SchemaColumnsTable
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDeleteColumn}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
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
