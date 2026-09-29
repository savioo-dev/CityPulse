const places = [
  {
    id: 1,
    name: "Vila Tech Café",
    category: ["cafe", "coworking"],
    description: "Café • Coworking",
    rating: 4.8,
    price: "R$ 20 - 40",
    openingHours: "Seg - Dom • 08:00 - 22:00",
    address: "Rua das Flores, 120",
    status: "Aberto agora",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Praça Central",
    category: ["parque"],
    description: "Parque",
    rating: 4.6,
    price: "Gratuito",
    openingHours: "Seg - Dom • 06:00 - 21:00",
    address: "Avenida Central, 250",
    status: "Aberto agora",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Code House",
    category: ["coworking"],
    description: "Coworking",
    rating: 4.9,
    price: "R$ 40 - 90",
    openingHours: "Seg - Sáb • 08:00 - 20:00",
    address: "Rua da Tecnologia, 80",
    status: "Aberto agora",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Biblioteca Central",
    category: ["biblioteca"],
    description: "Biblioteca",
    rating: 4.7,
    price: "Gratuito",
    openingHours: "Seg - Sáb • 08:00 - 18:00",
    address: "Praça dos Livros, 18",
    status: "Aberto agora",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Mercado do Porto",
    category: ["gastronomia"],
    description: "Gastronomia",
    rating: 4.8,
    price: "R$ 30 - 80",
    openingHours: "Seg - Dom • 09:00 - 23:00",
    address: "Rua do Mercado, 70",
    status: "Aberto agora",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80"
  }
];

const state = {
  search: "",
  category: "todos",
  sort: "default"
};

const storageKey = "citypulse-favorites";

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getCategoryLabel(category) {
  const labels = {
    todos: "Todos",
    cafe: "Café",
    coworking: "Coworking",
    parque: "Parque",
    biblioteca: "Biblioteca",
    gastronomia: "Gastronomia"
  };

  return labels[category] || category;
}

function getUniqueCategories() {
  return [
    "todos",
    ...new Set(
      places.flatMap((place) => place.category || [])
    )
  ];
}

function createStars(rating) {
  const fullStars = Math.round(rating);

  return (
    "★".repeat(fullStars) +
    "☆".repeat(5 - fullStars)
  );
}

function getFavoriteIds() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    return Array.isArray(stored)
      ? stored.map(Number)
      : [];
  } catch {
    return [];
  }
}

function saveFavoriteIds(ids) {
  localStorage.setItem(
    storageKey,
    JSON.stringify(ids)
  );
}

function toggleFavorite(id) {
  const favorites = getFavoriteIds();
  const numericId = Number(id);
  const hasId = favorites.includes(numericId);

  const next = hasId
    ? favorites.filter((item) => item !== numericId)
    : [...favorites, numericId];

  saveFavoriteIds(next);
  render();
}

function renderCategoryButtons() {
  const categoryList =
    document.getElementById("category-list");

  if (!categoryList) return;

  const categories = getUniqueCategories();

  categoryList.innerHTML = categories
    .map((category) => {
      const active =
        category === state.category
          ? "active"
          : "";

      return `
        <button
          type="button"
          class="category-button ${active}"
          data-category="${category}"
          aria-pressed="${category === state.category}"
        >
          ${getCategoryLabel(category)}
        </button>
      `;
    })
    .join("");
}

function createPlaceCard(place) {
  const favorites = getFavoriteIds();

  const isFavorite =
    favorites.includes(place.id);

  const card =
    document.createElement("article");

  card.className = "place-card";

  card.innerHTML = `
    <div class="place-image">
      <img
        src="${place.image}"
        alt="${place.name}"
      />
    </div>

    <div class="place-content">

      <div class="card-top">

        <span class="card-category">
          ${place.category
            .map((category) =>
              getCategoryLabel(category)
            )
            .join(" • ")}
        </span>

        <button
          type="button"
          class="favorite-button ${isFavorite ? "active" : ""}"
          data-id="${place.id}"
          aria-label="${
            isFavorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }"
        >
          ${isFavorite ? "♥" : "♡"}
        </button>

      </div>

      <h3>${place.name}</h3>

      <p class="place-description">
        ${place.description}
      </p>

      <div
        class="rating"
        aria-label="Avaliação ${place.rating} de 5"
      >
        <span class="rating-stars">
          ${createStars(place.rating)}
        </span>

        <span>
          ${place.rating.toFixed(1)}
        </span>
      </div>

      <div class="place-meta">

        <span>
          <strong>Preço:</strong>
          ${place.price}
        </span>

        <span>
          <strong>Horário:</strong>
          ${place.openingHours}
        </span>

      </div>

      <address>
        ${place.address}
      </address>

      <div class="status">
        <span></span>
        <span>${place.status}</span>
      </div>

      <div class="card-actions">

        <button
          type="button"
          class="details-button"
          data-id="${place.id}"
        >
          Ver detalhes
        </button>

      </div>

    </div>
  `;

  return card;
}

function updateResultsCount(count) {
  const resultsCount =
    document.getElementById("results-count");

  if (!resultsCount) return;

  resultsCount.textContent =
    count === 1
      ? "1 lugar"
      : `${count} lugares`;
}

function renderPlaces(placesToRender) {
  const container =
    document.getElementById("places-container");

  const noResults =
    document.getElementById("no-results");

  if (!container) return;

  container.innerHTML = "";

  if (!placesToRender.length) {
    if (noResults) {
      noResults.hidden = false;
    }

    updateResultsCount(0);
    return;
  }

  if (noResults) {
    noResults.hidden = true;
  }

  placesToRender.forEach((place) => {
    container.appendChild(
      createPlaceCard(place)
    );
  });

  updateResultsCount(
    placesToRender.length
  );
}

function filterPlaces() {
  const searchValue =
    normalizeText(state.search);

  const filtered = places.filter((place) => {
    const searchableText = [
      place.name,
      place.description,
      place.address,
      place.price,
      place.openingHours,
      place.category.join(" ")
    ].join(" ");

    const matchesSearch =
      !searchValue ||
      normalizeText(searchableText)
        .includes(searchValue);

    const matchesCategory =
      state.category === "todos" ||
      place.category.includes(
        state.category
      );

    return (
      matchesSearch &&
      matchesCategory
    );
  });

  const sorted = [...filtered];

  switch (state.sort) {
    case "rating-desc":
      sorted.sort(
        (a, b) => b.rating - a.rating
      );
      break;

    case "rating-asc":
      sorted.sort(
        (a, b) => a.rating - b.rating
      );
      break;

    case "name-asc":
      sorted.sort((a, b) =>
        a.name.localeCompare(
          b.name,
          "pt-BR"
        )
      );
      break;

    case "name-desc":
      sorted.sort((a, b) =>
        b.name.localeCompare(
          a.name,
          "pt-BR"
        )
      );
      break;

    case "default":
    default:
      break;
  }

  renderPlaces(sorted);
}

function openModal(place) {
  const modal =
    document.getElementById("place-modal");

  const modalContent =
    document.getElementById("modal-content");

  if (
    !modal ||
    !modalContent ||
    !place
  ) {
    return;
  }

  const stars =
    createStars(place.rating);

  modalContent.innerHTML = `
    <div class="modal-image">
      <img
        src="${place.image}"
        alt="${place.name}"
      />
    </div>

    <div class="modal-content-inner">

      <h3 id="modal-title">
        ${place.name}
      </h3>

      <div class="modal-meta">

        <span class="modal-badge">
          ${place.category
            .map((category) =>
              getCategoryLabel(category)
            )
            .join(" • ")}
        </span>

        <span class="modal-badge">
          ${place.price}
        </span>

      </div>

      <p class="modal-description">
        ${place.description}
      </p>

      <div class="modal-details">

        <div class="modal-detail">
          <strong>Avaliação</strong>

          <span>
            ${stars}
            ${place.rating.toFixed(1)}
          </span>
        </div>

        <div class="modal-detail">
          <strong>Horário</strong>

          <span>
            ${place.openingHours}
          </span>
        </div>

        <div class="modal-detail">
          <strong>Endereço</strong>

          <span>
            ${place.address}
          </span>
        </div>

        <div class="modal-detail">
          <strong>Status</strong>

          <span>
            ${place.status}
          </span>
        </div>

      </div>

    </div>
  `;

  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );
}

function closeModal() {
  const modal =
    document.getElementById("place-modal");

  if (!modal) return;

  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );
}

function bindEvents() {
  const searchForm =
    document.getElementById(
      "search-form"
    );

  const searchInput =
    document.getElementById(
      "search-input"
    );

  const sortSelect =
    document.getElementById(
      "sort-select"
    );

  const categoryList =
    document.getElementById(
      "category-list"
    );

  const placesContainer =
    document.getElementById(
      "places-container"
    );

  const modal =
    document.getElementById(
      "place-modal"
    );

  const modalClose =
    document.querySelector(
      ".modal-close"
    );

  if (searchForm) {
    searchForm.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        state.search = searchInput
          ? searchInput.value.trim()
          : "";

        filterPlaces();
      }
    );
  }

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      (event) => {
        state.search =
          event.target.value.trim();

        filterPlaces();
      }
    );
  }

  if (sortSelect) {
    sortSelect.value = state.sort;

    sortSelect.addEventListener(
      "change",
      (event) => {
        state.sort =
          event.target.value;

        filterPlaces();
      }
    );
  }

  if (categoryList) {
    categoryList.addEventListener(
      "click",
      (event) => {
        const button =
          event.target.closest(
            ".category-button"
          );

        if (!button) return;

        state.category =
          button.dataset.category ||
          "todos";

        renderCategoryButtons();
        filterPlaces();
      }
    );
  }

  if (placesContainer) {
    placesContainer.addEventListener(
      "click",
      (event) => {
        const favoriteButton =
          event.target.closest(
            ".favorite-button"
          );

        const detailsButton =
          event.target.closest(
            ".details-button"
          );

        if (favoriteButton) {
          toggleFavorite(
            favoriteButton.dataset.id
          );

          return;
        }

        if (detailsButton) {
          const placeId =
            Number(
              detailsButton.dataset.id
            );

          const selectedPlace =
            places.find(
              (place) =>
                place.id === placeId
            );

          if (selectedPlace) {
            openModal(
              selectedPlace
            );
          }
        }
      }
    );
  }

  if (modalClose) {
    modalClose.addEventListener(
      "click",
      closeModal
    );
  }

  if (modal) {
    modal.addEventListener(
      "click",
      (event) => {
        if (
          event.target.dataset.close ===
          "true"
        ) {
          closeModal();
        }
      }
    );
  }

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        modal &&
        modal.classList.contains("open")
      ) {
        closeModal();
      }
    }
  );
}

function render() {
  renderCategoryButtons();
  filterPlaces();
}

function init() {
  bindEvents();
  render();
}

document.addEventListener(
  "DOMContentLoaded",
  init
);