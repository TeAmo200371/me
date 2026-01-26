import { useEffect, useRef, useState } from 'react';
import { 
  Mail, Phone, MapPin, Send, Github, 
  Linkedin, MessageCircle, ArrowUpRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const contactInfo = [
    { icon: Mail, label: '邮箱', value: 'hongxi@example.com', color: '#d0ff59' },
    { icon: Phone, label: '电话', value: '18028651236', color: '#49abdb' },
    { icon: MapPin, label: '地址', value: '广东省广州市', color: '#ad49db' },
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: '#', color: '#d0ff59' },
    { icon: Linkedin, label: 'LinkedIn', href: '#', color: '#49abdb' },
    { icon: MessageCircle, label: '微信', href: '#', color: '#ad49db' },
  ];

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      // Content animation
      const contentTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo(
            sectionRef.current?.querySelectorAll('.contact-animate') || [],
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'expo.out' }
          );
        },
        once: true,
      });
      triggers.push(contentTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('感谢您的留言！我会尽快回复您。');
    }, 1500);
  };

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="relative py-24 lg:py-32 w-full"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d0ff59]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ad49db]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20 contact-animate opacity-0">
          <p className="text-[#d0ff59] text-sm tracking-[0.3em] uppercase mb-4">联系方式</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            联系<span className="text-[#d0ff59]">我</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            如果您对我的项目感兴趣，或有合作意向，欢迎随时联系我
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Contact info */}
          <div className="contact-animate opacity-0">
            <h3 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Sora, sans-serif' }}>
              联系信息
            </h3>

            {/* Contact cards */}
            <div className="space-y-4 mb-8">
              {contactInfo.map((info) => (
                <div 
                  key={info.label}
                  className="glass rounded-xl p-5 card-hover group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${info.color}15` }}
                    >
                      <info.icon className="w-6 h-6" style={{ color: info.color }} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{info.label}</p>
                      <p className="text-white font-medium group-hover:text-[#d0ff59] transition-colors">
                        {info.value}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 ml-auto text-gray-600 group-hover:text-[#d0ff59] transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">社交媒体</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-12 h-12 rounded-xl glass flex items-center justify-center card-hover group"
                    style={{ 
                      '--hover-color': social.color,
                    } as React.CSSProperties}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-[#d0ff59] transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick message */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-[#d0ff59]/10 via-[#49abdb]/10 to-[#ad49db]/10 border border-white/5">
              <p className="text-gray-300 leading-relaxed">
                "始终保持着对新技术的热情，期待在人工智能与智能汽车领域深耕，
                用技术创新解决实际问题，创造价值。"
              </p>
              <p className="text-[#d0ff59] mt-4 font-medium">— 洪曦</p>
            </div>
          </div>

          {/* Right - Contact form */}
          <div className="contact-animate opacity-0">
            <h3 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Sora, sans-serif' }}>
              发送消息
            </h3>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="您的姓名"
                  required
                  className="w-full bg-transparent border-b-2 border-white/20 py-4 text-white placeholder-gray-500 focus:outline-none transition-colors"
                  style={{
                    borderColor: focusedField === 'name' ? '#d0ff59' : 'rgba(255,255,255,0.2)',
                  }}
                />
                <div 
                  className="absolute bottom-0 left-0 h-0.5 bg-[#d0ff59] transition-all duration-300"
                  style={{ width: focusedField === 'name' ? '100%' : '0%' }}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="您的邮箱"
                  required
                  className="w-full bg-transparent border-b-2 border-white/20 py-4 text-white placeholder-gray-500 focus:outline-none transition-colors"
                  style={{
                    borderColor: focusedField === 'email' ? '#d0ff59' : 'rgba(255,255,255,0.2)',
                  }}
                />
                <div 
                  className="absolute bottom-0 left-0 h-0.5 bg-[#d0ff59] transition-all duration-300"
                  style={{ width: focusedField === 'email' ? '100%' : '0%' }}
                />
              </div>

              {/* Subject */}
              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="主题"
                  required
                  className="w-full bg-transparent border-b-2 border-white/20 py-4 text-white placeholder-gray-500 focus:outline-none transition-colors"
                  style={{
                    borderColor: focusedField === 'subject' ? '#d0ff59' : 'rgba(255,255,255,0.2)',
                  }}
                />
                <div 
                  className="absolute bottom-0 left-0 h-0.5 bg-[#d0ff59] transition-all duration-300"
                  style={{ width: focusedField === 'subject' ? '100%' : '0%' }}
                />
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="您的留言..."
                  required
                  rows={4}
                  className="w-full bg-transparent border-b-2 border-white/20 py-4 text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                  style={{
                    borderColor: focusedField === 'message' ? '#d0ff59' : 'rgba(255,255,255,0.2)',
                  }}
                />
                <div 
                  className="absolute bottom-0 left-0 h-0.5 bg-[#d0ff59] transition-all duration-300"
                  style={{ width: focusedField === 'message' ? '100%' : '0%' }}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full py-4 bg-[#d0ff59] text-[#0a0b10] font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0a0b10] border-t-transparent rounded-full animate-spin" />
                      <span>发送中...</span>
                    </>
                  ) : (
                    <>
                      <span>发送消息</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
