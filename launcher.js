function filterGames() {
    const query = document.getElementById('gameSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.game-card');

    cards.forEach(card => {
        // fallback to textContent if data-title is missing
        const title = (card.getAttribute('data-title') || card.textContent).toLowerCase();
        
        if (title.includes(query)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function toggleDock() {
    const dock = document.getElementById('searchDock');
    const tab = document.querySelector('.dock-tab');
    dock.classList.toggle('minimized');
    tab.innerHTML = dock.classList.contains('minimized') ? '▲' : '▼';
}

function toggleFilter() {
    document.getElementById('filterBubble').classList.toggle('show');
}

function surpriseMe() {
    const cards = Array.from(document.querySelectorAll('.game-card:not(.hidden)'));
    if (cards.length > 0) {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        randomCard.style.outline = "8px solid white";
        setTimeout(() => {
            randomCard.style.outline = "none";
            const link = randomCard.querySelector('a');
            if (link) link.click(); else randomCard.click();
        }, 1000);
    }
}

function sortGames(criteria) {
    const container = document.querySelector('ul');
    const cards = Array.from(container.querySelectorAll('.game-card'));

    cards.sort((a, b) => {
        const titleA = a.getAttribute('data-title').toLowerCase();
        const titleB = b.getAttribute('data-title').toLowerCase();
        const dateA = new Date(a.getAttribute('data-date') || 0);
        const dateB = new Date(b.getAttribute('data-date') || 0);

        if (criteria === 'az') return titleA.localeCompare(titleB);
        if (criteria === 'za') return titleB.localeCompare(titleA);
        if (criteria === 'oldest') return dateA - dateB;
        if (criteria === 'newest') return dateB - dateA;
    });

    cards.forEach(card => container.appendChild(card));
    toggleFilter();
} // fuckin hate these things theyre so forgettable

let originalOrder = [];
window.onload = function() {
    const container = document.querySelector('ul');
    if (container) {
        originalOrder = Array.from(container.querySelectorAll('.game-card'));
    }
};

function resetFilters() {
    const container = document.querySelector('ul');
    const searchInput = document.getElementById('gameSearch');
    searchInput.value = '';

    const cards = container.querySelectorAll('.game-card');
    cards.forEach(card => card.classList.remove('hidden'));

    originalOrder.forEach(card => container.appendChild(card));
    toggleFilter();
}

function toggleSettings() {
    const menu = document.getElementById('settingsMenu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function updateTheme() {
    const isLight = document.getElementById('themeToggle').checked;
    document.body.classList.toggle('light-mode', isLight);
    document.title = isLight ? "Lemon's Kind Game Launcher" : "Lemon's Evil Game Launcher"; 
// was thinkin about making it Lemon's Holy Launcher but thought better

    const logo = document.getElementById('dockLogo');
    if (logo) logo.src = isLight ? './Other Assets/holy footer.png' : './evil footer.png';

    const title = document.getElementById('titleLogo');
    if (title) title.src = isLight ? './Other Assets/holy.png' : './title.gif';
}

function updateHover() {
    document.body.classList.toggle('no-hover', document.getElementById('hoverToggle').checked);
}
