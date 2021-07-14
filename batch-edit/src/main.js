/* eslint-disable prettier/prettier */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import _ from "lodash";
import ElementUI from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
// import "../config.js";
import locale from 'element-plus/lib/locale/lang/zh-cn';
import * as sysApi from "./services/sys";
import * as userApi from "./services/jquery.oauth2-client.js";

import axios from "axios";
let app = createApp(App);
app.config.globalProperties.$_ = _;
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$fruit = {};
app.config.globalProperties.$tags = {};
app.use(store);
app.use(router);
app.use(ElementUI, { locale });
sysApi.configList({}).then((res) => {
  app.config.globalProperties.$config = res && res.url ? res.url : {};
  if (res.url) {
    var oauth = userApi.oauth2Client(app, res.url.kd_auth_server + "oauth");
    oauth.user(res.url.kd_auth_server + "user");
    sysApi
      .configFruit({
        url: res.url.kds_meta + "meta/app/instance/current/FRUIT.json",
      })
      .then((res) => {
        var layers = (res.result && res.result.layers) || [];
        layers.forEach((d) => {
          var modelName = d.model.modelName;
          var fields = d.model.fields;
          var parentOptions = {};
          var fieldsGroup = {};
          for (var s = 0; s < fields.length; s++) {
            var display = fields[s].display; //false -- 不显示；true -- 显示
            var fieldInput = fields[s].fieldInput;
            var fieldName = fields[s].fieldName;
            var s_id = fields[s].id;
            fieldsGroup[s_id] = s;
            if (display && fieldInput == "select") {
              var fieldTypeValues = fields[s].fieldType.fieldTypeValues || [];
              var cloneValues = _.cloneDeep(fieldTypeValues);
              fields[s].cloneValues = cloneValues;
              //遍历每个属性项中所有满足parentId不为空的进行创建对象数组并赋值
              for (var i = 0; i < fieldTypeValues.length; i++) {
                var c = fieldTypeValues[i];
                parentOptions[c.id] = s_id;
                var cid = c.parentId ? parentOptions[c.parentId] : null;
                if (cid) {
                  var index = fieldsGroup[cid];
                  if (!fields[index].selectGroup) {
                    fields[index].selectGroup = [fieldName];
                  } else {
                    fields[index].selectGroup.push(fieldName);
                  }
                  break;
                }
              }
            }
          }
          app.config.globalProperties.$fruit[modelName] = d.model;
        });
      });
    sysApi
      .configTags({
        url: res.url.kds_meta + "meta/app/instance/current/QUALITY_TAG.json",
      })
      .then((res) => {
        var layers = (res.result && res.result.layers) || [];
        layers.forEach((d) => {
          var fields = d.model.fields;
          var modelName = d.model.modelName;
          for (var s = 0; s < fields.length; s++) {
            var fieldInput = fields[s].fieldInput;
            if (fieldInput == "select") {
              var fieldTypeValues = fields[s].fieldType.fieldTypeValues || [];
              var cloneValues = _.cloneDeep(fieldTypeValues);
              fields[s].cloneValues = cloneValues;
            }
          }
          app.config.globalProperties.$tags[modelName] = d.model;
        });
      });
    sysApi
      .configTags({
        url: res.url.kds_meta + "meta/app/instance/current/QUESTION_TAG.json",
      })
      .then((res) => {
        var layers = (res.result && res.result.layers) || [];
        console.log(layers);
        layers.forEach((d) => {
          var fields = d.model.fields;
          var modelName = d.model.modelName;
          for (var s = 0; s < fields.length; s++) {
            var fieldInput = fields[s].fieldInput;
            if (fieldInput == "select") {
              var fieldTypeValues = fields[s].fieldType.fieldTypeValues || [];
              var cloneValues = _.cloneDeep(fieldTypeValues);
              fields[s].cloneValues = cloneValues;
            }
          }
          app.config.globalProperties.$tags[modelName] = d.model;
        });
      });
  }
  app.mount("#app");
});