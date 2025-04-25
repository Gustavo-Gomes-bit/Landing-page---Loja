import { db } from "./firebase-init.js";
import { iniciarSwiper } from "./swiper-init.js";
// ❌ Remover: import { collectionGroup, getDocs, query, where } from 'firebase/firestore';

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
      <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem" />
      <div class="preco-tag preco-animado">
        <i class="fa-solid fa-tag"></i> R$ ${produto.preco.toFixed(2)}
      </div>
    `;
    destaqueContainer.appendChild(card);
  });

  setTimeout(iniciarSwiper, 100);
}
