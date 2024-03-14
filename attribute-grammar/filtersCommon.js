/**
 * @description 字符串复制制定次数
 * @param {String|Number} value
 * @param {Number} count
 */
export const repeat = (value,count) => value.toString().repeat(count)

/**
 * @description 字符串替换
 * @param {String|Number} value
 * @param {String} string
 * @param {String} replacement
 */
export const replace = (value, string, replacement) => value.toString().replace(new RegExp(string, 'g'),replacement)

/**
 * @description 手机号隐私保护
 * @example 13881666688 -> 138****6688
 * @param {String|Number} value
 */
export const secretPhone = (value) => value.toString().replace(/(\d{3})(\d{4})(\d{4})/,'$1****$3')

/**
 * @description 格式化手机号
 * @example 13881666688 -> 138-8166-6688
 * @param {*} value
 */
export const formatPhone = (value) => value.toString().replace(/(^\d{3}|\d{4}\B)/g, '$1-')

/**
 * @description 字母大小写转换
 * @param {String} value
 * @param {Number} type 1-首字母大写 2-首字母小写 3-全部大写 4-全部小写 5-大小写转换
 */
export const changeCase = (value,type) => {
    const toggleCase = (value) => {
        let newValue = ''
        value.split('').forEach((item) => {
            if(/^([a-z]+)/.test(item)) {
                newValue += item.toUpperCase()
            } else if(/^([A-Z]+)/.test(item)) {
                newValue += item.toLowerCase()
            } else {
                newValue += item
            }
        })
        return newValue
    }
    switch (type) {
        case 1: 
            return value.charAt(0).toUpperCase() + value.slice(1)
        case 2: 
            return value.charAt(0).toLocaleLowerCase() + value.slice(1)
        case 3:
            return value.toUpperCase()
        case 4:
            return value.toLocaleLowerCase()
        case 5:
            return toggleCase(value)
        default:
            return value
    }
}

/**
 * @description 去除空格
 * @param {String} value
 * @param {Number} type 1-前后空格 2-前空格 3-后空格 4-所有空格
 */
export const trim = (value,type) => {
    switch(type) {
        case 1:
            return value.replace(/(^\s*)|(\s*$)/g,'')
        case 2:
            return value.replace(/(^\s*)/g,'')
        case 3:
            return value.replace(/(\s*$)/g,'')
        case 4:
            return value.replace(/\s+/g,'')
        default:
            return value
    }
}

/**
 * @description 日期时间格式化
 * @example Date() | formateDate -> 2023-01-01 00:00:00
 * @example '2023/10/01 12:30:45' | formatDate('yyyy-MM-dd hh:mm:ss w') -> 2023-10-01 12:30:45 星期四
 * @param {Date} value
 * @param {String} fmt 格式化模板 
 */
export const formatDate = (value,fmt='yyyy-MM-dd hh:mm:ss') => {
    const date = new Date(value)
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'w+': date.getDay(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
    }
    const weeks = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
    if(/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for(let k in o) {
        if(k === 'w+') {
            let weekLetter = weeks[o['w+']]
            fmt = fmt.replace('w',weekLetter)
        }else if(new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1,RegExp.$1.length===1?o[k]:('00'+o[k]).substr((''+o[k]).length))
        }
    }
    return fmt
}

/**
 * @description 文件大小显示转换
 * @example 12 -> 12.0B
 * @example 98223445 -> 93.7MB
 * @param {String|Number} bytes
 */
export const bytesToSize = (bytes) => {
    bytes = bytes.toString()
    if(bytes === 0) return '0B'
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const sizes = ['B','KB','MB','GB','TB','PB','EB','ZB','YB']
    return (bytes / Math.pow(k,i).toPrecision(3) + ' ' + sizes[i])
}

/**
 * @description 千分位格式化
 * @example 1234567->1,234,567
 * @param {String|Number} value
 */
export const thousands = (value,fractionDigits = 0) => {
    const regexp = /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g
    return (Number(value).toFixed(fractionDigits)+'').replace(regexp,'$&,')
}

/**
 * @description 现金数字转大写
 * @example 1234.567 -> 壹仟贰佰叁拾肆元伍陆分柒厘
 * @param {String|Number} value
 */
export const upDigit = (value) => {
    const digit = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖']
    const fraction = ['角','分','厘']
    const unit = [['元','万','亿'],['','拾','佰','仟']]
    let s = ''
    let head = value < 0 ? '欠':''
    value = Math.abs(value)
    for(let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(value*10*Math.pow(10,i))%10] + fraction[i].replace(/零./,''))
    }

    s = s || '整'
    for(let i = 0;i < unit[0].length && value > 0; i++) {
        let p = ''
        for(let j = 0; j < unit[1].length && value > 0; j++) {
            p = digit[value % 10] + unit[1][j] + p
            value = Math.floor(value / 10)
        }
        s = p.replace(/(零.)*零$/,'').replace(/^$/,'零') + unit[0][i] + s
    }

    return (head + s.replace(/(零.)*零元/,'元').replace(/(零.)+/g, '零').replace(/^整$/,'零元整') )
}