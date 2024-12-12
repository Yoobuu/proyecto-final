require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Importa Pool de pg

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err) => {
    if (err) {
        console.error('Error al conectar con PostgreSQL:', err.stack);
    } else {
        console.log('Conexión exitosa a PostgreSQL');
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the USFQ Library API' });
});

app.get('/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        res.status(500).send('Error al obtener los libros');
    }
});

app.post('/books', async (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).send('Faltan datos del libro (title y author son requeridos)');
    }

    try {
        const result = await pool.query(
            'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *',
            [title, author]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al agregar el libro:', error);
        res.status(500).send('Error al agregar el libro');
    }
});

app.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Libro no encontrado');
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el libro:', error);
        res.status(500).send('Error al obtener el libro');
    }
});

app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).send('Faltan datos del libro (title y author son requeridos)');
    }

    try {
        const result = await pool.query(
            'UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *',
            [title, author, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Libro no encontrado');
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el libro:', error);
        res.status(500).send('Error al actualizar el libro');
    }
});

app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Libro no encontrado');
        }

        res.status(200).json({ message: 'Libro eliminado', book: result.rows[0] });
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        res.status(500).send('Error al eliminar el libro');
    }
});
const PORT = 4000;
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = { app, server };