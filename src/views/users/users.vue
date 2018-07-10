<template>
    <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input v-model="searchValue" class="searchInput" clearable placeholder="请输入内容">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain @click.prevent="AdduserFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="创建日期">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态">
        <template slot-scope="scope">
          <el-switch
            @change="handleSwitchChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="handleShowEditDialog(scope.row)"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          <!-- <el-button plain size="mini" type="danger" icon="el-icon-delete" :key="index" v-for="(item, index) in list" @click="delUser(item.id)"></el-button> -->
          <el-button plain size="mini" type="success" icon="el-icon-check" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- @size-change 每页多少条数据发生改变 触发的事件 -->
    <!-- @current-change 当前页码改变发生 -->
    <!-- current-page 当前页码 -->
    <!-- page-sizes 每页多少条数据的下拉框 -->
    <!-- page-size 每页显示多少条数据 -->

    <!-- total  总条数 -->
    <!-- layout 分页所支持的功能 -->
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    
        <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="AdduserFormVisible">
      <el-form label-position="right" label-width="120px" :model="form" ref="myform" :rules="formRules">
        <el-form-item label="用户名"  prop="username">
          <el-input v-model="form.username"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码"  prop="password">
          <el-input v-model="form.password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AdduserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="userAdd">确 定</el-button>
      </div>
    </el-dialog> 

    <!-- 修改用户的弹出框 -->
    <el-dialog @closed="handleClosed" title="编辑用户" :visible.sync="editUserDialogVisible">
      <el-form
        ref="myform"
        :rules="formRules"
        label-width="100px"
        :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>


  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: true,
      AdduserFormVisible: false,
      searchValue: '',
      pagenum: 1,
      pagesize: 8,
      total: 0,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
     formRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
     },
     editUserDialogVisible: false,
    }
  },
  created() {
    this.loadData();
  },
  mounted (){
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    loadData() {
      this.loading = true;
      const token = sessionStorage.getItem('token');
      this.$http.defaults.headers.common['Authorization'] = token;
      this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`)
        .then((res) => {
          this.loading = true;
          const {meta: {msg, status}} = res.data;
          if (status == 200) {
            const {data: {users, total}} = res.data;
            this.list = users;
            this.total = total;
          } else {
            this.$message.error(msg);
          }
        })
        .then(() => {
          this.loading = false;
        })
    },
    handleSearch() {
      this.loadData();
    },
    handleSwitchChange(user) {
      this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        .then((res) => {
          const { meta: { status, msg } } =res.data;
          if (status == 200) {
            this.$message.success(msg)
          } else {
            this.$message.success(msg)
          }
        })
    },
    userAdd() {
      this.$http.post('users', this.form)
        .then((res) => {
            if (res.status == 200) {
              this.$message.success('添加成功');
              this.AdduserFormVisible = false;
              for (let key in this.form) {
                this.form[key] = '';
              };
              this.loadData();
            } else {
              this.$message.error('添加失败');
              this.AdduserFormVisible = true;
            }
        })
    },
    async delUser(id) {
      this.$confirm('确定要删除该用户么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${id}`);
          console.log(res);
          const {meta: {status, msg}} = res.data;
          if (status == 200) {
            this.pagenum = 1;
            this.loadData();
          }
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        })
        .then(() => {
          this.loadData();
        })
    },
    async handleEdit() {
      // console.log(this.form);
      const res = await this.$http.put(`users/${this.form.id}`, {
        mobile: this.form.mobile,
        email: this.form.email
      });
      const data = res.data;
      const { meta: { status, msg } } = data;
      if (status === 200) {
        this.$message.success(msg);
        this.editUserDialogVisible = false;
        this.loadData();
      } else {
        this.$message.error(msg);
      }
    },
    handleClosed() {
      for (let key in this.form) {
        this.form[key] = '';
      }
    },
     handleShowEditDialog(user) {
      // 显示对话框
      this.editUserDialogVisible = true;
      // 文本框显示用户信息
      this.form.username = user.username;
      this.form.email = user.email;
      this.form.mobile = user.mobile;
      this.form.id = user.id;
    },

  }
}
</script>

<style>
  .box-card {
    height: 100%;
  }
  .searchArea {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .searchArea .searchInput {
    width: 350px;
  }
</style>
