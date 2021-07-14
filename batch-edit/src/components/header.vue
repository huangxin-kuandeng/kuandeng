<template>
  <div class="indexHeader">
    <h2>{{ msg }}</h2>
  </div>
</template>

<script>
export default {
  name: "indexHeader",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.indexHeader {
  float: left;
  height: 50px;
  width: 100%;
  background-color: #ffffff;
}
.indexHeader h2 {
  margin: 10px;
  text-align: left;
}
</style>
