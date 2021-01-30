const bodyParser = require("body-parser");

const ejs = require('ejs');
const express = require("express")
const mongoose = require("mongoose")

const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true, });

const articleSchema = {
    title: {type : String,
    required: [true, "redundant"]
},
    content: String
};

const Article = mongoose.model("Article", articleSchema);


app.route("/articles").get((req, res)=>{
    
    Article.find((err, results)=>{
        if(!err)
        res.send(results);
        else
        res.send(err);
    } );

})


.post((req, res)=>{


    const newArticle = new Article({
        title: req.body.title,
        
        content: req.body.content
    })
    
    newArticle.save((err)=>{
        if(!err){
            res.send("Successfully added a new article");
        }
        else
        res.send(err);
    });
})

.delete((req, res)=>{

    Article.deleteMany((err)=>{

        if(!err)
        {
            res.send("Successfully deleted article");
        }
        else{
            res.send(err);
        }

    })

});


app.route("/articles/:customArticle/")

.get((req, res)=>{
    
    Article.findOne({title: req.params.customArticle}, (err, result)=>{
        if(!err && result){
            res.send(result);
        }
        else
        res.send(err || "No such article found.");
    })
})

.put((req, res)=>{
    // use replace if you want to completely change the document, which is the main function of put

    if(!req.body.title)
    {res.send("title is requird to update");}
    Article.replaceOne({title: req.params.customArticle},
        {title: req.body.title,
        content: req.body.content},
        {omitUndefined: true},
        
        (err)=>{
            if(!err)
            {
                res.send("successfully updated article");
            }
            else
            {
                res.send(err);
            }
        });
    
})

.patch((req, res)=>{

    Article.updateMany({title: req.params.customArticle},
        {title: req.body.title,
        content: req.body.content},
        {omitUndefined: true},
        
        (err)=>{
            if(!err)
            {
                res.send("successfully updated article");
            }
            else
            {
                res.send(err);
            }
        })
})

.delete((req, res)=>{

    Article.deleteOne({title: req.params.customArticle}, (err)=>{
        if(!err)
        res.send("successfully deleted article");
        else
        res.send(err);
    })


})


app.listen(3000, ()=>{
    console.log("server is running on port 3000");
})