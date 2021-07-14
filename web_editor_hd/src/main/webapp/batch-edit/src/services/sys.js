/* eslint-disable prettier/prettier */
import axios from "axios";
// 获取最新配置
export function configList() {
  return new Promise((resolve) => {
    axios
      .get(window._init_url, {})
      .then(
        (response) => {
          resolve(response.data);
        },
        () => {
          resolve({});
        }
      )
      .catch(() => {
        resolve({});
      });
  });
}
// 获取模型的规格
export function configFruit(prame) {
  return new Promise((resolve) => {
    axios
      .get(prame.url, {})
      .then(
        (response) => {
          resolve(response.data);
        },
        () => {
          resolve({});
        }
      )
      .catch(() => {
        resolve({});
      });
  });
}
// 获取标的规格
export function configTags(prame) {
  return new Promise((resolve) => {
    axios
      .get(prame.url, {})
      .then(
        (response) => {
          resolve(response.data);
        },
        () => {
          resolve({});
        }
      )
      .catch(() => {
        resolve({});
      });
  });
}
export function getAsyncDatas(param) {
  return new Promise((resolve) => {
    axios
      .get(param.url, {})
      .then(
        (response) => {
          resolve(response.data);
        },
        () => {
          resolve({});
        }
      )
      .catch(() => {
        resolve({});
      });
  });
}

export function postAsyncDatas(param) {
  return new Promise((resolve) => {
    axios
      .post(param.url, param.data)
      .then(
        (response) => {
          resolve(response.data);
        },
        () => {
          resolve({});
        }
      )
      .catch(() => {
        resolve({});
      });
  });
}