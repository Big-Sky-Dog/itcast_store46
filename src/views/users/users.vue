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
        <el-input class="searchInput" clearable placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain @click="userFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="userFormVisible">
      <el-form label-position="right" label-width="120px" :model="form">
        <el-form-item label="用户名">
          <el-input v-model="form.username"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="userAdd">确 定</el-button>
      </div>
    </el-dialog> 
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
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="delUser"></el-button>
          <!-- <el-button plain size="mini" type="danger" icon="el-icon-delete" :key="index" v-for="(item, index) in list" @click="delUser(item.id)"></el-button> -->
          <el-button plain size="mini" type="success" icon="el-icon-check" ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: true,
      userFormVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      const token = sessionStorage.getItem('token');
      this.$http.defaults.headers.common['Authorization'] = token;
      this.$http.get('users?pagenum=1&pagesize=10')
        .then((res) => {
          this.loading = true;
          const {meta: {msg, status}} = res.data;
          if (status == 200) {
            const {data: {users}} = res.data;
            this.list = users;
          } else {
            this.$message.error(msg);
          }
        })
        .then(() => {
          this.loading = false;
        })
    },
    Verifying() {
      const reg1 = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (!reg1.test(this.form.mobile)) {
        this.$message.error('手机号格式有误');
        return;
      }
      const reg2 = /([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/;
      if (!reg2.test(this.form.email)) {
        this.$message.error('邮箱格式有误');
        return;
      }
    },
    userAdd() {
      this.userFormVisible = false;
      this.$http.post('users', this.form)
        .then(() => {
          this.Verifying();
        })
        .then((res) => {
          console.log(res)
          if (res.status == 200) {
            this.$message.warning('添加成功');
            this.loadData();
          }
        })
    },
    delUser(id) {
      this.$http.delete(`users/${id}`)
        .then((res) => {
          if (res.status == 200) {
            this.$message.warning('删除成功');
            this.loadData()
          }
        })
      // console.log(this.list)
      // this.$confirm('确定.i要删除该用户么?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     // 
            
      //   })
      //   .then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功'
      //     });
      //   })
      //   .then(() => {
      //     this.loadData();
      //   })
    }
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
