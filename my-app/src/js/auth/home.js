// Import necessary functions
import { doLogout, supabase } from "../main";

const form_item = document.getElementById("post_form");
const itemsImageUrl =
"https://xhfezetmnqhvulnqwles.supabase.co/storage/v1/object/public/profilePic/";

const userId = localStorage.getItem("user_id");

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}|${hours}:${minutes}:${seconds}`;
}

async function addTimestamp() {
  // Get the current date and time
  const date = new Date();
  
  // Format the date
  const formattedDate = formatDate(date);

  // Insert into Supabase
  const { data, error } = await supabase
    .from('posts')
    .insert([{ created_at: formattedDate }]);

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Data inserted:', data);
  }
}

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
        // Handle logout error
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
          <div class="container-fluid insidebarabi secondrow posting p-2">
            <div class="post-author">
              <a href="otherprofile.html">
                <button class="tofriend" >
                <div data-id="${imageUser}">
                  <img class="block my-2 border border-dark border-2 rounded-circle" style="width: 100px; height: 100px;"  src="${
                    itemsImageUrl + imageUser
                  }" alt="">
                </div>
                </button>
              </a>
              <div class="ms-2">
                <h1 >${firstname} ${lastname}</h1>
                <small class="mt-3">${data.preferences}</small>
                <p class="UaI">${data.label}</p>
                <small>${data.created_at}</small>
              </div>
            </div>
            <div class="card p-2 my-2" style="width: auto;">
              <p class=" text-center card-text">${data.post}</p></div>
            <div class="d-flex">
              <div class="col-3">
                <small>Post ID : </small><small class="postidnum">${
                  data.id
                }</small>
              </div>
              <div class="col-3"></div>
              <div class="col-6 text-end">
                <button id="btn_interact" class="btn btn-primary" type="button" aria-controls="offcanvasExample">
                  Interact
                </button>
              </div>
            </div>
          </div>
      `;
  });

  document.getElementById("post_container").innerHTML = container;
}

// Event listener for "Interact" button
document.body.addEventListener("click", function (event) {
  if (event.target.id === "btn_interact") {
    alert("Interact to post... but its under construction");
  }
});

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
      alert("Post Successfully Added!");
      // Reload data
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      throw new Error("Failed to fetch user data: " + userError.message);
    }

    const { data, error } = await supabase
      .from("user_infos")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      throw new Error("Failed to fetch user data: " + error.message);
    }

    if (!data || data.length === 0) {
      console.error("No data found for user");
      return;
    }

    console.log("User path:", baseURL + data[0].image_path);

    const profilePicinamo = document.getElementById("myProfilefuck");
    profilePicinamo.src = baseURL + data[0].image_path;


  } catch (error) {
    console.error("Error:", error.message);
  }
}

getDetails();

