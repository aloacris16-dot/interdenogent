const playerCards = [...document.querySelectorAll(".player-card")];
const filterButtons = [...document.querySelectorAll(".player-filter")];
const playerCount = document.querySelector("#players-count");
const playerStatus = document.querySelector("#players-status");
const emptyMessage = document.querySelector("#players-empty");

if (
  playerCards.length === 0 ||
  filterButtons.length !== 5 ||
  !playerCount ||
  !playerStatus ||
  !emptyMessage
) {
  throw new Error("La page des joueurs ne trouve pas les éléments HTML requis.");
}

const filterPlayers = (filter) => {
  let visibleCount = 0;

  playerCards.forEach((card) => {
    const positions = card.dataset.positions?.split(" ") ?? [];
    const isVisible = filter === "tous" || positions.includes(filter);

    card.hidden = !isVisible;
    visibleCount += Number(isVisible);
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const countLabel = `${visibleCount} joueur${visibleCount === 1 ? "" : "s"}`;
  playerCount.textContent = countLabel;
  playerStatus.textContent = `${countLabel} affiché${visibleCount === 1 ? "" : "s"}.`;
  emptyMessage.hidden = visibleCount > 0;
};

filterButtons.forEach((button) => {
  const filter = button.dataset.filter;

  if (!filter) {
    throw new Error("Un filtre de poste est manquant sur la page des joueurs.");
  }

  button.addEventListener("click", () => filterPlayers(filter));
});

filterPlayers("tous");
