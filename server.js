const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express()
const bcrypt = require('bcryptjs');
require('dotenv').config();


// Middleware
app.use(cors())
app.use(express.json())



// Create Connection with the Database
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,   
    user: "sabir",
    password: "sabbir",
    database: "project01"
})



// Check the DB Perfectly connect or not
db.connect((error)=>{
    if (error){
        console.error("No Connection with DB " + error.stack)
    }
    else{
        console.log("Successfully Connect with sql DB")
    }
})

app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    return res.json("Hire link Server is running")
})

// Show All User Info
app.get("/user_info",(req,res)=>{
   const sql = "SELECT * FROM user_info";
   db.query(sql,(err,data)=>{
    if(err){
        console.error("error " + err.stack)
        return res.json("Error occurs")
    }
    return res.json(data)
   })
})

// Show All Guid Info
app.get("/alljobs",(req,res)=>{
   const sql = "SELECT * FROM job_fields";
   db.query(sql,(err,data)=>{
    if(err){
        console.error("error " + err.stack)
        return res.json("Error occurs")
    }
    return res.json(data)
   })
})
app.post('/alljobs', async (req, res) => {
  const { category_name, job_title, description, key_responsibilities, skills_and_experience, expiration_date, location, hours_per_week, rate_per_hour, salary, skills, image_url } = req.body;

  // Logging the new job data for debugging
  console.log('New Job Data:', req.body);

  // SQL query to insert the new job into the jobs table
  const query = `
    INSERT INTO job_fields (category_name, job_title, description, key_responsibilities, skills_and_experience, expiration_date, location, hours_per_week, rate_per_hour, salary, skills, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the query with the provided values
  db.query(
    query,
    [
      category_name,
      job_title,
      description,
      key_responsibilities,
      skills_and_experience,
      expiration_date,
      location,
      hours_per_week,
      rate_per_hour,
      salary,
      skills,
      image_url
    ],
    (err, result) => {
      if (err) {
        // If there is an error, send it back as a response
        console.error('Error inserting job:', err);
        return res.status(500).send(err);
      }

      // If successful, send the result back
      console.log('Job added successfully:', result);
      res.status(201).send(result);
    }
  );
});
// quiz information
app.get("/quizs",(req,res)=>{
  const sql = "SELECT * FROM quiz";
  db.query(sql,(err,data)=>{
   if(err){
       console.error("error " + err.stack)
       return res.json("Error occurs")
   }
   return res.json(data)
  })
})



// Post Data In DB
app.post('/user_info', async(req,res)=>{

  // For Password Incription
  const salt = await bcrypt.genSalt(10)
  const secPass = await bcrypt.hash(req.body.password , salt) 

    const newUser = req.body;
        const name =  req.body.name
        const email = req.body.email
        const number = req.body.number
        const gender = req.body.gender
        const role = req.body.role
        const password = secPass
        
    console.log(newUser)
    

      db.query ("INSERT INTO user_info (name,email,number,gender,role,password) VALUES(?,?,?,?,?,?)",[name,email,number,gender,role,password]),
        (err,result)=>{
            if(result){
                res.send(result)
            }
            else{
                res.send(err)
            }
        }
})



// Delete Single package
app.delete('/delete_jobs/:p_id', (req, res) => {
    const id = req.params.p_id;
  
    const query = 'DELETE FROM job_fields WHERE p_id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: 'Failed to delete package' });
      }
      else {
        if (result.affectedRows > 0) {
          res.json({ deletedCount: result.affectedRows });
        } else {
          res.status(404).json({ error: 'Package not found' });
        }
      }
    });
  });




app.put('/updated_package/:p_id',async(req, res) => {
    const id = req.params.p_id;
    const updatedPackage = req.body;
    console.log(updatedPackage)
    const { name,a_id,g_id,category,season,duration,cost,location,description,emergency,photo } = req.body;
  
    const query = 'UPDATE package SET name = ?, a_id=?, g_id=?, category=?, season=?, duration=?, cost=?, location=?, description = ?, emergency=?, photo=?  WHERE p_id = ?';
    db.query(query, [name,a_id,g_id,category,season,duration,cost,location,description,emergency,photo,id], (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        res.status(500).send('Error updating data');
      } 
      if (result.affectedRows === 0) {
        // No rows updated, possibly because the package ID doesn't exist
        return res.status(404).json({ error: 'Package not found' });
      }
      else {
        // alert('Updated Successfully')
        res.send(`Updated entry with ID: ${id}`);
      }
    });
  });



  // Search
  




app.listen(5000,()=>{
    console.log(`Server in running on port ${port}`)
})
