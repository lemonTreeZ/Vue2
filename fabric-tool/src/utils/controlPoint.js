const pointStyle = {
  control_point_radius: 4,
  control_point_color: '#005cf9'
}

/**
 * @param x 贝塞尔曲线控制点横坐标
 * @param y 贝塞尔曲线控制点纵坐标
 */
export class ControlPoint {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
  }
  
  //绘制控制点
  draw(ratio) {
    ratio = ratio || 1
    this.ctx.beginPath()
    this.ctx.arc(this.x * ratio, this.y * ratio, pointStyle.control_point_radius, 0, Math.PI * 2, false)
  }
  //渲染控制点
  print(ratio) {
    this.draw(ratio)
    this.ctx.save()
    this.ctx.strokeStyle = pointStyle.control_point_color
    this.ctx.fillStyle = pointStyle.control_point_color
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.restore()
  }
  //判断点是否在当前路径内
  isInPoint(x, y) {
    this.draw()
    if(this.ctx.isPointInPath(x, y)) {
      return true
    }
    // console.log("current",this.ctx.isPointInPath(x, y))
    return false
  }
}