const Koa = require('koa')
const mount = require('koa-mount')
const static = require('koa-static')
const fs = require('fs')
const rpcClient = require('./client')
const createTemplate = require('./template')

const template = createTemplate(`${__dirname}/template/index.html`)

const app = new Koa()

app.use(mount('/static', static(`${__dirname}/source/static/`)))

app.use(async (ctx) => {
    if (!ctx.query.columnid) {
        ctx.status = 400
        ctx.body = 'invalid columnid'
        return
    }

    const result = await new Promise((resolve, reject) => {
        rpcClient.write({
            columnid: ctx.query.columnid
        }, function (err, data) {
            err ? reject(err) : resolve(data)
        })
    })

    ctx.status = 200
    ctx.body = template(result)
    
})

app.listen(3000)
