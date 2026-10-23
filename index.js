
const express = require('express')
const app = express()
const mysql = require('mysql2/promise')

app.use(express.json())

const pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'api',
    waitForConnections: true
});
// GET - Listar usuários
app.get("/usuarios", async (req, res) => {
    const [usuarios] = await pool.execute("SELECT * FROM usuarios")
    res.json(usuarios)
})

// POST - Cadastrar usuário
app.post("/usuarios", async (req, res) => {
    const { email, senha } = req.body

    const [resultado] = await pool.execute(
        "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
        [email, senha]
    )

    res.status(201).json({
        id: resultado.insertId,
        email: email,
        senha: senha
    })
})

// PUT - Atualizar usuário
app.put("/usuarios/:id", async (req, res) => {
    const id = req.params.id
    const { email, senha } = req.body

    const [resultado] = await pool.execute(
        "UPDATE usuarios SET email = ?, senha = ? WHERE id = ?",
        [email, senha, id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" })
    }

    res.json({ mensagem: "Usuário atualizado com sucesso" })
})

// DELETE - Excluir usuário
app.delete("/usuarios/:id", async (req, res) => {
    const id = req.params.id

    const [resultado] = await pool.execute(
        "DELETE FROM usuarios WHERE id = ?",
        [id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" })
    }

    res.json({ mensagem: "Usuário removido com sucesso" })
})

app.listen(3000, () => console.log("API no ar :D"))
