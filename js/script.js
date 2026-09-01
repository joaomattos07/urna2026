let seuVotoPara = document.querySelector('.d-1-1 span');
let cargo = document.querySelector('.d-1-2 span');
let descricao = document.querySelector('.d-1-4');
let aviso = document.querySelector('.d-2');
let lateral = document.querySelector('.d-1-right');
let numeros = document.querySelector('.d-1-3');
let somNumero = new Audio('audio/numeros.mp3');
let somCorrige = new Audio('audio/corrige.mp3');
let somConfirma = new Audio('audio/confirma.mp3');

let etapaAtual = 0;
let numero = '';
let votoBranco = false;
let votos = [];

function tocarSom(audio) {
    audio.currentTime = 0;
    audio.play().catch(function () {
    });
}

function comecarEtapa() {
    let etapa = etapas[etapaAtual];
    let numeroHTML = '';
    numero = '';
    votoBranco = false;

    for (let i = 0; i < etapa.numeros; i++) {
        numeroHTML += i === 0 ? '<div class="numero pisca"></div>' : '<div class="numero"></div>';
    }

    seuVotoPara.style.display = 'none';
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'none';
    lateral.innerHTML = '';
    numeros.innerHTML = numeroHTML;
}

function atualizaInterface() {
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter(item => item.numero === numero);
    if (candidato.length > 0) {
        candidato = candidato[0];
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}`;
        lateral.innerHTML = candidato.fotos.map(foto => `
            <div class="d-1-image ${foto.small ? 'small' : ''}">
                <img src="Images/${foto.url}" alt="" />
                ${foto.legenda}
            </div>`).join('');
    } else {
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>';
    }
}

function clicou(n) {
    let elNumero = document.querySelector('.numero.pisca');
    if (elNumero !== null) {
        tocarSom(somNumero);
        elNumero.innerHTML = n;
        numero += n;
        elNumero.classList.remove('pisca');
        if (elNumero.nextElementSibling !== null) {
            elNumero.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface();
        }
    }
}

function branco() {
    numero = '';
    votoBranco = true;
    seuVotoPara.style.display = 'block';
    aviso.style.display = 'block';
    numeros.innerHTML = '';
    descricao.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>';
    lateral.innerHTML = '';
}

function corrige() {
    tocarSom(somCorrige);
    comecarEtapa();
}

function confirma() {
    let etapa = etapas[etapaAtual];
    let votoConfirmado = false;

    if (votoBranco === true) {
        votoConfirmado = true;
        votos.push({ etapa: etapas[etapaAtual].titulo, voto: 'branco' });
    } else if (numero.length === etapa.numeros) {
        votoConfirmado = true;
        votos.push({ etapa: etapas[etapaAtual].titulo, voto: numero });
    }

    if (votoConfirmado) {
        tocarSom(somConfirma);
        etapaAtual++;
        if (etapas[etapaAtual] !== undefined) {
            comecarEtapa();
        } else {
            document.querySelector('.tela').innerHTML = '<div class="aviso--gigante pisca">FIM</div>';
        }
    }
}

document.querySelectorAll('.teclado--botao[data-numero]').forEach(function (botao) {
    botao.addEventListener('click', function () {
        clicou(botao.dataset.numero);
    });
});

document.getElementById('btn-branco').addEventListener('click', branco);
document.getElementById('btn-corrige').addEventListener('click', corrige);
document.getElementById('btn-confirma').addEventListener('click', confirma);

comecarEtapa();

function montarLegenda() {
    let container = document.getElementById('legenda-conteudo');
    if (!container) return;

    container.innerHTML = etapas.map(function (etapa) {
        let linhas = etapa.candidatos.map(function (c) {
            return '<tr><td>' + c.numero + '</td><td>' + c.nome +
                (c.partido ? ' — ' + c.partido : '') + '</td></tr>';
        }).join('');

        return '<div class="legenda-etapa"><strong>' + etapa.titulo +
            '</strong><table>' + linhas + '</table></div>';
    }).join('');
}

montarLegenda();
