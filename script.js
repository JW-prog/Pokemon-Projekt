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
    params.set('offset', (parseInt(params.get('offset')) || 0) + 6);
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
    const searchInput = document.getElementById("search-input").value.trim().toLowerCase();
    const filtered = pokemonList.filter(p => 
        p.name.toLowerCase().includes(searchInput) || String(p.id).includes(searchInput)
    );
    const content = document.getElementById("content");
    content.innerHTML = filtered.length ? 
        filtered.map(pokemon => getPokemonHTML(pokemon)).join('') : 
        "<p>Leider kein Pokémon gefunden. Bitte versuchen Sie es mit einem anderen Namen.</p>";
    const loadMoreBtn = document.getElementById("load-more-btn");
    loadMoreBtn.style.display = filtered.length === 0 ? "none" : ""; 
    currentPokemonIndex = filtered.length > 0 ? pokemonList.findIndex(p => p.name.toLowerCase() === filtered[0].name.toLowerCase()) : 0;
}

function reloadPage() {
    window.location.reload(); 
}