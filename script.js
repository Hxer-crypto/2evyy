/* =========================================================
   ENROLADOS — 2 MESES DE LUZ — interações
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Céu: estrelas + lanternas flutuantes ---------- */
  const sky = document.getElementById('sky-layer');

  for (let i = 0; i < 70; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDelay = (Math.random() * 3) + 's';
    sky.appendChild(star);
  }

  function criarLanterna() {
    const lantern = document.createElement('div');
    lantern.className = 'floating-lantern';
    lantern.innerHTML = `<div class="string"></div><div class="top"></div><div class="body"></div><div class="bottom"></div>`;
    lantern.style.left = Math.random() * 96 + 'vw';
    const duration = 14 + Math.random() * 10;
    lantern.style.animationDuration = duration + 's';
    lantern.style.animationDelay = (Math.random() * -duration) + 's';
    const scale = 0.6 + Math.random() * 0.9;
    lantern.style.transform = `scale(${scale})`;
    sky.appendChild(lantern);
  }
  for (let i = 0; i < 14; i++) criarLanterna();

  /* ---------- 2. Rastro de flor mágica no cursor ---------- */
  let lastTrail = 0;
  window.addEventListener('pointermove', (e) => {
    const now = Date.now();
    if (now - lastTrail < 60) return;
    lastTrail = now;
    const f = document.createElement('div');
    f.className = 'flower-trail';
    f.textContent = Math.random() > 0.5 ? '✿' : '🌸';
    f.style.left = e.clientX + 'px';
    f.style.top = e.clientY + 'px';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 900);
  });

  /* ---------- 3. Capa: abrir o livro ---------- */
  const abrirBtn = document.getElementById('abrir-livro');
  const capa = document.getElementById('capa');
  const conteudo = document.getElementById('conteudo');
  const musicBtn = document.getElementById('music-btn');
  const musica = document.getElementById('musica-fundo');

  abrirBtn.addEventListener('click', () => {
    document.body.classList.remove('locked');
    capa.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    capa.style.opacity = '0';
    capa.style.transform = 'scale(0.96)';
    setTimeout(() => {
      capa.style.display = 'none';
      conteudo.classList.add('show');
      conteudo.scrollIntoView({ behavior: 'instant' });
    }, 850);

    // tenta iniciar a música suavemente
    if (musica) {
      musica.volume = 0.35;
      musica.play().catch(() => {});
      musicBtn.dataset.playing = 'true';
      musicBtn.textContent = '🎶';
    }
  });

  musicBtn.addEventListener('click', () => {
    if (!musica) return;
    if (musica.paused) {
      musica.play().catch(() => {});
      musicBtn.dataset.playing = 'true';
      musicBtn.textContent = '🎶';
    } else {
      musica.pause();
      musicBtn.dataset.playing = 'false';
      musicBtn.textContent = '🔇';
    }
  });

  /* ---------- 4. Pascal — indicador de progresso do scroll ---------- */
  const pascalFill = document.getElementById('pascal-fill');
  const pascal = document.getElementById('pascal');
  const emojisPascal = ['🦎','🦎','🦎'];

  function atualizarPascal() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    pascalFill.style.height = pct + '%';
    pascal.style.bottom = pct + '%';
  }
  window.addEventListener('scroll', atualizarPascal, { passive: true });
  atualizarPascal();

  setInterval(() => {
    pascal.classList.add('blink');
    setTimeout(() => pascal.classList.remove('blink'), 180);
  }, 3600);

  /* ---------- 5. Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- 6. Galeria + Lightbox ---------- */
  const fotos = Array.from(document.querySelectorAll('.foto-card'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('img');
  const lbLegenda = lightbox.querySelector('.lb-legenda');
  let fotoAtual = 0;

  function abrirLightbox(i) {
    fotoAtual = i;
    const card = fotos[i];
    lbImg.src = card.querySelector('img').src;
    lbLegenda.textContent = card.dataset.legenda || '';
    lightbox.classList.add('show');
  }
  fotos.forEach((card, i) => card.addEventListener('click', () => abrirLightbox(i)));

  lightbox.querySelector('.lb-fechar').addEventListener('click', () => lightbox.classList.remove('show'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('show'); });
  lightbox.querySelector('.lb-prev').addEventListener('click', () => abrirLightbox((fotoAtual - 1 + fotos.length) % fotos.length));
  lightbox.querySelector('.lb-next').addEventListener('click', () => abrirLightbox((fotoAtual + 1) % fotos.length));
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') lightbox.classList.remove('show');
    if (e.key === 'ArrowLeft') abrirLightbox((fotoAtual - 1 + fotos.length) % fotos.length);
    if (e.key === 'ArrowRight') abrirLightbox((fotoAtual + 1) % fotos.length);
  });

  /* ---------- 7. Quebra-cabeça deslizante 3x3 ---------- */
  const board = document.getElementById('puzzle-board');
  const msg = document.getElementById('puzzle-msg');
  const movesEl = document.getElementById('puzzle-moves');
  const SIZE = 3;
  let tiles = [];
  let moves = 0;

  function posBg(index) {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    return `${(col * 100) / (SIZE - 1)}% ${(row * 100) / (SIZE - 1)}%`;
  }

  function renderBoard() {
    board.innerHTML = '';
    tiles.forEach((val, idx) => {
      const piece = document.createElement('div');
      piece.className = 'puzzle-piece' + (val === SIZE * SIZE - 1 ? ' empty' : '');
      if (val !== SIZE * SIZE - 1) {
        piece.style.backgroundPosition = posBg(val);
      }
      piece.dataset.idx = idx;
      piece.addEventListener('click', () => tentarMover(idx));
      board.appendChild(piece);
    });
  }

  function indiceVazio() { return tiles.indexOf(SIZE * SIZE - 1); }

  function vizinhos(idx) {
    const row = Math.floor(idx / SIZE), col = idx % SIZE;
    const list = [];
    if (row > 0) list.push(idx - SIZE);
    if (row < SIZE - 1) list.push(idx + SIZE);
    if (col > 0) list.push(idx - 1);
    if (col < SIZE - 1) list.push(idx + 1);
    return list;
  }

  function tentarMover(idx) {
    const vazio = indiceVazio();
    if (vizinhos(idx).includes(vazio)) {
      [tiles[idx], tiles[vazio]] = [tiles[vazio], tiles[idx]];
      moves++;
      movesEl.textContent = `Movimentos: ${moves}`;
      renderBoard();
      checarVitoria();
    }
  }

  function checarVitoria() {
    const venceu = tiles.every((v, i) => v === i);
    if (venceu) {
      msg.textContent = '✨ Você montou nosso momento! Igual a nós, encaixou perfeitamente. ✨';
      lancarConfete(60);
    } else {
      msg.textContent = '';
    }
  }

  function embaralhar() {
    do {
      tiles = Array.from({ length: SIZE * SIZE }, (_, i) => i);
      // embaralha com movimentos válidos para garantir solução possível
      let vazio = SIZE * SIZE - 1;
      for (let i = 0; i < 200; i++) {
        const opcoes = vizinhos(vazio);
        const escolhido = opcoes[Math.floor(Math.random() * opcoes.length)];
        [tiles[vazio], tiles[escolhido]] = [tiles[escolhido], tiles[vazio]];
        vazio = escolhido;
      }
    } while (tiles.every((v, i) => v === i));
    moves = 0;
    movesEl.textContent = 'Movimentos: 0';
    msg.textContent = '';
    renderBoard();
  }

  document.getElementById('puzzle-embaralhar').addEventListener('click', embaralhar);
  embaralhar();

  /* ---------- 8. Confete ---------- */
  const coresConfete = ['#F4B942', '#E8A0BF', '#B79FD1', '#FFE29A', '#7B5AA6'];
  function lancarConfete(qtd = 50) {
    for (let i = 0; i < qtd; i++) {
      setTimeout(() => {
        const c = document.createElement('div');
        c.className = 'confete';
        c.style.left = Math.random() * 100 + 'vw';
        const size = 6 + Math.random() * 8;
        c.style.width = size + 'px';
        c.style.height = size * 0.6 + 'px';
        c.style.background = coresConfete[Math.floor(Math.random() * coresConfete.length)];
        c.style.opacity = 0.9;
        document.body.appendChild(c);
        const duration = 2400 + Math.random() * 1800;
        const drift = (Math.random() - 0.5) * 200;
        c.animate([
          { transform: `translate(0,0) rotate(0deg)`, offset: 0 },
          { transform: `translate(${drift}px, 100vh) rotate(${360 + Math.random()*360}deg)`, offset: 1 }
        ], { duration, easing: 'ease-in' }).onfinish = () => c.remove();
      }, i * 25);
    }
  }

  /* ---------- 9. Caixa de presente ---------- */
  const caixa = document.getElementById('caixa-presente');
  const revelado = document.getElementById('presente-revelado');
  caixa.addEventListener('click', () => {
    if (caixa.classList.contains('aberta')) return;
    caixa.classList.add('aberta');
    lancarConfete(90);
    setTimeout(() => revelado.classList.add('show'), 350);
  });

  /* ---------- 10. Efeito de digitação na carta ---------- */
  // (deixado como fade-in via IntersectionObserver acima, mais leve e acessível)

});
