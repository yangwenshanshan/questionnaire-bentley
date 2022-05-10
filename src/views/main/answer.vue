<template>
  <div class="answer-page" v-if="answerData">
    <div class="main-title">{{answerData.title}}</div>
    <div class="answer-list">
      <div class="answer-item" v-for="item in answer">
        <p class="q-title"><span v-if="item.required" style="color:red">*</span>{{item.title}}<span>{{typeList[item.type][locale]}}</span></p>
        <div v-if="item.type === 'text'">
          <div class="q-o-children" v-if="item.options && item.options.length">
            <div class="c-item" v-for="row in item.options" :key="row.id">
              <p class="c-item-title">{{row.title}}</p>
              <div class="c-input-list">
                <div class="input-main" v-for="it in row.length" :key="it">
                  <span class="input-title">{{it}}.{{row.text[it - 1]}}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p class="disable-span">{{item.text}}</p>
          </div>
        </div>
        <div v-if="item.type === 'radio'">
          <div v-for="row in item.options" :key="row.id">
            <van-checkbox :class="row.right ? row.checked ? 'right-green' : 'right-red' : ''" disabled shape="round" v-model="row.checked" checked-color="rgba(0,50,32,.7)" :name="row.id">{{row.title}}</van-checkbox>
            <p class="disable-span" v-if="row.text && row.checked">{{row.text}}</p>
          </div>
        </div>
        <div v-if="item.type === 'checkbox'">
          <div v-for="row in item.options" :key="row.id">
            <van-checkbox :class="row.right ? row.checked ? 'right-green' : 'right-red' : ''" disabled shape="square" v-model="row.checked" checked-color="rgba(0,50,32,.7)" :name="row.id">{{row.title}}</van-checkbox>
            <p class="disable-span" v-if="row.text && row.checked">{{row.text}}</p>
          </div>
        </div>
      </div>
    </div>
      <!-- answer -->
  </div>
</template>

<script>
import api from '@/common/api'

export default {
  data () {
    return {
      result: null,
      locale: 'zh_CN',
      answer: [],
      answerData: null,
      msg: {
        'zh_CN': '您的答卷已经提交，感谢您的参与！',
        'zh_HK': '您的答卷已經提交，感謝您的參與！',
        'en_US': 'Your answer sheet has been submitted. Thank you for your participation!'
      },
      typeList: {
        'checkbox': {
          'zh_CN': '(多选题)',
          'zh_HK': '(多選題)',
          'en_US': '(Multiple choice)'
        },
        'radio': {
          'zh_CN': '(单选题)',
          'zh_HK': '(單選題)',
          'en_US': '(Single choice)'
        },
        'text': {
          'zh_CN': '',
          'zh_HK': '',
          'en_US': ''
        }
      }
    }
  },
  created () {
    this.getQuestionHistory()
  },
  methods: {
    getQuestionHistory () {
      api.getQuestionHistory({
        _locale: this.locale,
        ...this.$route.query
      }).then(res => {
        if (res.code === 0) {
          this.answerData = res.data
          document.title = res.data.title
          this.answer = []
          res.data.items.forEach(el => {
            if (el.type === 'radio') {
              el.options.forEach((row => {
                if (row.checked) {
                  row.radioChecked = row.id
                }
              }))
            }
            this.answer.push(el)
          });
        } else {
          this.$router.replace({
            path: '/',
            query: this.$route.query
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.answer-page{
  min-height: 100vh;
  background: #fff;
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
  .answer-item{
    padding: 10px 20px;
    margin: 5px 0;
    border: 1px dashed transparent;
    transition: 0.3s border ease-in-out;
    width: 100%;
    overflow-x: hidden;
    .q-title{
      position: relative;
      font-size: 16px;
      font-weight: bold;
      padding: 0 0 10px 0;
      display: block;
      word-wrap: break-word;
      line-height: 26px;
      margin: 0;
    }
    .q-o-children{
      .c-item{
        .c-item-title{
          padding: 8px 16px;
          background: #f0f0f0;
          font-size: 15px;
          font-weight: 600;
          color: #4d4d4d;
          line-height: 22px;
          margin: 20px 0 0;
        }
        .c-input-list{
          border: 1px solid #f0f0f0;
          padding: 18px 16px 8px 16px;
          .input-main{
            display: flex;
            // justify-content: center;
            // align-items: center;
            margin-bottom: 10px;
            .input-title{
              font-size: 16px;
              margin-right: 10px;
            }
            .c-item-input{
              flex: 1;
              padding: 11px 10px;
              font-size: 14px;
              display: inline-block;
              margin: 0;
              resize: none;
              border: 1px solid #ebebeb;
            }
          }
        }
      }
    }
    .textarea{
      resize: none;
      color: #262626;
      font-size: 14px;
      padding: 10px;
      width: 100%;
      height: 100px;
      background-color: #fff;
      border-radius: 4px;
      border: solid 1px #e0e0e0;
    }
    .van-radio{
      margin-bottom: 10px;
      .van-radio__label{
        font-size: 16px;
      }
    }
    .van-checkbox{
      margin-bottom: 10px;
      .van-checkbox__label{
        font-size: 16px;
      }
    }
    .error-message{
      position: relative;
      padding: 8px 14px;
      color: #262626;
      line-height: 20px;
      background-color: #ffecec;
      font-size: 14px;
      margin-top: 10px;
      transition: all .3s ease;
      display: flex;
      align-items: center;
      .message-content{
        margin-left: 10px;
      }
    }
    .radio-input{
      width: 100%;
      padding: 11px 10px;
      font-size: 14px;
      display: inline-block;
      margin: 0;
      resize: none;
      border: 1px solid #ebebeb;
    }
  }
  .right-green{
    .van-checkbox__label--disabled{
      color: #07c160;
    }
  }
  .right-red{
    .van-checkbox__label--disabled{
      color: #ee0a24;
    }
  }
  .disable-span{
    font-size: 16px;
    color: #c8c9cc;
    text-indent: 2em;
    margin: 0;
  }
}
</style>