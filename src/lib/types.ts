import { Prisma } from '@prisma/client';

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TaskWithCategory = Prisma.TaskGetPayload<{
  include: {
    category: {
      select: {
        id: true;
      };
    };
  };
}>;
