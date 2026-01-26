import { useEffect, useRef, useState } from 'react';
import { 
  Code2, Cpu, Brain, Database, 
  Terminal, Car, CircuitBoard, FileCode, 
  GitBranch, Layers, Wifi, Wrench
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const coreSkills = [
    { name: 'Python', icon: Code2, level: 90, color: '#d0ff59', description: '熟练编写Python代码，熟悉PyTorch、OpenCV等库' },
    { name: '深度学习', icon: Brain, level: 85, color: '#49abdb', description: '掌握神经网络基础知识，有实际项目经验' },
    { name: 'ROS', icon: Terminal, level: 80, color: '#ad49db', description: '熟悉ROS机器人操作系统，开发过底盘控制系统' },
  ];

  const otherSkills = [
    { name: 'Linux', icon: Terminal, level: 85, color: '#ff9e50' },
    { name: 'OpenCV', icon: FileCode, level: 80, color: '#ff5757' },
    { name: 'YOLO', icon: Layers, level: 85, color: '#fffa59' },
    { name: 'C语言', icon: FileCode, level: 75, color: '#49abdb' },
    { name: '单片机', icon: CircuitBoard, level: 70, color: '#ad49db' },
    { name: '车载网络', icon: Wifi, level: 75, color: '#d0ff59' },
    { name: '汽车理论', icon: Car, level: 80, color: '#ff9e50' },
    { name: '汽车修理', icon: Wrench, level: 70, color: '#ff8cce' },
    { name: 'Git', icon: GitBranch, level: 80, color: '#49abdb' },
    { name: '数据库', icon: Database, level: 75, color: '#ad49db' },
  ];

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      // Orbit animation on scroll
      const orbitTrigger = ScrollTrigger.create({
        trigger: orbitRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          if (orbitRef.current) {
            const rotation1 = self.progress * 180;
            const rotation2 = -self.progress * 120;
            orbitRef.current.querySelector('.orbit-1')?.setAttribute('style', `transform: rotate(${rotation1}deg)`);
            orbitRef.current.querySelector('.orbit-2')?.setAttribute('style', `transform: rotate(${rotation2}deg)`);
          }
        },
      });
      triggers.push(orbitTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  const handleSkillHover = (name: string) => {
    setHoveredSkill(name);
  };

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className="relative py-24 lg:py-32 w-full overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d0ff59]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ad49db]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-[#d0ff59] text-sm tracking-[0.3em] uppercase mb-4">专业技能</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            技术<span className="text-[#d0ff59]">栈</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            掌握多种编程语言和框架，专注于深度学习、计算机视觉和智能汽车技术领域
          </p>
        </div>

        {/* Orbital skills display */}
        <div className="relative h-[500px] md:h-[600px] mb-20" ref={orbitRef}>
          {/* Center core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full glass flex items-center justify-center">
              <div className="text-center">
                <Cpu className="w-10 h-10 md:w-12 md:h-12 text-[#d0ff59] mx-auto mb-2" />
                <p className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  核心技能
                </p>
              </div>
              
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#d0ff59]/30 animate-ping" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* Orbit 1 - Core skills */}
          <div className="orbit-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-white/5 transition-transform duration-300">
            {coreSkills.map((skill, index) => {
              const angle = (index / coreSkills.length) * 360;
              const radius = 150; // Half of 300px
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              return (
                <div
                  key={skill.name}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{ 
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                  onMouseEnter={() => handleSkillHover(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div 
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full glass flex items-center justify-center transition-all duration-300 ${
                      hoveredSkill === skill.name ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                    style={{ 
                      boxShadow: hoveredSkill === skill.name ? `0 0 30px ${skill.color}` : 'none',
                    }}
                  >
                    <skill.icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: skill.color }} />
                  </div>
                  
                  {/* Tooltip */}
                  <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 p-3 glass rounded-lg transition-all duration-300 ${
                    hoveredSkill === skill.name ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}>
                    <p className="text-white font-medium text-sm mb-1">{skill.name}</p>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${skill.level}%`,
                          backgroundColor: skill.color,
                        }}
                      />
                    </div>
                    <p className="text-gray-400 text-xs">{skill.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orbit 2 - Other skills (visual representation) */}
          <div className="orbit-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[550px] md:h-[550px] rounded-full border border-white/5">
            {otherSkills.slice(0, 8).map((skill, index) => {
              const angle = (index / 8) * 360;
              const radius = 225; // Half of 450px
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              return (
                <div
                  key={skill.name}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-125 transition-transform cursor-pointer"
                    title={skill.name}
                  >
                    <skill.icon className="w-5 h-5" style={{ color: skill.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connecting lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d0ff59" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ad49db" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...coreSkills, ...otherSkills].map((skill, index) => (
            <div 
              key={skill.name}
              className="glass rounded-xl p-4 card-hover group cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${skill.color}20` }}
                >
                  <skill.icon className="w-5 h-5" style={{ color: skill.color }} />
                </div>
                <span className="text-white font-medium text-sm">{skill.name}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${skill.level}%`,
                    backgroundColor: skill.color,
                  }}
                />
              </div>
              <p className="text-gray-400 text-xs mt-2 text-right">{skill.level}%</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
