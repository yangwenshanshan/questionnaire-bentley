<template>
  <div ref="managerPage" class="manager-page" style="background: rgb(24, 24, 24);" v-if="managerData">
  <!-- <van-nav-bar title="训练营"/> -->
    <div class="banner-img">
      <img src="../../assets/q1.jpg" alt="">
    </div>
    <div class="manager-list" v-show="!vueCropperImg">
      <div class="manager-item" v-for="item in managerData.list" :key="item.id">
        <!-- <p class="item-num" >{{item.rank}}</p> -->
        <div class="item-img">
          <img :src="item.headImgUrl ? managerData.host + item.headImgUrl : ''" alt="">
        </div>
        <div class="item-info">
          <p class="info-name">{{item.surname}} {{item.firstName}}</p>
          <p class="info-dealer">{{item.dealerName}}</p>
        </div>
        <div>
          <van-uploader :after-read="(file) => afterRead(file, item)" accept="image/*">
            <img class="uploader-icon" src="../../assets/camera.png" alt="">
            <!-- <van-button icon="plus" type="primary">拍照</van-button> -->
          </van-uploader>
        </div>
      </div>
    </div>
    <div class="cut" v-show="vueCropperImg">
      <vueCropper ref="cropper" :img="vueCropperImg" :canMove="false" autoCrop fixed centerBox></vueCropper>
      <div class="cut-btn-list">
        <van-button type="default" @click="clearImg">取 消</van-button>
        <van-button type="info" @click="startCrop">确 认</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/common/api'
import { Toast } from 'vant'
import { VueCropper }  from 'vue-cropper' 

export default {
  components: {
    VueCropper
  },
  created () {
    document.title = '积分排行榜'
  },
  mounted () {
    Toast.allowMultiple()
    this.getGmList()
  },
  data () {
    return {
      locale: 'zh_CN',
      managerData: null,
      uploadData: null,
      vueCropperImg: null,
      fileName: '',
      activeItem: null,
      scrollHeight: 0
    }
  },
  methods: {
    clearImg () {
      this.vueCropperImg = null
      this.$nextTick(() => {
        window.scrollTo(0, this.scrollHeight)
      })
    },
    base64ImgtoFile(dataurl, filename) { 
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
    },
    startCrop () {
      this.$refs.cropper.getCropData(data => {
        const file = this.base64ImgtoFile(data, this.fileName)
        const formData = new FormData()
        formData.append('file', file);
        this.showLoading('图片上传中')
        api.uploadFile(formData).then(res => {
          if (res.code === 0) {
            this.fileName = ''
            this.vueCropperImg = null
            this.uploadData = res.data
            this.activeItem && this.updateHeadImg({
              url: res.data.url,
              hubId:  this.activeItem.hubId
            })
            this.$nextTick(() => {
              window.scrollTo(0, this.scrollHeight)
            })
          } else {
            this.hideLoading()
          }
        }).catch(() => {
          this.hideLoading()
        })
      })
    },
    showLoading (message) {
      this.toast = Toast.loading({
        message: message || '加载中...',
        overlay: true,
        forbidClick: true,
        duration: 0
      })
    },
    hideLoading () {
      if (this.toast) {
        this.toast.clear()
        this.toast = null
      }
    },
    updateHeadImg (data) {
      api.updateHeadImg(data).then(res => {
        this.hideLoading()
        if (res.code === 0) {
          this.getGmList()
        } else {
          this.hideLoading()
        }
      }).catch(() => {
        this.hideLoading()
      })
    },
    getGmList () {
      this.showLoading()
      api.getGmList().then(res => {
        this.hideLoading()
        if (res.code === 0) {
          this.managerData = res.data
        }
      }).catch(() => {
        this.hideLoading()
      })
    },
    afterRead (file, item) {
      this.scrollHeight = window.scrollY
      this.fileName = file.file.name
      this.vueCropperImg = file.content
      this.activeItem = item
    },
  }
}
</script>

<style lang="less">
.manager-page {
  // padding-top: 20px;
  position: relative;
  color: #fff;
  .main-title{
    // background-color: rgba(255,255,255,0.9);
    padding: 10px 10px 20px 10px;
    width: 100%;
    color: rgba(0,50,32,.7);
    color: #fff;
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
  .banner-img{
    width: 100%;
    img{
      width: 100%;
      height: auto;
    }
  }
  .manager-list{
    // padding: 20px 20px;
    .manager-item{
      color: #000;
      display: flex;
      font-size: 14px;
      align-items: center;
      // padding-bottom: 20px;
      padding: 10px 20px;
      border-bottom: 1px solid rgba(35,35,35,1);;
      // background: rgba(36,36,36,1);
      .item-num{
        font-size: 20px;
        text-align: center;
        margin: 0 20px 0 0;
      }
      .item-img{
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 5px;
        background: rgb(218, 189, 165);
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          width: 100%;
          object-fit: contain;
        }
      }
      .item-info{
        margin-left: 20px;
        flex: 1;
        color: #fff;
        .info-dealer{
          margin: 0;
          font-size: 12px;
          color: rgb(95, 95, 95);
          line-height: 1.3;
        }
        .info-name{
          margin: 0;
          font-size: 16px;
          color: rgb(127, 145, 165);
          line-height: 1.3;
        }
      }
      .item-point{
        margin: 0;
      }
    }
  }
  .cut{
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    .vue-cropper{
      background: #000;
    }
    .cut-btn-list{
      position: absolute;
      bottom: 20px;
      left: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
  .van-nav-bar__content{
    background: #000;
    .van-nav-bar__title{
      color: #fff;
    }
  }
  .uploader-icon{
    width: 30px;
    height: 30px;
  }
  .van-button{
    padding: 0 30px;
  }
}
</style>