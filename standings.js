const standingsTable = document.querySelector(".standings-table");
const detailedBody = document.querySelector("#detailed-standings-body");
const sortStatus = document.querySelector("#sort-status");
const sortButtons = [...document.querySelectorAll(".sort-button")];

if (!standingsTable || !detailedBody || !sortStatus || sortButtons.length !== 2) {
  throw new Error("Le classement détaillé ne trouve pas les éléments HTML requis.");
}

const sourceRows = [...standingsTable.querySelectorAll("tbody tr")];

if (sourceRows.length === 0) {
  throw new Error("Le classement détaillé ne contient aucune équipe à trier.");
}

const readNumber = (cell, teamName, columnName) => {
  const value = Number(cell.textContent.trim());

  if (!Number.isFinite(value)) {
    throw new Error(`Valeur ${columnName} invalide pour ${teamName}.`);
  }

  return value;
};

const teams = sourceRows.map((row) => {
  const cells = [...row.cells];
  const teamName = cells[1]?.querySelector(".team-name");

  if (cells.length !== 11 || !teamName) {
    throw new Error("Une ligne du classement principal est incomplète.");
  }

  return {
    name: teamName.textContent.trim(),
    clubCell: cells[1],
    points: readNumber(cells[2], teamName.textContent.trim(), "points"),
    bp: readNumber(cells[8], teamName.textContent.trim(), "buts pour"),
    bc: readNumber(cells[9], teamName.textContent.trim(), "buts contre"),
    position: readNumber(cells[0], teamName.textContent.trim(), "position"),
    isInterNogent: row.classList.contains("club-inter-nogent"),
  };
});

const renderDetailedStandings = (sortKey) => {
  const sortDirection = sortKey === "bp" ? -1 : 1;
  const sortedTeams = [...teams].sort(
    (first, second) =>
      sortDirection * (first[sortKey] - second[sortKey]) ||
      second.points - first.points ||
      first.position - second.position,
  );
  const fragment = document.createDocumentFragment();

  sortedTeams.forEach((team, index) => {
    const row = document.createElement("tr");
    const positionCell = document.createElement("td");
    const bpCell = document.createElement("td");
    const bcCell = document.createElement("td");

    row.classList.toggle("ranking-leading", index < 3);
    row.classList.toggle("club-inter-nogent", team.isInterNogent);

    positionCell.className = "position-cell";
    positionCell.textContent = String(index + 1);
    bpCell.className = "metric-cell";
    bpCell.textContent = String(team.bp);
    bcCell.className = "metric-cell";
    bcCell.textContent = String(team.bc);

    row.append(positionCell, team.clubCell.cloneNode(true), bpCell, bcCell);
    fragment.append(row);
  });

  detailedBody.replaceChildren(fragment);
  sortButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.sort === sortKey));
  });

  sortStatus.textContent =
    sortKey === "bp"
      ? "Triés par buts marqués, du plus grand au plus petit."
      : "Triés par buts encaissés, du plus petit au plus grand.";
};

sortButtons.forEach((button) => {
  const { sort } = button.dataset;

  if (sort !== "bp" && sort !== "bc") {
    throw new Error("Critère de tri du classement détaillé inconnu.");
  }

  button.addEventListener("click", () => renderDetailedStandings(sort));
});

renderDetailedStandings("bp");
