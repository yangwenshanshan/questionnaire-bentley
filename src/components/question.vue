<template>
  <div ref="question" class="main-body" :class="isNotFilled ? 'not-filled' : ''" v-if="item">
    <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="q-title"><span v-if="item.required" style="color:red">*</span>{{item.title}}<span v-if="type !== false">{{typeList[item.type][locale]}}</span></p>
    <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="sub-title" v-if="item.subTitle" v-html="item.subTitle"></p>
    <div v-if="item.type === 'text' && !item.subType">
      <div class="q-o-children" v-if="item.options && item.options.length">
        <div class="c-item" v-for="row in item.options" :key="row.id">
          <p class="c-item-title">{{row.title}}</p>
          <div class="c-input-list">
            <div class="input-main" v-for="it in row.length" :key="it">
              <span class="input-title">{{it}}.</span>
              <input @blur="onBlur" @input="inputFill" class="c-item-input" type="text" v-model="row['text' + it]">
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <textarea @blur="onBlur" @input="inputFill" rows="3" class="textarea" v-model="item.text"></textarea>
      </div>
    </div>
    <div v-if="item.type === 'radio'">
      <van-radio-group @change="changeFill" v-model="item.radio" v-if="item.options && item.options.length">
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
          </div>
          <van-radio :style="css && css.titleColor ? 'color:' + css.titleColor : 'color:#323233'" :checked-color="css && css.titleColor ? css.titleColor : 'rgba(0,50,32,.7)'" :name="row.id">{{row.title}}</van-radio>
          <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="sub-title" v-if="row.subTitle" v-html="row.subTitle"></p>
        </div>
      </van-radio-group>
      <input @blur="onBlur" class="radio-input" v-if="radioShowInput" v-model="item.text" type="text">
    </div>
    <div v-if="item.type === 'checkbox'">
      <van-checkbox-group @change="changeFill" v-model="item.checkbox" v-if="item.options && item.options.length">
        <van-checkbox :style="css && css.titleColor ? 'color:' + css.titleColor : 'color:#323233'" shape="square" :checked-color="css && css.titleColor ? css.titleColor : 'rgba(0,50,32,.7)'" v-for="row in item.options" :key="row.id" :name="row.id">{{row.title}}</van-checkbox>
        <p :style="css && css.titleColor ? 'color:' + css.titleColor : ''" class="sub-title" v-if="row.subTitle" v-html="row.subTitle"></p>
      </van-checkbox-group>
      <input @blur="onBlur" class="radio-input" v-if="checkBoxShowInput" v-model="item.text" type="text">
    </div>
    <div v-if="item.type === 'text' && item.subType === 'selectdialog'">
      <van-field :style="css && css.titleColor ? 'color:' + css.titleColor + '!important' : 'color:#323233'" v-model="item.text" is-link readonly @click="showCascaderPopup"/>
    </div>
    <div class="error-message" :style="isNotFilled ? 'left: 0' : 'left: 100vw'">
      <van-icon name="clear" color="rgb(255, 64, 64)" size="0.5rem" />
      <span class="message-content">{{errorMessage[item.type][locale]}}</span>
    </div>
    <van-popup v-model="cascaderPopupVisible" round position="bottom">
      <van-cascader active-color="rgba(0, 50, 32)" :field-names="filedNames" v-model="cascaderValue" title="请选择所在地区" :options="cascaderOptions" @close="closeCascaderPopup" @finish="cascaderFinish"/>
    </van-popup>
  </div>
</template>

<script>
import api from '@/common/api'

export default {
  name: 'question',
  props: {
    item: {
      type: Object,
      default: () => null
    },
    locale: {
      type: String,
      default: ''
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
      cascaderPopupVisible: false,
      cascaderValue: '',
      radioShowInput: false,
      checkBoxShowInput: false,
      cascaderOptions: [],
      filedNames: { text: 'name', value: 'id', children: 'children' },
      isNotFilled: false,
      errorMessage: {
        'checkbox': {
          'zh_CN': '请选择内容',
          'zh_HK': '請選擇內容',
          'en_US': 'Please select content'
        },
        'radio': {
          'zh_CN': '请选择内容',
          'zh_HK': '請選擇內容',
          'en_US': 'Please select content'
        },
        'text': {
          'zh_CN': '请输入内容',
          'zh_HK': '請輸入內容',
          'en_US': 'Please enter the content'
        }
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
  watch: {
    'item.radio': function (val) {
      let item = this.item.options.find(item => item.id === val)
      if (item && item.type === 'other') {
        this.radioShowInput = true
      } else {
        this.radioShowInput = false
      }
    },
    'item.checkbox': function (val) {
      for (let i = 0; i < val.length; i++) {
        let item = this.item.options.find(item => item.id === val[i])
        if (item.type === 'other') {
          this.checkBoxShowInput = true
          return false
        }
      }
      this.checkBoxShowInput = false
    },
  },
  mounted () {
    if (this.item.type === 'text' && this.item.subType === 'selectdialog') {
      this.getProvinceList()
    }
    if (this.item.type === 'radio') {
      let item = this.item.options.find(it => it.id === this.item.radio)
      if (item && item.type === 'other') {
        this.radioShowInput = true
      } else {
        this.radioShowInput = false
      }
    }
    if (this.item.type === 'checkbox' && this.item.checkbox && this.item.checkbox.length) {
      for (let i = 0; i < this.item.checkbox.length; i++) {
        let item = this.item.options.find(item => item.id === this.item.checkbox[i])
        if (item.type === 'other') {
          this.checkBoxShowInput = true
          return false
        }
      }
      this.checkBoxShowInput = false
    }
    this.$nextTick(() => {
      if (this.$refs.question) {
        const documentArr = this.$refs.question.querySelectorAll('.van-field__control')
        if (documentArr && documentArr.length > 0) {
          for (let i = 0; i < documentArr.length; i++) {
            if (this.css && this.css.titleColor) {
              documentArr[i].style = 'color:' + this.css.titleColor
            }
          }
        }
      }
    })
  },
  methods: {
    getProvinceList () {
      api.getProvinceList().then(res => {
        this.cascaderOptions = res
      })
    },
    showCascaderPopup () {
      this.cascaderPopupVisible = true
    },
    closeCascaderPopup () {
      this.cascaderPopupVisible = false
    },
    cascaderFinish ({ selectedOptions }) {
      this.cascaderPopupVisible = false
      this.$set(this.item, 'text', selectedOptions.map((option) => option.name).join('/'))
    },
    prev (swipe) {
      this.$refs[swipe] && this.$refs[swipe][0] && this.$refs[swipe][0].prev()
    },
    next (swipe) {
      this.$refs[swipe] && this.$refs[swipe][0] && this.$refs[swipe][0].next()
    },
    onBlur () {
      this.$emit('saveAll')
    },
    changeFill () {
      this.isNotFilled = false
      this.$emit('saveAll')
    },
    inputFill () {
      this.isNotFilled = false
    },
    checkFill () {
      let params = {}
      if (this.item.type === 'radio') {
        const radioItem = this.item.options.find(item => item.id === this.item.radio)
        if (this.item.radio && radioItem.type !== 'other') {
          params.id = this.item.id
          params.type = 'radio'
          params.radio = this.item.radio
          params.text = this.item.text ? this.item.text : ''
          this.isNotFilled = false
          return params
        } else if (this.item.radio && radioItem.type === 'other' && this.item.text) {
          params.id = this.item.id
          params.type = 'radio'
          params.radio = this.item.radio
          params.text = this.item.text ? this.item.text : ''
          this.isNotFilled = false
          return params
        } else if (!this.item.required) {
          params.id = this.item.id
          params.type = 'radio'
          params.radio = ''
          params.text = ''
          this.isNotFilled = false
          return params
        } else {
          this.isNotFilled = true
          return false
        }
      }
      if (this.item.type === 'checkbox') {
        if (this.item.checkbox && this.item.checkbox.length) {
          params.id = this.item.id
          params.checkbox = this.item.checkbox,
          params.type = 'checkbox'
          params.text = this.item.text ? this.item.text : ''
          this.isNotFilled = false
          return params
        } else if (!this.item.required) {
          params.id = this.item.id
          params.checkbox = ''
          params.type = 'checkbox'
          this.isNotFilled = false
          return params
        } else {
          this.isNotFilled = true
          return false
        }
      }
      if (this.item.type === 'text' && (!this.item.options || this.item.options.length <= 0)) {
        if (this.item.text) {
          params.id = this.item.id
          params.text = this.item.text,
          params.type = 'text'
          this.isNotFilled = false
          return params
        } else if (!this.item.required) {
          params.id = this.item.id
          params.text = ''
          params.type = 'text'
          this.isNotFilled = false
          return params
        } else {
          this.isNotFilled = true
          return false
        }
      }
      if (this.item.type === 'text' && this.item.options && this.item.options.length > 0) {
        params.id = this.item.id
        params.type = 'text'
        params.text = []
        let options = this.item.options
        for (let i = 0; i < options.length; i++) {
          let value = []
          for (let j = 0; j < options[i].length; j++) {
            let text = options[i]['text' + (j + 1)]
            if (text) {
              value.push(text)
            }
          }
          if (value.length < this.item.minLength) {
            this.isNotFilled = true
            return false
          }
          params.text.push({
            id: options[i].id,
            value: value
          })
        }
        return params
      }
      this.isNotFilled = false
      return true
    }
  }
}
</script>

<style lang="less">
.main-body{
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
          justify-content: center;
          align-items: center;
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
  .van-radio-group{
    .van-radio{
      margin-bottom: 10px;
      .van-radio__label{
        font-size: 16px;
      }
    }
  }
  .van-checkbox-group{
    .van-checkbox{
      margin-bottom: 10px;
      .van-checkbox__label{
        font-size: 16px;
      }
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
  .my-swipe{
    width: 100%;
    .img-style{
      display: block;
      width: 100%;
      height: auto;
      margin-bottom: 10px;
    }
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
  .sub-title{
    margin: 0;
    padding: 0;
    font-size: 14px;
    color: #000;
    padding-left: 28px;
    margin-bottom: 10px;
  }
  .title{
    margin: 0;
    padding: 0;
  }
  .van-radio__label{
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
.not-filled{
  border: 1px dashed rgb(255, 64, 64);
}
</style>