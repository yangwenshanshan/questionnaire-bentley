<template>
  <div ref="rankPage" class="rank-page" :style="rankData && rankData.css && rankData.css.backgroundColor ? 'background:' + rankData.css.backgroundColor : ''" v-if="rankData">
    <div class="app-top" v-if="!rankData.css || !rankData.css.backgroundImage">
      <img src="../../assets/bentley_logo.png" alt="">
    </div>
    <div class="banner-img" v-if="rankData.cover || (rankData.css && rankData.css.backgroundImage)">
      <img v-if="rankData.css && rankData.css.backgroundImage" :src="rankData.css.backgroundImage" alt="">
      <img v-else :src="rankData.cover" alt="">
    </div>
    <div class="main-title" :style="rankData && rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor : ''">{{rankData.title}}</div>
    <!-- <div class="main-title" style="color:#fff">{{rankData.title}}</div> -->
    <!-- <div class="rank-list" style="margin-top:0" v-if="rankData.my">
      <div class="rank-item" style="padding-bottom: 0">
        <p class="item-num" :style="rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor : ''">{{rankData.my.rank}}</p>
        <div class="item-img" :style="rankData.css && rankData.css.titleColor ? 'background:' + rankData.css.titleColor : ''">
          <img :src="rankData.my.headImgUrl ? rankData.host + rankData.my.headImgUrl : ''" alt="">
        </div>
        <div class="item-info" :style="rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor : ''">
          <p class="info-name">{{rankData.my.surname}} {{rankData.my.firstName}}</p>
          <p class="info-dealer">{{rankData.my.dealerName}}</p>
        </div>
        <p class="item-point" :style="rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor : ''">{{rankData.my.point}}</p>
      </div>
    </div> -->
    <div class="rank-list">
      <div class="rank-item-top" :style="rankData.css && rankData.css.titleColor ? 'border: 1px dashed ' + rankData.css.titleColor : 'border: 1px dashed #fff;'">
        <div class="rank-item rank-me" v-if="rankData.my">
          <div class="item-img" :style="rankData.css && rankData.css.titleColor ? 'background:' + rankData.css.titleColor : ''">
            <img :src="rankData.my.headImgUrl ? rankData.host + rankData.my.headImgUrl : ''" alt="">
          </div>
          <div class="item-info" :style="rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor : ''">
            <p class="info-name">{{rankData.my.surname}} {{rankData.my.firstName}}</p>
            <p class="info-dealer">{{rankData.my.dealerName}}</p>
          </div>
        </div>
        <div class="rank-me-info">
          <div class="info-item" :style="rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor : ''">
            <p class="item-title">我的分数</p>
            <p class="item-point"><span class="point-number">{{rankData.my.point}}</span><span>分</span></p>
          </div>
          <div class="item-line" :style="rankData.css && rankData.css.titleColor ? 'background:' + rankData.css.titleColor : ''"></div>
          <div class="info-item" :style="rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor : ''">
            <p class="item-title">我的排名</p>
            <p class="item-point"><span class="point-number">{{rankData.my.rank}}</span></p>
          </div>
        </div>
      </div>
      <div class="list-title">
        <!-- <p :style="rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor + ';border-bottom: 1px dashed ' + rankData.css.titleColor : ''" class="title-main">Top <span class="title-number">{{top}}</span></p> -->
        <p class="title-main">Top <span class="title-number">{{top}}</span></p>
      </div>
      <div class="rank-item" v-for="item in rankData.top" :key="item.id">
        <!-- <p class="item-num" :style="rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor : ''">{{item.rank}}</p> -->
        <p class="item-num" style="color:#fff">{{item.rank}}</p>
        <div class="item-img" :style="rankData.css && rankData.css.titleColor ? 'background:' + rankData.css.titleColor : ''">
          <img :src="item.headImgUrl ? rankData.host + item.headImgUrl : ''" alt="">
        </div>
        <!-- <div class="item-info" :style="rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor : ''"> -->
        <div class="item-info" style="color:#fff">
          <p class="info-name">{{item.surname}} {{item.firstName}}</p>
          <p class="info-dealer">{{item.dealerName}}</p>
        </div>
        <!-- <p class="item-point" :style="rankData.css && rankData.css.titleColor ? 'color:' + rankData.css.titleColor : ''"><span class="point-number">{{item.point}}</span>分</p> -->
        <p class="item-point" style="color:#fff"><span class="point-number">{{item.point}}</span>分</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/common/api'
export default {
  mounted () {
    this.top = this.$route.query.top
    this.getBoardTop()
  },
  data () {
    return {
      top: '',
      rankData: null,
      locale: 'zh_CN',
    }
  },
  methods: {
    getBoardTop () {
      api.getBoardTop({
        _locale: this.locale,
        ...this.$route.query
      }).then(res => {
        if (res.code === 0) {
          this.rankData = res.data
        }
      })
    },
    updateHeadImg () {

    },
  }
}
</script>

<style lang="less">
.rank-page {
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
  .rank-list{
    padding: 0 20px;
    // padding: 10px 16px;
    // margin: 20px 20px 0 20px;
    // box-shadow: 0px 0px 6px #fff;
    .rank-item-top{
      padding: 10px 20px 0 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .rank-item{
      color: #fff;
      display: flex;
      font-size: 14px;
      align-items: center;
      padding: 0 13px 30px 13px;
      .item-num{
        font-size: 20px;
        text-align: center;
        margin: 0 20px 0 0;
      }
      .item-img{
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 50%;
        background: #fff;
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
        font-size: 14px;
        .point-number{
          font-size: 28px;
        }
      }
    }
    .rank-me{
      padding: 0;
      .item-info{
        .info-name{
          font-size: 24px;
          line-height: 1.2;
        }
        .info-dealer{
          font-size: 16px;
        }
      }
    }
  }
  .rank-me-info{
    color: #fff;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 6px;
    padding: 5px;
    margin-top: 10px;
    p{
      margin: 0;
    }
    .item-line{
      width: 1px;
      height: 30px;
    }
    .info-item{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .item-point{
        font-size: 14px;
        .point-number{
          font-size: 32px;
        }
      }
      .item-title{
      }
    }
  }
  .list-title{
    margin-bottom: 20px;
    .title-main{
      text-align: center;
      color: #fff;
      border-bottom: 1px dashed #fff;
      .title-number{

      }
    }
  }
}
</style>