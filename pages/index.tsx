import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Stack,
  Title,
  Text,
  Loader,
  Center,
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { ConfigCard } from '@/components/config/ConfigCard';
import { Pagination } from '@/components/ui/Pagination';
import { gamesApi } from '@/lib/api/games';
import type { Game, GameConfig } from '@/lib/types/api';

export default function IndexPage() {
  const [configs, setConfigs] = useState<GameConfig[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch games for filter
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await gamesApi.getGames();
        setGames(gamesData);
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    };
    fetchGames();
  }, []);

  // Fetch configs
  useEffect(() => {
    const fetchConfigs = async () => {
      setLoading(true);
      setError(null);

      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const response = await gamesApi.getConfigs({
          limit: itemsPerPage,
          offset,
          game: selectedGame || undefined,
          search: searchQuery || undefined,
        });

        setConfigs(response.items);
        setTotalCount(response.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch configs');
        console.error('Error fetching configs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [currentPage, itemsPerPage, selectedGame, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGame, searchQuery]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <AppLayout>
      <Container size="xl" py="xl">
        <Grid gutter="xl">
          {/* Left Sidebar - Filters */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <FilterSidebar
              games={games}
              selectedGame={selectedGame}
              onGameChange={setSelectedGame}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </Grid.Col>

          {/* Main Content - Config List */}
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Stack gap="xl">
              {/* Header */}
              <div>
                <Title order={2} mb="xs">
                  Game Configurations
                </Title>
                <Text c="dimmed">
                  {totalCount.toLocaleString()} config{totalCount !== 1 ? 's' : ''} found
                </Text>
              </div>

              {/* Error State */}
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Error"
                  color="red"
                  variant="light"
                >
                  {error}
                </Alert>
              )}

              {/* Loading State */}
              {loading && (
                <Center py={60}>
                  <Loader size="lg" />
                </Center>
              )}

              {/* Configs Grid */}
              {!loading && !error && (
                <>
                  <Grid>
                    {configs.map((config) => (
                      <Grid.Col key={config.id} span={{ base: 12, sm: 6, lg: 4 }}>
                        <ConfigCard config={config} />
                      </Grid.Col>
                    ))}
                  </Grid>

                  {/* Empty State */}
                  {configs.length === 0 && (
                    <Center py={60}>
                      <Stack align="center" gap="xs">
                        <Text size="lg" fw={500} c="dimmed">
                          No configurations found
                        </Text>
                        <Text size="sm" c="dimmed">
                          Try adjusting your filters or search query
                        </Text>
                      </Stack>
                    </Center>
                  )}

                  {/* Pagination */}
                  {configs.length > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={setItemsPerPage}
                    />
                  )}
                </>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </AppLayout>
  );
}