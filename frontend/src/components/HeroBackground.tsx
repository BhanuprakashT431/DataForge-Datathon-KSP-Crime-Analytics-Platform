import React, { useEffect, useRef } from 'react';

export const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // KSP Problem: Criminal network mapping & hotspot tracking
    const nodes = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      isHotspot: Math.random() > 0.85
    }));

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw Grid (Geospatial Feel)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw Nodes & Links (Network Intelligence)
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        nodes.slice(i + 1).forEach(other => {
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            const alpha = 1 - dist / 180;
            // Hotspots link with red-ish color, normal with blue
            if (node.isHotspot || other.isHotspot) {
              ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.3})`;
            } else {
              ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.15})`;
            }
            ctx.lineWidth = alpha * 1.5;
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        if (node.isHotspot) {
          ctx.fillStyle = '#ef4444';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#ef4444';
        } else {
          ctx.fillStyle = '#3b82f6';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#3b82f6';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      // Radar Sweep Effect
      const time = Date.now() * 0.0005;
      const radarX = width * 0.75;
      const radarY = height * 0.3;
      
      try {
         const grad = ctx.createConicGradient(time, radarX, radarY);
         grad.addColorStop(0, 'rgba(59, 130, 246, 0)');
         grad.addColorStop(0.1, 'rgba(59, 130, 246, 0.08)');
         grad.addColorStop(0.15, 'rgba(59, 130, 246, 0)');
         grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
         
         ctx.fillStyle = grad;
         ctx.beginPath();
         ctx.arc(radarX, radarY, 400, 0, Math.PI * 2);
         ctx.fill();
      } catch (e) {
         // Fallback if createConicGradient is unsupported
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 1
      }}
    />
  );
};
