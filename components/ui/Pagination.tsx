import { Group, Pagination as MantinePagination, Select } from '@mantine/core';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}: PaginationProps) {
  return (
    <Group justify="space-between" mt="xl">
      <Select
        value={String(itemsPerPage)}
        onChange={(value) => onItemsPerPageChange(Number(value))}
        data={[
          { value: '10', label: '10 per page' },
          { value: '20', label: '20 per page' },
          { value: '50', label: '50 per page' },
        ]}
        w={150}
      />
      <MantinePagination
        value={currentPage}
        onChange={onPageChange}
        total={totalPages}
        siblings={1}
        boundaries={1}
      />
    </Group>
  );
}