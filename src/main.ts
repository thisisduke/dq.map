import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store,{key} from "./store";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import axios from "axios";
import './util/axios'


import 'codemirror/lib/codemirror.css'


import './router/permissions'

const app = createApp(App);
app.config.globalProperties.$axios = axios;

app.use(Antd).use(router).use(store,key).mount("#app");
