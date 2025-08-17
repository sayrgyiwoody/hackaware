import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, ExternalLink } from "lucide-react"

interface SecurityThreatAlertProps {
  alert: {
    type: string
    title: string
    description: string
    riskLevel: string
    immediateActions: string[]
  }
}

export function SecurityThreatAlert({ alert }: SecurityThreatAlertProps) {
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical":
        return "border-red-500/50 bg-red-500/10"
      case "high":
        return "border-red-500/30 bg-red-500/5"
      case "medium":
        return "border-amber-500/30 bg-amber-500/5"
      default:
        return "border-gray-500/30 bg-gray-500/5"
    }
  }

  return (
    <Card className={`max-w-[80%] ${getRiskColor(alert.riskLevel)}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          {alert.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded bg-red-500/20 text-red-300">
            {alert.riskLevel} RISK
          </span>
        </div>

        <p className="text-gray-300">{alert.description}</p>

        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-500" />
            Immediate Actions:
          </h4>
          <ul className="space-y-1">
            {alert.immediateActions.map((action, index) => (
              <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                <span className="text-cyan-500 mt-1">•</span>
                {action}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-cyan-500 text-cyan-500 bg-transparent">
            Learn More
          </Button>
          <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
            <ExternalLink className="h-3 w-3 mr-1" />
            Report Vulnerability
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
