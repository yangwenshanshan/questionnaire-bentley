<template>
  <div class="main-page" v-if="questionData">
    <div class="main-title">{{questionData.title}}</div>
    <div v-for="item in list" :key="item.id">
      <question ref="question" :item="item" :locale="locale"  @saveAll="saveAll"></question>
      <template v-if="item.optionId === item.radio && item.children && item.children.length">
        <div v-for="row in item.children" :key="row.id">
          <question ref="subQuestion" :item="row" :locale="locale" @saveAll="saveAll"></question>
        </div>
      </template>
    </div>
    <div class="footer-btns" >
      <van-button v-if="page > 1" class="btn-item" color="rgba(0,50,32,.7)" plain block @click="lastQuestion">上一页</van-button>
      <van-button v-if="!isEnd" color="rgba(0,50,32,.7)" type="primary" block @click="nextQuestion">下一页</van-button>
      <van-button v-if="isEnd" color="rgba(0,50,32,.7)" type="primary" block @click="postQuestion">提交</van-button>
    </div>
  </div>
</template>

<script>
import api from '@/common/api'
import { Toast } from 'vant'
import question from '../../components/question.vue'

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
      items: []
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
  },
  created () {
    const { _locale, qId } = this.$route.query
    if (_locale) {
      this.locale = _locale
    }
    if (!qId) {
      Toast('请检查链接是否正确')
      return false
    }
    this.getQuestion({ _locale: this.locale, qId })
  },
  methods: {
    saveAll () {
      console.log(this.questionList)
    },
    getQuestion (params) {
      api.getQuestion(params).then(res => {
        if (res.code === 0 && res.data) {
          this.questionData = res.data
          this.questionList = res.data.items
          this.page = 1
        }
      })
    },
    initParams (qv) {
      let items = []
      if (qv && qv.length) {
        for (let i = 0; i < qv.length; i++) {
          let result = qv[i].checkFill()
          if (typeof result === 'boolean') {
            if (!result) {
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
      this.nextQuestion()

      Toast.loading({
        message: '加载中...',
        overlay: true,
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })

      api.submitQuestion({
        id: this.questionData.id,
        items: this.items,
        _locale: this.locale
      }).then(res => {
        Toast.clear()
        if (res.code === 0) {
          sessionStorage.setItem('_yws_result', JSON.stringify(res))
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
}
</style>