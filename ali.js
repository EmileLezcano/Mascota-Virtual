const express = require('express');
const { Pool } = require('pg');

//------- Conexión db -----------------------

// Conexión a la base de datos de mascotas
const poolMascotas = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mascotas_db', // Base de datos que contiene la tabla "mascotas"
    password: 'penguin',
    port: 5432
});

// Conexión a la base de datos de alimentación
const poolAlimentacion = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alimentacion_db', // Base de datos que contiene la tabla "alimentacion"
    password: 'penguin',
    port: 5432
});

const app = express(); 
app.use(express.json()); // Middleware para parsear JSON

// ----------- RUTAS ----------------------

// Ruta para alimentar a una mascota
app.post('/alimentar', async (req, res) => {
    const { id_mascota } = req.body; // Se espera que el id de la mascota se envíe en el cuerpo de la solicitud
    const fechaAlimentacion = new Date(); // Obtener la fecha y hora actuales
    
    try {
        // Verificar si la mascota existe en la base de datos "mascotas_db"
        const mascota = await poolMascotas.query('SELECT * FROM mascotas WHERE id = $1', [id_mascota]);

        if (mascota.rows.length === 0) {
            return res.status(404).json({ error: 'La mascota no existe' });
        }

        // Insertar el registro de alimentación en la base de datos "alimentacion_db"
        const result = await poolAlimentacion.query(
            'INSERT INTO alimentacion (id_mascota, fecha_alimentacion) VALUES ($1, $2) RETURNING *',
            [id_mascota, fechaAlimentacion]
        );
        res.status(201).json(result.rows[0]); // Devolver el registro insertado
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al alimentar la mascota' });
    }
});

//--------- Escucha ----------------------
app.listen(3001, () => {
    console.log('Servidor escuchando en el puerto 3001');
});
