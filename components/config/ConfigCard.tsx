import { Card, Group, Text, Badge, Stack, ActionIcon, Box } from '@mantine/core';
import { IconDownload, IconClock, IconCalendar, IconFileText } from '@tabler/icons-react';
import type { GameConfig } from '@/lib/types/api';

interface ConfigCardProps {
  config: GameConfig;
}

export function ConfigCard({ config }: ConfigCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ height: '100%', cursor: 'pointer' }}
    >
      <Stack gap="md">
        {/* Config Name */}
        <Text fw={600} size="lg" lineClamp={2}>
          {config.name}
        </Text>

        {/* Game Badge */}
        <Group gap="xs">
          <Badge variant="light" color="blue">
            {config.game.name}
          </Badge>
        </Group>

        {/* Version Info */}
        {config.active_version && (
          <Group gap="xs" c="dimmed">
            <IconFileText size={16} />
            <Text size="sm">
              Version {config.active_version.version}
            </Text>
          </Group>
        )}

        {/* Metadata */}
        <Stack gap="xs">
          <Group gap="xs" c="dimmed">
            <IconClock size={16} />
            <Text size="xs">
              Updated {formatDate(config.modified)}
            </Text>
          </Group>

          <Group gap="xs" c="dimmed">
            <IconCalendar size={16} />
            <Text size="xs">
              Created {formatDate(config.created)}
            </Text>
          </Group>
        </Stack>

        {/* Actions */}
        <Group justify="flex-end" mt="auto">
          <ActionIcon variant="filled" color="orange" size="lg">
            <IconDownload size={20} />
          </ActionIcon>
        </Group>
      </Stack>
    </Card>
  );
}