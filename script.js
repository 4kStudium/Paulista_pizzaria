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
// WhatsApp da pizzaria (DDI 55 + DDD 38 + número do cardápio)
var WHATSAPP_NUMERO = '5538991008284';

// Bordas (cobradas à parte: +R$ 5,00 — catupiry original, cheddar e chocolate)
var BORDAS = [
    { nome: 'Sem borda',          preco: 0 },
    { nome: 'Borda de Catupiry',  preco: 5 },
    { nome: 'Borda de Cheddar',   preco: 5 },
    { nome: 'Borda de Chocolate', preco: 5 }
];

// ============================================
// BANCO DE DADOS (CARDÁPIO OFICIAL)
// ============================================
// Pizza com dois tamanhos (Grande / Broto) e opção de borda
function pizza(nome, desc, grande, broto, infoGrande) {
    return {
        nome: nome,
        desc: desc,
        borda: true,
        tamanhos: [
            { label: 'Grande', info: infoGrande, preco: grande },
            { label: 'Broto',  info: '4 pedaços', preco: broto }
        ]
    };
}

// Item de preço único (esfihas e bebidas)
function unico(nome, desc, preco) {
    return {
        nome: nome,
        desc: desc,
        borda: false,
        tamanhos: [ { label: 'Unidade', info: '', preco: preco } ]
    };
}

var cardapios = {
    doce: {
        titulo: "Pizzas Doces",
        grupos: [
            { itens: [
                pizza("Brigadeiro",      "Brigadeiro e granulado.",         57.99, 36.99, ""),
                pizza("Morango",         "Morango, chocolate.",             59.99, 37.99, ""),
                pizza("Chocobanana",     "Banana, chocolate, mussarela.",   57.99, 35.99, ""),
                pizza("Confete",         "Brigadeiro e confeitos coloridos.", 59.99, 37.99, ""),
                pizza("Romeu e Julieta", "Mussarela e goiabada.",           57.99, 35.99, ""),
                pizza("Banana",          "Banana, leite condensado, canela.", 53.99, 33.99, "")
            ] }
        ]
    },
    comum: {
        titulo: "Pizzas Salgadas",
        grupos: [
            { itens: [
                // Pizzas Salgadas I
                pizza("Calabresa",         "Calabresa fatiada, c/ cebola (pimentão opcional)",       48.99, 30.99, "8 pedaços"),
                pizza("Toscana",           "Calabresa fatiada, mussarela, cebola (pimentão opcional)", 56.99, 35.99, "8 pedaços"),
                pizza("Baiana",            "Calabresa moída, ovos, pimenta, cebola e mussarela",     56.99, 34.99, "8 pedaços"),
                pizza("Paulista I",        "Calabresa fatiada, cebola, ovo, milho, catupiry original", 56.99, 35.99, "8 pedaços"),
                pizza("Namorado",          "Presunto, milho, catupiry original, mussarela",          61.99, 36.99, "8 pedaços"),
                pizza("Mussarela",         "Molho de tomate, mussarela",                             54.99, 34.99, "8 pedaços"),
                pizza("Bauru",             "Presunto, tomate fatiado, mussarela",                    57.99, 35.99, "8 pedaços"),
                pizza("Margherita",        "Mussarela, molho de tomate, manjericão",                 55.99, 34.99, "8 pedaços"),
                pizza("Frango c/ Catupiry", "Frango, c/ catupiry original",                          61.99, 37.99, "8 pedaços"),
                pizza("Caipira",           "Frango, catupiry original, milho",                       62.99, 37.99, "8 pedaços"),
                pizza("Palha",             "Frango, milho, catupiry ou mussarela, batata palha",     62.99, 38.99, "8 pedaços"),
                pizza("À Moda da Casa",    "Frango, mussarela, bacon e cebola (pimentão opcional)",  61.99, 38.99, "8 pedaços"),
                pizza("Baicatu",           "Calabresa moída, c/ catupiry original",                  53.99, 33.99, "8 pedaços"),
                pizza("Peperone",          "Peperone, catupiry ou mussarela (pimentão opcional)",    64.99, 38.99, "8 pedaços"),
                // Pizzas Salgadas II
                pizza("Portuguesa",         "Presunto, ovos, ervilha, milho, cebola, mussarela",     57.99, 34.99, "8 pedaços"),
                pizza("Brócolis",           "Brócolis, mussarela",                                   54.99, 34.99, "8 pedaços"),
                pizza("Carne Seca",         "Carne seca, mussarela ou catupiry e cebola",            62.99, 38.99, "8 pedaços"),
                pizza("Dois Queijos",       "Mussarela, catupiry original",                          61.99, 36.99, "8 pedaços"),
                pizza("Paulista II",        "Calabresa moída, bacon, milho, cebola, ovo e mussarela", 59.99, 36.99, "8 pedaços"),
                pizza("Rúcula Especial",    "Rúcula, frango, tomate seco, c/ mussarela",             57.99, 34.99, "8 pedaços"),
                pizza("Bacon",              "Bacon c/ mussarela",                                    58.99, 36.99, "8 pedaços"),
                pizza("Atum",               "Atum, mussarela (cebola e pimentão opcional)",          59.99, 33.99, "8 pedaços"),
                pizza("Atum Especial",      "Atum, tomate seco, cebola c/ mussarela",                60.99, 34.99, "8 pedaços"),
                pizza("Lombinho Canadense", "Lombo, bacon, palmito e mussarela",                     62.99, 36.99, "8 pedaços"),
                pizza("Lombinho Especial",  "Lombinho com catupiry ou mussarela",                    61.99, 37.99, "8 pedaços"),
                pizza("Peito de Peru",      "Peito de peru com palmito, cebola, catupiry ou mussarela", 65.99, 37.99, "8 pedaços")
            ] }
        ]
    },
    esfirras: {
        titulo: "Esfihas",
        grupos: [
            { subtitulo: "Esfihas Salgadas", itens: [
                unico("Carne",                  "", 6.99),
                unico("Carne c/ Mussarela",     "", 7.99),
                unico("Carne c/ Catupiry",      "", 8.99),
                unico("Frango c/ Catupiry",     "", 9.99),
                unico("Calabresa",              "", 6.99),
                unico("Calabresa c/ Catupiry",  "", 8.99),
                unico("Calabresa c/ Mussarela", "", 7.99),
                unico("Dois Queijos",           "", 8.99),
                unico("Brócolis c/ Mussarela",  "", 7.99),
                unico("Queijo",                 "", 8.99),
                unico("Bacon c/ Mussarela",     "", 9.99),
                unico("Bauru",                  "Presunto, rodelas de tomate c/ mussarela", 8.99),
                unico("Margherita",             "Mussarela, molho de tomate c/ manjericão", 7.99),
                unico("Caipira",                "Frango, catupiry e milho", 9.99),
                unico("Carne Seca",             "Carne seca c/ mussarela", 9.99),
                unico("Baiana",                 "Calabresa moída, ovos e cebola", 7.99),
                unico("Batata Palha",           "Frango, catupiry, milho e batata palha", 9.99),
                unico("Frango c/ Mussarela",    "", 8.99)
            ] },
            { subtitulo: "Esfihas Doces", itens: [
                unico("Brigadeiro",  "Calda de chocolate c/ granulado", 9.99),
                unico("Banana",      "Banana, canela, leite condensado", 7.99),
                unico("Confete",     "Calda de chocolate, c/ MMS", 9.99),
                unico("Moranguinho", "Calda de chocolate, c/ morango", 9.99),
                unico("Goiabada",    "Mussarela, c/ goiabada", 8.99)
            ] }
        ]
    },
    fogacas: {
        titulo: "Fogazzas",
        grupos: [
            { subtitulo: "Fogazzas Salgadas", itens: [
                unico("Carne",                "", 14.99),
                unico("Carne c/ Mussarela",   "", 16.99),
                unico("Carne c/ Catupiry",    "", 17.99),
                unico("Dois Queijos",         "", 17.99),
                unico("Mussarela",            "", 14.99),
                unico("Brócolis c/ Mussarela", "", 14.99),
                unico("Frango c/ Catupiry",   "", 17.99),
                unico("Frango c/ Mussarela",  "", 16.99),
                unico("Bacon c/ Mussarela",   "", 17.99),
                unico("Baicatu",              "Calabresa moída, c/ catupiry", 15.99),
                unico("Toscana",              "Calabresa c/ mussarela", 16.99),
                unico("Caipira",              "Frango, catupiry e milho", 17.99),
                unico("Bauru",                "Presunto, tomate em rodelas, c/ mussarela", 16.99),
                unico("Carioca",              "Milho, c/ catupiry", 17.99)
            ] },
            { subtitulo: "Fogazzas Doces", itens: [
                unico("Moranguinho", "Calda de chocolate, c/ morango", 17.99),
                unico("Brigadeiro",  "Calda de chocolate", 16.99),
                unico("Banana",      "Banana, leite condensado, canela", 16.99),
                unico("Chocobanana", "Banana, chocolate, mussarela", 16.99),
                unico("Goiabada",    "Mussarela c/ goiabada", 16.99)
            ] }
        ]
    },
    bebidas: {
        titulo: "Bebidas",
        grupos: [
            { itens: [
                unico("Água",                    "", 2.50),
                unico("Suco de Maracujá",        "", 7.00),
                unico("Suco Natural de Laranja", "", 7.00),
                unico("Refrigerante Lata",       "", 5.00),
                unico("Refrigerante 1L",         "", 11.00),
                unico("H2O 500ml",               "", 8.00),
                unico("Cerveja 600ml",           "A partir de", 10.00),
                unico("Cerveja Long",            "", 10.00),
                unico("Cerveja Lata",            "", 5.00)
            ] }
        ]
    }
};

var ORDEM_CATEGORIAS = ['doce', 'comum', 'esfirras', 'fogacas', 'bebidas'];

// Índice de itens por id (para abrir o painel de detalhes)
var itensPorId = {};
(function indexarItens() {
    for (var c = 0; c < ORDEM_CATEGORIAS.length; c++) {
        var key = ORDEM_CATEGORIAS[c];
        var grupos = cardapios[key].grupos;
        for (var g = 0; g < grupos.length; g++) {
            for (var i = 0; i < grupos[g].itens.length; i++) {
                var it = grupos[g].itens[i];
                it.id = key + '-' + g + '-' + i;
                itensPorId[it.id] = it;
            }
        }
    }
})();

// ============================================
// UTILITÁRIOS
// ============================================
function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function toCents(valor) {
    return Math.round(valor * 100);
}

function fmt(cents) {
    var reais = (cents / 100).toFixed(2).replace('.', ',');
    return 'R$ ' + reais;
}

// ============================================
// REFERÊNCIAS DO DOM
// ============================================
var menuItems   = document.getElementById('menuItems');
var mainCards   = document.getElementById('mainCards');
var dividerEl   = document.getElementById('divider');
var allCatCards = document.querySelectorAll('.cat-card');

var appContainer = document.querySelector('.app-container');
var backdropEl   = document.getElementById('backdrop');
var detailSheet  = document.getElementById('detailSheet');
var cartSheet    = document.getElementById('cartSheet');
var buildSheet   = document.getElementById('buildSheet');
var checkoutBar  = document.getElementById('checkoutBar');
var checkoutSub  = document.getElementById('checkoutSub');
var btnCheckout  = document.getElementById('btnCheckout');
var btnCart      = document.getElementById('btnCart');
var cartBadge    = document.getElementById('cartBadge');
var toastEl      = document.getElementById('toast');

var activeCategory = null;

// ============================================
// BUILD DE UM GRUPO
// ============================================
function buildItemRow(item) {
    var row = document.createElement('div');
    row.className = 'menu-item-row';
    row.dataset.id = item.id;
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');

    var precos = '';
    if (item.tamanhos.length > 1) {
        for (var t = 0; t < item.tamanhos.length; t++) {
            var tam = item.tamanhos[t];
            precos += '<span class="price-chip"><small>' + esc(tam.label) + '</small>' +
                      '<span class="price">' + fmt(toCents(tam.preco)) + '</span></span>';
        }
    } else {
        precos = '<span class="price">' + fmt(toCents(item.tamanhos[0].preco)) + '</span>';
    }

    row.innerHTML =
        '<div class="menu-item-details">' +
            '<h4>' + esc(item.nome) + '</h4>' +
            (item.desc ? '<p>' + esc(item.desc) + '</p>' : '') +
            '<div class="price-line">' + precos + '</div>' +
        '</div>' +
        '<div class="menu-item-add" aria-hidden="true">+</div>';
    return row;
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

    for (var g = 0; g < data.grupos.length; g++) {
        var grupo = data.grupos[g];
        if (grupo.subtitulo) {
            var sub = document.createElement('div');
            sub.className = 'menu-subtitle';
            sub.textContent = grupo.subtitulo;
            group.appendChild(sub);
        }
        for (var i = 0; i < grupo.itens.length; i++) {
            group.appendChild(buildItemRow(grupo.itens[i]));
        }
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
// CARRINHO (ESTADO)
// ============================================
var carrinho = [];

function cartCount() {
    var n = 0;
    for (var i = 0; i < carrinho.length; i++) n += carrinho[i].qtd;
    return n;
}

function cartTotal() {
    var t = 0;
    for (var i = 0; i < carrinho.length; i++) t += carrinho[i].unitCents * carrinho[i].qtd;
    return t;
}

function atualizarCarrinhoUI() {
    var count = cartCount();
    var total = cartTotal();

    cartBadge.textContent = count;
    cartBadge.classList.toggle('visible', count > 0);

    checkoutSub.textContent = count + (count === 1 ? ' item' : ' itens') + ' · ' + fmt(total);
    checkoutBar.classList.toggle('visible', count > 0);
    appContainer.classList.toggle('has-cart', count > 0);
}

var toastTimer = null;
function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        toastEl.classList.remove('visible');
    }, 2000);
}

// ============================================
// PAINÉIS (ABRIR / FECHAR)
// ============================================
function anySheetOpen() {
    return detailSheet.classList.contains('open') || cartSheet.classList.contains('open') || buildSheet.classList.contains('open');
}

function closeSheets() {
    detailSheet.classList.remove('open');
    cartSheet.classList.remove('open');
    buildSheet.classList.remove('open');
    backdropEl.classList.remove('open');
    appContainer.classList.remove('sheet-open');
}

function openSheet(sheet) {
    detailSheet.classList.remove('open');
    cartSheet.classList.remove('open');
    buildSheet.classList.remove('open');
    sheet.classList.add('open');
    toastEl.classList.remove('visible');
    backdropEl.classList.add('open');
    appContainer.classList.add('sheet-open');
}

backdropEl.addEventListener('click', closeSheets);
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && anySheetOpen()) closeSheets();
});

// ============================================
// PAINEL DE DETALHES DO PEDIDO
// ============================================
var sel = null; // { item, tam, borda, qtd, obs }

function selUnitCents() {
    var c = toCents(sel.item.tamanhos[sel.tam].preco);
    if (sel.item.borda) c += toCents(BORDAS[sel.borda].preco);
    return c;
}

function updateDetailTotals() {
    var btn = detailSheet.querySelector('#btnAdd');
    var qtyEl = detailSheet.querySelector('#qtyValue');
    qtyEl.textContent = sel.qtd;
    btn.querySelector('.add-total').textContent = fmt(selUnitCents() * sel.qtd);
}

function openDetail(itemId) {
    var item = itensPorId[itemId];
    if (!item) return;

    sel = { item: item, tam: 0, borda: 0, qtd: 1, obs: '' };

    var h = '';
    h += '<div class="sheet-handle"></div>';
    h += '<div class="sheet-header">';
    h +=   '<div class="sheet-heading">';
    h +=     '<h3 id="detailTitle">' + esc(item.nome) + '</h3>';
    if (item.desc) h += '<p>' + esc(item.desc) + '</p>';
    h +=   '</div>';
    h +=   '<button type="button" class="sheet-close" data-close aria-label="Fechar">&times;</button>';
    h += '</div>';

    h += '<div class="sheet-body">';

    if (item.tamanhos.length > 1) {
        h += '<div class="opt-title">Tamanho</div><div class="opt-list">';
        for (var t = 0; t < item.tamanhos.length; t++) {
            var tam = item.tamanhos[t];
            h += '<label class="opt">' +
                    '<input type="radio" name="tam" value="' + t + '"' + (t === 0 ? ' checked' : '') + '>' +
                    '<span class="opt-box">' +
                        '<span class="opt-name">' + esc(tam.label) + '</span>' +
                        (tam.info ? '<span class="opt-info">' + esc(tam.info) + '</span>' : '') +
                        '<span class="opt-price">' + fmt(toCents(tam.preco)) + '</span>' +
                    '</span>' +
                 '</label>';
        }
        h += '</div>';
    }

    if (item.borda) {
        h += '<div class="opt-title">Borda <small>cobrada à parte</small></div><div class="opt-list opt-list-2">';
        for (var b = 0; b < BORDAS.length; b++) {
            var bd = BORDAS[b];
            h += '<label class="opt">' +
                    '<input type="radio" name="borda" value="' + b + '"' + (b === 0 ? ' checked' : '') + '>' +
                    '<span class="opt-box">' +
                        '<span class="opt-name">' + esc(bd.nome) + '</span>' +
                        '<span class="opt-price">' + (bd.preco > 0 ? '+ ' + fmt(toCents(bd.preco)) : 'Grátis') + '</span>' +
                    '</span>' +
                 '</label>';
        }
        h += '</div>';
    }

    h += '<div class="opt-title">Observações <small>opcional</small></div>';
    h += '<textarea id="obsInput" class="obs-input" rows="2" maxlength="140" placeholder="Ex.: sem cebola, bem passada..."></textarea>';

    h += '</div>';

    h += '<div class="sheet-footer">';
    h +=   '<div class="qty-stepper">';
    h +=     '<button type="button" data-qty="-1" aria-label="Diminuir quantidade">&minus;</button>';
    h +=     '<span id="qtyValue">1</span>';
    h +=     '<button type="button" data-qty="1" aria-label="Aumentar quantidade">+</button>';
    h +=   '</div>';
    h +=   '<button type="button" class="btn-confirm" id="btnAdd"><span>Adicionar</span><span class="add-total"></span></button>';
    h += '</div>';

    detailSheet.innerHTML = h;
    detailSheet.querySelector('.sheet-body').scrollTop = 0;
    updateDetailTotals();
    openSheet(detailSheet);
}

detailSheet.addEventListener('click', function(e) {
    var closeBtn = e.target.closest('[data-close]');
    if (closeBtn) { closeSheets(); return; }

    var qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn && sel) {
        var novo = sel.qtd + parseInt(qtyBtn.getAttribute('data-qty'), 10);
        if (novo >= 1 && novo <= 99) {
            sel.qtd = novo;
            updateDetailTotals();
        }
        return;
    }

    if (e.target.closest('#btnAdd') && sel) {
        confirmarItem();
    }
});

detailSheet.addEventListener('change', function(e) {
    if (!sel) return;
    var input = e.target;
    if (input.name === 'tam')   { sel.tam   = parseInt(input.value, 10); updateDetailTotals(); }
    if (input.name === 'borda') { sel.borda = parseInt(input.value, 10); updateDetailTotals(); }
});

detailSheet.addEventListener('input', function(e) {
    if (sel && e.target.id === 'obsInput') sel.obs = e.target.value;
});

function confirmarItem() {
    var item = sel.item;
    var tam = item.tamanhos[sel.tam];
    var obs = sel.obs.replace(/\s+/g, ' ').trim();
    var bordaNome = item.borda && sel.borda > 0 ? BORDAS[sel.borda].nome : '';

    var partes = [];
    if (item.tamanhos.length > 1) partes.push(tam.label + (tam.info ? ' (' + tam.info + ')' : ''));
    if (bordaNome) partes.push(bordaNome);

    var key = item.id + '|' + sel.tam + '|' + sel.borda + '|' + obs.toLowerCase();
    var existente = null;
    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].key === key) { existente = carrinho[i]; break; }
    }

    if (existente) {
        existente.qtd = Math.min(99, existente.qtd + sel.qtd);
    } else {
        carrinho.push({
            key: key,
            nome: item.nome,
            detalhes: partes.join(' · '),
            obs: obs,
            qtd: sel.qtd,
            unitCents: selUnitCents()
        });
    }

    var qtdAdicionada = sel.qtd;
    closeSheets();
    atualizarCarrinhoUI();
    showToast('✓ ' + qtdAdicionada + 'x ' + item.nome + ' no carrinho');
    sel = null;
}

// Abrir detalhes ao clicar (ou Enter/Espaço) em um item do cardápio
menuItems.addEventListener('click', function(e) {
    var row = e.target.closest('.menu-item-row');
    if (row) openDetail(row.dataset.id);
});
menuItems.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var row = e.target.closest('.menu-item-row');
    if (row) { e.preventDefault(); openDetail(row.dataset.id); }
});

// ============================================
// PAINEL DO CARRINHO
// ============================================
function renderCart() {
    var h = '';
    h += '<div class="sheet-handle"></div>';
    h += '<div class="sheet-header">';
    h +=   '<div class="sheet-heading"><h3 id="cartTitle">Seu carrinho</h3></div>';
    h +=   '<button type="button" class="sheet-close" data-close aria-label="Fechar">&times;</button>';
    h += '</div>';

    if (carrinho.length === 0) {
        h += '<div class="sheet-body"><div class="cart-empty">Seu carrinho está vazio.<br>Toque em um item do cardápio para começar.</div></div>';
    } else {
        h += '<div class="sheet-body">';
        for (var i = 0; i < carrinho.length; i++) {
            var l = carrinho[i];
            h += '<div class="cart-line">';
            h +=   '<div class="cart-line-info">';
            h +=     '<h4>' + esc(l.nome) + '</h4>';
            if (l.detalhes) h += '<p>' + esc(l.detalhes) + '</p>';
            if (l.obs)      h += '<p class="cart-obs">Obs: ' + esc(l.obs) + '</p>';
            h +=     '<span class="price">' + fmt(l.unitCents * l.qtd) + '</span>';
            h +=   '</div>';
            h +=   '<div class="cart-line-actions">';
            h +=     '<div class="qty-stepper qty-small">';
            h +=       '<button type="button" data-act="dec" data-key="' + esc(l.key) + '" aria-label="Diminuir">&minus;</button>';
            h +=       '<span>' + l.qtd + '</span>';
            h +=       '<button type="button" data-act="inc" data-key="' + esc(l.key) + '" aria-label="Aumentar">+</button>';
            h +=     '</div>';
            h +=     '<button type="button" class="cart-remove" data-act="rem" data-key="' + esc(l.key) + '">Remover</button>';
            h +=   '</div>';
            h += '</div>';
        }
        h += '</div>';
        h += '<div class="sheet-footer sheet-footer-col">';
        h +=   '<div class="cart-total"><span>Total</span><strong>' + fmt(cartTotal()) + '</strong></div>';
        h +=   '<button type="button" class="btn-confirm" id="btnSend"><span>Enviar pedido no WhatsApp</span></button>';
        h += '</div>';
    }

    cartSheet.innerHTML = h;
}

function openCart() {
    renderCart();
    openSheet(cartSheet);
}

function findLine(key) {
    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].key === key) return i;
    }
    return -1;
}

cartSheet.addEventListener('click', function(e) {
    if (e.target.closest('[data-close]')) { closeSheets(); return; }

    var actBtn = e.target.closest('[data-act]');
    if (actBtn) {
        var idx = findLine(actBtn.getAttribute('data-key'));
        if (idx === -1) return;
        var act = actBtn.getAttribute('data-act');
        if (act === 'inc' && carrinho[idx].qtd < 99) carrinho[idx].qtd++;
        if (act === 'dec') {
            carrinho[idx].qtd--;
            if (carrinho[idx].qtd < 1) carrinho.splice(idx, 1);
        }
        if (act === 'rem') carrinho.splice(idx, 1);
        atualizarCarrinhoUI();
        renderCart();
        return;
    }

    if (e.target.closest('#btnSend')) enviarPedido();
});

function enviarPedido() {
    if (carrinho.length === 0) return;

    var msg = '*Novo pedido - Pizzaria Paulista*\n\n';
    for (var i = 0; i < carrinho.length; i++) {
        var l = carrinho[i];
        msg += l.qtd + 'x ' + l.nome;
        if (l.detalhes) msg += ' (' + l.detalhes + ')';
        msg += ' - ' + fmt(l.unitCents * l.qtd) + '\n';
        if (l.obs) msg += '   Obs: ' + l.obs + '\n';
    }
    msg += '\n*Total: ' + fmt(cartTotal()) + '*';

    var url = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');
}

btnCheckout.addEventListener('click', openCart);
btnCart.addEventListener('click', openCart);

// ============================================
// TEMA CLARO / ESCURO (padrão: claro)
// ============================================
var THEME_KEY = 'pizzaria-theme';
var btnTheme  = document.getElementById('btnTheme');

function temaAtual() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    var rotulo = tema === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro';
    btnTheme.setAttribute('aria-label', rotulo);
    btnTheme.setAttribute('title', rotulo);
}

btnTheme.addEventListener('click', function() {
    var novo = temaAtual() === 'dark' ? 'light' : 'dark';
    aplicarTema(novo);
    try { localStorage.setItem(THEME_KEY, novo); } catch (err) {}
});

// ============================================
// MONTE SUA PIZZA / ESFIRRA (combinação de sabores)
// ============================================
// Regra de preço: na combinação de sabores vale o preço do sabor MAIS CARO
// (é o que a referência mostra: Calabresa 48,99 + Toscana 56,99 = Grande 56,99).
var MONTE = {
    pizza:   { nome: 'Pizza',   max: 3, categorias: ['comum', 'doce'], tamanhos: true,  borda: true  },
    esfirra: { nome: 'Esfirra', max: 2, categorias: ['esfirras'],      tamanhos: false, borda: false }
};

// Mesma ordem de item.tamanhos das pizzas (0 = Grande, 1 = Broto)
var BUILD_TAMANHOS = [
    { label: 'Grande', info: '8 pedaços' },
    { label: 'Broto',  info: '4 pedaços' }
];

var FRACOES = { 2: '½', 3: '⅓' };

// Posições (viewBox 200x200) das rodelas desenhadas na pizza
var PEP_DOTS = [
    [58, 52], [88, 34], [142, 52], [165, 100], [140, 138], [112, 166], [58, 142],
    [35, 100], [78, 78], [122, 80], [80, 122], [122, 120], [112, 64]
];

var build = null; // { kind, cfg, sabores, n, picks, tam, borda, qtd, obs }

function coletarSabores(cfg) {
    var lista = [];
    for (var c = 0; c < cfg.categorias.length; c++) {
        var key = cfg.categorias[c];
        var grupos = cardapios[key].grupos;
        for (var g = 0; g < grupos.length; g++) {
            var doce = key === 'doce' || (grupos[g].subtitulo || '').indexOf('Doce') !== -1;
            for (var i = 0; i < grupos[g].itens.length; i++) {
                lista.push({ item: grupos[g].itens[i], doce: doce });
            }
        }
    }
    return lista;
}

// preço (centavos) de um sabor no tamanho escolhido
function buildPrecoSabor(sabor, tam) {
    var t = build.cfg.tamanhos ? tam : 0;
    return toCents(sabor.item.tamanhos[t].preco);
}

// preço base (sem borda) = sabor mais caro entre os escolhidos
function buildBaseCents(tam) {
    var max = 0;
    for (var i = 0; i < build.picks.length; i++) {
        var p = buildPrecoSabor(build.sabores[build.picks[i]], tam);
        if (p > max) max = p;
    }
    return max;
}

function buildUnitCents() {
    var c = buildBaseCents(build.tam);
    if (build.cfg.borda) c += toCents(BORDAS[build.borda].preco);
    return c;
}

function buildTitulo(n) {
    var base = build.cfg.nome;
    if (n === 1) return base + ' de 1 sabor';
    if (n === 2) return base + ' meio a meio';
    return base + ' ' + n + ' sabores';
}

function buildResumo() {
    var partes = [];
    var fr = FRACOES[build.n] || '';
    for (var i = 0; i < build.picks.length; i++) {
        var nome = build.sabores[build.picks[i]].item.nome;
        partes.push(fr ? fr + ' ' + nome : nome);
    }
    return partes.join(' + ');
}

function buildPizzaSVG(n) {
    var s = '<svg class="build-pizza" viewBox="0 0 200 200" aria-hidden="true">';
    s += '<circle class="crust" cx="100" cy="100" r="94"></circle>';
    s += '<circle class="cheese" cx="100" cy="100" r="82"></circle>';
    for (var d = 0; d < PEP_DOTS.length; d++) {
        s += '<circle class="pep" cx="' + PEP_DOTS[d][0] + '" cy="' + PEP_DOTS[d][1] + '" r="6"></circle>';
    }
    if (n > 1) {
        for (var k = 0; k < n; k++) {
            var ang = (-90 + k * 360 / n) * Math.PI / 180;
            var x2 = (100 + 94 * Math.cos(ang)).toFixed(1);
            var y2 = (100 + 94 * Math.sin(ang)).toFixed(1);
            s += '<line class="cut" x1="100" y1="100" x2="' + x2 + '" y2="' + y2 + '"></line>';
        }
    }
    s += '</svg>';
    return s;
}

// desenha as colunas de sabores (uma lista rolável por sabor)
function buildRenderCols() {
    var cols = buildSheet.querySelector('#flavorCols');
    cols.className = 'flavor-cols cols-' + build.n;
    cols.style.gridTemplateColumns = 'repeat(' + build.n + ', minmax(0, 1fr))';

    var h = '';
    for (var c = 0; c < build.n; c++) {
        h += '<div class="flavor-col">';
        if (build.n > 1) h += '<div class="flavor-col-label">Sabor ' + (c + 1) + '</div>';
        h += '<div class="flavor-list" data-col="' + c + '">';
        for (var i = 0; i < build.sabores.length; i++) {
            var s = build.sabores[i];
            h += '<button type="button" class="flavor-item" data-col="' + c + '" data-idx="' + i + '" aria-pressed="false">' +
                    '<span class="f-name">' + esc(s.item.nome) + (s.doce ? '<span class="flavor-tag">Doce</span>' : '') + '</span>' +
                    '<span class="f-price"></span>' +
                 '</button>';
        }
        h += '</div></div>';
    }
    cols.innerHTML = h;
}

// leva cada lista até o sabor selecionado
function buildScrollSelecionados() {
    var listas = buildSheet.querySelectorAll('.flavor-list');
    for (var l = 0; l < listas.length; l++) {
        var selecionado = listas[l].querySelector('.flavor-item.selected');
        if (selecionado) listas[l].scrollTop = Math.max(0, selecionado.offsetTop - 6);
    }
}

// atualiza seleção, preços, desenho, título e totais (sem recriar as listas)
function buildRefresh() {
    var precos = [];
    for (var i = 0; i < build.sabores.length; i++) {
        precos.push(fmt(buildPrecoSabor(build.sabores[i], build.tam)));
    }

    var btns = buildSheet.querySelectorAll('.flavor-item');
    for (var b = 0; b < btns.length; b++) {
        var btn = btns[b];
        var col = parseInt(btn.dataset.col, 10);
        var idx = parseInt(btn.dataset.idx, 10);
        var selecionado = build.picks[col] === idx;
        var ocupado = false;
        for (var k = 0; k < build.picks.length; k++) {
            if (k !== col && build.picks[k] === idx) ocupado = true;
        }
        btn.classList.toggle('selected', selecionado);
        btn.classList.toggle('taken', ocupado);
        btn.setAttribute('aria-pressed', selecionado ? 'true' : 'false');
        btn.querySelector('.f-price').textContent = precos[idx];
    }

    buildSheet.querySelector('#buildTitle').textContent = buildTitulo(build.n);
    buildSheet.querySelector('#buildPizza').innerHTML = buildPizzaSVG(build.n);
    buildSheet.querySelector('#buildLabel').textContent = buildResumo();

    var tamPrecos = buildSheet.querySelectorAll('[data-tam-price]');
    for (var t = 0; t < tamPrecos.length; t++) {
        tamPrecos[t].textContent = fmt(buildBaseCents(parseInt(tamPrecos[t].getAttribute('data-tam-price'), 10)));
    }

    buildSheet.querySelector('#buildQty').textContent = build.qtd;
    buildSheet.querySelector('#btnBuildAdd .add-total').textContent = fmt(buildUnitCents() * build.qtd);
}

// muda a quantidade de sabores mantendo as escolhas já feitas
function buildSetN(n) {
    var novo = [];
    for (var i = 0; i < n; i++) {
        if (i < build.picks.length) {
            novo.push(build.picks[i]);
        } else {
            var livre = 0;
            while (novo.indexOf(livre) !== -1) livre++;
            novo.push(livre);
        }
    }
    build.n = n;
    build.picks = novo;
    buildRenderCols();
    buildRefresh();
    buildScrollSelecionados();
}

function openBuilder(kind) {
    var cfg = MONTE[kind];
    if (!cfg) return;

    var n = Math.min(2, cfg.max);
    build = {
        kind: kind,
        cfg: cfg,
        sabores: coletarSabores(cfg),
        n: n,
        picks: [],
        tam: 0,
        borda: 0,
        qtd: 1,
        obs: ''
    };
    for (var p = 0; p < n; p++) build.picks.push(p);

    var h = '';
    h += '<div class="sheet-handle"></div>';
    h += '<div class="sheet-header">';
    h +=   '<div class="sheet-heading"><h3 id="buildTitle"></h3></div>';
    h +=   '<button type="button" class="sheet-close" data-close aria-label="Fechar">&times;</button>';
    h += '</div>';

    h += '<div class="sheet-body">';
    h += '<div class="build-preview"><div id="buildPizza"></div><div class="build-label" id="buildLabel"></div></div>';

    if (cfg.max > 1) {
        h += '<div class="opt-title">Quantos sabores?</div>';
        h += '<div class="opt-list' + (cfg.max === 3 ? ' opt-list-3' : '') + '">';
        for (var q = 1; q <= cfg.max; q++) {
            h += '<label class="opt">' +
                    '<input type="radio" name="bn" value="' + q + '"' + (q === n ? ' checked' : '') + '>' +
                    '<span class="opt-box"><span class="opt-name">' + q + (q === 1 ? ' sabor' : ' sabores') + '</span></span>' +
                 '</label>';
        }
        h += '</div>';
    }

    h += '<div class="opt-title">Escolha os sabores <small>role a lista</small></div>';
    h += '<div class="flavor-cols" id="flavorCols"></div>';
    h += '<p class="build-note">Na combinação de sabores, vale o preço do sabor mais caro.</p>';

    if (cfg.tamanhos) {
        h += '<div class="opt-title">Tamanho</div><div class="opt-list">';
        for (var t = 0; t < BUILD_TAMANHOS.length; t++) {
            h += '<label class="opt">' +
                    '<input type="radio" name="btam" value="' + t + '"' + (t === 0 ? ' checked' : '') + '>' +
                    '<span class="opt-box">' +
                        '<span class="opt-name">' + esc(BUILD_TAMANHOS[t].label) + '</span>' +
                        '<span class="opt-info">' + esc(BUILD_TAMANHOS[t].info) + '</span>' +
                        '<span class="opt-price" data-tam-price="' + t + '"></span>' +
                    '</span>' +
                 '</label>';
        }
        h += '</div>';
    }

    if (cfg.borda) {
        h += '<div class="opt-title">Borda <small>cobrada à parte</small></div><div class="opt-list opt-list-2">';
        for (var b = 0; b < BORDAS.length; b++) {
            var bd = BORDAS[b];
            h += '<label class="opt">' +
                    '<input type="radio" name="bborda" value="' + b + '"' + (b === 0 ? ' checked' : '') + '>' +
                    '<span class="opt-box">' +
                        '<span class="opt-name">' + esc(bd.nome) + '</span>' +
                        '<span class="opt-price">' + (bd.preco > 0 ? '+ ' + fmt(toCents(bd.preco)) : 'Grátis') + '</span>' +
                    '</span>' +
                 '</label>';
        }
        h += '</div>';
    }

    h += '<div class="opt-title">Observações <small>opcional</small></div>';
    h += '<textarea id="buildObs" class="obs-input" rows="2" maxlength="140" placeholder="Ex.: sem cebola, bem passada..."></textarea>';
    h += '</div>';

    h += '<div class="sheet-footer">';
    h +=   '<div class="qty-stepper">';
    h +=     '<button type="button" data-qty="-1" aria-label="Diminuir quantidade">&minus;</button>';
    h +=     '<span id="buildQty">1</span>';
    h +=     '<button type="button" data-qty="1" aria-label="Aumentar quantidade">+</button>';
    h +=   '</div>';
    h +=   '<button type="button" class="btn-confirm" id="btnBuildAdd"><span>Adicionar</span><span class="add-total"></span></button>';
    h += '</div>';

    buildSheet.innerHTML = h;
    buildSheet.querySelector('.sheet-body').scrollTop = 0;
    buildRenderCols();
    buildRefresh();
    openSheet(buildSheet);
    buildScrollSelecionados();
}

function confirmarMontagem() {
    var cfg = build.cfg;
    var obs = build.obs.replace(/\s+/g, ' ').trim();
    var resumo = buildResumo();
    var nome = build.n === 1 ? cfg.nome + ' ' + resumo : buildTitulo(build.n) + ': ' + resumo;

    var partes = [];
    if (cfg.tamanhos) {
        var tam = BUILD_TAMANHOS[build.tam];
        partes.push(tam.label + ' (' + tam.info + ')');
    }
    if (cfg.borda && build.borda > 0) partes.push(BORDAS[build.borda].nome);

    var ids = [];
    for (var i = 0; i < build.picks.length; i++) ids.push(build.sabores[build.picks[i]].item.id);
    ids.sort();

    var key = 'monte|' + build.kind + '|' + ids.join(',') + '|' + build.tam + '|' + build.borda + '|' + obs.toLowerCase();
    var existente = null;
    for (var j = 0; j < carrinho.length; j++) {
        if (carrinho[j].key === key) { existente = carrinho[j]; break; }
    }

    if (existente) {
        existente.qtd = Math.min(99, existente.qtd + build.qtd);
    } else {
        carrinho.push({
            key: key,
            nome: nome,
            detalhes: partes.join(' · '),
            obs: obs,
            qtd: build.qtd,
            unitCents: buildUnitCents()
        });
    }

    var qtdAdicionada = build.qtd;
    var nomeCurto = cfg.nome;
    closeSheets();
    atualizarCarrinhoUI();
    showToast('✓ ' + qtdAdicionada + 'x ' + nomeCurto + ' no carrinho');
    build = null;
}

buildSheet.addEventListener('click', function(e) {
    if (e.target.closest('[data-close]')) { closeSheets(); return; }
    if (!build) return;

    var flavor = e.target.closest('.flavor-item');
    if (flavor) {
        if (flavor.classList.contains('taken')) return; // já escolhido em outro sabor
        build.picks[parseInt(flavor.dataset.col, 10)] = parseInt(flavor.dataset.idx, 10);
        buildRefresh();
        return;
    }

    var qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn) {
        var novo = build.qtd + parseInt(qtyBtn.getAttribute('data-qty'), 10);
        if (novo >= 1 && novo <= 99) {
            build.qtd = novo;
            buildRefresh();
        }
        return;
    }

    if (e.target.closest('#btnBuildAdd')) confirmarMontagem();
});

buildSheet.addEventListener('change', function(e) {
    if (!build) return;
    var input = e.target;
    if (input.name === 'bn')     buildSetN(parseInt(input.value, 10));
    if (input.name === 'btam')   { build.tam   = parseInt(input.value, 10); buildRefresh(); }
    if (input.name === 'bborda') { build.borda = parseInt(input.value, 10); buildRefresh(); }
});

buildSheet.addEventListener('input', function(e) {
    if (build && e.target.id === 'buildObs') build.obs = e.target.value;
});

// Cards "MONTE SUA PIZZA" / "MONTE SUA ESFIRRA"
var buildCards = document.querySelectorAll('.product-card[data-build]');
for (var bc = 0; bc < buildCards.length; bc++) {
    (function(card) {
        card.addEventListener('click', function() { openBuilder(card.dataset.build); });
        card.addEventListener('keydown', function(e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            openBuilder(card.dataset.build);
        });
    })(buildCards[bc]);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
renderFullMenu();
atualizarCarrinhoUI();
aplicarTema(temaAtual());
