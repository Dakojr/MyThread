const sqlite3 = require('sqlite3').verbose()

 var User = require('./../class/user_class');

let db = new sqlite3.Database('./../db/mythread.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    } else {
        console.log("BDD is connect");
    }
})

// function resolveBDD() {
//     return new Promise(resolve => {
//         var db = new sqlite3.Database('./../db/mythread.db', sqlite3.OPEN_READWRITE);
//     });
//   }

let user = new User();


let sql = 'SELECT * FROM user';

db.all(sql, [], (err, rows) => {
    if (err) {
        console.log("fuck");
    } else {
        rows.forEach((row) => {
                user.username = row.username
        });
    }
})



db.close((err, res) => {
    if (err) {
        return console.error(err.message);
    } else {
        res = user;
        //console.log(res);
        console.log("BDD close");        
    }
});

//console.log(user);

//module.exports = user;