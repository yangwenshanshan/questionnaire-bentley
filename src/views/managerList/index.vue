<template>
  <div ref="managerPage" class="manager-page" v-if="managerData">
    <div class="manager-list">
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
          <van-uploader :after-read="(file) => afterRead(file, item)" accept="image/*" capture="camera">
            <van-button icon="plus" type="primary">拍照</van-button>
          </van-uploader>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/common/api'
import { Toast } from 'vant'

export default {
  mounted () {
    Toast.allowMultiple()
    this.getGmList()
  },
  data () {
    return {
      locale: 'zh_CN',
      managerData: null,
      uploadData: null
    }
  },
  methods: {
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
      const formData = new FormData()
      formData.append('file', file.file);
      this.showLoading('图片上传中')
      api.uploadFile(formData).then(res => {
        if (res.code === 0) {
          this.uploadData = res.data
          this.updateHeadImg({
            url: res.data.url,
            hubId: item.hubId
          })
        } else {
          this.hideLoading()
        }
      }).catch(() => {
        this.hideLoading()
      })
    },
  }
}
</script>

<style lang="less">
.manager-page {
  padding-top: 20px;
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
  .banner-img{
    width: 100%;
    img{
      width: 100%;
      height: auto;
    }
  }
  .manager-list{
    padding: 0 20px;
    .manager-item{
      color: #000;
      display: flex;
      font-size: 14px;
      align-items: center;
      padding-bottom: 20px;
      .item-num{
        font-size: 20px;
        text-align: center;
        margin: 0 20px 0 0;
      }
      .item-img{
        width: 60px;
        height: 60px;
        overflow: hidden;
        border-radius: 50%;
        background: #000;
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
        .info-dealer{
          margin: 0;
          font-size: 12px;
        }
        .info-name{
          margin: 0;
          font-size: 16px;
        }
      }
      .item-point{
        margin: 0;
      }
    }
  }
}
</style>