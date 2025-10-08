let BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"; 
let currentPokemonIndex = 0; 
let pokemonList = []; 

function init() {
    document.getElementById("loading-spinner").style.display = "flex"; 
    renderfetchPokemonAllData().finally(() => {
        document.getElementById("loading-spinner").style.display = "none"; 
    });
}

async function renderfetchPokemonAllData() {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    const newPokemons = await Promise.all(data.results.map(p => fetchPokemonDetails(p.url)));
    pokemonList.push(...newPokemons);
    const contentRef = document.getElementById("content");
    newPokemons.forEach((pokemon, index) => {
        setTimeout(() => contentRef.innerHTML += getPokemonHTML(pokemon), index * 200);
    });
}

async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    return await response.json();
}

async function loadingMorePokemon(button) {
    if (button) button.disabled = true;
    document.getElementById("loading-spinner").style.display = "flex";
    let params = new URLSearchParams(BASE_URL.split('?')[1]);
    let currentOffset = parseInt(params.get('offset')) || 0;
    currentOffset += 20;
    params.set('offset', currentOffset);
    BASE_URL = `https://pokeapi.co/api/v2/pokemon?${params.toString()}`;
    const response = await fetch(BASE_URL);
    const data = await response.json();
    const newPokemons = await Promise.all(data.results.map(p => fetchPokemonDetails(p.url)));
    pokemonList.push(...newPokemons);
    const contentRef = document.getElementById("content");
    newPokemons.forEach((pokemon, index) => {
    setTimeout(() => contentRef.innerHTML += getPokemonHTML(pokemon), index * 200);
    });
    document.getElementById("loading-spinner").style.display = "none";
    if (button) button.disabled = false;
}

function showOverlayDetails(pokemon) {
    currentPokemonIndex = pokemonList.findIndex(p => p.id === pokemon.id); 
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    overlay.innerHTML = getPokemonOverlayHTML(pokemon);
}

function closeOverlay() {
    document.getElementById("overlay").style.display = "none";
}

function Vorwärts() {
    if (currentPokemonIndex < pokemonList.length - 1) {
        currentPokemonIndex++; 
        showOverlayDetails(pokemonList[currentPokemonIndex]); 
    }
}

function Rückwärts() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--; 
        showOverlayDetails(pokemonList[currentPokemonIndex]); 
    }
}

function findPokemon() {
    const input = document.getElementById("search-input").value.trim().toLowerCase();
    const content = document.getElementById("content");
    const loadMoreBtn = document.getElementById("load-more-btn");
    document.getElementById("back-to-home-btn")?.remove();
    if (!input) {
        content.innerHTML = pokemonList.map(getPokemonHTML).join('');
        loadMoreBtn.style.display = "block";
        currentPokemonIndex = 0;
        return;
    }
    const filtered = pokemonList.filter(p =>
        p.name.toLowerCase().includes(input) || String(p.id).includes(input)
    );
    content.innerHTML = filtered.length ?
        filtered.map(getPokemonHTML).join('') :
        "<p>Leider kein Pokémon gefunden. Bitte versuchen Sie es mit einem anderen Namen.</p>";
    loadMoreBtn.style.display = "none";
    currentPokemonIndex = filtered.length ? pokemonList.findIndex(p => p.name.toLowerCase() === filtered[0].name.toLowerCase()) : 0;
    if (input) {
        const backBtn = Object.assign(document.createElement("button"), {
            id: "back-to-home-btn",
            className: "btn",
            innerText: "Zurück zur Startseite",
            onclick: () => {
                document.getElementById("search-input").value = "";
                content.innerHTML = pokemonList.slice(0, 20).map(getPokemonHTML).join('');
                loadMoreBtn.style.display = "block";
                backBtn.remove();
                currentPokemonIndex = 0;
            }
        });
        loadMoreBtn.after(backBtn);
    }
}

function reloadPage() {
    window.location.reload(); 
}