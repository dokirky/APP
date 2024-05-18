// Import necessary functions
import { doLogout, supabase } from "../main";


const form_item = document.getElementById("post_form");
const itemsImageUrl = "https://xhfezetmnqhvulnqwles.supabase.co/storage/v1/object/public/profilePic/";

const userId = localStorage.getItem("user_id");

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

console.log(userId);


const form_item = document.getElementById("post_form");
const itemsImageUrl =
  "https://xhfezetmnqhvulnqwles.supabase.co/storage/v1/object/public/profilePic/";
const userId = localStorage.getItem("user_id");

console.log(userId);
// Event listener for logging out
document.body.addEventListener("click", function (event) {
  if (event.target.id === "btn_logout") {

    // Logic for logging out
    // Disable the button and show loading spinner
    document.querySelector("#btn_logout").disabled = true;
    document.querySelector(
      "#btn_logout"
    ).innerHTML = `<div class="spinner-border spinner-border-sm me-2" role="status"></div><span>Loading...</span>`;

    doLogout()
      .then(() => {
        // Re-enable the button and change the text

        document.querySelector("#btn_logout").disabled = false;
        document.querySelector("#btn_logout").innerHTML = "Log-in";
      })
      .catch((error) => {
        console.error("Logout failed:", error);

        document.querySelector("#btn_logout").disabled = false;
        document.querySelector("#btn_logout").innerHTML = "Log-in";
      });
  }
});

getDatas();
async function getDatas() {

  let { data: posts, error } = await supabase
    .from("posts")
    .select("*,user_infos(*)");

  let container = "";

  posts.forEach((data) => {
    const firstname = data.user_infos?.first_name || "Unknown";
    const lastname = data.user_infos?.last_name || "Unknown";
    const imageUser = data.user_infos?.image_path || "default_image_path.jpg";

    container += `
      <div class="container-fluid insidebarabi secondrow posting p-2" data-post-id="${data.id}">
        <div class="post-author d-flex align-items-center">
          <a href="otherprofile.html">
            <button class="tofriend">
              <div data-id="${imageUser}">
                <img class="block my-2 border border-dark border-2 rounded-circle" style="width: 100px; height: 100px;" src="${itemsImageUrl + imageUser}" alt="">
              </div>
            </button>
          </a>
          <div class="ms-2">
            <h1>${firstname} ${lastname}</h1>
            <small class="mt-3">${data.preferences}</small>
            <p class="UaI">${data.label}</p>
            <small>${formatDate(new Date(data.created_at))}</small>
          </div>
        </div>
        <div class="card p-2 my-2 border border-dark border-2 rounded" style="width: auto;">
          <p class="text-center card-text">${data.post}</p>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="post-id-container">
            <small>Post ID : </small><small class="postidnum">${data.id}</small>
          </div>
          <div>
            <button id="btn_hide_comments" class="btn btn-link" data-post-id="${data.id}">Hide Comments &#9650;</button>
            <button id="btn_interact" class="btn btn-primary" type="button" aria-controls="offcanvasExample" data-post-id="${data.id}">
              Comment
            </button>
          </div>
        </div>
        <div class="comment-section mt-3 p-3" data-post-id="${data.id}">
          <form class="comment-form d-none" data-post-id="${data.id}">
            <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
            <button type="submit" class="btn btn-secondary mt-2">Submit</button>
          </form>
          <div class="comments-list mt-3" data-post-id="${data.id}"></div>
        </div>
      </div>
    `;
  });

  document.getElementById("post_container").innerHTML = container;
  posts.forEach(post => displayComments(post.id));
}

// Event listener for "Comment" button
document.body.addEventListener("click", function (event) {
  if (event.target.id === "btn_interact") {
    const postId = event.target.getAttribute("data-post-id");
    const commentForm = document.querySelector(`.comment-form[data-post-id="${postId}"]`);
    commentForm.classList.toggle("d-none");
  }
});



// Event listener for "Hide Comments" button
document.body.addEventListener("click", function (event) {
  if (event.target.id === "btn_hide_comments") {
    const postId = event.target.getAttribute("data-post-id");
    const commentSection = document.querySelector(`.comment-section[data-post-id="${postId}"]`);
    const commentsList = commentSection.querySelector(".comments-list");
    const btnHideComments = event.target;

    // Toggle the visibility of comments and update the button text accordingly
    commentsList.classList.toggle("d-none");
    if (commentsList.classList.contains("d-none")) {
      btnHideComments.innerHTML = "Show Comments &#9660;";
    } else {
      btnHideComments.innerHTML = "Hide Comments &#9650;";
    }

  }
});
// document.body.addEventListener("click", function (event) {
//     if (event.target.id === "post_btn") {
//      alert("Interact to post... but its under construction");
//     }
//   });




// Event listener for submitting comments
document.body.addEventListener("submit", async function (event) {
  if (event.target.matches(".comment-form")) {
    event.preventDefault();
    const postId = event.target.getAttribute("data-post-id");
    const commentText = event.target.querySelector("textarea").value;

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          post_id: postId,
          user_infos_id: userId,
          comment: commentText,
          created_at: formatDate(new Date()),
        },
      ])
      .select();

    if (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment.");
    } else {
      alert("Comment added successfully!");
      displayComments(postId);
    }

    event.target.reset();
  }
});

async function displayComments(postId) {
  const { data: comments, error } = await supabase
    .from("comments")
    .select("*, user_infos(*)")
    .eq("post_id", postId);

  if (error) {
    console.error("Error fetching comments:", error);
    return;
  }

  const commentsList = document.querySelector(`.comments-list[data-post-id="${postId}"]`);
  commentsList.innerHTML = comments
    .map(
      (comment) => `
      <div class="comment p-2 mb-2 border border-dark border-2 rounded">
        <div class="comment-author d-flex align-items-center mb-2">
          <img class="comment-author-img rounded-circle me-2" style="width: 40px; height: 40px;" src="${itemsImageUrl + (comment.user_infos.image_path || 'default_image_path.jpg')}" alt="">
          <div>
            <span class="fw-bold">${comment.user_infos.first_name} ${comment.user_infos.last_name}</span>
            <small class="text-muted d-block">${formatDate(new Date(comment.created_at))}</small>
          </div>
        </div>
        <p class="mb-1">${comment.comment}</p>
      </div>
    `
    )
    .join("");
}

let for_update_id = "";
form_item.onsubmit = async (e) => {
  e.preventDefault();
  document.querySelector("#post_form button[type='submit']").disabled = true;
  document.querySelector("#post_form button[type='submit']").innerHTML = `<span>Loading...</span>`;

  const formData = new FormData(form_item);
  let image_path = formData.get("image_path");
  let image_data = null;
  
  if (image_path) {
    // Supabase Image Upload
    const image = formData.get("image_path");
    const { data, error } = await supabase.storage
      .from("profilePic")
      .upload("public/" + image.name, image, {
        cacheControl: "3600",
        upsert: true,
      });
    image_data = data;
    if (error) {
      alert("Something wrong happened. Cannot upload image, image size might be too big. You may update the item's image.");
      console.log(error);
    }
  }

  if (for_update_id == "") {
    const formattedDate = formatDate(new Date()); // Get the current date and format it


    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          label: formData.get("label"),
          user_infos_id: userId,
          post: formData.get("post"),
          preferences: formData.get("preferences"),

          created_at: formattedDate, // Insert the formatted timestamp

        },
      ])
      .select();

    if (error) {
      alert("Something wrong happened. Cannot add item.");
      console.log(error);
    } else {

      alert("post Successfully Added!");
      // Reload Datas

      getDatas();
      window.location.reload();
    }
  } else {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        label: formData.get("label"),

        preferences: formData.get("preferences"),

        image_path: image_data ? image_data.path : image_path,
      })
      .eq("id", for_update_id)
      .select();


    if (!error) {
      alert("Post Successfully Updated!");
      // Reset storage id
      for_update_id = "";
      // Reload data
      getDatas();
    } else {
      alert("Something wrong happened. Cannot update item.");

      console.log(error);
    }
  }

  form_item.reset();
  document.querySelector("#post_form button[type='submit']").disabled = false;

  document.querySelector("#post_form button[type='submit']").innerHTML = `Submit`;
};

// Function to get user details
async function getDetails() {
  const baseURL = "https://xhfezetmnqhvulnqwles.supabase.co/storage/v1/object/public/profilePic/";
  try {
    const { data, error } = await supabase
      .from("user_infos")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    const profile = data[0];
    if (!profile) {
      throw new Error("User profile not found");
    }

    const elementsToUpdate = [
      { selector: "#full_name", text: `${profile.first_name} ${profile.last_name}` },
      { selector: "#birthdate", text: profile.birthdate },
      { selector: "#about", text: profile.about },
      { selector: "#contact", text: profile.contact },
      { selector: "#bio", text: profile.bio },
      { selector: "#role", text: profile.role },
      { selector: "#profile_image", attribute: "src", value: baseURL + profile.image_path },
    ];

    elementsToUpdate.forEach(({ selector, text, attribute, value }) => {
      const element = document.querySelector(selector);
      if (element) {
        if (attribute) {
          element.setAttribute(attribute, value);
        } else {
          element.textContent = text;
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    // Handle error case
  }
}

getDetails();

