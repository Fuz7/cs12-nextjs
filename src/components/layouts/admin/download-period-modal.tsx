"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DownloadPeriodModalProps {
  isOpen: boolean
  onClose: () => void
  onDownload: (period: "1month" | "3months" | "1year") => void
  title?: string
}

export function DownloadPeriodModal({ isOpen, onClose, onDownload, title = "Download Data" }: DownloadPeriodModalProps) {
  const periods = [
    { label: "1 Month", value: "1month" as const, icon: "📅" },
    { label: "3 Months", value: "3months" as const, icon: "📊" },
    { label: "1 Year", value: "1year" as const, icon: "📈" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-6">
          <p className="text-sm text-muted-foreground mb-4">Select the time period for your download:</p>
          
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => {
                onDownload(period.value)
                onClose()
              }}
              className="w-full p-4 border border-gray-200 rounded-lg hover:bg-primary/5 hover:border-primary transition-colors text-left flex items-center gap-3 group"
            >
              <div className="text-2xl">{period.icon}</div>
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors">{period.label}</p>
                <p className="text-xs text-muted-foreground">
                  {period.value === "1month" && "Download last 30 days of data"}
                  {period.value === "3months" && "Download last 3 months of data"}
                  {period.value === "1year" && "Download last 12 months of data"}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
