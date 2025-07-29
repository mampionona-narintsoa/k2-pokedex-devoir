import { useState, useEffect } from "react"; 

export default function Pokedex() { 
    const [pokemonUrl ,setPokemonUrl] = useState([]) 
    const [pokemon ,setPokemon] = useState([]) 
    const [originalPokemon, setOriginalPokemon] = useState([]);
    const [modal, setModal] = useState(false); 
    const [card, setCard] = useState(0); 
    const [searchTerm, setSearchTerm] = useState('');

    const typeColorClasses = { 
        normal: 'bg-[#A8A878]', 
        fire: 'bg-[#F08030]', 
        water: 'bg-[#6890F0]', 
        electric: 'bg-[#F8D030]', 
        grass: 'bg-[#78C850]', 
        ice: 'bg-[#98D8D8]', 
        fighting: 'bg-[#C03028]', 
        poison: 'bg-[#A040A0]', 
        ground: 'bg-[#E0C068]', 
        flying: 'bg-[#A890F0]', 
        psychic: 'bg-[#F85888]', 
        bug: 'bg-[#A8B820]', 
        rock: 'bg-[#B8A038]', 
        ghost: 'bg-[#705898]', 
        dragon: 'bg-[#7038F8]', 
        dark: 'bg-[#705848]', 
        steel: 'bg-[#B8B8D0]', 
        fairy: 'bg-[#EE99AC]' 
    }; 

    const getTypeColorForBadge = (type) => {
        const colors = {
            normal: 'bg-gray-600', fire: 'bg-red-600', water: 'bg-blue-600', grass: 'bg-green-600',
            electric: 'bg-yellow-600', ice: 'bg-blue-300', fighting: 'bg-red-800', poison: 'bg-purple-600',
            ground: 'bg-yellow-800', flying: 'bg-indigo-500', psychic: 'bg-pink-600', bug: 'bg-green-800',
            rock: 'bg-gray-700', ghost: 'bg-indigo-800', dragon: 'bg-purple-800', steel: 'bg-gray-600',
            fairy: 'bg-pink-400', dark: 'bg-gray-900',
        };
        return colors[type] || 'bg-gray-600';
    };


    const toggleModal = (id) => { 
        setModal(!modal); 
        setCard(id); 
    }; 

    const toSearch = () => { 
        const results = originalPokemon.filter(p => 
            p.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            String(p.id).includes(searchTerm)
        ); 
        setPokemon(results); 
    } 

    const getAll = async () => { 
        try {
            const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=500&offset=0'); 
            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }
            const data = await res.json(); 
            setPokemonUrl(data.results); 
            const urls = data.results.map(p => p.url); 
            const detailedPokemonPromises = urls.map(url => 
                fetch(url) 
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error loading details: ${res.status}`);
                    }
                    return res.json();
                })
            ); 
            const detailedData = await Promise.all(detailedPokemonPromises); 
            
            console.log(detailedData); 
            setPokemon(detailedData); 
            setOriginalPokemon(detailedData);
        } catch (error) {
            console.error("The site is not working or an error occurred while fetching data:", error);
        }
    } 

    const handleResetSearch = () => {
        setSearchTerm('');
        setPokemon(originalPokemon);
    };

    useEffect(() => { 
        getAll(); 
    }, []); 

    const formatName = (name) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
    };

    return ( 
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 font-inter text-gray-800 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between mb-8 p-4 bg-blue-800 rounded-full shadow-xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-shadow-lg text-center sm:text-left mb-4 sm:mb-0">
                    Pokedex
                </h1>
                <div className="flex w-full sm:w-1/2 lg:w-1/3 space-x-2">
                    <input
                        type="text"
                        placeholder="Search a Pokémon by name or ID..."
                        className="flex-grow p-3 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 text-gray-700 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={toSearch}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Search
                    </button>
                    {searchTerm && (
                        <button
                            onClick={handleResetSearch}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-20 w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
                {pokemon.length === 0 && searchTerm !== '' ? (
                    <p className="col-span-full text-center text-xl text-gray-600">No Pokémon found for your search.</p>
                ) : (
                    pokemon.map((pokemonList, id) => ( 
                        <div key={id} className={`rounded-2xl shadow-md p-4 flex flex-col items-center border border-gray-200 ${typeColorClasses[pokemonList?.types[0]?.type.name] || 'bg-gray-200'}`}> 
                            <img 
                                src={pokemonList?.sprites?.front_default || `https://placehold.co/96x96/e2e8f0/64748b?text=${formatName(pokemonList.name).substring(0,2)}`} 
                                alt={pokemonList?.name} 
                                className="w-24 h-24 object-contain mb-2"
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/96x96/e2e8f0/64748b?text=${formatName(pokemonList.name).substring(0,2)}`; }}
                            /> 
                            <p className="text-lg font-semibold text-gray-900 text-center">{formatName(pokemonList?.name)}</p> 
                            <p className="text-sm text-gray-600 mb-2 text-center">Types: {pokemonList?.types.map(type => formatName(type.type.name)).join(', ')}</p> 
                            <button onClick={() => toggleModal(id)} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-full shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300">More info</button>  
                        </div> 
                    ))
                )}
            </div>   

            {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    {pokemon[card] ? (
                        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center relative">
                            <button
                                onClick={() => toggleModal(0)}
                                className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                &larr; Close
                            </button>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 text-center">
                                {formatName(pokemon[card]?.name)} <span className="text-gray-600 text-2xl">#{String(pokemon[card]?.id).padStart(3, '0')}</span>
                            </h2>
                            <img
                                src={pokemon[card]?.sprites?.other?.['official-artwork']?.front_default || pokemon[card]?.sprites?.front_default || `https://placehold.co/200x200/e2e8f0/64748b?text=${formatName(pokemon[card]?.name).substring(0,2)}`}
                                alt={pokemon[card]?.name}
                                className="w-48 h-48 sm:w-64 sm:h-64 object-contain mb-6 bg-gray-100 rounded-full p-2 shadow-inner"
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x200/e2e8f0/64748b?text=${formatName(pokemon[card]?.name).substring(0,2)}`; }}
                            />

                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {pokemon[card]?.types.map((typeInfo) => (
                                    <span
                                        key={typeInfo.type.name}
                                        className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${getTypeColorForBadge(typeInfo.type.name)} shadow-md`}
                                    >
                                        {formatName(typeInfo.type.name)}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
                                <div className="bg-blue-50 p-4 rounded-xl shadow-inner">
                                    <h3 className="text-xl font-bold text-blue-800 mb-2">Stats</h3>
                                    {pokemon[card]?.stats.map((statInfo) => (
                                        <div key={statInfo.stat.name} className="flex justify-between items-center mb-1">
                                            <span className="text-gray-700">{formatName(statInfo.stat.name.replace('-', ' '))} :</span>
                                            <span className="font-semibold text-gray-900">{statInfo.base_stat}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-xl shadow-inner">
                                    <h3 className="text-xl font-bold text-indigo-800 mb-2">Abilities</h3>
                                    <ul className="list-disc list-inside text-gray-700">
                                        {pokemon[card]?.abilities.map((abilityInfo) => (
                                            <li key={abilityInfo.ability.name}>{formatName(abilityInfo.ability.name.replace('-', ' '))}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-cyan-50 p-4 rounded-xl shadow-inner col-span-1 sm:col-span-2">
                                    <h3 className="text-xl font-bold text-cyan-800 mb-2">General Information</h3>
                                    <div className="grid grid-cols-2 gap-2 text-gray-700">
                                        <span>Height :</span> <span className="font-semibold">{pokemon[card]?.height / 10} m</span>
                                        <span>Weight :</span> <span className="font-semibold">{pokemon[card]?.weight / 10} kg</span>
                                        <span>Types :</span> <span className="font-semibold">{formatName(pokemon[card]?.species.name)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-white text-xl">Loading Pokémon details...</p>
                    )}
                </div>
            )}
        </div> 
    ) 
}
