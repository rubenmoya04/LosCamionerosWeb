import './GradientText.css';
import React, { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];           // Colores del gradiente
  animationSpeed?: number;      // Segundos
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className = '',
  colors = ['#ff416c', '#ff4b2b', '#ffcc00', '#4facfe', '#00f2fe'], // colores llamativos por defecto
  animationSpeed = 8,
  showBorder = false
}: GradientTextProps) {

  const gradientStyle = {
    backgroundImage: `linear-gradient(270deg, ${colors.join(', ')})`, // diagonal a la izquierda
    animationDuration: `${animationSpeed}s`
  };

  return (
    <div className={`animated-gradient-text ${className}`}>
      {showBorder && <div className="gradient-overlay" style={gradientStyle}></div>}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}
