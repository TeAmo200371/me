import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'experience', 'awards', 'contact'];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { label: '首页', href: '#home' },
    { label: '关于', href: '#about' },
    { label: '技能', href: '#skills' },
    { label: '项目', href: '#projects' },
    { label: '经历', href: '#experience' },
    { label: '荣誉', href: '#awards' },
    { label: '联系', href: '#contact' },
  ];

  // 根据滚动位置高亮当前 section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      const scrollY = window.scrollY;
      const viewportMid = scrollY + window.innerHeight * 0.35;
      let current = 'home';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (viewportMid >= top && viewportMid < top + height) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 移动端菜单打开时禁止背景滚动，Esc 关闭
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'glass py-3' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
              className="text-2xl font-bold text-white hover:text-[#d0ff59] transition-colors"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              洪<span className="text-[#d0ff59]">曦</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                    className={`relative text-sm transition-colors group ${
                      isActive ? 'text-[#d0ff59]' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span
                      className="absolute -bottom-1 left-0 h-0.5 bg-[#d0ff59] transition-all duration-300 group-hover:w-full"
                      style={{ width: isActive ? '100%' : '0' }}
                    />
                  </a>
                );
              })}
            </div>

            {/* CTA Button */}
            <a 
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
              className="hidden md:flex px-6 py-2 bg-[#d0ff59] text-[#0a0b10] text-sm font-medium rounded-full hover:bg-white transition-colors"
            >
              联系我
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - 带过渡动画，Esc 关闭 */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'opacity-100 visible bg-[#0a0b10]/95 backdrop-blur-xl' 
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className={`text-2xl transition-colors hover:text-[#d0ff59] ${isActive ? 'text-[#d0ff59]' : 'text-white'}`}
                style={{ 
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.25s ease ${index * 0.04}s, transform 0.25s ease ${index * 0.04}s, color 0.2s`,
                }}
              >
                {item.label}
              </a>
            );
          })}
          <a 
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
            className="mt-4 px-8 py-3 bg-[#d0ff59] text-[#0a0b10] font-medium rounded-full hover:bg-white/90 transition-colors"
            style={{
              opacity: isMobileMenuOpen ? 1 : 0,
              transition: `opacity 0.25s ease ${navItems.length * 0.04}s`,
            }}
          >
            联系我
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
