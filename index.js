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

const uri = process.env.MONGODB_URI;

//-------------------------------------------//

//-------------------------------------------//

// mongoose.connect('mongodb+srv://vaishnavi:haravrva@cluster0.p1v2h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    mongoose.connect(uri,{
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
    
	 res.render("login");
})

app.get('/signin', function (req, res) {
	 res.render("signin");
});

app.get('/forgot', function (req, res){
	 res.render("forgot");
});

app.post('/compose', urlencodedParser, function (req, res){
	var email= req.body.email;

	 res.render("compose",{'email':email});
});

app.post('/inbox', urlencodedParser, function (req, res){
	var email= req.body.email;


    var query = { to: email };

    db.collection("inbox").find(query).toArray(function(err, result) {
        if (err) throw err;
        res.render('inbox',{'data': result})

    });
});


//-------------------------------------------//

//-------------------------------------------//
app.post('/loggedin', urlencodedParser, function (req, res){
	var email= req.body.email;
	var password= req.body.password;
    
    var query = { email: email };
    db.collection("signin").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        if(result.length>0){
            if(result[0].password == password){
                res.render('mail',{'user': result[0]})
    
            }else{
                console.log('Invalid password');
                res.redirect('/')
            }
        }else{
            res.redirect('/')
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
        
                // db.collection('signin').find().forEach( function(myDoc) { console.log( "email: " + myDoc.email ); } );
        
                 res.redirect('/');
        
            }else{
                console.log('Password Not Matching...try again!!')
                res.redirect('signin')
            }

        }else{
            console.log('User already exist')
            res.redirect('signin')

        }
    });

});

//-------------------------------------------//

//-------------------------------------------//

app.post('/forgot', urlencodedParser, function (req, res){
	var email= req.body.email;
	var password = req.body.password;

    var myquery = { email: email };
    var newvalues = { $set: {password:password } };
    db.collection("signin").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });
    db.collection("login").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });

    res.redirect('/')
});

//-------------------------------------------//

/-------------------------------------------//

app.post('/mailsent', urlencodedParser, function (req, res){
	var to= req.body.to;
	var subject= req.body.subject;
	var message= req.body.message;
	var from= req.body.from;

    var data = {
        "to": to,
        "from": from,
        "subject": subject,
        "message": message
    }

    db.collection('inbox').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully Into Inbox  collection");
    });

    res.render('mail',{'user':from})
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
