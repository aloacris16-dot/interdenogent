const statsTableBody = document.querySelector("#sarfati-stats");

if (!statsTableBody) {
  throw new Error("Le tableau des statistiques de Sarfati est introuvable.");
}

const sarfatiStats = [
  { label: "Vitesse", value: 75 },
  { label: "Tir", value: 89 },
  { label: "Passe", value: 88 },
  { label: "Dribble", value: 88 },
  { label: "Défense", value: 68 },
  { label: "Physique", value: 90 },
];

const rows = sarfatiStats.map(({ label, value }) => {
  const row = document.createElement("tr");
  const labelCell = document.createElement("th");
  const meterCell = document.createElement("td");
  const scoreCell = document.createElement("td");
  const meter = document.createElement("progress");

  labelCell.scope = "row";
  labelCell.textContent = label;
  meter.className = "sarfati-stat-meter";
  meter.max = 100;
  meter.value = value;
  meter.setAttribute("aria-label", `${label} : ${value} sur 100`);
  meterCell.append(meter);
  scoreCell.textContent = String(value);
  row.append(labelCell, meterCell, scoreCell);

  return row;
});

statsTableBody.replaceChildren(...rows);
