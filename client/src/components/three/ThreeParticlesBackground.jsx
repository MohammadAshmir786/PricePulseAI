import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function ThreeParticlesBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;

    // Switch between two distinct scenes for dark vs light
    const isLight = theme === "light";

    // Shared resize handling
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleResize = () => {
      resize();
      init();
    };

    // DARK THEME: professional particle network
    let particles = [];
    const darkBase = { r: 255, g: 123, b: 95 };
    const darkBlue = { r: 45, g: 127, b: 249 };
    const darkYellow = { r: 241, g: 196, b: 15 };
    const darkColor = (alpha) =>
      `rgba(${darkBase.r}, ${darkBase.g}, ${darkBase.b}, ${alpha})`;
    const blueColor = (alpha) =>
      `rgba(${darkBlue.r}, ${darkBlue.g}, ${darkBlue.b}, ${alpha})`;
    const yellowColor = (alpha) =>
      `rgba(${darkYellow.r}, ${darkYellow.g}, ${darkYellow.b}, ${alpha})`;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 2.5 + 1;
        this.size = this.baseSize;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.baseOpacity = Math.random() * 0.25 + 0.2;
        this.opacity = this.baseOpacity;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.015 + Math.random() * 0.02;

        // Assign color with preference for primary brand colors
        const colorChoice = Math.random();
        if (colorChoice > 0.65) {
          this.colorFunc = darkColor; // coral
        } else if (colorChoice > 0.35) {
          this.colorFunc = blueColor; // blue
        } else {
          this.colorFunc = yellowColor; // accent yellow
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Gentle pulsing
        this.pulsePhase += this.pulseSpeed;
        this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.1;
        this.size = this.baseSize + Math.sin(this.pulsePhase) * 0.3;
      }

      draw() {
        // Subtle glow
        ctx.fillStyle = this.colorFunc(this.opacity * 0.3);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.fillStyle = this.colorFunc(this.opacity);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // LIGHT THEME: professional gradient + subtle floating elements
    let blobs = [];
    const lightStops = [
      { offset: 0, color: "rgba(255,255,255,1)" },
      { offset: 0.5, color: "rgba(247,249,255,1)" },
      { offset: 1, color: "rgba(238,243,255,1)" },
    ];
    const lightBlobColors = [
      "rgba(255, 123, 95, 0.08)", // warm coral
      "rgba(45, 127, 249, 0.08)", // cool blue
      "rgba(241, 196, 15, 0.06)", // soft gold
      "rgba(168, 218, 220, 0.07)", // soft cyan
      "rgba(255, 182, 193, 0.06)", // soft pink
    ];

    class Blob {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 160 + 100;
        this.size = this.baseSize;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.001 + Math.random() * 0.002;
        this.color =
          lightBlobColors[Math.floor(Math.random() * lightBlobColors.length)];
        this.dx = Math.random() * 0.25 - 0.125;
        this.dy = Math.random() * 0.25 - 0.125;
        this.morphPhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.phase += this.speed;
        this.morphPhase += this.speed * 0.8;

        // Subtle size variation
        this.size =
          this.baseSize + Math.sin(this.phase) * (this.baseSize * 0.1);

        // Smooth movement
        this.x += this.dx + Math.sin(this.morphPhase) * 0.15;
        this.y += this.dy + Math.cos(this.morphPhase) * 0.15;

        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }

      draw() {
        const grad = ctx.createRadialGradient(
          this.x,
          this.y,
          this.size * 0.15,
          this.x,
          this.y,
          this.size
        );
        grad.addColorStop(0, this.color);
        grad.addColorStop(0.5, this.color.replace(/[\d.]+\)$/, "0.04)"));
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const drawLightGradient = () => {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      lightStops.forEach((s) => grad.addColorStop(s.offset, s.color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const init = () => {
      if (isLight) {
        blobs = [];
        const count = canvas.width < 768 ? 5 : 8;
        for (let i = 0; i < count; i++) blobs.push(new Blob());
      } else {
        particles = [];
        const count = canvas.width < 768 ? 70 : 120;
        for (let i = 0; i < count; i++) particles.push(new Particle());
      }
    };

    const animate = () => {
      if (isLight) {
        drawLightGradient();
        blobs.forEach((b) => {
          b.update();
          b.draw();
        });
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw subtle connections first
        particles.forEach((particle, i) => {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 130) {
              const opacity = 0.12 * (1 - distance / 130);
              ctx.strokeStyle = particles[i].colorFunc(opacity);
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        });

        // Draw particles on top
        particles.forEach((particle) => {
          particle.update();
          particle.draw();
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    init();
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
