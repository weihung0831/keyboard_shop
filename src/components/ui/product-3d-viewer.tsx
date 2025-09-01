'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import type { Mesh } from 'three';
import { DoubleSide } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { cn } from '@/lib/utils';

interface Product3DViewerProps {
  imageSrc: string;
  imageAlt: string;
  inStock: boolean;
  className?: string;
}

// 鍵盤3D模型 - 帶動畫效果
function KeyboardModel({ imageSrc }: { imageSrc: string }) {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(imageSrc);

  // Three.js動畫 - 微妙的浮動和旋轉效果
  useFrame(state => {
    if (meshRef.current) {
      // 輕微的垂直浮動
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;

      // 非常微妙的自動旋轉
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.1, 0, 0]} position={[0, 0, 0]}>
      {/* 使用平面幾何體展示鍵盤圖片 */}
      <planeGeometry args={[5, 3.2]} />
      <meshBasicMaterial map={texture} transparent={true} alphaTest={0.1} side={DoubleSide} />
    </mesh>
  );
}

// 3D場景設置
function Scene({
  imageSrc,
  controlsRef,
}: {
  imageSrc: string;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  return (
    <>
      {/* 基礎環境光 */}
      <ambientLight intensity={1} />

      {/* 鍵盤模型 */}
      <KeyboardModel imageSrc={imageSrc} />

      {/* 軌道控制器 */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        maxDistance={8}
        minDistance={3}
        target={[0, 0, 0]}
      />
    </>
  );
}

export default function Product3DViewer({
  imageSrc,
  imageAlt: _imageAlt,
  inStock,
  className,
}: Product3DViewerProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className={cn('relative group', className)}>
      {/* 3D Canvas容器 */}
      <motion.div
        className={cn(
          'relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg border p-4',
          'bg-zinc-900 border-zinc-600 hover:border-blue-500',
        )}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Canvas
          camera={{
            position: [0, 1, 4],
            fov: 50,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <Scene imageSrc={imageSrc} controlsRef={controlsRef} />
          </Suspense>
        </Canvas>

        {/* 庫存狀態標籤 */}
        <div className='absolute top-4 right-4 z-10'>
          {inStock ? (
            <span className='rounded-full bg-green-500/90 px-3 py-1 text-sm font-medium text-white border border-green-400 backdrop-blur-sm'>
              現貨供應
            </span>
          ) : (
            <span className='rounded-full bg-red-500/90 px-3 py-1 text-sm font-medium text-white border border-red-400 backdrop-blur-sm'>
              暫時缺貨
            </span>
          )}
        </div>

        {/* 操作提示 */}
        <motion.div
          className='absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs text-zinc-400 bg-black/50 rounded-lg px-3 py-2 backdrop-blur-sm border border-zinc-700'
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span>拖曳旋轉 • 滾輪縮放</span>
          <button
            onClick={resetCamera}
            className='text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded px-1'
            aria-label='Reset camera position'
          >
            重置
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
