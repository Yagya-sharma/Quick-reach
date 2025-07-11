// 1. Favourite add
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".favorite-add");
  const container = document.querySelector(".favorite-box");

  // Load from backend
  fetch("/api/favorites")
    .then(res => res.json())
    .then(favorites => {
      favorites.forEach((name, index) => {
        createFavoriteCard(name, index);
      });
    });

  // Add favorite
  addBtn.addEventListener("click", () => {
    const name = prompt("Enter favorite name:");
    if (name) {
      fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      })
      .then(res => res.json())
      .then(data => {
        const index = data.favorites.length - 1;
        createFavoriteCard(name, index);
      });
    }
  });
// Create card
  function createFavoriteCard(name, index) {
    const div = document.createElement("div");
    div.className = "favorite-card";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-heart";

    const text = document.createElement("span");
    text.textContent = " " + name;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.onclick = () => {
      fetch(`/api/favorites/${index}`, {
        method: "DELETE"
      })
      .then(res => res.json())
      .then(() => {
        div.remove();
      });
    };
 const renameBtn = document.createElement("button");
    renameBtn.textContent = "✏";
    renameBtn.onclick = () => {
      const newName = prompt("Enter new name:", name);
      if (newName) {
        fetch(`/api/favorites/${index}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: newName })
        })
        .then(res => res.json())
        .then(() => {
          text.textContent = " " + newName;
        });
      }
    };

    div.appendChild(icon);
    div.appendChild(text);
    div.appendChild(renameBtn);
    div.appendChild(deleteBtn);
    container.appendChild(div);
  }
});


// 2. Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// 3. Crisis Helpline Alert
document.addEventListener("DOMContentLoaded", function () {
  const urgentBoxes = document.querySelectorAll(".urgent-box");

  urgentBoxes.forEach((box) => {
    if (box.textContent.includes("Crisis Helpline")) {
      box.addEventListener("click", () => {
        alert("🚨 Please call the 24/7 Crisis Helpline at 1800-XYZ-HELP immediately.");
      });
    }
  });
});

// 4. Scroll Reveal Effect
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section");

  sections.forEach((sec) => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 200;
    const height = sec.offsetHeight;

    if (top >= offset && top < offset + height) {
      sec.style.opacity = 1;
      sec.style.transform = "translateY(0)";
    }
  });
});
