function populateUFs() {
  const ufSelect = document.querySelector("select[name=uf]");
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((res) => res.json())
    .then((states) => {
      for (state of states) {
        ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`;
      }
    });
}
populateUFs();

function getCities(event) {
  const citySelect = document.querySelector("select[name=city]");
  const stateinput = document.querySelector("input[name=state]");
  const ufValeu = event.target.value;
  const indexOfSelectedState = event.target.selectedIndex;
  stateinput.value = event.target.options[indexOfSelectedState].text;
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValeu}/municipios`;
  citySelect.innerHTML = "<option value>Selecione a cidade</option>";
  citySelect.disabled = true;

  fetch(url)
    .then((res) => res.json())
    .then((cities) => {
      for (city of cities) {
        citySelect.innerHTML += `<option value"${city.nome}">${city.nome}</option>`;
      }
      citySelect.disabled = false;
    });
}

document.querySelector("select[name=uf]").addEventListener("change", getCities);

// Itens de coleta
// pegar todos os Li's
const itemsToCollect = document.querySelectorAll(".items-grid li");

for (const item of itemsToCollect) {
  item.addEventListener("click", handleSelectedItem);
}

const collectedItems = document.querySelector("input[name=items]");

let selectedItems = [];

function handleSelectedItem(event) {
  const itemLi = event.target;
  itemLi.classList.toggle("selected");
  const itemId = itemLi.dataset.id;

  // lógica
  // verificar se existem itens selecionados, se sim
  // pegar os itens selecionados
  const alreadySelecterd = selectedItems.findIndex((item) => {
    const itemFound = item == itemId; // true ou falso
    return itemFound;
  });

  // se já estiver selecionado, tirar da seleção
  if (alreadySelecterd >= 0) {
    const filteredItems = selectedItems.filter((item) => {
      const itemDifferent = item != itemId;
      return itemDifferent;
    });
    selectedItems = filteredItems;
    // se não estiver selecionado, adicionar a seleção
  } else {
    selectedItems.push(itemId);
  }
  // atualizar o campo escondido com os itens selecionados
  collectedItems.value = selectedItems;
}
