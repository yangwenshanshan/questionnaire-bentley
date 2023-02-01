<template>
  <div ref="mainPage" class="main-page" :style="questionData && questionData.css && questionData.css.backgroundColor ? 'background:' + questionData.css.backgroundColor : ''" v-if="questionData">
    <div :class="countDownTime >= 0 ? 'app-top-count-down' : ''" class="app-top" v-if="!questionData.css || !questionData.css.backgroundImage">
      <img src="../../assets/bentley_logo.png" alt="">
      <!-- <van-popover
        v-model="showPopover"
        trigger="click"
        :actions="actions"
        @select="popoverSelect"
        overlay
      >
        <template #reference>
          <img class="svg-language-icon" src="../../assets/language.png" alt="">
        </template>
      </van-popover> -->
    </div>
    <div class="count-down-time-2" v-if="countDownTime >= 0">
      <img class="time-icon" src="../../assets/count-down.png" alt="">
      <p class="time-main"> {{ showTimeText }}</p>
    </div>
    <div class="banner-img" v-if="questionData.cover || (questionData.css && questionData.css.backgroundImage)">
      <img v-if="questionData.css && questionData.css.backgroundImage" :src="questionData.css.backgroundImage" alt="">
      <img v-else :src="questionData.cover" alt="">
    </div>
    <div class="main-title" :style="questionData && questionData.css && questionData.css.titleColor ? 'color:' + questionData.css.titleColor : ''">{{questionData.shortTitle}}</div>
    
    <div v-for="item in list" :key="item.id">
      <question @saveAll="saveAll" ref="question" :item="item" :locale="locale" :type="questionData.type" :css="questionData.css"></question>
      <template v-if="item.optionId === item.radio && item.children && item.children.length">
        <div v-for="row in item.children" :key="row.id">
          <question @saveAll="saveAll" ref="subQuestion" :item="row" :locale="locale" :type="questionData.type" :css="questionData.css"></question>
          <template v-if="row.optionId === row.radio && row.children && row.children.length">
            <div v-for="it in row.children" :key="it.id">
              <question @saveAll="saveAll" ref="trQuestion" :item="it" :locale="locale" :type="questionData.type" :css="questionData.css"></question>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="footer-btns" >
      <van-button v-if="page > 1" class="btn-item" :color="questionData && questionData.css && questionData.css.titleColor ? questionData.css.titleColor : 'rgba(0,50,32,.7)'" plain block @click="lastQuestion">{{previousPage[locale]}}</van-button>
      <van-button v-if="!isEnd" :color="questionData && questionData.css && questionData.css.titleColor ? questionData.css.titleColor : 'rgba(0,50,32,.7)'" type="primary" block @click="nextQuestion">{{nextPage[locale]}}</van-button>
      <van-button v-if="isEnd" :color="questionData && questionData.css && questionData.css.titleColor ? questionData.css.titleColor : 'rgba(0,50,32,.7)'" type="primary" block @click="postQuestion" :disabled="disabledBtn">{{submit[locale]}}</van-button>
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
      showTimeText: '',
      disabledBtn: false,
      countDownTime: -1,
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
    api.checkQuestion({
      _locale: this.locale,
      ...this.$route.query
    }).then(res => {
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
            document.title = this.questionData.title
            if (this.questionData.time) {
              this.countDownTime = this.questionData.time
              this.showTimeText = this.fomateDate(this.countDownTime)
              this.runTime(this.questionData.time)
            }
            this.items = []
            for (let i = 0; i <= this.questionList.length; i++) {
              if (this.questionList[i]) {
                const items = this.checkFill(this.questionList[i])
                if (items) {
                  this.items.push(items)
                }
                if (this.questionList[i].children && this.questionList[i].children.length > 0) {
                  for (let j = 0; j < this.questionList[i].children.length; j++) {
                    const it = this.questionList[i].children[j]
                    if (it) {
                      const row = this.checkFill(it)
                      if (row) {
                        this.items.push(row)
                      }
                    }
                  }
                }
              }
            }
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
      if (!this.questionData.time) {
        localStorage.setItem(`_yws_${this.qId}_question`, JSON.stringify({
          questionData: this.questionData,
          time: new Date().getTime(),
          locale: this.locale,
          page: this.page
        }))
      }
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
      api.getQuestion({
        ...this.$route.query,
        ...params
      }).then(res => {
        Toast.clear()
        if (res.code === 0 && res.data) {
          document.title = res.data.title
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
          if (this.questionData.time) {
            this.countDownTime = this.questionData.time
            this.runTime(this.questionData.time)
            this.showTimeText = this.fomateDate(this.countDownTime)
          }
        }
      }).catch(() => {
        Toast.clear()
      })
    },
    runTime (time) {
      setTimeout(() => {
        if (this.countDownTime > 0) {
          this.countDownTime = time - 1
          this.showTimeText = this.fomateDate(this.countDownTime)
          this.runTime(this.countDownTime)
        } else {
          Toast('答题超时')
          this.disabledBtn = true
        }
      }, 1000)
    },
    fomateDate (time) {
      let h = parseInt(time / 60 / 60 % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt(time / 60 % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(time % 60)
      s = s < 10 ? '0' + s : s
      let result = ''
      // if (h > 0) {
        result = `${h}:`
      // }
      return result + `${m}:${s}`
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
      let trVues = this.$refs.trQuestion
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

      let result3 = this.initParams(trVues)
      if (result3) {
        items.push(...result3)
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

      let tempItem = {}
      this.items.forEach(el => {
        tempItem[el.id] = el
      })

      this.items = []
      for (let i in tempItem) {
        this.items.push(tempItem[i])
      }
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
    },
    checkFill (item) {
      let params = {}
      if (item.type === 'radio') {
        const radioItem = item.options.find(it => it.id === item.radio)
        if (item.radio && radioItem.type !== 'other') {
          params.id = item.id
          params.type = 'radio'
          params.radio = item.radio
          params.text = item.text ? item.text : ''
          return params
        } else if (item.radio && radioItem.type === 'other' && item.text) {
          params.id = item.id
          params.type = 'radio'
          params.radio = item.radio
          params.text = item.text ? item.text : ''
          return params
        } else if (!item.required) {
          params.id = item.id
          params.type = 'radio'
          params.radio = ''
          params.text = ''
          return params
        } else {
          return false
        }
      }
      if (item.type === 'checkbox') {
        if (item.checkbox && item.checkbox.length && item.checkbox.length >= item.minLength) {
          params.id = item.id
          params.checkbox = item.checkbox,
          params.type = 'checkbox'
          params.text = item.text ? item.text : ''
          return params
        } else if (item.checkbox && item.checkbox.length && item.checkbox.length < item.minLength) {
          return false
        } else if (!item.required) {
          params.id = item.id
          params.checkbox = ''
          params.type = 'checkbox'
          return params
        } else {
          return false
        }
      }
      if (item.type === 'text' && (!item.options || item.options.length <= 0)) {
        if (item.text) {
          params.id = item.id
          params.text = item.text,
          params.type = 'text'
          return params
        } else if (!item.required) {
          params.id = item.id
          params.text = ''
          params.type = 'text'
          return params
        } else {
          return false
        }
      }
      if (item.type === 'text' && item.options && item.options.length > 0) {
        params.id = item.id
        params.type = 'text'
        params.text = []
        let options = item.options
        for (let i = 0; i < options.length; i++) {
          let value = []
          for (let j = 0; j < options[i].length; j++) {
            let text = options[i]['text' + (j + 1)]
            if (text) {
              value.push(text)
            }
          }
          if (value.length < item.minLength) {
            return false
          }
          params.text.push({
            id: options[i].id,
            value: value
          })
        }
        return params
      }
      return true
    }
  }
}
</script>

<style lang="less">
.main-page {
  .main-title{
    // background-color: rgba(255,255,255,0.9);
    padding: 10px 10px 20px 10px;
    width: 100%;
    color: rgba(0,50,32,.7);
    line-height: 32px;
    font-weight: bold;
    text-align: center;
    font-size: 18px;
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
  .app-top-count-down{
    padding-top: 25px;
  }
  .banner-img{
    width: 100%;
    img{
      width: 100%;
      height: auto;
    }
  }
  .count-down-time{
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff;
    width: 80px;
    z-index: 100;
    text-align: center;
    box-shadow: 0 0 3px #000;
    border-radius: 5px;
    .time-main{
      font-size: 20px;
    }
  }
  .count-down-time-2{
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    z-index: 100;
    background: #fff;
    text-align: center;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    .time-icon{
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
    .time-main{
      font-size: 18px;
      margin-top: 5px;
    }
  }
}
.app-top-popover{
  width: 90px;
  height: 40px;
}
</style>