<template>
  <div class="result-page" :style="answerData && answerData.css && answerData.css.backgroundColor ? 'background:' + answerData.css.backgroundColor : ''" v-if="result && answerData">
    <!-- <div class="result-top"></div> -->
    <div class="app-top"  v-if="!answerData.css || !answerData.css.backgroundImage">
      <img src="../../assets/bentley_logo.png" alt="">
    </div>
    <div class="banner-img" v-if="answerData.cover || (answerData.css && answerData.css.backgroundImage)">
      <img v-if="answerData.css && answerData.css.backgroundImage" :src="answerData.css.backgroundImage" alt="">
      <img v-else :src="answerData.cover" alt="">
    </div>
    <!-- <div class="main-title">{{result.data.shortTitle}}</div> -->
    <div class="result-main">
      <van-icon class="success-icon" size="1rem" color="rgb(73,203,21)" name="checked" />
      <p :style="answerData && answerData.css && answerData.css.titleColor ? 'color:' + answerData.css.titleColor : ''">{{result.msg}}</p>
      <p :style="answerData && answerData.css && answerData.css.titleColor ? 'color:' + answerData.css.titleColor : ''" v-if="result.data.score">{{result.data.rightScore}}/{{result.data.totalScore}}</p>
      <p :style="answerData && answerData.css && answerData.css.titleColor ? 'color:' + answerData.css.titleColor : ''" v-else>{{result.data.right}}/{{result.data.total}}</p>
    </div>
    <div class="result-top"></div>
    <div class="result-main" style="padding:0" v-if="result.data.done && !result.data.score">
      <van-button :color="answerData && answerData.css && answerData.css.titleColor ? answerData.css.titleColor : 'rgba(0,50,32,.7)'" type="primary" block @click="goAnswer">{{result.data.shortTitle}}{{nextPage[locale]}}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      result: null,
      answerData: null,
      locale: 'zh_CN',
      msg: {
        'zh_CN': '您的答卷已经提交，感谢您的参与！',
        'zh_HK': '您的答卷已經提交，感謝您的參與！',
        'en_US': 'Your answer sheet has been submitted. Thank you for your participation!'
      },
      nextPage: {
        'zh_CN': '回顾',
        'zh_HK': '回顧',
        'en_US': 'review'
      },
    }
  },
  created () {
    let result = sessionStorage.getItem('_yws_result')
    const { _locale } = this.$route.query
    if (_locale) {
      this.locale = _locale
    }
    if (result) {
      this.result = JSON.parse(result)
      this.answerData = this.result.data
      document.title = this.result.data.title
      sessionStorage.removeItem('_yws_result')
      // if (this.result.data.score) {
      //   this.getQuestionHistory()
      // }
    } else {
      this.$router.replace({
        path: '/',
        query: this.$route.query
      })
    }
  },
  methods: {
    goAnswer () {
      this.$router.push({
        path: '/answer',
        query: this.$route.query
      })
    }
    // getQuestionHistory () {
    //   api.getQuestionHistory({
    //     _locale: this.locale,
    //     ...this.$route.query
    //   }).then(res => {
    //     console.log(res)
    //   })
    // }
  }
}
</script>

<style lang="less">
.result-page{
  min-height: 100vh;
  background: #f4f5f5;
  .main-title{
    background-color: rgba(255,255,255,0.9);
    padding: 10px 10px 20px 10px;
    width: 100%;
    color: rgba(0,50,32,.7);
    line-height: 32px;
    font-weight: bold;
    text-align: center;
    font-size: 20px;
    margin: 0 14px;
  }
  .app-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 40px;
    img{
      width: 84px;
      height: 42px;
      margin: 20px;
    }
    .svg-language-icon{
      width: 20px;
      height: 20px;
      margin: 0;
    }
  }
  .banner-img{
    width: 100%;
    img{
      width: 100%;
      height: auto;
    }
  }
  .result-top{
    height: 38px;
  }
  .result-main{
    text-align: center;
    padding: 30px 0 26px;
    margin: 0 14px;
    // background: #fff;
    font-size: 16px;
    color: #333;
    margin-top: 30px;
    .success-icon{
      margin-bottom: 18px;
    }
    p{
      margin: 0;
    }
  }
}
</style>