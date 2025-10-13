// CÓDIGO CORRIGIDO - app.js

class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor() {
        let proximoId = localStorage.getItem('id')
        if (proximoId === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa) {
        let despesasFiltrdas = Array() // Nome da variável corrigido aqui
        despesasFiltrdas = this.recuperarTodosRegistros()

        if (despesa.ano != '') {
            despesasFiltrdas = despesasFiltrdas.filter(d => d.ano == despesa.ano)
        }
        if (despesa.mes != '') {
            despesasFiltrdas = despesasFiltrdas.filter(d => d.mes == despesa.mes)
        }
        if (despesa.dia != '') {
            despesasFiltrdas = despesasFiltrdas.filter(d => d.dia == despesa.dia)
        }
        if (despesa.tipo != '') {
            despesasFiltrdas = despesasFiltrdas.filter(d => d.tipo == despesa.tipo)
        }
        if (despesa.descricao != '') {
            despesasFiltrdas = despesasFiltrdas.filter(d => d.descricao == despesa.descricao)
        }
        if (despesa.valor != '') {
            despesasFiltrdas = despesasFiltrdas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltrdas
    }
    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if (despesa.validarDados()) {
        bd.gravar(despesa)
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'
        $('#ResgtriaDespesa').modal('show')
        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
    } else {
        document.getElementById('modal_titulo').innerHTML = 'erro ao inserir despesa'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Você esqueceu de preencher um ou mais campos obrigatórios.'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'
        $('#ResgtriaDespesa').modal('show')
    }
}

function carregarListarsDespesas(despesas = Array(), filtro = false) {
    if (despesas.length === 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    
    despesas.forEach(function (d) {
        let linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        
        let tipoTexto = d.tipo;
        switch (d.tipo) {
            case '1': tipoTexto = 'Alimentação'; break
            case '2': tipoTexto = 'Educação'; break
            case '3': tipoTexto = 'Lazer'; break
            case '4': tipoTexto = 'Saúde'; break
            case '5': tipoTexto = 'Transporte'; break
        }
        linha.insertCell(1).innerHTML = tipoTexto
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function () {
             const idParaApagar = this.id.replace('id_despesa_', '');
    
            if (confirm('Você tem certeza que deseja apagar esta despesa?')) {
                bd.remover(idParaApagar);
                this.closest('tr').remove();
                // Redesenha o gráfico para refletir a exclusão
                carregarListarsDespesas();
            }
        }
        linha.insertCell(4).append(btn);
    })

    desenharGraficoDespesas(despesas)
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesas = bd.pesquisar(despesa)
    carregarListarsDespesas(despesas, true)
}

document.addEventListener('DOMContentLoaded', function() {
  const selectAno = document.getElementById('ano');

  if (!selectAno) {
    return;
  }
  
  const anoAtual = new Date().getFullYear();
  const anoInicial = anoAtual - 5;
  const anoFinal = anoAtual + 10;

  for (let i = anoFinal; i >= anoInicial; i--) {
    let option = document.createElement('option');
    option.value = i;
    option.text = i;
    selectAno.add(option);
  }
});

// VERSÃO CORRETA DA FUNÇÃO DO GRÁFICO
function desenharGraficoDespesas(despesas) {
    if (!despesas) {
        despesas = bd.recuperarTodosRegistros();
    }

    const dadosParaGrafico = {
        labels: ['Alimentação', 'Educação', 'Lazer', 'Saúde', 'Transporte'],
        datasets: [{
            data: [0, 0, 0, 0, 0],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
    };

    despesas.forEach(d => {
        let tipoOriginal = d.tipo;
        if (isNaN(parseInt(tipoOriginal))) {
             switch(d.tipo) {
                case 'Alimentação': tipoOriginal = '1'; break;
                case 'Educação': tipoOriginal = '2'; break;
                case 'Lazer': tipoOriginal = '3'; break;
                case 'Saúde': tipoOriginal = '4'; break;
                case 'Transporte': tipoOriginal = '5'; break;
             }
        }
        if(tipoOriginal >= 1 && tipoOriginal <= 5) {
            dadosParaGrafico.datasets[0].data[parseInt(tipoOriginal) - 1] += parseFloat(d.valor);
        }
    });

    const ctx = document.getElementById('graficoDespesasPizza');
    if (ctx) {
        if (window.meuGrafico instanceof Chart) {
            window.meuGrafico.destroy();
        }

        window.meuGrafico = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: dadosParaGrafico,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Despesas'
                    }
                }
            }
        });
    }
}