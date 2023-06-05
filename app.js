const express=require('express');
const bodyParser=require('body-parser');
const request=require('request');
const https=require('https');
const port=3000;
const app=express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname+'/signup.html');
});

app.post('/', function(req, res){
    const fName=req.body.firstName;
    const lName=req.body.lastName;
    const email=req.body.email;

    // console.log('first name : '+fName+' , last name : '+lName+' , emaiil  : '+email);

    const data={
        members: [
            {
                email_address: email, 
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    const url ='https://us21.api.mailchimp.com/3.0/lists/1697e1a9d5';

    const options={
        method: "post",
        auth: "kartik1:bc099eeeb66614e4ce9a1c168d7b01ae-us21"
    }

    const request=https.request(url, options, function(response){

        if(response.statusCode===200){
            // res.send("successfully subscribed!");
            res.sendFile(__dirname+'/success.html');
        }
        else{
            // res.send("there was an error signing in");
            res.sendFile(__dirname+'/failure.html');
        }

        response.on('data', function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post('/failure', function(req, res){
    res.redirect('/');
})

app.listen(process.env.PORT || port , function(){
    console.log('server is up and running in the port : ', port);
    
});

// api key : bc099eeeb66614e4ce9a1c168d7b01ae-us21 
// password : 1697e1a9d5