<template>
  <div class="app-page">
    <router-view class="app-main" />
    <van-number-keyboard safe-area-inset-bottom />
  </div>
</template>

<style lang="less">
.app-page{
  font-family: Bentley,simhei,RegularEng,Helvetica,Avenir,Arial,sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
  .app-main{
    max-width: 500px;
    margin: 0 auto;
    background: #fff;
    min-height: 100vh;
  }
}
</style>