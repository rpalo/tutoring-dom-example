// fake_data.js provides data, an array of objects

main(50, data);

function main(pageSize, dataset) {
  const parent = document.querySelector(".table__parent");
  buildDataTable(parent, dataset);

  // Get handles on inputs
  const dateSearch = document.querySelector('.search[name="timestamp"]');
  const commentSearch = document.querySelector('.search[name="comment"]');
  const selectSearches = document.querySelectorAll('select.search');
  const textSearches = document.querySelectorAll('input.search');
  const allSearches = document.querySelectorAll(".search");
  const clearButton = document.querySelector(".clear");
  const rows = document.querySelectorAll(".data");
  const paginationParent = document.querySelector(".pagination");
  
  // Generate pagination links and add functionality
  const paginationLinks = createPaginationLinks(paginationParent, dataset, pageSize);
  paginationLinks.forEach(link => {
    link.addEventListener("click", () => render(rows, dataset, allSearches, pageSize, parseInt(link.dataset.page)));
  });
  
  // Setup inputs and add event listeners
  textSearches.forEach(input => input.addEventListener("keyup", () => render(rows, dataset, allSearches, pageSize)));
  
  selectSearches.forEach(select => {
    const column = select.name;
    const options = new Set(data.map(record => record[column]));
    options.forEach(option => {
      const optionElement = document.createElement("option")
      optionElement.text = option;
      select.options.add(optionElement);
    });
    select.addEventListener("change", () => render(rows, dataset, allSearches, pageSize));
  });
  
  clearButton.addEventListener("click", () => {
    allSearches.forEach(search => search.value = "");
    render(rows, dataset, allSearches, pageSize);
  });
  
  render(rows, dataset, allSearches, pageSize);
}

function render(rows, dataset, filters, pageSize, page = 0) {
  const toShow = filterTable(filters, dataset);
  const pages = Math.ceil(toShow.length/pageSize);
  showPagination(pages);
  const thisPage = toShow.slice(pageSize*page, pageSize*(page + 1));
  rows.forEach((row, ind) => {
    if (thisPage.includes(ind)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function filterTable(filterInputs, dataToMatch) {
  return dataToMatch.map((record, ind) => {
    if (matchesAllSearches(filterInputs, record)) {
      return ind;
    } else {
      return -1;
    }
  }).filter(ind => ind >= 0);
}

function matchesAllSearches(filterInputs, record) {
  return [...filterInputs].every(filter => {
    return record[filter.name].indexOf(filter.value) >= 0;
  });
}

function showPagination(pages) {
  const paginationItems = document.querySelectorAll(".page-item");
  paginationItems.forEach((item, ind) => {
    if (ind < pages) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

function createPaginationLinks(parent, data, pageSize) {
  const pages = Math.ceil(data.length/pageSize);
  const links = [];
  for (let i=0; i<pages; i++) {
    const item = document.createElement("li");
    item.classList.add("page-item");
    const link = document.createElement("a");
    item.appendChild(link);
    link.classList.add("page-link");
    link.innerHTML = i + 1;
    link.dataset.page = i;
    parent.appendChild(item);
    links.push(link);
  }
  return links;
}

function buildDataTable(parent, data) {
  const titles = Object.keys(data[0]);
  const table = addTable(parent, titles);
  data.forEach(row => {
    addRow(table, Object.values(row));
  });
}

function addTable(parent, columns) {
  const table = document.createElement("table");
  table.classList.add("table", "table-striped", "sightings");
  const row = document.createElement("tr");
  columns.forEach(title => {
    const cell = document.createElement("th");
    cell.innerHTML = title;
    row.appendChild(cell);
  });
  table.appendChild(row);
  parent.appendChild(table);
  return table;
}

function addRow(table, values) {
  const row = document.createElement("tr");
  row.classList.add("data")
  values.forEach(value => {
    const cell = document.createElement("td");
    cell.innerHTML = value;
    row.appendChild(cell);
  });
  table.appendChild(row);
}