<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>

    <!-- 表格 -->
    <el-table
      class="tb"
      border
      stripe
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
    data() {
    return {
      list: []
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // const token = sessionStorage.getItem('token');
      // this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.get('rights/list');
      const data = res.data;
      this.list = data.data;
    }
  }
}
</script>

<style>
  .tb {
    margin-top: 10px;
  }
</style>
