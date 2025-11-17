import { Stack, Text, Box, Badge, ScrollArea, UnstyledButton } from '@mantine/core';
import { IconCircleFilled, IconCircle } from '@tabler/icons-react';
import type { GameConfigFileVersion } from '@/lib/types/api';

interface VersionsListProps {
  versions: GameConfigFileVersion[];
  selectedVersionId: string | null;
  onVersionSelect: (versionId: string) => void;
}

export function VersionsList({
  versions,
  selectedVersionId,
  onVersionSelect,
}: VersionsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const latestVersion = versions.length > 0 ? versions[0] : null;

  return (
    <Stack gap="xs">
      <Text fw={600} size="sm" c="dimmed">
        VERSIONS
      </Text>

      <ScrollArea h={600}>
        <Stack gap={4}>
          {versions.map((version) => {
            const isSelected = version.id === selectedVersionId;
            const isLatest = version.id === latestVersion?.id;

            return (
              <UnstyledButton
                key={version.id}
                onClick={() => onVersionSelect(version.id)}
                p="sm"
                style={{
                  borderRadius: '8px',
                  backgroundColor: isSelected
                    ? 'var(--mantine-color-orange-1)'
                    : 'transparent',
                  border: isSelected
                    ? '2px solid var(--mantine-color-orange-6)'
                    : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Stack gap="xs">
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isSelected ? (
                      <IconCircleFilled size={12} color="var(--mantine-color-orange-6)" />
                    ) : (
                      <IconCircle size={12} color="var(--mantine-color-gray-5)" />
                    )}
                    <Text fw={600} size="sm">
                      v{version.version}
                    </Text>
                    {isLatest && (
                      <Badge size="xs" variant="light" color="green">
                        Latest
                      </Badge>
                    )}
                  </Box>

                  <Text size="xs" c="dimmed" pl={20}>
                    {formatDate(version.created)}
                  </Text>

                  {version.notes && (
                    <Text size="xs" c="dimmed" pl={20} lineClamp={2}>
                      {version.notes}
                    </Text>
                  )}
                </Stack>
              </UnstyledButton>
            );
          })}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}