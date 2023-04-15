const express = require('express')

const fs = require('fs');
const router = express.Router();
const client = require('../model/connection');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const customizeMess = require('./mailServices')







router.post("/submit-product", upload.array("images[]"), async (req, res) => {
 
    const files = req.files;
    const data = JSON.parse(req.body.product)
    console.log(data)
    const name = data.name;
    const description = data.description;
    const price = data.price;
    const quantity = data.quantity
  
    try {
      
      await client.query("BEGIN");
  
      const insertProductQuery = "INSERT INTO products (name, description, price, qunatity ) VALUES ($1, $2, $3,$4) RETURNING id";
      const { rows } = await client.query(insertProductQuery, [name, description, price,quantity]);
      const productId = rows[0].id;
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(file.path)
        const imageBuffer = fs.readFileSync(file.path);
        const insertImageQuery = "INSERT INTO product_images (product_id, image_data) VALUES ($1, $2)";
        await client.query(insertImageQuery, [productId, imageBuffer]);
      }
  
      await client.query("COMMIT");
      res.status(200).send("Product submitted successfully");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      res.status(500).send("Error while submitting the product");
    } 
  });
  
 
  router.post("/update-product", upload.array("images[]"), async (req, res) => {
    console.log(req)
      const files = req.files;
      const data = JSON.parse(req.body.product)
      console.log(data)
     
      const name = data.name;
      const description = data.description;
      const price = data.price;
      const quantity = data.quantity;
      const product_Id = data.productId;
    
      try {
        
        await client.query("BEGIN");
    
        const updateProductQuery = "UPDATE products SET name = $1, description = $2, price = $3, qunatity = $4 WHERE id = $5 RETURNING id";
        const { rows } = await client.query(updateProductQuery, [name, description, price, quantity, product_Id]);
        const productId = rows[0].id;
    
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(file.path)
          const imageBuffer = fs.readFileSync(file.path);
          const insertImageQuery = "INSERT INTO product_images (product_id, image_data) VALUES ($1, $2)";
          await client.query(insertImageQuery, [productId, imageBuffer]);
        }
    
        await client.query("COMMIT");
        res.status(200).send("Product Updated successfully");
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).send("Error while submitting the product");
      } 
    });
    
   
    

  router.get('/products', async (req, res) => {
    try {
      const { rows } = await client.query(`
      SELECT p.*,  pi.image_data, 
      pi.id,
      p.id  as product_id
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      ORDER BY p.id, pi.id
  
  
        
      `);
      const products = [];
      let currentProduct;

      rows.forEach((row) => {
        if (!currentProduct || currentProduct.id !== row.product_id) {
          
          currentProduct = {
            
            id: row.product_id,
            name: row.name,
            description: row.description,
            price: row.price,
            images: [],
          };
          products.push(currentProduct);
        }
        if (row.image_data && row.product_id) {
          currentProduct.images.push({
            data: row.image_data,
            
          });
        }
      });
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error while fetching products');
    }
  });



  router.get('/mainproduct/:id', async (req, res) => {
    const id = req.params.id
    try {
      const { rows } = await client.query(`
      SELECT p.*,  pi.image_data, 
      pi.id,
      p.id as product_id 
      FROM products p  
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.id = '${id}'
      ORDER BY p.id, pi.id 
  
  
        
      `);
      const products = [];
      let currentProduct;
     
      rows.forEach((row) => {
        if (!currentProduct || currentProduct.id !== row.product_id) {
          
          currentProduct = {
            
            id: row.product_id,
            name: row.name,
            description: row.description,
            price: row.price,
            quantity:row.qunatity,
            images_id:[],
           
            images: [],
          };
          products.push(currentProduct);
        }
        if (row.image_data && row.product_id) {
          currentProduct.images_id.push(row.id)
          currentProduct.images.push({
          
            data: row.image_data,
            
            
          });
      
        }
      });
     
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error while fetching products');
    }
  });




  router.post('/addToCart',(req,res)=>{
    

    const { product_id,email,quantity,amount } = req.body;
    let product_quantity = 0
    
    client.query(`SELECT * FROM products WHERE id='${product_id}'`,(error,results)=>{
      if(error){
        throw error;
      }else{
        if(results.rows[0].qunatity>0){
          product_quantity = results.rows[0].qunatity
          client.query(`SELECT * FROM cart_info WHERE product_id='${product_id}' AND email='${email}'; ` ,(error,results)=>{
            if(error){
              throw error;
            }else{
              if(results.rowCount>0){

                const newQunatity = results.rows[0].quantity + 1
                const newAmount = (parseFloat(results.rows[0].amount) / results.rows[0].quantity)*newQunatity
                client.query(`UPDATE cart_info SET quantity=${newQunatity}, amount='${newAmount}'  WHERE product_id ='${product_id}' AND email = '${email}'; `, (error,results)=>{
                 if(error){
                   throw error;
                 }
                 else{
                   res.send('Added to cart successfully.')
                 }
                })
              }else{
                client.query(`INSERT INTO cart_info (product_id,email,quantity,amount) VALUES('${product_id}','${email}','${quantity}',${amount});`,  (error, result) => {
                  if (error) {
                    throw error;
                  }
                  console.log(result.rows)
                 res.send("Added to cart successfully.");
                
                });
              }

            }
          });
        }else{
          res.send("Product is not available at the moment.")
        }
        
     
       
      }
    })
   

  })



  router.post('/cartinfo', (req,res)=>{
    const {email} = req.body;
     client.query(`
     SELECT cart_info.product_id, cart_info.email, cart_info.quantity, cart_info.amount, products.name
FROM cart_info
JOIN products
ON cart_info.product_id = products.id
WHERE cart_info.email='${email}';
`,(error,results)=>{
      if(error){
        throw error;
      } 
      console.log(results.rows)
      res.status(200).json(results.rows);    })
  })


  
  router.post('/checkout',(req,res)=>{
    console.log(req.body)
    


    const { cartInfo,address } = req.body;
    console.log(cartInfo.length)
    const product_name=[]
    const email1 = cartInfo[0].email
    for(let i = 0; i<cartInfo.length;i++){
      const product_id= cartInfo[i].product_id
      const email = cartInfo[i].email
      const quantity = cartInfo[i].quantity
      const price_paid = cartInfo[i].amount


      client.query(`SELECT * FROM products WHERE id='${product_id}'`,(error,results)=>{
        if(error){
          throw error;
        }else{
          console.log(results.rows[0].qunatity>=quantity)
          product_name.push(results.rows[0].name)
          if(results.rows[0].qunatity>=quantity){
            const newOne = results.rows[0].qunatity - quantity;
            console.log(quantity)
            console.log(newOne)
            client.query(`UPDATE products SET qunatity=${newOne} WHERE id = '${product_id}';`,(error,results)=>{
              if(error){
                
                console.log(error)
              }
              
            })
            
      client.query(`INSERT INTO sales_info (product_id,email,quantity_purchased,price_paid,address) VALUES('${product_id}','${email}','${quantity}','${price_paid}','${address}');`,  (error, result) => {
        if (error) {
          throw error;
        }
        client.query(`DELETE FROM cart_info WHERE product_id='${product_id}' AND email='${email}'`,(error,results)=>{
          if(error){
            throw error
          }
          
        })

      
        
       
      
      });
                
              
            
          }else{
            res.send("Product is not available at the moment.")
          }
        }
      })
    }
    customizeMess(cartInfo,email1)
    res.send("product is sold")
   

  
  })



  router.post('/deleteProduct',(req,res)=>{
    const {id} = req.body
    client.query(`DELETE FROM product_images WHERE product_id ='${id}';`,(error,results)=>{
      if(error){
        throw error;
      }else{
        client.query(`DELETE FROM products WHERE id = '${id}';`,(error,results)=>{
          if(error){
            throw error
          }else{
            res.send("Deleted Successfully")
          }
        })     }
    })
  })


  router.post('/deleteImage',(req,res)=>{
    const {id} = req.body
   
        client.query(`DELETE FROM product_images WHERE id = '${id}';`,(error,results)=>{
          if(error){
            throw error
          }else{
            res.send("Deleted Successfully")
          }
        })     
  
  })

  
  router.post('/deleteCart',(req,res)=>{
    const {product_id,email} = req.body
   
        client.query(`DELETE FROM cart_info WHERE product_id = ${product_id} AND email='${email}';`,(error,results)=>{
          if(error){
            throw error
          }else{
            res.send("Deleted Successfully")
          }
        })     
  
  })

  router.post('/saleinfo', (req,res)=>{
    const {email,role} = req.body;
    if(role=='user'){
     client.query(`
     SELECT sales_info.product_id, sales_info.email, sales_info.quantity_purchased, sales_info.price_paid, sales_info.address, products.name
FROM sales_info
JOIN products
ON sales_info.product_id = products.id
WHERE sales_info.email='${email}';
`,(error,results)=>{
      if(error){
        throw error;
      } 
 
    
      res.status(200).json(results.rows);    })}
      else{
        client.query(`
        SELECT sales_info.product_id, sales_info.email, sales_info.quantity_purchased, sales_info.price_paid, sales_info.address, products.name
   FROM sales_info
   JOIN products
   ON sales_info.product_id = products.id
 
   `,(error,results)=>{
         if(error){
           throw error;
         } 
         console.log(results.rows)
         res.status(200).json(results.rows);    })
      }
  })
  module.exports = router