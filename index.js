const {Pool} = require('pg')

const config = {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "likeme",
    idleTimeoutMillis: 10000
}

const pool = new Pool(config)

const realizarConsulta = (objConsulta) => {
    return new Promise ((resolve, reject) => {
        pool.connect(async (error_conexion, client, release) => { //usuario, url, descripcion
            if (error_conexion) throw(error_conexion)
            try {
                const respuesta = await client.query(objConsulta)
                resolve(respuesta.rows)
            } catch (error) {
                reject(error)
            }
            release()
        })
    })
}

const agregarPost = async (post) => {
    const datosPost = Object.values(post)
    datosPost.push(0)
    const objConsulta = {
        name: 'agregarPost',
        rowMode: 'array',
        text: `INSERT INTO posts(usuario, url, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *;`,
        values: datosPost
    }
    try {
        const respuesta = await realizarConsulta(objConsulta)
        return respuesta
    } catch (error) {
        return error
    }
}

const obtenerPosts = async () => {
    const objConsulta = {
        name: 'obtenerPosts',
        rowMode: 'array',
        text: `SELECT * FROM posts;`
    }
    try {
        const posts = await realizarConsulta(objConsulta)
        return posts
    } catch (error) {
        return error
    }
}

const likePost = async (id) => {
    console.log(id)
    const objConsulta = {
        name: 'likearPost',
        rowMode: 'array',
        text: `UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *;`,
        values: [id]
    }
    try {
        const likedPost = await realizarConsulta(objConsulta)
        console.log(likedPost)
        
    } catch (error) {
        return error
    }

}

module.exports = {agregarPost, obtenerPosts, likePost}
