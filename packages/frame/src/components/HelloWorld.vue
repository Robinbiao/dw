<template>
  <div class="hello">
    123
    <company-page></company-page>
    <report-module description="暂无研报"></report-module>
    <wechat-module></wechat-module>
  </div>
</template>

<script>
import company from "@dworld/company";
export default {
  name: "HelloWorld",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    wechatModule: window.wechatModule.default,
    companyPage: company,
  },
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
