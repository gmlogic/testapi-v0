"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { SchemaColumn, CreateSchemaColumn } from "@/types/schema-column"

interface SchemaColumnFormProps {
  column?: SchemaColumn
  onSubmit: (data: CreateSchemaColumn) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const COLUMN_TYPES = ["string", "number", "boolean", "date", "datetime", "text", "select", "multiselect"]

export function SchemaColumnForm({ column, onSubmit, onCancel, isLoading }: SchemaColumnFormProps) {
  const [formData, setFormData] = useState<CreateSchemaColumn>({
    baseCategory: column?.baseCategory || 0,
    seriesId: column?.seriesId || undefined,
    field: column?.field || "",
    title: column?.title || "",
    colType: column?.colType || "string",
    editable: column?.editable ?? true,
    values: column?.values || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="baseCategory">Base Category</Label>
          <Input
            id="baseCategory"
            type="number"
            value={formData.baseCategory}
            onChange={(e) => setFormData({ ...formData, baseCategory: Number.parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seriesId">Series ID (Optional)</Label>
          <Input
            id="seriesId"
            type="number"
            value={formData.seriesId || ""}
            onChange={(e) =>
              setFormData({ ...formData, seriesId: e.target.value ? Number.parseInt(e.target.value) : undefined })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="field">Field Name</Label>
        <Input
          id="field"
          value={formData.field}
          onChange={(e) => setFormData({ ...formData, field: e.target.value })}
          maxLength={50}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          maxLength={100}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="colType">Column Type</Label>
        <Select value={formData.colType} onValueChange={(value) => setFormData({ ...formData, colType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select column type" />
          </SelectTrigger>
          <SelectContent>
            {COLUMN_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="editable"
          checked={formData.editable}
          onCheckedChange={(checked) => setFormData({ ...formData, editable: checked as boolean })}
        />
        <Label htmlFor="editable">Editable</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="values">Values (Optional)</Label>
        <Textarea
          id="values"
          value={formData.values || ""}
          onChange={(e) => setFormData({ ...formData, values: e.target.value })}
          placeholder="Enter comma-separated values for select types"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : column ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
