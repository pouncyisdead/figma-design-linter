import { LintResult } from '../types';

export function checkStyles(node: SceneNode): LintResult[] {
  const results: LintResult[] = [];

  if ('fills' in node) {
    // Check for hard-coded colors
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach(fill => {
        if (fill.type === 'SOLID' && !fill.styleId) {
          results.push({
            type: 'warning',
            message: 'Hard-coded color detected',
            node,
            category: 'styles',
            fixable: true
          });
        }
      });
    }
  }

  if ('effects' in node) {
    // Check for hard-coded effects
    if (node.effects && Array.isArray(node.effects) && node.effects.length > 0 && !node.effectStyleId) {
      results.push({
        type: 'warning',
        message: 'Hard-coded effect detected',
        node,
        category: 'styles',
        fixable: true
      });
    }
  }

  if (node.type === 'TEXT') {
    // Check for hard-coded text styles
    if (!node.textStyleId) {
      results.push({
        type: 'warning',
        message: 'Hard-coded text style detected',
        node,
        category: 'styles',
        fixable: true
      });
    }
  }

  // Recursively check children
  if ('children' in node) {
    for (const child of node.children) {
      results.push(...checkStyles(child));
    }
  }

  return results;
}