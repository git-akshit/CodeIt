{let t=function(){let t=$("#new-post-form");t.submit(function(s){s.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:t.serialize(),success:function(t){let s=e(t.data.post);$("#posts-list-container>ul").prepend(s),n($(" .delete-post-button",s)),new PostComments(t.data.post._id),new ToggleLike($(" .toggle-like-button",s)),new Noty({theme:"relax",text:"Post published!",type:"success",layout:"topRight",timeout:1500}).show()},error:function(t){console.log(t.responseText)}})})},e=function(t){return $(`<li id="post-${t._id}"> \n        <p>     \n\n                <div class="post-details">\n                        <img src="${t.user.avatar}" alt=" ${t.user.name} ">\n                        <small id="user-name">\n                               ${t.user.name}\n                        </small>\n                        <small id="likes">\n\n                         <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${t._id}&type=Post">\n                             <span>\n                                <i class="far fa-thumbs-up"></i>   0 Likes\n                              <span>\n                         </a>\n                        </small>\n                                 \n                <small>\n                      <a class="delete-post-button" href="/posts/destroy/${t._id}">X</a>\n                </small>\n                </div>                \n\n                <div class="user-posts">\n                         ${t.content}\n                </div>\n          \x3c!-- display the likes of this post, if the user is logged in, then show the link to toggle likes, else, just show the count --\x3e\n\n                <br>\n\n        </p>\n\n        <div class="post-comments">\n                \n                        <form id="post-${t._id}-comments-form" action="/comments/create" method="POST">\n                                <input id="comment-box" type="text" name="content" placeholder="Type here to add comment" required>  \n                                <input type="hidden" name="post" value="${t._id}"> \x3c!--since we need the id of the post with the comment --\x3e\n                                <input class="submit-button comment-button" type="submit" value="Add Comment">\n                        </form>\n                \n\n                <div class="post-comments-list">\n                        <div id="all-post-header-container">\n                                All Comments\n                        </div>\n                        <ul id="post-comments-${t._id}">\n\n                        </ul>\n                </div>\n        </div>\n  </li>`)},n=function(t){$(t).click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(t){$(`#post-${t.data.post_id}`).remove(),new Noty({theme:"relax",text:"Post Deleted",type:"success",layout:"topRight",timeout:1500}).show()},error:function(t){console.log(t.responseText)}})})},s=function(){$("#posts-list-container>ul>li").each(function(){let t=$(this),e=$(" .delete-post-button",t);n(e);let s=t.prop("id").split("-")[1];new PostComments(s)})};t(),s()}