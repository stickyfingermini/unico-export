#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const inputPath = resolve(process.argv[2] || 'unico-design-ir.json');
const outputPath = resolve(process.argv[3] || 'unico-export-result.json');

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
            value: children.map((child, childIndex) => compileChild(child, childIndex)),
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

function compileChild(child, index) {
  const type = normalizeType(child.type);
  const base = {
    id: safeId(child.id || `${type}-${index + 1}`),
    label: string(child.label || child.text || child.name || type),
    type,
    field: {
      structure: { label: structureLabel(type), child: structureChild(type, child) },
      styles: { label: styleLabel(type), child: styleChild(type, child, index) },
    },
  };
  return base;
}

function structureChild(type, child) {
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
  return {
    link: control('Link Settings', 'link', link(child.link)),
  };
}

function styleChild(type, child, index) {
  const styles = {
    width: control('Width', 'width', dimension(child.w ?? child.width, type === 'text' ? 320 : 120)),
    height: control('Height', 'height', dimension(child.h ?? child.height, type === 'text' ? 40 : 80)),
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
  if (['text', 'img', 'button', 'rectangle', 'circle', 'rich-text'].includes(value)) return value;
  return 'text';
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
  return 'Content';
}

function styleLabel(type) {
  if (type === 'button') return 'Button Style';
  if (type === 'img') return 'Image Style';
  return 'Style';
}
