let originalOrder = [];

window.onload = function() {
    const container = document.querySelector('ul');
    if (container) {
        originalOrder = Array.from(container.querySelectorAll('.game-card'));
    }

    const hoverSetting = localStorage.getItem('hoverDisabled') === 'true';
    const hoverToggle = document.getElementById('hoverToggle');
    if (hoverToggle) {
        hoverToggle.checked = hoverSetting;
        document.body.classList.toggle('no-hover', hoverSetting);
        if (hoverSetting) generateVersionCards();
    }
    const lightSetting = localStorage.getItem('light-mode') === 'true';
    const lightToggle = document.getElementById('themeToggle');
    if (lightToggle) {
        lightToggle.isLight = lightSetting;
        document.body.classList.toggle('light-mode', lightSetting);
        if (lightSetting) generateVersionCards();
    }
};

function filterGames() {
    const input = document.getElementById('gameSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.game-card');

    cards.forEach(card => {
        const title = (card.getAttribute('data-title') || "").toLowerCase();
        const tags = (card.getAttribute('data-tags') || "").toLowerCase();

        if (input.startsWith('#')) {
            const searchTag = input.substring(1).trim();
            if (searchTag === "" || tags.includes(searchTag)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        } else {
            if (title.includes(input)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
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
        const titleA = (a.getAttribute('data-title') || "").toLowerCase();
        const titleB = (b.getAttribute('data-title') || "").toLowerCase();
        const dateA = new Date(a.getAttribute('data-date') || 0);
        const dateB = new Date(b.getAttribute('data-date') || 0);

        if (criteria === 'az') return titleA.localeCompare(titleB);
        if (criteria === 'za') return titleB.localeCompare(titleA);
        if (criteria === 'oldest') return dateA - dateB;
        if (criteria === 'newest') return dateB - dateA;
    });

    cards.forEach(card => container.appendChild(card));
    toggleFilter();
}

function resetFilters() {
    const container = document.querySelector('ul');
    document.getElementById('gameSearch').value = '';
    const cards = container.querySelectorAll('.game-card');
    cards.forEach(card => card.classList.remove('hidden'));
    
    // Restore original DOM order
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
    document.title = isLight ? "Lemon's Experimental Kind Game Launcher" : "Lemon's Experimental Evil Game Launcher"; 

    const logo = document.getElementById('dockLogo');
    if (logo) logo.src = isLight ? './Other Assets/holy footer.png' : './neutral footer.png';

    const title = document.getElementById('titleLogo');
    if (title) title.src = isLight ? './Other Assets/holy.png' : './neutral title.gif';
}

function updateHover() {
    const isChecked = document.getElementById('hoverToggle').checked;
    document.body.classList.toggle('no-hover', isChecked);
    localStorage.setItem('hoverDisabled', isChecked);

    // Clear any existing temp cards before regenerating
    document.querySelectorAll('.temp-version-card').forEach(card => card.remove());
    if (isChecked) generateVersionCards();
}

function generateVersionCards() {
    const cardsWithVersions = document.querySelectorAll('.game-card .version-btn');
    cardsWithVersions.forEach(btnContainer => {
        const parentCard = btnContainer.closest('.game-card');
        const links = btnContainer.querySelectorAll('a');
        const fallbackImg = parentCard.querySelector('img').getAttribute('src');
        
        links.forEach(link => {
            const tempCard = document.createElement('li');
            tempCard.className = 'game-card temp-version-card';
            
            const versionImg = link.getAttribute('data-img') || fallbackImg;
            tempCard.setAttribute('data-title', link.textContent.toLowerCase());
            
            const versionTags = link.getAttribute('data-tags') || "";
            tempCard.setAttribute('data-tags', versionTags);
            
            tempCard.innerHTML = `
                <a href="${link.href}">
                    <img src="${versionImg}">
                </a>
                <div class="version-label">${link.textContent}</div>
            `;
            
            parentCard.parentNode.insertBefore(tempCard, parentCard.nextSibling);
        });
    });
}
