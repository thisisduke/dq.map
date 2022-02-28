<template>
  <a-form
    ref="formRef"
    :rules="formRules"
    :model="formState"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item
      v-for="(item, index) in form"
      :key="index"
      :label="item.label"
      :name="item.value"
    >
      <a-input
        v-if="item.type === 'input'"
        v-model:value="formState[item.value]"
      />
      <a-select
        v-else-if="item.type === 'select'"
        v-model:value="formState[item.value]"
        :placeholder="item.placeholder"
      >
        <a-select-option
          v-for="(select, i) in item.selectList"
          :key="i"
          :value="select.value"
          >{{ select.text }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item
      :wrapper-col="{ span: 17, offset: 4 }"
      style="text-align: right"
    >
      <a-button type="primary" @click="handleSubmit">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  UnwrapRef,
  reactive,
  toRaw,
  ref,
} from "vue";
export interface FormItem {
  label: string;
  value: string;
  type: string;
  placeholder?: string;
  rules?: Array<Record<string, unknown>> | Record<string, unknown>;
  selectList?: Array<{
    text: string;
    value: string | number;
  }>;
}
export default defineComponent({
  props: {
    form: Array as PropType<Array<FormItem>>,
    formData: Object as PropType<Record<string, unknown>>,
    onSubmit: Function as PropType<(params: unknown) => void>,
    reset: Boolean,
  },
  setup(props, { emit }) {
    const formRef = ref();
    const formFiled: Record<string, unknown> = {};
    const formRules: Record<string, unknown> = {};
    if (Array.isArray(props.form)) {
      props.form.forEach((item) => {
        formFiled[item.value] = props.formData
          ? props.formData[item.value]
          : "";
        if (item.rules) {
          formRules[item.value] = Array.isArray(item.rules)
            ? item.rules
            : [{ ...item.rules }];
        }
      });
    }
    const formState: UnwrapRef<Record<string, unknown>> = reactive(formFiled);
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          emit("onSubmit", toRaw(formState));
        })
        .catch((error: unknown) => {
          console.log("error", error);
        });
    };
    console.log("isEditOrAdd", props.reset);
    // if (props.reset) {
    // formRef.value.resetFields();
    // }
    return {
      formRef,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      formState,
      formRules,
      handleSubmit,
    };
  },
});
</script>
