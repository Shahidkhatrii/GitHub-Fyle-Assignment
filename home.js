const GITHUB_API_URL = "https://api.github.com/";
const cardContainer = document.querySelector("#card-container");
const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#button-addon2");
cardContainer.innerHTML = `<div><h1>Welcome to GitHub Search</h1>
<p>Explore GitHub users and repositories with ease. Use the search bar above to find your favorite developers, discover interesting projects, or explore trending repositories.</p>

<p>Simply enter a GitHub username and start exploring the vibrant GitHub community.</p></div>
                          `;
const getUser = async (username) => {
  try {
    const response = await fetch(GITHUB_API_URL + "users/" + username);
    if (response.status === 404) {
      cardContainer.innerHTML = `No results found. Try searching for user by their GitHub usernames.`;
      throw new Error("User not found");
    }
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    window.localStorage.setItem("userData", JSON.stringify(data) || "");
    const card = `<div class="card w-100">
                    <div class="card-body">
                        <div class="profile-img-container">
                        <img src="${data.avatar_url}" 
                          class="profile-img" alt="profile"></div>
                        <div class="card_header">
                            <h5 class="card-title">${
                              data.name ? data.name : ""
                            }</h5>
                            <p class="card-text">${data.bio ? data.bio : ""}</p>
                            <div class="hstack gap-2">
                                <div class="p-1 text-bg-secondary">Followers: ${
                                  data?.followers
                                }</div>
                                <div class="p-1 text-bg-secondary">Following: ${
                                  data?.following
                                }</div>
                            </div>
                            <a href="#" class="RepoBtn btn btn-primary" id="RepositoriesBtn" ><i class="fa-solid fa-book-bookmark"></i> Repositories</a>
                        </div>
                    </div>
                  </div>`;
    cardContainer.innerHTML = card;
    handleRepoBtn(username);
  } catch (error) {
    console.log(error.message);
  }
};
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("clicked", searchInput.value);
  if (!searchInput.value) {
    return;
  }
  cardContainer.innerHTML = `<div class="spinner-grow" role="status">
                                <span class="visually-hidden">Loading...</span>
                             </div>`;
  getUser(searchInput.value);
  searchInput.value = "";
});

const handleRepoBtn = (username) => {
  const repoBtn = document.querySelector("#RepositoriesBtn");
  repoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(username);

    if (username) {
      // Redirect to the profile page with the provided username
      window.location.href = `profile/profile.html?username=${username}`;
    }
  });
};
