const parent = document.querySelector(".table__parent");
// fake_data.js provides data, an array of objects

const PAGESIZE = 50;

build_data_table(parent, data);


// Get handles on inputs
const dateSearch = document.querySelector('.search[name="timestamp"]');
const commentSearch = document.querySelector('.search[name="comment"]');
const selectSearches = document.querySelectorAll('select.search');
const textSearches = document.querySelectorAll('input.search');
const allSearches = document.querySelectorAll(".search");
const clearButton = document.querySelector(".clear");
const rows = document.querySelectorAll(".data");
const paginationParent = document.querySelector(".pagination");

createPaginationLinks(data, PAGESIZE);

render(PAGESIZE);


// Setup inputs and add event listeners
textSearches.forEach(input => input.addEventListener("keyup", () => render(PAGESIZE)));

selectSearches.forEach(select => {
  const column = select.name;
  const options = new Set(data.map(record => record[column]));
  options.forEach(option => {
    const optionElement = document.createElement("option")
    optionElement.text = option;
    select.options.add(optionElement);
  });
  select.addEventListener("change", () => render(PAGESIZE));
});

clearButton.addEventListener("click", () => {
  allSearches.forEach(search => search.value = "");
  render(PAGESIZE);
});

function filter_table() {
  return data.map((record, ind) => {
    if (matches_all_searches(allSearches, record)) {
      return ind;
    } else {
      return -1;
    }
  }).filter(ind => ind >= 0);
}

function matches_all_searches(searchInputs, record) {
  return [...searchInputs].every(search => {
    return record[search.name].indexOf(search.value) >= 0;
  });
}

function render(pageSize, page = 0) {
  const toShow = filter_table();
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

function createPaginationLinks(data, pageSize) {
  const pages = Math.ceil(data.length/pageSize);
  for (let i=0; i<pages; i++) {
    const item = document.createElement("li");
    item.classList.add("page-item");
    const link = document.createElement("a");
    item.appendChild(link);
    link.classList.add("page-link");
    link.innerHTML = i + 1;
    link.dataset.page = i;
    link.addEventListener("click", () => render(pageSize, i));
    paginationParent.appendChild(item);
  }
}

function build_data_table(parent, data) {
  const titles = Object.keys(data[0]);
  const table = add_table(parent, titles);
  data.forEach(row => {
    add_row(table, Object.values(row));
  });
}

function add_table(parent, columns) {
  const table = document.createElement("table");
  table.classList.add("table", "table-striped", "sightings");
  const row = document.createElement("tr");
  let cell = "";
  columns.forEach(title => {
    cell = document.createElement("th");
    cell.innerHTML = title;
    row.appendChild(cell);
  });
  table.appendChild(row);
  parent.appendChild(table);
  return table;
}

function add_row(table, values) {
  const row = document.createElement("tr");
  row.classList.add("data")
  let cell;
  values.forEach(value => {
    cell = document.createElement("td");
    cell.innerHTML = value;
    row.appendChild(cell);
  });
  table.appendChild(row);
}