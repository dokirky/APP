import { supabase} from "../main";

const login = document.getElementById("login_form");

login.onsubmit = async (e) => {
    e.preventDefault();

    document.querySelector("#login_form button").disabled = true;
    document.querySelector("#login_form button").innerHTML = `<div class="spinner-border spinner-border-sm me-2" role="status"></div><span>Loading...</span>`;

  
    const formData = new FormData(login);

    // Supabase sign-in
    let { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get("email"),
        password: formData.get("password"),
    });


    let session = data.session;
    let user = data.user;

    console.log(user);

    if (session != null) {
        // Store tokens for API
        localStorage.setItem("access_token", session.access_token);
        localStorage.setItem("refresh_token", session.refresh_token);

        // Save user id in local storage
        localStorage.setItem("auth_id", user?.id);

        // Fetch user profiles
        let { data: profiles, error } = await supabase
            .from("user_infos")
            .select("*")
            .eq("user_id", localStorage.getItem("auth_id"));

       
    if (session != null) {
        const userRole = profiles[0].role;
        const userId = user.id;
  
        console.log(userRole);
        localStorage.setItem("role", userRole); //e butang lang ni sa variable para ma acces nimo sa lain HTML.
        if (userRole === "admin") {
          window.location.pathname = "/siteadmin.html"; //if admin ang role mo redirect sa siteadmin.html
        } else if (userRole === "user") {
          window.location.pathname = "/home.html"; //if user ang role mo redirect sa home.html
        } else {
         alert(`Error: ${error.message}`);
          console.log(error);
        }
      }
    } else {
       alert("Error Please Try again or check your password");
        console.log(error);
    }

    // Reset form and enable login button
    login.reset();
    document.querySelector("#login_form button").disabled = false;
    document.querySelector("#login_form button").innerHTML = "Log-in";
   
};