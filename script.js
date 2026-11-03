// ============================================
// VÍDEO DO TOPO (robusto + FALLBACK)
// ============================================
(function() {
    var heroBanner = document.getElementById('heroBanner');
    var heroVideo = document.getElementById('heroVideo');
    if (!heroBanner || !heroVideo) return;

    var tentativas = 0;
    var MAX_TENTATIVAS = 5;
    var aguardandoToque = false;

    function mostrarFallback() { heroBanner.classList.add('video-error'); }
    function mostrarVideo()    { heroBanner.classList.remove('video-error'); }

    // Tenta tocar o vídeo (autoplay pode ser bloqueado por economia de dados/bateria)
    function tocar() {
        // Alguns navegadores só liberam autoplay se "muted" estiver setado via JS também
        heroVideo.muted = true;
        heroVideo.defaultMuted = true;
        heroVideo.setAttribute('muted', '');
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');
        if (!heroVideo.paused && !heroVideo.ended) return;
        var p;
        try { p = heroVideo.play(); } catch (e) { p = null; }
        if (p && typeof p.catch === 'function') {
            p.catch(function() { aguardarToque(); });
        }
    }

    // Se o navegador bloqueou o autoplay, tenta de novo no primeiro toque/rolagem
    function aguardarToque() {
        if (aguardandoToque) return;
        aguardandoToque = true;
        var eventos = ['touchstart', 'click', 'scroll', 'keydown'];
        function liberar() {
            aguardandoToque = false;
            for (var i = 0; i < eventos.length; i++) {
                document.removeEventListener(eventos[i], liberar, true);
            }
            tocar();
        }
        for (var i = 0; i < eventos.length; i++) {
            document.addEventListener(eventos[i], liberar, true);
        }
    }

    // Recarrega o vídeo se houve erro de rede/decodificação (até MAX_TENTATIVAS)
    function recarregar() {
        if (tentativas >= MAX_TENTATIVAS) return;
        tentativas++;
        setTimeout(function() {
            try { heroVideo.load(); } catch (e) {}
            tocar();
        }, 1500 * tentativas);
    }

    function aoErro() {
        mostrarFallback();
        recarregar();
    }

    heroVideo.addEventListener('error', aoErro, true);

    var sourceEl = heroVideo.querySelector('source');
    if (sourceEl) {
        sourceEl.addEventListener('error', aoErro);
    }

    // Vídeo rodando de verdade: garante que ele apareça (remove o fallback)
    heroVideo.addEventListener('playing', mostrarVideo);
    heroVideo.addEventListener('canplay', function() {
        if (heroVideo.readyState >= 3) mostrarVideo();
        tocar();
    });
    heroVideo.addEventListener('loadedmetadata', tocar);

    // O navegador pausou o vídeo sozinho (aba em segundo plano, modo de economia): retoma
    heroVideo.addEventListener('pause', function() {
        if (!heroVideo.ended && !document.hidden) setTimeout(tocar, 200);
    });
    // Navegadores sem suporte correto a loop
    heroVideo.addEventListener('ended', function() {
        try { heroVideo.currentTime = 0; } catch (e) {}
        tocar();
    });
    // Travou/encerrou o buffer: tenta retomar
    heroVideo.addEventListener('stalled', function() { setTimeout(tocar, 500); });
    heroVideo.addEventListener('emptied', function() { setTimeout(tocar, 500); });

    // Voltou para a aba / voltou pelo histórico (bfcache)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) tocar();
    });
    window.addEventListener('pageshow', tocar);

    // Sem nenhum dado após alguns segundos (conexão lenta ou formato não suportado): mostra a imagem de fundo
    setTimeout(function() {
        if (heroVideo.readyState === 0 && heroVideo.networkState === 3) {
            mostrarFallback();
        }
    }, 4000);
    setTimeout(function() {
        if (heroVideo.readyState < 2) mostrarFallback();
    }, 8000);

    tocar();
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

    // Registra o delivery na cozinha e mostra a tela de sucesso (atendimento.js)
    if (typeof paulistaRegistrarDelivery === 'function') paulistaRegistrarDelivery(carrinho);
    if (typeof paulistaMostrarSucesso === 'function') {
        paulistaMostrarSucesso({ url: url, itens: cartCount(), total: cartTotal() });
    }
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

// ============================================
// ATENDIMENTO: SUCESSO COM CONFETE + PAINEL (GARÇOM / COZINHA)
// ============================================
// =====================================================================
// atendimento.js
//  1) Tela de sucesso (bege no tema claro / preta no escuro) + confete,
//     exibida depois que o pedido é enviado para o WhatsApp.
//  2) Botão secreto no texto "paulista" -> senha -> painel de atendimento:
//       - NOVO PEDIDO: o garçom cria o pedido da mesa (mesa + cliente +
//         cardápio idêntico ao do site) e envia para a cozinha.
//       - COZINHA: recebe os pedidos do salão e também os de delivery.
//
// Depende do script.js (carrinho, cardápio, painéis). Carregar DEPOIS dele.
// =====================================================================
(function () {
    'use strict';

    // -----------------------------------------------------------------
    // CONFIGURAÇÕES
    // -----------------------------------------------------------------
    var SENHA_ATENDIMENTO = 'paulistaatendimento';
    var TOQUES_SECRETOS   = 3;      // toques seguidos no "paulista" (use 1 para abrir com um único toque)
    var LONGPRESS_MS      = 900;    // OU segurar o dedo no "paulista" por esse tempo
    var JANELA_TOQUES_MS  = 3000;   // tempo máximo para completar os toques
    var MAX_ERROS_SENHA   = 5;
    var BLOQUEIO_MS       = 30000;

    // '' = pedidos ficam só neste aparelho/navegador (localStorage).
    // Para a cozinha receber pedidos de OUTROS aparelhos (celular do garçom,
    // celular do cliente no delivery), informe a URL de um Firebase Realtime
    // Database, ex.: 'https://SEU-PROJETO-default-rtdb.firebaseio.com'
    var PAINEL_DB_URL     = '';

    var CHAVE_PEDIDOS     = 'paulista-pedidos';
    var VALIDADE_MS       = 24 * 60 * 60 * 1000;  // pedidos com mais de 24h somem da lista
    var SYNC_MS           = 3000;

    // -----------------------------------------------------------------
    // UTILITÁRIOS
    // -----------------------------------------------------------------
    function $(sel, raiz) { return (raiz || document).querySelector(sel); }

    function criarEl(tag, classe, html) {
        var el = document.createElement(tag);
        if (classe) el.className = classe;
        if (html !== undefined) el.innerHTML = html;
        return el;
    }

    function somaQtd(itens) {
        var n = 0;
        for (var i = 0; i < itens.length; i++) n += itens[i].qtd;
        return n;
    }

    function somaTotal(itens) {
        var t = 0;
        for (var i = 0; i < itens.length; i++) t += itens[i].unitCents * itens[i].qtd;
        return t;
    }

    function novoId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function haQuanto(ts) {
        var min = Math.floor((Date.now() - ts) / 60000);
        if (min < 1) return 'agora';
        if (min < 60) return 'há ' + min + ' min';
        var h = Math.floor(min / 60);
        var m = min % 60;
        return 'há ' + h + 'h' + (m ? ' ' + m + 'min' : '');
    }

    // Altura real da tela (corrige botões escondidos atrás da barra do navegador / teclado)
    // e posição das camadas (painel, sucesso, senha), que ficam FORA do container que rola.
    function posicionarCamadas() {
        var r = appContainer.getBoundingClientRect();
        var st = document.documentElement.style;
        st.setProperty('--at-x', Math.round(r.left) + 'px');
        st.setProperty('--at-y', Math.round(r.top) + 'px');
        st.setProperty('--at-w', Math.round(r.width) + 'px');
        st.setProperty('--at-h', Math.round(r.height) + 'px');
    }

    function ajustarAltura() {
        var vv = window.visualViewport;
        var h = Math.round(vv ? vv.height : window.innerHeight);
        document.documentElement.style.setProperty('--at-vh', h + 'px');
        posicionarCamadas();
    }

    window.addEventListener('resize', ajustarAltura);
    window.addEventListener('orientationchange', function () { setTimeout(ajustarAltura, 200); });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', ajustarAltura);
        window.visualViewport.addEventListener('scroll', posicionarCamadas);
    }
    ajustarAltura();

    // Trava a rolagem do site enquanto uma camada (painel, modal, sucesso) está aberta
    var travas = 0;
    function travar() {
        if (travas === 0) appContainer.classList.add('at-travado');
        travas++;
    }
    function destravar() {
        travas = Math.max(0, travas - 1);
        if (travas === 0) appContainer.classList.remove('at-travado');
    }

    // Normaliza texto para comparar/buscar (sem acento, minúsculo)
    function norm(s) {
        s = String(s === undefined || s === null ? '' : s).toLowerCase();
        if (s.normalize) s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return s.replace(/\s+/g, ' ').trim();
    }

    // -----------------------------------------------------------------
    // PEDIDOS: modelo + armazenamento (local ou Firebase REST)
    // -----------------------------------------------------------------
    // pedido = { id, tipo:'mesa'|'delivery', mesa, cliente, itens:[{nome,detalhes,obs,qtd,unitCents}],
    //            total, status:'novo'|'preparando'|'pronto'|'entregue', criado, atualizado }

    function copiarLinhas(linhas, rodada) {
        var itens = [];
        for (var i = 0; i < linhas.length; i++) {
            itens.push({
                nome: linhas[i].nome,
                detalhes: linhas[i].detalhes || '',
                obs: linhas[i].obs || '',
                qtd: linhas[i].qtd,
                unitCents: linhas[i].unitCents,
                rodada: rodada
            });
        }
        return itens;
    }

    // numero = "Pedido N" (definido ao salvar); rodada = quantas vezes itens foram enviados
    // para este pedido (a cozinha destaca os itens da rodada mais nova); pago = mesa liberada.
    function criarPedido(tipo, linhas, extra) {
        var itens = copiarLinhas(linhas, 1);
        var agora = Date.now();
        return {
            id: novoId(),
            tipo: tipo,
            numero: null,
            mesa: (extra && extra.mesa) || '',
            cliente: (extra && extra.cliente) || '',
            itens: itens,
            total: somaTotal(itens),
            status: 'novo',
            pago: false,
            rodada: 1,
            criado: agora,
            atualizado: agora
        };
    }

    // "Mesa 5", "mesa 05" e "5" são a mesma mesa
    function chaveMesa(mesa) {
        var m = norm(mesa).replace(/\bmesa\b/g, '').replace(/[^a-z0-9 ]/g, '').trim();
        if (/^\d+$/.test(m)) m = String(parseInt(m, 10));
        return m;
    }

    // pedido de salão ainda NÃO pago da mesma mesa (o mais recente)
    function acharAberto(lista, mesa) {
        var chave = chaveMesa(mesa);
        var achado = null;
        for (var i = 0; i < lista.length; i++) {
            var p = lista[i];
            if (p.tipo === 'mesa' && !p.pago && chaveMesa(p.mesa) === chave) {
                if (!achado || p.criado > achado.criado) achado = p;
            }
        }
        return achado;
    }

    function proximoNumero(lista) {
        var max = 0;
        for (var i = 0; i < lista.length; i++) {
            if ((lista[i].numero || 0) > max) max = lista[i].numero;
        }
        return max + 1;
    }

    function juntarClientes(atual, novo) {
        if (!novo) return atual;
        if (!atual) return novo;
        var nomes = atual.split(', ');
        for (var i = 0; i < nomes.length; i++) {
            if (norm(nomes[i]) === norm(novo)) return atual;
        }
        return atual + ', ' + novo;
    }

    // Cria o pedido da mesa OU soma ao pedido aberto da mesma mesa.
    // cb(ok, pedido, somou)
    function registrarPedidoMesa(mesa, cliente, linhas, cb) {
        var copia = copiarLinhas(linhas, 1); // copia agora: o carrinho é esvaziado depois
        DB.listar(function (lista, erro) {
            if (erro || !lista) { cb(false); return; }
            var aberto = acharAberto(lista, mesa);
            var pedido;
            var agora = Date.now();
            if (aberto) {
                pedido = aberto;
                var rodada = (pedido.rodada || 1) + 1;
                for (var i = 0; i < copia.length; i++) {
                    copia[i].rodada = rodada;
                    pedido.itens.push(copia[i]);
                }
                pedido.rodada = rodada;
                pedido.total = somaTotal(pedido.itens);
                pedido.status = 'novo'; // volta para a fila da cozinha
                pedido.cliente = juntarClientes(pedido.cliente, cliente);
                pedido.atualizado = agora;
            } else {
                pedido = {
                    id: novoId(),
                    tipo: 'mesa',
                    numero: proximoNumero(lista),
                    mesa: mesa,
                    cliente: cliente,
                    itens: copia,
                    total: somaTotal(copia),
                    status: 'novo',
                    pago: false,
                    rodada: 1,
                    criado: agora,
                    atualizado: agora
                };
            }
            meus[pedido.id] = pedido.rodada;
            vistos[pedido.id] = pedido.rodada;
            DB.salvar(pedido, function (ok) { cb(ok, pedido, !!aberto); });
        });
    }

    function podar(lista) {
        var limite = Date.now() - VALIDADE_MS;
        var saida = [];
        for (var i = 0; i < lista.length; i++) {
            if (lista[i] && lista[i].id && lista[i].criado > limite) saida.push(lista[i]);
        }
        return saida;
    }

    function lerLocal() {
        try {
            var bruto = localStorage.getItem(CHAVE_PEDIDOS);
            var lista = bruto ? JSON.parse(bruto) : [];
            return Array.isArray(lista) ? podar(lista) : [];
        } catch (e) { return []; }
    }

    function gravarLocal(lista) {
        try { localStorage.setItem(CHAVE_PEDIDOS, JSON.stringify(lista)); return true; }
        catch (e) { return false; }
    }

    var DB = {
        nuvem: function () { return !!PAINEL_DB_URL; },

        url: function (caminho) {
            return PAINEL_DB_URL.replace(/\/+$/, '') + caminho + '.json';
        },

        // cb(lista, erro)
        listar: function (cb) {
            if (!DB.nuvem()) { cb(lerLocal(), false); return; }
            fetch(DB.url('/pedidos'), { cache: 'no-store' })
                .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
                .then(function (obj) {
                    var lista = [];
                    if (obj) {
                        for (var k in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k]) lista.push(obj[k]);
                        }
                    }
                    cb(podar(lista), false);
                })
                .catch(function () { cb(null, true); });
        },

        // cb(ok)
        salvar: function (pedido, cb) {
            if (!DB.nuvem()) {
                var lista = lerLocal();
                var achou = false;
                for (var i = 0; i < lista.length; i++) {
                    if (lista[i].id === pedido.id) { lista[i] = pedido; achou = true; break; }
                }
                if (!achou) lista.push(pedido);
                var ok = gravarLocal(lista);
                if (cb) cb(ok);
                return;
            }
            fetch(DB.url('/pedidos/' + encodeURIComponent(pedido.id)), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            })
                .then(function (r) { if (cb) cb(r.ok); })
                .catch(function () { if (cb) cb(false); });
        },

        // cb(ok)
        remover: function (id, cb) {
            if (!DB.nuvem()) {
                var lista = lerLocal();
                var nova = [];
                for (var i = 0; i < lista.length; i++) {
                    if (lista[i].id !== id) nova.push(lista[i]);
                }
                var ok = gravarLocal(nova);
                if (cb) cb(ok);
                return;
            }
            fetch(DB.url('/pedidos/' + encodeURIComponent(id)), { method: 'DELETE' })
                .then(function (r) { if (cb) cb(r.ok); })
                .catch(function () { if (cb) cb(false); });
        }
    };

    // Chamado pelo script.js quando o cliente envia o pedido pelo site (delivery).
    // Delivery não soma com outros: cada envio é um pedido novo.
    window.paulistaRegistrarDelivery = function (linhas) {
        try {
            if (!linhas || !linhas.length) return;
            var pedido = criarPedido('delivery', linhas, null); // copia os itens agora
            DB.listar(function (lista, erro) {
                if (!erro && lista) pedido.numero = proximoNumero(lista);
                DB.salvar(pedido);
            });
        } catch (e) {}
    };

    // -----------------------------------------------------------------
    // 1) TELA DE SUCESSO + CONFETE
    // -----------------------------------------------------------------
    var sucessoEl = null;
    var sucessoAberto = false;
    var foiOculto = false;

    var CORES_CONFETE = ['#9c3a3a', '#d9301c', '#ffc65c', '#d9923f', '#4f9d4f', '#f4e6d0', '#ffffff', '#e85d75', '#3f8fd9'];
    var cf = { cv: null, ctx: null, parts: [], raf: 0, quadros: 0, larg: 0, alt: 0 };

    function cfDimensionar() {
        if (!cf.cv) return;
        var r = cf.cv.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        cf.cv.width  = Math.max(1, Math.round(r.width * dpr));
        cf.cv.height = Math.max(1, Math.round(r.height * dpr));
        cf.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cf.larg = r.width;
        cf.alt  = r.height;
    }

    function cfPeca(x, y, vx, vy) {
        return {
            x: x, y: y, vx: vx, vy: vy,
            w: 6 + Math.random() * 7,
            h: 4 + Math.random() * 6,
            rot: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.35,
            fase: Math.random() * Math.PI * 2,
            cor: CORES_CONFETE[Math.floor(Math.random() * CORES_CONFETE.length)],
            redondo: Math.random() < 0.22
        };
    }

    // dois "canhões" nos cantos de baixo
    function cfExplosao() {
        var i, ang, vel;
        for (i = 0; i < 60; i++) {
            ang = -Math.PI * (0.17 + Math.random() * 0.26);
            vel = 11 + Math.random() * 9;
            cf.parts.push(cfPeca(0, cf.alt * 0.96, Math.cos(ang) * vel, Math.sin(ang) * vel));
            cf.parts.push(cfPeca(cf.larg, cf.alt * 0.96, -Math.cos(ang) * vel, Math.sin(ang) * vel));
        }
    }

    // chuva vinda do topo
    function cfChuva() {
        for (var i = 0; i < 3; i++) {
            cf.parts.push(cfPeca(Math.random() * cf.larg, -12, (Math.random() - 0.5) * 2, 1.5 + Math.random() * 2.5));
        }
    }

    function cfLaco() {
        cf.raf = requestAnimationFrame(cfLaco);
        cf.quadros++;

        // contagem por QUADROS (não por tempo): se a aba ficar em segundo plano
        // (ex.: usuário foi para o WhatsApp), o confete espera e roda na volta.
        if (cf.quadros === 1 || cf.quadros === 50) cfExplosao();
        if (cf.quadros < 140 && cf.quadros % 2 === 0) cfChuva();

        var ctx = cf.ctx;
        ctx.clearRect(0, 0, cf.larg, cf.alt);

        var vivos = [];
        for (var i = 0; i < cf.parts.length; i++) {
            var p = cf.parts[i];
            p.vy += 0.3;
            p.vx *= 0.992;
            p.vy *= 0.992;
            p.fase += 0.09;
            p.x += p.vx + Math.sin(p.fase) * 0.7;
            p.y += p.vy;
            p.rot += p.vr;

            if (p.y > cf.alt + 20) continue;
            vivos.push(p);

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.scale(1, Math.cos(p.fase));
            ctx.fillStyle = p.cor;
            if (p.redondo) {
                ctx.beginPath();
                ctx.arc(0, 0, p.w / 2.2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }
            ctx.restore();
        }
        cf.parts = vivos;

        if (cf.quadros > 140 && cf.parts.length === 0) cfParar();
    }

    function cfParar() {
        if (cf.raf) cancelAnimationFrame(cf.raf);
        cf.raf = 0;
        cf.parts = [];
        if (cf.ctx) cf.ctx.clearRect(0, 0, cf.larg, cf.alt);
    }

    function cfIniciar() {
        if (!cf.cv) return;
        cfParar();
        cfDimensionar();
        cf.quadros = 0;
        cf.raf = requestAnimationFrame(cfLaco);
    }

    function montarSucesso() {
        if (sucessoEl) return;

        sucessoEl = criarEl('div', 'at-sucesso');
        sucessoEl.setAttribute('role', 'dialog');
        sucessoEl.setAttribute('aria-modal', 'true');
        sucessoEl.setAttribute('aria-labelledby', 'atSucessoTitulo');
        sucessoEl.innerHTML =
            '<canvas class="at-confete" id="atConfete"></canvas>' +
            '<div class="at-sucesso-conteudo">' +
                '<div class="at-check" aria-hidden="true">' +
                    '<svg viewBox="0 0 52 52"><circle class="at-check-c" cx="26" cy="26" r="24"></circle>' +
                    '<path class="at-check-p" d="M14 27l8 8 16-17"></path></svg>' +
                '</div>' +
                '<h2 class="at-sucesso-titulo" id="atSucessoTitulo">Seu pedido foi encaminhado com sucesso!</h2>' +
                '<p class="at-sucesso-texto">Obrigado pela preferência! A confirmação e o pagamento seguem pelo WhatsApp da pizzaria.</p>' +
                '<div class="at-sucesso-resumo" id="atSucessoResumo"></div>' +
                '<a class="at-sucesso-zap" id="atSucessoZap" target="_blank" rel="noopener">Abrir o WhatsApp novamente</a>' +
                '<button type="button" class="btn-confirm at-btn-centro" id="atSucessoVoltar">Voltar ao cardápio</button>' +
            '</div>';
        document.body.appendChild(sucessoEl);

        cf.cv  = $('#atConfete', sucessoEl);
        cf.ctx = cf.cv.getContext('2d');

        $('#atSucessoVoltar', sucessoEl).addEventListener('click', fecharSucesso);

        window.addEventListener('resize', function () { if (sucessoAberto) cfDimensionar(); });
    }

    function fecharSucesso() {
        if (!sucessoAberto) return;
        sucessoAberto = false;
        sucessoEl.classList.remove('open');
        cfParar();
        // o pedido já foi enviado: esvazia o carrinho para um novo pedido
        carrinho.length = 0;
        atualizarCarrinhoUI();
        destravar();
    }

    // info = { url, itens, total }
    window.paulistaMostrarSucesso = function (info) {
        montarSucesso();
        closeSheets();

        var zap = $('#atSucessoZap', sucessoEl);
        zap.href = info.url;
        $('#atSucessoResumo', sucessoEl).textContent =
            info.itens + (info.itens === 1 ? ' item' : ' itens') + ' · ' + fmt(info.total);

        ajustarAltura();
        if (!sucessoAberto) travar();
        sucessoAberto = true;
        foiOculto = document.hidden;
        sucessoEl.classList.add('open');
        cfIniciar();
    };

    // Voltou do WhatsApp (aba/app voltou a ficar visível): nova rodada de confete
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { if (sucessoAberto) foiOculto = true; return; }
        if (sucessoAberto && foiOculto) { foiOculto = false; cfIniciar(); }
    });

    // -----------------------------------------------------------------
    // 2) BOTÃO SECRETO + SENHA
    // -----------------------------------------------------------------
    var modalEl = null;
    var modalInput = null;
    var modalErro = null;
    var modalAberto = false;
    var modalAbertoEm = 0;
    var errosSenha = 0;
    var bloqueadoAte = 0;

    function montarModal() {
        if (modalEl) return;
        modalEl = criarEl('div', 'at-modal');
        modalEl.setAttribute('role', 'dialog');
        modalEl.setAttribute('aria-modal', 'true');
        modalEl.setAttribute('aria-labelledby', 'atModalTitulo');
        modalEl.innerHTML =
            '<div class="at-modal-card" id="atModalCard">' +
                '<h3 id="atModalTitulo">Área de atendimento</h3>' +
                '<input type="password" id="atSenha" class="obs-input" placeholder="Senha" ' +
                    'autocomplete="new-password" autocapitalize="off" autocorrect="off" spellcheck="false">' +
                '<p class="at-erro" id="atSenhaErro" role="alert"></p>' +
                '<div class="at-modal-botoes">' +
                    '<button type="button" class="at-btn-sec" id="atSenhaCancelar">Cancelar</button>' +
                    '<button type="button" class="btn-confirm at-btn-centro" id="atSenhaEntrar">Entrar</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modalEl);

        modalInput = $('#atSenha', modalEl);
        modalErro  = $('#atSenhaErro', modalEl);

        $('#atSenhaCancelar', modalEl).addEventListener('click', fecharModal);
        $('#atSenhaEntrar', modalEl).addEventListener('click', tentarEntrar);
        modalInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); tentarEntrar(); }
        });
        modalEl.addEventListener('click', function (e) {
            if (e.target === modalEl && Date.now() - modalAbertoEm > 400) fecharModal();
        });
    }

    function pedirSenha() {
        if (modalAberto || painelAberto) return;
        montarModal();
        ajustarAltura();
        travar();
        modalAbertoEm = Date.now();
        modalAberto = true;
        modalInput.value = '';
        modalErro.textContent = '';
        modalEl.classList.add('open');
        setTimeout(function () { modalInput.focus(); }, 60);
    }

    function fecharModal() {
        if (!modalAberto) return;
        modalAberto = false;
        modalEl.classList.remove('open');
        modalInput.blur();
        destravar();
    }

    function tentarEntrar() {
        var agora = Date.now();
        if (agora < bloqueadoAte) {
            modalErro.textContent = 'Muitas tentativas. Aguarde alguns segundos.';
            return;
        }
        if (modalInput.value.trim().toLowerCase() === SENHA_ATENDIMENTO.toLowerCase()) {
            errosSenha = 0;
            fecharModal();
            abrirPainel();
            return;
        }
        errosSenha++;
        if (errosSenha >= MAX_ERROS_SENHA) {
            errosSenha = 0;
            bloqueadoAte = agora + BLOQUEIO_MS;
            modalErro.textContent = 'Muitas tentativas. Aguarde 30 segundos.';
        } else {
            modalErro.textContent = 'Senha incorreta.';
        }
        modalInput.value = '';
        var card = $('#atModalCard', modalEl);
        card.classList.remove('shake');
        void card.offsetWidth; // reinicia a animação
        card.classList.add('shake');
    }

    (function ligarBotaoSecreto() {
        var marca = $('.brand-text');
        if (!marca) return;
        var toques = [];
        var timerLongo = null;

        function contarToque() {
            var agora = Date.now();
            toques = toques.filter(function (t) { return agora - t < JANELA_TOQUES_MS; });
            toques.push(agora);
            if (toques.length >= TOQUES_SECRETOS) {
                toques = [];
                pedirSenha();
            }
        }

        // navegadores sem pointer events: cai no clique comum
        if (!window.PointerEvent) {
            marca.addEventListener('click', contarToque);
            return;
        }

        function cancelarLongo() {
            if (timerLongo) { clearTimeout(timerLongo); timerLongo = null; }
        }

        // Toque curto (soltar antes do tempo) conta; segurar abre direto.
        marca.addEventListener('pointerdown', function () {
            cancelarLongo();
            timerLongo = setTimeout(function () {
                timerLongo = null;
                toques = [];
                pedirSenha();
            }, LONGPRESS_MS);
        });
        marca.addEventListener('pointerup', function () {
            if (timerLongo) { cancelarLongo(); contarToque(); }
        });
        marca.addEventListener('pointercancel', cancelarLongo);
        marca.addEventListener('pointerleave', cancelarLongo);
        marca.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    })();

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalAberto) fecharModal();
    });

    // -----------------------------------------------------------------
    // 3) PAINEL DE ATENDIMENTO
    // -----------------------------------------------------------------
    var painelEl = null;
    var painelAberto = false;
    var stashCarrinho = [];      // carrinho do cliente, guardado enquanto o painel está aberto
    var timerSync = null;
    var menuMontado = false;
    var menuAtivo = null;        // categoria filtrada no cardápio do painel
    var ficha = { mesa: '', cliente: '' };
    var enviando = false;

    var estado = { lista: [], sig: '', carregou: false, filtro: 'todos', busca: '' };
    var vistos = {};
    var meus = {};

    var ROTULO_STATUS = { novo: 'Na fila', preparando: 'Preparando', pronto: 'Pronto', entregue: 'Entregue' };
    var ROTULO_ACAO   = { novo: 'Iniciar preparo', preparando: 'Marcar pronto', pronto: 'Entregue' };
    var PROXIMO       = { novo: 'preparando', preparando: 'pronto', pronto: 'entregue' };
    var ORDEM_STATUS  = { novo: 0, preparando: 1, pronto: 2, entregue: 3 };

    var VIEWS_FLUXO = { dados: true, cardapio: true, resumo: true };

    function montarPainel() {
        if (painelEl) return;

        painelEl = criarEl('div', 'at-painel');
        painelEl.setAttribute('role', 'dialog');
        painelEl.setAttribute('aria-modal', 'true');
        painelEl.setAttribute('aria-label', 'Painel de atendimento');
        painelEl.innerHTML =
            '<div class="at-tabs">' +
                '<button type="button" class="at-tab active" data-tab="novo">Novo pedido</button>' +
                '<button type="button" class="at-tab" data-tab="cozinha">Cozinha <span class="at-tab-badge" id="atBadgeCozinha"></span></button>' +
            '</div>' +
            '<div class="at-sub">' +
                '<span class="at-sub-titulo">paulista · atendimento</span>' +
                '<span class="at-rede" id="atRede"></span>' +
                '<button type="button" class="at-sair" id="atSair">Sair</button>' +
            '</div>' +

            // --- aba NOVO PEDIDO (lista do salão + botão +)
            '<section class="at-view active" data-view="novo">' +
                '<div class="at-busca"><div class="search-box">' +
                    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
                    '<input type="search" id="atBusca" placeholder="Buscar por mesa ou cliente..." autocomplete="off">' +
                '</div></div>' +
                '<div class="at-corpo"><div id="atListaSalao"></div></div>' +
                '<button type="button" class="at-fab" id="atFab" aria-label="Criar novo pedido">' +
                    '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="3" x2="12" y2="21"></line><line x1="3" y1="12" x2="21" y2="12"></line></svg>' +
                '</button>' +
            '</section>' +

            // --- aba COZINHA
            '<section class="at-view" data-view="cozinha">' +
                '<div class="at-filtros" id="atFiltros"></div>' +
                '<div class="at-corpo"><div id="atListaCozinha"></div></div>' +
            '</section>' +

            // --- fluxo: dados da mesa
            '<section class="at-view" data-view="dados">' +
                '<div class="at-flow-head"><button type="button" class="at-voltar" data-voltar="novo">&lsaquo; Cancelar</button><h3>Novo pedido</h3></div>' +
                '<div class="at-corpo at-corpo-flow">' +
                    '<div class="opt-title">Mesa</div>' +
                    '<input type="text" id="atMesa" class="obs-input" maxlength="30" placeholder="Ex.: Mesa 5" autocomplete="off">' +
                    '<p class="at-dica" id="atDicaMesa"></p>' +
                    '<div class="opt-title">Cliente</div>' +
                    '<input type="text" id="atCliente" class="obs-input" maxlength="40" placeholder="Nome do cliente" autocomplete="off">' +
                    '<p class="at-erro" id="atErroDados" role="alert"></p>' +
                '</div>' +
                '<div class="sheet-footer"><button type="button" class="btn-confirm at-btn-centro" id="atIrCardapio">Abrir cardápio</button></div>' +
            '</section>' +

            // --- fluxo: cardápio
            '<section class="at-view" data-view="cardapio">' +
                '<div class="at-flow-head"><button type="button" class="at-voltar" data-voltar="dados">&lsaquo; Voltar</button><h3 id="atTituloPedido"></h3></div>' +
                '<div class="at-corpo at-corpo-menu" id="atCorpoMenu"></div>' +
                '<div class="sheet-footer"><button type="button" class="btn-confirm" id="atVerPedido" disabled>' +
                    '<span id="atBarraTitulo">Escolha os itens</span><span id="atBarraSub"></span></button></div>' +
            '</section>' +

            // --- fluxo: resumo + enviar
            '<section class="at-view" data-view="resumo">' +
                '<div class="at-flow-head"><button type="button" class="at-voltar" data-voltar="cardapio">&lsaquo; Cardápio</button><h3>Resumo do pedido</h3></div>' +
                '<div class="at-corpo at-corpo-flow" id="atResumoCorpo"></div>' +
                '<div class="sheet-footer"><button type="button" class="btn-confirm at-btn-centro" id="atEnviarCozinha">Enviar para a cozinha</button></div>' +
            '</section>';

        document.body.appendChild(painelEl);
        ligarEventosPainel();
        setRede(DB.nuvem() ? 'online' : 'local');
    }

    function setRede(modo) {
        var el = $('#atRede');
        if (!el) return;
        el.className = 'at-rede at-rede-' + modo;
        el.textContent = modo === 'local' ? 'só neste aparelho' : (modo === 'online' ? 'online' : 'sem conexão');
    }

    function irPara(view) {
        var secoes = painelEl.querySelectorAll('.at-view');
        for (var i = 0; i < secoes.length; i++) {
            secoes[i].classList.toggle('active', secoes[i].getAttribute('data-view') === view);
        }
        var tabs = painelEl.querySelectorAll('.at-tab');
        for (var t = 0; t < tabs.length; t++) {
            tabs[t].classList.toggle('active', tabs[t].getAttribute('data-tab') === view);
        }
        painelEl.classList.toggle('at-fluxo', !!VIEWS_FLUXO[view]);
        if (view === 'resumo') renderResumo();
        var corpo = painelEl.querySelector('.at-view.active .at-corpo');
        if (corpo && !VIEWS_FLUXO[view]) corpo.scrollTop = corpo.scrollTop; // mantém posição
    }

    function viewAtual() {
        var a = painelEl.querySelector('.at-view.active');
        return a ? a.getAttribute('data-view') : '';
    }

    function abrirPainel() {
        montarPainel();
        ajustarAltura();
        closeSheets();
        stashCarrinho = carrinho.splice(0, carrinho.length);
        atualizarCarrinhoUI();
        travar();
        appContainer.classList.add('at-aberto');
        painelAberto = true;
        painelEl.classList.add('open');
        irPara('novo');
        estado.carregou = false;
        sincronizar(true);
        clearInterval(timerSync);
        timerSync = setInterval(function () { sincronizar(false); }, SYNC_MS);
    }

    function fecharPainel() {
        if (!painelAberto) return;
        clearInterval(timerSync);
        timerSync = null;
        painelAberto = false;
        painelEl.classList.remove('open');
        appContainer.classList.remove('at-aberto');
        closeSheets();
        carrinho.length = 0;
        Array.prototype.push.apply(carrinho, stashCarrinho);
        stashCarrinho = [];
        atualizarCarrinhoUI();
        destravar();
    }

    // ----- sincronização / render das listas -----
    function sincronizar(forcar) {
        DB.listar(function (lista, erro) {
            if (!painelAberto) return;
            if (erro) { setRede('offline'); return; }
            setRede(DB.nuvem() ? 'online' : 'local');
            avisarNovos(lista);
            var sig = JSON.stringify(lista);
            if (forcar || sig !== estado.sig) {
                estado.lista = lista;
                estado.sig = sig;
                renderTudo();
            } else {
                atualizarHoras();
            }
        });
    }

    function avisarNovos(lista) {
        var i, p, r, antes, novos = [];
        for (i = 0; i < lista.length; i++) {
            p = lista[i];
            r = p.rodada || 1;
            antes = vistos[p.id];
            if (antes === undefined || r > antes) {
                vistos[p.id] = r;
                // avisa pedidos novos e itens somados em pedidos existentes (exceto os feitos neste aparelho)
                if (estado.carregou && p.status === 'novo' && !(meus[p.id] >= r)) novos.push({ p: p, somou: antes !== undefined });
            }
        }
        estado.carregou = true;
        if (novos.length) {
            beep();
            var n0 = novos[0];
            var rotulo = n0.p.tipo === 'delivery' ? 'Delivery' : n0.p.mesa;
            showToast('🍕 ' + (n0.somou ? 'Itens novos: ' : 'Novo pedido: ') + rotulo + (novos.length > 1 ? ' (+' + (novos.length - 1) + ')' : ''));
        }
    }

    function beep() {
        try {
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            var ctx = new AC();
            var osc = ctx.createOscillator();
            var gan = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 880;
            gan.gain.value = 0.15;
            osc.connect(gan);
            gan.connect(ctx.destination);
            osc.start();
            setTimeout(function () { try { osc.stop(); ctx.close(); } catch (e) {} }, 280);
        } catch (e) {}
    }

    function achar(id) {
        for (var i = 0; i < estado.lista.length; i++) {
            if (estado.lista[i].id === id) return estado.lista[i];
        }
        return null;
    }

    function numeroTxt(p) {
        return p.numero ? 'Pedido ' + p.numero : 'Pedido #' + p.id.slice(-4).toUpperCase();
    }

    function tituloPedido(p) {
        if (p.tipo === 'delivery') {
            return '<span class="at-tag at-tag-delivery">Delivery</span><strong>' + esc(numeroTxt(p)) + '</strong>';
        }
        return '<span class="at-tag at-tag-mesa">Salão</span><strong>' + esc(numeroTxt(p)) + '</strong>' +
               '<small>' + esc(p.mesa) + (p.cliente ? ' · ' + esc(p.cliente) : '') + '</small>';
    }

    function itensHtml(p) {
        var rod = p.rodada || 1;
        var h = '<ul class="at-itens">';
        for (var i = 0; i < p.itens.length; i++) {
            var it = p.itens[i];
            var r = it.rodada || 1;
            var marca = '';
            var cls = '';
            if (rod > 1) {
                if (r === rod) marca = '<span class="at-tag at-tag-novo">novo</span>';
                else { cls = ' class="at-item-antigo"'; marca = '<span class="at-tag at-tag-ant">anterior</span>'; }
            }
            h += '<li' + cls + '><span class="at-qtd">' + it.qtd + 'x</span><div><b>' + esc(it.nome) + '</b>' + marca +
                 (it.detalhes ? '<small>' + esc(it.detalhes) + '</small>' : '') +
                 (it.obs ? '<em>Obs: ' + esc(it.obs) + '</em>' : '') +
                 '</div></li>';
        }
        return h + '</ul>';
    }

    function renderCozinha() {
        var ativos = [];
        var i;
        for (i = 0; i < estado.lista.length; i++) {
            if (estado.lista[i].status !== 'entregue') ativos.push(estado.lista[i]);
        }
        var nMesa = 0, nDel = 0;
        for (i = 0; i < ativos.length; i++) {
            if (ativos[i].tipo === 'delivery') nDel++; else nMesa++;
        }

        var f = estado.filtro;
        var filtros = [
            { k: 'todos',    r: 'Todos',    n: ativos.length },
            { k: 'mesa',     r: 'Salão',    n: nMesa },
            { k: 'delivery', r: 'Delivery', n: nDel }
        ];
        var hf = '';
        for (i = 0; i < filtros.length; i++) {
            hf += '<button type="button" class="at-chip' + (f === filtros[i].k ? ' active' : '') + '" data-filtro="' + filtros[i].k + '">' +
                  filtros[i].r + ' <span>' + filtros[i].n + '</span></button>';
        }
        $('#atFiltros').innerHTML = hf;

        var lista = ativos.filter(function (p) { return f === 'todos' || p.tipo === f; });
        lista.sort(function (a, b) {
            if (ORDEM_STATUS[a.status] !== ORDEM_STATUS[b.status]) return ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status];
            return a.criado - b.criado;
        });

        var h = '';
        if (!lista.length) {
            h = '<div class="at-vazio">Nenhum pedido na fila.<br>Tudo em dia! 🍕</div>';
        }
        for (i = 0; i < lista.length; i++) {
            var p = lista[i];
            h += '<article class="at-pedido at-st-' + p.status + '" data-id="' + esc(p.id) + '">' +
                    '<header class="at-pedido-topo">' +
                        '<div class="at-pedido-titulo">' + tituloPedido(p) + '</div>' +
                        '<span class="at-hora" data-t="' + p.criado + '">' + haQuanto(p.criado) + '</span>' +
                    '</header>' +
                    '<div class="at-status-linha"><span class="at-status">' + ROTULO_STATUS[p.status] + '</span>' +
                        '<span class="at-total">' + somaQtd(p.itens) + (somaQtd(p.itens) === 1 ? ' item' : ' itens') + ' · ' + fmt(p.total) + '</span></div>' +
                    itensHtml(p) +
                    '<footer class="at-acoes">' +
                        '<button type="button" class="at-btn-sec" data-acao="cancelar">Cancelar</button>' +
                        '<button type="button" class="btn-confirm at-btn-centro at-btn-acao" data-acao="avancar">' + ROTULO_ACAO[p.status] + '</button>' +
                    '</footer>' +
                 '</article>';
        }
        $('#atListaCozinha').innerHTML = h;
    }

    function linhaSalao(p) {
        var qtd = somaQtd(p.itens);
        var botoes = '';
        if (!p.pago) {
            if (p.status === 'pronto') botoes += '<button type="button" class="at-btn-mini" data-acao="avancar">Entregue</button>';
            botoes += '<button type="button" class="at-btn-mini at-btn-pago" data-acao="pago">Pago</button>';
        }
        var status = p.pago
            ? '<span class="at-status at-status-pago">Pago</span>'
            : '<span class="at-status">' + ROTULO_STATUS[p.status] + '</span>';
        return '<div class="at-linha-salao at-st-' + p.status + (p.pago ? ' at-pago' : '') + '" data-id="' + esc(p.id) + '">' +
                '<div class="at-linha-info">' +
                    '<div class="at-pedido-titulo"><strong>' + esc(numeroTxt(p)) + '</strong>' +
                        '<small>' + esc(p.mesa) + (p.cliente ? ' · ' + esc(p.cliente) : '') + '</small></div>' +
                    '<div class="at-linha-sub">' + qtd + (qtd === 1 ? ' item' : ' itens') + ' · ' + fmt(p.total) +
                        ' · <span class="at-hora" data-t="' + p.criado + '">' + haQuanto(p.criado) + '</span></div>' +
                '</div>' +
                '<div class="at-linha-dir">' + status + botoes + '</div>' +
            '</div>';
    }

    function renderSalao() {
        var termo = norm(estado.busca);
        var lista = estado.lista.filter(function (p) { return p.tipo === 'mesa'; });
        var total = lista.length;
        if (termo) {
            lista = lista.filter(function (p) {
                return norm(p.mesa + ' ' + p.cliente + ' pedido ' + (p.numero || '')).indexOf(termo) !== -1;
            });
        }
        var abertos = lista.filter(function (p) { return !p.pago; });
        var pagos   = lista.filter(function (p) { return p.pago; });
        function porNumero(a, b) { return ((a.numero || 0) - (b.numero || 0)) || (a.criado - b.criado); }
        abertos.sort(porNumero);
        pagos.sort(porNumero);

        var h = '';
        var i;
        if (!lista.length) {
            if (termo) h = '<div class="at-vazio">Nenhum pedido encontrado para <b>' + esc(estado.busca.trim()) + '</b>.</div>';
            else if (!total) h = '<div class="at-vazio">Nenhum pedido do salão ainda.<br>Toque em <b>+</b> para criar um novo pedido.</div>';
        }
        if (abertos.length) {
            h += '<div class="at-grupo">Em andamento <span>' + abertos.length + '</span></div>';
            for (i = 0; i < abertos.length; i++) h += linhaSalao(abertos[i]);
        }
        if (pagos.length) {
            h += '<div class="at-grupo at-grupo-pagos">Pagos <span>' + pagos.length + '</span></div>';
            for (i = 0; i < pagos.length; i++) h += linhaSalao(pagos[i]);
        }
        $('#atListaSalao').innerHTML = h;
    }

    function renderBadge() {
        var n = 0;
        for (var i = 0; i < estado.lista.length; i++) {
            if (estado.lista[i].status === 'novo' || estado.lista[i].status === 'preparando') n++;
        }
        $('#atBadgeCozinha').textContent = n ? String(n) : '';
    }

    function renderTudo() {
        renderSalao();
        renderCozinha();
        renderBadge();
    }

    function atualizarHoras() {
        var els = painelEl.querySelectorAll('.at-hora[data-t]');
        for (var i = 0; i < els.length; i++) {
            els[i].textContent = haQuanto(parseInt(els[i].getAttribute('data-t'), 10));
        }
    }

    // Relê o pedido no armazenamento, confere o status esperado e grava a mudança.
    // cb(ok, jaMudou)
    function atualizarPedido(id, esperado, mudar, cb) {
        DB.listar(function (lista, erro) {
            if (erro || !lista) { cb(false, false); return; }
            var alvo = null;
            for (var i = 0; i < lista.length; i++) {
                if (lista[i].id === id) { alvo = lista[i]; break; }
            }
            if (!alvo) { cb(false, true); return; }
            if (esperado && alvo.status !== esperado) { cb(false, true); return; }
            mudar(alvo);
            alvo.atualizado = Date.now();
            DB.salvar(alvo, function (ok) { cb(ok, false); });
        });
    }

    function acaoPedido(id, acao) {
        var p = achar(id);
        if (!p) return;

        if (acao === 'cancelar') {
            if (!window.confirm('Cancelar o ' + numeroTxt(p) + ' inteiro?')) return;
            DB.remover(id, function () { sincronizar(true); });
            return;
        }

        if (acao === 'pago') {
            if (!window.confirm('Marcar ' + p.mesa + ' como PAGO? A mesa ficará livre para novos clientes.')) return;
            atualizarPedido(id, null, function (x) { x.pago = true; x.pagoEm = Date.now(); }, function (ok) {
                if (!ok) showToast('Não foi possível atualizar o pedido.');
                sincronizar(true);
            });
            return;
        }

        var atual = p.status;
        var prox = PROXIMO[atual];
        if (!prox) return;
        atualizarPedido(id, atual, function (x) { x.status = prox; }, function (ok, jaMudou) {
            if (!ok) showToast(jaMudou ? 'Esse pedido já foi atualizado.' : 'Não foi possível atualizar o pedido.');
            sincronizar(true);
        });
    }

    // ----- cardápio dentro do painel (clona o visual do site) -----
    function montarCardapio() {
        if (menuMontado) return;
        menuMontado = true;

        var corpo = $('#atCorpoMenu');

        var cats = $('.categories').cloneNode(true);
        cats.id = 'atCats';
        cats.style.animation = 'none';
        var cc = cats.querySelectorAll('.cat-card');
        for (var i = 0; i < cc.length; i++) cc[i].classList.remove('active');

        var cards = $('#mainCards').cloneNode(true);
        cards.id = 'atMainCards';
        cards.classList.remove('hidden');
        cards.style.display = '';

        var divisor = criarEl('div', 'divider');
        divisor.id = 'atDivider';

        var menu = criarEl('div', 'menu-section');
        menu.innerHTML = '<div id="atMenuItems"></div>';

        var envoltorio = criarEl('div', 'at-menu-wrap');
        envoltorio.appendChild(cards);
        envoltorio.appendChild(divisor);
        envoltorio.appendChild(menu);

        corpo.appendChild(cats);
        corpo.appendChild(envoltorio);

        // categorias
        cats.addEventListener('click', function (e) {
            var c = e.target.closest('.cat-card');
            if (!c) return;
            var alvo = c.getAttribute('data-target');
            menuAtivo = (menuAtivo === alvo) ? null : alvo;
            var todos = cats.querySelectorAll('.cat-card');
            for (var k = 0; k < todos.length; k++) {
                todos[k].classList.toggle('active', todos[k].getAttribute('data-target') === menuAtivo);
            }
            renderMenuPainel();
        });

        // MONTE SUA PIZZA / ESFIRRA
        cards.addEventListener('click', function (e) {
            var c = e.target.closest('.product-card[data-build]');
            if (c) openBuilder(c.getAttribute('data-build'));
        });
        cards.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            var c = e.target.closest('.product-card[data-build]');
            if (c) { e.preventDefault(); openBuilder(c.getAttribute('data-build')); }
        });

        // itens do cardápio -> painel de detalhes do site
        var itens = $('#atMenuItems');
        itens.addEventListener('click', function (e) {
            var row = e.target.closest('.menu-item-row');
            if (row) openDetail(row.dataset.id);
        });
        itens.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            var row = e.target.closest('.menu-item-row');
            if (row) { e.preventDefault(); openDetail(row.dataset.id); }
        });

        renderMenuPainel();
    }

    function renderMenuPainel() {
        var cont = $('#atMenuItems');
        var cards = $('#atMainCards');
        var div = $('#atDivider');
        cont.innerHTML = '';
        if (menuAtivo) {
            cards.style.display = 'none';
            div.style.display = 'none';
            var g = buildMenuGroup(menuAtivo);
            if (g) cont.appendChild(g);
        } else {
            cards.style.display = '';
            div.style.display = '';
            for (var i = 0; i < ORDEM_CATEGORIAS.length; i++) {
                var gr = buildMenuGroup(ORDEM_CATEGORIAS[i]);
                if (gr) cont.appendChild(gr);
            }
        }
    }

    // barra inferior do cardápio + resumo (acompanham o carrinho)
    function atualizarBarra() {
        if (!painelEl) return;
        var n = cartCount();
        var btn = $('#atVerPedido');
        btn.disabled = (n === 0);
        $('#atBarraTitulo').textContent = n ? 'Ver pedido' : 'Escolha os itens';
        $('#atBarraSub').textContent = n ? n + (n === 1 ? ' item' : ' itens') + ' · ' + fmt(cartTotal()) : '';
        if (painelAberto && viewAtual() === 'resumo') {
            if (carrinho.length === 0) irPara('cardapio'); else renderResumo();
        }
    }

    function renderResumo() {
        var corpo = $('#atResumoCorpo');
        var aberto = acharAberto(estado.lista, ficha.mesa);
        var h = '<div class="at-resumo-ficha"><strong>' + esc(ficha.mesa) + '</strong> · ' + esc(ficha.cliente) +
                (aberto ? '<div class="at-dica">Será somado ao ' + esc(numeroTxt(aberto)) + ' desta mesa.</div>' : '') + '</div>';
        for (var i = 0; i < carrinho.length; i++) {
            var l = carrinho[i];
            h += '<div class="cart-line">' +
                    '<div class="cart-line-info">' +
                        '<h4>' + esc(l.nome) + '</h4>' +
                        (l.detalhes ? '<p>' + esc(l.detalhes) + '</p>' : '') +
                        (l.obs ? '<p class="cart-obs">Obs: ' + esc(l.obs) + '</p>' : '') +
                        '<span class="price">' + fmt(l.unitCents * l.qtd) + '</span>' +
                    '</div>' +
                    '<div class="cart-line-actions">' +
                        '<div class="qty-stepper qty-small">' +
                            '<button type="button" data-act="dec" data-key="' + esc(l.key) + '" aria-label="Diminuir">&minus;</button>' +
                            '<span>' + l.qtd + '</span>' +
                            '<button type="button" data-act="inc" data-key="' + esc(l.key) + '" aria-label="Aumentar">+</button>' +
                        '</div>' +
                        '<button type="button" class="cart-remove" data-act="rem" data-key="' + esc(l.key) + '">Remover</button>' +
                    '</div>' +
                 '</div>';
        }
        h += '<div class="cart-total at-resumo-total"><span>Total</span><strong>' + fmt(cartTotal()) + '</strong></div>';
        corpo.innerHTML = h;
    }

    function acharLinha(key) {
        for (var i = 0; i < carrinho.length; i++) {
            if (carrinho[i].key === key) return i;
        }
        return -1;
    }

    function enviarParaCozinha() {
        if (enviando || carrinho.length === 0) return;
        enviando = true;
        var btn = $('#atEnviarCozinha');
        btn.disabled = true;

        registrarPedidoMesa(ficha.mesa, ficha.cliente, carrinho, function (ok, pedido, somou) {
            enviando = false;
            btn.disabled = false;
            if (!ok) {
                showToast('Falha ao enviar. Tente novamente.');
                return;
            }
            carrinho.length = 0;
            atualizarCarrinhoUI();
            ficha = { mesa: '', cliente: '' };
            irPara('novo');
            sincronizar(true);
            showToast(somou ? '✓ Itens somados ao ' + numeroTxt(pedido) : '✓ ' + numeroTxt(pedido) + ' enviado para a cozinha');
        });
    }

    function atualizarDicaMesa() {
        var el = $('#atDicaMesa');
        if (!el) return;
        var mesa = $('#atMesa').value;
        var aberto = mesa.trim() ? acharAberto(estado.lista, mesa) : null;
        el.textContent = aberto
            ? 'Esta mesa já tem o ' + numeroTxt(aberto) + ' em aberto. Os novos itens serão somados a ele.'
            : '';
    }

    function descartarPedidoAtual() {
        carrinho.length = 0;
        atualizarCarrinhoUI();
        ficha = { mesa: '', cliente: '' };
    }

    function ligarEventosPainel() {
        // abas
        $('.at-tabs', painelEl).addEventListener('click', function (e) {
            var t = e.target.closest('.at-tab');
            if (t) irPara(t.getAttribute('data-tab'));
        });

        // sair
        $('#atSair', painelEl).addEventListener('click', function () {
            if (carrinho.length && !window.confirm('Há um pedido em andamento. Sair e descartar?')) return;
            fecharPainel();
        });

        // botão +
        $('#atFab', painelEl).addEventListener('click', function () {
            descartarPedidoAtual();
            $('#atMesa').value = '';
            $('#atCliente').value = '';
            $('#atErroDados').textContent = '';
            atualizarDicaMesa();
            irPara('dados');
            setTimeout(function () { $('#atMesa').focus(); }, 80);
        });

        // dados -> cardápio
        $('#atIrCardapio', painelEl).addEventListener('click', function () {
            var mesa = $('#atMesa').value.replace(/\s+/g, ' ').trim();
            var cliente = $('#atCliente').value.replace(/\s+/g, ' ').trim();
            if (!mesa)    { $('#atErroDados').textContent = 'Informe a mesa.';    $('#atMesa').focus();    return; }
            if (!cliente) { $('#atErroDados').textContent = 'Informe o cliente.'; $('#atCliente').focus(); return; }
            ficha = { mesa: mesa, cliente: cliente };
            $('#atTituloPedido').textContent = mesa + ' · ' + cliente;
            montarCardapio();
            atualizarBarra();
            irPara('cardapio');
        });
        painelEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && (e.target.id === 'atMesa' || e.target.id === 'atCliente')) {
                e.preventDefault();
                $('#atIrCardapio').click();
            }
        });

        // botões "voltar"
        painelEl.addEventListener('click', function (e) {
            var v = e.target.closest('[data-voltar]');
            if (!v) return;
            var destino = v.getAttribute('data-voltar');
            if (destino === 'novo' && carrinho.length && !window.confirm('Descartar este pedido?')) return;
            if (destino === 'novo') descartarPedidoAtual();
            irPara(destino);
        });

        // cardápio -> resumo
        $('#atVerPedido', painelEl).addEventListener('click', function () {
            if (carrinho.length) irPara('resumo');
        });

        // resumo: +, -, remover
        $('#atResumoCorpo', painelEl).addEventListener('click', function (e) {
            var b = e.target.closest('[data-act]');
            if (!b) return;
            var idx = acharLinha(b.getAttribute('data-key'));
            if (idx === -1) return;
            var act = b.getAttribute('data-act');
            if (act === 'inc' && carrinho[idx].qtd < 99) carrinho[idx].qtd++;
            if (act === 'dec') {
                carrinho[idx].qtd--;
                if (carrinho[idx].qtd < 1) carrinho.splice(idx, 1);
            }
            if (act === 'rem') carrinho.splice(idx, 1);
            atualizarCarrinhoUI(); // dispara atualizarBarra -> renderResumo
        });

        $('#atEnviarCozinha', painelEl).addEventListener('click', enviarParaCozinha);

        // busca na lista de pedidos do salão
        $('#atBusca', painelEl).addEventListener('input', function (e) {
            estado.busca = e.target.value;
            renderSalao();
        });

        // aviso quando a mesa digitada já tem pedido em aberto
        $('#atMesa', painelEl).addEventListener('input', atualizarDicaMesa);

        // filtros da cozinha
        $('#atFiltros', painelEl).addEventListener('click', function (e) {
            var c = e.target.closest('[data-filtro]');
            if (!c) return;
            estado.filtro = c.getAttribute('data-filtro');
            renderCozinha();
        });

        // ações nos pedidos (cozinha e salão)
        function aoClicarAcao(e) {
            var b = e.target.closest('[data-acao]');
            if (!b) return;
            var linha = b.closest('[data-id]');
            if (linha) acaoPedido(linha.getAttribute('data-id'), b.getAttribute('data-acao'));
        }
        $('#atListaCozinha', painelEl).addEventListener('click', aoClicarAcao);
        $('#atListaSalao', painelEl).addEventListener('click', aoClicarAcao);
    }

    // Mantém a barra do painel em dia sempre que o carrinho muda (script.js chama esta função)
    var atualizarOriginal = window.atualizarCarrinhoUI;
    window.atualizarCarrinhoUI = function () {
        atualizarOriginal.apply(this, arguments);
        atualizarBarra();
    };
})();
