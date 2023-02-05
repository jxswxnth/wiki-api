const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.set({
  strictQuery: true
});
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Article = mongoose.model("Article", articleSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");


app.route("/articles")
  .get((req, res) => {
    Article.find((err, results) => {
      res.send(results);
    });
  })
  .post((req, res) => {
    let article = Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save();
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Everything is gone!");
      }
    });
  });


app.route("/articles/:newArticle")
  .get((req, res) => {
    Article.findOne({
      title: req.params.newArticle
    }, (err, foundArticle) => {
      if (!err) {
        if(foundArticle){
          res.send(foundArticle)
        } else {
          res.send("No articles Matchig with given param")
        }
      } else{
        console.log(err);
      }
    });
  })
  .post((req, res) => {
    const newtitle = req.params.newArticle;
    const article = Article({
      title: newtitle,
      content: "foobar"
    });
    article.save();
  })
  .put((req,res)=>{ //updates the entire doc as a new doc
    Article.findOneAndUpdate(
      {title: req.params.newArticle},
      {title: req.body.title},//content of article won't be present if we use 'put' updated doc
      {overwrite: true},
      (err)=>{
        if(!err){
          res.send("Updated Successfully!");
        }
      }
    );
  })
  .patch((req,res)=>{ //only updates the required part
    Article.findOneAndUpdate(
      {title: req.params.newArticle},
      {$set: {title: req.body.title, price: req.body.price }},//content of article will be present if we use 'patch' updated doc
      (err)=>{
        if(!err){
          res.send(req.body);
        }
      }
    );
  })
  .delete((req,res)=>{
    Article.deleteOne(
      {title: req.params.newArticle},
      (err)=>{
        if(!err){
          res.write(req.body);
          res.send("Deleted Successfully!");
        }
      }
    );
  })

app.listen(port, (req, res) => {
  console.log(`App is listening at ${port}`);
})
