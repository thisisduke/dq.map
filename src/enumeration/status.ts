interface IService {
  text: string;
  value: string;
}

export const ServiceStatus: IService[] = [
  {
    text: "all",
    value: "",
  },
  {
    text: "待审核",
    value: "re-review",
  },
  {
    text: "已审核",
    value: "reviewed",
  },
  {
    text: "已完成",
    value: "complete",
  },
];
