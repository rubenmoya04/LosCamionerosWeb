"use client"
import { cn } from "@/lib/utils"
import type React from "react"
import type { ReactNode } from "react"

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode
  showRadialGradient?: boolean
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex min-h-screen h-auto flex-col items-center justify-center bg-white text-slate-950 overflow-hidden",
          className,
        )}
        {...props}
      >
        {/* Aurora layers - Blur responsive para mejor rendimiento en móviles */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={
            {
              "--aurora": "linear-gradient(135deg, #0c1a3e 0%, #1e40af 25%, #2563eb 50%, #3b82f6 75%, #60a5fa 100%)",
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              `absolute -inset-[10px] blur-[40px] sm:blur-[50px] md:blur-[60px] opacity-40 sm:opacity-50 animate-aurora [background-image:var(--aurora)] [background-size:200%_200%] [background-position:0%_0%]`,
              showRadialGradient && `[mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_80%)]`,
            )}
          />
        </div>

        {/* Children content */}
        {children}
      </div>
    </main>
  )
}
