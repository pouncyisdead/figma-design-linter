import { LintResult } from '../types';

export function checkDesignSystemCompliance(node: SceneNode): LintResult[] {
  const results: LintResult[] = [];

  if (node.type === 'INSTANCE') {
    // Check for detached instances
    if (!node.mainComponent) {
      results.push({
        type: 'error',
        message: 'Detached component instance detected',
        node,
        category: 'design-system',
        fixable: false
      });
    }

    // Check for component variants
    if (node.mainComponent && node.mainComponent.parent?.type === 'COMPONENT_SET') {
      const mainComponent = node.mainComponent;
      const componentSet = mainComponent.parent;
      
      // Check if the instance uses valid variant properties
      for (const [key, value] of Object.entries(node.componentProperties)) {
        if (!componentSet.componentPropertyDefinitions[key]) {
          results.push({
            type: 'error',
            message: `Invalid variant property: ${key}`,
            node,
            category: 'design-system',
            fixable: true
          });
        }
      }
    }
  }

  // Recursively check children
  if ('children' in node) {
    for (const child of node.children) {
      results.push(...checkDesignSystemCompliance(child));
    }
  }

  return results;
}