import dashboard from "../pages/dashboard.vue";
import NotFoundView from "../components/404.vue";
import menuList from "../pages/sys/menu.vue";
import role from "../pages/sys/role.vue";
import dataRole from "../pages/sys/dataRole.vue";
import userGroup from "../pages/sys/userGroup.vue";
import resource from "../pages/sys/resource.vue";
import login from "../pages/login.vue";
import app from "../App.vue";
import sysUser from "../pages/sys/user.vue";
import userAdd from "../pages/sys/userAdd.vue";
import resetPwd from "../pages/resetPwd.vue";
// Routes
const routes = [
  {path: '/login', component: login},
  {
    path: '/test', component: app, children: [
    {path: '*', component: NotFoundView}
  ]
  },
  {
    path: '', component: app, children: [
    {path: '/', component: sysUser},
    {path: '/resetPwd', component: resetPwd},
    {path: '/index', component: sysUser},
    {path: '/sys/menuList', component: menuList},
    {path: '/sys/roleList', component: role},
    {path: '/sys/userGroup', component: userGroup},
    {path: '/sys/userList', component: sysUser},
    {path: '/sys/userAdd', component: userAdd},
    {path: '/sys/resource', component: resource},
    {path: '/sys/dataRole', component: dataRole}
  ]
  },
  {path: '*', component: NotFoundView}
]


export default routes

