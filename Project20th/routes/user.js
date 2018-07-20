
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
     
      var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
//    console.log('ddd='+userId);
//    if(userId == null){
//       res.redirect("/");
//       return;
//    }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};

 exports.movies=function(req,res){

    var userId = req.session.userId;
    var sql="SELECT * FROM `movie_info`";          
    db.query(sql, function(err, result){  


        if (err) {
            req.flash('error', err)
            res.redirect("/");
            return;
        } else {
            // render to views/user/list.ejs template file
            res.render('movies.ejs', {
                data:result
            });
        }
});

}

//Adding Movie
exports.addmovie=function(req,res){
    message = '';
    if(req.method == "POST"){
       const post  = req.body;
       const name= post.movie_name;
       const genre= post.movie_genre;
       const director= post.movie_director;
       const language= post.movie_language;
       const year= post.movie_year;
       const desc = post.movie_desc;
 
       var sql = "INSERT INTO `movie_info`(`movie_name`,`movie_genre`,`movie_director`,`movie_language`,`movie_year`,`movie_desc`) VALUES ('" + name + "','" + genre + "','" + director + "','" + language + "','" + year + "','" + desc + "')";
 
       var query = db.query(sql, function(err, result) {
 
          message = "Your movie has been added:)";
        //   req.flash('success', 'Movie added successfully!')
          res.render('add.ejs',{message: message});
       });
 
    } else {
       res.render('add');
    }

}

//Editing Movie
exports.edit = function(req, res){
    
    var id = req.params.id;
         
    var query = db.query('SELECT * FROM `movie_info` WHERE id = ?',[id],function(err,rows)
          {
              
              if(err)
                  console.log("Error Selecting : %s ",err );
       
              res.render('edit',{
                  page_title:"Edit Movie",
                  data:rows
                });
                             
           });
                   
      
  };
//Saving edited movie record
  exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
        
        var data = {
            
            movie_name    : input.movie_name,
            movie_genre : input.movie_genre,
            movie_director   : input.movie_director,
            movie_language  : input.movie_language,
            movie_year: input.movie_year,
            movie_desc: input.movie_desc
        
        };
        
        var query = db.query("UPDATE `movie_info` set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/home/movies');
        //   req.flash('success', 'Movie updated successfully!')
          
        });
    
  
};

//Deleting a single Movie
exports.delete_movie = function(req,res){
          
    var id = req.params.id;
       
    var query = db.query("DELETE FROM movie_info  WHERE id = ? ",[id], function(err, rows)
       {
           
            if(err)
                console.log("Error deleting : %s ",err );
            // req.flash('success', 'Movie deleted successfully!')
            res.redirect('/home/movies');
            
       });
       
};
//Deleting all movies
exports.delete_all = function(req,res){
    var id = req.params.id;

    var query = db.query("DELETE FROM movie_info", function(err, rows){

        if (err) {
            // req.flash('error', err)
            // redirect to users list page
            res.redirect('/movies')
        } else {
            // req.flash('success', 'All movies deleted successfully!')
            // redirect to users list page
            res.redirect('/home/movies')
        }
    })
}
//Searching for movies
exports.search=function(req,res){

    const userInput = req.body.search;
	//console.log(typeof(userInput));
	
	var query = db.query('SELECT * FROM movie_info WHERE movie_name LIKE "%'+userInput+'%" OR  movie_genre LIKE "%'+userInput+'%" OR  movie_director LIKE "%'+userInput+'%" OR  movie_language LIKE "%'+userInput+'%" OR  movie_year LIKE "%'+userInput+'%" OR  movie_desc LIKE "%'+userInput+'%"' ,
		function(err, result){
			//if(err) throw err
		if (err) {
			// req.flash('error', err)
			res.render('movies', {
				title: 'Sorry :::(', 
				data: result
			})
		} else {
			
			res.render('movies', {
				title: 'Search Result', 
				data: result
			})

		}
		})
	
}
