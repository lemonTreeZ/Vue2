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
 * @example
 * @param {Date} value
 * @param {String} fmt 格式化模板 
 */
export const formatDate = () => {

}

/**
 * @description 文件大小显示转换
 * @param {String|Number} bytes
 */

/**
 * @description 千分位格式化
 * @example
 * @param {String|Number} value
 */

/**
 * @description 现金数字转大写
 * @example
 * @param {String|Number} value
 */