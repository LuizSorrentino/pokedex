const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 9
let offset = 0;


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}" onclick="showPokemonDetails(${pokemon.number})">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
    
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
    
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>
        `).join('');
        
        pokemonList.innerHTML += newHtml;
    }).catch((error) => {
        console.error('Erro ao carregar a lista de Pokémons:', error);
    });
}

let currentPokemonId = null;
function showPokemonDetails(pokemonId) {
    const pokemonDetailsContainer = document.getElementById('pokemonDetailsContainer');

    // Verifica se o Pokémon clicado já é o que está sendo exibido
    if (currentPokemonId === pokemonId) {
        // Se for o mesmo, esconde os detalhes
        pokemonDetailsContainer.style.display = 'none';
        currentPokemonId = null; // Reseta o ID atual
    } else {
        // Se for um Pokémon diferente, exibe os detalhes
        pokeApi.getPokemonDetailById(pokemonId).then((pokemon) => {
            // Cria o HTML para exibir os detalhes
            const statsHtml = `
                <div class="pokemon-image">
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
                <div class="info">
                    <h3>${pokemon.name}</h3>
                    <p><strong>Experiência:</strong> ${pokemon.experience}</p>
                    <p><strong>HP:</strong> ${pokemon.hp}</p>
                    <p><strong>Ataques:</strong>
                        <ul>
                            ${pokemon.moves.map((move) => `<li>${move}</li>`).join('')}
                        </ul>
                    </p>
                </div>
            `;
            
            // Exibe os detalhes no contêiner
            pokemonDetailsContainer.innerHTML = statsHtml;
            
            // Torna o contêiner visível
            pokemonDetailsContainer.style.display = 'block';
            
            // Armazena o ID do Pokémon atual
            currentPokemonId = pokemonId;
        }).catch((error) => {
            console.error('Erro ao carregar os detalhes do Pokémon:', error);
        });
    }
}
loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordNextpage = offset + limit
    if (qtdRecordNextpage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    }else{
        loadPokemonItens(offset, limit)
    }
})
        
        