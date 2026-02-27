import { useEffect, useRef } from 'react';
import { 
  Trophy, Star, 
  FileText, Users, Cpu, Target
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Awards = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const awards = [
    {
      id: 1,
      title: '全国大学生电子设计竞赛',
      year: '2024',
      role: '负责开发赛题的视觉识别部分',
      description: '在计算机视觉与嵌入式方向负责赛题视觉识别开发，展现实战能力',
      icon: Cpu,
      color: '#d0ff59',
      type: '竞赛',
    },
    {
      id: 2,
      title: '全国大学生数学建模大赛',
      year: '2024',
      role: '负责神经网络搭建与数据分析',
      description: '负责神经网络搭建与数据分析工作，锻炼数学建模与编程能力',
      icon: Target,
      color: '#49abdb',
      type: '竞赛',
    },
    {
      id: 3,
      title: '粤港澳大湾区IT应用系统开发大赛',
      year: '2024',
      achievement: '三等奖',
      description: '第九届粤港澳大湾区IT应用系统开发大赛三等奖，展示系统开发与创新应用能力',
      icon: Trophy,
      color: '#ad49db',
      type: '奖项',
    },
    {
      id: 4,
      title: 'SCI论文发表',
      year: '2024',
      achievement: 'SCI 3区',
      description: '发表论文"LQR-based Energy-Efficient Control for Intelligent Vehicles Optimized by Adaptive Genetic Algorithm"',
      icon: FileText,
      color: '#ff9e50',
      type: '学术',
    },
  ];

  const memberships = [
    { name: '虹科实验室', icon: Users, color: '#d0ff59' },
    { name: '无人驾驶实验室', icon: Cpu, color: '#49abdb' },
  ];

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.award-card');
      if (cards) {
        const cardTrigger = ScrollTrigger.create({
          trigger: cardsRef.current,
          start: 'top 75%',
          onEnter: () => {
            gsap.fromTo(
              cards,
              { y: 60, opacity: 0, scale: 0.95 },
              { 
                y: 0, 
                opacity: 1, 
                scale: 1, 
                duration: 0.6, 
                stagger: 0.15, 
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

  return (
    <section 
      ref={sectionRef}
      id="awards" 
      className="relative py-24 lg:py-32 w-full"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#d0ff59]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#ad49db]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-[#d0ff59] text-sm tracking-[0.3em] uppercase mb-4">荣誉奖项</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            竞赛<span className="text-[#d0ff59]">成就</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            在学术竞赛和科研实践中不断突破，积累丰富的项目经验与技术能力
          </p>
        </div>

        {/* Awards grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {awards.map((award) => (
            <div 
              key={award.id}
              className="award-card glass rounded-2xl p-6 card-hover group cursor-pointer opacity-0"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${award.color}15` }}
                >
                  <award.icon className="w-7 h-7" style={{ color: award.color }} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${award.color}20`,
                        color: award.color,
                      }}
                    >
                      {award.type}
                    </span>
                    <span className="text-gray-400 text-sm">{award.year}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d0ff59] transition-colors" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {award.title}
                  </h3>

                  {'achievement' in award && (
                    <p className="text-sm mb-2" style={{ color: award.color }}>
                      {award.achievement}
                    </p>
                  )}

                  {'role' in award && (
                    <p className="text-sm text-[#49abdb] mb-2">
                      {award.role}
                    </p>
                  )}

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {award.description}
                  </p>
                </div>
              </div>

              {/* Hover glow effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${award.color}10, transparent 70%)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Memberships */}
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              实验室成员
            </h3>
            <p className="text-gray-400">加入顶尖实验室，参与前沿技术研究</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberships.map((membership) => (
              <div 
                key={membership.name}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${membership.color}15` }}
                >
                  <membership.icon className="w-6 h-6" style={{ color: membership.color }} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white group-hover:text-[#d0ff59] transition-colors">
                    {membership.name}
                  </h4>
                  <p className="text-gray-400 text-sm">实验室成员</p>
                </div>
                <Star className="w-5 h-5 ml-auto text-gray-600 group-hover:text-[#d0ff59] transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '竞赛参与', value: '5+' },
            { label: '获奖次数', value: '4+' },
            { label: '实验室项目', value: '10+' },
            { label: '论文发表', value: '1' },
          ].map((stat) => (
            <div 
              key={stat.label}
              className="glass rounded-xl p-6 text-center card-hover"
            >
              <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
