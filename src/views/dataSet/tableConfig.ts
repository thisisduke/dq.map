

export const columns = [
  {
    title: "类型",
    dataIndex: "data_type",
    key: "data_type",
  },
  {
    title: "名称",
    dataIndex: "data_name",
    key: "data_name",
  },
  {
    title: "主题",
    dataIndex: "subject",
    key: "subject",
    slots: { customRender: 'subject' },
  },
  {
    title: "业务场景",
    key: "scene",
    dataIndex: "scene",
    slots: { customRender: 'scene' },
  },
  {
    title: "创建人",
    key: "creater",
    dataIndex: "creater",
  },
  {
    title: "创建时间",
    key: "created_at",
    dataIndex: "created_at",
  },
  {
    title: '操作',
    dataIndex: 'operation',
    slots: { customRender: 'operation' },
  },
];
