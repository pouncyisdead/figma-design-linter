import { LintResult } from '../types';

function calculateContrastRatio(foreground: RGB, background: RGB): number {
  const getLuminance = (color: RGB) => {
    const [r, g, b] = [color.r, color.g, color.b].map(val => {
      val = val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      return val;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function checkAccessibility(node: SceneNode): LintResult[] {
  const results: LintResult[] = [];

  if (node.type === 'TEXT') {
    // Check text size
    if (node.fontSize < 12) {
      results.push({
        type: 'error',
        message: 'Text size too small for accessibility',
        node,
        category: 'accessibility',
        fixable: true
      });
    }

    // Check text contrast if we can determine the colors
    if ('fills' in node && node.fills && Array.isArray(node.fills)) {
      const textFill = node.fills.find(fill => fill.type === 'SOLID');
      if (textFill && textFill.type === 'SOLID') {
        const parent = node.parent;
        if (parent && 'fills' in parent) {
          const backgroundFill = parent.fills?.find(fill => fill.type === 'SOLID');
          if (backgroundFill && backgroundFill.type === 'SOLID') {
            const contrastRatio = calculateContrastRatio(
              textFill.color,
              backgroundFill.color
            );
            
            if (contrastRatio < 4.5) {
              results.push({
                type: 'error',
                message: `Insufficient contrast ratio: ${contrastRatio.toFixed(2)}:1`,
                node,
                category: 'accessibility',
                fixable: true
              });
            }
          }
        }
      }
    }
  }

  // Recursively check children
  if ('children' in node) {
    for (const child of node.children) {
      results.push(...checkAccessibility(child));
    }
  }

  return results;
}