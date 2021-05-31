//-------------------------------------------//

var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var PORT = process.env.PORT || 8080;

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.set("view engine","ejs");
app.use(express.static('static'));


//-------------------------------------------//

//-------------------------------------------//

mongoose.connect('mongodb://localhost:27017/mailbox',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
// db.createCollection('signin')
// db.createCollection('login')

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

//-------------------------------------------//


app.get('/', function (req, res) {
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    
	return res.render("login");
})

app.get('/signin', function (req, res) {
	return res.render("signin");
});

app.get('/forgot', function (req, res){
	return res.render("forgot");
});

//-------------------------------------------//

//-------------------------------------------//
app.post('/loggedin', urlencodedParser, function (req, res){
	var email= req.body.email;
	var password= req.body.password;

    var query = { email: email };
    db.collection("login").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        if(result[0].password == password){
            return res.render('mail',{'user': result[0]})
            // console.log('Done')
        }
    });

});
//-------------------------------------------//

//-------------------------------------------//

app.post('/signedin', urlencodedParser, function (req, res){
	var fname= req.body.fname;
	var lname= req.body.lname;
	var email= req.body.email;
	var password= req.body.password;
	var cpassword= req.body.cpassword;

    var query = { email: email };
    db.collection("signin").find(query).toArray(function(err, result1) {
        if (err) throw err;
        console.log(result1);
        if(result1.length==0){
            if(password==cpassword){
                var data = {
                    "firstname": fname,
                    "lastname": lname,
                    "email" : email,
                    "password" : password
                }
        
                var data2 = {
                    "email" : email,
                    "password" : password
                }
            
                db.collection('signin').insertOne(data,(err,collection)=>{
                    if(err){
                        throw err;
                    }
                    console.log("Record Inserted Successfully Into Sign In collection");
                });
        
                db.collection('login').insertOne(data2,(err,collection)=>{
                    if(err){
                        throw err;
                    }
                    console.log("Record Inserted Successfully Into Login collection");
                });
        
                db.collection('signin').find().forEach( function(myDoc) { console.log( "email: " + myDoc.email ); } );
        
                return res.redirect('/');
        
            }
            console.log('Password Not Matching...try again!!')

        }else{
            console.log('User already exist')
        }
    });

});

//-------------------------------------------//

//-------------------------------------------//

app.post('/forgot', urlencodedParser, function (req, res){
	var email= req.body.email;
	var password = req.body.password;

    db.login.find({ email: email });
    console.log(result)
    // return res.redirect('/');
});

//-------------------------------------------//

//-------------------------------------------//

//reset

//-------------------------------------------//




//-------------------------------------------//

app.listen(PORT,function()
{
  console.log("Server running on port "+ PORT);
});

//-------------------------------------------//
