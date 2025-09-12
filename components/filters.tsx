"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FiltersProps {
  onFilter: (baseId?: number, seriesId?: number) => void
  isLoading?: boolean
}

export function Filters({ onFilter, isLoading }: FiltersProps) {
  const [baseId, setBaseId] = useState<string>("")
  const [seriesId, setSeriesId] = useState<string>("")

  const handleFilter = () => {
    const baseIdNum = baseId ? Number.parseInt(baseId) : undefined
    const seriesIdNum = seriesId ? Number.parseInt(seriesId) : undefined
    onFilter(baseIdNum, seriesIdNum)
  }

  const handleClear = () => {
    setBaseId("")
    setSeriesId("")
    onFilter()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end space-x-4">
          <div className="space-y-2">
            <Label htmlFor="filterBaseId">Base Category ID</Label>
            <Input
              id="filterBaseId"
              type="number"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
              placeholder="Enter base category ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterSeriesId">Series ID</Label>
            <Input
              id="filterSeriesId"
              type="number"
              value={seriesId}
              onChange={(e) => setSeriesId(e.target.value)}
              placeholder="Enter series ID"
            />
          </div>
          <div className="space-x-2">
            <Button onClick={handleFilter} disabled={isLoading}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={isLoading}>
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
