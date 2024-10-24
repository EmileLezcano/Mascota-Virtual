const express = require('express');
const { Pool } = require('pg');

//------- Conexión db -----------------------
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'felicidad_db', // Base de datos que contiene la tabla felicidad
    password: 'penguin',
    port: 5432
});

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// ----------- RUTAS ----------------------

// Ruta para obtener el nivel de felicidad de una mascota
app.get('/felicidad/:id_mascota', async (req, res) => {
    const { id_mascota } = req.params; // Obtener el id de la mascota de los parámetros de la ruta

    try {
        // Consultar el nivel de felicidad de la mascota en la base de datos
        const result = await pool.query(
            'SELECT nivel_felicidad FROM felicidad WHERE id_mascota = $1',
            [id_mascota]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron registros de felicidad para esta mascota' });
        }

        // Devolver el nivel de felicidad
        res.json({ nivel_felicidad: result.rows[0].nivel_felicidad });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el nivel de felicidad' });
    }
});

//--------- Escucha ----------------------
app.listen(3002, () => {
    console.log('Servidor escuchando en el puerto 3002');
});
