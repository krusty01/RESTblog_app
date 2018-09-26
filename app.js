var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser=require("body-parser");
var methodOverride = require("method-override");



//Mongoose model config
mongoose.connect("mongodb://localhost/blog_app" ,{useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
//express serving css from pudlic directory
app.use(methodOverride("_method"));


//Mongoose app config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image: "https://cdn.pixabay.com/photo/2015/11/07/11/34/kitten-1031261__340.jpg",
//   body: "Hello this is a blog post"
//
// });


//RESTful routes

//root route
app.get("/", function(req, res){
  res.redirect("/blogs");
});


// GET index route
app.get("/blogs", function (req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("Error!");
    }else {
      res.render("index", {blogs: blogs});
    }
  });
});


//new routes
app.get("/blogs/new", function (req, res){
  res.render("new");
});

//create route

app.post("/blogs", function(req, res){
  //1create blog
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render("new");
    }else{
      //2redirect to index
      res.redirect("/blogs");
    }
  });
});


//SHOW routes

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
     if(err){
       res.redirect("/blogs");
     }else{
       res.render("/show", {blog: foundBlog});
     }
   })
  });

//edit routes
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err foundBlog){
    if(err){
      re.redirect("/blogs");
    }else{
      res.render("edit", {blog: foundBlog});
    }
  });

});

//Update route
app.put("/blogs/:id", function(req, red){
  Blog.findById(id, newData, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect(("/blogs");
    }else{
      res.redirect("/blogs/"+ req.params.id);
    }
  });
});


app.listen(3000, function(){
  console.log("Server started!!!");
});
