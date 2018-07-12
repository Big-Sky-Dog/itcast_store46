<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="/static/logo.png" class="logo" alt="">
        </el-col>
        <el-col :span="16" class="middle">
          <h2>后台管理系统</h2>
        </el-col>
        <el-col :span="4">
          <a href="#" class="logout" @click.prevent="logOut">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="container">
      <el-aside class="aside" width="200px">
        <el-menu
          :router="true"
          :unique-opened="true"
          class="menu">
          <el-submenu 
            v-for="item in menus"
            :key="item.id"
            :index="item.id + ''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item 
              v-for="item1 in item.children"
              :key="item1.id"
              :index="'/' + item1.path">
              <i class="el-icon-menu"></i>
              {{item1.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return{
      menus: []
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$http.get('menus')
        .then((res) => {
          const {data, meta: {status, msg}} = res.data;
          if(status == 200) {
            this.menus = data;
          } else {
            this.$message.error(msg);
          }
        })
    },
    logOut() {
      this.$confirm('确定要退出登录么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功'
          });
        })
        .then(() => {
          sessionStorage.clear();
          this.$router.push({name: 'login'});
        })
    }
  }
}
</script>

<style>
  .container {
    height: 100%;
  }
  .header {
    background-color: #b3c0d1;
    padding: 0;
  }
  .header .middle {
    line-height: 60px;
    color: #fff;
    text-align: center;
  }
  .header .logout {
    line-height: 60px;
    color: black;
    text-align: center;
    float: right;
    margin-right: 50px;
    text-decoration: none;
  }
  .aside {
    background-color: #fff;
  }
  .main {
    background-color: #e9eef3;
    height: 100%;
  }
</style>
