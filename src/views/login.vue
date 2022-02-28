<template>

  <div class="body">
    <div class="conbox">
      <div class="logo">
        <!-- <img src="../assets/images/logo.png" alt /> -->
        <div>数据集管理平台</div>
      </div>
      <div class="smbox">
        <img src="https://shop-cdn.quplusplus.com/28/0e/280e6e7daebb94bf7b72812aa67e3cf9.png" alt />
        <div class="a-form-itembox">
          <div>
            <div class="title">扫码登录</div>
            <div id="login_container" style="transform: scale(.9);"></div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script></script>
<script lang="js">
import { reactive, nextTick, toRaw, } from "vue";
import { Router, useRoute, useRouter } from "vue-router";
import { getUserInfo } from '@/api/index'
import { notification } from 'ant-design-vue';
import { useStore } from '@/store';

export default {
  setup() {
    // 获取路由器实例
    const router = useRouter();
    // route是响应式对象,可监控器变化
    const route = useRoute();

    const store = useStore();

    //钉钉扫码流程：扫码成功登录后会自动跳到这个url页面，url路径会携带code，你拿到这个code，调用登录接口成功就跳转。
    //你的项目页面

    let base_url = process.env.NODE_ENV === 'development' ? 'http://测试环境地址/login' : 'https://正式环境地址/login'
    let url = encodeURIComponent(base_url) ;

    // appid 找后端要
    let appid = 'dingzdqxe95x8gro2l3l'

    // 钉钉自己的url 修改上面俩，不需要动这个
    let goto = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}`)

    nextTick(() => {
      let obj = DDLogin({
          id:"login_container",//这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
          goto: goto, //请参考注释里的方式
          style: "border:none;background-color:#ffffff;margin:0;padding:0",
          width : "365",//官方参数 365
          height: "400"//官方参数 400
      });
    })
    const ddLoginInit = ()=>{
      let handleMessage =  (event) =>{
        let origin = event.origin;
        if( origin == "https://login.dingtalk.com" ) { //判断是否来自ddLogin扫码事件。
          let loginTmpCode = event.data;
          //获取到loginTmpCode后就可以在这里构造跳转链接进行跳转了

          //此步拿到临时loginTmpCode换取正式code
          window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}&loginTmpCode=${loginTmpCode}`

        }
      };


      if (typeof window.addEventListener != 'undefined') {
          window.addEventListener('message', handleMessage, false);
      } else if (typeof window.attachEvent != 'undefined') {
          window.attachEvent('onmessage', handleMessage);
      }
    }


    const handleCodeLogin = (code)=>{
      getUserInfo(code).then(res=>{
        if(res.data.is_admin == '1'){
          localStorage.setItem("LOGIN_STATUS", JSON.stringify(code));
          localStorage.setItem("EMAIL", JSON.stringify(res.data.email));
          store.dispatch('setEmail', res.data.email)
          router.push('/dataSet/create')
        }else{
          notification['error']({
            message: `用户:${res.data.name}无后台权限`,
          });
          router.push("/login")
        }
      })

    }

    //code是登录所需最终参数
    const { code } = route.query
    if(code){ //登录接口
      handleCodeLogin(code)
    }else{ //钉钉二维码
      ddLoginInit()
    }

    
  },
};
</script>
<style scoped>
/* .body {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f3f5f4;
}

.conbox {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
.title{
  text-align: center;
}
.login-code{
  display: flex;
  justify-content: center;
  height: 400px;
  align-items: center;
}
.logo-line{
  height: 400px;
  width: 1px;
  background-color: #000;
}
.logo {
  font-size: 30px;
  color: #000;
  /* width: 60vw; */
  /* display: flex;
  align-items: center; */

.logo-img{
  width: 14vw;
  height: 14vw;
}
.body {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f3f5f4;
}

.conbox {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.logo {
  font-size: 30px;
  color: #000;
  width: 60vw;
  display: flex;
  align-items: center;
}
.logo img {
  height: 45px;
  margin-right: 10px;
}

.smbox {
  border-radius: 10px;
  width: 60vw;
  height: 60vh;
  background-color: #fff;
  margin: 40px 0px;
  /* box-shadow: 0px 0px 10px #000; */
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 20px 2px;
  /* background-image: url("../assets/loginbg.png"); */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
  overflow: hidden;
}

.smbox > img{
  width: 18vw;
  height: 18vw;
  margin:6vw;
}
.a-form-itembox {
  height: 100%;
  position: absolute;
  top: 0px;
  right: 0px;
  box-sizing: border-box;
  padding: 60px 30px;
  background-color: rgba(255, 255, 255, 1);
}
.title {
  /* width: 300px; */
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.inputbox {
  width: 300px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.inputsmbox {
  width: 300px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
}
.btn {
  width: 300px;
}
.foot {
  color: #000;
}
.copyright-a {
  text-decoration: none;
  color: #000;
}
.copyright-a:hover {
  color: #000;
}
.toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
.toggle-color {
  position: absolute;
  top: 20px;
  right: 120px;
  z-index: 1000;
}
.l-w {
  width: 300px;
}
</style>

