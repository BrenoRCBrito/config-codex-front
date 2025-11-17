import { useState, useMemo } from 'react';
import { Box, Group, Text, Button, SegmentedControl } from '@mantine/core';
import { parseDiff, Diff, Hunk } from 'react-diff-view';
import { diffLines, formatLines } from 'unidiff';
import 'react-diff-view/style/index.css';

interface DiffViewerProps {
  oldContent: string;
  newContent: string;
  oldFilename: string;
  newFilename: string;
  oldVersion: number;
  newVersion: number;
  onClose: () => void;
}

export function DiffViewer({
  oldContent,
  newContent,
  oldFilename,
  newFilename,
  oldVersion,
  newVersion,
  onClose,
}: DiffViewerProps) {
  const [viewType, setViewType] = useState<'split' | 'unified'>('split');

  // Generate diff using unidiff
  const diffText = useMemo(() => {
    const diffResult = diffLines(oldContent, newContent);
    return formatLines(diffResult, { context: 3 });
  }, [oldContent, newContent]);

  // Parse diff for react-diff-view
  const files = useMemo(() => {
    try {
      return parseDiff(diffText, { nearbySequences: 'zip' });
    } catch (error) {
      console.error('Error parsing diff:', error);
      return [];
    }
  }, [diffText]);

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="md" p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group>
          <Text fw={600}>
            Comparing v{oldVersion} → v{newVersion}
          </Text>
        </Group>

        <Group>
          <SegmentedControl
            value={viewType}
            onChange={(value) => setViewType(value as 'split' | 'unified')}
            data={[
              { label: 'Split', value: 'split' },
              { label: 'Unified', value: 'unified' },
            ]}
          />
          <Button variant="light" color="gray" onClick={onClose}>
            Exit Compare
          </Button>
        </Group>
      </Group>

      {/* Diff Content */}
      <Box style={{ maxHeight: '600px', overflow: 'auto' }}>
        {files.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No differences found
          </Text>
        ) : (
          files.map((file, index) => (
            <Box key={index}>
              <Diff
                key={file.oldRevision + '-' + file.newRevision}
                viewType={viewType}
                diffType={file.type}
                hunks={file.hunks}
              >
                {(hunks) =>
                  hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
                }
              </Diff>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}