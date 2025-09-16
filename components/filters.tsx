"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FiltersProps {
  onFilter: (basecategory?: number, series?: number) => void
  isLoading?: boolean
}

export function Filters({ onFilter, isLoading }: FiltersProps) {
  const [basecategory, setBasecategory] = useState<string>("")
  const [series, setSeries] = useState<string>("")

  const handleFilter = () => {
    const basecategoryNum = basecategory ? Number.parseInt(basecategory) : undefined
    const seriesNum = series ? Number.parseInt(series) : undefined
    onFilter(basecategoryNum, seriesNum)
  }

  const handleClear = () => {
    setBasecategory("")
    setSeries("")
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
            <Label htmlFor="filterBasecategory">Base Category</Label>
            <Input
              id="filterBasecategory"
              type="number"
              value={basecategory}
              onChange={(e) => setBasecategory(e.target.value)}
              placeholder="Enter base category"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterSeries">Series</Label>
            <Input
              id="filterSeries"
              type="number"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              placeholder="Enter series"
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
