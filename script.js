document.addEventListener('DOMContentLoaded', function() {
    // Configura data atual
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    document.getElementById('data').value = todayFormatted;

    // Foco no primeiro campo
    document.getElementById('nome').focus();

    // Ajuste para mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.querySelectorAll('select').forEach(select => {
            select.style.fontSize = '16px';
        });
    }

    // Mostrar/ocultar campos conforme seleções
    document.getElementById('destino').addEventListener('change', function() {
        const outroDestinoField = document.getElementById('outroDestino');
        const nomeEventoField = document.getElementById('nomeEvento');
        outroDestinoField.style.display = this.value === 'Outro' ? 'block' : 'none';
        nomeEventoField.style.display = this.value ? 'block' : 'none';
        if (this.value !== 'Outro') outroDestinoField.value = '';
    });

    document.getElementById('carro').addEventListener('change', function() {
        const carroSelecionado = this.value;
        const placaSelect = document.getElementById('placa');

        // Mapeamento de carros para placas
        const mapeamentoPlacas = {
            'Sandero': 'EMR4C04',
            'Spin': 'FKE9857',
            'BYD 63': 'TLB5B63',
            'BYD 04': 'TLF1C04',
            'BYD 08': '',
            'Doblo-41': 'RNM2A41',
            'Doblo-98': 'RNZ9E98',
            'Saveiro': 'GBK4A85',
            'Carens': 'ENJ2154',
            'IVECO - DELIVERY-19': 'TJY1I19',
            'IVECO - DELIVERY-57': 'TJQ5E57',
            'IVECO - DELIVERY-83': 'TJV1H83',
            'IVECO - DELIVERY-35': 'TJV1C35',
            'VUC-12': 'GIT4J12',
            'VUC-69': 'DYJ5A69'
        };

        if (mapeamentoPlacas[carroSelecionado]) {
            placaSelect.value = mapeamentoPlacas[carroSelecionado];
        } else {
            placaSelect.selectedIndex = 0;
        }

        // Mostrar/ocultar campos específicos
        const isBYD = carroSelecionado === 'BYD 63' || carroSelecionado === 'BYD 04' || carroSelecionado === 'BYD 08';
        document.getElementById('combustivel-group').classList.toggle('hidden', isBYD);
        document.getElementById('bateria-group').classList.toggle('hidden', !isBYD);

        const isCaminhao = carroSelecionado === 'Caminhão';
        document.getElementById('modelo-group').classList.toggle('hidden', !isCaminhao);
        if (!isCaminhao) document.getElementById('modelo').selectedIndex = 0;

        // Atualiza rodízio quando o carro muda
        atualizarRodizio();
    });

    document.getElementById('modelo').addEventListener('change', function() {
        const modeloSelecionado = this.value;
        const placaSelect = document.getElementById('placa');
        const mapeamentoModeloPlaca = {
            'IVECO - DELIVERY-19': 'TJY1I19',
            'IVECO - DELIVERY-57': 'TJQ5E57',
            'IVECO - DELIVERY-83': 'TJV1H83',
            'IVECO - DELIVERY-35': 'TJV1C35',
            'VUC-12': 'GIT4J12',
            'VUC-69': 'DYJ5A69'
        };

        if (mapeamentoModeloPlaca[modeloSelecionado]) {
            placaSelect.value = mapeamentoModeloPlaca[modeloSelecionado];
        }

        // Atualiza rodízio quando o modelo muda
        atualizarRodizio();
    });

    document.getElementById('placa').addEventListener('change', function() {
        atualizarRodizio();
    });

    // Atualização do visualizador de bateria
    const batterySlider = document.getElementById('bateria');
    const batteryFill = document.getElementById('batteryFill');
    batterySlider.addEventListener('input', function() {
        const value = this.value;
        batteryFill.style.width = value + '%';
        batteryFill.textContent = value + '%';
        batteryFill.style.backgroundColor = getBatteryColor(value);
    });

    function getBatteryColor(percent) {
        // Cores intermediárias entre vermelho e verde
        const redStart = 255, greenStart = 102, blueStart = 102;  // #FF6666
        const redEnd = 102, greenEnd = 255, blueEnd = 102;        // #66FF66

        const p = percent / 100;
        const r = Math.round(redStart + (redEnd - redStart) * p);
        const g = Math.round(greenStart + (greenEnd - greenStart) * p);
        const b = Math.round(blueStart + (blueEnd - blueStart) * p);

        return `rgb(${r}, ${g}, ${b})`;
    }

    document.getElementById('pneu').addEventListener('change', function() {
        const obsPneuField = document.getElementById('obsPneu');
        obsPneuField.style.display = this.value === 'Atenção necessária' ? 'block' : 'none';
    });

    // Evento de submit
    document.getElementById('formViagem').addEventListener('submit', function(event) {
        event.preventDefault();

        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.classList.add('loading');

        setTimeout(() => {
            salvarRegistro();
            submitBtn.classList.remove('loading');
        }, 500);
    });

    document.getElementById('copyBtn').addEventListener('click', copiarMensagem);

    // Exibe vídeo de susto para Leandro
    document.getElementById('nome').addEventListener('change', function() {
        if (this.value === 'Leandro') {
            mostrarVideoSusto();
        }
    });
});

function mostrarVideoSusto() {
    // Cria o elemento de overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.95)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    // Cria o elemento de vídeo
    const video = document.createElement('video');
    video.src = 'susto/susto_leandro.mp4';
    video.autoplay = true;
    video.controls = false;
    video.style.maxWidth = '100vw';
    video.style.maxHeight = '100vh';
    video.style.background = 'black';

    // Fecha o overlay ao terminar o vídeo ou ao clicar
    video.addEventListener('ended', () => document.body.removeChild(overlay));
    overlay.addEventListener('click', () => document.body.removeChild(overlay));

    overlay.appendChild(video);
    document.body.appendChild(overlay);
    video.play();
}

function salvarRegistro() {
    const form = document.getElementById('formViagem');

    // Obter valores
    const nome = form.nome.value;
    const carro = form.carro.value;
    const placa = form.placa.value || 'Não informado';
    const rodizio = form.rodizio.value || 'Não se aplica';
    const destino = form.destino.value === 'Outro' ? form.outroDestino.value : form.destino.value;
    const nomeEvento = form.nomeEvento.value || 'Não informado';
    const km = form.km.value;
    const pneu = form.pneu.value === 'Atenção necessária' ? 
                 `${form.pneu.value} (${form.obsPneu.value})` : form.pneu.value;

    const isBYD = carro.includes('BYD');
    const combustivelOuBateria = isBYD ? 
        `Bateria: ${form.bateria.value}%` : 
        `Combustível: ${form.combustivel.value || 'Não informado'}`;

    const cartao = form.cartao.value || 'Não informado';
    const higiene = form.higiene.value || 'Não informado';
    const carrinho = form.carrinho.value || 'Não informado';

    // Formatar data
    const dataParts = form.data.value.split('-');
    const dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;

    // Modelo do caminhão se aplicável
    const modelo = carro === 'Caminhão' ? `MODELO: ${form.modelo.value || 'Não informado'}\n` : '';

    // Montar resultado
    const resultadoTexto = `NOME: ${nome}\nCARRO: ${carro}\n${modelo}PLACA: ${placa}\nRODÍZIO: ${rodizio}\nDESTINO: ${destino}\nNOME DO EVENTO: ${nomeEvento}\nKM: ${km}\nPNEU: ${pneu}\n${combustivelOuBateria}\nCARTÃO: ${cartao}\nHIGIENE: ${higiene}\nCARRINHO: ${carrinho}\nDATA: ${dataFormatada}`;

    // Exibir resultado
    document.getElementById('resultado').textContent = resultadoTexto;
    const resultadoContainer = document.getElementById('resultadoContainer');
    resultadoContainer.style.display = 'block';
    resultadoContainer.scrollIntoView({ behavior: 'smooth' });
}

function copiarMensagem() {
    const resultadoTexto = document.getElementById('resultado').textContent;
    const textarea = document.createElement('textarea');
    textarea.value = resultadoTexto;
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        const copyBtn = document.getElementById('copyBtn');
        copyBtn.textContent = '✓ COPIADO!';
        copyBtn.style.backgroundColor = '#087849';

        setTimeout(() => {
            copyBtn.textContent = 'COPIAR MENSAGEM';
            copyBtn.style.backgroundColor = '';
        }, 2000);
    } catch (err) {
        console.error('Erro ao copiar:', err);
    }

    document.body.removeChild(textarea);
}
