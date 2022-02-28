/* eslint-disable */
declare module "@ant-design/icons-vue";
declare module "codemirror";
declare module "lodash-es";
declare module "./util/reauest";
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
