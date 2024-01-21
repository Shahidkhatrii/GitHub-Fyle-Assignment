const GITHUB_API_URL = "https://api.github.com/";
let currentPage = 1;
document.addEventListener("DOMContentLoaded", function () {
  // Extract username from the URL
  const username = getUsernameFromURL();

  // Check if a username is present
  if (username) {
    fetchUserProfile(username);
  }
});

const getUsernameFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("username");
};

const fetchUserProfile = async (username) => {
  const userProfile = JSON.parse(window.localStorage.getItem("userData") || "");
  fetchAndDisplayRepositories(currentPage, username);
  // Display the user profile information
  displayUserProfile(userProfile);
};

const displayUserProfile = (userProfile) => {
  const profileHeader = document.querySelector(".profile-header");

  const profileHeaderContent = `<div class="profile-header-img">
              <img src="${userProfile.avatar_url}" alt="profile_img">
              <p class="HTML_link"><i class="fa-solid fa-link"></i> <a href="${
                userProfile.html_url
              }">${userProfile.html_url}</a></p>
            </div>
            <div class="profile-header-content">
              ${
                userProfile.name
                  ? `<h5 class="card-title">  ${userProfile.name}</h5>`
                  : ""
              }
              ${
                userProfile.bio
                  ? `<p class="card-text"> ${userProfile.bio} </p>`
                  : ""
              }
              ${
                userProfile.location
                  ? `<p class="card-text"><i class="fa-solid fa-location-dot"></i> ${userProfile.location} </p>`
                  : ""
              }
              ${
                userProfile.twitter_username
                  ? `<p class="card-text">Twitter: <a href="https://twitter.com/${userProfile.twitter_username}">https://twitter.com/${userProfile.twitter_username}</a></p>`
                  : ""
              }
              <div class="hstack gap-2 follow-stack">
                  <div class="p-1 text-bg-secondary">followers: ${
                    userProfile.followers ? userProfile.followers : "0"
                  }</div>
                  <div class="p-1 text-bg-secondary">following: ${
                    userProfile.following ? userProfile.following : "0"
                  }</div>
              </div>
            </div>`;
  profileHeader.innerHTML = profileHeaderContent;
};

const handlePageChange = (page) => {
  if (page > 0) {
    currentPage = page;
    fetchAndDisplayRepositories(currentPage, getUsernameFromURL());
  }
};

const fetchAndDisplayRepositories = async (page, username) => {
  const RepoList = document.querySelector(".Repo-list");
  RepoList.innerHTML = `<div class="loader-container"><div class="spinner-grow" role="status">
  <span class="visually-hidden">Loading...</span>
</div></div>`;
  const perPage = 10;
  const apiUrl = `${GITHUB_API_URL}users/${username}/repos?type=public&page=${page}&per_page=${perPage}&sort=`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (currentPage === 1 && data.length === 0) {
      RepoList.innerHTML = `User doesn't have any repository yet!.`;
      throw new Error("User doesn't have any repositories yet!");
    }

    clearRepositories();
    RepoList.innerHTML = "";
    displayRepositories(data);
    updatePaginationButtons(data.length, perPage);
  } catch (error) {
    console.error("Error fetching repositories:", error);
  }
};
const updatePaginationButtons = (noPageCur, perPage) => {
  const paginationElement = document.querySelector(".pagination");
  // Clear existing pagination buttons
  paginationElement.innerHTML = "";

  if (currentPage > 1) {
    const prevPageBtn = createPageButton("Previous", currentPage - 1);
    paginationElement.appendChild(prevPageBtn);
  }
  if (noPageCur > 0) {
    for (
      let i = 1;
      i <= (noPageCur >= perPage ? currentPage + 1 : currentPage);
      i++
    ) {
      const currentPageBtn = createPageButton(i, i);
      paginationElement.appendChild(currentPageBtn);
    }
  }

  if (noPageCur >= perPage) {
    const nextPageBtn = createPageButton("Next", currentPage + 1);
    paginationElement.appendChild(nextPageBtn);
  }
};

const createPageButton = (label, page) => {
  const pageBtn = document.createElement("li");
  pageBtn.classList.add("page-item");
  pageBtn.innerHTML = `<a class="page-link" href="#">${label}</a>`;
  pageBtn.addEventListener("click", () => handlePageChange(page));
  return pageBtn;
};

const clearRepositories = () => {
  const RepoList = document.querySelector(".Repo-list");
  RepoList.innerHTML = ""; // Remove all child elements
};

const displayRepositories = (data) => {
  const RepoList = document.querySelector(".Repo-list");

  data.map((repo) => {
    const topicLength = repo.topics.length;
    const card = document.createElement("a");
    card.classList.add("card");
    card.classList.add("Repo-card");
    card.href = repo.html_url;
    card.target = "_blank";
    card.innerHTML = `<div class="Repo-card-body">
    <h5 class="card-title">${repo?.name}</h5>
    ${repo.description ? `<p class="card-text">${repo.description}</p>` : ""}
    <div class="hstack gap-2">
  ${
    repo.forks != null
      ? `<div class="p-1 text-bg-secondary">Fork: ${repo.forks}</div>`
      : ""
  }
  ${
    repo.stargazers_count != null
      ? `<div class="p-1 text-bg-secondary">Star: ${repo.stargazers_count}</div>`
      : ""
  }
</div>
<div class="hstack gap-2">
  ${repo.topics
    .map((topic, index) => {
      if (index === 3 && topicLength - index - 1 > 0) {
        return `<div class="p-1 text-bg-primary">${topic} ${
          topicLength - index - 1
        }+</div>`;
      } else if (index <= 3) {
        return `<div class="p-1 text-bg-primary">${topic}</div>`;
      }
    })
    .join(" ")}
</div>
  </div>`;
    RepoList.appendChild(card);
  });
};
