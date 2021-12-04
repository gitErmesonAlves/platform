class Despesa {
  constructor(date, tipo, descricao, valor) {
    this.date = date;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }

  gravar(d) {
    let id = this.getProximoId();

    localStorage.setItem(id, JSON.stringify(d));

    localStorage.setItem("id", id);
  }

  recuperarTodosRegistros() {
    //array de despesas
    let despesas = Array();

    let id = localStorage.getItem("id");

    //recuperar todas as despesas cadastradas em localStorage
    for (let i = 1; i <= id; i++) {
      //recuperar a despesa
      let despesa = JSON.parse(localStorage.getItem(i));

      //existe a possibilidade de haver índices que foram pulados/removidos
      //nestes casos nós vamos pular esses índices
      if (despesa === null) {
        continue;
      }
      despesa.id = i;
      despesas.push(despesa);
    }

    return despesas;
	
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}

let bd = new Bd();

function cadastrarDespesa() {
  let date = document.getElementById("date");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    date.value,
    tipo.value,
    descricao.value,
    valor.value
  );


  if (despesa.validarDados()) {
    bd.gravar(despesa);

    document.getElementById("modal_titulo").innerHTML =
      "Registro inserido com sucesso";
    document.getElementById("modal_titulo_div").className = "text-success";

    //log de sucesso
    $("#exampleModal").modal("show").value = "";
    date.value = "";
    tipo.value = "";
    descricao.value = "";
    valor.value = "";
  } else {
    document.getElementById("modal_titulo").innerHTML =
      "Erro na inclusão do registro";
    document.getElementById("modal_titulo_div").className = "text-danger";

    //log de erro
    $("#exampleModal").modal("show");
  }

  window.location.reload();

}

function carregaListaDespesas(despesas = Array(), filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros();
  }

  /*

	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>

	*/

  let listaDespesas = document.getElementById("listaDespesas");
  listaDespesas.innerHTML = "";
  despesas.forEach(function (d) {
    //Criando a linha (tr)
    var linha = listaDespesas.insertRow();

    //Criando as colunas (td)
    linha.insertCell(0).innerHTML = `${d.date}`;

    //Ajustar o tipo
    switch (d.tipo) {
      case "1":
        d.tipo = "Alimentação";
        break;
      case "2":
        d.tipo = "Educação";
        break;
      case "3":
        d.tipo = "Lazer";
        break;
      case "4":
        d.tipo = "Saúde";
        break;
      case "5":
        d.tipo = "Transporte";
        break;
      case "6":
        d.tipo = "Mecânica";
        break;
      case "7":
        d.tipo = "Outros";
        break;
    }
    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;

    let div = document.createElement("div");
    div.className = "text-muted";
    let valor_number = parseFloat(d.valor);

	console.log(d);
	console.log(d.valor += d.valor);

	
    div.innerHTML = `<span>R$ ${valor_number},00</span>`;
    linha.insertCell(3).append(div);
    // document.getElementById(
    //   "span"
    // ).innerHTML = `Total: ${valor_number}`;




    //Criar o botão de exclusão
    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.innerHTML = '<i class="fa fa-close"  ></i>';
    btn.id = `id_despesa_${d.id}`;
    btn.onclick = function () {
      let id = this.id.replace("id_despesa_", "");
      //alert(id)
      bd.remover(id);
      window.location.reload();
    };
    linha.insertCell(4).append(btn);
  });
}



