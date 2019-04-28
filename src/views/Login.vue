<template>
  <div class='login-wrap'>
    <div class='ms-login'>
    <h1 class="ms-title">{{loginTitle}}</h1>
    <el-form ref='AccountForm' :model="account" :rules="rules" label-width="0px" class="ms-content">
      <el-form-item  prop='username'>
        <el-input type='text' v-model="account.username" placeholder="请输入用户名">
          <el-button slot="prepend" icon="el-icon-news"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item  prop='password'>
        <el-input type='password' v-model="account.password" placeholder="请输入密码" @keyup.enter.native='handleLogin'>
          <el-button slot="prepend" icon="el-icon-sold-out"></el-button>
        </el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12" :offset="2">
          <el-form-item>
            <el-button  type="primary" style="width: 100%" @click.native.prevent="handleLogin" :loading='logining'>登录</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2" :offset="2">
          <el-form-item>
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
  </div>
</template>


<script>
export default {
  name: "Login",
  data: function() {
    return {
      loginTitle: "欢迎登录",
      logining: false,
      account: { 
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: 'blur' }],
        password: [{ required: true, message: "请输入密码", trigger:'blur' }]
      },
      checked: true
    };
  },
  methods: {
    handleLogin() {
      this.$refs.AccountForm.validate( (valid) => {
        if(valid) {
          this.logining = true;
          var loginParams = { username: this.account.username, password: this.account.password};
          this.$axios.post('/user/login', loginParams).then( res => {
            this.logining = false;
            let { msg, code, token } = res.data;
            if( code == '200'){
              sessionStorage.setItem('access-token', token);
              localStorage.setItem('sca_username', loginParams.username);
              this.$router.push({ path: '/Home'});
            }else{
              this.$message({
                showClose: true,
                message: msg,
                type: 'error'
              });
            }
          })
        }else{
          this.$message({
                showClose: true,
                message: '表单验证失败',
                type: 'error'
          });
          return false;
        }
      } )
    }
  }
};
</script>

<style>
.fontTitle {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
}
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #2c3e50;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
    
</style>
