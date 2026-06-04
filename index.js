// ===== DEFAULT DATA =====
const DEFAULT_PROFILE = {
  name: 'Ayush',
  email: 'ayushkumarsingh8596@gmail.com',
  tagline: 'A full-stack web developer focused on building clean, performant, and developer-friendly digital experiences.',
  bio: [
    "Hey, I'm Ayush — a full-stack developer who loves turning ideas into clean, functional web applications. I care about code quality, performance, and the developer experience.",
    "I work primarily with JavaScript and Node.js on the backend and frontend, and I'm always exploring new tools and patterns to level up my craft.",
    "When I'm not coding, you'll find me reading tech blogs, contributing to open source, or debugging something that \"should just work\"."
  ],
  github: 'https://github.com/ayushh0001',
  linkedin: 'https://www.linkedin.com/in/ayush-kumar-singh-157b6a2a2/',
  twitter: '',
  website: '',
  avatar: 'developer.png',
  resume: 'ayush_resume.pdf'
};

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: 'Spotify Clone',
    desc: 'A Spotify web application clone where users can stream different songs.',
    tech: ['React.js', 'Node.js', 'CSS'],
    link: 'https://earnest-kelpie-3616a8.netlify.app/',
    img: 'spotify-b.jpg'
  },
  {
    id: 2,
    title: 'To-do List',
    desc: 'A to-do web application to add tasks and mark them as done.',
    tech: ['JavaScript', 'HTML', 'CSS'],
    link: 'https://loquacious-raindrop-77d1e1.netlify.app/',
    img: 'to-do.png'
  },
  {
    id: 3,
    title: 'Weather App',
    desc: 'A weather checking web app to check conditions for different locations.',
    tech: ['JavaScript', 'API', 'CSS'],
    link: 'https://monumental-froyo-6004d5.netlify.app/',
    img: 'weather app.jpg'
  }
];

const DEFAULT_SKILLS = [
  { id: 1, icon: '⚙️', title: 'Backend',  items: ['Node.js', 'Express', 'REST APIs', 'MongoDB'] },
  { id: 2, icon: '🎨', title: 'Frontend', items: ['HTML5', 'CSS3', 'JavaScript', 'React'] },
  { id: 3, icon: '🛠', title: 'Tools',    items: ['Git', 'VS Code', 'Linux', 'Postman'] },
  { id: 4, icon: '☁️', title: 'Cloud',    items: ['Netlify', 'Vercel', 'GitHub Pages'] }
];

const ADMIN_CREDS = { user: 'admin', pass: 'admin123' };

// ===== STORAGE HELPERS =====
function getProfile()  { return JSON.parse(localStorage.getItem('portfolio_profile'))  || DEFAULT_PROFILE; }
function getProjects() { return JSON.parse(localStorage.getItem('portfolio_projects')) || DEFAULT_PROJECTS; }
function getSkills()   { return JSON.parse(localStorage.getItem('portfolio_skills'))   || DEFAULT_SKILLS; }
function saveStorage(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// ===== PAGE ROUTING =====
function showPage(page) {
  // hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // hide navbar on admin page
  document.getElementById('navbar').style.display = (page === 'admin' || page === 'admin-login') ? 'none' : 'flex';

  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  // update nav active state
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  // render content for each page
  if (page === 'about')  renderAbout();
  if (page === 'repos')  renderRepos();
  if (page === 'ping')   renderPing();
  if (page === 'admin')  renderAdmin();

  window.scrollTo(0, 0);
}

// ===== RENDER HOME =====
function renderHome() {
  const p = getProfile();
  document.getElementById('hero-name').textContent = p.name;
  document.getElementById('hero-tagline').textContent = p.tagline;
  const img = document.getElementById('hero-avatar-img');
  img.src = p.avatar || 'developer.png';
  img.onerror = () => { img.src = 'developer.png'; };
}

// ===== RENDER ABOUT =====
function renderAbout() {
  const p = getProfile();

  // bio
  const bioEl = document.getElementById('about-bio-text');
  bioEl.innerHTML = '';
  const lines = Array.isArray(p.bio) ? p.bio : p.bio.split('\n').filter(l => l.trim());
  lines.forEach(line => {
    const para = document.createElement('p');
    para.textContent = line;
    bioEl.appendChild(para);
  });

  // links
  const ghLink = document.getElementById('about-github-link');
  const liLink = document.getElementById('about-linkedin-link');
  ghLink.href = p.github || '#';
  ghLink.style.display = p.github ? '' : 'none';
  liLink.href = p.linkedin || '#';
  liLink.style.display = p.linkedin ? '' : 'none';

  // skills
  const grid = document.getElementById('skills-grid');
  grid.innerHTML = '';
  getSkills().forEach(s => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <div class="skill-card-title">${s.icon} ${s.title}</div>
      <div class="skill-tags">${s.items.map(i => `<span class="skill-tag">${i}</span>`).join('')}</div>
    `;
    grid.appendChild(card);
  });
}

// ===== RENDER REPOS =====
function renderRepos(filter = 'all') {
  const projects = getProjects();
  const grid = document.getElementById('projects-grid');
  const filterBar = document.getElementById('filter-bar');

  // build tech tags for filter
  const allTags = new Set();
  projects.forEach(p => p.tech.forEach(t => allTags.add(t)));

  filterBar.innerHTML = `<button class="filter-btn ${filter === 'all' ? 'active' : ''}" onclick="renderRepos('all')">All</button>`;
  allTags.forEach(tag => {
    filterBar.innerHTML += `<button class="filter-btn ${filter === tag ? 'active' : ''}" onclick="renderRepos('${tag}')">${tag}</button>`;
  });

  // render cards
  const filtered = filter === 'all' ? projects : projects.filter(p => p.tech.includes(filter));
  grid.innerHTML = '';
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    const imgSrc = p.img || 'developer.png';
    card.innerHTML = `
      <img src="${imgSrc}" alt="${p.title}" onerror="this.style.display='none'" />
      <div class="project-card-body">
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.desc}</div>
        <div class="project-tags">${p.tech.map(t => `<span class="skill-tag">${t}</span>`).join('')}</div>
        ${p.link ? `<a href="${p.link}" target="_blank" class="project-link">→ View on GitHub</a>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);font-family:var(--font-mono);font-size:0.8rem;">No projects found.</p>';
  }
}

// ===== RENDER PING =====
function renderPing() {
  const p = getProfile();
  const emailEl = document.getElementById('contact-email');
  const ghEl = document.getElementById('contact-github');
  const liEl = document.getElementById('contact-linkedin');
  emailEl.href = 'mailto:' + p.email;
  emailEl.textContent = p.email;
  ghEl.href = p.github || '#';
  ghEl.textContent = p.github || '';
  liEl.href = p.linkedin || '#';
  liEl.textContent = p.linkedin || '';
}

// ===== AUTH =====
function isLoggedIn() { return sessionStorage.getItem('admin_auth') === 'true'; }

function doLogin() {
  const u = document.getElementById('login-user').value.trim();
  const pw = document.getElementById('login-pass').value;
  const errEl = document.getElementById('login-error');

  if (u === ADMIN_CREDS.user && pw === ADMIN_CREDS.pass) {
    sessionStorage.setItem('admin_auth', 'true');
    errEl.classList.add('hidden');
    showPage('admin');
  } else {
    errEl.textContent = 'Invalid credentials. Try again.';
    errEl.classList.remove('hidden');
  }
}

document.getElementById('login-pass') && document.getElementById('login-pass').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

function doLogout() {
  sessionStorage.removeItem('admin_auth');
  showPage('home');
}

// ===== RENDER ADMIN =====
function renderAdmin() {
  if (!isLoggedIn()) { showPage('admin-login'); return; }
  loadProfileForm();
  renderAdminProjects();
  renderAdminSkills();
}

function showAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`.admin-nav-item[data-tab="${tab}"]`).classList.add('active');
}

// ===== PROFILE ADMIN =====
function loadProfileForm() {
  const p = getProfile();
  document.getElementById('profile-name').value    = p.name || '';
  document.getElementById('profile-email').value   = p.email || '';
  document.getElementById('profile-tagline').value = p.tagline || '';
  const bioLines = Array.isArray(p.bio) ? p.bio.join('\n') : (p.bio || '');
  document.getElementById('profile-bio').value     = bioLines;
  document.getElementById('profile-github').value  = p.github || '';
  document.getElementById('profile-linkedin').value = p.linkedin || '';
  document.getElementById('profile-twitter').value = p.twitter || '';
  document.getElementById('profile-website').value = p.website || '';
  document.getElementById('avatar-url').value      = (p.avatar && !p.avatar.startsWith('data:')) ? p.avatar : '';
  document.getElementById('resume-url').value      = (p.resume && !p.resume.startsWith('data:')) ? p.resume : '';
  const av = document.getElementById('admin-avatar-preview');
  av.src = p.avatar || 'developer.png';
  av.onerror = () => { av.src = 'developer.png'; };
}

function previewAvatar(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('admin-avatar-preview').src = e.target.result;
      document.getElementById('avatar-url').value = '';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function handleResumeUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => { document.getElementById('resume-url').value = ''; };
    reader.readAsDataURL(input.files[0]);
  }
}

function saveProfile() {
  const p = getProfile();
  const bioRaw = document.getElementById('profile-bio').value;
  const avatarFile = document.getElementById('avatar-file');
  const resumeFile = document.getElementById('resume-file');

  const updated = {
    ...p,
    name:     document.getElementById('profile-name').value.trim(),
    email:    document.getElementById('profile-email').value.trim(),
    tagline:  document.getElementById('profile-tagline').value.trim(),
    bio:      bioRaw.split('\n').filter(l => l.trim()),
    github:   document.getElementById('profile-github').value.trim(),
    linkedin: document.getElementById('profile-linkedin').value.trim(),
    twitter:  document.getElementById('profile-twitter').value.trim(),
    website:  document.getElementById('profile-website').value.trim(),
  };

  // avatar: file takes priority, then URL field
  const avatarUrlField = document.getElementById('avatar-url').value.trim();
  if (avatarFile.files && avatarFile.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      updated.avatar = e.target.result;
      finishSaveProfile(updated);
    };
    reader.readAsDataURL(avatarFile.files[0]);
    return;
  } else if (avatarUrlField) {
    updated.avatar = avatarUrlField;
  }

  // resume
  const resumeUrlField = document.getElementById('resume-url').value.trim();
  if (resumeFile.files && resumeFile.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      updated.resume = e.target.result;
      finishSaveProfile(updated);
    };
    reader.readAsDataURL(resumeFile.files[0]);
    return;
  } else if (resumeUrlField) {
    updated.resume = resumeUrlField;
  }

  finishSaveProfile(updated);
}

function finishSaveProfile(data) {
  saveStorage('portfolio_profile', data);
  const msg = document.getElementById('profile-saved-msg');
  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 3000);
  renderHome();
}

// ===== PROJECTS ADMIN =====
function previewProjectImg(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('proj-img-preview').src = e.target.result;
      document.getElementById('proj-img-preview-wrap').classList.remove('hidden');
      document.getElementById('proj-img-url').value = '';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function addProject() {
  const title = document.getElementById('proj-title').value.trim();
  const link  = document.getElementById('proj-link').value.trim();
  const desc  = document.getElementById('proj-desc').value.trim();
  const tech  = document.getElementById('proj-tech').value.split(',').map(t => t.trim()).filter(Boolean);
  const imgUrl = document.getElementById('proj-img-url').value.trim();
  const imgFile = document.getElementById('proj-img-file');

  if (!title) return alert('Project title is required.');

  const projects = getProjects();
  const newProj = {
    id: Date.now(),
    title, link, desc, tech,
    img: imgUrl || null
  };

  if (imgFile.files && imgFile.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      newProj.img = e.target.result;
      projects.push(newProj);
      saveStorage('portfolio_projects', projects);
      clearProjectForm();
      renderAdminProjects();
    };
    reader.readAsDataURL(imgFile.files[0]);
  } else {
    projects.push(newProj);
    saveStorage('portfolio_projects', projects);
    clearProjectForm();
    renderAdminProjects();
  }
}

function clearProjectForm() {
  ['proj-title','proj-link','proj-desc','proj-tech','proj-img-url'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('proj-img-file').value = '';
  document.getElementById('proj-img-preview-wrap').classList.add('hidden');
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  const updated = getProjects().filter(p => p.id !== id);
  saveStorage('portfolio_projects', updated);
  renderAdminProjects();
}

function toggleProjectEdit(id) {
  const form = document.getElementById('proj-edit-' + id);
  const arrow = document.getElementById('proj-arrow-' + id);
  const isOpen = !form.classList.contains('hidden');
  // close all others first
  document.querySelectorAll('.edit-form').forEach(f => f.classList.add('hidden'));
  document.querySelectorAll('.list-arrow').forEach(a => a.textContent = '▶');
  if (!isOpen) {
    form.classList.remove('hidden');
    arrow.textContent = '▼';
  }
}

function saveProject(id) {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return;

  const title   = document.getElementById(`ep-title-${id}`).value.trim();
  const link    = document.getElementById(`ep-link-${id}`).value.trim();
  const desc    = document.getElementById(`ep-desc-${id}`).value.trim();
  const tech    = document.getElementById(`ep-tech-${id}`).value.split(',').map(t => t.trim()).filter(Boolean);
  const imgUrl  = document.getElementById(`ep-img-url-${id}`).value.trim();
  const imgFile = document.getElementById(`ep-img-file-${id}`);

  if (!title) return alert('Title is required.');

  const updated = { ...projects[idx], title, link, desc, tech };
  if (imgUrl) updated.img = imgUrl;

  if (imgFile.files && imgFile.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      updated.img = e.target.result;
      projects[idx] = updated;
      saveStorage('portfolio_projects', projects);
      renderAdminProjects();
    };
    reader.readAsDataURL(imgFile.files[0]);
  } else {
    projects[idx] = updated;
    saveStorage('portfolio_projects', projects);
    renderAdminProjects();
  }
}

function renderAdminProjects() {
  const list = document.getElementById('admin-projects-list');
  list.innerHTML = '';
  getProjects().forEach(p => {
    const item = document.createElement('div');
    item.className = 'admin-list-item-wrap';
    item.innerHTML = `
      <div class="admin-list-item" onclick="toggleProjectEdit(${p.id})">
        <span class="list-arrow" id="proj-arrow-${p.id}">▶</span>
        <span class="list-item-name">${p.title}</span>
        <div class="list-item-tags">${p.tech.map(t => `<span class="skill-tag">${t}</span>`).join('')}</div>
        <div class="list-item-actions" onclick="event.stopPropagation()">
          <button class="btn-edit" onclick="toggleProjectEdit(${p.id})">Edit</button>
          <button class="btn-del"  onclick="deleteProject(${p.id})">Delete</button>
        </div>
      </div>
      <div class="edit-form hidden" id="proj-edit-${p.id}">
        <div class="form-row">
          <div class="form-group">
            <label>title</label>
            <input type="text" id="ep-title-${p.id}" value="${escHtml(p.title)}" />
          </div>
          <div class="form-group">
            <label>link</label>
            <input type="text" id="ep-link-${p.id}" value="${escHtml(p.link || '')}" />
          </div>
        </div>
        <div class="form-group">
          <label>description</label>
          <textarea id="ep-desc-${p.id}" rows="3">${escHtml(p.desc || '')}</textarea>
        </div>
        <div class="form-group">
          <label>tech (comma-separated)</label>
          <input type="text" id="ep-tech-${p.id}" value="${escHtml(p.tech.join(', '))}" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>new image (upload)</label>
            <input type="file" id="ep-img-file-${p.id}" accept="image/*" />
          </div>
          <div class="form-group">
            <label>or image URL</label>
            <input type="text" id="ep-img-url-${p.id}" value="${escHtml(!p.img || p.img.startsWith('data:') ? '' : p.img)}" placeholder="https://..." />
          </div>
        </div>
        <div class="edit-form-actions">
          <button class="btn-save" onclick="saveProject(${p.id})">💾 Save</button>
          <button class="btn-cancel" onclick="toggleProjectEdit(${p.id})">Cancel</button>
        </div>
      </div>
    `;
    list.appendChild(item);
  });
}

// ===== SKILLS ADMIN =====
function addSkillCategory() {
  const icon  = document.getElementById('skill-icon').value.trim() || '⚙️';
  const title = document.getElementById('skill-title').value.trim();
  const items = document.getElementById('skill-items').value.split(',').map(i => i.trim()).filter(Boolean);

  if (!title) return alert('Skill category title is required.');

  const skills = getSkills();
  skills.push({ id: Date.now(), icon, title, items });
  saveStorage('portfolio_skills', skills);

  document.getElementById('skill-icon').value  = '';
  document.getElementById('skill-title').value = '';
  document.getElementById('skill-items').value = '';
  renderAdminSkills();
}

function deleteSkill(id) {
  if (!confirm('Delete this skill category?')) return;
  const updated = getSkills().filter(s => s.id !== id);
  saveStorage('portfolio_skills', updated);
  renderAdminSkills();
}

function toggleSkillEdit(id) {
  const form = document.getElementById('skill-edit-' + id);
  const arrow = document.getElementById('skill-arrow-' + id);
  const isOpen = !form.classList.contains('hidden');
  document.querySelectorAll('.edit-form').forEach(f => f.classList.add('hidden'));
  document.querySelectorAll('.list-arrow').forEach(a => a.textContent = '▶');
  if (!isOpen) {
    form.classList.remove('hidden');
    arrow.textContent = '▼';
  }
}

function saveSkill(id) {
  const skills = getSkills();
  const idx = skills.findIndex(s => s.id === id);
  if (idx === -1) return;

  const icon  = document.getElementById(`es-icon-${id}`).value.trim() || '⚙️';
  const title = document.getElementById(`es-title-${id}`).value.trim();
  const items = document.getElementById(`es-items-${id}`).value.split(',').map(i => i.trim()).filter(Boolean);

  if (!title) return alert('Title is required.');

  skills[idx] = { ...skills[idx], icon, title, items };
  saveStorage('portfolio_skills', skills);
  renderAdminSkills();
}

function renderAdminSkills() {
  const list = document.getElementById('admin-skills-list');
  list.innerHTML = '';
  getSkills().forEach(s => {
    const item = document.createElement('div');
    item.className = 'admin-list-item-wrap';
    item.innerHTML = `
      <div class="admin-list-item" onclick="toggleSkillEdit(${s.id})">
        <span class="list-arrow" id="skill-arrow-${s.id}">▶</span>
        <span class="list-item-name">${s.icon} ${s.title}</span>
        <div class="list-item-tags">${s.items.map(i => `<span class="skill-tag">${i}</span>`).join('')}</div>
        <div class="list-item-actions" onclick="event.stopPropagation()">
          <button class="btn-edit" onclick="toggleSkillEdit(${s.id})">Edit</button>
          <button class="btn-del"  onclick="deleteSkill(${s.id})">Delete</button>
        </div>
      </div>
      <div class="edit-form hidden" id="skill-edit-${s.id}">
        <div class="form-row">
          <div class="form-group" style="max-width:90px">
            <label>icon (emoji)</label>
            <input type="text" id="es-icon-${s.id}" value="${escHtml(s.icon)}" />
          </div>
          <div class="form-group">
            <label>title</label>
            <input type="text" id="es-title-${s.id}" value="${escHtml(s.title)}" />
          </div>
        </div>
        <div class="form-group">
          <label>items (comma-separated)</label>
          <input type="text" id="es-items-${s.id}" value="${escHtml(s.items.join(', '))}" />
        </div>
        <div class="edit-form-actions">
          <button class="btn-save" onclick="saveSkill(${s.id})">💾 Save</button>
          <button class="btn-cancel" onclick="toggleSkillEdit(${s.id})">Cancel</button>
        </div>
      </div>
    `;
    list.appendChild(item);
  });
}

// ===== UTILITY =====
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  showPage('home');
});
