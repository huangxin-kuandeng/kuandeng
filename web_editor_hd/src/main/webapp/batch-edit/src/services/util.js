/* eslint-disable prettier/prettier */
// 通用方法
export function formatTags(tags) {
  var newtags = {};
  tags.forEach(d => {
    var k = d.k || d.key || d.name;
    var v = d.v || d.val || d.value || "";
    newtags[k] = v;
  })
  return newtags;
}
/*** 
 *用户权限：
 *0：无权限
 *1：作业员
 *2：质检员
 *3：所有权限
 */
export function isRoleAuth(user) {
  var authorities = user.authorities;
  var workType = false;
  var checkType = false;
  var works = ["edit", "work", "LinearWork", "diseaseWork", "autoTopologyWork", "totalFactorCompileWork"];
  var checks = ["edit_check", "manualCheck", "check", "LinearCheck", "diseaseCheck", "autoTopologyCheck", "totalFactorCompileCheck"];

  authorities.forEach(d => {
    var authority = d.authority;
    if (works.includes(authority)) {
      workType = true;
    }
    if (checks.includes(authority)) {
      checkType = true;
    }
  })
  if (workType && checkType) {
    return 3;
  } else if (workType && !checkType) {
    return 1;
  } else if (!workType && checkType) {
    return 2;
  }
  return 0;

}