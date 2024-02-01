import { ControlPoint } from './controlPoint'
import { PathTool } from './pathTool'
import { EndPoint } from './endPoint'

export class PenTool {
  constructor (canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.stroke_color = '#ffc107'
    this.keyBoard = document.getElementById("content-demo")
  }

  reset () {
    this.paths = []
    this.paths.push(new PathTool())
    this.dragging = false  
    this.editCpBalance = false 
    this.isNewEndPoint = false  
    this.currentEndPoint = null  
    this.draggingControlPoint = null  
    ControlPoint.prototype.ctx = this.ctx
    EndPoint.prototype.ctx = this.ctx
    EndPoint.prototype.canvas = this
    this.active()
  }

  onMouseDown(e) {
    console.log("mouse:dwon")
    let location = e.absolutePointer
    let selectedPath = this.getSelectedPath()
    this.dragging = true
    this.isNewEndPoint = false
    this.draggingControlPoint = false
    this.currentEndPoint = this.isExistPoint(location.x, location.y)
    this.removeSelectedEndPoint()

    if(this.currentEndPoint ){
      this.currentEndPoint.selected = true;
      if(this.editCpBalance && !this.draggingControlPoint) {
        let ced = this.currentEndPoint
        ced.cpBalance = true
        ced.cp0.x = ced.cp1.x = ced.x
        ced.cp0.y = ced.cp1.y = ced.y
        this.isNewEndPoint = true
      }

      if(!this.draggingControlPoint && this.currentEndPoint === this.paths[this.paths.length -1][0] && this.paths[this.paths.length -1].length > 2){
          this.createPath()
      }
    } else {
       this.currentEndPoint = this.createEndPoint(location.x, location.y)
       this.isNewEndPoint = true;
       if(this.editCpBalance && selectedPath){
         selectedPath.path.addEndPoint(selectedPath.ep, this.currentEndPoint)
      }else {
        this.paths[this.paths.length - 1].push(this.currentEndPoint)
      }
    }
    this.renderer()
  }

  onMouseMove(e) {
    e.e.preventDefault()
    if(!this.dragging) {
      return
    }
    let loc = e.absolutePointer
    let ced = this.currentEndPoint

    if(this.isNewEndPoint){
        ced.cp1.x = loc.x
        ced.cp1.y = loc.y
        ced.cp0.x = ced.x * 2 - loc.x
        ced.cp0.y = ced.y * 2 - loc.y
    } else if (this.draggingControlPoint){
        if(this.editCpBalance){
            ced.cpBalance = false
        }
        this.draggingControlPoint.x = loc.x
        this.draggingControlPoint.y = loc.y
        ced.calculateControlPoint(loc.x, loc.y, this.draggingControlPoint)
    } else {
        let offset = {
          x: loc.x - ced.x,
          y: loc.y-ced.y
        }
        ced.x = loc.x
        ced.y = loc.y
        ced.cp1.x += offset.x
        ced.cp1.y += offset.y
        ced.cp0.x += offset.x
        ced.cp0.y += offset.y
    }
    this.renderer()
  }

  onMouseUp(e) {
    console.log(e)
    this.dragging = false
    if(this.draggingControlPoint){
      if(this.draggingControlPoint.counterpart) {
        delete this.draggingControlPoint.counterpart.staticDistance
      }
      delete this.draggingControlPoint.counterpart
      this.draggingControlPoint = false
    }
  }

  onKeyDown(e) {
    console.log("key",e.keyCode)
    switch(e.keyCode) {
      case 8: 
        e.preventDefault()
        this.deleteEndPoint()
        this.renderer()
    }
  }
  
  active() {
    let that = this
    let listeners = {
      mousedown(e) { that.onMouseDown(e) },
      mousemove(e) { that.onMouseMove(e) },
      mouseup(e) { that.onMouseUp(e) },
      keydown(e) { that.onKeyDown(e) }
    }
    this.canvas.on('mouse:down', listeners.mousedown)
    this.canvas.on('mouse:move', listeners.mousemove, false)
    this.canvas.on('mouse:up', listeners.mouseup, false)
    this.keyBoard.addEventListener('keydown', listeners.keydown, false)
  }


  createPath() {
    this.paths[this.paths.length - 1].isClose = true
    this.paths.push(new PathTool())
  }

  getSelectedPath() {
    for(let i = 0, len1 = this.paths.length; i < len1; i++){
      for(let j = 0, len2 = this.paths[i].length; j < len2; j++){
        if(this.paths[i][j].selected){
          return {
            path: this.paths[i],
            ep: this.paths[i][j]
          }
        }
      }
    }
    return null
  }

  removeSelectedEndPoint() {
    this.paths.forEach((path) => {
        path.removeSelected()
    })
  }

  createEndPoint(x, y) {
    let ep = new EndPoint(x, y)
    ep.selected = true
    return ep
  }

  deleteEndPoint() {
    let paths = this.paths
    for(let i = 0, l = paths.length; i < l; i++){
      paths[i].deleteSelected()
      if(paths[i].length === 0 && (i + 1 !== l)){
        paths.splice(i, 1)
        l = paths.length
        i--
      }
    }
  }

  isExistPoint(x, y) {
    let cep, i = 0, l
    for(l = this.paths.length; i< l; i++){
      cep = this.paths[i].isInPoint(x, y)
      if(cep){
        if(cep.cp instanceof ControlPoint){
            this.draggingControlPoint = cep.cp
        }
        return cep.ep
      }
    }
    return null
  }

  renderer() {
    let ep, prev_ep, ctx = this.ctx
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.paths.forEach((path) => {
      let len = path.length
      for(let i = 0; i < len; i++) {
        ep = path[i]
        ep.printControlPoints()
        if(i > 0) {
          prev_ep = path[i - 1]
          this.bezierCurveTo(prev_ep, ep, ctx)
        }
      }
      if(path.isClose){
          prev_ep = path[len - 1]
          ep = path[0]
          this.bezierCurveTo(prev_ep, ep, ctx)
      }
    })
  }

  bezierCurveTo(prev_ep, ep, ctx) {
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = this.stroke_color
    ctx.lineWidth = 2
    ctx.moveTo(prev_ep.x, prev_ep.y)
    ctx.bezierCurveTo(
        prev_ep.cp1.x, prev_ep.cp1.y,
        ep.cp0.x, ep.cp0.y,
        ep.x, ep.y
    )
    ctx.stroke()
    ctx.restore()
  }
}

