import { useEffect, useRef } from 'react';
import { GraduationCap, Calendar, BookOpen, Code2, Cpu, Car } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  const skills = [
    { name: 'Python', icon: Code2, color: '#d0ff59' },
    { name: '深度学习', icon: Cpu, color: '#49abdb' },
    { name: 'ROS', icon: Code2, color: '#ad49db' },
    { name: '车辆工程', icon: Car, color: '#ff9e50' },
  ];

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      // Image animation
      const imgTrigger = ScrollTrigger.create({
        trigger: imageRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            imageRef.current,
            { scale: 0.8, opacity: 0, filter: 'blur(10px)' },
            { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out' }
          );
        },
        once: true,
      });
      triggers.push(imgTrigger);

      // Content animation
      const contentTrigger = ScrollTrigger.create({
        trigger: contentRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            contentRef.current?.children || [],
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'expo.out' }
          );
        },
        once: true,
      });
      triggers.push(contentTrigger);

      // Skills animation
      const skillsTrigger = ScrollTrigger.create({
        trigger: skillsRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            skillsRef.current?.children || [],
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' }
          );
        },
        once: true,
      });
      triggers.push(skillsTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="relative py-24 lg:py-32 w-full"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[#d0ff59] text-sm tracking-[0.3em] uppercase mb-4">关于我</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            个人<span className="text-[#d0ff59]">简介</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div 
            ref={imageRef}
            className="relative opacity-0"
          >
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 border-2 border-[#d0ff59]/30 rounded-full" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border-2 border-[#49abdb]/30 rounded-full" />
            
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d0ff59]/20 via-transparent to-[#49abdb]/20 z-10" />
              <img 
                src="/about-photo.jpg" 
                alt="洪曦工作照"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Floating skill badges around image */}
            <div ref={skillsRef} className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-3 max-w-[90%]">
              {skills.map((skill) => (
                <div 
                  key={skill.name}
                  className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:scale-110 transition-transform cursor-pointer group"
                  style={{ opacity: 0 }}
                >
                  <skill.icon className="w-4 h-4" style={{ color: skill.color }} />
                  <span className="text-sm text-white group-hover:text-[#d0ff59] transition-colors">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Content */}
          <div ref={contentRef} className="space-y-8">
            <div>
              <p className="text-xl text-gray-300 leading-relaxed">
                你好！我是<span className="text-[#d0ff59] font-semibold">洪曦</span>，一名来自广东技术师范大学车辆工程专业的学生。
                我专注于<span className="gradient-text font-medium">人工智能</span>与<span className="gradient-text font-medium">智能汽车技术</span>的交叉领域研究。
              </p>
            </div>

            <p className="text-gray-400 leading-relaxed">
              在学习和实践过程中，我积累了丰富的深度学习和计算机视觉经验，曾参与开发基于YOLO的牙齿洁度识别系统，
              以及基于ROS的无人驾驶底盘远程控制系统。我热爱技术创新，在SCI三区发表过相关论文，
              并在多个竞赛中获得荣誉。目前在广东人工智能产业协会担任实习生，负责人工智能训练师培训项目和数据标注PM工作。
            </p>

            {/* Education card */}
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d0ff59]/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#d0ff59]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">广东技术师范大学</h3>
                  <p className="text-[#49abdb] text-sm mb-2">车辆工程 · 本科</p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>2022.09 - 2026.06</span>
                  </div>
                </div>
              </div>
              
              {/* Key courses */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-2">主修课程：</p>
                <div className="flex flex-wrap gap-2">
                  {['车载网络技术', '汽车理论', '嵌入式系统', 'Python', 'C语言', '单片机'].map((course) => (
                    <span key={course} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4 text-center card-hover">
                <BookOpen className="w-6 h-6 text-[#d0ff59] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">1</p>
                <p className="text-xs text-gray-400">SCI论文</p>
              </div>
              <div className="glass rounded-xl p-4 text-center card-hover">
                <Cpu className="w-6 h-6 text-[#49abdb] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">5+</p>
                <p className="text-xs text-gray-400">竞赛荣誉</p>
              </div>
              <div className="glass rounded-xl p-4 text-center card-hover">
                <Code2 className="w-6 h-6 text-[#ad49db] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">10+</p>
                <p className="text-xs text-gray-400">项目经验</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
