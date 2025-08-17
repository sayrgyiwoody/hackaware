import type React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}

export function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
      <CardContent className="pt-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="text-cyan-500 hover:text-cyan-400 hover:bg-cyan-950/50 p-0">
          <Link href={link} className="flex items-center gap-1">
            Explore <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
