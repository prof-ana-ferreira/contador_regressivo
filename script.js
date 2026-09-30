/* =========================================================
   ELEMENTOS DA PÁGINA
========================================================= */

const elementos = {
  dataAtual: document.getElementById("dataAtual"),

  dias: document.getElementById("diasRestantes"),

  inicio: document.getElementById("inicioExibicao"),

  fim: document.getElementById("fimExibicao"),

  painel: document.getElementById("painelConfiguracao"),

  dataInicio: document.getElementById("dataInicio"),

  dataFim: document.getElementById("dataFim"),

  feriados: document.getElementById("feriados"),

  recessos: document.getElementById("recessos"),
};

/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const CHAVE_STORAGE = "contadorDiasTrabalho_configuracao";

const configuracaoPadrao = {
  dataInicio: "",

  dataFim: "2026-12-23",

  feriados: ["2026-10-12", "2026-11-02", "2026-11-20"],

  recessos: [
    {
      inicio: "2026-10-13",

      fim: "2026-10-16",
    },
  ],
};

let configuracao;

/* =========================================================
   DATA ATUAL
========================================================= */

function obterDataAtualISO() {
  const hoje = new Date();

  return formatarISO(hoje);
}

/* =========================================================
   CRIAR CONFIGURAÇÃO PADRÃO
========================================================= */

function criarConfiguracaoPadrao() {
  return structuredClone(configuracaoPadrao);
}

/* =========================================================
   SALVAR
========================================================= */

function salvarLocalStorage() {
  localStorage.setItem(
    CHAVE_STORAGE,

    JSON.stringify(configuracao),
  );
}

/* =========================================================
   CARREGAR
========================================================= */

function carregarConfiguracao() {
  let dadosSalvos = null;

  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE);

    if (salvo) {
      dadosSalvos = JSON.parse(salvo);
    }
  } catch (erro) {
    console.error("Erro ao carregar configuração:", erro);
  }

  if (dadosSalvos && typeof dadosSalvos === "object") {
    configuracao = normalizarConfiguracao(dadosSalvos);
  } else {
    configuracao = criarConfiguracaoPadrao();
  }

  /*
        A data inicial NÃO é armazenada como
        uma data fixa.

        Toda vez que a página é aberta,
        ela passa a ser o dia atual.
    */

  configuracao.dataInicio = obterDataAtualISO();

  salvarLocalStorage();

  preencherFormulario();
}

/* =========================================================
   NORMALIZAR CONFIGURAÇÃO
========================================================= */

function normalizarConfiguracao(dados) {
  const padrao = criarConfiguracaoPadrao();

  return {
    dataInicio: typeof dados.dataInicio === "string" ? dados.dataInicio : "",

    dataFim:
      typeof dados.dataFim === "string" && dados.dataFim
        ? dados.dataFim
        : padrao.dataFim,

    feriados: Array.isArray(dados.feriados)
      ? dados.feriados.filter((data) => typeof data === "string")
      : [...padrao.feriados],

    recessos: Array.isArray(dados.recessos)
      ? dados.recessos
          .filter((recesso) => recesso && typeof recesso === "object")
          .map((recesso) => ({
            inicio: typeof recesso.inicio === "string" ? recesso.inicio : "",

            fim: typeof recesso.fim === "string" ? recesso.fim : "",
          }))
      : structuredClone(padrao.recessos),
  };
}

/* =========================================================
   PREENCHER FORMULÁRIO
========================================================= */

function preencherFormulario() {
  elementos.dataInicio.value = configuracao.dataInicio;

  elementos.dataFim.value = configuracao.dataFim;

  renderizarFeriados();

  renderizarRecessos();
}

/* =========================================================
   FERIADOS
========================================================= */

function renderizarFeriados() {
  elementos.feriados.innerHTML = "";

  configuracao.feriados.forEach((feriado, index) => {
    const linha = document.createElement("div");

    linha.className = "linha";

    linha.innerHTML = `

                <input
                    type="date"
                    value="${feriado}"
                    data-index="${index}"
                    data-tipo="feriado"
                >

                <button
                    type="button"
                    class="btn-remover"
                    data-index="${index}"
                    data-tipo="feriado"
                    aria-label="Remover feriado"
                >
                    ×
                </button>
            `;

    elementos.feriados.appendChild(linha);
  });
}

/* =========================================================
   RECESSOS
========================================================= */

function renderizarRecessos() {
  elementos.recessos.innerHTML = "";

  configuracao.recessos.forEach((recesso, index) => {
    const linha = document.createElement("div");

    linha.className = "linha";

    linha.innerHTML = `

                <input
                    type="date"
                    value="${recesso.inicio}"
                    data-index="${index}"
                    data-tipo="inicio-recesso"
                >

                <span>até</span>

                <input
                    type="date"
                    value="${recesso.fim}"
                    data-index="${index}"
                    data-tipo="fim-recesso"
                >

                <button
                    type="button"
                    class="btn-remover"
                    data-index="${index}"
                    data-tipo="recesso"
                    aria-label="Remover recesso"
                >
                    ×
                </button>
            `;

    elementos.recessos.appendChild(linha);
  });
}

/* =========================================================
   ALTERAÇÃO DOS CAMPOS
========================================================= */

document.addEventListener("change", (event) => {
  const campo = event.target;

  const tipo = campo.dataset.tipo;

  if (!tipo) {
    return;
  }

  /* FERIADO */

  if (tipo === "feriado") {
    const index = Number(campo.dataset.index);

    configuracao.feriados[index] = campo.value;

    salvarLocalStorage();

    atualizar();

    return;
  }

  /* RECESSO - INÍCIO */

  if (tipo === "inicio-recesso") {
    const index = Number(campo.dataset.index);

    configuracao.recessos[index].inicio = campo.value;

    salvarLocalStorage();

    atualizar();

    return;
  }

  /* RECESSO - FIM */

  if (tipo === "fim-recesso") {
    const index = Number(campo.dataset.index);

    configuracao.recessos[index].fim = campo.value;

    salvarLocalStorage();

    atualizar();
  }
});

/* =========================================================
   ABRIR / FECHAR CONFIGURAÇÃO
========================================================= */

/* =========================================================
   ABRIR / FECHAR CONFIGURAÇÃO
========================================================= */

/* =========================================================
   ABRIR / FECHAR CONFIGURAÇÃO
========================================================= */

document.addEventListener("click", (event) => {
  if (
    event.target.closest("#btnConfiguracao") ||
    event.target.closest("#btnFecharConfiguracao")
  ) {
    elementos.painel.classList.toggle("oculto");
  }
});

/* =========================================================
   ADICIONAR FERIADO
========================================================= */

document.getElementById("btnAdicionarFeriado").addEventListener("click", () => {
  configuracao.feriados.push("");

  salvarLocalStorage();

  renderizarFeriados();
});

/* =========================================================
   ADICIONAR RECESSO
========================================================= */

document.getElementById("btnAdicionarRecesso").addEventListener("click", () => {
  configuracao.recessos.push({
    inicio: "",

    fim: "",
  });

  salvarLocalStorage();

  renderizarRecessos();
});

/* =========================================================
   REMOVER ITENS
========================================================= */

document.addEventListener("click", (event) => {
  const botao = event.target.closest(".btn-remover");

  if (!botao) {
    return;
  }

  const tipo = botao.dataset.tipo;

  const index = Number(botao.dataset.index);

  /* FERIADO */

  if (tipo === "feriado") {
    configuracao.feriados.splice(index, 1);

    salvarLocalStorage();

    renderizarFeriados();

    atualizar();

    return;
  }

  /* RECESSO */

  if (tipo === "recesso") {
    configuracao.recessos.splice(index, 1);

    salvarLocalStorage();

    renderizarRecessos();

    atualizar();
  }
});

/* =========================================================
   DATA FINAL
========================================================= */

elementos.dataFim.addEventListener("change", () => {
  configuracao.dataFim = elementos.dataFim.value;

  salvarLocalStorage();

  atualizar();
});

/* =========================================================
   BOTÃO SALVAR
========================================================= */

document.getElementById("btnSalvar").addEventListener("click", () => {
  /*
                A data inicial sempre volta
                para o dia atual.
            */

  configuracao.dataInicio = obterDataAtualISO();

  configuracao.dataFim = elementos.dataFim.value;

  salvarLocalStorage();

  preencherFormulario();

  elementos.painel.classList.add("oculto");

  atualizar();
});

/* =========================================================
   VERIFICAR DIA DE TRABALHO
========================================================= */

function ehDiaDeTrabalho(data) {
  const diaSemana = data.getDay();

  /*
        0 = domingo
        6 = sábado
    */

  if (diaSemana === 0 || diaSemana === 6) {
    return false;
  }

  const dataISO = formatarISO(data);

  /* FERIADOS */

  if (configuracao.feriados.includes(dataISO)) {
    return false;
  }

  /* RECESSOS */

  for (const recesso of configuracao.recessos) {
    if (!recesso.inicio || !recesso.fim) {
      continue;
    }

    if (dataISO >= recesso.inicio && dataISO <= recesso.fim) {
      return false;
    }
  }

  return true;
}

/* =========================================================
   FORMATAR DATA ISO
========================================================= */

function formatarISO(data) {
  const ano = data.getFullYear();

  const mes = String(data.getMonth() + 1).padStart(2, "0");

  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

/* =========================================================
   FORMATAR DATA BR
========================================================= */

function formatarDataBR(data) {
  if (!data) {
    return "--/--/----";
  }

  const partes = data.split("-");

  return `${partes[2]}/` + `${partes[1]}/` + `${partes[0]}`;
}

/* =========================================================
   CALCULAR DIAS RESTANTES
========================================================= */

function calcularDiasDeTrabalho() {
  const agora = new Date();

  const inicioPeriodo = new Date(configuracao.dataInicio + "T00:00:00");

  const fimPeriodo = new Date(configuracao.dataFim + "T00:00:00");

  /*
        Se a data atual já passou
        da data final, não há dias restantes.
    */

  if (agora > fimPeriodo) {
    return 0;
  }

  /*
        Começa pela data atual.
    */

  const data = new Date(Math.max(agora.getTime(), inicioPeriodo.getTime()));

  data.setHours(0, 0, 0, 0);

  let dias = 0;

  /*
        Percorre todos os dias até a
        data final, inclusive.
    */

  while (data <= fimPeriodo) {
    if (ehDiaDeTrabalho(data)) {
      dias++;
    }

    data.setDate(data.getDate() + 1);
  }

  return dias;
}

/* =========================================================
   ATUALIZAR INTERFACE
========================================================= */

function atualizar() {
  const agora = new Date();

  /*
        Data atual exibida na tela.
    */

  elementos.dataAtual.textContent = agora.toLocaleString("pt-BR", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  /*
        Período.
    */

  elementos.inicio.textContent = formatarDataBR(configuracao.dataInicio);

  elementos.fim.textContent = formatarDataBR(configuracao.dataFim);

  /*
        Dias restantes.
    */

  const dias = calcularDiasDeTrabalho();

  elementos.dias.textContent = dias;
}

/* =========================================================
   INICIAR
========================================================= */

carregarConfiguracao();

atualizar();
