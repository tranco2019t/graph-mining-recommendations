const output = document.getElementById("output");
const endpointInput = document.getElementById("endpoint");
const movieInput = document.getElementById("movie");
const btnMovies = document.getElementById("btn-movies");
const btnSimilar = document.getElementById("btn-similar");

async function runQuery(query, variables = {}) {
  const endpoint = endpointInput.value.trim();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  output.textContent = JSON.stringify(data, null, 2);
}

btnMovies.addEventListener("click", async () => {
  const query = `
    {
      movies(options: { limit: 5 }) {
        title
        year
        imdbRating
      }
    }
  `;
  try {
    output.textContent = "Loading movies...";
    await runQuery(query);
  } catch (err) {
    output.textContent = `Error: ${err.message}`;
  }
});

btnSimilar.addEventListener("click", async () => {
  const query = `
    query SimilarMovies($title: String) {
      movies(where: { title: $title }) {
        title
        year
        similar(first: 5) {
          title
          year
        }
      }
    }
  `;

  try {
    output.textContent = "Loading similar movies...";
    await runQuery(query, { title: movieInput.value.trim() });
  } catch (err) {
    output.textContent = `Error: ${err.message}`;
  }
});

