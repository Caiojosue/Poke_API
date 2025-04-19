const typeColors = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-300",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-300",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-600",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-300"
  };

  const pokemonGrid = document.getElementById('pokemon-grid');
  const searchInput = document.getElementById('search-input');
  const errorMessage = document.getElementById('error-message');
  const loadingIndicator = document.getElementById('loading-indicator');
  const noResults = document.getElementById('no-results');
  const themeToggle = document.getElementById('theme-toggle');
  const pokemonModal = document.getElementById('pokemon-modal');
  const closeModal = document.getElementById('close-modal');
  const cardTemplate = document.getElementById('pokemon-card-template');
  const skeletonTemplate = document.getElementById('skeleton-template');

  let allPokemon = [];
  let filteredPokemon = [];
  let offset = 0;
  let loading = false;
  let hasMore = true;
  
  document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    fetchInitialPokemon();
    setupSearchFilter();
    setupInfiniteScroll();
    setupModalClose();
  });

   function setupThemeToggle() {
    const savedTheme = localStorage.getItem('pokedex-dark-mode');
    if (savedTheme === 'true' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDarkMode = document.documentElement.classList.contains('dark');
      localStorage.setItem('pokedex-dark-mode', isDarkMode);
    });
  }

  function setupSearchFilter() {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query === '') {
        filteredPokemon = [...allPokemon];
      } else {
        filteredPokemon = allPokemon.filter(pokemon => 
          pokemon.name.includes(query) || 
          pokemon.id.toString().includes(query)
        );
      }
      
      renderPokemonGrid();
    });
  }

  function setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
      const lastEntry = entries[0];
      if (lastEntry.isIntersecting && hasMore && !loading && searchInput.value === '') {
        loadMorePokemon();
      }
    }, { threshold: 0.1 });
    
    observer.observe(loadingIndicator);
  }

  function setupModalClose() {
    closeModal.addEventListener('click', () => {
      pokemonModal.classList.add('hidden');
    });
    
    pokemonModal.addEventListener('click', (e) => {
      if (e.target === pokemonModal) {
        pokemonModal.classList.add('hidden');
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !pokemonModal.classList.contains('hidden')) {
        pokemonModal.classList.add('hidden');
      }
    });
  }

  function formatPokemonId(id) {
    return `#${id.toString().padStart(3, '0')}`;
  }

  async function fetchInitialPokemon() {
    try {
      showLoadingSkeletons();
      
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      if (!response.ok) throw new Error('Failed to fetch Pokémon');
      
      const data = await response.json();
      
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );
      
      allPokemon = pokemonDetails;
      filteredPokemon = [...allPokemon];
      offset = 151;
      
      renderPokemonGrid();
      hideLoadingSkeletons();
    } catch (err) {
      console.error('Error fetching Pokémon:', err);
      errorMessage.classList.remove('hidden');
      hideLoadingSkeletons();
    }
  }

  async function loadMorePokemon() {
    if (loading || !hasMore || searchInput.value !== '') return;
    
    try {
      loading = true;
      loadingIndicator.classList.remove('hidden');
      
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=30&offset=${offset}`);
      if (!response.ok) throw new Error('Failed to fetch more Pokémon');
      
      const data = await response.json();
      
      if (data.results.length === 0) {
        hasMore = false;
        loading = false;
        loadingIndicator.classList.add('hidden');
        return;
      }
      
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );
      
      allPokemon = [...allPokemon, ...pokemonDetails];
      filteredPokemon = [...filteredPokemon, ...pokemonDetails];
      offset += 30;
      
      renderPokemonGrid(true);
      
      loading = false;
      loadingIndicator.classList.add('hidden');
    } catch (err) {
      console.error('Error loading more Pokémon:', err);
      loading = false;
      loadingIndicator.classList.add('hidden');
    }
  }

  function showLoadingSkeletons() {
    pokemonGrid.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
      const skeletonClone = skeletonTemplate.content.cloneNode(true);
      pokemonGrid.appendChild(skeletonClone);
    }
  }

  function hideLoadingSkeletons() {
  }

  function renderPokemonGrid(append = false) {
    if (!append) {
      pokemonGrid.innerHTML = '';
    }
    
    if (filteredPokemon.length === 0) {
      noResults.classList.remove('hidden');
    } else {
      noResults.classList.add('hidden');
      
      filteredPokemon.forEach((pokemon, index) => {
        if (append && index < filteredPokemon.length - 30) {
          return;
        }
        
        const card = createPokemonCard(pokemon);
        pokemonGrid.appendChild(card);
      });
    }
    
    if (hasMore && filteredPokemon.length === allPokemon.length && searchInput.value === '') {
      loadingIndicator.classList.remove('hidden');
    } else {
      loadingIndicator.classList.add('hidden');
    }
  }

  function createPokemonCard(pokemon) {
    const cardClone = cardTemplate.content.cloneNode(true);
    
    const card = cardClone.querySelector('.pokemon-card');
    const image = cardClone.querySelector('.pokemon-image');
    const id = cardClone.querySelector('.pokemon-id');
    const name = cardClone.querySelector('.pokemon-name');
    const types = cardClone.querySelector('.pokemon-types');
    
    image.src = pokemon.sprites.other['official-artwork'].front_default;
    image.alt = pokemon.name;
    id.textContent = formatPokemonId(pokemon.id);
    name.textContent = pokemon.name.replace(/-/g, ' ');
    
    pokemon.types.forEach(typeInfo => {
      const typeElement = document.createElement('span');
      typeElement.className = `${typeColors[typeInfo.type.name] || 'bg-gray-500'} text-white capitalize px-2 py-1 rounded-full text-sm`;
      typeElement.textContent = typeInfo.type.name;
      types.appendChild(typeElement);
    });
    
    card.addEventListener('click', () => {
      openPokemonModal(pokemon);
    });
    
    return cardClone;
  }

  async function openPokemonModal(pokemon) {
    try {
      document.getElementById('modal-title').textContent = pokemon.name.replace(/-/g, ' ');
      document.getElementById('modal-id').textContent = formatPokemonId(pokemon.id);
      document.getElementById('modal-image').src = pokemon.sprites.other['official-artwork'].front_default;
      document.getElementById('modal-image').alt = pokemon.name;
      
      document.getElementById('modal-types').innerHTML = '';
      
      pokemon.types.forEach(typeInfo => {
        const typeElement = document.createElement('span');
        typeElement.className = `${typeColors[typeInfo.type.name] || 'bg-gray-500'} text-white capitalize px-3 py-1 text-sm rounded-full`;
        typeElement.textContent = typeInfo.type.name;
        document.getElementById('modal-types').appendChild(typeElement);
      });
      
      document.getElementById('modal-abilities').innerHTML = '';
      
      pokemon.abilities.forEach(abilityInfo => {
        const abilityElement = document.createElement('div');
        abilityElement.className = 'flex items-center';
        
        const abilityName = document.createElement('span');
        abilityName.className = 'capitalize text-gray-700 dark:text-gray-300';
        abilityName.textContent = abilityInfo.ability.name.replace(/-/g, ' ');
        
        if (abilityInfo.is_hidden) {
          const hiddenBadge = document.createElement('span');
          hiddenBadge.className = 'ml-2 text-xs text-gray-500 dark:text-gray-400';
          hiddenBadge.textContent = '(Hidden)';
          abilityName.appendChild(hiddenBadge);
        }
        
        abilityElement.appendChild(abilityName);
        document.getElementById('modal-abilities').appendChild(abilityElement);
      });
      
      document.getElementById('modal-stats').innerHTML = '';
      
      pokemon.stats.forEach(statInfo => {
        const statName = statInfo.stat.name
          .replace('special-attack', 'Sp. Atk')
          .replace('special-defense', 'Sp. Def')
          .replace(/-/g, ' ')
          .replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        
        const statValue = statInfo.base_stat;
        
        let statColorClass = '';
        if (statValue <= 50) statColorClass = 'bg-red-500';
        else if (statValue <= 75) statColorClass = 'bg-yellow-500';
        else if (statValue <= 100) statColorClass = 'bg-green-500';
        else if (statValue <= 125) statColorClass = 'bg-blue-500';
        else statColorClass = 'bg-purple-500';
        
        const statContainer = document.createElement('div');
        
        const statHeader = document.createElement('div');
        statHeader.className = 'flex justify-between mb-1';
        
        const statNameElement = document.createElement('span');
        statNameElement.className = 'text-sm font-medium text-gray-700 dark:text-gray-300';
        statNameElement.textContent = statName;
        
        const statValueElement = document.createElement('span');
        statValueElement.className = 'text-sm font-medium text-gray-700 dark:text-gray-300';
        statValueElement.textContent = statValue;
        
        statHeader.appendChild(statNameElement);
        statHeader.appendChild(statValueElement);
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden';
        
        const progressBar = document.createElement('div');
        progressBar.className = `h-full ${statColorClass}`;
        progressBar.style.width = `${Math.min((statValue / 150) * 100, 100)}%`;
        
        progressContainer.appendChild(progressBar);
        
        statContainer.appendChild(statHeader);
        statContainer.appendChild(progressContainer);
        
        document.getElementById('modal-stats').appendChild(statContainer);
      });
      
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
      const speciesData = await speciesResponse.json();
      
      const englishEntry = speciesData.flavor_text_entries.find(
        entry => entry.language.name === 'en'
      );
      
      const description = englishEntry 
        ? englishEntry.flavor_text.replace(/\f/g, ' ') 
        : 'No description available.';
      
      document.getElementById('modal-description').textContent = description;
      
      pokemonModal.classList.remove('hidden');
    } catch (err) {
      console.error('Error opening Pokémon modal:', err);
    }
  }