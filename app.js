const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();


app.use(express.json());

//MySQL

var connection = mysql.createConnection({
  host     : 'us-cdbr-east-04.cleardb.com',
  user     : 'bb647aa231f05d',
  password : '05507a58',
  database : 'heroku_973b8042d64a45b'
});

function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
  handleDisconnect();

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
app.get('/abrircuenta/:id', (req,res)=>{
    const sql = `INSERT INTO cuentas_bancarias WHERE rfc = "${id}"`
    const customerObj = {
        
        rfc: `"${id}"`,
        id_cuentabancaria: req.body.correo,
        codigo_cliente: req.body.telefono
    }

});

//Check connection
connection.connect(error =>{
    if(error) throw error;
    console.log('Database server running!')
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});