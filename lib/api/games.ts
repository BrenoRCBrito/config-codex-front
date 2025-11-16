// API functions for games and configs

import { apiClient } from './client';
import type { Game, GameConfig, GetConfigsParams, PaginatedResponse } from '../types/api';

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
};