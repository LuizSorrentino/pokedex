
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    
    pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)
    pokemon.experience = pokeDetail.base_experience
    pokemon.hp = pokeDetail.stats.find(stat => stat.stat.name === 'hp').base_stat

    return pokemon
}
pokeApi.getPokemonDetailById = (pokemonId) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const pokemon = new Pokemon();
            pokemon.number = data.id;
            pokemon.name = data.name;
            pokemon.types = data.types.map(type => type.type.name);
            pokemon.photo = data.sprites.other.dream_world.front_default;
            pokemon.moves = data.abilities.map(ability => ability.ability.name);
            pokemon.experience = data.base_experience;
            pokemon.hp = data.stats[0].base_stat;
            return pokemon;
        });
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 9) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}