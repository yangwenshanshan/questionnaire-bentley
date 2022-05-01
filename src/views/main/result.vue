<template>
  <div class="result-page">
    <div class="result-top"></div>
    <div class="result-main">
      <van-icon class="success-icon" size="1rem" color="rgb(73,203,21)" name="checked" />
      <p>{{msg[locale]}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      result: null,
      locale: 'zh_CN',
      msg: {
        'zh_CN': '您的答卷已经提交，感谢您的参与！',
        'zh_HK': '您的答卷已經提交，感謝您的參與！',
        'en_US': 'Your answer sheet has been submitted. Thank you for your participation!'
      }
    }
  },
  created () {
    let result = sessionStorage.getItem('_yws_result')
    const { _locale } = this.$route.query
    this.locale = _locale
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