// API functions for games and configs

import { apiClient } from './client';
import type {
  Game,
  GameConfig,
  GameConfigFileContent,
  GameConfigFileVersion,
  GetConfigsParams,
  PaginatedResponse,
} from '../types/api';

export const gamesApi = {
  // Get all games
  getGames: () => apiClient.get<Game[]>('/games/'),

  // Get game by slug
  getGameBySlug: (slug: string) => apiClient.get<Game>(`/games/${slug}/`),

  // Get game by ID
  getGameById: (id: string) => apiClient.get<Game>(`/games/${id}/`),

  // Get all configs with pagination
  getConfigs: (params?: GetConfigsParams) =>
    apiClient.get<PaginatedResponse<GameConfig>>('/games/config', params),

  // Get single config by ID
  getConfigById: (configId: string) =>
    apiClient.get<GameConfig>(`/games/config/${configId}/`),

  // Get all versions for a config
  getConfigVersions: (configId: string) =>
    apiClient.get<GameConfigFileVersion[]>(`/games/config/${configId}/versions`),

  // Get file content for a specific version
  getVersionContent: (versionId: string) =>
    apiClient.get<GameConfigFileContent>(`/games/config/version/${versionId}/content`),
};