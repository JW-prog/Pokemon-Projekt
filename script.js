 
let BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=24&offset=0";
let currentPokemonIndex = 0; 
let pokemonList = []; 

function init() {
  document.getElementById("loading-spinner").style.display = "flex"; 
  renderfetchPokemonAllData().then(() => {
  document.getElementById("loading-spinner").style.display = "none"; 
  });
}

async function renderfetchPokemonAllData() {
  let response = await fetch(BASE_URL);
  response = await response.json();
  pokemonList = []; 
  let contentRef = document.getElementById("content");
  for (let i = 0; i < response.results.length; i++) {
    const pokemon = response.results[i];
    const details = await fetchPokemonDetails(pokemon.url);
    contentRef.innerHTML += getPokemonHTML(details);
    pokemonList.push(details); 
  }
}

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  return await response.json();
}

async function loadingMorePokemon(button) {
  if (button) button.disabled = true;
  document.getElementById("loading-spinner").style.display = "flex";
  let url = new URL(BASE_URL);
  let params = new URLSearchParams(url.search);
  let currentOffset = parseInt(params.get('offset')) || 0;
  let limit = 6; // Weniger Pokémon laden
  let newOffset = currentOffset + limit;
  BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${newOffset}`;
  let response = await fetch(BASE_URL);
  response = await response.json();
  let contentRef = document.getElementById("content");
  for (let i = 0; i < response.results.length; i++) {
    const pokemon = response.results[i];
    const details = await fetchPokemonDetails(pokemon.url);
    contentRef.innerHTML += getPokemonHTML(details);
    pokemonList.push(details); 
  }
  document.getElementById("loading-spinner").style.display = "none";
  if (button) button.disabled = false;
}

function showOverlayDetails(pokemon) {
  let overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.innerHTML = getPokemonOverlayHTML(pokemon);
}

function closeOverlay() {
  let overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}

function Vorwärts() {
  if (currentPokemonIndex < pokemonList.length - 1) {
    currentPokemonIndex++;
    let nextPokemon = pokemonList[currentPokemonIndex];
    showOverlayDetails(nextPokemon);
  }
}

function Rückwärts() {
  if (currentPokemonIndex > 0) {
    currentPokemonIndex--;
    let previousPokemon = pokemonList[currentPokemonIndex];
    showOverlayDetails(previousPokemon);
  }
}

function showOverlayDetails(pokemon) {
  const index = pokemonList.findIndex(p => p.id === pokemon.id);
  if (index !== -1) {
    currentPokemonIndex = index;
  }
  let overlays = document.getElementById("overlay");
  overlays.style.display = "block";
  overlays.innerHTML = getPokemonOverlayHTML(pokemon);
}

function findPokemon() {
  const searchInput = document.getElementById("search-input").value.trim().toLowerCase();
  const content = document.getElementById("content");
  let filtered = [];

  for (let i = 0; i < pokemonList.length; i++) {
    const pokemon = pokemonList[i];
    const name = pokemon.name.toLowerCase();
    const id = String(pokemon.id).toLowerCase();
    if (!searchInput || name.includes(searchInput) || id.includes(searchInput)) {
      filtered.push(pokemon);
    }
  }

  if (filtered.length === 0) {
    content.innerHTML = "<p>Kein Pokémon gefunden. Bitte versuchen Sie es mit einem anderen Namen.</p>";
  } else {
    content.innerHTML = filtered.map(getPokemonHTML).join('');
  }

  const loadMoreBtn = document.getElementById("load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = searchInput ? "none" : "";
  }
}

function reloadPage() {
  window.location.reload(); 
}

