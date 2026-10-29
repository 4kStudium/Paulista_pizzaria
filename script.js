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
    return detailSheet.classList.contains('open') || cartSheet.classList.contains('open');
}

function closeSheets() {
    detailSheet.classList.remove('open');
    cartSheet.classList.remove('open');
    backdropEl.classList.remove('open');
    appContainer.classList.remove('sheet-open');
}

function openSheet(sheet) {
    detailSheet.classList.remove('open');
    cartSheet.classList.remove('open');
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
// INICIALIZAÇÃO
// ============================================
renderFullMenu();
atualizarCarrinhoUI();
