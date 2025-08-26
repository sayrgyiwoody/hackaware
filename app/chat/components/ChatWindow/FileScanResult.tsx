import { Shield, FileText, Database, Hash } from "lucide-react"

type FileScanResultProps = {
  analysisResult: {
    status: string
    filename: string
    reason?: string
    details: {
      mime_info: {
        mime: string
        ext: string
        mismatch: boolean
      }
      clamav: {
        status: "clean" | "infected" | string
      }
      prompt_injection?: {
        is_injection: boolean
        score: number
        reasons: string[]
      }
    }
    metadata: {
      file_size: number
      upload_date: string
      user_id: string
      file_path: string
      sha256: string
    }
  }
}

function formatFileSize(bytes: number): string {
  if (!bytes) return "0 B"
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString()
}

// Utility to map status → color + icon
function getStatusDisplay(status: string) {
  switch (status.toLowerCase()) {
    case "clean":
      return { color: "text-green-400", bg: "bg-green-500/20", icon: Shield }
    case "infected":
    case "malicious":
      return { color: "text-red-400", bg: "bg-red-500/20", icon: Shield }
    default:
      return { color: "text-yellow-400", bg: "bg-yellow-500/20", icon: Shield }
  }
}

export default function FileScanResult({ analysisResult }: FileScanResultProps) {
  return (
    <div className="space-y-4 mt-6 p-2">
      <h3 className="font-medium text-gray-200 flex items-center gap-2">
        <Shield className="h-5 w-5 text-cyan-500" />
        Analysis Results
      </h3>

      {/* Status Overview */}
      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          {(() => {
            const { color, icon: StatusIcon, bg } = getStatusDisplay(analysisResult.status)
            return (
              <>
                <div className={`${bg} p-2 rounded-full`}>
                  <StatusIcon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <h4 className="font-medium capitalize">{analysisResult.status}</h4>
                  <p className="text-sm text-gray-400">{analysisResult.filename}</p>
                </div>
              </>
            )
          })()}
        </div>

        {analysisResult.reason && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-200">{analysisResult.reason}</p>
          </div>
        )}
      </div>

      {/* Detailed Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* File Information */}
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            File Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">MIME Type:</span>
              <span>{analysisResult.details.mime_info.mime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Extension:</span>
              <span>{analysisResult.details.mime_info.ext}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Size:</span>
              <span>{formatFileSize(analysisResult.metadata.file_size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mismatch:</span>
              <span
                className={
                  analysisResult.details.mime_info.mismatch ? "text-red-400" : "text-green-400"
                }
              >
                {analysisResult.details.mime_info.mismatch ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Security Scan */}
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            Security Scan
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">ClamAV:</span>
              <span
                className={
                  analysisResult.details.clamav.status === "clean"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {analysisResult.details.clamav.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Prompt Injection:</span>
              <span
                className={
                  analysisResult.details.prompt_injection?.is_injection
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {analysisResult.details.prompt_injection?.is_injection ? "Detected" : "None"}
              </span>
            </div>
            {analysisResult.details.prompt_injection?.score > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Risk Score:</span>
                <span className="text-yellow-400">
                  {analysisResult.details.prompt_injection?.score}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Database className="h-4 w-4 text-purple-500" />
            Metadata
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Upload Date:</span>
              <span>{formatDate(analysisResult.metadata.upload_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">File Path:</span>
              <span className="truncate max-w-32" title={analysisResult.metadata.file_path}>
                {analysisResult.metadata.file_path}
              </span>
            </div>
          </div>
        </div>

        {/* Hash Information */}
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Hash className="h-4 w-4 text-orange-500" />
            Hash Information
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400 block mb-1">SHA256:</span>
              <code className="text-xs bg-gray-900 p-2 rounded block break-all">
                {analysisResult.metadata.sha256}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Injection Details */}
      {analysisResult.details.prompt_injection?.reasons.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <h4 className="font-medium mb-2 text-red-400">Prompt Injection Reasons</h4>
          <ul className="text-sm space-y-1">
            {analysisResult.details.prompt_injection?.reasons.map((reason, index) => (
              <li key={index} className="text-red-300">
                • {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
