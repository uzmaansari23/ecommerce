const express = require('express')
const router = express.Router();
const client = require('../model/connection');
const customizeUser = require('./userMail')


router.post('/login', (req, res) => {

    const { Email,Password } = req.body;
    console.log(Password)
    client.query(`SELECT * FROM users WHERE email='${Email}'`, (error, results) => {
      if (error) {
        console.log(error)
        
      }
      else if(results.rowCount>0){
        console.log(results)
      if(results.rows[0].password===Password){
        const user = {
          id:results.rows[0].id,
             firstname: results.rows[0].firstname ,
             lastname:results.rows[0].lastname,
             email:results.rows[0].email,
          role: results.rows[0].role
        };
        console.log(results.rows)
        res.status(200).json({user: user});
      }
      else{
        res.status(200).json({user:1})
      }
      
    }
    else{
      console.log(results)
      res.status(200).json({user:0})
    }
    
    });
  });

  router.post('/signup', (req, res) => {
    console.log(req.body)
    const { FirstName,LastName,Email,Mobile,Password } = req.body;
    client.query(`SELECT * FROM users WHERE email='${Email}'`, (error, results) => {
      if (error) {
        console.log(error)
        
      }
      else if(results.rowCount>0){
        console.log(results)
        res.status(200).json({user:0})
      
    }
    else{
      client.query(`INSERT INTO users (FirstName,LastName,Email,Mobile,Password) VALUES ('${FirstName}', '${LastName}','${Email}','${Mobile}','${Password}')`,  (error, result) => {
        if (error) {
          throw error;
        }
        customizeUser(Email)
        client.query(`SELECT * FROM users WHERE email='${Email}'`, (error, results) => {
          if (error) {
            throw error;
          }
          const user = {
            id:results.rows[0].id,
            firstname: results.rows[0].firstname ,
            lastname:results.rows[0].lastname,
            email:results.rows[0].email,
         role: results.rows[0].role
       };
       console.log(results.rows)
       res.status(200).json({user: user});
        })
      
      });
    }
  })
    
   
  });








module.exports = router