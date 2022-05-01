<template>
  <div class="app-page">
    <div class="app-top">
      <img src="./assets/bentley_logo.png" alt="">
      <!-- <select class="select-main">
        <option value="">11111</option>
        <option value="">11111</option>
      </select> -->
    </div>
    <router-view />
    <van-number-keyboard safe-area-inset-bottom />
  </div>
</template>

<style lang="less">
.app-page{
  .app-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 30px;
    img{
      width: 22.4vw;
      height: 11.2vw;
      margin: 5.333vw;
    }
    .select-main{
      height: 30px;
      border: none;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 0 10px;
      outline: none;
      option{
        border: none;
      }
    }
  }
}
</style>