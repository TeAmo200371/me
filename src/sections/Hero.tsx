import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Mail, Phone, MapPin } from 'lucide-react';
import gsap from 'gsap';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(80, Math.floor(window.innerWidth / 20));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx -= dx * 0.0003;
          p.vy -= dy * 0.0003;
        }

        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(208, 255, 89, ${p.alpha})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(208, 255, 89, ${0.15 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [mousePos]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0, rotateX: 90 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: 'expo.out', delay: 0.2 }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.6 }
      );

      // Image reveal animation
      gsap.fromTo(
        imageRef.current,
        { clipPath: 'circle(0% at 50% 50%)', scale: 1.2 },
        { 
          clipPath: 'circle(100% at 50% 50%)', 
          scale: 1, 
          duration: 1.4, 
          ease: 'expo.out', 
          delay: 0.4 
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Image tilt effect
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    gsap.to(imageRef.current, {
      rotateY: x * 15,
      rotateX: -y * 15,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleImageMouseLeave = () => {
    gsap.to(imageRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <section 
      ref={heroRef}
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[#0a0b10]"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Particle canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h1 
          className="text-[20vw] font-bold text-transparent tracking-tighter whitespace-nowrap"
          style={{
            WebkitTextStroke: '1px rgba(208, 255, 89, 0.1)',
            fontFamily: 'Sora, sans-serif',
          }}
        >
          洪曦
        </h1>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left content */}
            <div className="order-2 lg:order-1 space-y-8">
              <div className="space-y-4">
                <p className="text-[#d0ff59] text-sm tracking-[0.3em] uppercase font-medium">
                  你好，我是
                </p>
                <h1 
                  ref={titleRef}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  洪<span className="text-[#d0ff59]">曦</span>
                </h1>
                <p 
                  ref={subtitleRef}
                  className="text-xl md:text-2xl text-gray-300 font-light"
                >
                  车辆工程 & <span className="gradient-text font-medium">AI开发</span>
                </p>
              </div>

              {/* Info badges */}
              <div className="flex flex-wrap gap-4">
                <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d0ff59]" />
                  <span className="text-sm text-gray-300">广州，中国</span>
                </div>
                <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#49abdb]" />
                  <span className="text-sm text-gray-300">18028651236</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="#contact"
                  className="group relative px-8 py-4 bg-[#d0ff59] text-[#0a0b10] font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    联系我
                    <Mail className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </a>
                <a 
                  href="#projects"
                  className="px-8 py-4 glass text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  查看项目
                </a>
              </div>
            </div>

            {/* Right - Portrait image */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div 
                ref={imageRef}
                className="relative perspective-1000"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={handleImageMouseMove}
                onMouseLeave={handleImageMouseLeave}
              >
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d0ff59]/30 via-[#49abdb]/20 to-[#ad49db]/30 blur-3xl rounded-full scale-90" />
                
                {/* Main image */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-[#d0ff59]/30 glow-green">
                  <img 
                    src="/hero-portrait.jpg" 
                    alt="洪曦"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 glass px-4 py-2 rounded-full float">
                  <span className="text-[#d0ff59] text-sm font-medium">AI Developer</span>
                </div>
                <div className="absolute -bottom-4 -left-4 glass px-4 py-2 rounded-full float" style={{ animationDelay: '1s' }}>
                  <span className="text-[#49abdb] text-sm font-medium">Vehicle Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-xs text-gray-400">向下滚动</span>
        <ArrowDown className="w-4 h-4 text-[#d0ff59] animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
