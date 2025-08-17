"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : ""

            return !inline ? (
              <div className="relative mb-4">
                {language && (
                  <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                    <span>{language}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(String(children))}
                      className="hover:text-gray-200 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                )}
                <pre className="bg-gray-900 p-4 rounded-b-md overflow-x-auto">
                  <code className="text-gray-200 text-sm font-mono" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-cyan-300" {...props}>
                {children}
              </code>
            )
          },
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 text-white border-b border-gray-700 pb-2">{children}</h1>
          ),
          h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-white mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-medium mb-2 text-white mt-4">{children}</h3>,
          p: ({ children }) => <p className="mb-4 text-gray-200 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="mb-4 space-y-1 text-gray-200 list-disc list-inside">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 space-y-1 text-gray-200 list-decimal list-inside">{children}</ol>,
          li: ({ children }) => <li className="text-gray-200">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-cyan-500 pl-4 my-4 text-gray-300 italic bg-gray-800/30 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-700 rounded-lg">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-700 px-4 py-2 bg-gray-800 text-left font-semibold text-white">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border border-gray-700 px-4 py-2 text-gray-200">{children}</td>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-cyan-400 hover:text-cyan-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
