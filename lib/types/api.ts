// API Response Types matching Django schemas

export interface Game {
  id: string;
  name: string;
  slug: string;
  created: string;
  modified: string;
}

export interface GameConfigFileVersion {
  id: string;
  version: number;
  config_file: string;
  notes: string;
  created: string;
  modified: string;
  deleted: string | null;
}

export interface GameConfig {
  id: string;
  name: string;
  game: Game;
  active_version: GameConfigFileVersion | null;
  created: string;
  modified: string;
  deleted: string | null;
}

// Pagination Response (Django Ninja LimitOffsetPagination)
export interface PaginatedResponse<T> {
  items: T[];
  count: number;
}

// API Request Types
export interface GetConfigsParams {
  limit?: number;
  offset?: number;
  game?: string; // game slug for filtering (if backend adds support)
  search?: string; // search by name (if backend adds support)
}