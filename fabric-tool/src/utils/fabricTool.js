import { fabric } from "fabric"
export class fabricTool{
    constructor() {
        this.drawType = false
        this.isDrag = false
        this.optionType = 'point'
        this.mouseDownPos = {}
        this.downPoint = {}
        this.upPoint = {}
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
    }

    mouseUpHandle(e) {
        this.upPoint = e.absolutePointer
        if(this.isDrag) {
            this.canvas.setViewportTransform(this.canvas.viewportTransform)
            this.isDrag = false
        }
        switch(this.drawType) {
            case 'rect':
                this.drawRect()
                break
            // case 'circle':
            //     this.drawCircle()
            //     break
            // case 'pen':
            //     this.drawPen()
            //     break
            // case 'free':
            //     this.drawFree()
            //     break
        }
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

    drawRect() {
        
    }

    drawCircle() {

    }

    drawPen() {

    }

    drawFree() {

    }
}

 