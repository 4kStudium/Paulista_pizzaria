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
// CONFIGURAÇÕES
// ============================================
var WHATSAPP_NUMERO = '5538991008284'; // (38) 99100-8284

// Valores SEMPRE em centavos (evita erro de ponto flutuante)
function R(c) {
    return 'R$ ' + (c / 100).toFixed(2).replace('.', ',');
}

// Pizza: duas opções de tamanho
function pz(nome, desc, grande, broto) {
    return {
        nome: nome,
        desc: desc,
        opcoes: [
            { rotulo: 'Grande · 8 pedaços', curto: 'Grande', valor: grande },
            { rotulo: 'Broto · 4 pedaços',  curto: 'Broto',  valor: broto  }
        ]
    };
}
// Item de preço único (esfirra, fogazza, bebida)
function sm(nome, desc, valor) {
    return { nome: nome, desc: desc, opcoes: [{ rotulo: '', curto: '', valor: valor }] };
}

// Bordas (cobradas à parte: R$ 5,00)
var BORDAS = [
    { nome: 'Sem borda',         extra: 0   },
    { nome: 'Borda de Catupiry', extra: 500 },
    { nome: 'Borda de Cheddar',  extra: 500 },
    { nome: 'Borda de Chocolate', extra: 500 }
];

// ============================================
// BANCO DE DADOS (cardápio completo)
// ============================================
var cardapios = {
    doce: {
        titulo: "Pizzas Doces",
        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80",
        borda: true,
        secoes: [{
            sub: null,
            itens: [
                pz("Brigadeiro",       "Brigadeiro e granulado", 5799, 3699),
                pz("Morango",          "Morango, chocolate", 5999, 3799),
                pz("Chocobanana",      "Banana, chocolate, mussarela", 5799, 3599),
                pz("Confete",          "Brigadeiro e confeitos coloridos", 5999, 3799),
                pz("Romeu e Julieta",  "Mussarela e goiabada", 5799, 3599),
                pz("Banana",           "Banana, leite condensado, canela", 5399, 3399)
            ]
        }]
    },
    comum: {
        titulo: "Pizzas Salgadas",
        img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80",
        borda: true,
        secoes: [{
            sub: null,
            itens: [
                pz("Calabresa",         "Calabresa fatiada, cebola (pimentão opcional)", 4899, 3099),
                pz("Toscana",           "Calabresa fatiada, mussarela, cebola (pimentão opcional)", 5699, 3599),
                pz("Baiana",            "Calabresa moída, ovos, pimenta, cebola e mussarela", 5699, 3499),
                pz("Paulista I",        "Calabresa fatiada, cebola, ovo, milho, catupiry original", 5699, 3599),
                pz("Namorado",          "Presunto, milho, catupiry original, mussarela", 6199, 3699),
                pz("Mussarela",         "Molho de tomate, mussarela", 5499, 3499),
                pz("Bauru",             "Presunto, tomate fatiado, mussarela", 5799, 3599),
                pz("Margherita",        "Mussarela, molho de tomate, manjericão", 5599, 3499),
                pz("Frango c/ Catupiry", "Frango, catupiry original", 6199, 3799),
                pz("Caipira",           "Frango, catupiry original, milho", 6299, 3799),
                pz("Palha",             "Frango, milho, catupiry ou mussarela, batata palha", 6299, 3899),
                pz("A Moda da Casa",    "Frango, mussarela, bacon e cebola (pimentão opcional)", 6199, 3899),
                pz("Baicatu",           "Calabresa moída, catupiry original", 5399, 3399),
                pz("Peperone",          "Peperone, catupiry ou mussarela (pimentão opcional)", 6499, 3899),
                pz("Portuguesa",        "Presunto, ovos, ervilha, milho, cebola, mussarela", 5799, 3499),
                pz("Brócolis",          "Brócolis, mussarela", 5499, 3499),
                pz("Carne Seca",        "Carne seca, mussarela ou catupiry e cebola", 6299, 3899),
                pz("Dois Queijos",      "Mussarela, catupiry original", 6199, 3699),
                pz("Paulista II",       "Calabresa moída, bacon, milho, cebola, ovo e mussarela", 5999, 3699),
                pz("Rúcula Especial",   "Rúcula, frango, tomate seco, mussarela", 5799, 3499),
                pz("Bacon",             "Bacon com mussarela", 5899, 3699),
                pz("Atum",              "Atum, mussarela (cebola e pimentão opcional)", 5999, 3399),
                pz("Atum Especial",     "Atum, tomate seco, cebola com mussarela", 6099, 3499),
                pz("Lombinho Canadense", "Lombo, bacon, palmito e mussarela", 6299, 3699),
                pz("Lombinho Especial", "Lombinho com catupiry ou mussarela", 6199, 3799),
                pz("Peito de Peru",     "Peito de peru com palmito, cebola, catupiry ou mussarela", 6599, 3799)
            ]
        }]
    },
    esfirras: {
        titulo: "Esfirras",
        img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=200&q=80",
        borda: false,
        secoes: [
            {
                sub: "Salgadas",
                itens: [
                    sm("Carne",                 "", 699),
                    sm("Carne c/ Mussarela",    "", 799),
                    sm("Carne c/ Catupiry",     "", 899),
                    sm("Frango c/ Catupiry",    "", 999),
                    sm("Calabresa",             "", 699),
                    sm("Calabresa c/ Catupiry", "", 899),
                    sm("Calabresa c/ Mussarela", "", 799),
                    sm("Dois Queijos",          "", 899),
                    sm("Brócolis c/ Mussarela", "", 799),
                    sm("Queijo",                "", 899),
                    sm("Bacon c/ Mussarela",    "", 999),
                    sm("Bauru",                 "Presunto, rodelas de tomate com mussarela", 899),
                    sm("Margherita",            "Mussarela, molho de tomate com manjericão", 799),
                    sm("Caipira",               "Frango, catupiry e milho", 999),
                    sm("Carne Seca",            "Carne seca com mussarela", 999),
                    sm("Baiana",                "Calabresa moída, ovos e cebola", 799),
                    sm("Batata Palha",          "Frango, catupiry, milho e batata palha", 999),
                    sm("Frango c/ Mussarela",   "", 899)
                ]
            },
            {
                sub: "Doces",
                itens: [
                    sm("Brigadeiro", "Calda de chocolate com granulado", 999),
                    sm("Banana",     "Banana, canela, leite condensado", 799),
                    sm("Confete",    "Calda de chocolate com MMS", 999),
                    sm("Moranguinho", "Calda de chocolate com morango", 999),
                    sm("Goiabada",   "Mussarela com goiabada", 899)
                ]
            }
        ]
    },
    fogacas: {
        titulo: "Fogazzas",
        img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80",
        borda: false,
        secoes: [
            {
                sub: "Salgadas",
                itens: [
                    sm("Carne",                 "", 1499),
                    sm("Carne c/ Mussarela",    "", 1699),
                    sm("Carne c/ Catupiry",     "", 1799),
                    sm("Dois Queijos",          "", 1799),
                    sm("Mussarela",             "", 1499),
                    sm("Brócolis c/ Mussarela", "", 1499),
                    sm("Frango c/ Catupiry",    "", 1799),
                    sm("Frango c/ Mussarela",   "", 1699),
                    sm("Bacon c/ Mussarela",    "", 1799),
                    sm("Baicatu",               "Calabresa moída com catupiry", 1599),
                    sm("Toscana",               "Calabresa com mussarela", 1699),
                    sm("Caipira",               "Frango, catupiry e milho", 1799),
                    sm("Bauru",                 "Presunto, tomate em rodelas com mussarela", 1699),
                    sm("Carioca",               "Milho com catupiry", 1799)
                ]
            },
            {
                sub: "Doces",
                itens: [
                    sm("Moranguinho", "Calda de chocolate com morango", 1799),
                    sm("Brigadeiro",  "Calda de chocolate", 1699),
                    sm("Banana",      "Banana, leite condensado, canela", 1699),
                    sm("Chocobanana", "Banana, chocolate, mussarela", 1699),
                    sm("Goiabada",    "Mussarela com goiabada", 1699)
                ]
            }
        ]
    },
    bebidas: {
        titulo: "Bebidas",
        img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&q=80",
        borda: false,
        secoes: [{
            sub: null,
            itens: [
                sm("Água",                 "", 250),
                sm("Suco de Maracujá",     "", 700),
                sm("Suco Natural de Laranja", "", 700),
                sm("Refrigerante Lata",    "", 500),
                sm("Refrigerante 1L",      "", 1100),
                sm("H2O 500ml",            "", 800),
                sm("Cerveja 600ml",        "A partir de", 1000),
                sm("Cerveja Long",         "", 1000),
                sm("Cerveja Lata",         "", 500)
            ]
        }]
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

var appContainer = document.querySelector('.app-container');
var itemOverlay  = document.getElementById('itemOverlay');
var itemSheet    = document.getElementById('itemSheet');
var cartOverlay  = document.getElementById('cartOverlay');
var cartSheet    = document.getElementById('cartSheet');
var cartBtn      = document.getElementById('cartBtn');
var cartBadge    = document.getElementById('cartBadge');
var checkoutBar  = document.getElementById('checkoutBar');
var checkoutBtn  = document.getElementById('checkoutBtn');
var checkoutSub  = document.getElementById('checkoutSub');

var activeCategory = null;

// ============================================
// UTILITÁRIOS
// ============================================
function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ============================================
// BUILD DE UM GRUPO
// ============================================
function priceHtml(item) {
    if (item.opcoes.length > 1) {
        var parts = [];
        for (var i = 0; i < item.opcoes.length; i++) {
            parts.push('<small>' + item.opcoes[i].curto + '</small> ' + R(item.opcoes[i].valor));
        }
        return parts.join(' &nbsp;·&nbsp; ');
    }
    return R(item.opcoes[0].valor);
}

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

    for (var s = 0; s < data.secoes.length; s++) {
        var secao = data.secoes[s];
        var block = document.createElement('div');
        block.className = 'menu-section-block';

        if (secao.sub) {
            var sub = document.createElement('div');
            sub.className = 'menu-subtitle';
            sub.textContent = secao.sub;
            block.appendChild(sub);
        }

        for (var i = 0; i < secao.itens.length; i++) {
            var item = secao.itens[i];
            var row = document.createElement('div');
            row.className = 'menu-item-row';
            row.dataset.cat = categoryKey;
            row.dataset.sec = s;
            row.dataset.idx = i;
            row.innerHTML =
                '<img src="' + data.img + '" alt="' + esc(item.nome) + '">' +
                '<div class="menu-item-details">' +
                    '<h4>' + esc(item.nome) + '</h4>' +
                    (item.desc ? '<p>' + esc(item.desc) + '</p>' : '') +
                    '<span class="price">' + priceHtml(item) + '</span>' +
                '</div>';
            block.appendChild(row);
        }
        group.appendChild(block);
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
// OVERLAYS (abrir / fechar)
// ============================================
function openOverlay(el) { el.classList.add('open'); }
function closeOverlay(el) { el.classList.remove('open'); }

itemOverlay.addEventListener('click', function(e) {
    if (e.target === itemOverlay) closeOverlay(itemOverlay);
});
cartOverlay.addEventListener('click', function(e) {
    if (e.target === cartOverlay) closeOverlay(cartOverlay);
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeOverlay(itemOverlay);
        closeOverlay(cartOverlay);
    }
});

// ============================================
// CARRINHO (estado)
// ============================================
var cart = [];

function cartCount() {
    var n = 0;
    for (var i = 0; i < cart.length; i++) n += cart[i].qtd;
    return n;
}
function cartTotal() {
    var t = 0;
    for (var i = 0; i < cart.length; i++) t += cart[i].unit * cart[i].qtd;
    return t;
}

function updateCartUI() {
    var n = cartCount();
    cartBadge.textContent = n;
    if (n > 0) {
        cartBadge.classList.add('show');
        checkoutBar.classList.add('show');
        appContainer.classList.add('has-cart');
        checkoutSub.textContent = n + (n === 1 ? ' item' : ' itens') + ' · ' + R(cartTotal());
    } else {
        cartBadge.classList.remove('show');
        checkoutBar.classList.remove('show');
        appContainer.classList.remove('has-cart');
        checkoutSub.textContent = '';
    }
}

function addToCart(line) {
    for (var i = 0; i < cart.length; i++) {
        var c = cart[i];
        if (c.nome === line.nome && c.tamanho === line.tamanho &&
            c.borda === line.borda && c.obs === line.obs) {
            c.qtd += line.qtd;
            updateCartUI();
            return;
        }
    }
    cart.push(line);
    updateCartUI();
}

// ============================================
// DETALHES DO ITEM (tamanho, borda, quantidade)
// ============================================
var sel = null;

function selUnit() {
    var base = sel.item.opcoes[sel.op].valor;
    var extra = sel.cat.borda ? BORDAS[sel.borda].extra : 0;
    return base + extra;
}

function refreshItemTotal() {
    document.getElementById('qtdVal').textContent = sel.qtd;
    document.getElementById('addTotal').textContent = R(selUnit() * sel.qtd);
}

function openItemModal(catKey, sIdx, iIdx) {
    var cat = cardapios[catKey];
    var item = cat.secoes[sIdx].itens[iIdx];
    sel = { cat: cat, item: item, op: 0, borda: 0, qtd: 1 };

    var h = '';
    h += '<button type="button" class="sheet-close" data-act="close-item" aria-label="Fechar">&times;</button>';
    h += '<img class="sheet-img" src="' + cat.img.replace('w=200', 'w=600') + '" alt="' + esc(item.nome) + '">';
    h += '<div class="sheet-body">';
    h += '<h3>' + esc(item.nome) + '</h3>';
    if (item.desc) h += '<p class="sheet-desc">' + esc(item.desc) + '</p>';

    if (item.opcoes.length > 1) {
        h += '<div class="opt-title">Tamanho</div><div class="opt-group" id="grpTam">';
        for (var i = 0; i < item.opcoes.length; i++) {
            h += '<button type="button" class="opt-chip' + (i === 0 ? ' selected' : '') + '" data-idx="' + i + '">' +
                 '<span>' + item.opcoes[i].rotulo + '</span><b>' + R(item.opcoes[i].valor) + '</b></button>';
        }
        h += '</div>';
    }

    if (cat.borda) {
        h += '<div class="opt-title">Borda</div><div class="opt-group" id="grpBorda">';
        for (var b = 0; b < BORDAS.length; b++) {
            h += '<button type="button" class="opt-chip' + (b === 0 ? ' selected' : '') + '" data-idx="' + b + '">' +
                 '<span>' + BORDAS[b].nome + '</span><b>' + (BORDAS[b].extra ? '+ ' + R(BORDAS[b].extra) : 'Grátis') + '</b></button>';
        }
        h += '</div>';
    }

    h += '<div class="qty-row"><div class="opt-title">Quantidade</div>' +
         '<div class="qty-ctrl">' +
            '<button type="button" data-act="qtd-menos" aria-label="Diminuir">&minus;</button>' +
            '<span id="qtdVal">1</span>' +
            '<button type="button" data-act="qtd-mais" aria-label="Aumentar">+</button>' +
         '</div></div>';

    h += '<div class="opt-title">Observações</div>' +
         '<textarea class="obs-input" id="obsInput" maxlength="200" placeholder="Ex.: sem cebola, com pimentão, cortar em 12..."></textarea>';
    h += '</div>';

    h += '<div class="sheet-footer"><button type="button" class="btn-primary" data-act="add-cart">' +
         '<span>Adicionar ao carrinho</span><span id="addTotal"></span></button></div>';

    itemSheet.innerHTML = h;
    itemSheet.scrollTop = 0;
    refreshItemTotal();
    openOverlay(itemOverlay);
}

function selectChip(groupEl, chip) {
    var chips = groupEl.querySelectorAll('.opt-chip');
    for (var i = 0; i < chips.length; i++) chips[i].classList.remove('selected');
    chip.classList.add('selected');
}

itemSheet.addEventListener('click', function(e) {
    if (!sel) return;

    var chip = e.target.closest('.opt-chip');
    if (chip) {
        var grp = chip.parentNode;
        selectChip(grp, chip);
        var idx = parseInt(chip.dataset.idx, 10);
        if (grp.id === 'grpTam') sel.op = idx;
        if (grp.id === 'grpBorda') sel.borda = idx;
        refreshItemTotal();
        return;
    }

    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var act = btn.dataset.act;

    if (act === 'close-item') {
        closeOverlay(itemOverlay);
    } else if (act === 'qtd-mais') {
        if (sel.qtd < 50) sel.qtd++;
        refreshItemTotal();
    } else if (act === 'qtd-menos') {
        if (sel.qtd > 1) sel.qtd--;
        refreshItemTotal();
    } else if (act === 'add-cart') {
        var opcao = sel.item.opcoes[sel.op];
        addToCart({
            nome: sel.item.nome,
            tamanho: opcao.rotulo,
            borda: (sel.cat.borda && sel.borda > 0) ? BORDAS[sel.borda].nome : '',
            obs: document.getElementById('obsInput').value.trim(),
            qtd: sel.qtd,
            unit: selUnit()
        });
        closeOverlay(itemOverlay);
    }
});

// ============================================
// TELA DO CARRINHO
// ============================================
function renderCart() {
    var h = '<button type="button" class="sheet-close" data-act="close-cart" aria-label="Fechar">&times;</button>';
    h += '<div class="cart-head"><h3>Seu carrinho</h3></div>';

    if (cart.length === 0) {
        h += '<div class="cart-empty">Seu carrinho está vazio.<br>Toque em um item do cardápio para adicionar.</div>';
        cartSheet.innerHTML = h;
        return;
    }

    h += '<div class="cart-list">';
    for (var i = 0; i < cart.length; i++) {
        var c = cart[i];
        var det = [];
        if (c.tamanho) det.push(c.tamanho);
        if (c.borda) det.push(c.borda);
        if (c.obs) det.push('Obs: ' + c.obs);

        h += '<div class="cart-line">' +
                '<div class="cart-line-top">' +
                    '<div>' +
                        '<div class="cart-line-name">' + esc(c.nome) + '</div>' +
                        (det.length ? '<div class="cart-line-det">' + esc(det.join(' · ')) + '</div>' : '') +
                    '</div>' +
                    '<div class="cart-line-price">' + R(c.unit * c.qtd) + '</div>' +
                '</div>' +
                '<div class="cart-line-ctrl">' +
                    '<div class="qty-ctrl">' +
                        '<button type="button" data-act="line-menos" data-i="' + i + '">&minus;</button>' +
                        '<span>' + c.qtd + '</span>' +
                        '<button type="button" data-act="line-mais" data-i="' + i + '">+</button>' +
                    '</div>' +
                    '<button type="button" class="cart-remove" data-act="line-del" data-i="' + i + '">Remover</button>' +
                '</div>' +
             '</div>';
    }
    h += '</div>';

    h += '<div class="cart-total"><span>Total</span><b>' + R(cartTotal()) + '</b></div>';
    h += '<div class="sheet-footer"><button type="button" class="btn-primary center" data-act="send-wa">Enviar pedido pelo WhatsApp</button></div>';

    cartSheet.innerHTML = h;
}

function openCart() {
    renderCart();
    cartSheet.scrollTop = 0;
    openOverlay(cartOverlay);
}

function buildWhatsAppMessage() {
    var msg = 'Olá! Gostaria de fazer um pedido:\n\n';
    for (var i = 0; i < cart.length; i++) {
        var c = cart[i];
        msg += '• ' + c.qtd + 'x ' + c.nome;
        if (c.tamanho) msg += ' (' + c.tamanho + ')';
        if (c.borda) msg += ' + ' + c.borda;
        msg += ' — ' + R(c.unit * c.qtd) + '\n';
        if (c.obs) msg += '   Obs: ' + c.obs + '\n';
    }
    msg += '\n*Total: ' + R(cartTotal()) + '*';
    return msg;
}

cartSheet.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var act = btn.dataset.act;
    var i = parseInt(btn.dataset.i, 10);

    if (act === 'close-cart') {
        closeOverlay(cartOverlay);
        return;
    }
    if (act === 'line-mais') {
        if (cart[i] && cart[i].qtd < 50) cart[i].qtd++;
    } else if (act === 'line-menos') {
        if (cart[i]) {
            cart[i].qtd--;
            if (cart[i].qtd <= 0) cart.splice(i, 1);
        }
    } else if (act === 'line-del') {
        if (cart[i]) cart.splice(i, 1);
    } else if (act === 'send-wa') {
        if (cart.length === 0) return;
        var url = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(buildWhatsAppMessage());
        window.open(url, '_blank');
        return;
    }
    updateCartUI();
    renderCart();
});

cartBtn.addEventListener('click', openCart);
checkoutBtn.addEventListener('click', openCart);

// ============================================
// CLIQUE NOS ITENS DO CARDÁPIO -> DETALHES
// ============================================
menuItems.addEventListener('click', function(e) {
    var row = e.target.closest('.menu-item-row');
    if (!row) return;
    openItemModal(row.dataset.cat, parseInt(row.dataset.sec, 10), parseInt(row.dataset.idx, 10));
});

// ============================================
// INICIALIZAÇÃO
// ============================================
renderFullMenu();
updateCartUI();
