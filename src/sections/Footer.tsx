import { ArrowUp, Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: '首页', href: '#home' },
    { label: '关于', href: '#about' },
    { label: '技能', href: '#skills' },
    { label: '项目', href: '#projects' },
    { label: '经历', href: '#experience' },
    { label: '荣誉', href: '#awards' },
    { label: '联系', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative w-full bg-[#0a0b10] border-t border-white/5">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a 
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
              className="inline-block text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              洪<span className="text-[#d0ff59]">曦</span>
            </a>
            <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
              车辆工程 & AI开发 | 专注于深度学习、计算机视觉和智能汽车技术领域。
              热爱技术创新，用代码创造价值。
            </p>
            
            {/* Social links */}
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-[#d0ff59]/20 transition-colors group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-[#d0ff59] transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-[#49abdb]/20 transition-colors group"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-[#49abdb] transition-colors" />
              </a>
              <a 
                href="mailto:hongxi@example.com" 
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-[#ad49db]/20 transition-colors group"
              >
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-[#ad49db] transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">快速链接</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="text-gray-400 hover:text-[#d0ff59] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-semibold mb-4">联系方式</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-400">
                <span className="text-[#d0ff59]">邮箱：</span>
                <a href="mailto:hongxi@example.com" className="hover:text-white transition-colors">
                  hongxi@example.com
                </a>
              </li>
              <li className="text-gray-400">
                <span className="text-[#49abdb]">电话：</span>
                <a href="tel:18028651236" className="hover:text-white transition-colors">
                  18028651236
                </a>
              </li>
              <li className="text-gray-400">
                <span className="text-[#ad49db]">地址：</span>
                广东省广州市
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-[#ff5757] fill-[#ff5757]" /> by 洪曦
            </p>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} 保留所有权利
            </p>
            
            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-gray-400 hover:text-[#d0ff59] transition-colors group"
            >
              <span>返回顶部</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d0ff59] via-[#49abdb] to-[#ad49db]" />
    </footer>
  );
};

export default Footer;
