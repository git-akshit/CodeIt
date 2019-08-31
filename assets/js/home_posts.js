{
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');//grabing #new-post-form from home.ejs 

        newPostForm.submit(function(e){
            e.preventDefault(); //function will work manually not by calling it

            $.ajax({
                type: 'post',
                url: '/posts/create', //same as in the form in home.ejs
                data: newPostForm.serialize(), // by this data will be in key value pair 
                success: function(data){
                    //console.log('data',data.data.post);
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost)); //.delete-post-button(in _post.ejs) is present in newPost

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    // method to create a post in DOM
    //after submiting the form, we will recieve it in posts controller
    let newPostDom = function(post){//not using locals check becaue signed user is the one who created the post
        return $(`<li id="post-${post._id}"> 
        <p>     

                <div class="post-details">
                        <img src="${post.user.avatar}" alt=" ${ post.user.name } ">
                        <small id="user-name">
                               ${ post.user.name }
                        </small>
                        <small id="likes">

                         <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                             <span>
                                <i class="far fa-thumbs-up"></i>   0 Likes
                              <span>
                         </a>
                        </small>
                                 
                <small>
                      <a class="delete-post-button" href="/posts/destroy/${ post._id }">X</a>
                </small>
                </div>                

                <div class="user-posts">
                         ${ post.content }
                </div>
          <!-- display the likes of this post, if the user is logged in, then show the link to toggle likes, else, just show the count -->

                <br>

        </p>

        <div class="post-comments">
                
                        <form id="post-${ post._id }-comments-form" action="/comments/create" method="POST">
                                <input id="comment-box" type="text" name="content" placeholder="Type here to add comment" required>  
                                <input type="hidden" name="post" value="${ post._id }"> <!--since we need the id of the post with the comment -->
                                <input class="submit-button comment-button" type="submit" value="Add Comment">
                        </form>
                

                <div class="post-comments-list">
                        <div id="all-post-header-container">
                                All Comments
                        </div>
                        <ul id="post-comments-${ post._id }">

                        </ul>
                </div>
        </div>
  </li>`)
    }

    //method to delete a post from DOM, this function blocks the behaviour of button and sends the request to delete the post in ajax
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'), //this is how you get value of href in a tag
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


     // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
     let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }


    createPost();
    convertPostsToAjax();
}