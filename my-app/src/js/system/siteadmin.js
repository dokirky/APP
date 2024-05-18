import { doLogout, supabase } from "../main";


document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and display posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*');

  if (postsError) {
    console.error(postsError);
  } else {
    const postsContainer = document.getElementById('posts-container');
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post-item mt-2 d-flex';
      postElement.innerHTML = `
        <div class="d-flex col-3 mt-1">
            <p>Post ID:</p><p class="postidnum">${post.id}</p>
        </div>
        <div class="d-flex">
            <div class="">
                <a href="post.html?id=${post.id}">
                    <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                        <div class="material-icons-outlined">
                            edit
                        </div>
                    </button>
                </a>
            </div>
            <div class="delbutton">
                <button class="btn btn-primary delete-post-btn" data-post-id="${post.id}">
                    <div class="material-icons-outlined">
                        delete
                    </div>
                </button>
            </div>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });
  }

  // Fetch and display users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*');

  if (usersError) {
    console.error(usersError);
  } else {
    const usersContainer = document.getElementById('users-container');
    users.forEach(user => {
      const userElement = document.createElement('div');
      userElement.className = 'user-item mt-2 d-flex';
      userElement.innerHTML = `
        <div class="d-flex col-3 mt-1">
            <p>User ID :</p><p class="postidnum">${user.id}</p>
        </div>
        <div class="d-flex">
            <div class="">
                <a href="profile.html?id=${user.id}">
                    <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                        <div class="material-icons-outlined">
                            edit
                        </div>
                    </button>
                </a>
            </div>
            <div class="delbutton">
                <button class="btn btn-primary delete-user-btn" data-user-id="${user.id}">
                    <div class="material-icons-outlined">
                        delete
                    </div>
                </button>
            </div>
        </div>
      `;
      usersContainer.appendChild(userElement);
    });
  }

  // Delete post event listener
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-post-btn')) {
      const postId = event.target.dataset.postId;
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error);
      } else {
        document.querySelector(`#post-${postId}`).remove();
      }
    }
  });

  // Delete user event listener
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-user-btn')) {
      const userId = event.target.dataset.userId;
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
      } else {
        document.querySelector(`#user-${userId}`).remove();
      }
    }
  });

  // Fetch and display totals
  const { data: totalPosts } = await supabase
    .from('posts')
    .select('id', { count: 'exact' });

  const { data: totalUsers } = await supabase
    .from('users')
    .select('id', { count: 'exact' });

  const totalPostsElement = document.getElementById('totalPosts');
  const totalUsersElement = document.getElementById('totalUsers');
  const newUsersElement = document.getElementById('newUsers'); // You will need to implement logic for new users

  totalPostsElement.textContent = totalPosts.length;
  totalUsersElement.textContent = totalUsers.length;
});
