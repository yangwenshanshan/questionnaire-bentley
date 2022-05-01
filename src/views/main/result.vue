<template>
  <div class="result-page">
    <div class="result-top"></div>
    <div class="result-main">
      <van-icon class="success-icon" size="1rem" color="rgb(73,203,21)" name="checked" />
      <p>您的答卷已经提交，感谢您的参与！</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      result: null
    }
  },
  created () {
    let result = sessionStorage.getItem('_yws_result')
    if (result) {
      this.result = JSON.parse(result)
      sessionStorage.removeItem('_yws_result')
    } else {
      this.$router.replace({
        path: '/',
        query: this.$route.query
      })
    }
  }
}
</script>

<style lang="less">
.result-page{
  min-height: 100vh;
  background: #f4f5f5;
  .result-top{
    height: 38px;
  }
  .result-main{
    text-align: center;
    padding: 30px 0 26px;
    margin: 0 14px;
    background: #fff;
    font-size: 16px;
    color: #333;
    .success-icon{
      margin-bottom: 18px;
    }
    p{
      margin: 0;
    }
  }
}
</style>