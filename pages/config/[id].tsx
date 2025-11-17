import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Grid,
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Loader,
  Center,
  Alert,
  Button,
  ActionIcon,
  Breadcrumbs,
  Anchor,
  Box,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconDownload,
  IconArrowLeft,
  IconGitCompare,
} from '@tabler/icons-react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { VersionsList } from '@/components/config/VersionsList';
import { FileContentViewer } from '@/components/config/FileContentViewer';
import { DiffViewer } from '@/components/config/DiffViewer';
import { gamesApi } from '@/lib/api/games';
import type {
  GameConfig,
  GameConfigFileVersion,
  GameConfigFileContent,
} from '@/lib/types/api';

export default function ConfigDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [config, setConfig] = useState<GameConfig | null>(null);
  const [versions, setVersions] = useState<GameConfigFileVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<GameConfigFileContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Comparison mode
  const [isComparing, setIsComparing] = useState(false);
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);
  const [compareContent, setCompareContent] = useState<GameConfigFileContent | null>(null);

  // Fetch config and versions
  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchConfigData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [configData, versionsData] = await Promise.all([
          gamesApi.getConfigById(id),
          gamesApi.getConfigVersions(id),
        ]);

        setConfig(configData);
        setVersions(versionsData);

        // Auto-select latest version (active_version)
        if (configData.active_version) {
          setSelectedVersionId(configData.active_version.id);
        } else if (versionsData.length > 0) {
          setSelectedVersionId(versionsData[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load config');
        console.error('Error fetching config:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigData();
  }, [id]);

  // Fetch file content when version changes
  useEffect(() => {
    if (!selectedVersionId) return;

    const fetchContent = async () => {
      setContentLoading(true);
      try {
        const content = await gamesApi.getVersionContent(selectedVersionId);
        setFileContent(content);
      } catch (err) {
        console.error('Error fetching file content:', err);
        setFileContent(null);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, [selectedVersionId]);

  // Handle comparison mode
  const handleCompareClick = () => {
    if (isComparing) {
      // Exit compare mode
      setIsComparing(false);
      setCompareVersionId(null);
      setCompareContent(null);
    } else {
      // Enter compare mode - select the previous version
      if (versions.length >= 2 && selectedVersionId) {
        const currentIndex = versions.findIndex((v) => v.id === selectedVersionId);
        if (currentIndex > 0) {
          const prevVersion = versions[currentIndex - 1];
          setCompareVersionId(prevVersion.id);
          // Fetch compare content
          gamesApi.getVersionContent(prevVersion.id).then(setCompareContent);
          setIsComparing(true);
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);
  const compareVersion = versions.find((v) => v.id === compareVersionId);

  if (loading) {
    return (
      <AppLayout>
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      </AppLayout>
    );
  }

  if (error || !config) {
    return (
      <AppLayout>
        <Container size="xl" py="xl">
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error || 'Config not found'}
          </Alert>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs>
            <Anchor component={Link} href="/">
              Configs
            </Anchor>
            <Text>{config.name}</Text>
          </Breadcrumbs>

          {/* Header */}
          <Box>
            <Group justify="space-between" mb="md">
              <Group>
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  onClick={() => router.push('/')}
                >
                  <IconArrowLeft size={20} />
                </ActionIcon>
                <div>
                  <Title order={2}>{config.name}</Title>
                  <Group gap="xs" mt="xs">
                    <Badge variant="light" color="blue">
                      {config.game.name}
                    </Badge>
                    {selectedVersion && (
                      <Badge variant="light" color="orange">
                        v{selectedVersion.version}
                      </Badge>
                    )}
                  </Group>
                </div>
              </Group>

              <Group>
                <Button
                  leftSection={<IconGitCompare size={18} />}
                  variant={isComparing ? 'filled' : 'light'}
                  color={isComparing ? 'orange' : 'gray'}
                  onClick={handleCompareClick}
                  disabled={versions.length < 2}
                >
                  {isComparing ? 'Exit Compare' : 'Compare'}
                </Button>
                <Button
                  leftSection={<IconDownload size={18} />}
                  variant="filled"
                  color="orange"
                  disabled={!fileContent}
                >
                  Download
                </Button>
              </Group>
            </Group>

            {/* Metadata */}
            <Group gap="xl">
              <Text size="sm" c="dimmed">
                Created: {formatDate(config.created)}
              </Text>
              <Text size="sm" c="dimmed">
                Modified: {formatDate(config.modified)}
              </Text>
              <Text size="sm" c="dimmed">
                {versions.length} version{versions.length !== 1 ? 's' : ''}
              </Text>
            </Group>
          </Box>

          {/* Main Content */}
          <Grid gutter="xl">
            {/* Left Sidebar - Versions */}
            <Grid.Col span={{ base: 12, md: 3 }}>
              <VersionsList
                versions={versions}
                selectedVersionId={selectedVersionId}
                onVersionSelect={setSelectedVersionId}
              />
            </Grid.Col>

            {/* Right Content - File Viewer or Diff */}
            <Grid.Col span={{ base: 12, md: 9 }}>
              {contentLoading && (
                <Center py={60}>
                  <Loader size="lg" />
                </Center>
              )}

              {!contentLoading && isComparing && fileContent && compareContent && selectedVersion && compareVersion && (
                <DiffViewer
                  oldContent={compareContent.content}
                  newContent={fileContent.content}
                  oldFilename={compareContent.filename}
                  newFilename={fileContent.filename}
                  oldVersion={compareVersion.version}
                  newVersion={selectedVersion.version}
                  onClose={() => {
                    setIsComparing(false);
                    setCompareVersionId(null);
                    setCompareContent(null);
                  }}
                />
              )}

              {!contentLoading && !isComparing && fileContent && (
                <FileContentViewer
                  content={fileContent.content}
                  filename={fileContent.filename}
                  size={fileContent.size}
                />
              )}

              {!contentLoading && !fileContent && (
                <Center py={60}>
                  <Text c="dimmed">No content available</Text>
                </Center>
              )}
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </AppLayout>
  );
}