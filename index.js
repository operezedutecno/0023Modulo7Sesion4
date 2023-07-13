const { Pool } = require("pg")

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'supermercado',
    user: 'postgres',
    password: 'postgres'
})

var conexion;

const registrarProducto = async (codigo, nombre, precio, stock, peso) => {
    try {
        conexion = await pool.connect()
        const result = await conexion.query(
                                    "INSERT INTO productos(prod_codigo, prod_nombre, prod_precio, prod_stock, prod_peso) VALUES($1, $2, $3, $4, $5) RETURNING prod_id, prod_codigo",
                                    [codigo, nombre, precio, stock, peso]
                            );
        console.log(result);
    } catch (error) {
        console.log(error.message);
    } finally {
        conexion.end();
    }
}

const modificarProducto = async(id, codigo, nombre, precio, stock, peso) => {
    try {
        conexion = await pool.connect()
        const consulta = {
            text: "UPDATE productos SET prod_codigo=$1, prod_nombre=$2, prod_precio=$3, prod_stock=$4, prod_peso=$5 WHERE prod_id=$6 RETURNING *",
            values: [codigo, nombre, precio, stock, peso, id]
        }
       const result = await conexion.query(consulta)
       return result
    } catch (error) {
        console.log(error.message);
    } finally {
        conexion.end()
    }
}

const eliminarProducto = async(id) => {
    try {
        conexion = await pool.connect()
        const consulta = {
            text: "DELETE FROM productos WHERE prod_id=$1 RETURNING *",
            values:[id]
        }
        const result= await conexion.query(consulta)
        return result
    } catch (error) {
        console.log(error.message);
    } finally {
        conexion.end()
    }
}

//Llamado para registrar
// registrarProducto("AZ001","Azúcar",1250, 750, 1000);


//Llamado para modificar
// const actualizacion = modificarProducto(15,"AZ001","Azúcar",1320, 750, 1000)
// actualizacion.then(res => {
//     console.log(res);
// })


//Llamado para eliminar
const eliminacion = eliminarProducto(16)
eliminacion.then(resp => {
    console.log(resp);
})