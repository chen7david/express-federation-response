const { template } = require('lodash')
const store = require('./store.json')

class Response {
    
    constructor(res){
        this.id = Math.floor((Math.random() * 9000) + 1000)
        this.isFederationResponse = true
        this.status = null
        this.lang = 'en'
        this.payload = null
        this.details = []
        this.directives = []  
        this.response = res 
        this.created = new Date().toLocaleString()
    }

    statusTo(status){
        this.status = status
        return this
    }

    langTo(lang){
        this.lang = lang
        return this
    }

    message(code, data = null){

        let notification = store.notifications.find(el => el.name == code)
        if(!notification) notification = store.notifications
            .find(el => el.name == 'invalid_message_code')
        let message = this.mutate(notification, data)
        if(message.state == 'error') message.message = `${message.message} - ${this.id}`
        this.details.push(message)
        return this
    }

    mutate(notification, data){
        let detail = notification.details.find(el => el.lang == this.lang)
        return {
            code: notification.name,
            status: notification.status,
            state: notification.state,
            key: detail.key,
            message: data ? template(detail.message)(data) : detail.message
        }
    }

    payloadTo(data){
        this.payload = data
        return this
    }

    directiveTo(directive){
        this.directives.push(directive)
        return this
    }

    send(){
        const response = this.response
        delete this.response
        this.status = this.details[0] && !this.status ? this.details[0].status : this.status
        response.status(this.status || 200).json(this)
    }
}

const response = (req, res, next) => {
    if(!req.ctx) req.ctx = {}
    req.ctx.response = new Response(res)
    next()
}

module.exports = { Response, response }