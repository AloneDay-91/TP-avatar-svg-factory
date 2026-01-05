import { cn } from "@/lib/utils"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-background py-12 px-4",
      className
    )}>
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  )
}