const selectEstado = document.getElementById('estado')
const selectCidade = document.getElementById('cidade')
const qtdCidades = document.getElementById('qtdCidades')
const campoFiltro = document.getElementById('filtro')
const resumo = document.getElementById('resumo')

const URL_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'

let listaCidades = []

function carregarEstados() {
    fetch(URL_ESTADOS)
        .then(resposta => resposta.json())
        .then(estados => {
            console.log(estados)
            selectEstado.innerHTML = '<option value="">Selecione o estado</option>'

            estados.forEach(estado => {
                const opcao = document.createElement('option')
                opcao.value = estado.sigla
                opcao.textContent = estado.nome
                selectEstado.appendChild(opcao)
            })
        })
        .catch(erro => {
            selectEstado.innerHTML = '<option value="">Erro ao carregar estados</option>'
            console.log(erro)
        })
}

function mostrarCidades(cidades) {
    selectCidade.innerHTML = '<option value="">Selecione a cidade</option>'

    cidades.forEach(cidade => {
        const opcao = document.createElement('option')
        opcao.value = cidade.nome
        opcao.textContent = cidade.nome
        selectCidade.appendChild(opcao)
    })
}

selectEstado.addEventListener('change', () => {
    const uf = selectEstado.value
    qtdCidades.innerHTML = ''
    qtdCidades.className = ''
    campoFiltro.value = ''
    campoFiltro.disabled = true
    listaCidades = []

    if (uf === '') {
        selectCidade.innerHTML = '<option value="">Escolha um estado primeiro</option>'
        selectCidade.disabled = true
        return
    }

    selectCidade.innerHTML = '<option value="">Carregando...</option>'
    selectCidade.disabled = true

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(resposta => resposta.json())
        .then(cidades => {
            listaCidades = cidades
            mostrarCidades(cidades)
            selectCidade.disabled = false
            campoFiltro.disabled = false

            const nomeEstado = selectEstado.options[selectEstado.selectedIndex].text
            qtdCidades.innerHTML = `${nomeEstado} tem <strong>${cidades.length}</strong> cidades`
        })
        .catch(erro => {
            selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>'
            qtdCidades.innerHTML = 'Não foi possível carregar as cidades. Tente novamente.'
            qtdCidades.className = 'erro'
            console.log(erro)
        })
})

campoFiltro.addEventListener('input', () => {
    const texto = campoFiltro.value.toLowerCase()

    const filtradas = listaCidades.filter(cidade => {
        return cidade.nome.toLowerCase().includes(texto)
    })

    mostrarCidades(filtradas)

    if (filtradas.length === 0) {
        selectCidade.innerHTML = '<option value="">Nenhuma cidade encontrada</option>'
    }
})

document.getElementById('formInscricao').addEventListener('submit', (evento) => {
    evento.preventDefault()

    const nome = document.getElementById('nome').value
    const cidade = selectCidade.value
    const uf = selectEstado.value

    resumo.innerHTML = `<strong>${nome}</strong>, de ${cidade}/${uf}, inscrito com sucesso`
})

carregarEstados()
