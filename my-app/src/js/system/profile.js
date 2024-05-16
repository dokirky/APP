import { supabase } from "../main";



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
  
      console.log("User First Name:", data[0].first_name);
      console.log("User Last Name:", data[0].last_name);
      console.log("User Birthdate:", data[0].birthdate);
      console.log("User Contact:", data[0].contact);
      console.log("User Bio:", data[0].bio);
      console.log("User About:", data[0].about);
      console.log("User path:", baseURL + data[0].image_path);
  
      const profilePicinamo = document.getElementById("myProfilefuck");
      profilePicinamo.src = baseURL + data[0].image_path;

      const displayFirstName = document.getElementById("first_name");
      displayFirstName.textContent = data[0].first_name + " ";
  
      const displayLastName = document.getElementById("last_name");
      displayLastName.textContent = data[0].last_name;
  
      const displayBirthdate = document.getElementById("birth_date");
      displayBirthdate.textContent = data[0].birthdate;

      const displayBio = document.getElementById("bio");
      displayBio.textContent = data[0].bio;

      const displayContact = document.getElementById("contact");
      displayContact.textContent = data[0].contact;
  
      const displayAbout = document.getElementById("about");
      displayAbout.textContent = data[0].about;
  
  
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  getDetails();

