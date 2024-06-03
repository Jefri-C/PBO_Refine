import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, useInvalidate } from "@refinedev/core";
import { Space, Table } from "antd";

interface ICategory {
  id: number;
  name: string;
}

const CATEGORY_DELETE_URL = "category/delete";

export const CategoryList = () => {
  const { tableProps } = useTable<ICategory>({
    syncWithLocation: false,
  });

  const invalidate = useInvalidate();

  // Access the data property of rawData
  const rawData = tableProps.dataSource || { data: [] };
  const data = rawData.data.map((item, index) => ({
    ...item,
    autoIncrementId: index + 1,
  }));

  return (
    <List>
      <Table {...tableProps} dataSource={data} rowKey="id">
        <Table.Column
          title={"No."}
          render={(_, __, index) => index + 1}
        />
        <Table.Column dataIndex="name" title={"Name"} />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                resource={CATEGORY_DELETE_URL}
                onSuccess={() => {
                  invalidate({
                    resource: "category",
                    invalidates: ["list", "many"], // Specify the invalidation scopes
                  });
                }}
                successNotification={(data, id, resource) => {
                  return {
                    message: `Successfully deleted category`,
                    description: "Success",
                    type: "success",
                  };
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};