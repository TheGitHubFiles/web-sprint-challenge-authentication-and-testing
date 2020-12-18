const db = require('../../data/dbConfig')


function getBy(filter) {

    return db("users").where(filter).first()
}

async function add(user) {
    const [id] = await db("users").insert(user, "id")
    return getById(id)

}

function getById(id) {
    return db("users").where("id", id).first()
}

module.exports = {
    add,
    getBy,
    getById
}