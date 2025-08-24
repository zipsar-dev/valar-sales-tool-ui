import React from 'react';
import Button from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setPagination: (pagination: { page: number; limit: number; total: number; totalPages: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, setPagination }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm text-neutral-500 dark:text-neutral-400 w-full">
      <div className="truncate">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
        {pagination.total} leads
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <Button
          variant="outline"
          onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
          disabled={pagination.page === 1}
          className="p-1 sm:p-2"
        >
          <ChevronLeft className="w-3 sm:w-4 h-3 sm:h-4" />
        </Button>

        <span className="truncate">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <Button
          variant="outline"
          onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          disabled={pagination.page === pagination.totalPages}
          className="p-1 sm:p-2"
        >
          <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;