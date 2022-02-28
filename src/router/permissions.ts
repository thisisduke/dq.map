import router from './index'

// 路由拦截器
router.beforeEach((to, from, next) => {

    //判断是否存在code
    if (localStorage.getItem("LOGIN_STATUS") && localStorage.getItem("EMAIL")) {

      if (to.path == '/login' || to.path == '/') {
          next({
              path: '/dataSet/create',
          })
      } else {
          next();
      }


    } else {
      if (to.matched.length != 0 && !to.meta.requireAuth) {
        next()
      } else {
          next({
              path: '/login'
          })
      }
    }
})


