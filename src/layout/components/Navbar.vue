<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <div class="btn-fullscreen" @click="visitMsg">
        <el-badge :value="num" class="item" v-if="num > 0">
          <img src="@/assets/icon/tixing.png" />
        </el-badge>
        <img v-else src="@/assets/icon/tixing.png" />
      </div>
      <!-- <el-button
            type="text"
            class="icon-tixing"
            icon="el-icon-my-tixing"
            circle
          ></el-button> -->

      <!-- 全屏显示 -->
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip
          effect="dark"
          :content="fullscreen ? `取消全屏` : `全屏`"
          placement="bottom"
        >
          <img v-if="fullscreen" src="@/assets/icon/qxqp.png" alt="取消全屏" />
          <img v-else src="@/assets/icon/qp.png" alt="全屏" />
        </el-tooltip>
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登陆</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Hamburger from "@/components/Hamburger";
import Breadcrumb from "@/components/Breadcrumb";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getMsgCount, updataMsg } from "@/api/msg";
import store from "@/store";
import { isModPassword, updatePassword } from "@/api/user";
export default {
  components: {
    Hamburger,
    Breadcrumb,
  },
  data() {
    return {
      fullscreen: false,
      websock: null,
      loading: false,
      num: 0,
      query: {
        msgId: null,
        msgStatus: null, //消息状态（1未读2已读）
        pageNumber: "1",
        pageSize: "10",
        receiverId: null, //角色id
        sendWay: null, //发送方式1系统消息2短信
        isReceiver:true
      },
    };
  },
  destroyed() {
    // if(this.websock){
    //   	this.websock.close() // 关闭websocket
    //   }
  },
  mounted: function () {
    this.initWebSocket();
  },
  beforeDestroy: function () {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
    clearInterval(this.timer);
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", "roleIdStr", "count"]),
  },
  created() {
    this.getData();
    this.asswordType();
  },
  methods: {
    //获取消息
    getData() {
      const that = this;
      that.query.receiverId = that.roleIdStr;
      
      getMsgCount().then((res) => {
        if (res.code === 0) {
          // ...mapActions(["user",{"setMsgCount":res.data.unReadCount}])
          this.num = res.data.unReadCount;
          // this.$store.dispatch('user/setMsgCount', res.data.unReadCount);
          // this.count= res.data.unReadCount;
        }
      });
    },
    //判断用户是否需要修改密码
    asswordType() {
      const that = this;
      isModPassword().then((res) => {
        if (res.data) {
          that
            .$prompt("你的密码是初始密码，请重置", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
            })
            .then(({ value }) => {
              //更新用户密码
              const data = {
                userName: that.name,
                newPassword: value,
              };
              updatePassword(data)
              .then(rest=>{
                if(rest.code === 0 ){
                  that.$message({
                    type: "success",
                    message: "你的新密码是:"+value,
                  });
                }
              })
              
            })
            .catch(() => {});
        }
      });
    },
    //跳转个人信息
    visitMsg() {
      this.$router.push({
        path: "/messageList",
      });
    },
    //加载更多消息
    loadInfo() {
      this.loading = true;
      setTimeout(() => {
        this.count += 2;
        this.loading = false;
      }, 2000);
    },
    //websocket通信
    initWebSocket() {
      this.connection();
      let self = this;
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          self.stompClient.send("连接中");
        } catch (err) {
          console.log("断线了: " + err);
          self.connection();
        }
      }, 5000);
    },
    removeTab(targetName) {
      console.log(targetName);
    },
    connection() {
      // 建立连接对象
      this.socket = new SockJS("http://39.98.171.233:9004/hr-user/endpointOyzc"); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket);
      // 定义客户端的认证信息,按需求配置
      var headers = {
        login: "mylogin",
        passcode: "mypasscode",
        // additional header
        "client-id": "my-client-id",
      };
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        (frame) => {
          this.stompClient.subscribe(
            "/user/" + this.name + "/queue/getResponse",
            (msg) => {
              // 订阅服务端提供的某个topic
              const data = JSON.parse(msg.body);
              if (data.code == 201) {
                this.$store.dispatch("user/setUserStaus", true);
                this.$store.dispatch("user/logout");
                localStorage.removeItem("hd_hr_name");
                this.$router.push(`/login`);
              }
              //  console.log(data.body); // msg.body存放的是服务端发送给我们的信息
            }
          );
        },
        (err) => {
          // 连接发生错误时的处理函数
          console.log(err);
        }
      );
    },
    // 断开连接
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("已断开");
      }
    },

    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      localStorage.removeItem("hd_hr_name");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
  },
};
</script>

<style lang="scss" scoped>
.infinite-list-wrapper {
  height: 300px;
  width: 300xp;
  .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: #e8f3fe;
    color: #7dbcfc;
  }
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: linear-gradient(90deg, #42b983 10%, #65dfa3);
  // color: #ffffff;
  border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .item {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .btn-fullscreen {
    display: flex;
    align-items: center;
    padding-right: 20px;
    img {
      width: 28px;
      height: 28px;
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .icon-tixing {
    padding: 0;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
