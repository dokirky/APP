import { supabase} from "../main";

const form_register = document.getElementById("form_register");


form_register.onsubmit = async (e) => {
    e.preventDefault();
 

    document.querySelector("#form_register button").disabled = true;
    document.querySelector(
        "#form_register button"
    ).innerHTML = `<div class="spinner-border me-2" role="status">
                      </div>
                      <span>Loading...</span>`;

    const formData = new FormData(form_register);
    const password = formData.get("password");
   


   

        //supabase log-in
        const { data, error } = await supabase.auth.signUp({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        let user_id = data?.user?.id;


        if (user_id != null) {

            //getting the info
            const { data, error } = await supabase
                .from('user_infos')
                .insert([
                    {
                        first_name: formData.get("first_name"),
                        last_name: formData.get("last_name"),
                        birthdate: formData.get("birthdate"),
                        password: formData.get("password"),
                        user_id:user_id
                    }
                ])
                .select()



            //if succes registration condition
            if (error == null) {
                alert("Register Successfully ");
                window.location.pathname = '/index.html';
                console.log(data);
                console.log(error);
            }
            else {
                 alert(`Error: ${error.message}`, 10);
            }
            form_register.reset();
            //button loading after succes registration
            document.querySelector("#form_register button").disabled = false;
        document.querySelector("#form_register button").innerHTML = "Register";
            
        }
        else{
            alert(`Error: ${error.message}`, 10);
            document.querySelector("#form_register button").disabled = false;
        document.querySelector("#form_register button").innerHTML = "Register";
        }
    
    

};