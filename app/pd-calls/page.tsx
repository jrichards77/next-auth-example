"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const DEALS_URL = "ps://leadfunding-016e90.pipedrive.com/"

type DealsResponse = unknown

export default function PipedriveCallsPage() {
  const [selection, setSelection] = useState("")
  const [deals, setDeals] = useState<DealsResponse | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSelection = async (value: string) => {
    setSelection(value)
    setDeals(null)
    setError("")

    if (value !== "Get Deals") {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(DEALS_URL)
      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status} ${response.statusText}`
        )
      }

      const text = await response.text()
      let payload: DealsResponse = text
      try {
        payload = JSON.parse(text)
      } catch (parseError) {
        payload = text
      }

      setDeals(payload)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load deals."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Pipedrive</h1>
        <p className="text-muted-foreground">
          Choose an action to work with Pipedrive deals.
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selection ? `Action: ${selection}` : "Select an action"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuRadioGroup
            value={selection}
            onValueChange={handleSelection}
          >
            <DropdownMenuRadioItem value="Get Deals">
              Get Deals
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Add Deal">
              Add Deal
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Update Deal">
              Update Deal
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="rounded-lg border border-dashed p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading deals...</p>
        ) : null}
        {!isLoading && error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}
        {!isLoading && !error && deals ? (
          <pre className="max-h-96 overflow-auto text-sm">
            {JSON.stringify(deals, null, 2)}
          </pre>
        ) : null}
        {!isLoading && !error && !deals ? (
          <p className="text-sm text-muted-foreground">
            Select “Get Deals” to retrieve the latest data.
          </p>
        ) : null}
      </div>
    </div>
  )
}
