<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>

    <el-row class="row-add">
      <el-col :span="24">
        <el-button>添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%">
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 当前角色中的权限列表 -->
          <!-- scope.row 角色对象 ---- roleName, roleDesc, children -->
          <!-- 一级权限 item1 -->
          <el-row
            class="level1"
            v-for="item1 in scope.row.children"
            :key="item1.id">
            <el-col :span="4">
              <!-- 显示一级权限 -->
              <el-tag @close="hanldeClose(scope.row, item1.id)" closable>{{ item1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级和三级权限 -->
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row
                v-for="item2 in item1.children"
                :key="item2.id">
                <el-col :span="4">
                  <!-- 显示二级权限 -->
                  <el-tag @close="hanldeClose(scope.row, item2.id)"  closable type="success">{{ item2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag
                    @close="hanldeClose(scope.row, item3.id)" 
                    class="level3"
                    closable
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id">
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 没有权限的时候显示 -->
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">未分配权限</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
          <el-button @click="handleShowRightsDialog(scope.row)" plain size="mini" type="success" icon="el-icon-check" ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限的对话框 -->
    <el-dialog
      @open="handleOpenDialog"
      title="分配权限"
      :visible.sync="dialogVisible">
      <!-- 树形结构
        data: 提供树形数据
        props: 设置数据中显示的属性
        node-key - 给每一个节点一个表示 ，一般绑定id
        当要使用default-expanded-keys和default-checked-keys必须先设置node-key
        default-checked-keys 设置默认选中的节点
       -->
      <el-tree
        ref="tree"
        v-loading="loadingTree"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        :default-checked-keys="checkedList"
        show-checkbox
        default-expand-all>
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>


<script>
export default {
  data() {
    return{
      list: [],
      loading: true,
      loadingTree: true,
      dialogVisible: false,
      treeData: [],
      defaultProps:{
        children: 'children',
        label: 'authName'
      },
      checkedList: [],
      currentRoleId: -1
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$http.get('roles')
        .then((res) => {
          const {data, meta: {status, msg}} = res.data;
          if (status == 200) {
            this.list = data;
            this.loading = false;
          } else {
            this.$message.error(msg);
          }
        })
    },
    hanldeClose(role, rightId) {
      this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        .then((res) => {
          const {data, meta: {status, msg}} = res.data;
          if (status == 200) {
            this.$message.success(msg);
            role.children = data;
          } else {
            this.$message.error(msg);
          }
        })
    },
    handleOpenDialog() {
      this.loadingTree = true;
      this.$http.get('rights/tree')
        .then((res) => {
          this.loadingTree = false;
          const {data} = res.data;
          this.treeData = data;
        })
    },
    handleShowRightsDialog(role) {
      this.currentRoleId = role.id;
      this.dialogVisible = true;
      const arr = [];
      role.children.forEach((item1) => {
        item1.children.forEach((item2) => {
          item2.children.forEach((item3) => {
            arr.push(item3.id);
          })
        })
      })
      this.checkedList = arr;
    },
    handleSetRights() {
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      const newArray = [...checkedKeys, ...halfCheckedKeys];
      this.$http.post(`roles/${this.currentRoleId}/rights`, {rids: newArray.join(',')})
        .then((res) => {
          console.log(res);
          
          const {meta: {status, msg}} = res.data;
          if(status == 200) {
            this.dialogVisible = false;
            this.$message.success(msg);
            this.loadData();
          } else {
            this.$message.error(msg);
          }
        }) 
    }
  }
}
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}
.level3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
.level1 {
  margin-bottom: 10px;
}
</style>
