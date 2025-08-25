import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Eye, Shield, Server } from "lucide-react"

interface ScanResultsProps {
  results: any // accept the mock scan JSON
}

export function ScanResults({ results }: ScanResultsProps) {
  const scanned = results.scanned_output

  if (!scanned) return null

  const sections = [
    { key: "privacy_risk", title: scanned.privacy_risk?.header, body: scanned.privacy_risk?.body },
    { key: "security", title: scanned.security?.header, body: scanned.security?.body },
    { key: "data_sharing", title: scanned.data_sharing?.header, body: scanned.data_sharing?.body },
  ]

  return (
    <div className="max-w-[80%] space-y-4">
      {/* Summary Card for Overall Stats */}
      <Card className="bg-gray-800/70 border-gray-700">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-500" />
            Overall Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300 space-y-1">
          <div>{scanned.overall?.malicious}</div>
          <div>{scanned.overall?.suspicious}</div>
          <div>{scanned.overall?.harmless}</div>
          <div>{scanned.overall?.undetected}</div>
          <div>{scanned.overall?.timeout}</div>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      {sections.map(
        (section) =>
          section.body && (
            <Card key={section.key} className="bg-gray-800/70 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">{section.body}</CardContent>
            </Card>
          )
      )}

      {/* Flagged Vendors */}
      {scanned.flagged_vendors && scanned.flagged_vendors.length > 0 && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="h-4 w-4 text-red-500" />
              Flagged Vendors
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-300">
            <ul className="list-disc pl-4">
              {scanned.flagged_vendors.map((vendor: string, idx: number) => (
                <li key={idx}>{vendor}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
