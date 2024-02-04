import { fabric } from "fabric"
import {drawLabelRect} from './fabricShape'
import {v4 as uv4} from 'uuid'

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
            points:[],
            pathStr:''
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
           this.penDraw()
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


    initPen(){
      
    }

    penDraw() {
        let p = new fabric.Circle({
            id: uv4(),
            radius: 4,
            stroke: 'red',
            fill: 'green',
            top: this.downPoint.y,
            left: this.downPoint.x,
            hasControls: false
        })

        this.canvas.add(p)
        let controls = this.createControlPoints(this.downPoint)
        let point = {
            x: this.downPoint.x,
            y: this.downPoint.y,
            p0: controls.p0,
            p1: controls.p1
        }
        this.penTool.points.push(point)
        if(this.penTool.points.length >= 2) {
            this.penTool.pathStr = 'M' + '' + ''+ this.penTool.points[0].x + this.penTool.points[0].y +
                                   'Q' + '' + this.penTool.points[1].p0.x + '' + this.penTool.points[1].p0.y + ''
                                   this.penTool.points[1].p1.x + '' + this.penTool.points[1].p1.y + 
                                   '' + this.downPoint.x + '' + this.downPoint.y
            let line = new fabric.Path(this.penTool.pathStr,{ fill: '', stroke: 'black', objectCaching: false });
        
            this.canvas.add(line)
        }

    }

    penMove() {
        // console.log(e);
    }

    createControlPoints(p){
        let  p0 = new fabric.Circle({
            id: uv4(),
            radius: 4,
            stroke: 'green',
            fill: 'yellow',
            top: p.y+10,
            left: p.x+10,
            hasControls: false, selectable: false,
            visible: false
        })

        let p1 = new fabric.Circle({
            id: uv4(),
            radius: 4,
            stroke: 'green',
            fill: 'yellow',
            top: p.y -10,
            left: p.x -10,
            hasControls: false, selectable: false,
            visible: false
        })
        this.canvas.add(p0,p1)
        return {
            p0: {
                x:  p.x+10,
                y:  p.y+10
            },
            p1: {
                x: p.x -10,
                y: p.y -10,
            }
        }
    }

    penUp(){
      
    }

    penFinish() {
        
    }

    
    getCanvasObjects() {

    }
}

 