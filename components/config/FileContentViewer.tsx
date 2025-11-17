import { Box, Code, ActionIcon, Group, Text, CopyButton, Tooltip } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface FileContentViewerProps {
  content: string;
  filename: string;
  size: number;
}

export function FileContentViewer({ content, filename, size }: FileContentViewerProps) {
  // Detect language from filename extension
  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      json: 'json',
      js: 'javascript',
      ts: 'typescript',
      tsx: 'tsx',
      jsx: 'jsx',
      py: 'python',
      yaml: 'yaml',
      yml: 'yaml',
      xml: 'xml',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sql: 'sql',
      sh: 'bash',
      bash: 'bash',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      rs: 'rust',
      go: 'go',
      rb: 'ruby',
      php: 'php',
      ini: 'ini',
      toml: 'toml',
      md: 'markdown',
      txt: 'text',
    };
    return languageMap[ext || ''] || 'text';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const language = getLanguage(filename);

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="md" p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group gap="md">
          <Text fw={600}>{filename}</Text>
          <Text size="sm" c="dimmed">
            {formatFileSize(size)}
          </Text>
          <Code>{language}</Code>
        </Group>

        <CopyButton value={content}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied!' : 'Copy to clipboard'}>
              <ActionIcon
                variant="subtle"
                color={copied ? 'green' : 'gray'}
                onClick={copy}
              >
                {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>

      {/* Content */}
      <Box style={{ maxHeight: '600px', overflow: 'auto' }}>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          {content}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
}