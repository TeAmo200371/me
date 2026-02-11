import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Cpu, Car, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: '基于YOLO11的牙齿洁度识别系统',
      category: '计算机视觉',
      description: '与企业共同开发基于YOLO11分割的牙齿洁度识别系统，准确识别牙齿洁度并分析牙齿健康程度。完成数据集标注与YOLO11模型训练环境搭建，协助导师优化算法提高识别准确度，协助完成系统上位机设计。',
      image: '/project-dental.jpg',
      icon: Cpu,
      tags: ['YOLO11', 'Python', 'OpenCV', '深度学习'],
      period: '2023.09 - 2024.12',
      color: '#d0ff59',
    },
    {
      id: 2,
      title: '五菱宏光mini底盘远程控制系统',
      category: '无人驾驶',
      description: '利用ROS、Python与控制器实现mini小车刹车、油门、转向、换挡的远程控制，为无人驾驶项目提供基础。与项目成员一同设计远程控制系统，在Python上编写控制器代码，协助完成基于PID的转向系统开发与测试，在ROS上编写调用刹车、油门、转向、换挡的运行节点。',
      image: '/project-chassis.jpg',
      icon: Car,
      tags: ['ROS', 'Python', 'PID控制', '嵌入式'],
      period: '2023.11 - 2025.06',
      color: '#49abdb',
    },
  ];

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      // Cards stagger animation
      const cards = sectionRef.current?.querySelectorAll('.project-card');
      if (cards) {
        const cardTrigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 70%',
          onEnter: () => {
            gsap.fromTo(
              cards,
              { y: 100, opacity: 0, scale: 0.9 },
              { 
                y: 0, 
                opacity: 1, 
                scale: 1, 
                duration: 0.8, 
                stagger: 0.2, 
                ease: 'expo.out' 
              }
            );
          },
          once: true,
        });
        triggers.push(cardTrigger);
      }
    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  const handleCardHover = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredProject(id);
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    gsap.to(card, {
      rotateY: (x - 0.5) * 10,
      rotateX: (0.5 - y) * 10,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredProject(null);
    gsap.to(e.currentTarget, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="relative py-24 lg:py-32 w-full"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-[#d0ff59] text-sm tracking-[0.3em] uppercase mb-4">项目经历</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            作品<span className="text-[#d0ff59]">展示</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            从AI医疗诊断到无人驾驶，探索我的技术项目与实践成果
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card opacity-0"
              style={{ perspective: '1000px' }}
            >
              <div
                className="relative rounded-2xl overflow-hidden glass group cursor-pointer"
                onMouseMove={(e) => handleCardHover(project.id, e)}
                onMouseLeave={handleCardLeave}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Image container */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredProject === project.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  
                  {/* Overlay gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/50 to-transparent transition-opacity duration-300 ${
                    hoveredProject === project.id ? 'opacity-80' : 'opacity-60'
                  }`} />
                  
                  {/* Holographic shine effect on hover */}
                  <div className={`absolute inset-0 holographic transition-opacity duration-500 ${
                    hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                  }`} />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <div className="px-4 py-1.5 glass rounded-full">
                      <span className="text-sm font-medium" style={{ color: project.color }}>
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${project.color}20` }}>
                    <project.icon className="w-6 h-6" style={{ color: project.color }} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#d0ff59] transition-colors" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {project.title}
                    </h3>
                    <span className="text-xs text-gray-400">{project.period}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d0ff59] transition-colors group/btn">
                        <Github className="w-4 h-4" />
                        <span>代码</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#49abdb] transition-colors group/btn">
                        <ExternalLink className="w-4 h-4" />
                        <span>演示</span>
                      </button>
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group-hover:bg-[#d0ff59] group-hover:text-[#0a0b10]">
                      <span>了解更多</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Animated border on hover */}
                <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${
                  hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 rounded-2xl" style={{ 
                    background: `linear-gradient(135deg, ${project.color}40, transparent)`,
                    padding: '1px',
                  }}>
                    <div className="w-full h-full rounded-2xl bg-[#12131a]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional project stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: '完成项目', value: '10+' },
            { label: '代码提交', value: '500+' },
            { label: '技术栈', value: '15+' },
            { label: '合作企业', value: '3' },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="glass rounded-xl p-6 text-center card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
