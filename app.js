var express = require("express"),
 app = express(),
 mongoose = require("mongoose"),
 bodyParser=require("body-parser"),
 methodOverride = require("method-override"),
 expressSanitizer = require("express-sanitizer");



//Mongoose model config
mongoose.connect("mongodb://localhost/blog_app" ,{useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
//express serving css from pudlic directory
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//expressSanitizer has to be after body-parser


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
  req.body.blog.body = req.sanitize(req.body.blog.body)
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
       res.render("show", {blog: foundBlog});
     }
   });
  });

//edit routes
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      re.redirect("/blogs");
    }else{
      res.render("edit", {blog: foundBlog});
    }
  });

});

//findByIdAndUpdate



//Update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.findOneAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/" + req.params.id);
    }
  });
});



//findByIdAndRemove


// destroy routes
app.delete("/blogs/:id", function (req, res){
  //destroy blog
  Blog.findOneAndDelete(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    }else{
      //redirect
      res.redirect("/blogs");
    }
  });

});


app.listen(3000, function(){
  console.log("Server started!!!");
});
