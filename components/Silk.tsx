import React, { forwardRef, useMemo, useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree, RootState } from '@react-three/fiber';
import { Color, Mesh, ShaderMaterial } from 'three';
import { IUniform } from 'three';

type NormalizedRGB = [number, number, number];

const hexToNormalizedRGB = (hex: string): NormalizedRGB => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b];
};

interface UniformValue<T = number | Color> {
  value: T;
}

interface SilkUniforms {
  uSpeed: UniformValue<number>;
  uScale: UniformValue<number>;
  uNoiseIntensity: UniformValue<number>;
  uColor: UniformValue<Color>;
  uSecondaryColor: UniformValue<Color>;
  uRotation: UniformValue<number>;
  uTime: UniformValue<number>;
  uOpacity: UniformValue<number>;
  [uniform: string]: IUniform;
}

// 
// MEJORADO: Vertex shader con posición para efectos 3D sutiles
//
const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// 
// MEJORADO: Fragment shader con múltiples colores y efectos de partículas
// - Gradientes suaves entre colores
// - Efectos de brillo y partículas luminosas
// - Movimiento orgánico más fluido
//
const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;
uniform vec3  uColor;
uniform vec3  uSecondaryColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uOpacity;

const float e = 2.71828182845904523536;
const float PI = 3.14159265359;

// Función de noise mejorada para patrones más orgánicos
float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

// Función de noise simplex para movimientos más naturales
float simplexNoise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Rotación de UVs con matemática mejorada
vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

// Función para crear partículas luminosas
float particles(vec2 uv, float time) {
  float particles = 0.0;
  
  // Capa 1: Partículas grandes y lentas
  for(float i = 0.0; i < 5.0; i++) {
    vec2 pos = vec2(
      simplexNoise(vec2(i * 0.3, time * 0.1)) * 2.0,
      simplexNoise(vec2(i * 0.4, time * 0.08)) * 2.0
    );
    float dist = length(uv - pos);
    particles += smoothstep(0.02, 0.0, dist) * 0.3;
  }
  
  // Capa 2: Partículas pequeñas y rápidas
  for(float i = 0.0; i < 8.0; i++) {
    vec2 pos = vec2(
      simplexNoise(vec2(i * 0.7, time * 0.2)) * 1.5,
      simplexNoise(vec2(i * 0.6, time * 0.15)) * 1.5
    );
    float dist = length(uv - pos);
    particles += smoothstep(0.01, 0.0, dist) * 0.2;
  }
  
  return particles;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation + uTime * 0.1);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  // Movimiento de ondas más suave y orgánico
  tex.y += 0.02 * sin(6.0 * tex.x - tOffset * 0.8);
  tex.x += 0.01 * cos(4.0 * tex.y + tOffset * 0.6);

  // Patrón principal con múltiples frecuencias
  float pattern1 = sin(3.0 * (tex.x + tex.y + cos(2.0 * tex.x + 3.0 * tex.y) + 0.015 * tOffset));
  float pattern2 = sin(15.0 * (tex.x + tex.y - 0.08 * tOffset));
  float pattern3 = cos(8.0 * (tex.x - tex.y + 0.03 * tOffset));
  
  float pattern = 0.5 + 
                  0.25 * pattern1 + 
                  0.15 * pattern2 + 
                  0.1 * pattern3;

  // Efectos de partículas luminosas
  float particleEffect = particles(uv * 2.0, tOffset);
  
  // Gradiente de color entre principal y secundario
  vec3 gradientColor = mix(uColor, uSecondaryColor, 
    sin(tex.x * 2.0 + tOffset * 0.5) * 0.5 + 0.5
  );

  // Color final con todos los efectos
  vec4 col = vec4(gradientColor, uOpacity) * vec4(pattern + particleEffect);
  col.rgb -= rnd / 20.0 * uNoiseIntensity; // Noise sutil
  
  // Efecto de brillo en los bordes del patrón
  float glow = smoothstep(0.6, 0.8, pattern);
  col.rgb += vec3(0.1, 0.2, 0.3) * glow * particleEffect;
  
  col.a = uOpacity;
  gl_FragColor = col;
}
`;

interface SilkPlaneProps {
  uniforms: SilkUniforms;
}

const SilkPlane = forwardRef<Mesh, SilkPlaneProps>(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    const mesh = ref as React.MutableRefObject<Mesh | null>;
    if (mesh.current) {
      mesh.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_state: RootState, delta: number) => {
    const mesh = ref as React.MutableRefObject<Mesh | null>;
    if (mesh.current) {
      const material = mesh.current.material as ShaderMaterial & {
        uniforms: SilkUniforms;
      };
      material.uniforms.uTime.value += 0.05 * delta; // Velocidad reducida para movimiento más elegante
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 32, 32]} /> {/* Mayor resolución para mejor calidad */}
      <shaderMaterial 
        uniforms={uniforms} 
        vertexShader={vertexShader} 
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </mesh>
  );
});
SilkPlane.displayName = 'SilkPlane';

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  secondaryColor?: string;
  noiseIntensity?: number;
  rotation?: number;
  opacity?: number;
}

const Silk: React.FC<SilkProps> = ({ 
  speed = 2.0, 
  scale = 1.2, 
  color = '#0B1C2D', 
  secondaryColor = '#33CCFF',
  noiseIntensity = 0.8, 
  rotation = 0.3,
  opacity = 1.0
}) => {
  const meshRef = useRef<Mesh>(null);

  const uniforms = useMemo<SilkUniforms>(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uSecondaryColor: { value: new Color(...hexToNormalizedRGB(secondaryColor)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
      uOpacity: { value: opacity }
    }),
    [speed, scale, noiseIntensity, color, secondaryColor, rotation, opacity]
  );

  return (
    <Canvas
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      dpr={[1, 2]}
      frameloop="always"
      camera={{ position: [0, 0, 1], fov: 75 }}
      gl={{ 
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      }}
    >
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
};

export default Silk;