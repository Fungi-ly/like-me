const http = require('http')
const fs = require('fs')
const {agregarPost, obtenerPosts, likePost} = require('./index')
const _ = require('lodash')
const url = require('url')

http
.createServer(async (req, res) => {
    if (req.url == "/"){
        const html = fs.readFileSync("index.html","utf-8")
        res.writeHead(200, {'Content-type': 'text/html; encoding=utf8'})
        res.end(html)
    }
    //rutas: post POST, posts GET, like PUT

    if (req.url.startsWith("/post") && req.method == 'POST'){
        let body = ''
        req.on("data", (chunk) => {
            body += chunk
        })
        req.on("end", async () => {
            const respuestaPOST = await agregarPost(JSON.parse(body))
            res.writeHead(201, {'Content-type': 'Application/json; encoding=utf8'})
            res.end(JSON.stringify(respuestaPOST))
        })
    }

    if (req.url.startsWith("/posts") && req.method == 'GET'){
        const arregloPosts = await obtenerPosts()
        const objetosPosts = arregloPosts.map(p => {
            const props = ["usuario", "url", "descripcion", "likes", "id"]
            const objetoPost = _.zipObject(props,p)
            return objetoPost
        })
        res.writeHead(201, {'Content-type': 'Application/json; encoding=utf8'})
        res.end(JSON.stringify(objetosPosts))
    }

    if(req.url.startsWith("/post") && req.method == 'PUT'){
        const id = url.parse(req.url,true).query.id
        console.log(id)
        try {
            await likePost(id)
            res.statusCode = 200
        } catch (error) {
            console.log(error)
            res.statusCode= 401
        }
        res.end()
    }

})
.listen(3000, () => console.log("Servidor iniciado en el puerto 3000..."))


