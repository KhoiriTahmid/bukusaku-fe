import { useState } from "react";
import { App, Button, Dropdown, Form, Input, Modal, Select, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  useCreateUser,
  useDeleteUser,
  useRestoreUser,
  useUpdateUser,
  useUsers,
} from "@/features/users/hooks";
import { useRoles } from "@/features/roles/hooks";
import { UserRecord } from "@/features/users/types";
import { getErrorMessage } from "@/lib/errors";
import { CustomTable } from "@/components/CustomTable";
import { CustomHeaderSection } from "@/components/CustomHeader";
import BaseFilter, { IFilter } from "@/components/BaseFilter";

export default function UsersPage() {
  const { message } = App.useApp();
  const { can } = useAuth();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState<string>();
  const [archived, setArchived] = useState(false);

  const { data, isLoading, isFetching } = useUsers({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    search: search || undefined,
    roleId,
    isDeleted: archived ? "true" : undefined,
  });

  // The role dropdown needs ROLES.LIST.
  // Max limit allowed by BE is 100.
  const { data: rolesData } = useRoles({ limit: 100 }, can("ROLES.LIST"));

  const roleOptions =
    rolesData?.results.map((r: any) => ({
      value: r.roleId,
      label: r.name,
    })) ?? [];

  const create = useCreateUser();
  const update = useUpdateUser();
  const remove = useDeleteUser();
  const restore = useRestoreUser();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (u: UserRecord) => {
    setEditing(u);
    form.resetFields();

    form.setFieldsValue({
      name: u.name,
      email: u.email,
      roleId: u.roleId,
    });

    setOpen(true);
  };

  const onFinish = async (v: any) => {
    const dto = {
      name: v.name,
      email: v.email,
      roleId: v.roleId,
    } as any;

    if (v.password) {
      dto.password = v.password;
    }

    try {
      if (editing) {
        await update.mutateAsync({
          userId: editing.userId,
          ...dto,
        });
      } else {
        await create.mutateAsync(dto);
      }

      message.success("Saved");
      setOpen(false);
    } catch (e) {
      message.error(getErrorMessage(e, "Failed to save user"));
    }
  };

  const onDelete = (id: string) =>
    remove.mutate(id, {
      onSuccess: () => {
        message.success("Archived");

        if (data?.results.length === 1 && page > 1) {
          setPage(page - 1);
        }
      },
      onError: (e) => message.error(getErrorMessage(e, "Failed to delete")),
    });

  const onRestore = (id: string) =>
    restore.mutate(id, {
      onSuccess: () => {
        message.success("Restored");

        if (data?.results.length === 1 && page > 1) {
          setPage(page - 1);
        }
      },
      onError: (e) => message.error(getErrorMessage(e, "Failed to restore")),
    });

  const columns: ColumnsType<UserRecord> = [
    {
      title: "NAME",
      dataIndex: "name",
      width: "25%",
      align: "left",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      width: "30%",
      align: "left",
    },
    {
      title: "ROLE",
      key: "role",
      width: "20%",
      align: "left",
      render: (_, record) =>
        record.role ? <Tag>{record.role.name}</Tag> : "-",
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => {
        const items = [
          !archived &&
            can("USERS.UPDATE") && {
              key: "edit",
              label: "Edit",
            },

          !archived &&
            can("USERS.DELETE") && {
              key: "delete",
              label: "Delete",
              danger: true,
            },

          archived &&
            can("USERS.RESTORE") && {
              key: "restore",
              label: "Restore",
            },
        ].filter(Boolean);

        if (!items.length) {
          return null;
        }

        return (
          <Dropdown
            menu={{
              items: items as any,
              onClick: ({ key }) => {
                if (key === "edit") {
                  openEdit(record);
                }

                if (key === "delete") {
                  Modal.confirm({
                    title: "Archive this user?",
                    okText: "Archive",
                    okButtonProps: {
                      danger: true,
                    },
                    onOk: () => onDelete(record.userId),
                  });
                }

                if (key === "restore") {
                  Modal.confirm({
                    title: "Restore this user?",
                    okText: "Restore",
                    onOk: () => onRestore(record.userId),
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
        placeholder: "Search name or email...",
        allowClear: true,
        value: search,
        colSpan: can("ROLES.LIST") && can("USERS.RESTORE") ? 10 : 12,
        onChange: (value: string) => {
          setSearch(value);
          setPage(1);
        },
      },

      ...(can("ROLES.LIST")
        ? [
            {
              type: "select" as const,
              key: "role",
              label: "ROLE",
              placeholder: "All roles",
              allowClear: true,
              value: roleId,
              colSpan: can("USERS.RESTORE") ? 6 : 12,
              onChange: (value: string) => {
                setRoleId(value);
                setPage(1);
              },
              options: roleOptions,
            },
          ]
        : []),

      ...(can("USERS.RESTORE")
        ? [
            {
              type: "select" as const,
              key: "status",
              label: "STATUS",
              placeholder: "All statuses",
              allowClear: false,
              value: archived ? "archived" : "active",
              colSpan: can("ROLES.LIST") ? 8 : 12,
              onChange: (value: string) => {
                setArchived(value === "archived");
                setPage(1);
              },
              options: [
                {
                  value: "active",
                  label: "Active",
                },
                {
                  value: "archived",
                  label: "Archived",
                },
              ],
            },
          ]
        : []),
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
          title="Users"
          subtitle="Manage system users and their roles"
          rightAction={
            can("USERS.CREATE") && (
              <Button type="primary" onClick={openCreate}>
                Add User
              </Button>
            )
          }
        />
      </div>

      <BaseFilter filters={filters} />

      <CustomTable
        rowKey="userId"
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
          scroll: {
            x: "100%",
          },
          sticky: {
            offsetHeader: 0,
          },
        }}
      />

      <Modal
        title={editing ? "Edit user" : "Add user"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={create.isPending || update.isPending}
        destroyOnHidden
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                max: 100,
                message: "Enter a name (max 100 characters)",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                max: 100,
                message: "Enter a valid email",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Role"
            rules={[
              {
                required: true,
                message: "Select a role",
              },
            ]}
          >
            <Select options={roleOptions} placeholder="Select a role" />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              editing
                ? "New password (leave empty to keep current)"
                : "Password"
            }
            rules={[
              {
                required: !editing,
                message: "Enter a password",
              },
              {
                min: 8,
                max: 72,
                message: "8 to 72 characters",
              },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
