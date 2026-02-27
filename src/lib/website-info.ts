// 网站信息工具函数

export interface WebsiteSection {
  title: string;
  content: string;
}

// 获取当前页面的文本内容
export function getPageContent(): string {
  const content = document.body.innerText || document.body.textContent || '';
  return content.trim();
}

// 获取结构化的网站信息
export function getWebsiteInfo(): Record<string, string> {
  const info: Record<string, string> = {};

  // 尝试获取各个section的内容
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    const title = section.querySelector('h1, h2, h3');
    const content = section.innerText || section.textContent || '';
    if (title) {
      info[title.textContent || '未知部分'] = content.trim();
    }
  });

  return info;
}

// 生成网站信息的摘要（用于AI上下文）
export function generateWebsiteSummary(): string {
  const title = document.title;
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

  let summary = `网站标题: ${title}\n`;

  if (metaDescription) {
    summary += `网站描述: ${metaDescription}\n`;
  }

  // 获取主要导航项
  const navItems = document.querySelectorAll('nav a');
  if (navItems.length > 0) {
    summary += '\n网站导航:\n';
    navItems.forEach((item) => {
      const text = item.textContent?.trim();
      if (text) {
        summary += `  - ${text}\n`;
      }
    });
  }

  // 获取主要内容区域的标题
  const mainHeadings = document.querySelectorAll('main h1, main h2, main h3');
  if (mainHeadings.length > 0) {
    summary += '\n主要内容:\n';
    mainHeadings.forEach((heading, index) => {
      if (index < 10) { // 限制数量
        const text = heading.textContent?.trim();
        if (text) {
          summary += `  - ${text}\n`;
        }
      }
    });
  }

  return summary;
}

// 获取联系信息
export function getContactInfo(): Record<string, string> {
  const contact: Record<string, string> = {};

  // 尝试获取常见的联系信息
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach((link) => {
    const email = link.getAttribute('href')?.replace('mailto:', '');
    if (email) {
      contact['邮箱'] = email;
    }
  });

  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach((link) => {
    const phone = link.getAttribute('href')?.replace('tel:', '');
    if (phone) {
      contact['电话'] = phone;
    }
  });

  // 获取社交链接
  const socialLinks = document.querySelectorAll('a[href*="github"], a[href*="linkedin"], a[href*="twitter"]');
  if (socialLinks.length > 0) {
    const social: string[] = [];
    socialLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        social.push(href);
      }
    });
    if (social.length > 0) {
      contact['社交媒体'] = social.join(', ');
    }
  }

  return contact;
}
