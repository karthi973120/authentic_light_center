'use client';

import { useEffect, useRef } from 'react';

export default function HeroParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(60, Math.floor(canvas.width / 20));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedY: Math.random() * 0.4 + 0.1,
          speedX: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.5 + 0.2,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          pulseDir: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        // Draw glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(60, 179, 113, ${p.alpha})`);
        gradient.addColorStop(0.3, `rgba(255, 215, 0, ${p.alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(5, 13, 6, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha + 0.3})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Move
        p.y -= p.speedY;
        p.x += p.speedX;

        // Pulse alpha
        p.alpha += p.pulseSpeed * p.pulseDir;
        if (p.alpha > 0.8) {
          p.pulseDir = -1;
        } else if (p.alpha < 0.15) {
          p.pulseDir = 1;
        }

        // Reset if off-screen
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.speedX *= -1;
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    drawParticles();

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
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
