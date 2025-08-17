import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Eye, Shield, Server } from "lucide-react"

interface ScanResultsProps {
  results: {
    url: string
    overallScore?: number
    privacyScore?: number
    securityScore?: number
    performanceScore?: number
    privacyRisk?: string
    securityRisk?: string
    issues: Array<{
      type: string
      severity: string
      title: string
      description: string
      impact: string
      fix: string
      cve?: string | null
      affectedUsers?: string
    }>
    recommendations?: string[]
  }
}

export function ScanResults({ results }: ScanResultsProps) {
  const getRiskColor = (risk: string | undefined) => {
    if (!risk) return "text-gray-400"

    switch (risk.toLowerCase()) {
      case "critical":
        return "text-red-400"
      case "high":
        return "text-red-400"
      case "medium":
        return "text-amber-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getScoreColor = (score: number | undefined) => {
    if (!score) return "text-gray-400"

    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-amber-400"
    return "text-red-400"
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityBgColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "high":
        return "bg-red-500/20"
      case "medium":
        return "bg-amber-500/20"
      case "low":
        return "bg-green-500/20"
      default:
        return "bg-gray-500/20"
    }
  }

  const privacyIssues = results.issues?.filter((issue) => issue.type === "privacy") || []
  const securityIssues = results.issues?.filter((issue) => issue.type === "security") || []
  const configIssues = results.issues?.filter((issue) => issue.type === "configuration") || []

  return (
    <div className="max-w-[80%] space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-gray-800/70 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-500" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`text-lg font-bold ${getScoreColor(results.overallScore)}`}>
              {results.overallScore || 0}/100
            </span>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4 text-amber-500" />
              Privacy Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`text-lg font-bold ${getScoreColor(results.privacyScore)}`}>
              {results.privacyScore || 0}/100
            </span>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`text-lg font-bold ${getScoreColor(results.securityScore)}`}>
              {results.securityScore || 0}/100
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Issues Summary */}
      <Card className="bg-gray-800/70 border-gray-700">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Server className="h-4 w-4 text-blue-500" />
            Issues Found: {results.issues?.length || 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-xs">
            <span className="text-red-400">
              Critical: {results.issues?.filter((i) => i.severity === "critical").length || 0}
            </span>
            <span className="text-red-400">
              High: {results.issues?.filter((i) => i.severity === "high").length || 0}
            </span>
            <span className="text-amber-400">
              Medium: {results.issues?.filter((i) => i.severity === "medium").length || 0}
            </span>
            <span className="text-green-400">
              Low: {results.issues?.filter((i) => i.severity === "low").length || 0}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card className="bg-gray-800/70 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg">Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All Issues ({results.issues?.length || 0})</TabsTrigger>
              <TabsTrigger value="privacy">Privacy ({privacyIssues.length})</TabsTrigger>
              <TabsTrigger value="security">Security ({securityIssues.length})</TabsTrigger>
              <TabsTrigger value="config">Config ({configIssues.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {results.issues?.length ? (
                results.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-600"
                  >
                    <div className={`${getSeverityBgColor(issue.severity)} p-1.5 rounded-full`}>
                      {getSeverityIcon(issue.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{issue.title}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getSeverityBgColor(issue.severity)} ${getRiskColor(issue.severity)}`}
                        >
                          {issue.severity?.toUpperCase() || "UNKNOWN"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{issue.description}</p>
                      <div className="text-xs text-cyan-400 mb-1">
                        <strong>Impact:</strong> {issue.impact}
                      </div>
                      <div className="text-xs text-green-400 mb-1">
                        <strong>Fix:</strong> {issue.fix}
                      </div>
                      {issue.cve && (
                        <div className="text-xs text-red-400">
                          <strong>CVE:</strong> {issue.cve}
                        </div>
                      )}
                      {issue.affectedUsers && (
                        <div className="text-xs text-gray-500">
                          <strong>Affected:</strong> {issue.affectedUsers}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No issues found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4 mt-4">
              {privacyIssues.length ? (
                privacyIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-600"
                  >
                    <div className="bg-amber-500/20 p-1.5 rounded-full">{getSeverityIcon(issue.severity)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{issue.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">{issue.description}</p>
                      <div className="text-xs text-cyan-400 mb-1">
                        <strong>Impact:</strong> {issue.impact}
                      </div>
                      <div className="text-xs text-green-400">
                        <strong>Fix:</strong> {issue.fix}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No privacy issues found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="security" className="space-y-4 mt-4">
              {securityIssues.length ? (
                securityIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-600"
                  >
                    <div className="bg-red-500/20 p-1.5 rounded-full">{getSeverityIcon(issue.severity)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{issue.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">{issue.description}</p>
                      <div className="text-xs text-cyan-400 mb-1">
                        <strong>Impact:</strong> {issue.impact}
                      </div>
                      <div className="text-xs text-green-400 mb-1">
                        <strong>Fix:</strong> {issue.fix}
                      </div>
                      {issue.cve && (
                        <div className="text-xs text-red-400">
                          <strong>CVE:</strong> {issue.cve}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No security issues found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="config" className="space-y-4 mt-4">
              {configIssues.length ? (
                configIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-600"
                  >
                    <div className="bg-blue-500/20 p-1.5 rounded-full">{getSeverityIcon(issue.severity)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{issue.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">{issue.description}</p>
                      <div className="text-xs text-cyan-400 mb-1">
                        <strong>Impact:</strong> {issue.impact}
                      </div>
                      <div className="text-xs text-green-400">
                        <strong>Fix:</strong> {issue.fix}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Server className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No configuration issues found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <Card className="bg-cyan-500/10 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-500" />
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-cyan-500 mt-1">•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
