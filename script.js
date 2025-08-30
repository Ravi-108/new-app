const API_KEY = "0b81afc2bf76495192cff2185e14891a";
const API_URL = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

async function fetchNews(query) {
    try {
        const response = await fetch(`${API_URL}${query}&apiKey=${API_KEY}`);
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function displayNews(articles) {
    const template = document.getElementById("template-news-card");
    const newsContainer = document.getElementById("news-container");

    newsContainer.innerHTML = ""; // clear previous results

    articles.forEach(article => {
        if (!article.urlToImage) return; // skip if no image
        const clone = template.content.cloneNode(true);

        clone.querySelector("img").src = article.urlToImage;
        clone.querySelector("img").alt = article.title;
        clone.querySelector("h2").textContent = article.title;
        clone.querySelector("p").textContent = article.description || "No description available";

        newsContainer.appendChild(clone);
    });
}
