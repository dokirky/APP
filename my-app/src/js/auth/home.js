// Import necessary functions
import { doLogout, supabase } from "../main";
import { createPost } from "./post"; // Assuming you have a separate post.js file

// Event listener for logging out
document.body.addEventListener("click", function (event) {
    if (event.target.id === "btn_logout") { 
        // Logic for logging out
        // Disable the button and show loading spinner
        document.querySelector("#btn_logout").disabled = true;
        document.querySelector("#btn_logout").innerHTML = `<div class="spinner-border spinner-border-sm me-2" role="status"></div><span>Loading...</span>`;
        
        doLogout().then(() => {
            // Re-enable the button and change the text
            document.querySelector("#btn_logout").disabled = false;
            document.querySelector("#btn_logout").innerHTML = "Log-in";
        }).catch((error) => {
            console.error("Logout failed:", error);
            // Handle logout error
            document.querySelector("#btn_logout").disabled = false;
            document.querySelector("#btn_logout").innerHTML = "Log-in";
        });
    }
});

// Event listener for creating posts
document.querySelector('.create-post .post button').addEventListener('click', async function() {
    // Get the content of the post from the textarea
    const postContent = document.querySelector('.create-post textarea').value;

    // Call the function to create a post
    try {
        // Show loading spinner
        document.querySelector('.create-post .post button').disabled = true;
        document.querySelector('.create-post .post button').innerHTML = `<div class="spinner-border spinner-border-sm me-2" role="status"></div><span>Posting...</span>`;
        
        await createPost(postContent);

        // Reset textarea content
        document.querySelector('.create-post textarea').value = "";

        // Update UI or display success message
        // For example, you can reload the page to show the new post
        window.location.reload();
    } catch (error) {
        console.error("Error creating post:", error);
        // Display error message or handle error gracefully
    } finally {
        // Re-enable the button and change the text
        document.querySelector('.create-post .post button').disabled = false;
        document.querySelector('.create-post .post button').innerHTML = "Post";
    }
});
