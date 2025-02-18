import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { 
  Button,
  Checkbox,
  Container,
  IconButton,
  render,
  VerticalSpace,
  Text,
  Tabs,
  TabsOption
} from '@create-figma-plugin/ui';
import { LintReport, LintResult, LintOptions } from './types';

const defaultOptions: LintOptions = {
  checkDesignSystem: true,
  checkComponents: true,
  checkStyles: true,
  checkAccessibility: true,
  checkDocumentation: true,
  ignoredNodes: []
};

function Plugin() {
  const [options, setOptions] = useState<LintOptions>(defaultOptions);
  const [report, setReport] = useState<LintReport | null>(null);
  const [activeTab, setActiveTab] = useState<TabsOption>('issues');

  const tabs: Array<TabsOption> = [
    { value: 'issues', children: 'Issues' },
    { value: 'settings', children: 'Settings' }
  ];

  const handleRunLint = () => {
    parent.postMessage({ pluginMessage: { type: 'run-lint', options } }, '*');
  };

  const handleFixIssue = (issueId: string, fixType: string) => {
    parent.postMessage({ pluginMessage: { type: 'fix-issue', issueId, fixType } }, '*');
  };

  const handleExportReport = () => {
    if (report) {
      parent.postMessage({ pluginMessage: { type: 'export-report', report } }, '*');
    }
  };

  useEffect(() => {
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      if (message.type === 'lint-complete') {
        setReport(message.report);
      }
    };
  }, []);

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Tabs
        options={tabs}
        value={activeTab}
        onChange={(value) => setActiveTab(value)}
      />
      
      {activeTab === 'issues' ? (
        <>
          <VerticalSpace space="medium" />
          <Button fullWidth onClick={handleRunLint}>
            Run Lint
          </Button>
          
          {report && (
            <>
              <VerticalSpace space="medium" />
              <Text>
                Found {report.totalIssues} issues ({report.fixableIssues} fixable)
              </Text>
              <VerticalSpace space="small" />
              {report.results.map((result: LintResult, index: number) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <Text>
                    [{result.type}] {result.message}
                  </Text>
                  {result.fixable && (
                    <IconButton onClick={() => handleFixIssue(index.toString(), 'auto')}>
                      fix
                    </IconButton>
                  )}
                </div>
              ))}
              <VerticalSpace space="medium" />
              <Button fullWidth onClick={handleExportReport}>
                Export Report
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <VerticalSpace space="medium" />
          <Checkbox
            value={options.checkDesignSystem}
            onChange={(value) => setOptions({ ...options, checkDesignSystem: value })}
          >
            Check Design System Compliance
          </Checkbox>
          <Checkbox
            value={options.checkStyles}
            onChange={(value) => setOptions({ ...options, checkStyles: value })}
          >
            Check Styles
          </Checkbox>
          <Checkbox
            value={options.checkAccessibility}
            onChange={(value) => setOptions({ ...options, checkAccessibility: value })}
          >
            Check Accessibility
          </Checkbox>
          <Checkbox
            value={options.checkDocumentation}
            onChange={(value) => setOptions({ ...options, checkDocumentation: value })}
          >
            Check Documentation
          </Checkbox>
        </>
      )}
    </Container>
  );
}

export default render(Plugin);