export const columns = [
  {
    title: "字段名称",
    dataIndex: "column_name",
    slots: { customRender: "column_name" },
  },
  {
    title: "所属分类",
    dataIndex: "category_name",
    slots: { customRender: "category_name" },
  },
  {
    title: "口径描述",
    dataIndex: "caliber_desc",
    slots: { customRender: "caliber_desc" },
  },
  {
    title: "计算逻辑",
    dataIndex: "aggregate_mode",
    slots: { customRender: "aggregate_mode" },
  },
  {
    title: "示例值",
    dataIndex: "example_value",
    slots: { customRender: "example_value" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
];
