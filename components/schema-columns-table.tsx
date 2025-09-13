"use client"

import type { SchemaColumn } from "@/types/schema-column"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"

interface SchemaColumnsTableProps {
  columns: SchemaColumn[]
  onEdit: (column: SchemaColumn) => void
  onDelete: (id: number) => void
  isLoading?: boolean
}

export function SchemaColumnsTable({ columns, onEdit, onDelete, isLoading }: SchemaColumnsTableProps) {
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
            <TableHead>Series ID</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Editable</TableHead>
            <TableHead>Values</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {columns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground">
                No columns found
              </TableCell>
            </TableRow>
          ) : (
            columns.map((column) => (
              <TableRow key={column.columnId}>
                <TableCell className="font-medium">{column.columnId}</TableCell>
                <TableCell className="font-mono text-sm">{column.field}</TableCell>
                <TableCell>{column.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{column.colType}</Badge>
                </TableCell>
                <TableCell>{column.baseCategory}</TableCell>
                <TableCell>{column.seriesId || "-"}</TableCell>
                <TableCell>{column.priority || "-"}</TableCell>
                <TableCell>
                  <Badge variant={column.editable ? "default" : "outline"}>{column.editable ? "Yes" : "No"}</Badge>
                </TableCell>
                <TableCell className="max-w-32 truncate" title={column.values}>
                  {column.values || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(column)} disabled={isLoading}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(column.columnId)} disabled={isLoading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
