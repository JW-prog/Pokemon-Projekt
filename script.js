 
let BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=24&offset=0";
let currentPokemonIndex = 0; 
let pokemonList = []; 

function init() {
  renderfetchPokemonAllData();
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

function getPokemonHTML(pokemon) {
  return `<div onclick='showOverlayDetails(${JSON.stringify(pokemon)})' class="pokemon-card">
    <div class="main-data">
      <div>${"#" + pokemon.id}</div>
      <div>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
    </div>
    <div class="image-pokemon">
      <div>
        <img class="image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      </div>
    </div>
    <div class="pokemon-data">
      <div class="art">Height: ${pokemon.height * 10} cm</div>
      <div class="poison">Weight: ${pokemon.weight / 10} kg</div>
    </div>
  </div>`;
}

async function loadingMorePokemon(button) {
  // Button während des Ladens deaktivieren
  if (button) button.disabled = true;

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

  if (button) button.disabled = false;
}

function showOverlayDetails(pokemon) {
  let overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.innerHTML = getPokemonOverlayHTML(pokemon);
}

function getPokemonOverlayHTML(pokemon) {
  const typeColors = {
    grass: 'green-background', fire: 'red-background', water: 'blue-background',
    electric: 'yellow-background', psychic: 'purple-background', ice: 'lightblue-background',
    bug: 'brown-background', normal: 'gray-background', poison: 'pink-background',
    flying: 'skyblue-background', ground: 'orange-background', rock: 'darkgray-background',
    ghost: 'darkpurple-background', dragon: 'darkblue-background', steel: 'silver-background'
  };
  const typeClass = pokemon.types.map(t => typeColors[t.type.name] || '').join(' ');
  const stat = n => pokemon.stats.find(s => s.stat.name === n)?.base_stat ?? 0;

  function statBar(label, value, max = 200) {
    const percent = Math.min(100, Math.round((value / max) * 100));
    return `
      <div style="margin-bottom:4px;">
        <span style="display:inline-block;width:60px;">${label}:</span>
        <div style="display:inline-block;vertical-align:middle;width:100px;height:10px;background:#eee;border-radius:4px;overflow:hidden;position:relative;">
          <div style="position:absolute;left:0;top:0;width:100%;height:100%;">
            <div style="width:${percent}%;height:100%;background:#4caf50;float:left;"></div>
            <div style="width:${100 - percent}%;height:100%;float:left;"></div>
          </div>
        </div>
        <span style="margin-left:6px;font-size:12px;">${value}</span>
      </div>
    `;
  }

  return `
    <div class="overlay-content ${typeClass}" style="font-family: 'Segoe UI', Arial, sans-serif; color: #222;">
      <h2 style="color: #333; font-family: 'Segoe UI Semibold', Arial, sans-serif;">
      ${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
      </h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div style="color: #444;"><b>Abilities:</b> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</div>
      <div style="color: #444;"><b>Typen:</b> ${pokemon.types.map(t => t.type.name[0].toUpperCase() + t.type.name.slice(1)).join(', ')}</div>
      <div style="color: #444;"><b>Base Exp:</b> ${pokemon.base_experience}</div>
      <div style="margin-top:10px;">
      ${statBar('HP', stat('hp'))}
      ${statBar('Atk', stat('attack'))}
      ${statBar('Def', stat('defense'))}
      ${statBar('Speed', stat('speed'))}
      </div>
      <div class="button-row" style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
      <button onclick="Rückwärts()" class="btn-overlay small-btn" ${currentPokemonIndex === 0 ? 'disabled' : ''} title="Vorheriges Pokémon" style="font-family: inherit; color: #fff; background: #888;">&lsaquo;</button>
      <button onclick="closeOverlay()" class="btn-overlay small-btn" title="Schließen" style="font-family: inherit; color: #fff; background: #c00;">&#10005;</button>
      <button onclick="Vorwärts()" class="btn-overlay small-btn" ${currentPokemonIndex === pokemonList.length - 1 ? 'disabled' : ''} title="Nächstes Pokémon" style="font-family: inherit; color: #fff; background: #888;">&rsaquo;</button>
      </div>
    </div>
    `;

    function statBar(label, value, max = 200) {
    const percent = Math.min(100, Math.round((value / max) * 100));
    return `
      <div style="margin-bottom:4px;">
      <span style="display:inline-block;width:60px;">${label}:</span>
      <div style="display:inline-block;vertical-align:middle;width:100px;height:10px;background:#eee;border-radius:4px;overflow:hidden;position:relative;">
        <div style="position:absolute;left:0;top:0;width:100%;height:100%;">
        <div style="width:${percent}%;height:100%;background:#4caf50;float:left;"></div>
        <div style="width:${100 - percent}%;height:100%;float:left;"></div>
        </div>
      </div>
      <span style="margin-left:6px;font-size:12px;">${percent}%</span>
      </div>
    `;
    }
}

function closeOverlay() {
  let overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}

function Vorwärts() {
  if (currentPokemonIndex < pokemonList.length - 1) {
    currentPokemonIndex++;
    const nextPokemon = pokemonList[currentPokemonIndex];
    showOverlayDetails(nextPokemon);
  }
}

function Rückwärts() {
  if (currentPokemonIndex > 0) {
    currentPokemonIndex--;
    const previousPokemon = pokemonList[currentPokemonIndex];
    showOverlayDetails(previousPokemon);
  }
}

function showOverlayDetails(pokemon) {
  const index = pokemonList.findIndex(p => p.id === pokemon.id);
  if (index !== -1) {
    currentPokemonIndex = index;
  }
  let overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.innerHTML = getPokemonOverlayHTML(pokemon);
}

function findPokemon() {
  const searchInput = document.getElementById("search-input").value.trim().toLowerCase();
  const content = document.getElementById("content");
  const cards = content.getElementsByClassName("pokemon-card");
  let foundAny = false;
  for (let i = 0; i < cards.length; i++) {
    const name = cards[i].getElementsByClassName("main-data")[0].children[1].textContent.toLowerCase();
    const id = cards[i].getElementsByClassName("main-data")[0].children[0].textContent.toLowerCase();
    if (!searchInput || name.includes(searchInput) || id.includes(searchInput)) {
      cards[i].style.display = "block";
      foundAny = true;
    } else {
      cards[i].style.display = "none";
    }
  }
  const loadMoreBtn = document.getElementById("load-more-btn");
  if (searchInput) {
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
  } else {
    if (loadMoreBtn) loadMoreBtn.style.display = "";
  }
}

