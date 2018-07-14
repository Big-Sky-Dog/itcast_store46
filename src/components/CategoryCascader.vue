<template>
  <el-cascader
    expand-trigger="hover"
    :options="options"
    change-on-select
    :props="{
      label: 'cat_name',
      value: 'cat_id',
      children: 'children'
    }"
    @change="handleChange"
    v-model="selectedOptions">
  </el-cascader>
</template>

<!-- <CategoryCascader type="3"></CategoryCascader> -->
<script>

export default {
  // props: ['type'],
  // 建议以后定义 props 使用下面的方式更严谨
  // 参考文档：https://cn.vuejs.org/v2/guide/components-props.html#Prop-%E9%AA%8C%E8%AF%81
  props: {
    type: {
      type: [String, Number],
      default: 2
    }
  },
  async created () {
    // 获取商品分类数据绑定到级联选择器中
    const res = await this.$http({
      url: '/categories',
      params: {
        type: this.type
      }
    });
    this.options = res.data.data;
  },
  methods: {
    handleChange() {
      // console.log(this.selectedOptions);
      
      this.$emit('myevent', this.selectedOptions)
    }
  },
  data () {
    return {
      options: [],
      selectedOptions: []
    }
  },
}
</script>

<style>
</style>