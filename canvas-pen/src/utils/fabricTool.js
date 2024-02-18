import { fabric } from "fabric-with-erasing"
import {drawLabelRect, renderIcon, drawColorPoint} from './fabricShape'
import {v4 as uv4} from 'uuid'
import { ControlPoint } from './controlPoint'
import { EndPoint } from './endPoint'
import {PathTool} from './pathTool'
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
        this.imgCanvas = document.querySelector('#img-ctx')
        this.relationship = {x:0,y:0,zoom:1}

        this.penTool = {
            ctx: this.imgCanvas.getContext('2d'),
            stroke_color: '#ffc107',
            paths: [],
            dragging: false,
            isNewEndPoint: false,
            currentEndPoint: null,
            draggingControlPoint: null,
            editCpBalance: false,
            isOver: false
        },
        this.keyBoard = document.querySelector(".content-demo")
    }

    initFabricTool() {
        this.canvas.on("mouse:wheel",(e)=>{this.mouseWheelHandle(e)},true)
        this.canvas.on('mouse:down',(e) => {this.mouseDownHandle(e)},true)
        this.canvas.on('mouse:up',(e) => {this.mouseUpHandle(e)},true)
        this.canvas.on('mouse:move',(e) => {this.mouseMoveHandle(e)},true)
    }

    setBackImg(imgUrl) {
        fabric.Image.fromURL(imgUrl,(img) => {
            img.set({
                scaleX: this.canvas.width / img.width,
                scaleY: this.canvas.height / img.height,
                left: 0,
                top: 0,
                erasable: false
            })
            this.canvas.setBackgroundImage(img,this.canvas.renderAll.bind(this.canvas))
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
            this.canvas.isDrawingMode = false
            this.keyBoard.addEventListener('keydown', (e) => {this.keyDownHandle(e)})
            if(this.penTool.paths.length >= 1 && this.penTool.isOver) {
                this.penTool.paths.push(new PathTool())
            }
            this.penDraw(e)
        }
       
    }

    mouseMoveHandle(e) {
        if(this.isDrag&&this.drawType !== 'pen') {
            let opt = e.e

            let cvpt = this.canvas.viewportTransform
            cvpt[4] += opt.clientX - this.mouseDownPos.x
            cvpt[5] += opt.clientY - this.mouseDownPos.y

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
        this.isDrawing = false
        if(this.drawType === 'pen') {
            this.penMouseUp()
        }
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
        const [x, y] = [e.e.offsetX, e.e.offsetY]
        this.relationship.x += x / zoom - x/this.relationship.zoom
        this.relationship.y += y / zoom - y/this.relationship.zoom
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
            case 18:
              e.preventDefault()
            //   this.penMove
        }
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
            case 'line':
                this.drawLine()
                break
            case 'dottedLine':
                this.drawDottedLine()
                break
        }
    }

    drawRect() {
        this.canvas.isDrawingMode = false
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
        this.canvas.isDrawingMode = false
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

    drawLine() {
        this.canvas.isDrawingMode = false
        this.canvas.selection = false
        this.canvas.skipTargetFind = true
        let line = new fabric.Line([this.downPoint.x,this.downPoint.y,this.upPoint.x,this.upPoint.y],{
            fill: 'green',
            stroke: 'red',
            strokeWidth: 2
        })
        this.canvas.add(line)
    }

    drawDottedLine(){
        this.canvas.isDrawingMode = false
        this.canvas.selection = false
        this.canvas.skipTargetFind = true
        let line = new fabric.Line([this.downPoint.x,this.downPoint.y,this.upPoint.x,this.upPoint.y],{
            fill: 'green',
            stroke: '#FFF',
            strokeWidth: 2,
            strokeDashArray: [10,3]
        })
        this.canvas.add(line)
    }

    drawFree() {
        this.canvas.selection = false
        this.canvas.skipTargetFind = true
        this.canvas.isDrawingMode = true
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
        this.canvas.freeDrawingBrush.width = 10
        this.canvas.freeDrawingBrush.color = 'green' 
    }

    startEraser() {
        this.canvas.isDrawingMode = true
        this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas)
        this.canvas.freeDrawingBrush.width = 10
    }

    setControlsStyle() {
        fabric.Object.prototype.cornerStyle = "circle"
        fabric.Object.prototype.cornerSize = 10
        fabric.Object.prototype.cornerColor = "white"
        fabric.Object.prototype.transparentCorners = false
        this.createDelIcon(this.canvas)
    }

    selectionObj() {
        this.canvas.isDrawingMode = false
        this.drawType = 'edit'
        this.setControlsStyle()
        this.canvas.skipTargetFind = false
        this.canvas.selection = true
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

    reSetpenTool() {
        this.penTool.paths = []
        this.pathPoints = []
        this.penTool.paths.push(new PathTool())
        this.penTool.editCpBalance = false
        this.penTool.dragging = false
        this.penTool.isNewEndPoint = false  
        this.penTool.currentEndPoint = null
        this.penTool.draggingControlPoint = null 
        ControlPoint.prototype.ctx = this.penTool.ctx
        EndPoint.prototype.ctx = this.penTool.ctx
        EndPoint.prototype.canvas = this 
    }

    penDraw(e) {
        this.penTool.isOver = false
        let location = {
            x: e.pointer.x,
            y: e.pointer.y
        }
        this.penTool.dragging = true
        this.penTool.isNewEndPoint = false
        this.penTool.draggingControlPoint = null
        this.penTool.currentEndPoint = this.isExistPoint(location.x,location.y)
        this.removeSelectedEndPoint()
        if(this.penTool.currentEndPoint) {
            this.penTool.currentEndPoint.selected = true
            if(!this.penTool.draggingControlPoint && this.penTool.currentEndPoint === this.penTool.paths[this.penTool.paths.length -1][0] && this.penTool.paths[this.penTool.paths.length -1].length > 2) {
                this.penTool.paths[this.penTool.paths.length - 1].isClose = true
                this.penTool.isOver = true
            }
        } else {
            this.penTool.currentEndPoint = this.createEndPoint(location.x, location.y)
            this.penTool.isNewEndPoint = true
            this.penTool.paths[this.penTool.paths.length - 1].push(this.penTool.currentEndPoint)
        }
        this.renderer()
    }

    penMove(e) {
        e.e.preventDefault()
        if(!this.penTool.dragging) {
            return
        }
        let location = {
            x: e.pointer.x,
            y: e.pointer.y
        }
        let ced = this.penTool.currentEndPoint
        if(this.penTool.isNewEndPoint){
            ced.cp1.x = location.x
            ced.cp1.y = location.y
            ced.cp0.x = ced.x * 2 - location.x
            ced.cp0.y = ced.y * 2 - location.y
        } else if (this.penTool.draggingControlPoint){
            if(this.penTool.editCpBalance){
                ced.cpBalance = false
            }
            this.penTool.draggingControlPoint.x = location.x
            this.penTool.draggingControlPoint.y = location.y
            ced.calculateControlPoint(location.x, location.y, this.penTool.draggingControlPoint)
        } else {
            let offset = {
              x: location.x - ced.x,
              y: location.y - ced.y
            }
            ced.x = location.x
            ced.y = location.y
            ced.cp1.x += offset.x
            ced.cp1.y += offset.y
            ced.cp0.x += offset.x
            ced.cp0.y += offset.y
        }
        this.renderer()
    }

    penMouseUp() {
        this.penTool.dragging = false
        if(this.penTool.draggingControlPoint) {
            if(this.penTool.draggingControlPoint.counterpart) {
               delete this.penTool.draggingControlPoint.counterpart.staticDistance
            }
            delete this.penTool.draggingControlPoint.counterpart
            this.penTool.draggingControlPoint = false
        }
        this.penTool.paths.forEach((path) => {
            let length = path.length
            for(let i = 0; i < length; i++) {
               let  ep = path[i]
                ep.printControlPoints()
            }
        })
    }

    getSelectedPath() {
        for(let i = 0, len1 = this.penTool.paths.length; i < len1; i++){
            for(let j = 0, len2 = this.penTool.paths[i].length; j < len2; j++){
              if(this.penTool.paths[i][j].selected){
                return {
                  path: this.penTool.paths[i],
                  ep: this.penTool.paths[i][j]
                }
              }
            }
        }
        return null
    }

    isExistPoint(x,y) {
        let cep, i = 0, len
        for(len = this.penTool.paths.length; i< len; i++){
            cep = this.penTool.paths[i].isInPoint(x, y)
            if(cep){
                if(cep.cp instanceof ControlPoint){
                    this.penTool.draggingControlPoint = cep.cp
                }
                return cep.ep
            }
        }
        return null
    }

    removeSelectedEndPoint() {
        this.penTool.paths.forEach((path) => {
            path.removeSelected()
        })
    }

    createPath() {
        this.penTool.paths[this.penTool.paths.length - 1].isClose = true
        this.penTool.paths.push(new PathTool())
    }

    createEndPoint(x,y) {
        let ep = new EndPoint(x, y)
        ep.selected = true
        return ep
    }

    renderer() {
        let ep, prev_ep, ctx = this.penTool.ctx
        this.penTool.ctx.beginPath()
        this.penTool.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height)
        this.canvas.renderAll()
        this.penTool.paths.forEach((path) => {
            let length = path.length
            for(let i = 0; i < length; i++) {
                ep = path[i]
                ep.printControlPoints()
                if(i > 0) {
                    prev_ep = path[i - 1]
                    this.bezierCurveTo(prev_ep,ep,ctx)
                }
            }
            if(path.isClose) {
                prev_ep = path[length - 1]
                ep = path[0]
                this.bezierCurveTo(prev_ep,ep,ctx)
            }
        })
    }

    bezierCurveTo(prev_ep,ep,ctx) {
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = this.penTool.stroke_color
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

    deleteEndPoint() {
        let paths = this.penTool.paths
        for(let i = 0, len = paths.length; i < len; i++){
          paths[i].deleteSelected()
          if(paths[i].length === 0 && (i + 1 !== len)) {
            paths.splice(i, 1)
            len = paths.length
            i--
          }
        }
    }

    getCanvasObjects() {
        this.canvas.getObjects().forEach(e => {
            console.log(e);
        })
    }

    penFinished(){
        let paths = this.penTool.paths.filter(item => {return item.isClose})
        let str = ' '
        for(let i = 0; i < paths.length; i++) {
          str = 'M' + ' ' + paths[i][0].x + ' ' + paths[i][0].y
          for(let j = 1,len = paths[i].length; j < len - 1; j++) {
             let prev_p =  paths[i][j-1]
             let cur_p = paths[i][j]
             let next_p = paths[i][j+1]
            str += ' ' + 'C' + ' ' + prev_p.cp1.x + ' ' + prev_p.cp1.y + ' '+
                    cur_p.cp0.x + ' ' + cur_p.cp0.y + ' '+
                    cur_p.x + ' ' + cur_p.y
            
            str += ' ' + 'C' + ' '+ cur_p.cp1.x + ' ' + cur_p.cp1.y + ' '+
                    next_p.cp0.x + ' ' + next_p.cp0.y + ' '+
                    next_p.x + ' ' +next_p.y
            if(j === len - 1){
                str += ' ' + 'C' +' ' + paths[i][j].cp1.x + ' ' + paths[i][j].cp1.y + ' ' +  
                        paths[i][0].cp0.x + ' ' + paths[i][0].cp0.y + 
                        paths[i][0].x + ' ' + paths[i][0].y
            }
          }
          str += ' ' + 'z'
            let line = new fabric.Path(str,{
                fill:'yellow',
                stroke: 'yellow',
                strokeWidth: 3,
            })
            this.canvas.add(line)
        }
        this.drawType = ''
    }
}

 