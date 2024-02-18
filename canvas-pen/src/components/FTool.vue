<template>
  <div class="page">
    <!-- <div class="page-header">
      <h2>图形标注</h2>
    </div> -->
    <div class="panel-content">
      <div class="content-demo" tabindex="100">
        <canvas id="img-ctx" width="950" height="600"></canvas>
      </div>
      <div class="draw-btn-group">
        <!-- <i class="draw-icon icon-back" @click = editDraw()></i> -->
        <!-- <i class="draw-icon icon-mouse" @click = editDraw()></i> -->
        <!-- <i class="draw-icon icon-circle"></i> -->
        <!-- <i class="draw-icon icon-rect" @click="drawTool('rect')"></i> -->
        <!-- <i class="draw-icon icon-polygon"></i> -->
        <!-- <i class="draw-icon icon-pen"></i> -->
        <button @click = editDraw()>图形编辑</button>
        <button @click = "drawTool('rect')">矩形绘制</button>
        <button @click="rebackCanvas()">初始化画布</button>
        <button @click="drawTool('FPoint')">画红点</button>
        <button @click="fabricToolObj.reSetpenTool();drawTool('pen')">钢笔工具</button>
        <button @click="finishPen">钢笔结束</button>
        <button @click="drawTool('line')">直线</button>
        <button @click="drawTool('dottedLine')">虚线</button>
        <button @click="fabricToolObj.drawFree()">自由绘制</button>
        <button @click="fabricToolObj.getCanvasObjects()">获取画布信息</button>
        <button @click="fabricToolObj.startEraser()">橡皮擦</button>
      </div>
    </div>
  </div>
</template>

<script>
import {fabricTool} from '../utils/fabricTool.js'
export default {
  name: 'FTool',
  data() {
    return {
      fabricToolObj: null,
      article:'https://www.cnblogs.com/huangcy/p/9559695.html',
      test:"https://github.com/lgq627628/2020/tree/master/%E5%9B%BE%E5%BD%A2%E5%AD%A6/fabric"
    }
  },
  methods:{
    init() {
      let img = 'https://clubimg.club.vmall.com/data/attachment/forum/202108/22/182949mtoxhphast0upmq0.png'
      this.fabricToolObj = new fabricTool()
      this.fabricToolObj.setBackImg(img)
    },
    rebackCanvas() {
      this.fabricToolObj.rebackCanvas()
    },
    editDraw(){
      this.fabricToolObj.selectionObj()
    },
    drawTool(type) {
      this.fabricToolObj.drawType = type
    },
    finishPen(){
      this.fabricToolObj.penFinished()
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
  width: 50%;
  height: 90%;
  position: relative;
}
.content-demo:focus {
  border: none;
}

:deep(.canvas-container) {
  position: absolute !important;
}

.panel-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 700px;
}

.draw-btn-group {
  width: 50%;
  height: 5%;
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
