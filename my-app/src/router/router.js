function setRouter() {
  const path = window.location.pathname;
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const userRole = localStorage.getItem("Role");

  switch (path) {
  
    case "/":
    case "/index.html":
    case "/signup.html":
      if (isLoggedIn) {
        window.location.pathname = "/home.html";
      }
      break;

    
    case "/about.html":
    case "/editprofile.html":
    case "/otherprofile.html":
    case "/post.html":
    case "/profile.html":
    case "/home.html":
    
      if (!isLoggedIn/*  || (userRole !== "user" && userRole !== "Admin") */) {
        window.location.pathname = "/index.html"; // redirect to home page if not logged in or not an owner/admin
      }
      break;

   /*  case "/dashboard.html":
      // Add more cases if there are more pages
      if (!isLoggedIn) {
        window.location.pathname = "/index.html"; // default page when logged out
      } else if (userRole !== "Owner" && userRole !== "Admin") {
        // Redirect to home page if the user is not an owner or admin
        window.location.pathname = "/home.html";
      }
      break; */

    default:
      break;
  }
}

export { setRouter };
