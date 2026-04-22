import { useEffect, useRef, useState } from 'react';
import {
  Briefcase, Users, Calendar, TrendingUp,
  Award, ClipboardList, CheckCircle2, UserCheck, Cpu, Bot, Download, FileText, Code2, Database, GitBranch
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const experiences = [
    {
      id: 1,
      company: '广东人工智能产业协会',
      role: '人才发展与AI项目管理实习生',
      period: '2025.06-2026.03',
      icon: Briefcase,
      color: '#d0ff59',
      responsibilities: [
        {
          title: '人才培训工作',
          icon: UserCheck,
          details: [
            '负责人工智能训练师题库审核，独立完成人工智能训练师考前培训，以及支持考评工作，利用COZE优化workflow。',
            '负责AI数据工程师培训项目，设计了关于数据标注、质检、交付以及PM培训方案。',
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
    {
      id: 2,
      company: '广州翎石科技有限公司',
      role: 'AI Agent开发与实施工程师',
      period: '2026.03 - 2026.04',

      icon: Cpu,
      color: '#49abdb',
      responsibilities: [
        {
          title: '智能客服系统开发',
          icon: Bot,
          image: 'workflow.jpg',
          details: [
            '独立使用 Dify、Coze、Chatbot 等平台开发客服智能体，采用 Chatflow 工作流模式实现复杂对话逻辑',
            '搭建企业级 RAG 知识库，配置父子分段策略、混合检索机制及元数据分类体系，提升检索准确率',
          ],
        },
        {
          title: '文档处理与向量化',
          icon: FileText,
          code: `import base64
from pathlib import Path
import requests
from tqdm import tqdm

API_URL = "https://ge9ec0ucgddfb6p4.aistudio-app.com/layout-parsing"
TOKEN = "你的百度paddle的api_key"

# 要扫描的根目录
INPUT_DIR = Path(r"文件位置")

# 支持的文件类型
PDF_EXTENSIONS = {".pdf"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

HEADERS = {
    "Authorization": f"token {TOKEN}",
    "Content-Type": "application/json"
}

# 关闭环境代理，避免 ProxyError
session = requests.Session()
session.trust_env = False


def get_file_type(file_path: Path):
    ext = file_path.suffix.lower()
    if ext in PDF_EXTENSIONS:
        return 0
    if ext in IMAGE_EXTENSIONS:
        return 1
    return None


def safe_name(path: Path):
    return path.stem.replace("/", "_").replace("\\", "_")


def should_skip(path: Path):
    return any(part.endswith("_ocr") for part in path.parts)


def download_image(img_url: str, save_path: Path):
    save_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        resp = session.get(img_url, timeout=120)
        if resp.status_code == 200:
            with open(save_path, "wb") as f:
                f.write(resp.content)
            return True
        return False
    except Exception:
        return False


def parse_file(file_path: Path):
    if not file_path.exists():
        return False, f"文件不存在: {file_path}"

    file_type = get_file_type(file_path)
    if file_type is None:
        return False, f"不支持的文件类型: {file_path}"

    file_output_dir = file_path.parent / f"{safe_name(file_path)}_ocr"
    file_output_dir.mkdir(parents=True, exist_ok=True)

    final_md_path = file_output_dir / f"{file_path.stem}.md"

    if final_md_path.exists():
        return True, f"已存在，跳过: {final_md_path}"

    with open(file_path, "rb") as f:
        file_data = base64.b64encode(f.read()).decode("ascii")

    payload = {
        "file": file_data,
        "fileType": file_type,
        "useDocOrientationClassify": False,
        "useDocUnwarping": False,
        "useTextlineOrientation": False,
        "useChartRecognition": False,
    }

    response = session.post(
        API_URL,
        json=payload,
        headers=HEADERS,
        timeout=300
    )

    if response.status_code != 200:
        return False, f"解析失败: {file_path}"

    data = response.json()
    result = data.get("result")
    if not result:
        return False, f"返回结果中没有 result: {file_path}"

    merged_markdown_parts = []

    for i, res in enumerate(result.get("layoutParsingResults", []), start=1):
        markdown_info = res.get("markdown", {})
        markdown_text = markdown_info.get("text", "")

        for img_path, img_url in markdown_info.get("images", {}).items():
            local_img_path = file_output_dir / img_path
            ok = download_image(img_url, local_img_path)
            if not ok:
                print(f"\\n下载 markdown 图片失败: {img_url}")

        merged_markdown_parts.append(f"\\n\\n<!-- page {i} -->\\n\\n{markdown_text}")

    final_markdown = "".join(merged_markdown_parts).strip()

    with open(final_md_path, "w", encoding="utf-8") as md_file:
        md_file.write(final_markdown)

    return True, f"Markdown 已保存: {final_md_path}"`,
          details: [
            '基于百度飞桨 PaddlePaddle 框架开发 OCR API 程序，实现 PDF 文件批量转换为 Markdown 格式',
            '设计并实现 Markdown 文件向量化编排流程，优化标识符重写规范，支持平台级父子分段配置',
          ],
        },
      ],
    },
    {
      id: 3,
      company: '广州智用开物人工智能科技有限公司',
      role: 'AI全栈开发工程师',
      period: '2026.04.13 - 至今',
      icon: Code2,
      color: '#ad49db',
      responsibilities: [
        {
          title: '立讯精密培训系统开发',
          icon: Cpu,
          details: [
            '利用 Codex、Claude Code 等 AI 开发工具，独立完成培训系统超管端、BU 管理端、讲师端账号管理模块开发',
            '负责 TypeScript 前端、后端接口及 PostgreSQL 数据库设计与实现',
            '完成上下级账号创建、账号管理、登录校验等功能，通过 Git 进行代码提交、分支合并及 PR 协作管理',
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
                    {/* 推荐信下载按钮 - 只在第一段经历时显示 */}
                    {index === 0 && (
                      <div className="mt-3">
                        <a
                          href="./推荐信.png"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#d0ff59]/10 hover:bg-[#d0ff59]/20 text-[#d0ff59] rounded-lg text-xs transition-colors duration-300 w-full no-underline"
                        >
                          <Download className="w-3 h-3" />
                          <span>查看推荐信（新窗口打开）</span>
                        </a>
                        <p className="text-[10px] text-gray-500 mt-1.5 text-center leading-tight">
                          文件较大(30MB)，打开后请右键"图片另存为"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="lg:col-span-2">
            {experiences[activeIndex]?.responsibilities.map((resp, respIndex) => {
              const hasImage = 'image' in resp && resp.image;
              const hasCode = 'code' in resp && resp.code;
              const hasFlippableContent = hasImage || hasCode;
              const isFlipped = flippedCard === resp.title;
              // 根据内容数量动态调整高度
              const contentCount = resp.details?.length || 0;
              const heightClass = contentCount > 2 ? 'h-64' : 'h-48';

              return (
                <div
                  key={resp.title}
                  className={cn(
                    `relative mb-6 ${heightClass} perspective-1000`,
                    hasFlippableContent && "cursor-pointer"
                  )}
                  style={{ animationDelay: `${respIndex * 0.1}s` }}
                  onMouseEnter={() => {
                    if (hasFlippableContent) {
                      setFlippedCard(resp.title);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasFlippableContent) {
                      setFlippedCard(null);
                    }
                  }}
                >
                  {/* 翻转容器 */}
                  <div
                    className={cn(
                      "relative w-full h-full transition-transform duration-700 transform-style-3d",
                      isFlipped && "rotate-y-180"
                    )}
                  >
                    {/* 正面内容 */}
                    <div className={cn(
                      "absolute inset-0 backface-hidden rounded-xl p-6 glass overflow-y-auto",
                      isFlipped && "pointer-events-none"
                    )}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#d0ff59]/10 flex items-center justify-center">
                          <resp.icon className="w-5 h-5 text-[#d0ff59]" />
                        </div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {resp.title}
                          {hasImage && (
                            <span className="text-xs text-gray-500 font-normal">（悬停查看流程图）</span>
                          )}
                          {hasCode && (
                            <span className="text-xs text-gray-500 font-normal">（悬停查看代码）</span>
                          )}
                        </h3>
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

                    {/* 背面图片 */}
                    {hasImage && (
                      <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden bg-[#0a0b10] border border-[#d0ff59]/30 flex items-center justify-center p-2 group">
                        <a
                          href="./workflow.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="max-w-full max-h-full flex items-center justify-center"
                        >
                          <img
                            src={`./workflow.jpg`}
                            alt={resp.title}
                            className="max-w-full max-h-full object-contain rounded cursor-pointer transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              // 如果相对路径失败，尝试绝对路径
                              const target = e.target as HTMLImageElement;
                              if (!target.src.endsWith('/workflow.jpg')) {
                                target.src = '/workflow.jpg';
                              }
                            }}
                            title="点击在新窗口打开图片"
                          />
                        </a>
                      </div>
                    )}

                    {/* 背面代码 */}
                    {hasCode && (
                      <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden bg-[#0a0b10] border border-[#49abdb]/30 p-4">
                        <div className="h-full flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[#49abdb] font-mono">pdf2md.py</span>
                            <button
                              onClick={() => {
                                const blob = new Blob([resp.code as string], { type: 'text/plain;charset=utf-8' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'pdf2md.py';
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              className="text-xs text-gray-400 hover:text-[#49abdb] transition-colors"
                            >
                              下载代码
                            </button>
                          </div>
                          <pre className="flex-1 overflow-auto rounded-lg bg-black/50 p-3 text-xs text-gray-300 font-mono leading-relaxed">
                            <code>{resp.code as string}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Achievement stats - 只在第一段经历时显示 */}
            {activeIndex === 0 && (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
