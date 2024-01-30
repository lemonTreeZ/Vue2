export const drawLabelRect = (params) => {
    const LabelRect = fabric.util.createClass(fabric.Rect, {
        type: 'LabelRect',
        initialize: function(options) {
            options || (options = {})
            this.callSuper('initialize',options)
            this.set('label',options.label || "")
            this.set('id',option.id)
            this.set('drawType',options.id)
            this.set('firstPoint',options.firstPoint)
        },
        toObject: function() {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                label: this.label,
                drawType: this.get('drawType'),
                id: this.get('id'),
                isLabeled: this.isLabeled
            })
        },
        _render: function(ctx) {
            this.callSuper('_render',ctx)
            ctx.font = '20px Helvetica'
            ctx.fillStyle = 'red'
            ctx.fillText('测试',-this.width/2 + 10,-this.height/2 + 30)
        }
    })
}