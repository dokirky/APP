import '../scss/styles.scss'

import * as bootstrap from 'bootstrap'

import { createClient } from '@supabase/supabase-js'

import { setRouter } from '../router/router';


setRouter();


const supabase = createClient('https://xhfezetmnqhvulnqwles.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZmV6ZXRtbnFodnVsbnF3bGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxNjA1ODUsImV4cCI6MjAyODczNjU4NX0.bouFbolGc2M4q2v0FCoEzeVAzcUKrbImuLB92wDyQMs');


async function doLogout() {
    // Supabase Logout
    let { error } = await supabase.auth.signOut();

    if (error == null) {
      alert("Logout Successfully!");
  
      // Clear local Storage
      localStorage.clear();
  
      // Redirect to login page
      window.location.pathname = "/index.html";
    } else {
      alert("Logout Failed!");
    }
  }

  export {supabase,doLogout};
 