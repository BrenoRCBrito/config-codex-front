import { Stack, Title, TextInput, Select } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { Game } from '@/lib/types/api';

interface FilterSidebarProps {
  games: Game[];
  selectedGame: string | null;
  onGameChange: (gameSlug: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FilterSidebar({
  games,
  selectedGame,
  onGameChange,
  searchQuery,
  onSearchChange,
}: FilterSidebarProps) {
  const gameOptions = [
    { value: '', label: 'All Games' },
    ...games.map((game) => ({
      value: game.slug,
      label: game.name,
    })),
  ];

  return (
    <Stack gap="lg">
      <Title order={3}>Filters</Title>

      {/* Search */}
      <TextInput
        placeholder="Search configs..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
      />

      {/* Game Filter */}
      <div>
        <Title order={5} mb="xs">
          Game
        </Title>
        <Select
          placeholder="Select game"
          data={gameOptions}
          value={selectedGame || ''}
          onChange={(value) => onGameChange(value || null)}
          clearable
        />
      </div>
    </Stack>
  );
}