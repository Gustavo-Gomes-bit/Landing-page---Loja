import "./swiper-init.js";
import { carregarProdutosPorCategoria } from "./categorias.js";
import { carregarAvaliacoes, enviarAvaliacao } from "./avaliacoes.js";
import { loginComGoogle } from "./auth.js";
import { carregarDestaques } from "./destaque.js";
import "./carrinho.js";
import "./destaque.js";

// Inicialização após DOM pronto
document.addEventListener("DOMContentLoaded", () => {
  carregarAvaliacoes();
  carregarDestaques();

  // categorias
  document.querySelectorAll(".categoria-card, .categoria-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      carregarProdutosPorCategoria(btn.dataset.categoria);
    })
  );

  // botões de login/avaliar
  document.addEventListener("click", async (e) => {
    if (e.target.id === "loginBtn" || e.target.id === "avaliarBtn") {
      const user = await loginComGoogle();
      if (!user) return;
      // enviarAvaliacao lida com inputs do formulário
      enviarAvaliacao();
    }

    if (e.target.id === "verTodas") {
      document.getElementById("modal").classList.remove("hidden");
    }
    if (e.target.id === "fecharModal") {
      document.getElementById("modal").classList.add("hidden");
    }
  });
});