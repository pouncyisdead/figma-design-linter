import { LintResult, LintOptions, LintReport } from './types';
import { checkDesignSystemCompliance } from './linters/designSystem';
import { checkStyles } from './linters/styles';
import { checkAccessibility } from './linters/accessibility';
import { showUI } from '@create-figma-plugin/utilities';

export async function lintDesign(options: LintOptions): Promise<LintReport> {
  const results: LintResult[] = [];
  const nodes =
    figma.currentPage.selection.length > 0
      ? figma.currentPage.selection
      : figma.currentPage.children;

  for (const node of nodes) {
    if (options.ignoredNodes.includes(node.id)) continue;

    if (options.checkDesignSystem) {
      results.push(...checkDesignSystemCompliance(node));
    }
    if (options.checkStyles) {
      results.push(...checkStyles(node));
    }
    if (options.checkAccessibility) {
      results.push(...checkAccessibility(node));
    }
  }

  const fixableIssues = results.filter((result) => result.fixable).length;

  return {
    results,
    timestamp: new Date().toISOString(),
    totalIssues: results.length,
    fixableIssues,
  };
}

export default async function () {
  showUI({ width: 450, height: 600 });

  const devMode = figma.editorType === 'dev';

  await figma.loadAllPagesAsync();

  // Handle messages from the UI
  figma.ui.onmessage = async (msg) => {
    if (msg.type === 'run-lint') {
      const report = await lintDesign(msg.options);
      figma.ui.postMessage({ type: 'lint-complete', report });
    } else if (msg.type === 'fix-issue') {
      // Handle automated fixes based on the issue type
      const { issueId, fixType } = msg;
      // Implement fix logic here
    } else if (msg.type === 'export-report') {
      // Handle report export
    }
  };
}
