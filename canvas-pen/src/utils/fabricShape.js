import { fabric } from "fabric-with-erasing"

export const drawLabelRect = (params) => {
    let {id,width,height,left,top,drawType,label} = params
    const LabelRect = fabric.util.createClass(fabric.Rect, {
        type: 'LabelRect',
        initialize: function(options) {
            options || (options = {})
            this.callSuper('initialize',options)
            this.set('label',options.label || "")
            this.set('id',options.id)
            this.set('drawType',options.drawType)
        },
        toObject: function() {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                label: this.get('label'),
                drawType: this.get('drawType'),
                id: this.get('id'),
                isLabeled: false
            })
        },
        _render: function(ctx) {
            this.callSuper('_render',ctx)
            ctx.font = '16px Helvetica'
            ctx.fillStyle = 'red'
            ctx.fillText(this.label,-this.width/2 + 10,-this.height/2 + 20,200)
            
        }
    })
    return new LabelRect({
        id,
        width,
        height,
        left,
        top,
        label,
        drawType,
        stroke: '#E34F51',
        strokeWidth: 3,
        fill: 'rgba(255,255,255,0)',
        strokeUniform: true,
        selectable: false
    })
}

export const drawColorPoint = (params) => {
    let {id,color,label,drawType,x,y} = params
    const ColorPoint = fabric.util.createClass(fabric.Circle,{
            type: 'ColorPoint',
            initialize: function(options) {
                this.callSuper('initialize',options) 
                this.set('id',options.id)
                this.set('label',options.label || "")
                this.set('drawType',options.drawType)
            },
            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                    label: this.get('label'),
                    drawType: this.get('drawType'),
                    id: this.get('id'),
                    isLabeled: false
                })
            },
        })
    return new ColorPoint({
        id,
        label,
        drawType,
        top:y,
        left:x,
        radius: 4,
        stroke: 'rgba(0,0,0,.2)',
        fill: color,
        selectable: false
    })
}

export const renderIcon = (image, initialAngle) =>{
    return function (ctx, left, top, styleOverride, fabricObject) {
        let size = this.cornerSize
        ctx.save()
        ctx.translate(left, top)
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle + initialAngle))
        ctx.drawImage(image, -size / 2, -size / 2, size, size)
        ctx.restore()
    }
} 


