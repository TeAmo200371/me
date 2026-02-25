import { useEffect, useRef, useState } from 'react';
import { 
  Briefcase, Users, Calendar, TrendingUp, 
  Award, ClipboardList, CheckCircle2, UserCheck, Cpu
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const experiences = [
    {
      id: 1,
      company: '广东人工智能产业协会',
      role: '人才发展与AI项目管理实习生',
      period: '2025.06 - 至今',
      icon: Briefcase,
      color: '#d0ff59',
      responsibilities: [
        {
          title: '人才培训工作',
          icon: UserCheck,
          details: [
            '负责人工智能训练师题库审核，独立完成考前培训及考评支持',
            '负责AI数据工程师培训项目，设计数据标注、质检、交付及PM培训方案',
          ],
        },
        {
          title: '大型会议举办工作',
          icon: Award,
          details: [
            '参与XAIR大会等大型会议筹备与执行',
            '提升组织协调能力与临场应急能力',
          ],
        },
        {
          title: '高质量数据标注PM',
          icon: ClipboardList,
          details: [
            '负责高质量数据标注业务，参与哈啰等3D标注项目',
            '针对标注质量偏低提出人员管理优化、奖罚机制等方案',
            '准确率从80%提升至95%，项目交付量明显提升',
          ],
        },
        {
          title: '智能体服务与内容生成',
          icon: Cpu,
          details: [
            '协助搭建智能体，完成甲方智能体方案并训练垂类模型',
            '负责AI视频、图片、文案生成业务，通过Coze搭建工作流批量生成内容，精准完成甲方需求',
          ],
        },
      ],
    },
  ];

  const achievements = [
    { icon: Users, label: '培训人数', value: '200+' },
    { icon: CheckCircle2, label: '准确率提升', value: '15%' },
    { icon: TrendingUp, label: '交付量增长', value: '30%' },
  ];

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      // Timeline line draw animation
      const lineTrigger = ScrollTrigger.create({
        trigger: timelineRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        onUpdate: (self) => {
          const line = timelineRef.current?.querySelector('.timeline-progress');
          if (line) {
            gsap.set(line, { 
              scaleY: self.progress,
              transformOrigin: 'top',
            });
          }
        },
      });
      triggers.push(lineTrigger);

      // Cards animation
      const cards = sectionRef.current?.querySelectorAll('.exp-card');
      if (cards) {
        const cardTrigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 70%',
          onEnter: () => {
            gsap.fromTo(
              cards,
              { x: -50, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'expo.out' }
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
      id="experience" 
      className="relative py-24 lg:py-32 w-full"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-[#d0ff59] text-sm tracking-[0.3em] uppercase mb-4">实习经历</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            工作<span className="text-[#d0ff59]">经历</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            在广东人工智能产业协会的实习经历，让我深入了解了AI产业生态和项目管理
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Timeline */}
          <div className="lg:col-span-1">
            <div ref={timelineRef} className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10">
                <div className="timeline-progress absolute top-0 left-0 w-full bg-gradient-to-b from-[#d0ff59] via-[#49abdb] to-[#ad49db] h-full scale-y-0" />
              </div>

              {/* Experience cards */}
              {experiences.map((exp, index) => (
                <div 
                  key={exp.id}
                  className="exp-card relative pl-16 pb-12 opacity-0"
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {/* Timeline dot */}
                  <div 
                    className={`absolute left-4 top-2 w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      activeIndex === index 
                        ? 'bg-[#d0ff59] border-[#d0ff59] scale-125' 
                        : 'bg-[#0a0b10] border-[#d0ff59]/50'
                    }`}
                    style={{ 
                      boxShadow: activeIndex === index ? '0 0 20px rgba(208, 255, 89, 0.5)' : 'none',
                    }}
                  />

                  {/* Card content */}
                  <div className={`glass rounded-xl p-6 transition-all duration-300 ${
                    activeIndex === index ? 'border-[#d0ff59]/30' : ''
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${exp.color}20` }}
                      >
                        <exp.icon className="w-5 h-5" style={{ color: exp.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                        <p className="text-[#d0ff59] text-sm">{exp.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.period}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="lg:col-span-2">
            {experiences[activeIndex]?.responsibilities.map((resp, respIndex) => (
              <div 
                key={resp.title}
                className="glass rounded-xl p-6 mb-6 card-hover"
                style={{ animationDelay: `${respIndex * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d0ff59]/10 flex items-center justify-center">
                    <resp.icon className="w-5 h-5 text-[#d0ff59]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{resp.title}</h3>
                </div>

                <ul className="space-y-3">
                  {resp.details.map((detail, detailIndex) => (
                    <li 
                      key={detailIndex}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#d0ff59] flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Achievement stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {achievements.map((stat) => (
                <div 
                  key={stat.label}
                  className="glass rounded-xl p-4 text-center card-hover"
                >
                  <stat.icon className="w-6 h-6 text-[#d0ff59] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
