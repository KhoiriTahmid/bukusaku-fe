import { useState } from "react";
import dayjs from "dayjs";
import {
  App,
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "@/features/transactions/hooks";
import { Transaction, TransactionType } from "@/features/transactions/type";
import { CustomTable } from "@/components/CustomTable";
import { CustomHeaderSection } from "@/components/CustomHeader";
import {
  CATEGORIES_BY_TYPE,
  TRANSACTION_CATEGORIES,
  getCategory,
} from "@/features/transactions/constants";
import BaseFilter, { IFilter } from "@/components/BaseFilter";
import { rupiah } from "@/lib/format";

const TYPE_OPTIONS = [
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
];

export default function TransactionsPage() {
  const { message } = App.useApp();
  const { user, can } = useAuth();

  // pagination + filter (ini yang tadi belum ada)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [type, setType] = useState<TransactionType>();
  const [category, setCategory] = useState<string>();
  const [search, setSearch] = useState<string>();

  const { data, isLoading, isFetching } = useTransactions({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    userId: user?.userId,
    type,
    category,
    search,
  });

  const create = useCreateTransaction();
  const update = useUpdateTransaction();
  const remove = useDeleteTransaction();

  const [form] = Form.useForm();
  const formType = Form.useWatch("type", form) as TransactionType | undefined;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ type: "EXPENSE", transactionDate: dayjs() });
    setOpen(true);
  };

  const openEdit = (t: Transaction) => {
    setEditing(t);
    form.setFieldsValue({
      type: t.type,
      category: t.category,
      amount: Number(t.amount),
      description: t.description,
      transactionDate: dayjs(t.transactionDate),
    });
    setOpen(true);
  };

  const onFinish = async (v: any) => {
    const dto = {
      type: v.type as TransactionType,
      category: v.category as string,
      amount: v.amount as number,
      description: v.description ?? "",
      transactionDate: v.transactionDate.format("YYYY-MM-DD"),
    };
    try {
      if (editing) {
        await update.mutateAsync({
          transactionId: editing.transactionId,
          ...dto,
        });
      } else {
        await create.mutateAsync({ ...dto, userId: user!.userId });
      }
      message.success("Saved");
      setOpen(false);
    } catch {
      message.error("Failed to save transaction");
    }
  };

  const onDelete = (id: string) =>
    remove.mutate(id, {
      onSuccess: () => {
        message.success("Deleted");
        // kalau baris terakhir di halaman ini dihapus, mundur satu halaman
        if (data?.results.length === 1 && page > 1) setPage(page - 1);
      },
      onError: () => message.error("Failed to delete"),
    });

  const columns: ColumnsType<Transaction> = [
    {
      title: "DATE",
      dataIndex: "transactionDate",
      width: "15%",
      align: "left",
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: "12%",
      align: "left",
      render: (t) =>
        t === "INCOME" ? (
          <Tag color="green">Income</Tag>
        ) : (
          <Tag color="red">Expense</Tag>
        ),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: "18%",
      align: "left",
      render: (value: string) => {
        const c = getCategory(value);
        if (!c) return <Tag>{value}</Tag>; // data lama / kategori tak dikenal
        return (
          <Tag
            style={{
              color: c.color,
              borderColor: c.color,
              background: `${c.color}1A`, // warna yang sama, transparan 10%
            }}
          >
            {c.label}
          </Tag>
        );
      },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      render: (d) => d || "-",
    },
    {
      title: <div style={{ textAlign: "left" }}>AMOUNT</div>,
      dataIndex: "amount",
      width: 200,
      align: "right",
      render: rupiah,
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => {
        const items = [
          can("TRANSACTIONS.UPDATE") && {
            key: "edit",
            label: "Edit",
            onClick: () => openEdit(record),
          },
          can("TRANSACTIONS.DELETE") && {
            key: "delete",
            label: "Delete",
            danger: true,
            onclick: () => {},
          },
        ].filter(Boolean);

        return (
          <Dropdown
            menu={{
              items: items as any,
              onClick: ({ key }) => {
                if (key === "delete") {
                  Modal.confirm({
                    title: "Delete this transaction?",
                    okText: "Delete",
                    okButtonProps: { danger: true },
                    onOk: () => onDelete(record.transactionId),
                  });
                }
              },
            }}
            trigger={["click", "hover"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              style={{
                fontSize: 20,
                padding: 4,
              }}
            />
          </Dropdown>
        );
      },
    },
  ];

  const filters: IFilter[][] = [
    [
      {
        type: "search",
        key: "search",
        label: "SEARCH",
        placeholder: "Search transaction...",
        allowClear: true,
        value: search,
        colSpan: 12,
        onChange: (value: string) => {
          setSearch(value);
          setPage(1);
        },
      },
      {
        type: "select",
        key: "type",
        label: "TYPE",
        placeholder: "All types",
        allowClear: true,
        value: type,
        colSpan: 6,
        onChange: (v: TransactionType) => {
          setType(v);
          setPage(1);
        },
        options: TYPE_OPTIONS,
      },
      {
        type: "select",
        key: "category",
        label: "CATEGORY",
        placeholder: "All Categories",
        allowClear: true,
        value: category,
        colSpan: 6,
        onChange: (v: string) => {
          setCategory(v);
          setPage(1);
        },
        options: TRANSACTION_CATEGORIES.map((v) => ({
          value: v.value,
          label: v.label,
        })),
      },
    ],
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <CustomHeaderSection
          title="Transactions"
          subtitle="Manage your income and expense transactions"
          rightAction={
            can("TRANSACTIONS.CREATE") && (
              <Button type="primary" onClick={openCreate}>
                Add Transaction
              </Button>
            )
          }
        />
      </div>

      <BaseFilter filters={filters} />
      <CustomTable
        rowKey="transactionId"
        isLoading={isLoading || isFetching}
        columns={columns}
        data={data?.results ?? []}
        pagination={{
          page,
          perPage: pageSize,
          totalData: data?.total ?? 0,
        }}
        onChangePage={(newPage) => {
          setPage(newPage);
        }}
        onChangeLimit={(newPageSize) => {
          setPage(1);
          setPageSize(newPageSize);
        }}
        tableProps={{
          tableLayout: "fixed",
          scroll: { x: "100%" },
          sticky: {
            offsetHeader: 0,
          },
        }}
      />

      <Modal
        title={editing ? "Edit transaction" : "Add transaction"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={create.isPending || update.isPending}
        destroyOnHidden
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select
              options={TYPE_OPTIONS}
              onChange={() => form.setFieldValue("category", undefined)} // kategori lama tidak cocok lagi
            />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Select a category" }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select a category"
              options={CATEGORIES_BY_TYPE[formType ?? "EXPENSE"].map((c) => ({
                value: c.value,
                label: c.label,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              {
                required: true,
                type: "number",
                min: 1,
                message: "Enter an amount greater than 0",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} prefix="Rp" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="transactionDate"
            label="Date"
            rules={[{ required: true, message: "Pick a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
