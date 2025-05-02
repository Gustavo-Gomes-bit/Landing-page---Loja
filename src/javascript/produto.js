import { db } from './firebase-init.js';
import { doc, getDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import { adicionarAoCarrinho, comprarProdutoViaWhatsApp } from './carrinho.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const categoria = urlParams.get('categoria');

  if (!id || !categoria) {
    document.getElementById('produto-detalhes').innerHTML = '<p>Produto não encontrado, caso seja um produto que estava a venda e a pagina não esta carregando os detalhes dele, entre em contato com a Jana, basta clicar no icone do WhatsApp abaixo</p>';
    return;
  }

  try {
    const produtoRef = doc(db, `Categorias/${categoria}/Produtos/${id}`);
    const produtoSnap = await getDoc(produtoRef);

    if (produtoSnap.exists()) {
      const dados = produtoSnap.data();

      // Coletar imagens dinâmicas
      const imagens = [];

      if (dados.imagem1) imagens.push(dados.imagem1);
      if (dados.imagem2) imagens.push(dados.imagem2);
      if (dados.imagem3) imagens.push(dados.imagem3);
      if (dados.imagem4) imagens.push(dados.imagem4);
      if (dados.imagem5) imagens.push(dados.imagem5);

      // Se não existir imagem1, usa "imagem" padrão
      if (imagens.length === 0) {
        imagens.push(dados.imagem);
      }

      // Construção do HTML
      document.getElementById('produto-detalhes').innerHTML = `
        <section class="produto-info">
          <div class="produto-imagem">
            <div class="swiper">
              <div class="swiper-wrapper">
                ${imagens.map(url => `
                  <div class="swiper-slide">
                    <img src="${url}" alt="${dados.nome}" />
                  </div>
                `).join('')}
              </div>
              <div class="swiper-pagination"></div>
            </div>
          </div>
          <div class="produto-descricao">
            <h1>${dados.nome}</h1>
            <p>${dados.descricao}</p>
            <h2>Preço: ${dados.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</h2>
            <div class="botoes-produto">
              <button class="btn-comprar btn-default" data-id="${id}" data-nome="${dados.nome}" data-preco="${dados.preco}">
                <i class="fa-solid fa-money-check-dollar"></i> Comprar
              </button>
              <button class="btn-add-carrinho btn-default" data-id="${id}" data-nome="${dados.nome}" data-preco="${dados.preco}">
                <i class="fa-solid fa-cart-shopping"></i> Adicionar
              </button>
              <button class="voltar btn-default" onclick="history.back()">Voltar</button>
            </div>
          </div>
          <div class="quantidade-container" style="display: none;">
              <div class="quantidade-controles">
                <button class="cancel"><i class="fa-solid fa-ban"></i></button>
                <button class="diminuir-qtd">-</button>
                <span class="quantidade-valor">1</span>
                <button class="aumentar-qtd">+</button>
              </div>
              <button class="confirmar-qtd">Confirmar</button>
            </div>
        </section>
      `;

      const btnBuy = document.querySelector(".btn-comprar")
      const btnAdd = document.querySelector(".btn-add-carrinho");
      const qtdContainer = document.querySelector(".quantidade-container");
      const btnCancel = document.querySelector(".cancel");
      const btnMais = document.querySelector(".aumentar-qtd");
      const qtdValor = document.querySelector(".quantidade-valor");
      const btnMenos = document.querySelector(".diminuir-qtd");
      const btnConfirmar = document.querySelector(".confirmar-qtd");

      let quantidade = 1;

      btnBuy.addEventListener("click", () => {
        const nome = dados.nome;
        const preco = dados.preco;
        comprarProdutoViaWhatsApp(nome, preco);
      });
      
      btnAdd.addEventListener("click", () => {
        btnBuy.style.display = "none";
        qtdContainer.style.display = "flex";
        quantidade = 1;
        qtdValor.textContent = quantidade;
      });

      btnCancel.addEventListener("click", () => {
        qtdContainer.style.display = "none";
        btnBuy.style.display = "";
      });

      btnMais.addEventListener("click", () => {
        quantidade++;
        qtdValor.textContent = quantidade;
      });

      btnMenos.addEventListener("click", () => {
        if (quantidade > 1) {
          quantidade--;
          qtdValor.textContent = quantidade;
        }
      });

      btnConfirmar.addEventListener("click", () => {
        adicionarAoCarrinho(id, dados.nome, dados.preco, quantidade);
        qtdContainer.style.display = "none";
        btnBuy.style.display = "";
      });

      // Inicializar o Swiper para as imagens
      new Swiper('.swiper', {
        loop: true,
        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },
        slidesPerView: 1,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });

      await carregarRecomendacoes(categoria, id);

    } else {
      document.getElementById('produto-detalhes').innerHTML = '<p>Produto não encontrado.</p>';
    }
  } catch (error) {
    console.error("Erro ao carregar o produto:", error);
    document.getElementById('produto-detalhes').innerHTML = '<p>Erro ao carregar o produto.</p>';
  }
});

async function carregarRecomendacoes(categoria, idAtual) {
  const produtosRef = collection(db, `Categorias/${categoria}/Produtos`);
  const snapshot = await getDocs(produtosRef);
  const todosProdutos = [];

  snapshot.forEach(doc => {
    if (doc.id !== idAtual) {
      todosProdutos.push({ id: doc.id, ...doc.data() });
    }
  });

  // Embaralhar e pegar os 3 primeiros
  const recomendados = todosProdutos.sort(() => 0.5 - Math.random()).slice(0, 3);

  const container = document.createElement('section');
  container.classList.add('recomendados');
  container.innerHTML = `
    <section class="recomendados">
      <h3>Você também pode gostar:</h3>
      <div class="recomendados-lista">
        ${recomendados.map(prod => `
          <div class="recomendado-item" onclick="window.location.href='produto.html?id=${prod.id}&categoria=${categoria}'">
            <img src="${prod.imagem || prod.imagem1}" alt="${prod.nome}">
            <h4>${prod.nome}</h4>
            <p>${prod.preco.toLocaleString("pt-BR", {style: "currency", currency: "BRL",})}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  document.getElementById('produto-detalhes').appendChild(container);
}