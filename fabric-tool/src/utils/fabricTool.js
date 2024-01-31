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
        this.canvas = new fabric.Canvas('canvas',{
            fireRightClick: true,
            stopContextMenu: true
        })
    }

    initFabricTool(imgUrl) {
        this.setBackImg(imgUrl)
        this.canvas.on('mouse:down',(e) => {this.mouseDownHandle(e)})
        this.canvas.on('mouse:up',(e) => {this.mouseUpHandle(e)})
        this.canvas.on('mouse:move',(e) => {this.mouseMoveHandle(e)})
        this.canvas.on("mouse:wheel",(e)=>{this.mouseWheelHandle(e)})
    }

    setBackImg(imgUrl) {
        fabric.Image.fromURL(imgUrl,(img) => {
            img.set({
                scaleX: this.canvas.width / img.width,
                scaleY: this.canvas.height / img.height,
                left: 0,
                top: 0
            })
            this.canvas.setBackgroundImage(img,this.canvas.renderAll.bind(this.canvas))
        })
    } 

    mouseDownHandle(e){
        if(e.e.altKey) {
            this.isDrag = true
            this.mouseDownPos.x = e.e.clientX
            this.mouseDownPos.y = e.e.clientY
        }
        this.downPoint = e.absolutePointer
        this.isDrawing = true
    }

    mouseMoveHandle(e) {
        if(this.isDrag) {
            let opt = e.e
            let vpt = this.canvas.viewportTransform
            vpt[4] += opt.clientX - this.mouseDownPos.x
            vpt[5] += opt.clientY - this.mouseDownPos.y
            this.canvas.requestRenderAll()
            this.mouseDownPos.x = opt.clientX
            this.mouseDownPos.y = opt.clientY
        }
        if(this.moveCount % 2 && !this.isDrawing) {
            return
        }
        this.moveCount++
    }

    mouseUpHandle(e) {
        this.upPoint = e.absolutePointer
        if(this.isDrag) {
            this.canvas.setViewportTransform(this.canvas.viewportTransform)
            this.isDrag = false
        }
        this.moveCount = 1
        if(this.isDrawing) {this.startDraw()}
        this.isDrawing = false
        this.downPoint = null
        this.upPoint = null
    }

    mouseWheelHandle(e) {
        let zoomDirection = e.e.deltaY
        let zoom = this.canvas.getZoom()
        zoom *= 0.999 ** zoomDirection
        if (zoom > 20) zoom = 20
        if (zoom < 0.01) zoom = 0.01
        zoom *= 0.999 ** zoomDirection
        this.canvas.zoomToPoint(
            {
              x: e.e.offsetX, 
              y: e.e.offsetY  
            },
            zoom 
        )
    }

    rebackCanvas() {
        this.canvas.setZoom(1)
        let vpt = this.canvas.viewportTransform
        vpt[4] = 0
        vpt[5] = 0
        this.canvas.requestRenderAll()
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

    drawPen() {

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
}

 