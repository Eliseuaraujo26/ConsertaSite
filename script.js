// Função para redirecionar para o WhatsApp
function redirectWhatsApp(url) {
  // Se for um dispositivo móvel, redireciona diretamente; caso contrário, abre em nova aba.
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.href = url;
  } else {
    window.open(url, '_blank');
  }
}

// Função para trocar de seção com animação de fade
function switchSection(targetSectionId) {
  const currentSection = document.querySelector("section:not(.hidden)");
  if (currentSection && currentSection.id !== targetSectionId) {
    currentSection.classList.add("fade-out");
    setTimeout(() => {
      currentSection.classList.add("hidden");
      currentSection.classList.remove("fade-out", "fade-in");
      const targetSection = document.getElementById(targetSectionId);
      targetSection.classList.remove("hidden");
      targetSection.classList.add("fade-in");
      setTimeout(() => {
        targetSection.classList.remove("fade-in");
      }, 500);
    }, 500);
  } else {
    const targetSection = document.getElementById(targetSectionId);
    targetSection.classList.remove("hidden");
    targetSection.classList.add("fade-in");
    setTimeout(() => {
      targetSection.classList.remove("fade-in");
    }, 500);
  }
}

// Exibir/esconder seções ao clicar nos botões do menu
const menuButtons = document.querySelectorAll('.menu-btn');
menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    const homeSection = document.getElementById('home');
    if (homeSection && !homeSection.classList.contains("hidden")) {
      homeSection.classList.add("fade-out");
      setTimeout(() => {
        homeSection.classList.add("hidden");
        homeSection.classList.remove("fade-out", "fade-in");
      }, 500);
    }
    const formId = button.getAttribute('data-form');
    switchSection(formId);
    if (formId === 'manutencao') {
      const dataInput = document.getElementById('data-manutencao');
      let hoje = new Date().toISOString().split("T")[0];
      dataInput.setAttribute('min', hoje);
    }
  });
});

// Toggle para o menu mobile (hamburger)
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Toggle para alternar entre modo escuro e claro
const toggleTheme = document.getElementById("toggleTheme");
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  toggleTheme.textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙";
});

// Função de validação customizada para cada campo
function validarCampo(input, errorSpan, mensagemErro) {
  if (!input.value.trim()) {
    errorSpan.textContent = mensagemErro;
    errorSpan.style.display = "block";
    return false;
  } else if (input.hasAttribute("pattern")) {
    let regex = new RegExp(input.getAttribute("pattern"));
    if (!regex.test(input.value.trim())) {
      errorSpan.textContent = "Formato inválido.";
      errorSpan.style.display = "block";
      return false;
    }
  }
  errorSpan.textContent = "";
  errorSpan.style.display = "none";
  return true;
}

// Adiciona validação no evento blur para cada input
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("blur", () => {
    const errorSpan = document.getElementById(`error-${input.id}`);
    let mensagemErro = "Este campo é obrigatório.";
    validarCampo(input, errorSpan, mensagemErro);
  });
});

// Função para exibir o toast (notificação)
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Função para enviar via WhatsApp com feedback, spinner e validação
function enviarWhatsApp(formId, mensagemTemplate, feedbackId) {
  const form = document.getElementById(formId);
  const feedback = document.getElementById(feedbackId);
  const spinner = document.getElementById(`spinner-${formId.split('-')[1]}`);
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let camposValidos = true;
    form.querySelectorAll("input").forEach(input => {
      const errorSpan = document.getElementById(`error-${input.id}`);
      let mensagemErro = "Este campo é obrigatório.";
      if (!validarCampo(input, errorSpan, mensagemErro)) {
        camposValidos = false;
      }
    });
    
    if (!camposValidos) {
      showToast("Por favor, corrija os erros antes de enviar.");
      return;
    }
    
    const formData = new FormData(form);
    let mensagem = mensagemTemplate;
    for (let [key, value] of formData.entries()) {
      mensagem += `\n${key}: ${value}`;
    }
    
    feedback.textContent = "Enviando sua mensagem, aguarde...";
    feedback.style.display = "block";
    spinner.style.display = "block";
    
    const botaoSubmit = form.querySelector("button[type='submit']");
    botaoSubmit.disabled = true;
    
    setTimeout(() => {
      const mensagemEncode = encodeURIComponent(mensagem);
      const numeroWhats = "32988160203";
      const url = `https://wa.me/${numeroWhats}?text=${mensagemEncode}`;
      redirectWhatsApp(url);
      
      feedback.textContent = "Mensagem enviada! Redirecionando...";
      spinner.style.display = "none";
      showToast("Sua mensagem foi enviada com sucesso!");
      
      setTimeout(() => {
        feedback.style.display = "none";
        botaoSubmit.disabled = false;
        form.reset();
      }, 1500);
    }, 1500);
  });
}

// Configura cada formulário com sua mensagem personalizada
enviarWhatsApp(
  'form-consultar', 
  'Olá, tudo bem? Gostaria de consultar minha Ordem de Serviço. Seguem meus dados:', 
  'feedback-consultar'
);
enviarWhatsApp(
  'form-orcamento', 
  'Olá, tudo bem? Gostaria de solicitar um orçamento para o serviço. Aqui estão minhas informações:', 
  'feedback-orcamento'
);
enviarWhatsApp(
  'form-manutencao', 
  'Olá, tudo bem? Quero agendar uma manutenção para meu aparelho. Seguem os detalhes:', 
  'feedback-manutencao'
);

// Botão "Voltar ao Topo"
const scrollToTopBtn = document.getElementById("scrollToTop");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
