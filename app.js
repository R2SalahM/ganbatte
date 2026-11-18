/* Ahmed's phone — a Civic Service application, told as an iPhone you can explore.
   Plain JS, no build step: deployable as-is on GitHub Pages. */
(() => {
  'use strict';

  // ---------- Contact details (edit here) ----------
  const CONFIG = {
    name: 'Ahmed Moussa',
    email: 'moussaahmed.pro@gmail.com',
    phone: '+33668072698',
    phoneDisplay: '+33 6 68 07 26 98',
    linkedin: '', // e.g. 'https://www.linkedin.com/in/…' — the LinkedIn button stays disabled while empty
    pdf: 'assets/GANBATTE-Ahmed-Moussa.pdf',
  };

  // ---------- Small helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPRING = 'cubic-bezier(.22, 1, .36, 1)';
  const D = (ms) => (reduced ? 1 : ms);

  const screen = $('#screen');
  const home = $('#home');
  const lock = $('#lock');
  const windows = $('#windows');
  const homebar = $('#homebar');

  const chevBack = '<svg viewBox="0 0 12 20"><path d="M10 2 2 10l8 8"/></svg>';
  const chevRight = '<svg class="chev" viewBox="0 0 8 14"><path d="m1 1 6 6-6 6"/></svg>';
  const planeSvg = '<svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5Z"/></svg>';

  // ---------- App icons (drawn, not borrowed) ----------
  const ICONS = {
    messages: `<svg viewBox="0 0 60 60"><defs><linearGradient id="gm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#67F07F"/><stop offset="1" stop-color="#16C23A"/></linearGradient></defs><rect width="60" height="60" fill="url(#gm)"/><path d="M30 14c-10.5 0-19 6.6-19 14.8 0 4.7 2.8 8.9 7.2 11.6-.4 2.4-1.6 4.6-3.4 6.2 3.6-.2 6.9-1.6 9.3-3.8 1.9.5 3.8.7 5.9.7 10.5 0 19-6.6 19-14.8S40.5 14 30 14Z" fill="#fff"/></svg>`,
    mail: `<svg viewBox="0 0 60 60"><defs><linearGradient id="gml" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EB2FF"/><stop offset="1" stop-color="#1468F2"/></linearGradient></defs><rect width="60" height="60" fill="url(#gml)"/><rect x="11" y="17" width="38" height="27" rx="4" fill="#fff"/><path d="m12.5 19.5 17.5 13 17.5-13" fill="none" stroke="#1E88F7" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
    wallet: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#111"/><rect x="11" y="13" width="38" height="12" rx="3" fill="#ED706B"/><rect x="11" y="19" width="38" height="12" rx="3" fill="#F6D397"/><rect x="11" y="25" width="38" height="12" rx="3" fill="#1F3B73"/><path d="M9 33h42v12a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4Z" fill="#2B2B2E"/><path d="M9 33h17a4 4 0 0 0 8 0h17" fill="none" stroke="#111" stroke-width="1.5"/></svg>`,
    notes: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#fff"/><rect width="60" height="17" fill="#FFD43B"/><g stroke="#D7D7DB" stroke-width="1.6"><path d="M8 28h44M8 36h44M8 44h44M8 52h44"/></g><g fill="#B8B8BD"><circle cx="13" cy="11" r="0"/></g></svg>`,
    photos: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#fff"/><g transform="translate(30 30)">${['#FFC93C', '#F99A3D', '#ED706B', '#C35FA6', '#7C6CD9', '#3EA7E8', '#46C47C', '#A9D85A'].map((c, i) => `<ellipse rx="6.5" ry="11.5" cy="-9" fill="${c}" opacity=".88" transform="rotate(${i * 45})"/>`).join('')}</g></svg>`,
    maps: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#E4EFD9"/><path d="M0 40c14-4 22 8 36 4s18-8 24-6v22H0Z" fill="#9FD3EA"/><path d="M-2 22 62 30" stroke="#fff" stroke-width="5"/><path d="M22 -2 30 62" stroke="#F6D397" stroke-width="5"/><path d="M38 12c-4 0-7 3-7 7 0 5 7 12 7 12s7-7 7-12c0-4-3-7-7-7Z" fill="#ED706B"/><circle cx="38" cy="19" r="2.6" fill="#fff"/></svg>`,
    kana: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#F6F4EF"/><circle cx="30" cy="30" r="21" fill="#ED706B"/><text x="30" y="41" text-anchor="middle" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="28" fill="#fff">あ</text></svg>`,
    contacts: `<svg viewBox="0 0 60 60"><defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9CCD3"/><stop offset="1" stop-color="#9DA1AB"/></linearGradient></defs><rect width="60" height="60" fill="url(#gc)"/><circle cx="30" cy="23" r="9" fill="#fff"/><path d="M13 48c1.5-9 8.5-13 17-13s15.5 4 17 13" fill="#fff"/></svg>`,
    phone: `<svg viewBox="0 0 60 60"><defs><linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#67F07F"/><stop offset="1" stop-color="#16C23A"/></linearGradient></defs><rect width="60" height="60" fill="url(#gp)"/><path d="M21.5 14.5c1-.6 2.3-.3 3 .7l3.4 5.2c.6 1 .5 2.2-.3 3l-2.4 2.3a20 20 0 0 0 9.1 9.1l2.3-2.4c.8-.8 2-.9 3-.3l5.2 3.4c1 .7 1.3 2 .7 3l-2 3.3c-.9 1.4-2.6 2.1-4.2 1.7C28 41.3 18.7 32 15.5 20.7c-.4-1.6.3-3.3 1.7-4.2Z" fill="#fff"/></svg>`,
    settings: `<svg viewBox="0 0 60 60"><defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B5B8BF"/><stop offset="1" stop-color="#7D8089"/></linearGradient></defs><rect width="60" height="60" fill="url(#gs)"/><circle cx="30" cy="30" r="14" fill="none" stroke="#3C3C43" stroke-width="7" stroke-dasharray="4.4 2.9"/><circle cx="30" cy="30" r="11" fill="#E5E5EA"/><circle cx="30" cy="30" r="5" fill="#8E8E93"/></svg>`,
    book: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#E1E0DA"/><image href="assets/book-cover.jpg" x="0" y="0" width="60" height="85" preserveAspectRatio="xMidYMin slice"/></svg>`,
  };
  const icon = (id) => `<span class="ic">${ICONS[id]}</span>`;

  // ---------- Content ----------
  const THREADS = [
    {
      id: 'mom', name: 'Maman', initials: 'M', color: '#ED706B', unread: true, time: '7:58 PM',
      items: [
        { stamp: 'Tuesday · 2021' },
        { them: 'Ahmed, 3 nouvelles commandes sur l’appli 😅', tr: '3 new orders on the app 😅' },
        { me: 'Je gère. Je les passe en cuisine 👌', tr: 'On it. Passing them to the kitchen 👌' },
        { them: 'Le client de 19h dit qu’il manque le dessert', tr: 'The 7 pm customer says his dessert is missing' },
        { me: 'Je l’appelle, on le livre avec la commande suivante.', tr: 'I’ll call him, we’ll bring it with the next order.' },
        { them: 'Mon associé préféré ❤️', tr: 'My favourite business partner ❤️' },
        { stamp: 'Today 7:52 PM' },
        { them: 'Tu as envoyé ta candidature pour le Japon ? 🙏', tr: 'Did you send your application for Japan? 🙏' },
        { me: 'Ce soir. Hachinohe, here I come 🇯🇵' },
        { them: 'Fière de toi. がんばって !', tr: 'Proud of you. Ganbatte!' },
      ],
    },
    {
      id: 'yvans', name: 'Yvan’s · Team', initials: 'Y', color: '#1F3B73', time: 'Saturday',
      items: [
        { stamp: 'Saturday 5:30 PM' },
        { from: 'Manager', them: 'Private event tonight: 180 guests. You’re head waiter.' },
        { me: 'On it 💪' },
        { from: 'Manager', them: 'Table 12 speaks Arabic, table 4 English.' },
        { me: 'Perfect, I’ve got both.' },
        { stamp: '11:48 PM' },
        { from: 'Manager', them: 'Great service tonight. And the bread story made my day 😂' },
        { me: 'Lesson learned: when words fail, point, smile, double-check.' },
        { img: 'assets/photo-comic.jpg' },
      ],
    },
    {
      id: 'council', name: 'Student council · Amiral ♻️', initials: 'SC', color: '#DE9B3A', time: '2025',
      items: [
        { stamp: '2025 · Lycée Amiral, Grasse' },
        { me: 'Idea for the hall: a recycling bin shaped like a giant battery 🔋' },
        { from: 'Classmate', them: '😂 and?' },
        { me: 'And one just for bottle caps. Sorting becomes a game.' },
        { from: 'Council', them: 'Approved. And we go ahead with the eco video-game tournament 🎮' },
        { me: 'Small idea, real change. Let’s do it.' },
      ],
    },
    {
      id: 'impro', name: 'Impro · Team of 3 🎭', initials: 'IM', color: '#C4504B', time: 'Middle school',
      items: [
        { stamp: 'Middle school · Saint-Hilaire' },
        { from: 'Coach', them: 'Results are in…' },
        { from: 'Coach', them: 'We’re through to the Lyon stage!!! 🎉' },
        { me: 'LET’S GOOO 🎭🔥' },
        { from: 'Teammate', them: 'That last scene 😂😂' },
        { me: 'Rule n°1: accept the offer, build on it.' },
        { emoji: '🎭' },
      ],
    },
  ];

  const LETTER = `
    <p>Dear Eurasia Net team,<br>Dear Hachinohe Gakuin University team,</p>
    <h3>I — You</h3>
    <h4>A university that starts from its own territory</h4>
    <p>Hachinohe Gakuin University does not ask its students to look away from their region. It asks them to look at it. In Aomori, far from Tokyo, students learn to spot the challenges of their community, to listen to the people involved, and to turn ideas into real activities.</p>
    <p>What struck me most in the mission description is the way you define entrepreneurship: not only starting a business, but spotting opportunities, taking initiative, working with others, and creating social, cultural, environmental or economic value. I recognise myself in that definition.</p>
    <h4>Listen first, act afterwards</h4>
    <p>The volunteer’s role is not to give lectures. It is to observe, to collect information, to talk with students and residents, to take part in group thinking sessions and creative workshops, and then to help build small community projects with schools, local businesses, sports clubs and community groups. I like that order: listen first, act afterwards.</p>
    <h4>An exchange that goes both ways</h4>
    <p>The mission also asks volunteers to share their culture, their language and their point of view, so that students can practise intercultural communication and teamwork. I see it as a two-way exchange: I will bring my culture with me, and I expect to come back changed by yours.</p>
    <h3>II — Me</h3>
    <h4>Japan reached me through a screen</h4>
    <p>My interest in Japan started online. Japan is one of the most connected countries in the world, and it first spoke to me through social media. Then came anime and manga: the quiet, contemplative landscapes of some series, and the high-school stories I could relate to while I was in high school myself. After years of watching anime with subtitles, I recognise words I have never formally studied: <i>itadakimasu</i>, <i>otsukaresama</i>, <i>ganbatte</i>.</p>
    <p>What keeps me curious today goes beyond the screen: the legends, the temples, and a relationship between spirituality and nature that I find fascinating. And the food, which I love eating and like cooking at home. In Hachinohe, I want to see for real what I have only seen through a screen.</p>
    <h4>Starting young: a family business at 13</h4>
    <p>In 2021, when I was 13, I helped my mother launch a home meal-delivery service, which ran for two years. My job was to be the link between the ordering platforms and the kitchen: managing the apps, passing orders on, and helping with preparation before each service. When an order went wrong, it was my job to fix it. It taught me early what responsibility means when real customers are waiting, and it is where my wish to become an entrepreneur comes from.</p>
    <h4>Class representative: small projects, real changes</h4>
    <p>At Lycée Amiral in Grasse (2024–2026), I was elected class representative every year and sat on the school council. Two projects I am proud of: a video game tournament about environmental impact, and fun recycling bins inside the school — one shaped like a battery, one for bottle caps — to make sorting a game rather than a chore.</p>
    <h4>Improv theatre: speaking is mostly listening</h4>
    <p>All through middle school in Grasse, I competed in improv theatre. I was picked for the team of six in my very first year, and for the final three from my second year on. We made it to the Lyon stage, one step before the national final in Paris. Improv taught me that speaking is mostly listening: you accept what the other person offers and you build on it, in a split second.</p>
    <h4>Working: service, rush and smiles</h4>
    <p>I have worked as a waiter and head waiter at Restaurant Yvan’s (private events of 150 to 200 guests), in event set-up across the French Riviera (Cannes Film Festival, Cartier stands), and on a food packaging line for Sodexo. I serve guests in French, English and Arabic.</p>
    <h3>III — Us</h3>
    <h4>Not a time slot: a person</h4>
    <p>I do not want to come to Hachinohe as someone who shows up for a time slot and leaves. I am 18, I am available, and I want to learn. I will bring my motivation, my French culture, my good mood, and the firm intention of breaking the cliché of the nonchalant French. Three ideas I would love to build with students:</p>
    <ol><li><b>Improv workshops</b> to speak English without fear.</li><li><b>French cooking workshops</b>: simple recipes, and a conversation around the table.</li><li><b>A fun waste-sorting campaign</b>, inspired by the bins I set up at my school.</li></ol>
    <h4>And after</h4>
    <p>After the mission, I will go back to finish my baccalauréat and keep going towards entrepreneurship. Six months building local projects alongside students who are learning entrepreneurship themselves is the best training I can imagine for that.</p>
    <p>I live in Grasse, in the Provence-Alpes-Côte d’Azur region. Thank you for reading my application. I would be glad to talk about this project in an interview, in English or in French.</p>
    <p>Kind regards,<br><b>Ahmed Moussa</b></p>`;

  const NOTES = [
    {
      id: 'before', title: 'Before leaving ✈️', preview: 'Learn hiragana…', date: 'Today',
      checks: [
        { t: 'Write GANBATTE, my application book', done: true },
        { t: 'Send the application', done: true },
        { t: 'Learn hiragana', s: 'Day 1: あ い う え お', done: false },
        { t: 'Pack a French recipe notebook', done: false },
        { t: 'Learn when to say otsukaresama', s: 'Not just in anime this time', done: false },
      ],
    },
    {
      id: 'workshops', title: 'Workshop ideas 💡', preview: 'Improv, cooking, waste sorting', date: 'Yesterday',
      body: `<p><b>1 · Improv workshops</b><br>Speak English without fear: games where mistakes are part of the fun.</p>
             <p><b>2 · French cooking workshops</b><br>Simple recipes, and a conversation around the table.</p>
             <p><b>3 · A fun waste-sorting campaign</b><br>Inspired by the battery and bottle-cap bins at my school, adapted with students to the campus and the city.</p>
             <p>→ Build them <i>with</i> students, not for them.</p>`,
    },
    {
      id: 'words', title: 'Words I already know', preview: 'Thanks, anime', date: 'Monday',
      body: `<p><b>いただきます · itadakimasu</b><br>Said before a meal.</p>
             <p><b>おつかれさま · otsukaresama</b><br>“Thanks for your hard work.”</p>
             <p><b>がんばって · ganbatte</b><br>“Do your best, keep going.” The title of my book.</p>
             <p><b>ありがとう · arigatō</b><br>Thank you.</p>`,
    },
    {
      id: 'why', title: 'Why Hachinohe', preview: 'Japan reached me through a screen', date: 'Sunday',
      body: `<p>Japan reached me through a screen: social media first, then anime and manga, their quiet landscapes and their high-school stories.</p>
             <p>Hachinohe Gakuin asks its students to spot what their community needs and to act on it. That is how I work too.</p>
             <p>I am not coming for a time slot. I am coming to listen, to learn, and to share.</p>`,
    },
  ];

  const PHOTOS = [
    { src: 'assets/portrait.jpg', cap: 'Me, before the trip.' },
    { src: 'assets/book-cover.jpg', cap: 'GANBATTE · cover' },
    { src: 'assets/book-editorial.jpg', cap: 'GANBATTE · editorial' },
    { src: 'assets/book-you.jpg', cap: 'GANBATTE · I — You' },
    { src: 'assets/book-me.jpg', cap: 'GANBATTE · II — Me' },
    { src: 'assets/book-us.jpg', cap: 'GANBATTE · III — Us' },
    { src: 'assets/book-back.jpg', cap: 'GANBATTE · And after' },
    { src: 'assets/photo-arches.jpg', cap: 'From Grasse to Aomori.' },
    { src: 'assets/photo-comic.jpg', cap: '“A little more white.” She meant the bread.' },
    { src: 'assets/photo-map.jpg', cap: 'Hachinohe, Aomori Prefecture.' },
    { src: 'assets/photo-metro.jpg', cap: 'My line to Hachinohe.' },
  ];

  const KANA = [
    { k: 'あ', r: 'a', hint: 'as in arigatō · thank you' },
    { k: 'い', r: 'i', hint: 'as in itadakimasu' },
    { k: 'う', r: 'u', hint: 'as in umi · the sea' },
    { k: 'え', r: 'e', hint: 'as in eki · station' },
    { k: 'お', r: 'o', hint: 'as in otsukaresama' },
  ];

  const NOTIFS = [
    { app: 'wallet', title: 'Wallet', time: 'now', body: '<b>Boarding pass added</b> · Grasse → Hachinohe. Departure: as soon as you say yes.' },
    { app: 'mail', title: 'Mail', time: '2m ago', body: '<b>Sent</b> · Civic Service application — Hachinohe Gakuin University. GANBATTE.pdf attached.' },
    { app: 'messages', title: 'Maman', time: '7:58 PM', body: 'Fière de toi. がんばって !', open: () => openThread('mom') },
    { app: 'kana', title: '日本語', time: '9:00 AM', body: 'Day 1 🔥 · 5 new hiragana: あ い う え お' },
  ];

  // ---------- Clock ----------
  function tick() {
    const now = new Date();
    const t = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const d = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    document.querySelectorAll('[data-clock]').forEach((n) => (n.textContent = t));
    document.querySelectorAll('[data-date]').forEach((n) => (n.textContent = d));
  }

  // ---------- Home screen ----------
  const GRID = [['book', 'Ganbatte'], ['notes', 'Notes'], ['photos', 'Photos'], ['maps', 'Maps'], ['kana', '日本語'], ['contacts', 'Contacts'], ['settings', 'Settings']];
  const DOCK = [['phone', 'Phone'], ['messages', 'Messages'], ['mail', 'Mail'], ['wallet', 'Wallet']];
  const badges = { messages: 1, mail: 1 };

  function renderHome() {
    home.classList.add('wallpaper');
    const appBtn = ([id, label]) => `<button class="app-icon" data-app="${id}" aria-label="${esc(label)}">${icon(id)}${badges[id] ? `<span class="badge">${badges[id]}</span>` : ''}<span class="lbl">${esc(label)}</span></button>`;
    home.innerHTML = `
      <div class="widgets">
        <button class="widget widget-trip" data-app="wallet" aria-label="Trip: Grasse to Hachinohe">
          <div>
            <div class="w-kicker">Next trip</div>
            <div class="w-route">Grasse → Hachinohe</div>
            <div class="w-meta">≈ 9,600 km · 6 months</div>
          </div>
          <div class="w-plane">${planeSvg}</div>
          <div class="w-progress"><span></span></div>
        </button>
        <button class="widget widget-small" data-app="maps" aria-label="Maps">
          <div class="w-label">Hachinohe<br><span style="opacity:.7;font-weight:500">Aomori, Japan</span></div>
          <div class="w-big">6<span style="font-size:.4em;font-weight:600"> months</span></div>
        </button>
        <button class="widget widget-small kana" data-app="kana" aria-label="Japanese lessons">
          <div class="w-jp">あ</div>
          <div class="w-label">Day 1 🔥<br><span style="color:var(--ink-soft);font-weight:500">5 new hiragana</span></div>
        </button>
      </div>
      <div class="grid">${GRID.map(appBtn).join('')}</div>
      <div class="dots"><i></i><i></i></div>
      <nav class="dock">${DOCK.map(appBtn).join('')}</nav>`;
  }

  home.addEventListener('click', (e) => {
    const b = e.target.closest('[data-app]');
    if (b) openApp(b.dataset.app, b.querySelector('.ic') || b);
  });

  // ---------- Lock screen ----------
  function renderLock() {
    lock.classList.add('wallpaper');
    const box = $('#lockNotifs');
    box.innerHTML = NOTIFS.map((n, i) => `
      <button class="notif" data-i="${i}">
        <span class="notif-icon ic">${ICONS[n.app]}</span>
        <span class="notif-title">${esc(n.title)}</span>
        <span class="notif-time">${esc(n.time)}</span>
        <span class="notif-body">${n.body}</span>
      </button>`).join('');
    [...box.children].forEach((n, i) => setTimeout(() => n.classList.add('in'), D(650 + i * 260)));
  }

  let unlocked = false;
  function setupLockGesture() {
    let startY = 0, dy = 0, t0 = 0, dragging = false, target = null;
    lock.addEventListener('pointerdown', (e) => {
      if (unlocked) return;
      dragging = true; startY = e.clientY; dy = 0; t0 = performance.now(); target = e.target;
      lock.setPointerCapture(e.pointerId);
      lock.style.transition = 'none';
    });
    lock.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      dy = Math.min(0, e.clientY - startY);
      lock.style.transform = `translateY(${dy}px)`;
      lock.style.opacity = String(1 - Math.min(.5, -dy / lock.clientHeight));
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      const v = -dy / Math.max(1, performance.now() - t0);
      if (Math.abs(dy) < 6) {
        const n = target && target.closest('.notif');
        resetLock();
        if (n) { const nf = NOTIFS[+n.dataset.i]; unlock().then(() => (nf.open ? (openApp(nf.app, iconFor(nf.app)), setTimeout(nf.open, D(380))) : openApp(nf.app, iconFor(nf.app)))); }
        else unlock();
        return;
      }
      if (-dy > lock.clientHeight * 0.18 || v > 0.6) unlock(dy);
      else resetLock(true);
    };
    lock.addEventListener('pointerup', end);
    lock.addEventListener('pointercancel', end);
  }
  function resetLock(animated) {
    lock.style.transition = animated ? `transform .45s ${SPRING}, opacity .45s` : 'none';
    lock.style.transform = ''; lock.style.opacity = '';
  }
  async function unlock(fromDy = 0) {
    if (unlocked) return;
    unlocked = true;
    lock.style.transition = 'none';
    const a = lock.animate([{ transform: `translateY(${fromDy}px)`, opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0.4 }], { duration: D(480), easing: SPRING, fill: 'forwards' });
    home.animate([{ transform: 'scale(1.08)', opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: D(520), easing: SPRING });
    await a.finished;
    lock.style.display = 'none';
    a.cancel();
  }
  function relock() {
    closeApp(true);
    unlocked = false;
    lock.style.display = '';
    resetLock(false);
    lock.animate([{ opacity: 0 }, { opacity: 1 }], { duration: D(300) });
    renderLock();
    screen.dataset.tone = 'dark';
  }
  const iconFor = (id) => home.querySelector(`[data-app="${id}"] .ic`);

  // ---------- Windows (app open / close) ----------
  let current = null; // { win, origin, stack: [view] }

  function screenRadius() { return parseFloat(getComputedStyle($('#phone')).borderRadius) || 0; }
  function insetFor(rect) {
    const s = screen.getBoundingClientRect();
    return `inset(${rect.top - s.top}px ${s.right - rect.right}px ${s.bottom - rect.bottom}px ${rect.left - s.left}px round ${rect.width * 0.23}px)`;
  }

  function openApp(id, originEl) {
    if (current) closeApp(true);
    const app = APPS[id];
    if (!app) return;
    if (badges[id] && id !== 'messages') { delete badges[id]; renderHome(); originEl = iconFor(id) || originEl; }
    const win = el(`<div class="window ${app.cls || ''}" data-id="${id}"></div>`);
    const view = el(`<div class="view"></div>`);
    win.appendChild(view);
    windows.appendChild(win);
    app.render(view, win);
    current = { id, win, origin: originEl, stack: [view] };
    screen.classList.add('app-open');
    screen.dataset.tone = app.tone || 'light';
    home.classList.add('behind');

    const full = `inset(0px 0px 0px 0px round ${screenRadius()}px)`;
    if (originEl && originEl.isConnected) {
      const r = originEl.getBoundingClientRect();
      const s = screen.getBoundingClientRect();
      win.animate([{ clipPath: insetFor(r) }, { clipPath: full }], { duration: D(520), easing: SPRING });
      view.style.transformOrigin = `${r.left + r.width / 2 - s.left}px ${r.top + r.height / 2 - s.top}px`;
      view.animate([{ transform: `scale(${(r.width / s.width).toFixed(3)})`, opacity: 0 }, { opacity: 1, offset: 0.35 }, { transform: 'none', opacity: 1 }], { duration: D(520), easing: SPRING });
    } else {
      win.animate([{ transform: 'translateY(8%) scale(.96)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: D(420), easing: SPRING });
    }
    if (app.after) app.after(view, win);
  }

  function closeApp(instant) {
    if (!current) return;
    const { win, origin, id } = current;
    current = null;
    screen.classList.remove('app-open');
    screen.dataset.tone = 'dark';
    home.classList.remove('behind');
    const target = (origin && origin.isConnected && origin) || iconFor(id);
    if (instant || !target) { win.remove(); return; }
    const r = target.getBoundingClientRect();
    const s = screen.getBoundingClientRect();
    const top = win.querySelector('.view:last-child');
    top.style.transformOrigin = `${r.left + r.width / 2 - s.left}px ${r.top + r.height / 2 - s.top}px`;
    top.animate([{ transform: 'none', opacity: 1 }, { opacity: 1, offset: 0.6 }, { transform: `scale(${(r.width / s.width).toFixed(3)})`, opacity: 0 }], { duration: D(440), easing: SPRING, fill: 'forwards' });
    const a = win.animate([{ clipPath: `inset(0px 0px 0px 0px round ${screenRadius()}px)` }, { clipPath: insetFor(r) }], { duration: D(440), easing: SPRING, fill: 'forwards' });
    a.finished.then(() => win.remove());
  }

  function push(html, setup) {
    if (!current) return;
    const { win, stack } = current;
    const prev = stack[stack.length - 1];
    const view = el(`<div class="view">${html}</div>`);
    win.appendChild(view);
    stack.push(view);
    view.animate([{ transform: 'translateX(100%)', boxShadow: '-10px 0 30px rgba(0,0,0,0)' }, { transform: 'none', boxShadow: '-10px 0 30px rgba(0,0,0,.08)' }], { duration: D(460), easing: SPRING });
    prev.animate([{ transform: 'none', filter: 'brightness(1)' }, { transform: 'translateX(-30%)', filter: 'brightness(.92)' }], { duration: D(460), easing: SPRING, fill: 'forwards' });
    if (setup) setup(view);
    return view;
  }
  function pop() {
    if (!current || current.stack.length < 2) return false;
    const { stack } = current;
    const view = stack.pop();
    const prev = stack[stack.length - 1];
    prev.getAnimations().forEach((a) => a.cancel());
    prev.animate([{ transform: 'translateX(-30%)', filter: 'brightness(.92)' }, { transform: 'none', filter: 'brightness(1)' }], { duration: D(420), easing: SPRING });
    view.animate([{ transform: 'none' }, { transform: 'translateX(100%)' }], { duration: D(420), easing: SPRING, fill: 'forwards' }).finished.then(() => view.remove());
    if (current.onPop) current.onPop(prev);
    return true;
  }
  windows.addEventListener('click', (e) => { if (e.target.closest('[data-back]')) pop(); });

  // Edge swipe to go back (left edge), like iOS
  (() => {
    let sx = 0, sy = 0, active = false, view = null, prev = null;
    windows.addEventListener('pointerdown', (e) => {
      if (!current || current.stack.length < 2) return;
      const s = screen.getBoundingClientRect();
      if (e.clientX - s.left > 24) return;
      active = true; sx = e.clientX; sy = e.clientY;
      view = current.stack[current.stack.length - 1]; prev = current.stack[current.stack.length - 2];
      prev.getAnimations().forEach((a) => a.cancel());
      windows.setPointerCapture(e.pointerId);
    });
    windows.addEventListener('pointermove', (e) => {
      if (!active) return;
      const dx = Math.max(0, e.clientX - sx), w = screen.clientWidth;
      view.style.transform = `translateX(${dx}px)`;
      prev.style.transform = `translateX(${-30 + (dx / w) * 30}%)`;
    });
    const end = (e) => {
      if (!active) return;
      active = false;
      const dx = Math.max(0, e.clientX - sx), w = screen.clientWidth;
      view.style.transform = ''; prev.style.transform = '';
      if (dx > w * 0.3) {
        current.stack.pop();
        view.animate([{ transform: `translateX(${dx}px)` }, { transform: 'translateX(100%)' }], { duration: D(300), easing: SPRING, fill: 'forwards' }).finished.then(() => view.remove());
        prev.animate([{ transform: `translateX(${-30 + (dx / w) * 30}%)` }, { transform: 'none' }], { duration: D(300), easing: SPRING });
      } else {
        view.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: D(300), easing: SPRING });
        prev.animate([{ transform: `translateX(${-30 + (dx / w) * 30}%)` }, { transform: 'translateX(-30%)' }], { duration: D(300), easing: SPRING, fill: 'forwards' });
      }
    };
    windows.addEventListener('pointerup', end);
    windows.addEventListener('pointercancel', end);
  })();

  // Home indicator: tap or swipe up to go home
  (() => {
    let sy = 0, dragging = false;
    homebar.addEventListener('pointerdown', (e) => { dragging = true; sy = e.clientY; homebar.setPointerCapture(e.pointerId); });
    homebar.addEventListener('pointermove', (e) => {
      if (!dragging || !current) return;
      const dy = Math.min(0, e.clientY - sy);
      const k = 1 - Math.min(0.25, -dy / 800);
      current.win.style.transform = `translateY(${dy * 0.5}px) scale(${k})`;
      current.win.style.borderRadius = `${Math.min(40, -dy / 3)}px`;
    });
    const end = (e) => {
      if (!dragging) return; dragging = false;
      if (!current) return;
      const dy = e.clientY - sy;
      current.win.style.transform = ''; current.win.style.borderRadius = '';
      if (dy < -40 || Math.abs(dy) < 6) closeApp();
    };
    homebar.addEventListener('pointerup', end);
    homebar.addEventListener('pointercancel', end);
  })();

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!unlocked) return unlock();
    if (!pop()) closeApp();
  });

  // ---------- Apps ----------
  const nav = (title, back, right = '') => `
    <div class="nav">
      ${back ? `<button class="nav-back" data-back>${chevBack}<span>${esc(back)}</span></button>` : '<span></span>'}
      <div class="nav-title">${title}</div>
      <div class="nav-right">${right}</div>
    </div>`;
  const avatar = (t) => `<span class="avatar" style="background:${t.color}">${esc(t.initials)}</span>`;

  // Messages
  function messagesList(view) {
    view.innerHTML = `
      <div class="scroll">
        <div class="large-title">Messages</div>
        <div class="list">${THREADS.map((t) => {
          const last = [...t.items].reverse().find((i) => i.them || i.me) || {};
          return `<button class="row thread-row" data-thread="${t.id}">
            ${t.unread ? '<span class="unread-dot"></span>' : ''}${avatar(t)}
            <div class="grow"><div class="thread-top"><span class="thread-name">${esc(t.name)}</span><span class="thread-time">${esc(t.time)}</span></div>
            <div class="thread-preview">${esc(last.them || last.me || '')}</div></div></button>`;
        }).join('')}</div>
        <div class="pad-bottom"></div>
      </div>`;
    view.addEventListener('click', (e) => { const r = e.target.closest('[data-thread]'); if (r) openThread(r.dataset.thread); });
  }

  function bubbleHtml(i, last) {
    if (i.stamp) return `<div class="stamp">${esc(i.stamp)}</div>`;
    if (i.img) return `<div class="bubble me img"><img src="${i.img}" alt=""></div>`;
    if (i.emoji) return `<div class="bubble me emoji">${i.emoji}</div>`;
    const who = i.me ? 'me' : 'them';
    const txt = i.me || i.them;
    const from = i.from && i.them ? `<div class="sender">${esc(i.from)}</div>` : '';
    return `${from}<div class="bubble ${who}">${esc(txt)}${i.tr ? `<span class="tr">${esc(i.tr)}</span>` : ''}</div>${last && i.me ? '<div class="delivered">Delivered</div>' : ''}`;
  }

  async function openThread(id) {
    const t = THREADS.find((x) => x.id === id);
    if (!t) return;
    if (!current || current.id !== 'messages') return;
    if (t.unread) { t.unread = false; delete badges.messages; renderHome(); const dot = current.stack[0].querySelector(`[data-thread="${id}"] .unread-dot`); if (dot) dot.remove(); }
    const view = push(`
      <div class="view-inner chat" style="display:flex;flex-direction:column;height:100%">
        ${nav(`<div class="chat-head">${avatar(t)}<span>${esc(t.name)}</span></div>`, 'Back')}
        <div class="scroll"><div class="bubbles"></div></div>
        <div class="composer"><span class="plus">+</span><span class="field">iMessage</span></div>
      </div>`);
    const box = view.querySelector('.bubbles');
    const sc = view.querySelector('.scroll');
    const lastMe = t.items.map((x) => !!x.me).lastIndexOf(true);
    const toEnd = () => sc.scrollTo({ top: sc.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    if (t.played || reduced) { box.innerHTML = t.items.map((i, k) => bubbleHtml(i, k === lastMe)).join(''); box.querySelectorAll('.bubble').forEach((b) => (b.style.animation = 'none')); sc.scrollTop = sc.scrollHeight; return; }
    t.played = true;
    await wait(420);
    for (let k = 0; k < t.items.length; k++) {
      if (!view.isConnected) return;
      const i = t.items[k];
      if (i.them) {
        const typing = el('<div class="typing"><i></i><i></i><i></i></div>');
        if (i.from) box.appendChild(el(`<div class="sender">${esc(i.from)}</div>`));
        box.appendChild(typing); toEnd();
        await wait(Math.min(1500, 650 + i.them.length * 14));
        typing.remove();
        box.appendChild(el(`<div class="bubble them">${esc(i.them)}${i.tr ? `<span class="tr">${esc(i.tr)}</span>` : ''}</div>`));
      } else if (i.stamp) {
        box.appendChild(el(bubbleHtml(i)));
        await wait(120);
        continue;
      } else {
        await wait(i.me ? 380 + i.me.length * 8 : 500);
        box.querySelectorAll('.delivered').forEach((d) => d.remove());
        box.insertAdjacentHTML('beforeend', bubbleHtml(i, k === lastMe));
      }
      toEnd();
      await wait(260);
    }
  }

  // Mail
  function mailList(view) {
    view.innerHTML = `
      <div class="scroll">
        <div class="large-title">Mail</div>
        <div class="section-head">Sent</div>
        <div class="list">
          <button class="row mail-row" data-mail="application">
            <div class="grow"><div class="thread-top"><span class="mail-from">To: Eurasia Net · Hachinohe</span><span class="thread-time">7:51 PM</span></div>
            <div class="mail-subject">Civic Service application — Hachinohe Gakuin University</div>
            <div class="thread-preview">Dear Eurasia Net team, dear Hachinohe Gakuin University team… 📎 GANBATTE.pdf</div></div>
          </button>
        </div>
        <div class="section-head">Drafts</div>
        <div class="list">
          <button class="row mail-row" data-mail="thanks">
            <div class="grow"><div class="thread-top"><span class="mail-from" style="color:#FF3B30">Draft</span><span class="thread-time">—</span></div>
            <div class="mail-subject">Thank you for the interview</div>
            <div class="thread-preview">To send after the interview 😉</div></div>
          </button>
        </div>
        <div class="pad-bottom"></div>
      </div>`;
    view.addEventListener('click', (e) => {
      const r = e.target.closest('[data-mail]');
      if (!r) return;
      if (r.dataset.mail === 'application') {
        push(`<div class="mail-reader" style="display:flex;flex-direction:column;height:100%">${nav('', 'Mail')}
          <div class="scroll">
            <div class="mail-subject-big">Civic Service application — Hachinohe Gakuin University</div>
            <div class="mail-head" style="margin-top:calc(10*var(--u))"><span class="avatar">AM</span><b>${esc(CONFIG.name)}</b><span>To: Eurasia Net — Civic Service, Asia</span><span>Today at 7:51 PM</span></div>
            <a class="attachment" href="${CONFIG.pdf}" download><span class="thumb"></span><span><b>GANBATTE.pdf</b><span>Application book · 8 pages · tap to download</span></span></a>
            <div class="letter">${LETTER}</div>
            <div class="pad-bottom"></div>
          </div></div>`);
      } else {
        push(`<div class="mail-reader" style="display:flex;flex-direction:column;height:100%">${nav('', 'Mail')}
          <div class="scroll"><div class="mail-subject-big">Thank you for the interview</div>
          <div class="letter"><p>Dear …,</p><p>Thank you for your time today. I enjoyed our conversation, and I am even more motivated to join the project in Hachinohe.</p><p>ありがとうございました!</p><p>Ahmed</p></div></div></div>`);
      }
    });
  }

  // Wallet
  function passFront() {
    return `<div class="pass coral">
      <div class="pass-row"><span class="pass-brand">✦ Ganbatte Air</span><div style="text-align:right"><div class="pass-label">Flight</div><div class="pass-value">GB 006</div></div></div>
      <div class="pass-cities">
        <div><div class="pass-label">Grasse · France</div><div class="pass-city">GRS</div></div>
        <svg class="pass-plane" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5Z"/></svg>
        <div><div class="pass-label" style="text-align:right">Aomori · Japan</div><div class="pass-city r">HCH</div></div>
      </div>
      <div class="pass-grid">
        <div><div class="pass-label">Passenger</div><div class="pass-value">MOUSSA / AHMED</div></div>
        <div><div class="pass-label">Class</div><div class="pass-value">Volunteer</div></div>
        <div><div class="pass-label">Seat</div><div class="pass-value">1A · window</div></div>
        <div><div class="pass-label">Duration</div><div class="pass-value">6 months</div></div>
        <div><div class="pass-label">Boarding</div><div class="pass-value">When you say yes</div></div>
        <div><div class="pass-label">Gate</div><div class="pass-value">Interview</div></div>
      </div>
      <div class="pass-qr" data-qr></div>
      <div class="pass-foot">A playful pass, not a real ticket ✈️</div>
    </div>`;
  }
  function passBack() {
    return `<div class="pass coral pass-back back">
      <div class="pass-label">Mission</div><h5>Education for All</h5>
      <p>Hachinohe Gakuin University, Aomori · via Eurasia Net · 6 months.</p>
      <div class="pass-label" style="margin-top:calc(16*var(--u))">In my luggage</div>
      <p>Motivation · French culture and recipes · good mood · an improv toolbox · three workshop ideas · the firm intention of breaking the cliché of the nonchalant French.</p>
      <div class="pass-label" style="margin-top:calc(16*var(--u))">On arrival</div>
      <p>Listen first. Learn. Share. Then build projects with students.</p>
    </div>`;
  }
  function walletView(view) {
    view.innerHTML = `
      <div class="scroll">
        <div class="large-title">Wallet</div>
        <div class="wallet-stack" style="padding-bottom:calc(10*var(--u))">
          <button class="pass navy pass-peek" data-pass="cash" style="transform:translateY(0)">
            <div class="pass-row"><span class="pass-brand">Motivation</span><span class="pass-value">∞</span></div>
          </button>
        </div>
        <div style="padding:0 calc(16*var(--u))">
          <div class="flip" id="passFlip"><div class="flip-inner">${passFront().replace('class="pass coral"', 'class="pass coral front"')}${passBack()}</div></div>
          <div class="center"><button class="pill-btn" data-flip>↻ Flip pass</button></div>
          <p class="wallet-hint">Tap the Motivation card: balance never runs out.</p>
        </div>
        <div class="pad-bottom"></div>
      </div>`;
    const qr = view.querySelector('[data-qr]');
    const drawQR = () => {
      if (!window.qrcode) return setTimeout(drawQR, 200);
      const q = window.qrcode(0, 'M');
      q.addData('GANBATTE · MOUSSA/AHMED · GRASSE → HACHINOHE · 6 MONTHS · EDUCATION FOR ALL');
      q.make();
      qr.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    };
    drawQR();
    view.addEventListener('click', (e) => {
      if (e.target.closest('[data-flip]') || e.target.closest('#passFlip')) view.querySelector('#passFlip').classList.toggle('flipped');
      const c = e.target.closest('[data-pass="cash"]');
      if (c) c.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-10px) rotate(-1deg)' }, { transform: 'translateY(0)' }], { duration: D(500), easing: 'cubic-bezier(.3,1.4,.5,1)' });
    });
    view.querySelector('.flip-inner').animate([{ transform: 'translateY(40px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: D(700), delay: D(150), easing: SPRING, fill: 'backwards' });
  }

  // Notes
  function notesList(view) {
    view.innerHTML = `
      <div class="scroll">
        <div class="large-title">Notes</div>
        <div class="list">${NOTES.map((n) => `<button class="row note-row" data-note="${n.id}"><div class="grow"><div class="note-title">${esc(n.title)}</div><div class="sub">${esc(n.date)}  ${esc(n.preview)}</div></div>${chevRight}</button>`).join('')}</div>
        <div class="pad-bottom"></div>
      </div>`;
    view.addEventListener('click', (e) => {
      const r = e.target.closest('[data-note]'); if (!r) return;
      const n = NOTES.find((x) => x.id === r.dataset.note);
      const body = n.checks
        ? n.checks.map((c, i) => `<button class="check ${c.done ? 'done' : ''}" data-check="${i}"><span class="box"><svg viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19 7"/></svg></span><span class="txt">${esc(c.t)}${c.s ? `<small>${esc(c.s)}</small>` : ''}</span></button>`).join('')
        : n.body;
      push(`<div class="note-view" style="display:flex;flex-direction:column;height:100%">${nav('', 'Notes')}
        <div class="scroll"><div class="note-body"><div class="note-date">${esc(n.date)}</div><h2>${esc(n.title)}</h2>${body}</div></div></div>`, (v) => {
        v.addEventListener('click', (ev) => {
          const c = ev.target.closest('[data-check]'); if (!c) return;
          const item = n.checks[+c.dataset.check]; item.done = !item.done; c.classList.toggle('done', item.done);
        });
      });
    });
  }

  // Photos
  function photosView(view) {
    view.innerHTML = `
      <div class="scroll">
        <div class="large-title">Photos</div>
        <div class="photo-grid">${PHOTOS.map((p, i) => `<button data-photo="${i}" aria-label="${esc(p.cap)}"><img src="${p.src}" alt="" loading="lazy"></button>`).join('')}</div>
        <div class="foot-note" style="text-align:center;padding-top:calc(14*var(--u))">${PHOTOS.length} photos</div>
        <div class="pad-bottom"></div>
      </div>`;
    view.addEventListener('click', (e) => { const b = e.target.closest('[data-photo]'); if (b) openViewer(+b.dataset.photo); });
  }
  function openViewer(i) {
    screen.dataset.tone = 'dark';
    current.onPop = () => { screen.dataset.tone = 'light'; current.onPop = null; };
    const v = push(`<div class="viewer" style="display:flex;flex-direction:column;height:100%">${nav('', 'Photos')}
      <div class="viewer-stage"><img alt=""></div><div class="viewer-cap"></div></div>`);
    const img = v.querySelector('img'), cap = v.querySelector('.viewer-cap'), stage = v.querySelector('.viewer-stage');
    const show = (k, dir = 0) => {
      i = (k + PHOTOS.length) % PHOTOS.length;
      img.src = PHOTOS[i].src; cap.textContent = `${PHOTOS[i].cap}  ·  ${i + 1}/${PHOTOS.length}`;
      if (dir) img.animate([{ transform: `translateX(${dir * 40}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: D(320), easing: SPRING });
    };
    show(i);
    let sx = null;
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (sx == null) return; const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      else show(i + 1, 1);
    });
  }

  // Maps
  function mapsView(view) {
    view.innerHTML = `
      <div class="map-canvas">
        <div class="japan"><img src="assets/japan.svg" alt="Map of Japan">
          <span class="pin" style="left:72.3%;top:35.25%"><i></i><b>Hachinohe</b></span>
          <span class="pin" style="left:61.7%;top:67.4%;"><i style="width:calc(9*var(--u));height:calc(9*var(--u));background:var(--ink);border-width:2px"></i><b style="font-weight:500;font-size:calc(12*var(--u))">Tokyo</b></span>
        </div>
      </div>
      <div class="sheet">
        <div class="grabber"></div>
        <h2>Hachinohe</h2>
        <div class="sub">Aomori Prefecture, Japan · ≈ 9,600 km from Grasse</div>
        <div class="route-btns">
          <div class="on">✈︎ Fly<small>≈ 9,600 km</small></div>
          <div>🚄 Shinkansen<small>from Tokyo</small></div>
          <div>🌱 Stay<small>6 months</small></div>
        </div>
        <div class="places">
          <div class="place"><i>🎓</i><div><b>Hachinohe Gakuin University</b><span>The mission: Education for All</span></div></div>
          <div class="place"><i>⛩️</i><div><b>Kabushima Shrine</b><span>Home to thousands of black-tailed gulls</span></div></div>
          <div class="place"><i>🏮</i><div><b>Hachinohe Sansha Taisai</b><span>The city’s great summer festival of floats</span></div></div>
          <div class="place"><i>🌊</i><div><b>Tanesashi Coast</b><span>Grassland running down to the Pacific</span></div></div>
        </div>
      </div>`;
    const jp = view.querySelector('.japan');
    jp.animate([{ transform: 'scale(1.25) translate(-6%, 10%)', opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: D(1100), easing: SPRING });
  }

  // Kana
  function kanaView(view) {
    view.innerHTML = `
      <div class="scroll">
        <div class="kana-head"><h1>日本語</h1><span class="streak">🔥 1 day</span></div>
        <p class="kana-sub">Day 1 · the five vowels. Tap a card to flip it.</p>
        <div class="cards">${KANA.map((c, i) => `
          <div class="kcard ${i === 0 ? '' : 'under'}" data-k="${i}" style="z-index:${KANA.length - i}">
            <div class="face front"><div class="glyph">${c.k}</div><small style="color:var(--ink-soft)">Tap to reveal</small></div>
            <div class="face back"><div class="romaji">${c.r}</div><small>${esc(c.hint)}</small></div>
          </div>`).join('')}</div>
        <div class="kana-ctrl">
          <button data-prev aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
          <span data-count>1 / ${KANA.length}</span>
          <button data-next aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
        </div>
        <div class="words"><h3>Words I already know</h3>
          <div class="list">
            ${[['いただきます', 'itadakimasu', 'Said before a meal'], ['おつかれさま', 'otsukaresama', 'Thanks for your hard work'], ['がんばって', 'ganbatte', 'Do your best, keep going'], ['ありがとう', 'arigatō', 'Thank you']].map(([j, r, m]) => `<div class="row word"><span class="jp">${j}</span><b>${r}</b><span>${m}</span></div>`).join('')}
          </div>
        </div>
        <div class="pad-bottom"></div>
      </div>`;
    let idx = 0;
    const cards = [...view.querySelectorAll('.kcard')];
    const count = view.querySelector('[data-count]');
    const layout = () => {
      cards.forEach((c, i) => {
        c.classList.remove('out-left', 'out-right', 'under', 'flipped');
        if (i < idx) c.classList.add('out-left');
        else if (i > idx) c.classList.add('under');
        c.style.zIndex = String(KANA.length - Math.abs(i - idx));
      });
      count.textContent = `${idx + 1} / ${KANA.length}`;
    };
    view.addEventListener('click', (e) => {
      const c = e.target.closest('.kcard');
      if (c && +c.dataset.k === idx) c.classList.toggle('flipped');
      if (e.target.closest('[data-next]')) { idx = (idx + 1) % KANA.length; layout(); }
      if (e.target.closest('[data-prev]')) { idx = (idx - 1 + KANA.length) % KANA.length; layout(); }
    });
  }

  // Contact
  function contactView(view) {
    const li = CONFIG.linkedin;
    view.innerHTML = `
      <div class="scroll">
        <div class="contact-hero"><img src="assets/portrait.jpg" alt="Ahmed Moussa"><h2>${esc(CONFIG.name)}</h2><p>Civic Service candidate · Grasse, France</p></div>
        <div class="actions">
          <a class="action" href="sms:${CONFIG.phone}"><svg viewBox="0 0 24 24"><path d="M12 3.5c-5 0-9 3.3-9 7.4 0 2.3 1.3 4.4 3.3 5.7-.2 1-.7 2.2-1.4 3 1.5-.2 3-.8 4-1.6.9.2 2 .4 3.1.4 5 0 9-3.3 9-7.5S17 3.5 12 3.5Z"/></svg>message</a>
          <a class="action" href="tel:${CONFIG.phone}"><svg viewBox="0 0 24 24"><path d="M6.6 3.3c.6-.4 1.4-.2 1.8.4l2 3.1c.4.6.3 1.3-.2 1.8L8.8 10a12 12 0 0 0 5.4 5.4l1.4-1.4c.5-.5 1.2-.6 1.8-.2l3.1 2c.6.4.8 1.2.4 1.8l-1.2 2c-.6.9-1.6 1.3-2.6 1C10.8 19 5 13.2 3.6 7.1c-.3-1 .1-2 1-2.6Z"/></svg>call</a>
          <a class="action" href="mailto:${CONFIG.email}?subject=${encodeURIComponent('Your Civic Service application — Hachinohe')}"><svg viewBox="0 0 24 24"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5Zm2 .8v.3l7 4.7 7-4.7v-.3Z"/></svg>mail</a>
          <a class="action ${li ? '' : 'off'}" href="${li || '#'}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3.3 9h3.4v11.5H3.3Zm5.6 0h3.3v1.6c.5-.9 1.7-1.9 3.5-1.9 3.6 0 4.3 2.4 4.3 5.4v6.4h-3.4v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.8H8.9Z"/></svg>LinkedIn</a>
        </div>
        <div class="section-head"></div>
        <div class="list">
          <div class="row"><div class="grow"><div class="field-label">mobile</div><a class="field-value" href="tel:${CONFIG.phone}">${esc(CONFIG.phoneDisplay)}</a></div></div>
          <div class="row"><div class="grow"><div class="field-label">email</div><a class="field-value" href="mailto:${CONFIG.email}">${esc(CONFIG.email)}</a></div></div>
          <div class="row"><div class="grow"><div class="field-label">home</div><div>Grasse (06), Provence-Alpes-Côte d’Azur, France</div></div></div>
          <div class="row"><div class="grow"><div class="field-label">languages</div><div>French, Arabic (native) · English (working) · 日本語 (starting)</div></div></div>
        </div>
        <div class="section-head"></div>
        <div class="list"><a class="row" href="${CONFIG.pdf}" download><span class="grow" style="color:var(--ios-blue)">Download GANBATTE (PDF)</span>${chevRight}</a></div>
        <div class="pad-bottom"></div>
      </div>`;
  }

  // Book (GANBATTE reader)
  function bookView(view) {
    const pages = PHOTOS.filter((p) => p.src.includes('book-'));
    view.innerHTML = `
      <div class="nav" style="background:rgba(246,244,239,.9)"><span></span><div class="nav-title">GANBATTE</div><a class="nav-right" href="${CONFIG.pdf}" download>PDF</a></div>
      <div class="scroll" style="background:var(--beige)">
        <div style="display:grid;gap:calc(14*var(--u));padding:calc(14*var(--u))">${pages.map((p) => `<img src="${p.src}" alt="${esc(p.cap)}" loading="lazy" style="width:100%;border-radius:calc(6*var(--u));box-shadow:0 4px 16px rgba(0,0,0,.12)">`).join('')}</div>
        <div class="pad-bottom"></div>
      </div>`;
  }

  // Settings / About
  function settingsView(view) {
    view.innerHTML = `
      <div class="scroll">
        <div class="large-title">Settings</div>
        <div class="list"><div class="about-hero">${icon('kana')}<h2>Ahmed’s phone</h2><p>A Civic Service application for Hachinohe Gakuin University (via Eurasia Net), told as a phone you can explore.</p></div></div>
        <div class="section-head">About</div>
        <div class="list">
          <div class="row"><span class="grow">Mission</span><span class="sub">Education for All</span></div>
          <div class="row"><span class="grow">Duration</span><span class="sub">6 months</span></div>
          <div class="row"><span class="grow">Design</span><span class="sub">GANBATTE system</span></div>
          <div class="row"><span class="grow">Map data</span><span class="sub">Natural Earth</span></div>
        </div>
        <div class="section-head"></div>
        <div class="list"><button class="row" data-relock><span class="grow" style="color:var(--ios-blue)">Lock phone</span></button></div>
        <p class="foot-note">The conversations are written from real moments of my life; other people’s names are left out. The boarding pass is playful, not a real ticket. Not affiliated with Apple.</p>
        <div class="pad-bottom"></div>
      </div>`;
    view.addEventListener('click', (e) => { if (e.target.closest('[data-relock]')) relock(); });
  }

  const APPS = {
    messages: { render: messagesList },
    mail: { render: mailList },
    wallet: { render: walletView, cls: 'wallet', tone: 'dark' },
    notes: { render: notesList, cls: 'notes' },
    photos: { render: photosView, cls: 'photos' },
    maps: { render: mapsView, cls: 'maps' },
    kana: { render: kanaView, cls: 'kana-app' },
    contacts: { render: contactView, cls: 'contact' },
    phone: { render: contactView, cls: 'contact' },
    book: { render: bookView },
    settings: { render: settingsView },
  };

  // ---------- Boot ----------
  tick();
  setInterval(tick, 10_000);
  renderHome();
  renderLock();
  setupLockGesture();
  screen.dataset.tone = 'dark';
})();
