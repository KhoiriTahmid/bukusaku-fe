export interface ActionResponse {
  isSuccess: boolean;
  message: string;
}

export interface Paginated<T> {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  results: T[];
}
