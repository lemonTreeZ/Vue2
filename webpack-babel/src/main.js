const obj = {
    a:1,
    b:2
}

let result = Object.fromEntries(Object.entries(obj).map(([key,value]) => {
    return [key, value + 1]
}))

function hasProp({obj,prop}) {
    return !!obj?.[prop]
}

console.log(hasProp({obj,prop: 'b'}))
console.log("result",result)