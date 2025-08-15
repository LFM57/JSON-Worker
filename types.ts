export type JsonValue = string | number | boolean | null;

export interface JsonObject {
  [key: string]: JsonValue;
}

export type SortOrder = 'asc' | 'desc' | 'none';
