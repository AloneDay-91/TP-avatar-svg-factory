import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("text-center mb-12", className)}>
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-gray-600">
          {description}
        </p>
      )}
    </div>
  )
}
