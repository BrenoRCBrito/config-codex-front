import { Group, Title, Container, Box } from '@mantine/core';
import { IconSettingsCog } from '@tabler/icons-react';

export function Header() {
  return (
    <Box
      component="header"
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        padding: '1rem 0',
      }}
    >
      <Container size="xl">
        <Group>
          <IconSettingsCog size={32} stroke={1.5} color="var(--mantine-color-orange-6)" />
          <Title order={2}>Config Codex</Title>
        </Group>
      </Container>
    </Box>
  );
}