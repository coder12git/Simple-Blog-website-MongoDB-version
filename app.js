

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// const date = require(__dirname+"/date.js");

// Using Lodash
const _ = require('lodash');


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



const app = express();

const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/postsDB);

const postSchema = new mongoose.Schema({
      title : {
        type : String,
        required : true
      },

      postedOn: Date,

      description : {
        type:String,
        required:true
      }
  });

const Post = mongoose.model("Post",postSchema);



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  Post.find(function(err,posts){
    if(err){
      console.log(err);
    }
    else{
    res.render("home",{posts:posts});
    }
  });

});

app.get("/about",function(req,res){
  res.render("about",{paragraph:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{paragraph:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
})



app.post("/compose",function(req,res){
   const post = new Post({
     title : _.capitalize(req.body.postTitle),
     postedOn: new Date().toString(),
     description : req.body.postBody
   });

   post.save(function(err){
     if(err){
       console.log(err);
     }
     else{
       res.redirect("/");
     }
   });

});

app.post("/cancel",function(req,res){
  res.redirect("/");
});

// Render the correct blog post using post.title in the URL

app.get("/posts/:topic" ,function(req,res){
const requestedTitle = _.capitalize(req.params.topic);

Post.findOne({title:requestedTitle},function(err,post){
  if(err){
    console.log(err);
  }
  else{
    if(!post){
      console.log("Match not found!");
    }
    else{
      res.render("post",{title:post.title , date:post.postedOn ,description:post.description})
    }
  }
});


});

app.get("/posts/edit/:title",function(req,res){
  const requestedTitle =  _.capitalize(req.params.title);

  Post.findOne({title:requestedTitle},function(err,post){
    if(err){
      console.log(err);
    }
    else{
      if(!post){
        console.log("Match not found!");
      }
      else{
        res.render("edit",{input:post.title , text:post.description});

      }
    }
})

});


app.post("/delete/:title",function(req,res){

  var requestedTitle = req.params.title;

  Post.deleteOne({title:requestedTitle},function(err){
    if(!err){
      res.redirect("/");
    }
  });

});

app.post("/editExistingPost",function(req,res){

  Post.updateOne({title:req.body.postTitle},{title:req.body.postTitle,description:req.body.postBody},function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/");
    }
  });

});

app.post("/cancelEdit",function(req,res){
  res.redirect("/");
});



// Render the correct blog post based on post__id
// app.get("/posts/:id",function(req,res){
//   const requestedId = req.params.id;
//   Post.findOne({_id:requestedId},function(err,post){
//     if(err){
//       console.log(err);
//     }
//     else{
//       res.render("post",{title:post.title,description:post.description});
//     }
//   });
//
// });





app.listen(process.env.PORT||3000, function() {
  console.log("Server has started successfully!");
});
