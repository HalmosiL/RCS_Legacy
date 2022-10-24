const database = require('mysql');

class DB{
    constructor() {
        this.connection = database.createConnection({
            host: process.env.DB_Host,
            user: process.env.DB_User,
            password: process.env.DB_Password,
            database: process.env.DB_Database
        });

        this.connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected to database");
          });
    }

    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    registrateUser(email,name,password){
        return this.query('INSERT INTO users (email,name,password) VALUES (?,?,?);',[email,name,password])
    }

    findUserByEmail(email){
        return this.query('SELECT * FROM users where email = ?',[email])
    }

    findUserByID(id){
        return this.query('SELECT * FROM users where id = ?',[id])
    }

    insertActiovasontoken(email, token){
        return this.query('INSERT INTO activation_token (user_id,token) VALUES ((select id from users where email = ?),?);', [email,token])   
    }

    activateUser(token){
        return this.query('UPDATE users set activated = true where id = (select user_id from activation_token where token = ?);', [token])
    }

    getRunByUserID(user_id, id){
        return this.query('SELECT * FROM runs where user_id = ? and id = ?',[user_id, id])
    }

    getAllRunsByUserID(id){
        return this.query('SELECT * FROM runs where user_id = ?',[id])
    }

    insertRun(user_id,run){
        return this.query('Insert into runs (user_id,tipe,name,rounds,time) values (?,?,?,?,?)',[user_id,run.tipe,run.name,parseInt(run.rounds),parseFloat(run.time)])
    }

    deleteRun(user_id,id){
        return this.query('Delete from runs where user_id = ? and id = ?',[user_id,id])
    }

    editRun(user_id,id,run){
        return this.query('Update runs set tipe = ?, name = ?, rounds = ?, time = ? where user_id = ? and id = ?',
        [run.tipe,run.name,parseInt(run.rounds),parseFloat(run.time),user_id,id])
    }

    getLampByName(name){
        return this.query('Select * from lamps where username = ?;',[name])
    }

    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

const db = null

module.exports = db