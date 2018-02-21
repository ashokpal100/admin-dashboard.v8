const express = require('express')
const path = require('path')
const app = express()

const appRoot = 'dist';

app.use(express.static(path.join(__dirname,appRoot)))

app.get('/*',function(req,res,next){
    res.sendfile('./'+appRoot+'/index.html');
})

post = 9000;

app.listen(post, "0.0.0.0", function() {
    // body...
    console.log('Serve folder is : '+appRoot+"!");
    console.log('Example app listening on port : '+post+"!");
})