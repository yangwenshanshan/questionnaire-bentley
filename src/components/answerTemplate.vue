<template>
  <div class="answer-item" v-if="item">
    <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="q-title"><span v-if="item.required" style="color:red">*</span>{{item.title}}<span v-if="type !== false">{{typeList[item.type][locale]}}</span></p>
    <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="sub-title" v-if="item.subTitle" v-html="item.subTitle"></p>
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
        <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="disable-span">{{item.text}}</p>
      </div>
    </div>
    <div v-if="item.type === 'radio'">
      <div v-for="row in item.options" :key="row.id">
        <div v-if="row.img && row.img.length > 0">
          <van-swipe :ref="'mySwipe' + row.id" class="my-swipe">
            <van-swipe-item v-for="(imgUrl, index) in row.img" :key="index">
              <img class="img-style" :src="imgUrl" alt="" />
            </van-swipe-item>
            <template #indicator>
              <div @click="prev('mySwipe' + row.id)" class="custom-indicator-left indicator-size"><van-icon name="arrow-left" /></div>
              <div @click="next('mySwipe' + row.id)" class="custom-indicator-right indicator-size"><van-icon name="arrow" /></div>
            </template>
          </van-swipe>
          <!-- <img v-for="imgUrl in row.img" class="img-style" :src="imgUrl" alt=""> -->
          <!-- <img class="img-style" v-if="row.img" :src="row.img" alt=""> -->
        </div>
        <van-checkbox :style="css && css.titleColor ? 'color:' + css.titleColor : 'color:#323233'" :class="row.right ? row.checked ? 'right-green' : 'right-red' : ''" disabled shape="round" v-model="row.checked" checked-color="rgba(0,50,32,.7)" :name="row.id">{{row.title}}</van-checkbox>
        <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="sub-title" v-if="row.subTitle" v-html="row.subTitle"></p>
        <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="disable-span" v-if="row.text && row.checked">{{row.text}}</p>
      </div>
    </div>
    <div v-if="item.type === 'checkbox'">
      <div v-for="row in item.options" :key="row.id">
        <van-checkbox :style="css && css.titleColor ? 'color:' + css.titleColor : 'color:#323233'" :class="row.right ? row.checked ? 'right-green' : 'right-red' : ''" disabled shape="square" v-model="row.checked" checked-color="rgba(0,50,32,.7)" :name="row.id">{{row.title}}</van-checkbox>
        <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="sub-title" v-if="row.subTitle" v-html="row.subTitle"></p>
        <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="disable-span" v-if="row.text && row.checked">{{row.text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/common/api'

export default {
  props: {
    item: {
      type: Object,
      default: () => null
    },
    type: {
      type: Boolean,
      default: () => true
    },
    css: {
      type: Object,
      default: () => null
    }
  },
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
  },
  methods: {
    prev (swipe) {
      this.$refs[swipe] && this.$refs[swipe][0] && this.$refs[swipe][0].prev()
    },
    next (swipe) {
      this.$refs[swipe] && this.$refs[swipe][0] && this.$refs[swipe][0].next()
    },
  }
}
</script>

<style lang="less">
.answer-page{
  min-height: 100vh;
  background: #fff;
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
  .banner-img{
    width: 100%;
    img{
      width: 100%;
      height: auto;
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
  .sub-title{
    margin: 0;
    padding: 0;
    font-size: 14px;
    color: #c8c9cc;
    padding-left: 28px;
    margin-bottom: 10px;
  }
  .title{
    margin: 0;
    padding: 0;
  }
  .custom-indicator-left{
    position: absolute;
    top: calc(~'50% - 20px');
    left: 0;
  }
  .custom-indicator-right{
    position: absolute;
    top: calc(~'50% - 20px');
    right: 0;
  }
  .indicator-size{
    font-size: 30px;
    color: #fff;
  }
  .my-swipe{
    width: 100%;
    .img-style{
      display: block;
      width: 100%;
      height: auto;
      margin-bottom: 10px;
    }
  }
  .van-radio__label{
    color: unset;
  }
  .van-checkbox__label{
    color: unset;
  }
  .van-cell{
    background-color: transparent;
    border-bottom: 1px solid rgba(218, 189, 165, 0.2);
  }
  .van-field__label{
    color: unset;
  }
  .van-field__control{
    color: unset;
  }
  .van-cell__right-icon{
    color: unset;
  }
}
</style>