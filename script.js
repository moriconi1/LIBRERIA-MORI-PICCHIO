
document.addEventListener("DOMContentLoaded", function () {
  fetchShoes();
});

async function fetchShoes() {
  try {
    const response = await fetch("http://localhost:3000/api/shoes");
    const shoes = await response.json();
    displayShoes(shoes);
  } catch (error) {
    console.error("Errore nel recuperare i dati:", error);
  }
}

function displayShoes(shoes) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  // Creare le card e aggiungerle al container
  shoes.forEach((shoe) => {
    const cardHTML = `
            <div class="col-md-4">
                <div class="card mb-4">
                    <img src="${
                      shoe.image || "path/to/default-image.jpg"
                    }" class="card-img-top" alt="Immagine della scarpa">
                    <div class="card-body">
                        <h5 class="card-title">${shoe.model}</h5>
                        <p class="card-text">${
                          shoe.description || "Nessuna descrizione disponibile"
                        }</p>
                        <p class="card-text"><strong>${shoe.price}</strong></p>
                        <a href="${
                          shoe.link
                        }" class="btn btn-primary">Maggiori dettagli</a>
                    </div>
                </div>
            </div>
        `;
    container.innerHTML += cardHTML;
  });
}
