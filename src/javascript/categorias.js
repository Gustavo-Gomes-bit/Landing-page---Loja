import { db } from './firebase-init.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

let swiperAtual = null;

export async function carregarProdutosPorCategoria(categoriaId) {
  const container = document.getElementById("produtos");
  const botaoFechar = document.getElementById("fechar-produtos");

  // Destroi o swiper anterior se existir
  if (swiperAtual) {
    swiperAtual.destroy(true, true);
    swiperAtual = null;
  }

  container.innerHTML = `
    <div class="swiper-container">
      <div class="swiper-wrapper"></div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
  `;

  const swiperWrapper = container.querySelector(".swiper-wrapper");

  const produtosCol = collection(db, `Categorias/${categoriaId}/Produtos`);
  const produtosSnap = await getDocs(produtosCol);

  if (produtosSnap.empty) {
    swiperWrapper.innerHTML = `<p style="text-align: center; padding: 20px;">Nenhum produto encontrado.</p>`;
  } else {
    produtosSnap.forEach((produtoDoc) => {
      const dados = produtoDoc.data();
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");

      slide.innerHTML = `
        <div class="produto-card">
          <img src="${dados.imagem}" alt="${dados.nome}">
          <h3 style="margin-top: 12px;">${dados.nome}</h3>
          <p style="color: #666; font-size: 14px;">${dados.descricao}</p>
          <p style="font-weight: bold; margin-top: 8px;">R$ ${dados.preco}</p>
        </div>
      `;
      swiperWrapper.appendChild(slide);
    });
  }

  // Mostra o botão "Fechar"
  botaoFechar.style.display = "block";

  if (!produtosSnap.empty) {
    produtosSnap.forEach((produtoDoc) => {
      const dados = produtoDoc.data();
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");

      slide.innerHTML = `
        <div class="produto-card">
          <img src="${dados.imagem}" alt="${dados.nome}">
          <h3 style="margin-top: 12px;">${dados.nome}</h3>
          <p style="color: #666; font-size: 14px;">${dados.descricao}</p>
          <p style="font-weight: bold; margin-top: 8px;">R$ ${dados.preco}</p>
        </div>
      `;
      swiperWrapper.appendChild(slide);
    });

    // Aguarda DOM atualizar para garantir que slides estão no lugar
    setTimeout(() => {
      swiperAtual = new Swiper(".swiper-container", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
    }, 100);
  }

  botaoFechar.style.display = "block";
}
