document.addEventListener("DOMContentLoaded", function () {
    const listaPokemon = document.querySelector("#listaPokemon");
    const botonesHeader = document.querySelectorAll(".btn-header");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const suggestionsList = document.getElementById("suggestionsList");
    const URL = "https://pokeapi.co/api/v2/pokemon/";

    // Event listener for the search button
    searchBtn.addEventListener("click", function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm !== "") {
            listaPokemon.innerHTML = "";
            suggestionsList.innerHTML = "";
            searchPokemonByName(searchTerm);
        }
    });

    // Event listeners for the type buttons in the header
    botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
        const tipoSelecionado = event.currentTarget.id.toLowerCase();
        searchInput.value = "";
        carregarPokemonsPorTipo(tipoSelecionado);
    }));

    // Event listener for the search input
    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        suggestionsList.innerHTML = "";

        if (searchTerm !== "") {
            fetch(`${URL}?limit=1015`) 
                .then((response) => response.json())
                .then(data => {
                    const matchingPokemons = data.results.filter(pokemon => pokemon.name.startsWith(searchTerm));
                    matchingPokemons.forEach(pokemon => {
                        const suggestionItem = document.createElement("li");
                        suggestionItem.textContent = pokemon.name;
                        suggestionItem.addEventListener("click", function () {
                            searchInput.value = pokemon.name;
                            suggestionsList.innerHTML = "";
                            listaPokemon.innerHTML = "";
                            searchPokemonByName(pokemon.name);
                        });
                        suggestionsList.appendChild(suggestionItem);
                    });
                })
                .catch(error => {
                    console.error("Error fetching Pokémon list:", error);
                    alert("Failed to fetch Pokémon data. Please try again.");
                });
        }
    });

    suggestionsList.style.maxHeight = "150px";
    suggestionsList.style.overflowY = "auto";

    // Event listener for enter key in search input
    searchInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm !== "") {
                listaPokemon.innerHTML = "";
                searchPokemonByName(searchTerm);
            }
        }
    });

    // Function to search Pokémon by name
    function searchPokemonByName(name) {
        suggestionsList.innerHTML = "";

        fetch(`${URL}?limit=1015`)
            .then((response) => response.json())
            .then(data => {
                const matchingPokemons = data.results.filter(pokemon => pokemon.name.startsWith(name));

                if (matchingPokemons.length > 0) {
                    listaPokemon.innerHTML = "";

                    matchingPokemons.forEach(pokemon => {
                        fetch(pokemon.url)
                            .then((response) => response.json())
                            .then(data => {
                                mostrarPokemon(data);
                            })
                            .catch(error => {
                                console.error("Error fetching Pokémon data:", error);
                                alert("Pokémon not found. Please try again.");
                            });
                    });
                } else {
                    listaPokemon.innerHTML = "<h3>No Pokémon with that name have been caught</h3>";
                }
            })
            .catch(error => {
                console.error("Error fetching Pokémon list:", error);
                alert("Failed to fetch Pokémon data. Please try again.");
            })
            .finally(() => {
                document.getElementById('searchInput').value = "";
            });
    }

    // Function to display Pokémon cards
    function mostrarPokemon(poke) {
        let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
        tipos = tipos.join('');

        let pokeId = poke.id.toString().padStart(3, '0');

        const div = document.createElement("div");
        div.classList.add("pokemon");
        div.innerHTML = `
        <div class="card">
            <div class="holo-effect"> </div> 
                <p class="pokemon-id-back">#${pokeId}</p>
                <div class="pokemon-imagem">
                    <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
                </div>
                
                <div class="pokemon-info">
                    <div class="nombre-contenedor">
                        <p class="pokemon-id">#${pokeId}</p>
                        <h2 class="pokemon-nombre">${poke.name}</h2>
                    </div>

                    <div class="pokemon-tipos">
                        ${tipos}
                    </div>

                    <div class="pokemon-stats">
                        <p class="stat">${poke.height}m</p>
                        <p class="stat">${poke.weight}kg</p>
                    </div>
                </div> 
        </div>
        `;
        listaPokemon.appendChild(div);
    }

    // Function to load Pokémon by type
    function carregarPokemonsPorTipo(tipo) {
        listaPokemon.innerHTML = "";

        for (let i = 1; i <= 1015; i++) {
            fetch(URL + i)
                .then((response) => response.json())
                .then(data => {
                    const tipos = data.types.map(type => type.type.name);

                    if (tipo === "ver-todos" || tipos.includes(tipo.toLowerCase())) {
                        mostrarPokemon(data);
                    }
                });
        }
    }

    // Re-add event listeners for type buttons in the header
    botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
        const tipoSelecionado = event.currentTarget.id.toLowerCase();
        carregarPokemonsPorTipo(tipoSelecionado);
    }));

    // Loads Pokémon of all types at the start
    carregarPokemonsPorTipo("ver-todos");
});

/************************************************
**************** List Scroll  *****************
************************************************/

const list = document.querySelector('.poke-list');
let isDown = false;
let StartX, scrollLeft;

list.addEventListener('mousedown', (e) => {
    isDown = true;
    StartX = e.pageX - list.offsetLeft;
    scrollLeft = list.scrollLeft;
});

list.addEventListener('mouseleave', () => {
    isDown = false;
});

list.addEventListener('mouseup', () => {
    isDown = false;
});

list.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - list.offsetLeft;
    const walk = x - StartX;
    list.scrollLeft = scrollLeft - walk;
});

const scrollLeftButton = document.querySelector('.scrollBtnList.left');
const scrollRightButton = document.querySelector('.scrollBtnList.right');
let scrollAmount = 500;

scrollLeftButton.addEventListener('click', () => {
    list.scrollTo({
        left: list.scrollLeft - scrollAmount,
        behavior: 'smooth'
    });
});

scrollRightButton.addEventListener('click', () => {
    list.scrollTo({
        left: list.scrollLeft + scrollAmount,
        behavior: 'smooth'
    });
});

/************************************************
**************** Back to Top ********************
************************************************/

document.getElementById("backToTopBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Adicione um evento de escuta para verificar o ponto de rolagem e mostrar/ocultar o botão
window.addEventListener("scroll", () => {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
});
