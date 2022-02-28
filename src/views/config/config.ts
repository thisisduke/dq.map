export interface IColumns {
  title: string;
  dataIndex: string;
  key?: string;
  slots?: Record<string, unknown>;
}

export const columnsAll: Array<IColumns> = [
  {
    title: "类型ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "类型名称",
    dataIndex: "cn_name",
    key: "cn_name",
  },
  {
    title: "英文名",
    dataIndex: "en_name",
    key: "en_name",
  },
  {
    title: "创建人员",
    key: "editor",
    dataIndex: "editor",
  },
  {
    title: "创建时间",
    key: "updated_at",
    dataIndex: "updated_at",
  },
  {
    title: "操 作",
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
];

export const columnsTheme: Array<IColumns> = [
  {
    title: "主题ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "主题名称",
    dataIndex: "cn_name",
    key: "cn_name",
  },
  {
    title: "英文名",
    dataIndex: "en_name",
    key: "en_name",
  },
  {
    title: "创建人员",
    key: "editor",
    dataIndex: "editor",
  },
  {
    title: "创建时间",
    key: "updated_at",
    dataIndex: "updated_at",
  },
  {
    title: "操 作",
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
];
export const columnsProcess: Array<IColumns> = [
  {
    title: "业务过程ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "业务过程名称",
    dataIndex: "cn_name",
    key: "cn_name",
  },
  {
    title: "英文名",
    dataIndex: "en_name",
    key: "en_name",
  },
  {
    title: "对应主题",
    dataIndex: "subject_id",
    key: "subject_id",
  },
  {
    title: "创建人员",
    key: "editor",
    dataIndex: "editor",
  },
  {
    title: "创建时间",
    key: "updated_at",
    dataIndex: "updated_at",
  },
  {
    title: "操 作",
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
];
export const columnsSenario: Array<IColumns> = [
  {
    title: "业务场景ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "业务场景名称",
    dataIndex: "cn_name",
    key: "cn_name",
  },
  {
    title: "英文名",
    dataIndex: "en_name",
    key: "en_name",
  },
  {
    title: "创建人员",
    key: "editor",
    dataIndex: "editor",
  },
  {
    title: "创建时间",
    key: "updated_at",
    dataIndex: "updated_at",
  },
  {
    title: "操 作",
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
];

export const formAll = [
  {
    label: "类型名称",
    value: "cn_name",
    type: "input",
    rules: {
      required: true,
      message: "请输入类型名称",
      trigger: "blur",
    },
  },
  {
    label: "英文名",
    value: "en_name",
    type: "input",
    rules: {
      required: true,
      message: "请输入英文名",
      trigger: "blur",
    },
  },
  // {
  //   label: "创建人员",
  //   value: "create",
  //   type: "input",
  //   rules: {
  //     required: true,
  //     message: "请输入创建人员",
  //     trigger: "blur",
  //   },
  // },
];

export const formTheme = [
  {
    label: "主题名称",
    value: "cn_name",
    type: "input",
    rules: {
      required: true,
      message: "请输入主题名称",
      trigger: "blur",
    },
  },
  {
    label: "英文名",
    value: "en_name",
    type: "input",
    rules: {
      required: true,
      message: "请输入英文名",
      trigger: "blur",
    },
  },
  // {
  //   label: "创建人员",
  //   value: "create",
  //   type: "input",
  //   rules: {
  //     required: true,
  //     message: "请输入创建人员",
  //     trigger: "blur",
  //   },
  // },
];

export const formProcess = [
  {
    label: "业务过程名称",
    value: "cn_name",
    type: "input",
    rules: {
      required: true,
      message: "请输入业务过程名称",
      trigger: "blur",
    },
  },
  {
    label: "对应主题",
    value: "subject_id",
    type: "select",
    selectList: [{ text: "yy", value: "8" }],
    rules: {
      required: true,
      message: "请输入对应主题",
      trigger: "blur",
    },
  },
  {
    label: "英文名",
    value: "en_name",
    type: "input",
    rules: {
      required: true,
      message: "请输入英文名",
      trigger: "blur",
    },
  },
  // {
  //   label: "创建人员",
  //   value: "create",
  //   type: "input",
  //   rules: {
  //     required: true,
  //     message: "请输入创建人员",
  //     trigger: "blur",
  //   },
  // },
];

export const formScenario = [
  {
    label: "业务场景名称",
    value: "cn_name",
    type: "input",
    rules: {
      required: true,
      message: "请输入业务场景名称",
      trigger: "blur",
    },
  },
  {
    label: "英文名",
    value: "en_name",
    type: "input",
    rules: {
      required: true,
      message: "请输入英文名",
      trigger: "blur",
    },
  },
  // {
  //   label: "创建人员",
  //   value: "create",
  //   type: "input",
  //   rules: {
  //     required: true,
  //     message: "请输入创建人员",
  //     trigger: "blur",
  //   },
  // },
];
