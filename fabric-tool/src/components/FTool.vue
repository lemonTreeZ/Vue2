<template>
  <div class="page">
    <!-- <div class="page-header">
      <h2>图形标注</h2>
    </div> -->
    <div class="panel-content">
      <div class="content-demo">
        <canvas id="canvas" width="1280" height="720"></canvas>
      </div>
      <div class="draw-btn-group">
        <!-- <i class="draw-icon icon-back"></i> -->
        <!-- <i class="draw-icon icon-mouse"></i> -->
        <i class="draw-icon icon-circle"></i>
        <i class="draw-icon icon-rect"></i>
        <i class="draw-icon icon-polygon"></i>
        <!-- <i class="draw-icon icon-pen"></i> -->
        <button @click="rebackCanvas">初始化画布</button>
        <button @click="toolPen">钢笔工具</button>
      </div>
    </div>
  </div>
</template>

<script>
import {fabricTool} from './../utils/fabricTool.js'
export default {
  name: 'FTool',
  data() {
    return {
      fabricToolObj: null
    }
  },
  methods:{
    init() {
      let img = 'https://clubimg.club.vmall.com/data/attachment/forum/202108/22/182949mtoxhphast0upmq0.png'
      this.fabricToolObj = new fabricTool()
      this.fabricToolObj.initFabricTool(img)
    },
    rebackCanvas() {
      this.fabricToolObj.rebackCanvas()
    },
    toolPen() {

    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}

.content-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.panel-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

canvas {
  border: 1px solid red;
}

.draw-btn-group {
  width: 1270px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
} 

i {
  display: flex;
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: 50% 50%;
  height: 30px;
  width: 30px;
}

.icon-back {
  background-image: url(./../assets/icon/back.png)
}

.icon-mouse {
  background-image: url(./../assets/icon/mouse.png)
}

.icon-circle {
  background-image: url(./../assets/icon/3.png)
}

.icon-rect {
  background-image: url(./../assets/icon/4.png)
}
.icon-polygon {
  background-image: url(./../assets/icon/6.png)
}
.icon-pen {
  background-image: url(./../assets/icon/7.png)
}
</style>
