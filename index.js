const parent = document.querySelector(".container");
// fake_data.js provides data, an array of objects

build_data_table(parent, data);

const columns = Object.keys(data[0]);
const dateSearch = document.querySelector('.search[name="timestamp-search"]');
dateSearch.addEventListener("keyup", filter_table_by(data, "timestamp"));

function filter_table_by(data, column) {
  const filter_table = function() {
    const value = this.value;
    const rows = document.querySelectorAll("tr");
  
    data.forEach((record, ind) => {
      if (value == "" || data[ind][column].indexOf(value) >= 0) {
        rows[ind + 1].style.display = "";
      } else {
        rows[ind + 1].style.display = "none";
      }
    });
  }

  return filter_table;
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