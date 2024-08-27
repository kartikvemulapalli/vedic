var express=require("express")
var bodyParser=require("body-parser")
var mongoose=require("mongoose")

const app=express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))


mongoose.connect('mongodb://localhost:27017/Database')
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))

app.post("/register", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;

    var data = {
        "name": name,
        "email": email,
        "phno": phno,
        "password": password
    };

    // Check if email already exists
    db.collection('users').findOne({ email: email }, (err, user) => {
        if (err) {
            return res.status(500).send("<script>alert('Error occurred while checking for existing email.'); window.location.href='/register.html';</script>");
        }
        if (user) {
            // If the email already exists, send a popup message
            return res.send("<script>alert('Email already registered.'); window.location.href='/register.html';</script>");
        }

        // If email does not exist, insert new user
        db.collection('users').insertOne(data, (err, collection) => {
            if (err) {
                return res.status(500).send("<script>alert('Error occurred while inserting data.'); window.location.href='/register.html';</script>");
            }
            console.log("Record Inserted Successfully");
            return res.redirect('login.html');
        });
    });
});

app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    // Check if the email and password match a user in the database
    db.collection('users').findOne({ email: email, password: password }, (err, user) => {
        if (err) {
            return res.status(500).send("<script>alert('Error occurred while checking login details.'); window.location.href='/login.html';</script>");
        }
        if (!user) {
            // If email or password do not match, show a popup
            return res.send("<script>alert('Invalid email or password.'); window.location.href='/login.html';</script>");
        }

        // If credentials are correct, redirect to a dashboard or homepage
        console.log("Login Successful");
        return res.redirect('home.html'); // Adjust this to your application's needs
    });
});



app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('register.html')
}).listen(3000);

console.log("Listening on port 3000")