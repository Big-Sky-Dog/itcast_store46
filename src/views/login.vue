<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      label-position="top"
      label-width="80px"
      :model="formData">
      <h2 class="userlogin">用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input  @keyup.enter.native="handleLogin" type="password" v-model="formData.password"></el-input>
      </el-form-item>
      <el-button @click="handleLogin" class= "login-button" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    handleLogin() {
      this.$http.post('login', this.formData)
        .then((res) => {
          const {meta: {status, msg}} = res.data;
          if(status == 200) {
            const token = res.data.data.token;
            sessionStorage.setItem('token', token);
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
            return;
          }
        })
        .then(() => {
          this.$router.push({name: 'home'});
        })
    }
  }
}
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}
.login-button {
  width: 100%;
}
.userlogin {
  margin: 20px 0;
}
</style>
