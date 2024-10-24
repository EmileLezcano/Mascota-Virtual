// Importar las dependencias necesarias
const express = require('express');
const { Pool } = require('pg');

//------- Conexión db -----------------------

const app = express(); // Crear una nueva instancia para utilizar los métodos HTTP con express

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mascotas_db',
    password: 'penguin',
    port: 5432
});

app.use(express.json()); // Middleware para parsear JSON

// ----------- RUTAS ----------------------

// Adoptar una nueva mascota
app.post('/adoptar', async (req, res) => {

    const fechaAdopcion = new Date();
    
    try {
      const result = await pool.query(
        'INSERT INTO mascotas (nombre, tipo, fecha_adopcion) VALUES ($1, $2, $3) RETURNING *',  
        [nombre, tipo, fechaAdopcion]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Listar todas las mascotas adoptadas
app.get('/mascotas', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mascotas');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    }
});

//--------- Escucha ----------------------
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto http://localhost:3000');
});
