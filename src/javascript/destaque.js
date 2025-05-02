import { db } from "./firebase-init.js";
import { iniciarSwiper } from "./swiper-init.js";
import {
  collectionGroup,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

export async function carregarDestaques() {
  const destaqueContainer = document.getElementById("destaque-container");

  const destaquesQuery = query(
    collectionGroup(db, "Produtos"),
    where("destaque", "==", true)
  );

  const snapshot = await getDocs(destaquesQuery);

  if (snapshot.empty) {
    console.log("Nenhum produto em destaque encontrado.");
    return;
  }

  snapshot.forEach((doc) => {
    const produto = doc.data();
    const card = document.createElement("div");
    card.classList.add("swiper-slide");

    card.innerHTML = `
      <img src="${produto.imagem1}" alt="${produto.nome}" class="produto-imagem" />
      <div class="preco-tag preco-animado">
        <i class="fa-solid fa-tag"></i>${produto.preco.toLocaleString(
          "pt-BR",
          { style: "currency", currency: "BRL" }
        )}
      </div>
    `;
    destaqueContainer.appendChild(card);
  });

  setTimeout(iniciarSwiper, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  const btnEspaco = document.getElementById('btnEspacoNatura');
  if (btnEspaco) {
    btnEspaco.addEventListener('click', () => {
      window.open('https://www.natura.com.br/consultoria/janainab1701', '_blank');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const btnEspaco = document.getElementById('btnWhats');
  if (btnEspaco) {
    btnEspaco.addEventListener('click', () => {
      window.open('https://wa.me/5511963896909');
    });
  }
});