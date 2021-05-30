{
  // method to submit the form data for new post amnually(ajax)
  let createPost = function () {
    // get data from form with given id
    let newPostForm = $("#create-post");

    newPostForm.submit(function (e) {
      // prevent default behaiour of submit in form
      e.preventDefault();

      $.ajax({
        // route method POST
        type: "post",
        url: "/posts/create",
        // change form data into json
        data: newPostForm.serialize(),
        success: function (data) {
          // console.log(data);
          // look hierarchy in console , ajax-data (here)-> json-data (controller res)-> post object, so data.data.post
          let newPost = newPostDom(data.data.post);
          $("#post-ul").prepend(newPost);
          deletePost($(".delete-post-icon", newPost));
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  // method to display new post data in DOM
  let newPostDom = function (post) {
    // add code from _post.ejs for display here & make changes
    return $(`<li id="post-${post._id}">
    <div
      class="offset-md-1 col-lg-10 shadow-lg mb-5 p-3 bg-body rounded"
      style="
        border-radius: 5%;
        background-color: rgb(165 126 51 / 84%);">
      <p><h4><span class="mr-2">${post.title}</span>
       <small  style="margin-left: 12em;" >
         <a
           class="toggle-like-button"
           data-likes="${post.likes.length}"
           href="/likes/toggle/?id=${post._id}&type=Post">
           <span>${post.likes.length} <i class="fas fa-thumbs-up"></i></span>
         </a> 
       </small>
        <small class="ml-3 ">
          <a class="delete-post-icon" href="/posts/delete/${post._id}">
            <i class="fas fa-trash"></i>
            <!-- <i class="fas fa-trash" aria-hidden="true"></i> -->
          </a>
        </small>
      </h4>
      </p>
      <p class="ml-4">${post.content}</p> 
      <small class="ml-4">
        Posted By : ${user.name}   
      </small><br>
      &nbsp; 
      <div class="ml-3 mt-1">    
        <form
          id="post-${post._id}-comments-form"
          action="/comments/create"
          method="post"
          class="m-0 p-0 "
          style="background: none; display: inline;">
          <input type="hidden" value="${post._id}" name="post" />
          <textarea
            rows="1"
            cols="3"
            placeholder="Add Comment"
            name="content"
            required
            class="form-control bg-light"
            style="border-bottom: 1px solid silver; background: whitesmoke; display: inline; width: 60%; "
          ></textarea>
          <input type="submit" value="Add Comment" class="btn btn-primary mt-2">
        </form>
      </div>
         
       
      
    </div>
  </li>`);
  };

  // method to delete a post
  let deletePost = function (deleteLink) {
    console.log("deleteLink", deleteLink);
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          // from res sent by post_controller - delete function
          $(`#post-${data.data.post_id}`).remove();
          console.log("del");
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  createPost();
}
