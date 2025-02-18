export interface LintResult {
  type: 'error' | 'warning';
  message: string;
  node?: SceneNode;
  category: LintCategory;
  fixable: boolean;
}

export type LintCategory = 
  | 'design-system'
  | 'components'
  | 'styles'
  | 'accessibility'
  | 'documentation';

export interface ComponentMetadata {
  version: string;
  owner: string;
  guidelines: string;
  dependencies: string[];
  lastModified: string;
  documentation: string;
}

export interface LintOptions {
  checkDesignSystem?: boolean | any;
  checkComponents?: boolean | any;
  checkStyles?: boolean | any;
  checkAccessibility?: boolean | any;
  checkDocumentation?: boolean | any;
  ignoredNodes?: string[] | any[] | any;
}

export interface LintReport {
  results: LintResult[];
  timestamp: string;
  totalIssues: number;
  fixableIssues: number;
}