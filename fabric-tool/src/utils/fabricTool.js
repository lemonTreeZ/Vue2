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
            path: null,
            str: '',
            pointArray :[],
            bessel: '',
            besselObj: null,
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
      if(this.penTool.path) {
        this.removePoint()
      }
    }

    penDraw() {
        this.penTool.isDrawing = true
        let id = uv4()
       
        this.penTool.currentPoint = {
            x:this.downPoint.x,
            y:this.downPoint.y,
            id: id,
            p0: null,
            p1: null,
            controlPoint: null,
            line1:null,
            line2:null
        }
        this.penTool.pointPosition.push(this.penTool.currentPoint)
        let circle = new fabric.Circle({
            radius: 3,
            fill: 'white',
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
        if (this.penTool.pointPosition.length === 1) {
          this.penTool.str = 'M' + this.penTool.pointPosition[0].x + ' ' + this.penTool.pointPosition[0].y
          this.penTool.path = new fabric.Path(this.penTool.str)
          this.penTool.path.set({
            fill: 'white',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false
          })
          this.canvas.add(this.penTool.path)
          this.penTool.pointArray.push(circle)
        }
        this.penTool.pointArray.push(circle)
        if (this.penTool.pointPosition.length <= 1) return
        this.canvas.remove(this.penTool.path) 
        this.penRender()
    }

    penMove(e) {
        if(this.penTool.isDrawing) {
            this.dragMousePoint(e)
            this.penRender()
        }
    }

    penUp(){
        this.penTool.isDrawing = false
        this.canvas.selection = true
        if (this.penTool.currentPoint.bessel) {
            if (this.penTool.str.lastIndexOf('L') !== -1) {
                this.penTool.str = this.penTool.str.substring(0, this.penTool.str.lastIndexOf('L'))
            }
            if (this.penTool.str.indexOf('z') !== -1) {
                this.penTool.str = this.penTool.str.substring(0, this.penTool.str.indexOf('z'))
                this.penTool.currentPoint.bessel = this.penTool.currentPoint.bessel + 'z'
            }
            this.penTool.str += this.penTool.currentPoint.bessel
            this.penRender()
        }
        this.penRender()
    }
    penRender() {
        let length = this.penTool.pointPosition.length - 1
        this.penTool.str = this.penTool.str + 'L' + this.penTool.pointPosition[length].x + ' ' + this.penTool.pointPosition[length].y
        this.penTool.path = new fabric.Path(this.penTool.str)
        this.penTool.path.set({
          fill: 'red',
          strokeWidth: 1.5,
          stroke: 'transparent',
          selectable: true,
          hasBorders: false,
          hasControls: false,
          evented: false
        })
        this.canvas.add(this.penTool.path)
        this.canvas.renderAll()
    }

    penFinish() {
        this.canvas.remove(this.penTool.path)
        this.penTool.pointPosition.push({
            x: this.penTool.pointPosition[0].x,
            y: this.penTool.pointPosition[0].y
        })
        this.penTool.str += 'z'
        // this.penTool.path = new fabric.Path(this.penTool.str)
        // this.penTool.path.set({
        //     fill: 'red',
        //     strokeWidth: 1.5,
        //     stroke: 'red'
        // })
        // this.canvas.add(this.penTool.path)
        this.penRender()
        this.penTool.isDrawing = false
        // this.removePoint()
        this.canvas.renderAll()
        
    }

    removePoint() {
        for (let item of this.penTool.pointArray) {
          this.canvas.remove(item)
        }
        if (this.penTool.besselObj) {
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
        this.drawControlPoint(e)
    }

    drawControlPoint(e) {
        if(this.penTool.currentPoint.p0) {
            this.canvas.remove(this.penTool.currentPoint.p0)
        }
        if(this.penTool.currentPoint.p1) {
            this.canvas.remove(this.penTool.currentPoint.p1)
        }
        this.penTool.currentPoint.p0 = new fabric.Circle({
            radius: 4,
            fill: 'blue',
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

        this.penTool.currentPoint.p1= new fabric.Circle({
            radius: 4,
            fill: 'blue',
            left: 2 * this.penTool.currentPoint.x - e.absolutePointer.x,
            top: 2 * this.penTool.currentPoint.y - e.absolutePointer.y,
            selectable: false,
            hasBorders: false,
            hasControls: false,
            originX: 'center',
            originY: 'center',
            strokeWidth: 0.8,
            stroke: '#1a80ff'
        })
        this.penTool.currentPoint.controlPoint = {
            x: 2 * this.penTool.currentPoint.x - e.absolutePointer.x,
            y: 2 * this.penTool.currentPoint.y - e.absolutePointer.y
        }
        this.drawControlLine(e)
        this.canvas.add(this.penTool.currentPoint.p0)
        this.canvas.add(this.penTool.currentPoint.p1)
        this.penTool.pointPosition.pop()
        this.penTool.pointPosition.push(this.penTool.currentPoint)
        this.besselCurve(this.penTool.pointPosition.length - 1)
        
    }
    
    drawControlLine(e) {
        if(this.penTool.currentPoint.line1) {
            this.canvas.remove(this.penTool.currentPoint.line1)
        }
        if(this.penTool.currentPoint.line2){
            this.canvas.remove(this.penTool.currentPoint.line2)
        }
        this.canvas.selection = false
        this.penTool.currentPoint.line1 = new fabric.Line([this.penTool.currentPoint.x, this.penTool.currentPoint.y,
          e.absolutePointer.x, e.absolutePointer.y
        ], {
          strokeWidth: 2,
          fill: 'yellow',
          stroke: 'yellow',
          class: 'line',
          originX: 'center',
          originY: 'center',
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false
        })
        this.canvas.add(this.penTool.currentPoint.line1)
        let moveX = e.absolutePointer.x
        let moveY = e.absolutePointer.y
        let originX = this.penTool.currentPoint.x
        let originY = this.penTool.currentPoint.y
        this.penTool.currentPoint.controlPoint.x = 2 * originX - moveX
        this.penTool.currentPoint.controlPoint.y = 2 * originY - moveY
        this.canvas.selection = false
        this.penTool.currentPoint.line2 = new fabric.Line([originX, originY,
            this.penTool.currentPoint.controlPoint.x, this.penTool.currentPoint.controlPoint.y,
        ], {
            strokeWidth: 2,
            fill: 'yellow',
            stroke: 'yellow',
            class: 'line',
            originX: 'center',
            originY: 'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false
        });
        this.canvas.add(this.penTool.currentPoint.line2)
    }


    besselCurve(length) {
        // console.log("this.penTool.pointPosition[length-1].x",this.penTool.pointPosition[length-1].x);
        // console.log("this.penTool.currentPoint.controlPoint.x",this.penTool.currentPoint.controlPoint);
        // console.log("this.penTool.currentPoint.x",this.penTool.currentPoint.x);
        this.penTool.currentPoint.bessel = ' ' +
                              this.penTool.pointPosition[length-1].x + ' ' +
                              this.penTool.pointPosition[length-1].y + 'Q' +
                              this.penTool.currentPoint.controlPoint.x + ' ' + 
                              this.penTool.currentPoint.controlPoint.y + ' ' +
                              this.penTool.currentPoint.x + ' '+
                              this.penTool.currentPoint.y
        if(this.penTool.besselObj) {
            this.canvas.remove(this.penTool.besselObj)
        }
        this.penTool.pointPosition.pop()
        this.penTool.pointPosition.push(this.penTool.currentPoint)
        this.penTool.pointPosition.forEach(o => {
            this.penTool.str += o.bessel
        })

        this.penTool.besselObj = new fabric.Path(this.penTool.str)
        this.penTool.besselObj.set({
            fill: 'yellow',
            strokeWidth: 1.5,
            stroke: 'yellow',
            selectable: true,
            hasBorders: false,
            hasControls: false,
            evented: false
        })
        this.canvas.add(this.penTool.besselObj)
    }

    getCanvasObjects() {

    }
}

 