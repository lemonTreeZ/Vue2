import { fabric } from "fabric"
import {drawLabelRect, renderIcon, drawColorPoint} from './fabricShape'
import {v4 as uv4} from 'uuid'
const delIcon = require('./../assets/icon/del.png')

export class fabricTool{
    constructor() {
        this.drawType = ''
        this.isDrag = false
        this.optionType = 'point'
        this.mouseDownPos = {}
        this.downPoint = null
        this.isDrawing = false
        this.upPoint = null
        this.moveCount = 0
        this.canvas = new fabric.Canvas('img-ctx',{
            fireRightClick: true,
            stopContextMenu: true
        })
        this.imgCanvas = new fabric.Canvas('img-canvas',{
            fireRightClick: true,
            stopContextMenu: true
        })
        this.keyBoard = document.querySelector(".content-demo")
        this.penTool = {
            pointPosition: [],
            path: [],
            str: '',
            pointArray :[],
            controlPoint1: null,
            controlPoint2: null,
            controlLine1: null,
            controlLine2: null,
            bessel: '',
            besselObj: null,
            controlPointX: 0,
            controlPointY: 0,
            penDrawing: false
        }
    }

    initFabricTool() {
        this.canvas.on('mouse:down',(e) => {this.mouseDownHandle(e)})
        this.canvas.on('mouse:up',(e) => {this.mouseUpHandle(e)})
        this.canvas.on('mouse:move',(e) => {this.mouseMoveHandle(e)})
        this.canvas.on("mouse:wheel",(e)=>{this.mouseWheelHandle(e)})
    }

    setBackImg(imgUrl) {
        fabric.Image.fromURL(imgUrl,(img) => {
            img.set({
                scaleX: this.imgCanvas.width / img.width,
                scaleY: this.imgCanvas.height / img.height,
                left: 0,
                top: 0
            })
            this.imgCanvas.setBackgroundImage(img,this.imgCanvas.renderAll.bind(this.imgCanvas))
        })
        this.initFabricTool()
    } 

    mouseDownHandle(e){
        if(e.e.altKey) {
            this.isDrag = true
            this.mouseDownPos.x = e.e.clientX
            this.mouseDownPos.y = e.e.clientY
        }
        this.downPoint = e.absolutePointer
        this.isDrawing = true
        if(this.drawType === 'pen') {
           if(this.penTool.str && this.penTool.str.indexOf('z') !== -1){
            this.removePoint()
            this.penDraw()
           } else if(e.target&&this.penTool.pointArray[0] && e.target.id === this.penTool.pointArray[0].id) {
                this.penFinish()
            }else{
                if(this.canvas.getActiveObject()) return
                this.penDraw()
            }
            this.penTool.isDrawing = true
        }
    }

    mouseMoveHandle(e) {
        if(this.isDrag) {
            let opt = e.e
            let vpt = this.imgCanvas.viewportTransform
            let cvpt = this.canvas.viewportTransform
            vpt[4] += opt.clientX - this.mouseDownPos.x
            vpt[5] += opt.clientY - this.mouseDownPos.y
            cvpt[4] += opt.clientX - this.mouseDownPos.x
            cvpt[5] += opt.clientY - this.mouseDownPos.y
            this.imgCanvas.requestRenderAll()
            this.canvas.requestRenderAll()
            this.mouseDownPos.x = opt.clientX
            this.mouseDownPos.y = opt.clientY
        }
        if(this.moveCount % 2 && !this.isDrawing) {
            return
        }
        this.moveCount++
        if(this.drawType === 'pen') {
            this.penMove(e)
        }
    }

    mouseUpHandle(e) {
        this.isDrag = false
        this.upPoint = e.absolutePointer
        if(this.isDrag) {
            this.canvas.setViewportTransform(this.canvas.viewportTransform)
            this.isDrag = false
        }
        this.moveCount = 1
        if(this.isDrawing) {this.startDraw()}
        if(this.drawType === 'pen') {
            this.penUp()
        }
        this.isDrawing = false
        this.downPoint = null
        this.upPoint = null
    }

    mouseWheelHandle(e) {
        let zoomDirection = e.e.deltaY
        let zoom = this.imgCanvas.getZoom()
        zoom *= 0.999 ** zoomDirection
        if (zoom > 20) zoom = 20
        if (zoom < 0.01) zoom = 0.01
        zoom *= 0.999 ** zoomDirection
        this.imgCanvas.zoomToPoint(
            {
              x: e.e.offsetX, 
              y: e.e.offsetY  
            },
            zoom 
        )
        this.canvas.zoomToPoint(
            {
              x: e.e.offsetX, 
              y: e.e.offsetY  
            },
            zoom 
        )
    }

    keyDownHandle(e) {
        switch(e.keyCode) {
            case 8: 
              e.preventDefault()
              this.deleteEndPoint()
              this.renderer()
              break
        }
    }

    rebackCanvas() {
        this.canvas.setZoom(1)
        this.imgCanvas.setZoom(1)
        let vpt = this.canvas.viewportTransform
        let mvpt = this.imgCanvas.viewportTransform
        mvpt[4] = 0
        mvpt[5] = 0
        vpt[4] = 0
        vpt[5] = 0
        this.canvas.requestRenderAll()
        this.imgCanvas.requestRenderAll()
    }

    destroy() {
        this.canvas.off('mouse:down')
        this.canvas.off('mouse:move')
        this.canvas.off('mouse:up')
        this.canvas.dispose()
    }

    startDraw() {
        switch(this.drawType) {
            case 'rect':
                this.drawRect()
                break
            case 'FPoint':
                this.drawPoint('red')
                break
        }
    }

    drawRect() {
        this.canvas.skipTargetFind = true
        if(JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)) return
        const top = Math.min(this.downPoint.y,this.upPoint.y)
        const left = Math.min(this.downPoint.x,this.upPoint.x)
        const width = Math.abs(this.downPoint.x - this.upPoint.x)
        const height = Math.abs(this.downPoint.y - this.upPoint.y)
        const id = uv4()
        if(width < 2 || height < 2) return
        let params = {
            id,width,height,top,left,
            drawType: "rect",
            label:'测试'
        }
        let rect = drawLabelRect(params)
        this.canvas.add(rect)
    }

    drawPoint(color) {
        let params = {
            id: uv4(),
            color: color,
            label:'测试',
            drawType: 'point',
            x: this.upPoint.x,
            y: this.upPoint.y
        }
        let cp =  drawColorPoint(params)
        this.canvas.add(cp)
    }

    setControlsStyle() {
        fabric.Object.prototype.cornerStyle = "circle"
        fabric.Object.prototype.cornerSize = 10
        fabric.Object.prototype.cornerColor = "white"
        fabric.Object.prototype.transparentCorners = false
        this.createDelIcon(this.canvas)
    }

    drawCircle() {

    }

    drawFree() {

    }

    selectionObj() {
        this.drawType = 'edit'
        this.setControlsStyle()
        this.canvas.skipTargetFind = false
        this.canvas.getObjects().forEach(ele => {
            ele.set('selectable',true)
        })
    }

    deleteSelectedObj() {
        let activeObj = this.canvas.getActiveObject()
        if (activeObj) {
            this.canvas.remove(activeObj)
            this.canvas.renderAll()
        }
    }

    createDelIcon(canvas) {
        const deletecallback = (img, isError) => {
            if (!isError) {
                fabric.Object.prototype.controls.delete = new fabric.Control({
                    x: 0,
                    y: -0.5,
                    offsetX: 28,
                    offsetY: -20,
                    cursorStyle: 'pointer',
                    mouseUpHandler: () => {
                        let activeObj = canvas.getActiveObject()
                        if (activeObj) {
                            canvas.remove(activeObj)
                            canvas.renderAll()
                        }
                    },
                    render: renderIcon(img._element, 0),
                    cornerSize: 39
                })
            }
        }
        fabric.Image.fromURL(delIcon, deletecallback)
    }

    initPen(){
      
    }

    penDraw() {
        let id = new Date().getTime() + Math.random() 
        let circle = new fabric.Circle({
          radius: 3,
          fill: 'red',
          left: this.downPoint.x,
          top: this.downPoint.y,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          originX: 'center',
          originY: 'center',
          id: id
        })
        this.canvas.add(circle)
        this.penTool.pointPosition.push({
          x: this.downPoint.x,
          y: this.downPoint.y
        })
        if (this.penTool.pointPosition.length == 1) {
          this.penTool.str = 'M' + this.penTool.pointPosition[0].x + ' ' + this.penTool.pointPosition[0].y
          this.penTool.path = new fabric.Path(this.penTool.str)
          this.penTool.path.set({
            fill: 'blue',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false
          })
          this.canvas.add(this.penTool.path)
          this.penTool.pointArray.push(circle)
        }
        if (this.penTool.pointPosition.length <= 1) return
        let length = this.penTool.pointPosition.length - 1
        this.canvas.remove(this.penTool.path) 
        this.penTool.str = this.penTool.str + 'L' + this.penTool.pointPosition[length].x + ' ' + this.penTool.pointPosition[length].y // 路径拼接
        this.penTool.path = new fabric.Path(this.penTool.str)
        this.penTool.path.set({
          fill: 'green',
          strokeWidth: 1.5,
          stroke: '#1a80ff',
          selectable: true,
          hasBorders: false,
          hasControls: false,
          evented: false
  
        })
        this.canvas.add(this.penTool.path)
        this.canvas.renderAll()
        this.penTool.pointArray.push(circle)
    }

    penMove(e) {
        if(this.penTool.isDrawing) {
            this.dragMousePoint(e)
        }
    }

    penUp(){
        this.penTool.isDrawing = false
        this.canvas.selection = true
        if (this.penTool.bessel) {
            if (this.penTool.str.lastIndexOf('L') !== -1) {
                this.penTool.str = this.penTool.str.substring(0, this.penTool.str.lastIndexOf('L'))
            }
            if (this.penTool.str.indexOf('z') !== -1) {
                this.penTool.str = this.penTool.str.substring(0, this.penTool.str.indexOf('z'))
                this.penTool.bessel = this.penTool.bessel + 'z'
            }
            this.penTool.str = this.penTool.str + this.penTool.bessel
            this.penTool.bessel = ''
        }
    }

    penFinish() {
        this.canvas.remove(this.penTool.path)
        this.penTool.pointPosition.push({
            x: this.penTool.pointPosition[0].x,
            y: this.penTool.pointPosition[0].y
        })
        this.penTool.str = this.penTool.str + 'z'
        this.penTool.path = new fabric.Path(this.penTool.str)
        this.penTool.path.set({
            fill: '#7c4529',
            strokeWidth: 1.5,
            stroke: '#1a80ff'
        })
        this.canvas.add(this.penTool.path)
        this.penTool.isDrawing = false
        console.log("this.penTool",this.canvas.getObjects())
        this.removePoint()
        this.canvas.renderAll()
        
    }

    removePoint() {
        for (let item of this.penTool.pointArray) {
          this.canvas.remove(item)
        }
        if (this.penTool.bessel) {
            this.canvas.remove(this.penTool.besselObj)
            this.penTool.besselObj = null
            if (this.penTool.path) this.canvas.remove(this.penTool.path)
            this.penTool.path = new fabric.Path(this.penTool.str)
            this.penTool.path.set({
              fill: '#7c4529',
              strokeWidth: 1.5,
              stroke: '#1a80ff',
            })
            this.canvas.add(this.penTool.path)
        }
        this.penTool.str = ''
        this.penTool.pointArray = []
        this.penTool.pointPosition = []
        this.penTool.path.set({
          stroke: null, 
        })
        this.canvas.renderAll()
    }

    dragMousePoint(e) {
        let length = this.penTool.pointPosition.length - 1
        this.drawControlLine1(e,length)
        this.drawControlLine2(e,length)
        this.drawControlPoint(e)
        this.besselCurve(length)
    }

    drawControlPoint(e) {
        if(!this.penTool.controlPoint1) {
            this.penTool.controlPoint1 = new fabric.Circle({
                radius: 4,
                fill: 'white',
                left: e.absolutePointer.x,
                top: e.absolutePointer.y,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX: 'center',
                originY: 'center',
                strokeWidth: 0.8,
                stroke: '#1a80ff'
            })
            this.penTool.controlPoint2 = new fabric.Circle({
                radius: 4,
                fill: 'white',
                left: this.penTool.controlPointX,
                top: this.penTool.controlPointY,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX: 'center',
                originY: 'center',
                strokeWidth: 0.8,
                stroke: '#1a80ff'
            })
            this.canvas.add(this.penTool.controlPoint1)
            this.canvas.add(this.penTool.controlPoint2)
        }
        this.penTool.controlPoint1.set({
            left: e.absolutePointer.x,
            top: e.absolutePointer.y
        })
        this.penTool.controlPoint2.set({
            left: this.penTool.controlPointX,
            top: this.penTool.controlPointY
        })
    }
    
    drawControlLine1(e,length) {
        if (this.penTool.controlLine1) this.canvas.remove(this.penTool.controlLine1)
        this.canvas.selection = false
        this.penTool.controlLine1 = new fabric.Line([this.penTool.pointPosition[length].x, this.penTool.pointPosition[length].y,
          e.absolutePointer.x, e.absolutePointer.y
        ], {
          strokeWidth: 2,
          fill: '#999999',
          stroke: '#999999',
          class: 'line',
          originX: 'center',
          originY: 'center',
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false
        })
        this.canvas.add(this.penTool.controlLine1)
    }

    drawControlLine2(e, length) {
        let moveX = e.absolutePointer.x
        let moveY = e.absolutePointer.y
        let originX = this.penTool.pointPosition[length].x
        let originY = this.penTool.pointPosition[length].y

      if (this.penTool.controlLine2) this.canvas.remove(this.penTool.controlLine2)
      this.penTool.controlPointX = 2 * originX - moveX
      this.penTool.controlPointY = 2 * originY - moveY
      this.canvas.selection = false
      this.penTool.controlLine2 = new fabric.Line([originX, originY,
        this.penTool.controlPointX, this.penTool.controlPointY
      ], {
        strokeWidth: 2,
        fill: '#999999',
        stroke: '#999999',
        class: 'line',
        originX: 'center',
        originY: 'center',
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false
      });
      this.canvas.add(this.penTool.controlLine2)
    }

    besselCurve(length) {
        this.penTool.bessel = 'M' + 
                              this.penTool.pointPosition[length-1].x + '' +
                              this.penTool.pointPosition[length-1].y + 'Q' +
                              this.penTool.controlPointX + '' + 
                              this.penTool.controlPointY + '' +
                              this.penTool.pointPosition[length].x + ''+
                              this.penTool.pointPosition[length].y
        if(this.penTool.besselObj) {
            this.canvas.remove(this.penTool.besselObj)
        }
        this.penTool.besselObj = new fabric.Path(this.penTool.bessel)
        this.penTool.besselObj.set({
            fill: '#7c4529',
            strokeWidth: 1.5,
            stroke: '#1a80ff',
            selectable: true,
            hasBorders: false,
            hasControls: false,
            evented: false
        })
        this.canvas.add(this.penTool.besselObj)
        this.penTool.bessel = ' Q ' + this.penTool.controlPointX + ' ' + this.penTool.controlPointY + ' ' + this.penTool.pointPosition[length].x + ' ' + this.penTool.pointPosition[length].y
    }

    getCanvasObjects() {

    }
}

 