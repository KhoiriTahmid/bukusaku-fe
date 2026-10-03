import { useState } from "react";
import {
  App,
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  Modal,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  useCreateRole,
  useDeleteRole,
  useRestoreRole,
  useRoles,
  useUpdateRole,
} from "@/features/roles/hooks";
import { PermissionMap, Role } from "@/features/roles/types";
import { ACTIONS, RESOURCES, perm } from "@/lib/permissions";
import { getErrorMessage } from "@/lib/errors";
import { CustomTable } from "@/components/CustomTable";
import { CustomHeaderSection } from "@/components/CustomHeader";
import BaseFilter, { IFilter } from "@/components/BaseFilter";

function PermissionMatrix({
  value = {},
  onChange,
}: {
  value?: PermissionMap;
  onChange?: (v: PermissionMap) => void;
}) {
  const full = !!value.FULL_ACCESS;

  const toggle = (key: string, checked: boolean) => {
    const next = { ...value };

    if (checked) {
      next[key] = true;
    } else {
      delete next[key];
    }

    onChange?.(next);
  };

  return (
    <div>
      <Checkbox
        checked={full}
        onChange={(e) => toggle("FULL_ACCESS", e.target.checked)}
      >
        <b>FULL_ACCESS</b> (bypasses every permission check)
      </Checkbox>

      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        rowKey="resource"
        dataSource={RESOURCES.map((resource) => ({
          resource,
        }))}
        columns={[
          {
            title: "Resource",
            dataIndex: "resource",
          },

          ...ACTIONS.map((a) => ({
            title: a,
            align: "center" as const,
            render: (
              _: unknown,
              r: {
                resource: (typeof RESOURCES)[number];
              },
            ) => (
              <Checkbox
                disabled={full}
                checked={full || !!value[perm(r.resource, a)]}
                onChange={(e) => toggle(perm(r.resource, a), e.target.checked)}
              />
            ),
          })),
        ]}
      />
    </div>
  );
}

export default function RolesPage() {
  const { message } = App.useApp();
  const { can } = useAuth();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [archived, setArchived] = useState(false);

  const { data, isLoading, isFetching } = useRoles({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    search: search || undefined,
    isDeleted: archived ? "true" : undefined,
  });

  const create = useCreateRole();
  const update = useUpdateRole();
  const remove = useDeleteRole();
  const restore = useRestoreRole();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();

    form.setFieldsValue({
      permissions: {},
    });

    setOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditing(role);

    form.resetFields();

    form.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions ?? {},
    });

    setOpen(true);
  };

  const onFinish = async (v: any) => {
    const dto = {
      name: v.name as string,
      description: v.description ?? "",
      permissions: (v.permissions ?? {}) as PermissionMap,
    };

    try {
      if (editing) {
        await update.mutateAsync({
          roleId: editing.roleId,
          ...dto,
        });
      } else {
        await create.mutateAsync(dto);
      }

      message.success("Saved");
      setOpen(false);
    } catch (e) {
      message.error(getErrorMessage(e, "Failed to save role"));
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

  const columns: ColumnsType<Role> = [
    {
      title: "NAME",
      dataIndex: "name",
      width: "22%",
      align: "left",
    },

    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: "43%",
      align: "left",
      render: (description) => description || "-",
    },

    {
      title: "PERMISSIONS",
      dataIndex: "permissions",
      width: "20%",
      align: "left",
      render: (permissions: PermissionMap | null) => {
        const keys = Object.keys(permissions ?? {}).filter(
          (key) => permissions![key],
        );

        if (permissions?.FULL_ACCESS) {
          return <Tag color="gold">FULL ACCESS</Tag>;
        }

        return <Tag>{keys.length} permissions</Tag>;
      },
    },

    {
      title: "ACTIONS",
      key: "actions",
      width: 100,
      align: "center",

      render: (_, record) => {
        const items = [
          !archived &&
            can("ROLES.UPDATE") && {
              key: "edit",
              label: "Edit",
            },

          !archived &&
            can("ROLES.DELETE") && {
              key: "delete",
              label: "Delete",
              danger: true,
            },

          archived &&
            can("ROLES.RESTORE") && {
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
                    title: "Archive this role?",
                    okText: "Archive",
                    okButtonProps: {
                      danger: true,
                    },
                    onOk: () => onDelete(record.roleId),
                  });
                }

                if (key === "restore") {
                  Modal.confirm({
                    title: "Restore this role?",
                    okText: "Restore",
                    onOk: () => onRestore(record.roleId),
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
        placeholder: "Search role...",
        allowClear: true,
        value: search,
        colSpan: 12,

        onChange: (value: string) => {
          setSearch(value);
          setPage(1);
        },
      },

      ...(can("ROLES.RESTORE")
        ? [
            {
              type: "select" as const,
              key: "status",
              label: "STATUS",
              placeholder: "All statuses",
              allowClear: false,
              value: archived ? "archived" : "active",
              colSpan: 6,

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
          title="Roles"
          subtitle="Manage roles and their permissions"
          rightAction={
            can("ROLES.CREATE") && (
              <Button type="primary" onClick={openCreate}>
                Add Role
              </Button>
            )
          }
        />
      </div>

      <BaseFilter filters={filters} />

      <CustomTable
        rowKey="roleId"
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
        title={editing ? "Edit role" : "Add role"}
        open={open}
        width={720}
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
                message: "Enter a name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="permissions" label="Permissions">
            <PermissionMatrix />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
