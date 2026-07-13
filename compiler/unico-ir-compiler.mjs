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
  return sections.map((section, index) => compileSection(section, index));
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
