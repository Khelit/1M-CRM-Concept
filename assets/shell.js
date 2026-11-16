/* Prototype shell: top strip, side panel, state switch, play mode, icons, meta pages.
   Nothing is saved except two viewer conveniences (panel hidden, play on). Data: steps.js */
(function () {
  const P = window.PROTO, steps = P.steps;
  const root = document.currentScript.src.replace(/assets\/shell\.js.*$/, '');
  const qs = new URLSearchParams(location.search);
  const thumb = qs.has('thumb');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const byId = id => steps.find(s => s.id === id);
  const url = s => root + s.file + (store.get('proto-play') ? '' : '');
  const gapsFor = id => P.gaps.filter(g => g.step === id);

  // ---- icons (24px line icons, Lucide-style) ----
  const I = {
    bed:'M2 18v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7M2 14h20M6 9V6h5v3M2 18v2M22 18v2',
    broom:'M14 4l6 6M12 6l6 6-7 8-8-1-1-8z M7 13l4 4',
    check:'M4 12l5 5L20 6', x:'M6 6l12 12M18 6L6 18', clock:'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    alert:'M12 9v4M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
    user:'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', users:'M16 21a6 6 0 0 0-12 0M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21a6 6 0 0 0-4-5.6M16 4.3a4 4 0 0 1 0 7.4',
    phone:'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2',
    chat:'M21 12a8 8 0 0 1-11.8 7L3 21l2-6.2A8 8 0 1 1 21 12z', ai:'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
    home:'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', inbox:'M3 13h5l1 3h6l1-3h5M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z',
    list:'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01', cal:'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4',
    chart:'M4 20V10M10 20V4M16 20v-7M22 20H2', gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    lock:'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4', eye:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    eyeoff:'M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7a9.8 9.8 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2',
    key:'M15 7a4 4 0 1 1-3.9 5H3v3h3v3h3v-3h2.1A4 4 0 0 1 15 7z', door:'M5 21V3h11v18M16 5h3v16h-3M12 12h.01M3 21h18',
    bag:'M6 7h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM9 7V4h6v3M9 11v6M15 11v6', shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    camera:'M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    offline:'M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.3-1.7M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8A15 15 0 0 0 10.7 5M12 20h.01',
    upload:'M12 15V3M7 8l5-5 5 5M4 15v5h16v-5', download:'M12 3v12M7 10l5 5 5-5M4 15v5h16v-5', file:'M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6',
    print:'M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z', qr:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14v.01M14 20h.01M17 17h4v4h-4',
    cash:'M2 6h20v12H2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 12h.01M18 12h.01', card:'M2 5h20v14H2zM2 10h20M6 15h4',
    search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5', plus:'M12 5v14M5 12h14', right:'M5 12h14M13 6l6 6-6 6', left:'M19 12H5M11 6l-6 6 6 6',
    down:'M6 9l6 6 6-6', drag:'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01', tree:'M5 3v18M5 8h6M5 16h6M11 5h8v6h-8zM11 13h8v6h-8z',
    building:'M4 21V3h12v18M16 9h4v12M8 7h4M8 11h4M8 15h4M2 21h20', layers:'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5', filter:'M3 5h18l-7 8v6l-4 2v-8z',
    star:'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z', flag:'M4 21V4M4 4h13l-2 4 2 4H4',
    refresh:'M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6', link:'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
    copy:'M9 9h11v11H9zM5 15H4V4h11v1', pen:'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z', idcard:'M3 5h18v14H3zM9 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM5.5 17a3.5 3.5 0 0 1 7 0M15 9h3M15 13h3',
    moon:'M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z', play:'M7 4l13 8-13 8z', pause:'M7 4h4v16H7zM13 4h4v16h-4z', panel:'M3 4h18v16H3zM15 4v16',
    map:'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14', wrench:'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z',
    send:'M22 2L11 13M22 2l-7 20-4-9-9-4z', money:'M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'
  };
  function sprite() {
    const s = Object.entries(I).map(([k, d]) => `<symbol id="i-${k}" viewBox="0 0 24 24"><path d="${d}"/></symbol>`).join('');
    const w = el('div'); w.style.display = 'none';
    w.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
    document.body.prepend(w);
  }
  window.icon = (n, c) => `<svg class="ic ${c || ''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;

  // ---- states: sibling <section class="state" data-state data-label> ----
  function setupStates(container) {
    const states = [...container.querySelectorAll('section.state')];
    if (!states.length) return null;
    const bar = el('div', 'proto-states');
    const show = name => {
      states.forEach(s => s.hidden = s.dataset.state !== name);
      [...bar.children].forEach(b => b.classList.toggle('on', b.dataset.s === name));
    };
    if (states.length > 1) states.forEach(s => {
      const b = el('button', null, s.dataset.label || s.dataset.state);
      b.dataset.s = s.dataset.state; b.type = 'button';
      b.onclick = () => { stopPlay(); show(s.dataset.state); };
      bar.append(b);
    });
    // any element with data-show="state" switches state (a click only changes what is shown)
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-show]');
      if (t) { e.preventDefault(); show(t.dataset.show); }
    });
    show(qs.get('state') || states[0].dataset.state);
    return { bar, names: states.map(s => s.dataset.state), show };
  }

  // ---- play mode ----
  let timer = null;
  const PLAY_MS = 3200;
  function stopPlay() { if (timer) clearTimeout(timer); timer = null; store.set('proto-play', null); const p = document.querySelector('.play-progress'); if (p) p.remove(); const b = document.querySelector('.ps-btn.play'); if (b) b.innerHTML = icon('play') + ' Play the whole story'; }
  function runPlay(st, next) {
    const names = st ? st.names : [null]; let i = 0;
    const bar = el('div', 'play-progress'); document.body.append(bar);
    const total = names.length * PLAY_MS; const t0 = Date.now();
    const tick = () => { bar.style.width = Math.min(100, (Date.now() - t0) / total * 100) + '%'; if (timer) requestAnimationFrame(tick); };
    const step = () => {
      if (i < names.length) { if (st) st.show(names[i]); i++; timer = setTimeout(step, PLAY_MS); }
      else if (next) location.href = url(next);
      else stopPlay();
    };
    timer = 1; step(); tick();
  }

  // ---- screen page ----
  function screenPage(s) {
    const i = steps.indexOf(s), prev = steps[i - 1], next = steps[i + 1];
    const partSteps = steps.filter(x => x.part === s.part);
    document.title = `${s.id} · ${s.title}`;
    const stage = el('main', 'proto-stage');
    while (document.body.firstChild) stage.append(document.body.firstChild);
    const st = setupStates(stage);
    if (st && st.bar.children.length) stage.prepend(st.bar);
    if (thumb) { document.body.classList.add('thumb'); document.body.append(stage); return; }

    const strip = el('header', 'proto-strip');
    strip.innerHTML = `
      <a class="ps-btn" href="${root}index.html">${icon('map')} Map</a>
      <span class="ps-part">Part ${s.part} · ${s.part === 'A' ? 'Creating the CRM' : 'Using the CRM'}</span>
      <nav class="ps-dots">${partSteps.map(x => `<a class="ps-dot ${x === s ? 'on' : ''} ${gapsFor(x.id).length ? 'gap' : ''}" href="${url(x)}" title="${x.id} ${x.title}">${x.id.slice(1)}</a>`).join('')}</nav>
      <span class="ps-title">${s.id} · ${s.title}</span>
      <a class="ps-btn" ${prev ? `href="${url(prev)}"` : 'aria-disabled="true"'}>${icon('left')} Previous</a>
      <a class="ps-btn" ${next ? `href="${url(next)}"` : `href="${root}gaps.html"`}>Next ${icon('right')}</a>
      <button class="ps-btn play" type="button">${icon('play')} Play the whole story</button>
      <button class="ps-btn tog" type="button" title="Show or hide the step card (P)">${icon('panel')} Step card</button>`;
    const gaps = gapsFor(s.id);
    const panel = el('aside', 'proto-panel');
    panel.innerHTML = `
      <div class="eyebrow">Step ${s.id} · ${s.group}</div>
      <h2>${s.title}</h2>
      ${s.plain ? `<div class="plain"><b>In simple words</b>${s.plain}</div>` : ''}
      <dl><dt>Who</dt><dd>${s.who}</dd><dt>Device</dt><dd>${s.device}</dd>
          <dt>Does</dt><dd>${s.does}</dd><dt>Produces</dt><dd>${s.produces}</dd></dl>
      <h3>Step card</h3>
      <dl><dt>Just before</dt><dd>${s.before}</dd><dt>Sees, decides</dt><dd>${s.sees}</dd>
          <dt>Next</dt><dd>${s.next}</dd><dt>Can go wrong</dt><dd>${s.wrong}</dd></dl>
      ${st && st.names.length > 1 ? `<h3>States on this screen</h3><p>${[...st.bar.children].map(b => b.textContent).join(' · ')}</p>` : ''}
      <h3>Gaps found here</h3>
      ${gaps.length ? gaps.map(g => `<div class="gapitem"><b>${g.id}</b> ${g.missing}<br><span class="muted">Did:</span> ${g.added}${g.decide ? `<br><span class="muted">Needs decision:</span> ${g.decide}` : ''}</div>`).join('') : '<p class="muted">None.</p>'}
      <h3>Checked against</h3><p class="muted small">${s.sources}</p>`;
    const body = el('div', 'proto-body'); body.append(stage, panel);
    document.body.append(strip, body);
    if (store.get('proto-panel') === 'hidden') document.body.classList.add('panel-hidden');
    const tog = () => { const h = document.body.classList.toggle('panel-hidden'); store.set('proto-panel', h ? 'hidden' : null); };
    strip.querySelector('.tog').onclick = tog;
    const playBtn = strip.querySelector('.play');
    playBtn.onclick = () => {
      if (store.get('proto-play')) return stopPlay();
      store.set('proto-play', '1'); playBtn.innerHTML = icon('pause') + ' Stop'; runPlay(st, next);
    };
    document.addEventListener('keydown', e => {
      if (e.target.closest('input,textarea')) return;
      if (e.key === 'ArrowRight' && next) location.href = url(next);
      if (e.key === 'ArrowLeft' && prev) location.href = url(prev);
      if (e.key === 'p' || e.key === 'P') tog();
      if (e.key === 'Escape') stopPlay();
    });
    if (store.get('proto-play')) { playBtn.innerHTML = icon('pause') + ' Stop'; runPlay(st, next); }
    // data-go="B02" on any element jumps to that step
    // data-go="B02" jumps to that step; data-go="A18:ready" opens it in a given state
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-go]'); if (!t) return;
      e.preventDefault(); const [id, st] = t.dataset.go.split(':');
      location.href = url(byId(id)) + (st ? '?state=' + st : '');
    });
  }

  // ---- meta pages ----
  const tile = s => `<a class="tile ${gapsFor(s.id).some(g => /^New /.test(g.added)) ? 'added' : ''}" href="${url(s)}">
      <div class="shot ${s.device === 'phone' ? 'ph' : ''}"><iframe loading="lazy" tabindex="-1" src="${root + s.file}?thumb" title=""></iframe></div>
      <div class="tb"><div class="tn">${s.id}${gapsFor(s.id).length ? ' · <span style="color:var(--brass)">gap noted</span>' : ''}</div>
      <div class="tt">${s.title}</div><div class="tw">${icon(s.device === 'phone' ? 'phone' : s.device === 'paper' ? 'file' : 'layers')} ${s.who}</div></div></a>`;
  function groups(part) {
    const m = new Map(); steps.filter(s => s.part === part).forEach(s => { if (!m.has(s.group)) m.set(s.group, []); m.get(s.group).push(s); });
    return [...m];
  }
  function indexPage(main) {
    const startA = byId('A01'), startB = byId('B01');
    main.innerHTML = `
    <div class="meta-head"><div class="grow"><div class="eyebrow">Hotel Dhaulagiri Courtyard · 52 rooms · 65 staff · Kathmandu</div>
      <h1>The whole process, start to finish</h1>
      <p>Part A is how our operations person and the hotel's admin set the CRM up in five days. Part B follows one guest, Ramesh Adhikari, from his WhatsApp message to checkout. Click any tile to open that screen, or play the story.</p></div>
      <div class="row"><a class="btn btn--lg" href="${root}gaps.html">${icon('alert')} What was missing</a><a class="btn btn--lg" href="${root}coverage.html">${icon('list')} Coverage</a>
      <a class="btn btn--lg btn--primary" href="${url(startA)}" data-play>${icon('play')} Play the whole story</a></div></div>
    <div class="legend"><span>${icon('file')} worksheet, no software</span><span>${icon('layers')} office screen</span><span>${icon('phone')} staff phone</span><span><span class="chip chip--brass">gap noted</span> something was missing here</span><span style="border:1px solid var(--brass);padding:0 6px;border-radius:4px">brass border</span> = screen added because of a gap</div>
    <section class="part"><h2>Part A <span class="muted" style="font:400 15px var(--sans)">Creating the CRM · Settings mode · 18 steps + permit track</span></h2>
      ${groups('A').map(([g, ss]) => `<div class="day"><div class="day-label"><b>${g.split(' — ')[0]}</b><span class="muted small">${g.split(' — ')[1] || ''}</span></div><div class="tiles">${ss.map(tile).join('')}</div></div>`).join('')}
    </section>
    <section class="part"><h2>Part B <span class="muted" style="font:400 15px var(--sans)">Using the CRM · Work and Analyze modes · one guest's journey</span></h2>
      <div class="journey" style="margin-top:16px">${groups('B').map(([g, ss]) => `<div class="leg"><div class="leg-h">${g}</div><div class="tiles">${ss.map(tile).join('')}</div></div>`).join('')}</div>
    </section>`;
    main.querySelector('[data-play]').onclick = () => store.set('proto-play', '1');
  }
  function gapsPage(main) {
    main.innerHTML = `<div class="meta-head"><div class="grow"><div class="eyebrow">Running list kept while designing</div><h1>What was missing</h1>
      <p>Everything the source documents did not say, where it was found, what the prototype does about it, and what still needs your decision.</p></div>
      <a class="btn btn--lg" href="${root}index.html">${icon('map')} Back to the map</a></div>
      <div class="card"><table class="tbl"><thead><tr><th>Gap</th><th>Step</th><th>What was missing</th><th>What we added</th><th>Needs your decision</th></tr></thead><tbody>
      ${P.gaps.map(g => { const s = byId(g.step); return `<tr><td class="mono">${g.id}</td><td><a href="${url(s)}">${s.id} ${s.title}</a></td><td>${g.missing}</td><td>${g.added}</td><td>${g.decide ? `<b style="color:var(--brass)">${g.decide}</b>` : '<span class="muted">No</span>'}</td></tr>`; }).join('')}
      </tbody></table></div>`;
  }
  function coveragePage(main) {
    const none = P.coverage.filter(c => !c[2]).length;
    main.innerHTML = `<div class="meta-head"><div class="grow"><div class="eyebrow">Hotel requirement document vs. screens</div><h1>Coverage</h1>
      <p>Every area of the hotel requirement document and the screens that show it. <span class="miss">${none} areas have no screen</span>; each says why.</p></div>
      <a class="btn btn--lg" href="${root}index.html">${icon('map')} Back to the map</a></div>
      <div class="card"><table class="tbl"><thead><tr><th>Requirement doc §</th><th>What the hotel needs</th><th>Screens that show it</th><th>Note</th></tr></thead><tbody>
      ${P.coverage.map(([sec, req, scr, note]) => `<tr ${scr ? '' : 'class="late"'}><td class="mono">${sec}</td><td>${req}</td><td>${scr ? scr.split(' ').map(id => `<a class="chip chip--pine" href="${url(byId(id))}">${id}</a>`).join(' ') : `<span class="miss">${icon('x')} No screen</span>`}</td><td class="muted">${note || ''}</td></tr>`).join('')}
      </tbody></table></div>`;
  }

  // Sidebar items and mode tabs jump to the screen that shows them (matched by label).
  const NAV = {
    'Departments':'A05','Roles & access':'A06','Objects & fields':'A07','Identity rule':'A08','Record layouts':'A09',
    'Workflows':'A10','Rooms & rates':'A11','Handoff rules':'A12','Saved views':'A13','Navigation':'A14',
    'Import':'A15','Users':'A16','Test run':'A17','Publish':'A18',
    'My Work':'B04','Pending drafts':'B01','Arrivals today':'B06','Departures today':'B09a','In-house':'B03',
    'Pipeline':'B08a','Room status':'B08b','Bills':'B10','Unpaid bills':'B09a','Shift close & day end':'B11a','Live dashboard':'B08a','Reports':'B11b','Tasks late':'B08a',
    'Work':'B04','Analyze':'B08a','Settings':'A05'
  };
  function wireNav() {
    document.querySelectorAll('.side a, .modes span').forEach(a => {
      if (a.dataset.go) return;
      const id = NAV[a.textContent.replace(/\d+$/, '').trim()];
      if (id && id !== document.body.dataset.step) { a.dataset.go = id; a.style.cursor = 'pointer'; }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    sprite();
    const b = document.body;
    if (b.dataset.step) { wireNav(); return screenPage(byId(b.dataset.step)); }
    const main = el('main', 'metapage'); b.append(main);
    ({ index: indexPage, gaps: gapsPage, coverage: coveragePage })[b.dataset.page](main);
  });
})();
