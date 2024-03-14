export default class EventBus {
    constructor() {
        this.events = Object.create(null)
    }
    $on (name,handle) {
        if(!this.events[name]) {
            this.events[name] = []
        }
        this.events[name].push(handle)
    }
    $emit (name,...args) {
        // if(!this.events[name]) {
        //     return false
        // }
        // this.events[name](...args)
        this.events[name]&&this.events[name].forEach(handle => {
            handle(...args)
        })
    }
    $once(name,handle) {
        const onceHandle = (...args) => {
            handle(args)
            this.$off(name,handle)
        }
        function cb(...args) {
            handle(...args)
        }
        this.$on(name,onceHandle)
    }
    $off(name,offHandle) {
        if(!this.events[name]){ return false }
        if(this.events[name]) {
            let idx = this.events[name].findIndex(handle => {
                return handle === offHandle
            })
            this.events[name].splice(idx,1)
            if(!this.events[name].length) {
                delete this.events[name]
            }
        }
    }
}