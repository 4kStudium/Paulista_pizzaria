// ============================================
// FALLBACK DO VÍDEO
// ============================================
(function() {
    var heroBanner = document.getElementById('heroBanner');
    var heroVideo = document.getElementById('heroVideo');
    if (!heroBanner || !heroVideo) return;

    function handleVideoError() {
        heroBanner.classList.add('video-error');
    }
    heroVideo.addEventListener('error', handleVideoError, true);

    var sourceEl = heroVideo.querySelector('source');
    if (sourceEl) {
        sourceEl.addEventListener('error', handleVideoError);
    }
    setTimeout(function() {
        if (heroVideo.readyState === 0 && heroVideo.networkState === 3) {
            handleVideoError();
        }
    }, 4000);
})();

// ============================================
// BANCO DE DADOS
// ============================================
var cardapios = {
    doce: {
        titulo: "Pizzas Doces",
        itens: [
            { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80", nome: "Chocolate com Morango", desc: "Chocolate ao leite derretido e morangos frescos", preco: "R$ 49,90" },
            { img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=200&q=80", nome: "Romeu e Julieta", desc: "Goiabada cremosa com queijo mussarela", preco: "R$ 45,90" },
            { img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80", nome: "Banana com Canela", desc: "Banana caramelizada, canela e leite condensado", preco: "R$ 44,90" }
        ]
    },
    comum: {
        titulo: "Pizzas Comuns",
        itens: [
            { img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80", nome: "Margherita", desc: "Molho, mussarela, tomate e manjericão", preco: "R$ 45,90" },
            { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80", nome: "Calabresa Paulista", desc: "Calabresa artesanal, cebola e azeitonas", preco: "R$ 49,90" },
            { img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&q=80", nome: "Quatro Queijos", desc: "Mussarela, provolone, parmesão e gorgonzola", preco: "R$ 54,90" },
            { img: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=200&q=80", nome: "Portuguesa", desc: "Presunto, ovo, cebola, azeitona e mussarela", preco: "R$ 52,90" }
        ]
    },
    esfirras: {
        titulo: "Esfirras",
        itens: [
            { img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=200&q=80", nome: "Esfirra de Carne", desc: "Carne moída temperada com especiarias", preco: "R$ 12,90" },
            { img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&q=80", nome: "Esfirra de Queijo", desc: "Queijo mussarela derretido e orégano", preco: "R$ 11,90" },
            { img: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=200&q=80", nome: "Esfirra de Frango", desc: "Frango desfiado com catupiry", preco: "R$ 13,90" }
        ]
    },
    fogacas: {
        titulo: "Fogaças",
        itens: [
            { img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80", nome: "Fogaça Salgada", desc: "Massa artesanal com sal grosso e ervas", preco: "R$ 15,90" },
            { img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=80", nome: "Fogaça de Calabresa", desc: "Recheio de calabresa e queijo", preco: "R$ 18,90" },
            { img: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=200&q=80", nome: "Fogaça Doce", desc: "Cobertura de açúcar e canela", preco: "R$ 14,90" }
        ]
    },
    bebidas: {
        titulo: "Bebidas",
        itens: [
            { img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&q=80", nome: "Refrigerante Lata", desc: "Coca-Cola, Guaraná ou Fanta 350ml", preco: "R$ 6,90" },
            { img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&q=80", nome: "Suco Natural", desc: "Laranja, limão ou maracujá 500ml", preco: "R$ 12,90" },
            { img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&q=80", nome: "Vinho Tinto", desc: "Taça de vinho tinto seco", preco: "R$ 25,90" }
        ]
    }
};

var ORDEM_CATEGORIAS = ['doce', 'comum', 'esfirras', 'fogacas', 'bebidas'];

// ============================================
// REFERÊNCIAS DO DOM
// ============================================
var menuItems   = document.getElementById('menuItems');
var mainCards   = document.getElementById('mainCards');
var dividerEl   = document.getElementById('divider');
var allCatCards = document.querySelectorAll('.cat-card');

var activeCategory = null;

// ============================================
// BUILD DE UM GRUPO
// ============================================
function buildMenuGroup(categoryKey) {
    var data = cardapios[categoryKey];
    if (!data) return null;

    var group = document.createElement('div');
    group.className = 'menu-group';
    group.dataset.category = categoryKey;

    var title = document.createElement('div');
    title.className = 'menu-category-title';
    title.textContent = data.titulo;
    group.appendChild(title);

    for (var i = 0; i < data.itens.length; i++) {
        var item = data.itens[i];
        var row = document.createElement('div');
        row.className = 'menu-item-row';
        row.innerHTML =
            '<img src="' + item.img + '" alt="' + item.nome + '">' +
            '<div class="menu-item-details">' +
                '<h4>' + item.nome + '</h4>' +
                '<p>' + item.desc + '</p>' +
                '<span class="price">' + item.preco + '</span>' +
            '</div>';
        group.appendChild(row);
    }
    return group;
}

// ============================================
// TOGGLE DOS CARDS PRINCIPAIS + DIVISÓRIA
// ============================================
function setMainCardsVisible(visible) {
    if (visible) {
        if (mainCards)  { mainCards.classList.remove('hidden');  mainCards.style.display  = ''; }
        if (dividerEl)  { dividerEl.classList.remove('hidden');  dividerEl.style.display  = ''; }
    } else {
        if (mainCards)  { mainCards.classList.add('hidden');     mainCards.style.display  = 'none'; }
        if (dividerEl)  { dividerEl.classList.add('hidden');     dividerEl.style.display  = 'none'; }
    }
}

// ============================================
// RENDERIZAÇÃO
// ============================================
function renderFullMenu() {
    menuItems.innerHTML = '';
    for (var i = 0; i < ORDEM_CATEGORIAS.length; i++) {
        var group = buildMenuGroup(ORDEM_CATEGORIAS[i]);
        if (group) menuItems.appendChild(group);
    }
    setMainCardsVisible(true);
}

function renderFilteredMenu(categoryKey) {
    menuItems.innerHTML = '';
    var group = buildMenuGroup(categoryKey);
    if (group) menuItems.appendChild(group);
    setMainCardsVisible(false);
}

// ============================================
// INTERAÇÃO DAS CATEGORIAS
// ============================================
for (var i = 0; i < allCatCards.length; i++) {
    (function(cat) {
        cat.addEventListener('click', function() {
            var target = cat.dataset.target;

            if (activeCategory === target) {
                // desmarca -> volta ao cardápio completo
                for (var j = 0; j < allCatCards.length; j++) {
                    allCatCards[j].classList.remove('active');
                }
                activeCategory = null;
                renderFullMenu();
            } else {
                // seleciona nova categoria
                for (var k = 0; k < allCatCards.length; k++) {
                    allCatCards[k].classList.remove('active');
                }
                cat.classList.add('active');
                activeCategory = target;
                renderFilteredMenu(target);
            }
        });
    })(allCatCards[i]);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
renderFullMenu();