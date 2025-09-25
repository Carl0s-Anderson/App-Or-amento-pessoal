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
            //console.log(i, this[i]) //this[i] acessa atributos
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
        //localStorage.setItem('despesa', JSON.stringify(d))
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
        console.log('Dados gravados no localStorage com o id:', id) // teste pra ver se funciona
        console.log(d)
    }
    recuperarTodosRegistros() {
        let despesas = Array()

        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            if (despesa === null) {
                continue
            }
            despesas.push(despesa)
        }
        return despesas
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
        //console.log('dados validos')
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
function carregarListarsDespesas() {
    let despesas = Array()
    despesas = bd.recuperarTodosRegistros()

    let listaDespesas = document.getElementById('listaDespesas')
    /*
      <tr>
              <td>2018</td>
              <td>festa</td>
              <td>dia</td>
              <td>compra do mês</td>
              <td>10.000</td>
            </tr>
    */
    despesas.forEach(function (d) {

        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
    })
}
// Adicione este código ao final do seu arquivo app.js

$(document).ready(function () {
    // Seleciona o modal pelo ID e escuta pelo evento 'hidden.bs.modal'
    $('#ResgtriaDespesa').on('hidden.bs.modal', function (e) {
        // Quando o modal estiver completamente escondido,
        // devolve o foco para o botão de adicionar despesa.
        $('#btnAdicionarDespesa').focus();
    })
});