import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
interface DataPacket {
  id: number;
  path: 'horizontal' | 'vertical';
  startPos: number;
  progress: number;
  duration: number;
  layer: 'front' | 'back';
}
export function GridBackground() {
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const newPacket: DataPacket = {
        id: Date.now() + Math.random(),
        path: Math.random() > 0.5 ? 'horizontal' : 'vertical',
        startPos: Math.random() * 100,
        progress: 0,
        duration: 4 + Math.random() * 4,
        layer: Math.random() > 0.3 ? 'front' : 'back'
      };
      setPackets(prev => [...prev.slice(-15), newPacket]);
    }, isMobile ? 800 : 600);
    return () => clearInterval(interval);
  }, [isMobile]);
  return <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      {/* Far background grid - larger, slower */}
      <motion.div className={`absolute inset-0 ${isMobile ? 'opacity-8' : 'opacity-10'}`} animate={{
      x: [0, -20, 0],
      y: [0, -15, 0]
    }} transition={{
      duration: 20,
      repeat: Infinity,
      ease: 'linear'
    }} style={{
      backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 0, 0.15) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(0, 255, 0, 0.15) 2px, transparent 2px)
          `,
      backgroundSize: isMobile ? '120px 120px' : '100px 100px',
      filter: 'blur(1px)'
    }} />

      {/* Middle grid - medium size, subtle parallax */}
      <motion.div className={`absolute inset-0 ${isMobile ? 'opacity-15' : 'opacity-25'}`} animate={{
      x: [0, -10, 0],
      y: [0, -8, 0]
    }} transition={{
      duration: 15,
      repeat: Infinity,
      ease: 'linear'
    }} style={{
      backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 0, 0.3) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(0, 255, 0, 0.3) 2px, transparent 2px)
          `,
      backgroundSize: isMobile ? '80px 80px' : '60px 60px',
      filter: 'drop-shadow(0 0 2px rgba(0, 255, 0, 0.3))'
    }} />

      {/* Front grid - main grid, brightest green */}
      <div className={`absolute inset-0 ${isMobile ? 'opacity-20' : 'opacity-30'}`} style={{
      backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 0, 0.5) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(0, 255, 0, 0.5) 2px, transparent 2px)
          `,
      backgroundSize: isMobile ? '80px 80px' : '60px 60px',
      filter: 'drop-shadow(0 0 3px #00ff00)'
    }} />

      {/* Animated data packets following grid lines */}
      <svg className="absolute inset-0 w-full h-full">
        {packets.map(packet => {
        if (packet.path === 'horizontal') {
          return <motion.circle key={packet.id} r={packet.layer === 'front' ? isMobile ? 3 : 4 : isMobile ? 2 : 3} fill={packet.layer === 'front' ? '#00ff00' : 'rgba(0, 255, 0, 0.6)'} initial={{
            cx: '0%',
            cy: `${packet.startPos}%`,
            opacity: 0
          }} animate={{
            cx: '100%',
            cy: `${packet.startPos}%`,
            opacity: [0, 1, 1, 0]
          }} transition={{
            duration: packet.duration,
            ease: 'linear'
          }} style={{
            filter: packet.layer === 'front' ? 'drop-shadow(0 0 6px #00ff00)' : 'drop-shadow(0 0 4px rgba(0, 255, 0, 0.8))'
          }} />;
        } else {
          return <motion.circle key={packet.id} r={packet.layer === 'front' ? isMobile ? 3 : 4 : isMobile ? 2 : 3} fill={packet.layer === 'front' ? '#00ff00' : 'rgba(0, 255, 0, 0.6)'} initial={{
            cx: `${packet.startPos}%`,
            cy: '0%',
            opacity: 0
          }} animate={{
            cx: `${packet.startPos}%`,
            cy: '100%',
            opacity: [0, 1, 1, 0]
          }} transition={{
            duration: packet.duration,
            ease: 'linear'
          }} style={{
            filter: packet.layer === 'front' ? 'drop-shadow(0 0 6px #00ff00)' : 'drop-shadow(0 0 4px rgba(0, 255, 0, 0.8))'
          }} />;
        }
      })}
      </svg>

      {/* Scanline effect - desktop only */}
      {!isMobile && <motion.div className="absolute inset-0 pointer-events-none" style={{
      background: 'linear-gradient(transparent 50%, rgba(0, 255, 0, 0.03) 50%)',
      backgroundSize: '100% 4px'
    }} animate={{
      backgroundPosition: ['0% 0%', '0% 100%']
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'linear'
    }} />}

      {/* Vignette effect */}
      <div className="absolute inset-0" style={{
      background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.7) 100%)'
    }} />

      {/* Corner accent glows - green */}
      <div className={`absolute top-0 left-0 ${isMobile ? 'w-48 h-48' : 'w-64 h-64'} bg-[#00ff00] ${isMobile ? 'opacity-5' : 'opacity-8'} blur-[100px] rounded-full`} />
      <div className={`absolute bottom-0 right-0 ${isMobile ? 'w-48 h-48' : 'w-64 h-64'} bg-[#00ff00] ${isMobile ? 'opacity-5' : 'opacity-8'} blur-[100px] rounded-full`} />
    </div>;
}