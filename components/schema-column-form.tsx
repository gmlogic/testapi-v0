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
    BaseCategory: column?.BaseCategory || 0,
    SeriesId: column?.SeriesId || undefined,
    Field: column?.Field || "",
    Title: column?.Title || "",
    ColType: column?.ColType || "string",
    Editable: column?.Editable ?? true,
    Values: column?.Values || "",
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
            value={formData.BaseCategory}
            onChange={(e) => setFormData({ ...formData, BaseCategory: Number.parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seriesId">Series ID (Optional)</Label>
          <Input
            id="seriesId"
            type="number"
            value={formData.SeriesId || ""}
            onChange={(e) =>
              setFormData({ ...formData, SeriesId: e.target.value ? Number.parseInt(e.target.value) : undefined })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="field">Field Name</Label>
        <Input
          id="field"
          value={formData.Field}
          onChange={(e) => setFormData({ ...formData, Field: e.target.value })}
          maxLength={50}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.Title}
          onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
          maxLength={100}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="colType">Column Type</Label>
        <Select value={formData.ColType} onValueChange={(value) => setFormData({ ...formData, ColType: value })}>
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
          checked={formData.Editable}
          onCheckedChange={(checked) => setFormData({ ...formData, Editable: checked as boolean })}
        />
        <Label htmlFor="editable">Editable</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="values">Values (Optional)</Label>
        <Textarea
          id="values"
          value={formData.Values || ""}
          onChange={(e) => setFormData({ ...formData, Values: e.target.value })}
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
