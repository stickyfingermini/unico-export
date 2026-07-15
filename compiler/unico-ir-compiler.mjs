#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const inputPath = resolve(process.argv[2] || 'unico-design-ir.json');
const outputPath = resolve(process.argv[3] || 'unico-export-result.json');
const SUPPORTED_CHILD_TYPES = new Set([
  'text',
  'img',
  'button',
  'rectangle',
  'circle',
  'rich-text',
  'img-text',
  'video-player',
  'countdown',
  'tabs',
  'accordion',
  'map',
  'rating',
  'social-share',
  'person-profile',
  'inquiry-box',
  'goods-list',
  'coupon',
  'navigation',
  'brand-navbar',
  'search',
  'banner',
  'store-information',
  'discount-promotion',
  'service-list',
  'event-list',
  'event-calendar',
  'blog-list',
]);

const FIXED_COMPONENT_TYPES = new Set([
  'goods-list', 'coupon', 'navigation', 'brand-navbar', 'search', 'banner',
  'store-information', 'discount-promotion', 'service-list', 'event-list',
  'event-calendar', 'blog-list',
]);

const ir = JSON.parse(readFileSync(inputPath, 'utf8'));
const designJson = compileUnicoDesign(ir);

writeFileSync(outputPath, `${JSON.stringify({
  type: 'unico_design_result',
  message: ir.message || 'Generated Unico DND JSON from Unico design IR.',
  designJson,
  validation: validateDesignJson(designJson),
}, null, 2)}\n`);

function compileUnicoDesign(input) {
  const sections = Array.isArray(input.sections) ? input.sections : [];
  const navbars = sections.flatMap((section) => Array.isArray(section.children) ? section.children : [])
    .filter((child) => normalizeType(child.type) === 'brand-navbar')
    .map((child, index) => compileFixedChild(child, index, 'navbar'));
  const compiledSections = sections.map((section, index) => compileSection({
    ...section,
    children: (Array.isArray(section.children) ? section.children : [])
      .filter((child) => normalizeType(child.type) !== 'brand-navbar'),
  }, index));
  return [...navbars.slice(0, 1), ...compiledSections];
}

function compileSection(section, index) {
  const width = number(section.width, 386);
  const height = number(section.height, 480);
  const children = Array.isArray(section.children) ? section.children : [];
  return {
    id: safeId(section.id || `section-${index + 1}`),
    label: string(section.label || section.name || `Section ${index + 1}`),
    type: 'free-box',
    field: {
      structure: {
        label: 'Freeform Container',
        child: {
          sectionName: control('Section Name', 'text', string(section.name || section.label || `Section ${index + 1}`)),
          component_list: {
            label: 'Widgets List',
            type: 'component_list',
            value: children.map((child, childIndex) => compileChild(child, childIndex, section.id || `section-${index + 1}`)),
          },
        },
      },
      styles: {
        label: 'Container Style',
        child: {
          width: control('Container Width', 'width', width),
          height: control('Container Height', 'height', height),
          justify: control('Layout', 'justify', string(section.justify || 'left')),
          bgColor: control('Background Color', 'bgColor', color(section.bgColor || section.background || 'transparent')),
        },
      },
      config: {
        label: 'Alignment & Grid Settings',
        child: {
          editMode: control('Edit Mode', 'editMode', 'free-form'),
          showGuides: control('Show Alignment Guides', 'showGuides', true),
          enableHorizontalScroll: control('Enable Horizontal Scroll', 'enableHorizontalScroll', false),
          gridSize: control('Grid Size (px)', 'gridSize', 10),
        },
      },
    },
  };
}

function compileChild(child, index, scope = 'component') {
  const type = normalizeType(child.type);
  if (FIXED_COMPONENT_TYPES.has(type)) return compileFixedChild(child, index, scope);
  const base = {
    id: safeId(child.id || `${scope}-${type}-${index + 1}`),
    label: string(child.label || child.text || child.name || type),
    type,
    field: {
      structure: { label: structureLabel(type), child: structureChild(type, child, `${scope}-${type}-${index + 1}`) },
      styles: { label: styleLabel(type), child: styleChild(type, child, index) },
    },
  };
  return base;
}

function compileFixedChild(child, index, scope) {
  const type = normalizeType(child.type);
  return {
    id: safeId(child.id || `${scope}-${type}-${index + 1}`),
    label: string(child.label || child.title || child.name || type),
    type,
    component: fixedComponent(type, child),
  };
}

function fixedComponent(type, child) {
  const position = { top: number(child.top ?? child.y, 0), mode: 'static', isSeat: true, zIndex: number(child.zIndex, 5) };
  const spacing = { marginLR: 0, marginTop: 0, marginBottom: 0, borderTopLR: 0, borderBottomLR: 0 };
  if (type === 'goods-list' || type === 'discount-promotion') return {
    name: type === 'goods-list' ? 'fix-goods-list' : 'discount-promotion',
    props: {
      data: { gap: number(child.gap, 0), num: number(child.num, 99), list: [], mode: string(child.mode || 'mode-1'), type: [], source: string(child.source || 'source-1'), isShadow: child.isShadow !== false, attribute: number(child.attribute, 0), isVoucher: child.isVoucher !== false, allProducts: child.allProducts !== false },
      position,
      styleColor: { color: color(child.color || '#000000'), backgroundColor: color(child.bgColor || '#f5f6f7') },
      styleSpacing: { ...spacing, marginTop: number(child.marginTop, 83), marginBottom: number(child.marginBottom, 86) },
    },
  };
  if (type === 'coupon') return { name: 'fix-coupon', props: { data: {
    title: string(child.title || 'FREE COUPON'), subtitle: string(child.subtitle || 'Click to claim'), logo: string(child.logo || ''), couponName: string(child.couponName || 'Special Discount'), merchantName: string(child.merchantName || 'Your Store Name'), themeColor: color(child.themeColor || '#90ee90'), titleColor: color(child.titleColor || '#333333'), subtitleColor: color(child.subtitleColor || '#666666'), backgroundImage: string(child.backgroundImage || ''), titleFontFamily: string(child.titleFontFamily || 'inherit'), titleFontSize: number(child.titleFontSize, 24), titleFontWeight: child.titleFontWeight ?? 'bold', subtitleFontFamily: string(child.subtitleFontFamily || 'inherit'), subtitleFontSize: number(child.subtitleFontSize, 14), subtitleFontWeight: child.subtitleFontWeight ?? 'normal', couponNameFontFamily: string(child.couponNameFontFamily || 'inherit'), couponNameFontSize: number(child.couponNameFontSize, 18), couponNameFontWeight: child.couponNameFontWeight ?? 'normal', merchantNameFontFamily: string(child.merchantNameFontFamily || 'inherit'), merchantNameFontSize: number(child.merchantNameFontSize, 16), merchantNameFontWeight: child.merchantNameFontWeight ?? 'normal',
  } } };
  if (type === 'search') return { name: 'fix-search', props: { mode: string(child.mode || 'mode-1'), placeholder: string(child.placeholder || 'Enter keywords to search'), backgroundColor: color(child.backgroundColor || '#f6f7fa'), position: { ...position, top: number(child.top ?? child.y, 44), zIndex: number(child.zIndex, 1) }, styleColor: { color: color(child.color || '#000000'), opacity: number(child.opacity, 1), backgroundColor: color(child.bgColor || '#ffffff') }, styleSpacing: { ...spacing, padding: number(child.padding, 24), borderTopLR: number(child.radius, 24), borderBottomLR: number(child.radius, 24) } } };
  if (type === 'navigation') return { name: 'fix-menus', props: { style: { shape: string(child.shape || 'round'), pageNum: number(child.pageNum, 2), rowNum: number(child.rowNum, 4), iconSize: number(child.iconSize, 50) }, styleColor: { color: color(child.color || '#000000'), backgroundColor: color(child.bgColor || '#f6f7fa'), opacity: number(child.opacity, 1), fontWeight: child.fontWeight ?? 'normal', fontStyle: child.fontStyle ?? 'normal', textDecoration: child.textDecoration ?? 'none' }, styleSpacing: spacing, position: { ...position, zIndex: number(child.zIndex, 1) }, list: (Array.isArray(child.items) ? child.items : []).map((item) => ({ text: string(item.text || item.label || 'Button'), useText: item.useText !== false, mode: string(item.mode || 'mode-1'), link: item.link && typeof item.link === 'object' ? item.link : { page: '', appid: '', type: '', name: '' }, icon: string(item.icon || ''), color: color(item.color || '#000000'), backgroundColor: color(item.backgroundColor || '#ffffff') })) } };
  if (type === 'brand-navbar') return { name: 'fix-brand-navbar', props: { brand: { logo: string(child.logo || child.brand?.logo || ''), name: string(child.brandName || child.brand?.name || 'Merchant Name'), showLogo: child.showLogo ?? child.brand?.showLogo ?? true }, layout: { mode: string(child.layout?.mode || child.mode || 'inline'), itemGap: number(child.layout?.itemGap ?? child.itemGap, 16), paddingX: number(child.layout?.paddingX ?? child.paddingX, 16), height: number(child.layout?.height ?? child.height, 64) }, styleColor: { backgroundColor: color(child.styleColor?.backgroundColor || child.bgColor || '#ffffff'), textColor: color(child.styleColor?.textColor || child.color || '#111827'), menuBackgroundColor: color(child.styleColor?.menuBackgroundColor || '#111827'), menuTextColor: color(child.styleColor?.menuTextColor || '#ffffff') }, typography: { brandFontSize: number(child.typography?.brandFontSize ?? child.brandFontSize, 18), navFontSize: number(child.typography?.navFontSize ?? child.navFontSize, 14), fontWeight: child.typography?.fontWeight ?? child.fontWeight ?? '600' }, iconStyle: { brandIconSize: number(child.iconStyle?.brandIconSize, 40), itemIconSize: number(child.iconStyle?.itemIconSize, 18), menuIconSize: number(child.iconStyle?.menuIconSize, 20) }, items: (Array.isArray(child.items) ? child.items : []).map((item, itemIndex) => ({ id: safeId(item.id || `brand-navbar-item-${itemIndex + 1}`), label: string(item.label || item.text || `Item ${itemIndex + 1}`), renderMode: string(item.renderMode || 'text'), icon: string(item.icon || ''), target: item.target && typeof item.target === 'object' ? item.target : { kind: 'section', sectionId: string(item.sectionId || '') } })) } };
  if (type === 'banner') return { name: 'fix-banner', props: { mode: string(child.mode || 'card'), height: number(child.height, 500), styleColor: { color: color(child.color || '#000000'), backgroundColor: color(child.bgColor || '#f6f7fa'), opacity: number(child.opacity, 1) }, styleSpacing: spacing, indicatorDots: child.indicatorDots !== false, autoplay: child.autoplay !== false, list: (Array.isArray(child.items) ? child.items : []).map((item) => ({ pic: string(item.pic || item.src || item.url || ''), link: item.link && typeof item.link === 'object' ? item.link : { name: '', type: '', appid: '', page: '' } })) } };
  if (type === 'store-information') return { name: 'store-information', props: { data: { backgroundImage: string(child.backgroundImage || ''), logo: string(child.logo || ''), storeName: string(child.storeName || ''), slogan: string(child.slogan || ''), phone: string(child.phone || ''), email: string(child.email || ''), address: string(child.address || ''), businessHours: string(child.businessHours || '') } } };
  if (type === 'event-list') return { name: 'event-list', props: { data: { events: [], styleMode: number(child.styleMode, 0) } } };
  if (type === 'event-calendar') return { name: 'event-calendar', props: { data: { events: [], viewMode: string(child.viewMode || 'month'), styleMode: number(child.styleMode, 0), themePreset: string(child.themePreset || 'amber-velvet'), primaryColor: color(child.primaryColor || '#b45309'), secondaryColor: color(child.secondaryColor || '#7c2d12'), accentColor: color(child.accentColor || '#fbbf24'), backgroundColor: color(child.backgroundColor || '#110d09'), surfaceColor: color(child.surfaceColor || '#261813'), textColor: color(child.textColor || '#fff7ed'), mutedTextColor: color(child.mutedTextColor || '#fcd9a6') } } };
  if (type === 'service-list') return { name: 'service-list', props: { data: { storeName: string(child.storeName || 'Service Provider'), totalSales: 0, logo: string(child.logo || ''), themeColor: color(child.themeColor || '#2F80ED'), categories: [{ label: 'All', value: 'all', icon: 'apps' }, { label: 'Promotions', value: 'discount', icon: 'discount' }, { label: 'New', value: 'new', icon: 'new' }, { label: 'Popular', value: 'popular', icon: 'fire' }, { label: 'Featured', value: 'featured', icon: 'star' }], services: [] } } };
  if (type === 'blog-list') return { name: 'blog-list', props: { data: { blogContents: {} }, styleSpacing: spacing, styleColor: { titleColor: color(child.titleColor || '#000000'), titleFontSize: number(child.titleFontSize, 30), titleFontWeight: child.titleFontWeight ?? 'bold', subtitleColor: color(child.subtitleColor || '#666666'), subtitleFontSize: number(child.subtitleFontSize, 20), subtitleFontWeight: child.subtitleFontWeight ?? 'normal', backgroundColor: color(child.bgColor || '#ffffff') } } };
  throw new Error(`Unsupported fixed Unico component type: ${type}`);
}

function structureChild(type, child, scope) {
  if (type === 'text') {
    return {
      text: control('Text', 'text', string(child.text || child.content || '')),
      link: control('Link Settings', 'link', link(child.link)),
    };
  }
  if (type === 'button') {
    return {
      text: control('Text', 'text', string(child.text || child.label || 'Button')),
      link: control('Link Settings', 'link', link(child.link)),
    };
  }
  if (type === 'img') {
    return {
      upload: control('Image', 'upload', string(child.src || child.url || child.upload || '')),
      link: control('Link Settings', 'link', link(child.link)),
    };
  }
  if (type === 'rich-text') {
    return {
      content: control('Content', 'html', string(child.html || child.content || child.text || '')),
    };
  }
  if (type === 'img-text') {
    const rawItems = Array.isArray(child.items) ? child.items : [];
    return {
      img_text_list: control('Image Text List', 'img_text_list', rawItems.map((item) => ({
        name: string(item?.name || item?.text || ''),
        imgUrl: string(item?.imgUrl || item?.src || item?.url || ''),
        href: string(item?.href || ''),
      }))),
    };
  }
  if (type === 'video-player') {
    return {
      videoUrl: control('Video URL', 'video', string(child.url || child.videoUrl || child.src || '')),
    };
  }
  if (type === 'countdown') {
    return {
      title: control('Title', 'text', string(child.title || 'Countdown')),
      targetDate: control('Target Date', 'text', string(child.targetDate || '')),
    };
  }
  if (type === 'tabs') {
    const tabs = (Array.isArray(child.tabs) && child.tabs.length ? child.tabs : [{ title: 'Tab 1', children: [] }]).slice(0, 5);
    const result = {
      tabCount: control('Number of Tabs (1-5)', 'number', tabs.length),
    };
    for (let tabIndex = 0; tabIndex < 5; tabIndex += 1) {
      const tab = tabs[tabIndex] || {};
      result[`tab${tabIndex + 1}Title`] = control(`Tab ${tabIndex + 1} Title`, 'text', string(tab.title || `Tab ${tabIndex + 1}`));
      result[`tab${tabIndex + 1}Content`] = control('', 'field', {
        structure: {
          label: `Tab ${tabIndex + 1} Container`,
          child: {
            component_list: control('Widgets List', 'component_list', (Array.isArray(tab.children) ? tab.children : [])
              .map((tabChild, childIndex) => compileChild(tabChild, childIndex, `${scope}-tab-${tabIndex + 1}`))),
          },
        },
        styles: {
          label: 'Container Style',
          child: {
            height: control('Container Height', 'height', number(tab.height, 300)),
            justify: control('Layout', 'justify', justify(tab.justify)),
            bgColor: control('Background Color', 'bgColor', color(tab.bgColor || tab.background || 'transparent')),
          },
        },
      });
    }
    return result;
  }
  if (type === 'accordion') {
    const items = Array.isArray(child.items) ? child.items : [];
    return {
      items: control('Accordion Items', 'accordion_list', items.map((item) => ({
        title: string(item?.title || ''),
        content: string(item?.content || item?.text || ''),
      }))),
    };
  }
  if (type === 'map') {
    return {
      address: control('Address', 'text', string(child.address || '')),
      embedUrl: control('Map Embed URL (iframe src)', 'text', string(child.embedUrl || '')),
      linkUrl: control('Map Link URL', 'text', string(child.linkUrl || child.url || '')),
    };
  }
  if (type === 'rating') {
    return {
      rating: control('Rating Value', 'text', string(child.rating || '')),
      reviewCount: control('Review Count', 'text', string(child.reviewCount || '')),
    };
  }
  if (type === 'social-share') {
    return {
      title: control('Title', 'text', string(child.title || 'Share this page')),
      showFacebook: control('Show Facebook', 'switch', child.showFacebook !== false),
      facebookUrl: control('Facebook Share URL', 'text', string(child.facebookUrl || '')),
      showTwitter: control('Show Twitter', 'switch', child.showTwitter !== false),
      twitterUrl: control('Twitter Share URL', 'text', string(child.twitterUrl || '')),
      showLinkedin: control('Show LinkedIn', 'switch', child.showLinkedin !== false),
      linkedinUrl: control('LinkedIn Share URL', 'text', string(child.linkedinUrl || '')),
      showWhatsapp: control('Show WhatsApp', 'switch', child.showWhatsapp !== false),
      whatsappUrl: control('WhatsApp Share URL', 'text', string(child.whatsappUrl || '')),
      showEmail: control('Show Email', 'switch', child.showEmail !== false),
      emailUrl: control('Email Share URL', 'text', string(child.emailUrl || '')),
    };
  }
  if (type === 'person-profile') {
    return {
      avatar: control('Avatar Image', 'upload', string(child.avatar || child.src || '')),
      name: control('Name', 'text', string(child.name || '')),
      title: control('Job Title', 'text', string(child.title || '')),
      bio: control('Biography', 'text', string(child.bio || '')),
      email: control('Email', 'text', string(child.email || '')),
      phone: control('Phone', 'text', string(child.phone || '')),
      linkedin: control('LinkedIn URL', 'text', string(child.linkedin || '')),
      twitter: control('Twitter URL', 'text', string(child.twitter || '')),
      website: control('Website', 'text', string(child.website || '')),
    };
  }
  if (type === 'inquiry-box') {
    return {
      title: control('Title', 'text', string(child.title || 'Contact Us')),
      nameLabel: control('Name Field Label', 'text', string(child.nameLabel || 'Name')),
      contactLabel: control('Contact Field Label', 'text', string(child.contactLabel || 'Phone or Email')),
      inquiryTitleLabel: control('Title Field Label', 'text', string(child.inquiryTitleLabel || 'Title')),
      contentLabel: control('Content Field Label', 'text', string(child.contentLabel || 'Content')),
      pictureLabel: control('Picture Field Label', 'text', string(child.pictureLabel || 'Picture (Optional)')),
      submitButtonText: control('Submit Button Text', 'text', string(child.submitButtonText || 'Submit')),
      successMessage: control('Success Message', 'text', string(child.successMessage || 'Your inquiry has been submitted.')),
    };
  }
  return {
    link: control('Link Settings', 'link', link(child.link)),
  };
}

function styleChild(type, child, index) {
  const dimensions = {
    text: [320, 40],
    img: [120, 80],
    button: [120, 48],
    rectangle: [120, 80],
    circle: [80, 80],
    'rich-text': [320, 120],
    'img-text': [320, 160],
    'video-player': [320, 220],
    countdown: [320, 150],
    tabs: [320, 340],
    accordion: [320, 300],
    map: [320, 240],
    rating: [250, 60],
    'social-share': [320, 100],
    'person-profile': [320, 400],
    'inquiry-box': [320, 420],
  }[type] || [120, 80];
  const styles = {
    width: control('Width', 'width', dimension(child.w ?? child.width, dimensions[0])),
    height: control('Height', 'height', dimension(child.h ?? child.height, dimensions[1])),
    zIndex: control('Levels', 'zIndex', number(child.zIndex, index + 1)),
    top: control('Top Distance', 'top', number(child.y ?? child.top, 0)),
    left: control('Left Distance', 'left', number(child.x ?? child.left, 0)),
  };

  if (type === 'text' || type === 'button' || type === 'rich-text') {
    styles.fontSize = control('Font Size', 'fontSize', number(child.fontSize, type === 'text' ? 16 : 15));
    styles.color = control('Font Color', 'color', color(child.color || (type === 'button' ? '#ffffff' : '#111111')));
    styles.fontWeight = control('Bold', 'fontWeight', child.fontWeight ?? child.weight ?? 'normal');
    styles.fontFamily = control('Font Family', 'fontFamily', string(child.fontFamily || 'inherit'));
    styles.lineHeight = control('Line Height', 'lineHeight', child.lineHeight ?? 'normal');
    styles.justify = control('Alignment', 'justify', justify(child.align || child.textAlign || child.justify));
  }

  if (type === 'button' || type === 'rectangle' || type === 'circle') {
    styles.bgColor = control('Background Color', 'bgColor', color(child.bgColor || child.background || child.backgroundColor || (type === 'button' ? '#111111' : 'transparent')));
    styles.radius = control('Border Radius', 'radius', number(child.radius ?? child.borderRadius, type === 'circle' ? 999 : 0));
    styles.borderColor = control('Border Color', 'color', color(child.borderColor || 'transparent'));
    styles.borderWidth = control('Border Width', 'borderWidth', number(child.borderWidth, 0));
  }

  if (type === 'img' || type === 'rich-text') {
    styles.radius = control('Border Radius', 'radius', number(child.radius ?? child.borderRadius, 0));
  }

  if (type === 'button') {
    styles.paddingInline = control('Horizontal Padding', 'paddingInline', number(child.paddingInline, 20));
    styles.paddingBlock = control('Vertical Padding', 'paddingBlock', number(child.paddingBlock, 10));
  }

  if (type === 'img-text') {
    styles.paddingInline = control('Horizontal Padding', 'paddingInline', number(child.paddingInline, 20));
    styles.paddingBlock = control('Vertical Padding', 'paddingBlock', number(child.paddingBlock, 10));
    styles.radius = control('Image Radius', 'radius', number(child.radius ?? child.borderRadius, 10));
    styles.fontSize = control('Font Size', 'fontSize', number(child.fontSize, 16));
    styles.fontFamily = control('Font Family', 'fontFamily', string(child.fontFamily || 'inherit'));
    styles.color = control('Font Color', 'color', color(child.color || '#000000'));
    styles.backgroundColor = control('Background Color', 'color', color(child.bgColor || child.backgroundColor || 'transparent'));
    styles.fontWeight = control('Bold', 'fontWeight', child.fontWeight ?? 'normal');
  }

  if (type === 'video-player') {
    styles.bgColor = control('Background Color', 'bgColor', color(child.bgColor || '#000000'));
  }

  if (type === 'countdown') {
    styles.bgColor = control('Background Color', 'bgColor', color(child.bgColor || '#ff6b6b'));
    styles.color = control('Text Color', 'color', color(child.color || '#ffffff'));
  }

  if (type === 'tabs') {
    styles.bgColor = control('Background Color', 'bgColor', color(child.bgColor || '#ffffff'));
    styles.color = control('Active Color', 'color', color(child.activeColor || child.color || '#1890ff'));
  }

  if (type === 'accordion') {
    styles.bgColor = control('Background Color', 'bgColor', color(child.bgColor || '#ffffff'));
    styles.borderColor = control('Border Color', 'color', color(child.borderColor || '#e8e8e8'));
    styles.activeColor = control('Active Color', 'color', color(child.activeColor || '#1890ff'));
  }

  if (type === 'map') {
    styles.bgColor = control('Background Color', 'bgColor', color(child.bgColor || '#f0f2f5'));
  }

  if (type === 'rating') {
    styles.color = control('Star Color', 'color', color(child.color || '#faad14'));
  }

  if (type === 'social-share') {
    styles.bgColor = control('Background Color', 'bgColor', color(child.bgColor || '#ffffff'));
    styles.buttonStyle = control('Button Style', 'text', string(child.buttonStyle || 'rounded'));
  }

  if (type === 'person-profile') {
    styles.bgColor = control('Background Color', 'bgColor', color(child.bgColor || '#ffffff'));
    styles.color = control('Text Color', 'color', color(child.color || '#262626'));
    styles.avatarSize = control('Avatar Size', 'width', number(child.avatarSize, 120));
  }

  if (type === 'inquiry-box') {
    styles.bgColor = control('Background Color', 'bgColor', color(child.bgColor || '#ffffff'));
    styles.primaryColor = control('Primary Color', 'color', color(child.primaryColor || '#1890ff'));
    styles.buttonColor = control('Button Color', 'bgColor', color(child.buttonColor || child.primaryColor || '#1890ff'));
    styles.buttonTextColor = control('Button Text Color', 'color', color(child.buttonTextColor || '#ffffff'));
    styles.inputBorderColor = control('Input Border Color', 'color', color(child.inputBorderColor || '#d9d9d9'));
    styles.labelColor = control('Label Color', 'color', color(child.labelColor || '#262626'));
    styles.titleColor = control('Title Color', 'color', color(child.titleColor || '#000000'));
  }

  if (child.letterSpacing !== undefined) {
    styles.letterSpacing = control('Letter Spacing', 'letterSpacing', child.letterSpacing);
  }

  return styles;
}

function validateDesignJson(designJson) {
  const errors = [];
  if (!Array.isArray(designJson) || designJson.length === 0) {
    errors.push('designJson must be a non-empty array');
  }
  for (const [sectionIndex, section] of designJson.entries()) {
    if (section.type !== 'free-box') errors.push(`section ${sectionIndex} must be free-box`);
    const children = section.field?.structure?.child?.component_list?.value;
    if (!Array.isArray(children)) errors.push(`section ${sectionIndex} component_list must be an array`);
  }
  return { passed: errors.length === 0, errors };
}

function normalizeType(type) {
  const value = string(type || 'text').toLowerCase();
  if (value === 'image') return 'img';
  if (value === 'richtext') return 'rich-text';
  if (value === 'imgtext') return 'img-text';
  if (value === 'video') return 'video-player';
  if (value === 'socialshare') return 'social-share';
  if (value === 'personprofile') return 'person-profile';
  if (value === 'inquirybox') return 'inquiry-box';
  if (SUPPORTED_CHILD_TYPES.has(value)) return value;
  throw new Error(`Unsupported Unico component type: ${value || '(empty)'}`);
}

function control(label, type, value) {
  return { label, type, value };
}

function safeId(value) {
  const id = string(value).trim().replace(/[^A-Za-z0-9_-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return id || `component-${Date.now()}`;
}

function string(value) {
  return value === undefined || value === null ? '' : String(value);
}

function number(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function dimension(value, fallback) {
  if (value === 'auto') return 'auto';
  return number(value, fallback);
}

function color(value) {
  return string(value || 'transparent');
}

function justify(value) {
  const v = string(value || 'left').toLowerCase();
  if (v === 'center' || v === 'right' || v === 'left') return v;
  return 'left';
}

function link(value) {
  if (value && typeof value === 'object') return value;
  return { page: '', url: string(value), type: value ? 'url' : 'page', serviceId: '', productId: '' };
}

function structureLabel(type) {
  if (type === 'button') return 'Button Text';
  if (type === 'img') return 'Image';
  if (type === 'rich-text') return 'Rich Text';
  if (type === 'img-text') return 'Image Text';
  if (type === 'video-player') return 'Video Content';
  if (type === 'countdown') return 'Countdown Content';
  if (type === 'tabs') return 'Tabs Content';
  if (type === 'accordion') return 'Accordion Content';
  if (type === 'map') return 'Map Content';
  if (type === 'rating') return 'Rating Content';
  if (type === 'social-share') return 'Social Share Content';
  if (type === 'person-profile') return 'Person Profile Content';
  if (type === 'inquiry-box') return 'Inquiry Box Content';
  return 'Content';
}

function styleLabel(type) {
  if (type === 'button') return 'Button Style';
  if (type === 'img') return 'Image Style';
  if (type === 'img-text') return 'Image Text Style';
  if (type === 'video-player') return 'Video Style';
  if (type === 'countdown') return 'Countdown Style';
  if (type === 'tabs') return 'Tabs Style';
  if (type === 'accordion') return 'Accordion Style';
  if (type === 'map') return 'Map Style';
  if (type === 'rating') return 'Rating Style';
  if (type === 'social-share') return 'Social Share Style';
  if (type === 'person-profile') return 'Person Profile Style';
  if (type === 'inquiry-box') return 'Inquiry Box Style';
  return 'Style';
}
