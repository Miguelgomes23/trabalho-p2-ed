// Cada operação (insert/extract) gera uma lista de "frames"; o Play/Step apenas navega por eles.
const $ = id => document.getElementById(id);
let modo = 'min', heap = [], frames = [], pos = 0, cmp = 0, swp = 0, timer = null;
// a tem prioridade sobre b? (menor no Min-Heap, maior no Max-Heap)
const acima = (a, b) => modo === 'min' ? a < b : a > b;

function setModo(m) {
  modo = m;
  $('mmin').classList.toggle('on', m === 'min'); $('mmin').setAttribute('aria-pressed', m === 'min');
  $('mmax').classList.toggle('on', m === 'max'); $('mmax').setAttribute('aria-pressed', m === 'max');
  $('tit').textContent = (m === 'min' ? 'Min-Heap' : 'Max-Heap') + ' passo a passo';
  $('regra').textContent = m === 'min'
    ? 'Todo pai é menor ou igual aos filhos, então o menor valor fica sempre na raiz.'
    : 'Todo pai é maior ou igual aos filhos, então o maior valor fica sempre na raiz.';
  reset();
}
function reset() {
  stop(); heap = []; cmp = 0; swp = 0; pos = 0;
  frames = [{ arr: [], hl: [], log: 'Heap vazio. Insira valores ou escolha um cenário.', c: 0, s: 0 }];
  render();
}
function snap(hl, log) { frames.push({ arr: [...heap], hl, log, c: cmp, s: swp }); }
function swap(a, b) { [heap[a], heap[b]] = [heap[b], heap[a]]; swp++; }

function insert(v) {
  if (heap.length >= 31) { snap([], 'Limite de 31 elementos no simulador.'); return; }
  heap.push(v); let i = heap.length - 1;
  snap([i], `Insere ${v} no fim do array (índice ${i}).`);
  while (i > 0) {
    const p = (i - 1) >> 1; cmp++;
    if (acima(heap[i], heap[p])) {
      snap([i, p], `${heap[i]} ${modo === 'min' ? '<' : '>'} pai ${heap[p]}: troca (sift-up).`);
      swap(i, p); i = p;
      snap([i], `${heap[i]} subiu para o índice ${i}.`);
    } else { snap([i, p], `${heap[i]} ${modo === 'min' ? '≥' : '≤'} pai ${heap[p]}: parou.`); return; }
  }
  snap([0], `${heap[0]} chegou à raiz.`);
}

function extract() {
  if (!heap.length) { snap([], 'Heap vazio: nada para extrair.'); return; }
  const root = heap[0], last = heap.pop();
  if (!heap.length) { snap([], `Extraiu ${root}. O heap ficou vazio.`); return; }
  heap[0] = last;
  snap([0], `Extrai a raiz ${root}. O último elemento (${last}) vai para a raiz.`);
  let i = 0; const n = heap.length, qual = modo === 'min' ? 'menor' : 'maior';
  while (true) {
    const l = 2 * i + 1, r = l + 1; let m = i;
    if (l < n) { cmp++; if (acima(heap[l], heap[m])) m = l; }
    if (r < n) { cmp++; if (acima(heap[r], heap[m])) m = r; }
    if (m === i) { snap([i], `${heap[i]} ${modo === 'min' ? '≤' : '≥'} filhos: parou (sift-down).`); return; }
    snap([i, m], `${heap[i]} ${modo === 'min' ? '>' : '<'} ${qual} filho ${heap[m]}: troca (sift-down).`);
    swap(i, m); i = m;
    snap([i], `${heap[i]} desceu para o índice ${i}.`);
  }
}

function peek() {
  snap(heap.length ? [0] : [], heap.length
    ? `peek: a raiz (${modo === 'min' ? 'mínimo' : 'máximo'}) é ${heap[0]} (sem trocas, O(1)).` : 'peek: heap vazio.');
}

function xy(i) { const lv = Math.floor(Math.log2(i + 1)), k = i - (2 ** lv - 1); return [(k + .5) / 2 ** lv * 720, 30 + lv * 60]; }

function render() {
  const f = frames[pos];
  let svg = '';
  f.arr.forEach((_, i) => { if (i) { const [a, b] = xy(i), [c, d] = xy((i - 1) >> 1); svg += `<line class="edge" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`; } });
  f.arr.forEach((v, i) => { const [x, y] = xy(i); svg += `<g class="node${f.hl.includes(i) ? ' hot' : ''}"><circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y}">${v}</text></g>`; });
  $('tree').innerHTML = svg;
  $('arr').innerHTML = f.arr.map((v, i) => `<div class="cell${f.hl.includes(i) ? ' hot' : ''}">${v}<small>${i}</small></div>`).join('');
  $('mc').textContent = f.c; $('ms').textContent = f.s; $('mn').textContent = f.arr.length;
  $('mp').textContent = `${pos}/${frames.length - 1}`;
  $('log').innerHTML = frames.slice(1, pos + 1).reverse().map(x => `<li>${x.log}</li>`).join('') || `<li>${frames[0].log}</li>`;
}

function next() { if (pos < frames.length - 1) { pos++; render(); } else stop(); }
function stop() { clearInterval(timer); timer = null; if ($('play')) $('play').textContent = 'Executar'; }
function play() {
  if (timer) { stop(); return; }
  $('play').textContent = 'Pausar'; timer = setInterval(next, 700);
}
function load(list) { reset(); list.forEach(insert); pos = 0; render(); }
const cresc = [1, 2, 3, 4, 5, 6, 7, 8, 9], decresc = [9, 8, 7, 6, 5, 4, 3, 2, 1];

$('ins').onclick = () => {
  const nums = $('val').value.split(/[\s,;]+/).filter(Boolean).map(Number).filter(Number.isFinite);
  if (!nums.length) { $('val').focus(); return; }
  nums.forEach(insert); $('val').value = ''; render();
};
$('ext').onclick = () => { extract(); render(); };
$('peek').onclick = () => { peek(); render(); };
$('play').onclick = play;
$('step').onclick = () => { stop(); next(); };
$('reset').onclick = reset;
$('mmin').onclick = () => setModo('min');
$('mmax').onclick = () => setModo('max');
$('avg').onclick = () => load([5, 3, 8, 1, 9, 2, 7]);
// Pior caso: cada novo valor tem prioridade sobre todos e sobe até a raiz (decrescente no min, crescente no max).
$('worst').onclick = () => load(modo === 'min' ? decresc : cresc);
// Melhor caso: cada novo valor já está abaixo do pai e não troca (o oposto).
$('best').onclick = () => load(modo === 'min' ? cresc : decresc);
setModo('min');
