import axios from "axios";

export function configList(params) {
  return new Promise((resolve, reject) => {
    axios.get(window._init_url, {}).then(response => {
        resolve(response.data);
      }, err => {
        resolve(defaultValue.menuList);
      })
      .catch((error) => {
        resolve(defaultValue.menuList)
      })
  })
}