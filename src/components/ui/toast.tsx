import { X } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  onClose?: () => void
}

export function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm w-full bg-background border rounded-lg shadow-lg p-4",
        variant === 'destructive' && "border-destructive bg-destructive/10"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-sm mb-1">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
