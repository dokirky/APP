import {
    doLogout,
    supabase,
  } from "../main";
  //btn logout para sa loading2
  document.body.addEventListener("click", function (event) {
    if (event.target.id === "btn_logout") { 
        // Disable the button and show loading spinner
        document.querySelector("#btn_logout").disabled = true;
        document.querySelector("#btn_logout").innerHTML = `<div class="spinner-border spinner-border-sm me-2" role="status"></div><span>Loading...</span>`;
        
       
        doLogout().then(() => {
            // Re-enable ang button then change sa text
            document.querySelector("#btn_logout").disabled = false;
            document.querySelector("#btn_logout").innerHTML = "Log-in";
        }).catch((error) => {
           
            console.error("Logout failed:", error);
            // in case of error
            document.querySelector("#btn_logout").disabled = false;
          
            document.querySelector("#btn_logout").innerHTML = "Log-in";
        });
    }
});

 


 
