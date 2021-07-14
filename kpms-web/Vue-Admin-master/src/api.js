// export const CONTEXT = './api';
//import axios from './common/axios';
import '../static/css/main.css' /*引入公共样式*/

/*axios.get("http://192.168.5.34:33910/kd-config-server/develop-v1.1.x/kts-web-dev.json", {}).then(data => {
  if(data.data && data.data.url){
  	window.configURL = data.data.url;
  }
}, err => {
  console.error('配置文件请求失败');
})*/
window.version = 'v1.0.2';
export const CONTEXT = './Vue-Admin';
export const KPMS = window.kpms || 'http://192.168.5.34:33410/kpms/';

//当前用户相关
export const LOGIN = KPMS + 'v2/login';				//用户登录
export const LOGOUT = CONTEXT + '/logout';
export const CHANGE_PWD = KPMS + 'v2/user/modifyPwd';

//菜单相关
export const SYS_MENU_TREE = KPMS + 'v2/menu/findTree';			//菜单树
export const SYS_MENU_GET = KPMS + '/v2/role/get';
export const SYS_MENU_UPSERT = KPMS + 'v2/menu/upsert';			//创建与更新
export const SYS_MENU_DELETE = KPMS + 'v2/menu/delete';			//删除菜单
export const SYS_MENU_ADD = CONTEXT + '/sys/menu/add';
export const SYS_MENU_PAGE = CONTEXT + '/sys/menu/page';
export const SYS_MENU_LIST = CONTEXT + '/sys/menu/list';

//角色相关
export const SYS_ROLE_DELETE = KPMS + 'v2/role/delete';			//删除角色
export const SYS_ROLE_ADD = KPMS + 'v2/role/upsert';			//保存角色
export const SYS_ROLE_PAGE = KPMS + 'v2/role/query';
export const SYS_ROLE_ASSIGN = KPMS + 'v2/role/assign';			//分配用户的角色

export const SYS_RESOURCE_GET = CONTEXT + '/sys/resource/get';
export const SYS_RESOURCE_UPDATE = CONTEXT + '/sys/resource/update';
export const SYS_RESOURCE_DELETE = CONTEXT + '/sys/resource/delete';
export const SYS_RESOURCE_ADD = CONTEXT + '/sys/resource/add';
export const SYS_RESOURCE_PAGE = CONTEXT + '/sys/resource/page';
export const SYS_RESOURCE_LIST = CONTEXT + '/sys/resource/list';
export const SYS_RESOURCE_LIST2 = CONTEXT + '/sys/resource/list2';

//用户相关
export const SYS_USER_GET = KPMS + 'v2/user/get';
export const SYS_USER_ADD = KPMS + 'v2/user/upsert';
export const SYS_USER_DELETE = KPMS + 'v2/user/delete';			//删除一个用户
export const SYS_USER_PAGE = KPMS + 'v2/user/query';			//查询获取所有用户列表

//数据权限相关
export const SYS_PERMISSION_LIST = KPMS + 'v2/permission/findAllForPage';			//查询获取所有数据权限列表
export const SYS_PERMISSION_ADD = KPMS + 'v2/permission/add';						//新增数据权限
export const SYS_PERMISSION_UPDATE = KPMS + 'v2/permission/update';				//修改数据权限
export const SYS_PERMISSION_DELETE = KPMS + 'v2/permission/delete';			//删除数据权限

//数据权限组相关
export const SYS_GROUP_LIST = KPMS + 'v2/bizGroup/findAll';									//查询获取所有数据权限组列表
export const SYS_GROUP_LIST_PAGE = KPMS + 'v2/bizGroup/findAllForPage';					//查询获取所有数据权限组列表--用户列表筛选条件
export const SYS_GROUP_TREELIST = KPMS + 'v2/bizGroup/findAllByTree';				//查询获取所有数据权限组列表-树形结构
export const SYS_GROUP_ADD = KPMS + 'v2/bizGroup/add';											//新增数据权限组
export const SYS_GROUP_UPDATE = KPMS + 'v2/bizGroup/update';								//修改数据权限组
export const SYS_GROUP_DELETE = KPMS + 'v2/bizGroup/delete';								//删除数据权限组
export const SYS_USER_TO_GROUP = KPMS + 'v2/bizGroup/insertGroupUser';			//添加用户到组
export const SYS_ROLE_TO_GROUP = KPMS + 'v2/bizGroup/insertDataPermission';	//添加权限到组
export const SYS_FIND_GROUP_USER = KPMS + 'v2/user/findByGroup';						//查询组下的用户
export const SYS_FIND_GROUP_ROLE = KPMS + 'v2/permission/findByGroup';			//查询组下的权限
export const SYS_GROUP_USER_DELETE = KPMS + 'v2/bizGroup/deleteAllUser';	//删除组下的所有用户
export const SYS_GROUP_USER_DELETES = KPMS + 'v2/bizGroup/deleteGroupUser';	//删除组下的指定用户
export const SYS_GROUP_ROLE_DELETE = KPMS + 'v2/bizGroup/deleteAllPermission';	//删除组下的所有权限
export const SYS_GROUP_ROLE_DELETES = KPMS + 'v2/bizGroup/deleteDataPermission';	//删除组下的指定权限