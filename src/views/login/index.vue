<template>
  <div class="login-main">
    <div class="red" v-if="userStaus">
      <span>{{ msg }}</span>
    </div>
    <p class="title-header">医健投EHR系统</p>
    <div class="login-form">
      <div class="login-img">
        <img src="../../assets/img/bg.png">
      </div>
      <div class="login-content">
        <span class="login-title">账号密码登录</span>
        <div class="form-box">
          <el-form ref="loginForm" :model="loginForm">
          <el-form-item prop="username" label="账号">
              <el-input
                ref="username"
                v-model="loginForm.userName"
                placeholder="Username"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
             <el-form-item prop="password" label="密码" class="password-form">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              >
              </el-input>
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              class="submit"
              @click.native.prevent="handleLogin"
              >登陆</el-button
            >
        </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        userName: "admin",
        password: "hr2020",
        grantType: "password",
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      //用户是否异地登陆
      userStaus: false,
      msg: null,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  mounted() {
    this.userStaus = this.$store.state.user.staus;
    this.msg = this.$store.state.user.errMsg || "您已在别处登录，请重新登录";
  },

  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.loading = true;
      this.$store
        .dispatch("user/login", this.loginForm)
        .then(() => {
          this.$router.push({ path: this.redirect || "/" });
          this.$router.go(0);
          this.loading = false;
          localStorage.setItem("userStaus", false);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  #bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  #bg canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      text-align: center;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>


<style lang="scss" scoped>
.red {
  background: red;
  width: 100%;
  text-align: center;
  line-height: 30px;
  color: #fff;
  font-weight: bold;
}
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-form .el-input input {
    color: $cursor;
  }
}
.title-header {
  color: #009688;
  font-size: 24px;
  letter-spacing: 3px;
  font-style: "庞门正道标题体";
  font-weight: bold;
  margin: 0;
  padding: 44px 88px;
  background: #fff;
}
.login-main {
  background-color: #e8eef5;
  background-image: linear-gradient(to bottom left,#8debff, #C6E3D3);
  // height: 100%;
  .login-form {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 0 ;
    .login-img{
      width: 608px;
      height: 524px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .login-content {
      width: 498px;
      height: 524px;
      background: #fff;
      // background: rgba(160,136,136,.1);
      border-radius: 10px;
    }
    .login-title{
      display: block;
      font-size: 24px;
      width: 144px;
      height: 33px;
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #001529;
      line-height: 33px;
      padding: 69px 0 0 93px;
      
    }
    .el-form {
      z-index: 999;
      width: 100%;
    }
    .title {
      color: #fff;
      font-size: 22px;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: capitalize;
      margin-bottom: 1em;
      text-align: center;
      // background: #fff;
    }
    .form-box{
      padding: 25px 90px;
      .el-input__inner{
        height: 45px;
        line-height: 45px;
        background: #FFFFFF;
        border-radius: 6px;
        border: 1px solid #D9D9D9;
        outline-color:#D9D9D9;
        &:focus,&:active{
          
        border: 1px solid #D9D9D9;
        }
      }
      // .el-input__inner:focus{
      //   border:1px solid #D9D9D9;
      // }
    }
    .submit{
      width: 100%;
      height: 45px;
      background: #419EFF;
      border-radius: 4px;
      opacity: 0.5;
    }
    .password-form{
      position: relative;
      .show-pwd{
        position: absolute;
        bottom: 0;
        right: 11px;
        cursor: pointer;
      }
    }
  }
}

#bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
#bg canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
.login-main {
  .login-form {
    .form-box{
      padding: 25px 90px;
      .el-input__inner{
        background: #fff;
        &:focus,&:active{
          
        border: 1px solid #BFC1C6;
        }
      }
    }
  }
}
</style>
