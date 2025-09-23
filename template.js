
function getPokemonHTML(pokemon) {
  return `<div class="pokemon-card" onclick='showOverlayDetails(${JSON.stringify(pokemon)})'>
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
      <div class="stat-bar-row">
        <span class="stat-label">${label}:</span>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill" style="width:${percent}%;"></div>
        </div>
        <span class="stat-value">${value}</span>
      </div>
    `;
  }

  return `
    <div class="overlay-content ${typeClass}">
      <h2>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2>
      <img class= "figure" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div><b>Abilities:</b> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</div>
      <div><b>Typen:</b> ${pokemon.types.map(t => t.type.name).join(', ')}</div>
      <div><b>Base Exp:</b> ${pokemon.base_experience}</div>
      ${['hp' ,'attack' ,'defense' ,'speed'].map(n => statBar(n.toUpperCase(), stat(n))).join('')}
      <div>
      <button onclick="Rückwärts()" ${currentPokemonIndex===0?'disabled':''}>&lsaquo;</button>
      <button onclick="closeOverlay()">Close</button>
      <button onclick="Vorwärts()" ${currentPokemonIndex===pokemonList.length-1?'disabled':''}>&rsaquo;</button>
      </div>
    </div>
    `;

    function statBar(label, value, max = 200) {
    const percent = Math.min(100, Math.round((value / max) * 100));
    return `
      <div style="margin-bottom:4px;">
      <span class="bar-font">${label}:</span>
      <div class="a">
        <div class="b">
        <div class="c" style="width:${percent}%;></div>
        <div style="width:${100 - percent}%;height:100%;float:left;"></div>
        </div>
      </div>
      <span>${percent}%</span>
      </div>
    `;
    }
}
