"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
    basecategory: 0,
    series: null,
    priority: null,
    field: "",
    title: "",
    colType: "string",
    editable: true,
    values: "",
  })

  useEffect(() => {
    if (column) {
      console.log("[v0] Loading column data into form:", column) // Added debug log
      setFormData({
        basecategory: column.basecategory || 0,
        series: column.series || null,
        priority: column.priority || null,
        field: column.field || "",
        title: column.title || "",
        colType: column.colType || "string",
        editable: column.editable ?? true,
        values: column.values || "",
      })
    } else {
      setFormData({
        basecategory: 0,
        series: null,
        priority: null,
        field: "",
        title: "",
        colType: "string",
        editable: true,
        values: "",
      })
    }
  }, [column])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submission data:", formData) // Added debug log
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="basecategory">Base Category</Label>
          <Input
            id="basecategory"
            type="number"
            value={formData.basecategory}
            onChange={(e) => setFormData({ ...formData, basecategory: Number.parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="series">Series (Optional)</Label>
          <Input
            id="series"
            type="number"
            value={formData.series || ""}
            onChange={(e) =>
              setFormData({ ...formData, series: e.target.value ? Number.parseInt(e.target.value) : null })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority (Optional)</Label>
          <Input
            id="priority"
            type="number"
            value={formData.priority || ""}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value ? Number.parseInt(e.target.value) : null })
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
