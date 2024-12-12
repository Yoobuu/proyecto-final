const request = require('supertest');
const { app, pool, server } = require('../app');

jest.setTimeout(30000); // Incrementar el tiempo de espera global

beforeAll(async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            DROP TABLE IF EXISTS books;
            CREATE TABLE books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                author VARCHAR(100) NOT NULL
            );
            INSERT INTO books (title, author) VALUES ('Initial Book', 'Initial Author');
        `);
    } finally {
        client.release();
    }
});

afterAll(async () => {
    if (server) {
        await server.close();
        console.log('Servidor cerrado correctamente');
    }

    await pool.end();
    console.log('Pool de conexiones cerrado correctamente');
});





describe('API Endpoints', () => {
    it('GET / - should return a welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Welcome to the USFQ Library API' });
    });

    it('GET /books - should return a list of books', async () => {
        const response = await request(app).get('/books');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('POST /books - should create a new book', async () => {
        const newBook = { title: 'Test Book', author: 'Test Author' };
        const response = await request(app).post('/books').send(newBook);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newBook.title);
        expect(response.body.author).toBe(newBook.author);
    });

    it('GET /books/:id - should return a specific book', async () => {
        const response = await request(app).get('/books/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });

    it('PUT /books/:id - should update an existing book', async () => {
        const updatedBook = { title: 'Updated Title', author: 'Updated Author' };
        const response = await request(app).put('/books/1').send(updatedBook);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedBook.title);
        expect(response.body.author).toBe(updatedBook.author);
    });

    it('DELETE /books/:id - should delete a book', async () => {
        const response = await request(app).delete('/books/1');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Libro eliminado');
    });
});
