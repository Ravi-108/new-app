const API_KEY = "0b81afc2bf76495192cff2185e14891a";
const API_URL = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

async function fetchNews(query) {
  try {
    const response = await fetch(`${API_URL}${query}&apiKey=${API_KEY}`);
    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "Failed to fetch news");
    }

    displayNews(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    document.getElementById(
      "news-container"
    ).innerHTML = `<p style="color:white;">Search the topic.</p>`;
  }
}

// wrapper for categories (IPL, Politics, etc.)
function searchNews(query) {
  fetchNews(query);

  // remove active class from all nav items
  document.querySelectorAll(".hover-link-nav-items").forEach(item => {
    item.classList.remove("active");
  });

  // add active class to the clicked nav item
  const activeItem = document.getElementById(query.toUpperCase());
  if (activeItem) {
    activeItem.classList.add("active");
  }
}

// handler for search button
function handleSearch() {
  const query = document.querySelector(".news-input").value.trim();
  if (query) {
    fetchNews(query);
  }
}

// allow Enter key to trigger search
document.querySelector(".news-input").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// ✅ Hamburger toggle OUTSIDE displayNews (so it’s not added multiple times)
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const searchBar = document.getElementById("search-bar");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    searchBar.classList.toggle("active");
  });
}

function displayNews(articles) {
  const template = document.getElementById("template-news-card");
  const newsContainer = document.getElementById("news-container");

  newsContainer.innerHTML = ""; // clear previous results

  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  // ✅ Click logo to reload default news
  document.querySelector(".company-logo img").addEventListener("click", (e) => {
    e.preventDefault(); 
    fetchNews("India");
  });

  articles.forEach((article) => {
    if (!article.urlToImage) return; // skip if no image

    const clone = template.content.cloneNode(true);

    const img = clone.querySelector("img");
    const title = clone.querySelector("h2");
    const desc = clone.querySelector("p");
    const newsSource = clone.querySelector(".news-source");

    img.src = article.urlToImage;
    img.alt = article.title;
    title.textContent = article.title;
    desc.textContent = article.description || "No description available";

    const date = new Date(article.publishedAt).toLocaleDateString("en-us", {
      timeZone: "UTC",
    });

    newsSource.innerHTML = `${article.source.name} - ${date}`;

    // make entire card clickable
    clone.firstElementChild.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    newsContainer.appendChild(clone);
  });

  // ✅ Keep nav active item working
  const navItems = document.querySelectorAll(".nav-links ul li");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((link) => link.classList.remove("active"));
      item.classList.add("active");
    });
  });
}
