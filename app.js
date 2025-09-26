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
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa) {
        let despesasFiltrda = Array()
        despesasFiltrdas = this.recuperarTodosRegistros()

        console.log(despesa)
        console.log(despesasFiltrdas)

        if (despesa.ano != '') {
            console.log('ano')
            despesasFiltrdas = despesasFiltrdas.filter(d => d.ano == despesa.ano)
        }
        if (despesa.mes != '') {
            console.log('mes')
            despesasFiltrdas = despesasFiltrdas.filter(d => d.mes == despesa.mes)
        }
        if (despesa.dia != '') {
            console.log('dia')
            despesasFiltrdas = despesasFiltrdas.filter(d => d.dia == despesa.dia)
        }
        if (despesa.tipo != '') {
            console.log('tipo')
            despesasFiltrdas = despesasFiltrdas.filter(d => d.tipo == despesa.tipo)
        }
        if (despesa.descricao != '') {
            console.log('descricao')
            despesasFiltrdas = despesasFiltrdas.filter(d => d.descricao == despesa.descricao)
        }
        if (despesa.valor != '') {
            console.log('valor')
            despesasFiltrdas = despesasFiltrdas.filter(d => d.valor == despesa.valor)
        }
        console.log(despesasFiltrda)
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
function carregarListarsDespesas(despesas = Array(), filtro = false) {
    if (despesas.length === 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
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
            case '1': d.tipo = 'Alimentação'; break
            case '2': d.tipo = 'Educação'; break
            case '3': d.tipo = 'Lazer'; break
            case '4': d.tipo = 'Saúde'; break
            case '5': d.tipo = 'Transporte'; break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        // CORREÇÃO APLICADA AQUI - Lógica do botão movida para DENTRO do forEach
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function () {
            let idParaApagar = this.id.replace('id_despesa_', '')
            $('#apagaDespesa').modal('show');
            $('#apagaDespesa').data('id_para_excluir', idParaApagar);
            //alert(id)
            //getElementById('idParaApagar')
            //bd.remover(id)
            //window.location.reload()
        }
        linha.insertCell(4).append(btn);
        console.log(d)
    })

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


    let listaDespesas = document.getElementById('listaDespesas')
    carregarListarsDespesas(despesas, true)
}

$(document).ready(function () {
    // Evento para o modal de CADASTRO
    $('#ResgtriaDespesa').on('hidden.bs.modal', function (e) {
        $('#btnAdicionarDespesa').focus();
    });

    // Evento para o modal de EXCLUSÃO (agora no lugar certo)
    $('#btnConfirmarExclusao').on('click', function () {

        // 1. Lendo o ID que guardamos na "etiqueta" do modal
        let id = $('#apagaDespesa').data('id_para_excluir');

        // 2. Chamando a função para remover a despesa do localStorage
        bd.remover(id);

        // 3. Atualizando a página para a linha sumir da tabela
        window.location.reload();
    });
});
