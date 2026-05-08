"use client"

import type { SchemaColumn, CategoryItem } from "@/types/schema-column"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Copy, Edit, Trash2 } from "lucide-react"

interface SchemaColumnsTableProps {
  columns: SchemaColumn[]
  categoryItems?: CategoryItem[]
  onEdit: (column: SchemaColumn) => void
  onDelete: (id: number) => void
  onCopyToGroup: (column: SchemaColumn, targetSeries: number[]) => void
  isLoading?: boolean
}

function displayValues(values: SchemaColumn["values"]): string {
  if (values == null) return "-"
  if (typeof values === "string") return values || "-"
  return JSON.stringify(values)
}

export function SchemaColumnsTable({ columns, categoryItems = [], onEdit, onDelete, onCopyToGroup, isLoading }: SchemaColumnsTableProps) {
  const itemMap = new Map(categoryItems.map((i) => [i.id, i]))

  const handleCopyToGroup = (column: SchemaColumn) => {
    const item = column.series != null ? itemMap.get(column.series) : undefined
    if (!item) {
      alert("Η σειρά δεν έχει group. Βάλε filter κατηγορίας πρώτα.")
      return
    }
    const groupSeries = categoryItems.filter((i) => i.priceC === item.priceC && i.id !== column.series)
    if (groupSeries.length === 0) {
      alert("Δεν υπάρχουν άλλες σειρές στο ίδιο group.")
      return
    }
    const names = groupSeries.map((i) => `${i.id}: ${i.name}`).join("\n")
    const confirmed = confirm(
      `Θα δημιουργηθούν ${groupSeries.length} αντίγραφα για το group ${item.priceC}:\n\n${names}\n\nΣυνέχεια;`
    )
    if (confirmed) {
      onCopyToGroup(column, groupSeries.map((i) => i.id))
    }
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Base Category</TableHead>
            <TableHead>Series</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Series Name</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Editable</TableHead>
            <TableHead>Visible</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Values</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {columns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={14} className="text-center text-muted-foreground">
                No columns found
              </TableCell>
            </TableRow>
          ) : (
            columns.map((column) => {
              const item = column.series != null ? itemMap.get(column.series) : undefined
              return (
              <TableRow key={column.columnId}>
                <TableCell className="font-medium">{column.columnId}</TableCell>
                <TableCell className="font-mono text-sm">{column.field}</TableCell>
                <TableCell>{column.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{column.colType}</Badge>
                </TableCell>
                <TableCell>{column.basecategory}</TableCell>
                <TableCell>{column.series || "-"}</TableCell>
                <TableCell>{item != null ? item.priceC : "-"}</TableCell>
                <TableCell className="max-w-48 truncate text-xs" title={item?.name}>{item?.name || "-"}</TableCell>
                <TableCell>{column.priority || "-"}</TableCell>
                <TableCell>
                  <Badge variant={column.editable ? "default" : "outline"}>{column.editable ? "Yes" : "No"}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={column.visible ? "default" : "outline"}>{column.visible ? "Yes" : "No"}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={column.required ? "default" : "outline"}>{column.required ? "Yes" : "No"}</Badge>
                </TableCell>
                <TableCell className="max-w-32 truncate" title={displayValues(column.values)}>
                  {displayValues(column.values)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(column)} disabled={isLoading}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCopyToGroup(column)} disabled={isLoading} title="Copy to group">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(column.columnId)} disabled={isLoading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
