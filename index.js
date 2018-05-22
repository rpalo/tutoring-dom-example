const parent = document.querySelector(".container");
// fake_data.js provides data, an array of objects

build_data_table(parent, data);

// Get handles on inputs
const dateSearch = document.querySelector('.search[name="timestamp"]');
const commentSearch = document.querySelector('.search[name="comment"]');
const selectSearches = document.querySelectorAll('select.search');
const textSearches = document.querySelectorAll('input.search');
const allSearches = document.querySelectorAll(".search");
const clearButton = document.querySelector(".clear");
const rows = document.querySelectorAll("tr");

// Setup inputs and add event listeners
textSearches.forEach(input => input.addEventListener("keyup", filter_table));

selectSearches.forEach(select => {
  const column = select.name;
  const options = new Set(data.map(record => record[column]));
  options.forEach(option => {
    const optionElement = document.createElement("option")
    optionElement.text = option;
    select.options.add(optionElement);
  });
  select.addEventListener("change", filter_table);
});

clearButton.addEventListener("click", () => {
  allSearches.forEach(search => search.value = "");
  show_all(rows);
});

function filter_table() {
  data.forEach((record, ind) => {
    if (matches_all_searches(allSearches, record)) {
      rows[ind + 1].style.display = "";
    } else {
      rows[ind + 1].style.display = "none";
    }
  });
}

function show_all(items) {
  items.forEach(item => item.style.display = "");
}

function matches_all_searches(searchInputs, record) {
  return [...searchInputs].every(search => {
    return record[search.name].indexOf(search.value) >= 0;
  });
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
  let cell;
  values.forEach(value => {
    cell = document.createElement("td");
    cell.innerHTML = value;
    row.appendChild(cell);
  });
  table.appendChild(row);
}