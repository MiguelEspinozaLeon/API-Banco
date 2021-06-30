const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();


app.use(express.json());

//MySQL

// var connection = mysql.createConnection({
//   host     : 'us-cdbr-east-04.cleardb.com',
//   user     : 'bb647aa231f05d',
//   password : '05507a58',
//   database : 'heroku_973b8042d64a45b',
//   multipleStatements:true
// });

var connection  = mysql.createPool({
    connectionLimit : 10,
    host     : 'us-cdbr-east-04.cleardb.com',
    user     : 'bb647aa231f05d',
    password : '05507a58',
    database : 'heroku_973b8042d64a45b'
  });
  
 



//mysql://bb647aa231f05d:05507a58@us-cdbr-east-04.cleardb.com/heroku_973b8042d64a45b?reconnect=true

//routes
app.get('/', (req,res) =>{
    res.send("Welcome to my API");
});


//listado de todos los clientes
app.get('/clientes', (req,res)=>{
    const sql = 'SELECT * FROM clientes';
    connection.query(sql, (error, results)=>{
        if (error) throw error;
        if (results.length > 0){
            res.json(results);
        }
        else{
            res.send('No results');
        }
    });







   
});
app.get('/clientes/:id', (req,res)=>{

    const {id} = req.params
    const sql = `SELECT * FROM clientes WHERE rfc = "${id}"`;
    connection.query(sql, (error, result)=>{
        if (error) throw error;
        if (result.length > 0){
            res.json(result);
        }
        else{
            res.send('Sin resultado');
        }
    });
    
});

app.post('/add', (req,res)=>{
   const sql = 'INSERT INTO clientes SET ?';

   const customerObj = {
       nombre: req.body.nombre,
       apellido: req.body.apellido,
       rfc: req.body.rfc,
       correo: req.body.correo,
       telefono: req.body.telefono
   }

   connection.query(sql, customerObj, error =>{
    if (error) throw error;
    res.send('Cliente creado');
   });





});

app.put('/update/:id', (req, res)=>{
    res.send('Modificar Cliente')
});

app.delete('/delete/:id', (req, res)=>{
    res.send('Borrar Cliente');
});


//Apertura de cuenta bancaria
app.post('/abrircuenta/:id', (req,res)=>{
    const {id} = req.params
    const sql = "INSERT INTO cuentas_bancarias SET ?"
    const customerObj = {
        
        rfc: id,
        id_cuentabancaria: req.body.id_cuentabancaria,
        codigo_cliente: req.body.codigo_cliente
    }
    connection.query(sql, customerObj, error =>{
        if (error) throw error;
        res.send('Cuenta bancaria creada');
       });

});
//Tarjetas
app.post('/tarjetas/:id', (req,res)=>{
    const {id} = req.params
    const sql = 'INSERT INTO tarjetas SET ?'
    const customerObj = {
        numero_tarjeta: req.body.numero_tarjeta,
        id_cuentabancaria: id,
        vigencia: req.body.vigencia,
        saldo: req.body.saldo,
        ccv: req.body.ccv
    }
    connection.query(sql, customerObj, error =>{
        if (error) throw error;
        res.send('Tarjeta registrada');
       });

})

//Transacciones

//retiro
app.post('/retiro',(req,res)=>{
    const {id} = req.params
    const sql = 'INSERT INTO transacciones SET ?'
    const sql2 = `UPDATE tarjetas SET saldo = saldo - ${customerObj.monto_transaccion} WHERE numero_tarjeta = ${customerObj.numero_tarjeta}`
    const customerObj = {
        numero_tarjeta: req.body.numero_tarjeta,
        tipo_transaccion: req.body.tipo_transaccion,
        monto_transaccion: req.body.monto_transaccion,
        fecha: req.body.fecha
    }
    connection.query(sql, customerObj, error =>{
        if (error) throw error;
        res.send('Retiro realizado');
       });


   
});



//Check connection
// connection.connect(error =>{
//     if(error) throw error;
//     console.log('Database server running!')
// });

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});