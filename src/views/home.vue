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
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/roles">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="/rights">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-menu"></i>
              数据报表
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
  beforeCreate() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.$router.push({name: 'login'});
      this.$message.warning('请先登录');
    }
  },
  methods: {
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
