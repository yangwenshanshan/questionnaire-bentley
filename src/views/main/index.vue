<template>
  <div ref="mainPage" class="main-page" v-if="questionData">
    <div class="app-top">
      <img src="../../assets/bentley_logo.png" alt="">
      <van-popover
        v-model="showPopover"
        trigger="click"
        :actions="actions"
        @select="popoverSelect"
        overlay
      >
        <template #reference>
          <img class="svg-language-icon" src="../../assets/language.png" alt="">
        </template>
      </van-popover>
    </div>
    <div class="main-title">{{questionData.title}}</div>
    <div v-for="item in list" :key="item.id">
      <question @saveAll="saveAll" ref="question" :item="item" :locale="locale"></question>
      <template v-if="item.optionId === item.radio && item.children && item.children.length">
        <div v-for="row in item.children" :key="row.id">
          <question @saveAll="saveAll" ref="subQuestion" :item="row" :locale="locale"></question>
        </div>
      </template>
    </div>
    <div class="footer-btns" >
      <van-button v-if="page > 1" class="btn-item" color="rgba(0,50,32,.7)" plain block @click="lastQuestion">{{previousPage[locale]}}</van-button>
      <van-button v-if="!isEnd" color="rgba(0,50,32,.7)" type="primary" block @click="nextQuestion">{{nextPage[locale]}}</van-button>
      <van-button v-if="isEnd" color="rgba(0,50,32,.7)" type="primary" block @click="postQuestion">{{submit[locale]}}</van-button>
    </div>
  </div>
</template>

<script>
import api from '@/common/api'
import { Toast } from 'vant'
import question from '../../components/question.vue'
import qs from 'qs'

export default {
  components: {
    question
  },
  data () {
    return {
      locale: 'zh_CN',
      questionList: [],
      questionData: null,
      page: 0,
      items: [],
      showPopover: false,
      qId: 0,
      actions: [],
      actionsLocales: [{
        text: '简体中文',
        locale: 'zh_CN',
        className:"app-top-popover"
      }, {
        text: 'English',
        locale: 'en_US',
        className:"app-top-popover"
      }, {
        text: '繁體中文',
        locale: 'zh_HK',
        className:"app-top-popover"
      }],
      previousPage: {
        'zh_CN': '上一页',
        'zh_HK': '上一頁',
        'en_US': 'previous page'
      },
      nextPage: {
        'zh_CN': '下一页',
        'zh_HK': '下一頁',
        'en_US': 'next page'
      },
      submit: {
        'zh_CN': '提交',
        'zh_HK': '提交',
        'en_US': 'submit'
      },
      loadingText: {
        'zh_CN': '加载中...',
        'zh_HK': '加載中...',
        'en_US': 'loading...'
      },
      languageChange: {
        'zh_CN': '语言切换成功',
        'zh_HK': '語言切換成功',
        'en_US': 'Language switching succeeded'
      },
      checkUrlText: {
        'zh_CN': '请检查连接',
        'zh_HK': '請檢查連接',
        'en_US': 'Please check url'
      }
    }
  },
  computed: {
    list () {
      return this.questionList.filter(el => el.page === this.page)
    },
    isEnd () {
      let index = this.questionList.findIndex(el => el.page === this.page + 1)
      if (index < 0) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    api.checkQuestion(this.$route.query).then(res => {
      if (res.code === 0 && res.data && res.data.done) {
        sessionStorage.setItem('_yws_result', JSON.stringify(res))
        localStorage.removeItem(`_yws_${this.qId}_question`)
        this.$router.replace({
          path: '/result',
          query: this.$route.query
        })
        return false
      } else {
        const { _locale, qId } = this.$route.query
        if (_locale) {
          this.locale = _locale
        }
        if (!qId) {
          Toast(this.checkUrlText[this.locale])
          return false
        }
        this.qId = qId
        const ywsQuestion = localStorage.getItem(`_yws_${this.qId}_question`)
        if (!ywsQuestion) {
          this.getQuestion({ _locale: this.locale, qId: this.qId })
        } else {
          const { questionData, page, locale, time } = JSON.parse(ywsQuestion)
          let nowTime = new Date().getTime()
          if (nowTime > time + 60 * 30 * 1000 || locale !== this.locale) {
            localStorage.removeItem(`_yws_${this.qId}_question`)
            this.getQuestion({ _locale: this.locale, qId: this.qId })
          } else {
            this.questionData = questionData
            this.questionList = questionData.items
            this.page = page
            this.locale = locale
            this.actions = []
            questionData.locales.forEach(el => {
              const name = this.actionsLocales.find(item => item.locale === el)
              this.actions.push(name)
            })
          }
        }
      }
    })
  },
  methods: {
    saveAll () {
      localStorage.setItem(`_yws_${this.qId}_question`, JSON.stringify({
        questionData: this.questionData,
        time: new Date().getTime(),
        locale: this.locale,
        page: this.page
      }))
    },
    popoverSelect (item) {
      this.locale = item.locale
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          _locale: this.locale,
        }
      })
      this.getQuestion({ _locale: this.locale, qId: this.qId }, true)
    },
    getQuestion (params, changeFlag) {
      Toast.loading({
        message: this.loadingText[this.locale],
        overlay: true,
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      api.getQuestion(params).then(res => {
        Toast.clear()
        if (res.code === 0 && res.data) {
          this.questionData = res.data
          this.questionList = res.data.items
          this.page = 1
          const locales = res.data.locales
          this.actions = []
          locales.forEach(el => {
            const name = this.actionsLocales.find(item => item.locale === el)
            this.actions.push(name)
          })
          if (changeFlag) {
            Toast(this.languageChange[this.locale])
          }
        }
      }).catch(() => {
        Toast.clear()
      })
    },
    initParams (qv) {
      let items = []
      if (qv && qv.length) {
        for (let i = 0; i < qv.length; i++) {
          let result = qv[i].checkFill()
          if (typeof result === 'boolean') {
            if (!result) {
              const top = qv[i].$el.getBoundingClientRect().top
              const scrollHeight = this.$refs.mainPage.scrollHeight - window.innerHeight
              window.scrollTo(0, scrollHeight + top)
              return false
            }
          } else {
            items.push(result)
          }
        }
      }
      return items
    },
    nextQuestion () {
      let qVues = this.$refs.question
      let subQVues = this.$refs.subQuestion
      let items = []

      let result1 = this.initParams(qVues)
      if (result1) {
        items.push(...result1)
      } else {
        return false
      }

      let result2 = this.initParams(subQVues)
      if (result2) {
        items.push(...result2)
      } else {
        return false
      }

      this.items.push(...items)
      
      if (!this.isEnd) {
        this.page++
      }
    },
    lastQuestion () {
      this.items.splice(this.items.length - 1, 1)
      this.page--
    },
    postQuestion () {
      if (this.nextQuestion() === false) return false

      Toast.loading({
        message: this.loadingText[this.locale],
        overlay: true,
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })

      const params = qs.stringify(this.$route.query)
      api.submitQuestion(params, {
        id: this.questionData.id,
        items: this.items,
        _locale: this.locale,
      }).then(res => {
        Toast.clear()
        if (res.code === 0) {
          sessionStorage.setItem('_yws_result', JSON.stringify(res))
          localStorage.removeItem(`_yws_${this.qId}_question`)
          this.$router.replace({
            path: '/result',
            query: this.$route.query
          })
        }
      }).catch(() => {
        Toast.clear()
      })
    }
  }
}
</script>

<style lang="less">
.main-page {
  .main-title{
    background-color: rgba(255,255,255,0.9);
    padding: 26px 10px 20px 10px;
    width: 100%;
    color: rgba(0,50,32,.7);
    line-height: 32px;
    font-weight: bold;
    text-align: center;
    font-size: 20px;
  }
  .footer-btns{
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn-item{
      margin-right: 20px;
    }
  }
  .app-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 40px;
    img{
      width: 22.4vw;
      height: 11.2vw;
      margin: 5.333vw;
    }
    .svg-language-icon{
      width: 20px;
      height: 20px;
      margin: 0;
    }
  }
}
.app-top-popover{
  width: 90px;
  height: 40px;
}
</style>