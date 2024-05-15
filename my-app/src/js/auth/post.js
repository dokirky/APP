import { supabase } from "../main";

// Function to create a new post
async function createPost(postDetails) {
    try {
        // postDetails should be an object containing all necessary fields
        const { data, error } = await supabase.from("posts").insert([postDetails]).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error creating post:", error.message);
        throw error;
    }
}

// Function to retrieve all posts
async function getPosts() {
    try {
        // Retrieve all posts from the 'posts' table
        const { data, error } = await supabase.from("posts").select("*");

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error retrieving posts:", error.message);
        throw error;
    }
}

// Function to update a post by its ID
async function updatePost(postId, updatedContent) {
    try {
        // Update the post with the specified ID
        const { data, error } = await supabase.from("posts").update({ content: updatedContent }).eq("id", postId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error updating post:", error.message);
        throw error;
    }
}

// Function to delete a post by its ID
async function deletePost(postId) {
    try {
        // Delete the post with the specified ID
        const { data, error } = await supabase.from("posts").delete().eq("id", postId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error deleting post:", error.message);
        throw error;
    }
}


export { createPost, getPosts, updatePost, deletePost };
