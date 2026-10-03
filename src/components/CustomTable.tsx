import { Table, Pagination, Select, Typography } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styled from "styled-components";

type CustomPagination = {
  page: number;
  perPage: number;
  totalData: number;
};

type CustomTableProps<RecordType extends object> = {
  isLoading?: boolean;
  rowKey: string | ((record: RecordType) => string);
  columns: TableProps<RecordType>["columns"];
  data: RecordType[];

  pagination?: CustomPagination | false;

  onChangePage?: (page: number, pageSize: number) => void;
  onChangeLimit?: (limit: number) => void;

  onRowClick?: (record: RecordType) => void;

  tableProps?: Omit<
    TableProps<RecordType>,
    "columns" | "dataSource" | "loading" | "pagination" | "rowKey"
  >;
};

export function CustomTable<RecordType extends object>({
  isLoading,
  rowKey,
  columns,
  data,
  pagination,
  onChangePage,
  onChangeLimit,
  onRowClick,
  tableProps,
}: CustomTableProps<RecordType>) {
  return (
    <StyledTableWrapper>
      <Table<RecordType>
        rowKey={rowKey}
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
        onRow={
          onRowClick
            ? (record) => ({
                onClick: () => onRowClick(record),
              })
            : undefined
        }
        {...tableProps}
      />

      {pagination && data.length > 0 && (
        <CustomPagination
          pagination={pagination}
          onChangePage={onChangePage}
          onChangeLimit={onChangeLimit}
        />
      )}
    </StyledTableWrapper>
  );
}

type PaginationProps = {
  pagination: CustomPagination;
  onChangePage?: (page: number, pageSize: number) => void;
  onChangeLimit?: (limit: number) => void;
};

function CustomPagination({
  pagination,
  onChangePage,
  onChangeLimit,
}: PaginationProps) {
  const pageSizeOptions = [10, 20, 50, 100];

  return (
    <TableFooter>
      <DisplayWrapper>
        <Typography.Text>Display</Typography.Text>

        <PageSizeSelect
          value={pagination.perPage}
          onChange={(value) => {
            onChangeLimit?.(value);
          }}
          options={pageSizeOptions.map((size) => ({
            value: size,
            label: `${size} / page`,
          }))}
          suffixIcon={<DownOutlined />}
        />
      </DisplayWrapper>

      <StyledPagination
        current={pagination.page}
        pageSize={pagination.perPage}
        total={pagination.totalData}
        onChange={onChangePage}
        showSizeChanger={false}
      />
    </TableFooter>
  );
}

const StyledTableWrapper = styled.div`
  .ant-table {
    border-collapse: collapse !important;
  }

  .ant-table-thead > tr > th {
    border-right: none !important;
    border-bottom: none !important;

    box-shadow:
      inset -1px 0 0 #d9d9d9,
      inset 0 -1px 0 #d9d9d9 !important;
  }

  .ant-table-thead > tr:first-child > th:last-child {
    box-shadow: inset 0 -1px 0 #d9d9d9 !important;
  }

  .ant-table-tbody > tr > td {
    border-right: none !important;
  }

  .ant-table-tbody > tr.ant-table-row:hover > td {
    background-color: #fafafa;
  }
`;

const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 24px 16px;

  background: #fff;
`;

const DisplayWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageSizeSelect = styled(Select)`
  width: 111px;
`;

const StyledPagination = styled(Pagination)`
  margin-top: 0;

  .ant-pagination-options {
    display: none;
  }
`;
