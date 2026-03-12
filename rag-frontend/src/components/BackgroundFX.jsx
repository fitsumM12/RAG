import { useEffect, useRef } from "react";

const COLORS = ["#8a7345", "#DCBD7F", "#b91c1c", "#0b0b0b"];

export default function BackgroundFX() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const shapesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const createShapes = (count, width, height) => {
      const shapes = [];
      for (let i = 0; i < count; i += 1) {
        const size = 120 + Math.random() * 220;
        shapes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          w: size,
          h: size * (0.6 + Math.random() * 0.6),
          rotation: Math.random() * Math.PI,
          type: i % 3 === 0 ? "triangle" : i % 3 === 1 ? "rect" : "diamond",
          color: COLORS[i % COLORS.length],
          speed: 0.08 + Math.random() * 0.22,
          phase: Math.random() * Math.PI * 2
        });
      }
      return shapes;
    };

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * window.devicePixelRatio;
      canvas.height = innerHeight * window.devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      shapesRef.current = createShapes(16, innerWidth, innerHeight);
    };

    const handleMove = (event) => {
      const x = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
      const y = event.clientY ?? event.touches?.[0]?.clientY ?? 0;
      pointerRef.current = { x, y };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: true });

    let rafId;
    let last = performance.now();

    const draw = (time) => {
      const dt = Math.min(64, time - last);
      last = time;
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const offsetX = (pointer.x / Math.max(width, 1) - 0.5) * 40;
      const offsetY = (pointer.y / Math.max(height, 1) - 0.5) * 40;

      shapesRef.current.forEach((s, idx) => {
        const angle = time * 0.00015 * s.speed + s.phase;
        const driftX = Math.cos(angle) * s.speed * dt * 0.18;
        const driftY = Math.sin(angle) * s.speed * dt * 0.18;
        s.x += driftX;
        s.y += driftY;
        s.rotation += Math.sin(angle + idx) * 0.0005 * dt;

        const maxDim = Math.max(s.w, s.h);
        if (s.x < -maxDim) s.x = width + maxDim;
        if (s.x > width + maxDim) s.x = -maxDim;
        if (s.y < -maxDim) s.y = height + maxDim;
        if (s.y > height + maxDim) s.y = -maxDim;

        const cx = s.x + offsetX * 0.6;
        const cy = s.y + offsetY * 0.6;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(s.rotation);
        ctx.fillStyle = s.color === "#0b0b0b" ? "#1f1f1f" : s.color;
        ctx.globalAlpha = s.color === "#0b0b0b" ? 0.18 : 0.24;
        ctx.beginPath();
        if (s.type === "triangle") {
          ctx.moveTo(0, -s.h * 0.6);
          ctx.lineTo(s.w * 0.5, s.h * 0.4);
          ctx.lineTo(-s.w * 0.5, s.h * 0.4);
        } else if (s.type === "diamond") {
          ctx.moveTo(0, -s.h * 0.6);
          ctx.lineTo(s.w * 0.55, 0);
          ctx.lineTo(0, s.h * 0.6);
          ctx.lineTo(-s.w * 0.55, 0);
        } else {
          ctx.rect(-s.w * 0.5, -s.h * 0.5, s.w, s.h);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}
