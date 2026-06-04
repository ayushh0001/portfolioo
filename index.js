// ===== SUPABASE INIT =====
const SUPABASE_URL = 'https://frgugoynuvbfqcvsoint.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZ3Vnb3ludXZiZnFjdnNvaW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODc1MTgsImV4cCI6MjA5NjE2MzUxOH0.8Fe9Aq0GiGitgCZyNWzRJY13Fbdqvh2YwDb2taLMIk0';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_CREDS = { user: 'admin', pass: 'admin123' };

// ===== DB HELPERS =====
async function getProfile() {
  const { data, error } = await sb.from('profile').select('*').eq('id', 1).single();
  if (error) { console.error('getProfile:', error); return {}; }
  return data;
}

async function getProjects() {
  const { data, error } = await sb.from('projects').select('*').order('created_at', { ascending: true });
  if (error) { console.error('getProjects:', error); return []; }
  return data;
}

async function getSkills() {
  const { data, error } = await sb.from('skills').select('*').order('created_at', { ascending: true });
  if (error) { console.error('getSkills:', error); return []; }
  return data;
}

// ===== PAGE ROUTING =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('navbar').style.display =
    (page === 'admin' || page === 'admin-login') ? 'none' : 'flex';

  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  if (page === 'about')  renderAbout();
  if (page === 'repos')  renderRepos();
  if (page === 'ping')   renderPing();
  if (page === 'admin')  renderAdmin();

  window.scrollTo(0, 0);
}

// ===== LOADING STATE =====
function setLoading(containerId, msg = 'Loading...') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<p class="loading-msg">${msg}</p>`;
}

// ===== RENDER HOME =====
async function renderHome() {
  const p = await getProfile();
  if (!p.name) return;
  document.getElementById('hero-name').textContent = p.name;
  document.getElementById('hero-tagline').textContent = p.tagline || '';
  const img = document.getElementById('hero-avatar-img');
  img.src = p.avatar || 'developer.png';
  img.onerror = () => { img.src = 'developer.png'; };
}

// ===== RENDER ABOUT =====
async function renderAbout() {
  const p = await getProfile();

  const bioEl = document.getElementById('about-bio-text');
  bioEl.innerHTML = '';
  const lines = Array.isArray(p.bio) ? p.bio : (p.bio || '').split('\n').filter(l => l.trim());
  lines.forEach(line => {
    const para = document.createElement('p');
    para.textContent = line;
    bioEl.appendChild(para);
  });

  const ghLink = document.getElementById('about-github-link');
  const liLink = document.getElementById('about-linkedin-link');
  ghLink.href = p.github || '#';
  ghLink.style.display = p.github ? '' : 'none';
  liLink.href = p.linkedin || '#';
  liLink.style.display = p.linkedin ? '' : 'none';

  const grid = document.getElementById('skills-grid');
  setLoading('skills-grid', '// loading skills...');
  const skills = await getSkills();
  grid.innerHTML = '';
  skills.forEach(s => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <div class="skill-card-title">${s.icon || ''} ${s.title}</div>
      <div class="skill-tags">${(s.items || []).map(i => `<span class="skill-tag">${i}</span>`).join('')}</div>
    `;
    grid.appendChild(card);
  });
}

// ===== RENDER REPOS =====
async function renderRepos(filter = 'all') {
  const grid = document.getElementById('projects-grid');
  const filterBar = document.getElementById('filter-bar');
  setLoading('projects-grid', '// fetching repos...');

  const projects = await getProjects();

  const allTags = new Set();
  projects.forEach(p => (p.tech || []).forEach(t => allTags.add(t)));

  filterBar.innerHTML = `<button class="filter-btn ${filter === 'all' ? 'active' : ''}" onclick="renderRepos('all')">All</button>`;
  allTags.forEach(tag => {
    filterBar.innerHTML += `<button class="filter-btn ${filter === tag ? 'active' : ''}" onclick="renderRepos('${tag}')">${tag}</button>`;
  });

  const filtered = filter === 'all' ? projects : projects.filter(p => (p.tech || []).includes(filter));
  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);font-family:var(--font-mono);font-size:0.8rem;">No projects found.</p>';
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      ${p.img ? `<img src="${p.img}" alt="${p.title}" onerror="this.style.display='none'" />` : ''}
      <div class="project-card-body">
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.description || ''}</div>
        <div class="project-tags">${(p.tech || []).map(t => `<span class="skill-tag">${t}</span>`).join('')}</div>
        ${p.link ? `<a href="${p.link}" target="_blank" class="project-link">→ View on GitHub</a>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===== RENDER PING =====
async function renderPing() {
  const p = await getProfile();
  const emailEl = document.getElementById('contact-email');
  const ghEl    = document.getElementById('contact-github');
  const liEl    = document.getElementById('contact-linkedin');
  emailEl.href = 'mailto:' + (p.email || '');
  emailEl.textContent = p.email || '';
  ghEl.href = p.github || '#';
  ghEl.textContent = p.github || '';
  liEl.href = p.linkedin || '#';
  liEl.textContent = p.linkedin || '';
}

// ===== AUTH =====
function isLoggedIn() { return sessionStorage.getItem('admin_auth') === 'true'; }

function doLogin() {
  const u    = document.getElementById('login-user').value.trim();
  const pw   = document.getElementById('login-pass').value;
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

document.getElementById('login-pass').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

function doLogout() {
  sessionStorage.removeItem('admin_auth');
  showPage('home');
}

// ===== RENDER ADMIN =====
async function renderAdmin() {
  if (!isLoggedIn()) { showPage('admin-login'); return; }
  await loadProfileForm();
  await renderAdminProjects();
  await renderAdminSkills();
}

function showAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`.admin-nav-item[data-tab="${tab}"]`).classList.add('active');
}

// ===== PROFILE ADMIN =====
async function loadProfileForm() {
  const p = await getProfile();
  document.getElementById('profile-name').value     = p.name || '';
  document.getElementById('profile-email').value    = p.email || '';
  document.getElementById('profile-tagline').value  = p.tagline || '';
  const bioLines = Array.isArray(p.bio) ? p.bio.join('\n') : (p.bio || '');
  document.getElementById('profile-bio').value      = bioLines;
  document.getElementById('profile-github').value   = p.github || '';
  document.getElementById('profile-linkedin').value = p.linkedin || '';
  document.getElementById('profile-twitter').value  = p.twitter || '';
  document.getElementById('profile-website').value  = p.website || '';
  document.getElementById('avatar-url').value       = (p.avatar && !p.avatar.startsWith('data:')) ? p.avatar : '';
  document.getElementById('resume-url').value       = (p.resume && !p.resume.startsWith('data:')) ? p.resume : '';
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

async function saveProfile() {
  const bioRaw    = document.getElementById('profile-bio').value;
  const avatarFile = document.getElementById('avatar-file');
  const resumeFile = document.getElementById('resume-file');
  const avatarUrl  = document.getElementById('avatar-url').value.trim();
  const resumeUrl  = document.getElementById('resume-url').value.trim();

  const updated = {
    name:     document.getElementById('profile-name').value.trim(),
    email:    document.getElementById('profile-email').value.trim(),
    tagline:  document.getElementById('profile-tagline').value.trim(),
    bio:      bioRaw.split('\n').filter(l => l.trim()),
    github:   document.getElementById('profile-github').value.trim(),
    linkedin: document.getElementById('profile-linkedin').value.trim(),
    twitter:  document.getElementById('profile-twitter').value.trim(),
    website:  document.getElementById('profile-website').value.trim(),
    avatar:   avatarUrl || undefined,
    resume:   resumeUrl || undefined,
  };

  // handle avatar file → base64
  const readFile = (file) => new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(file);
  });

  if (avatarFile.files && avatarFile.files[0]) {
    updated.avatar = await readFile(avatarFile.files[0]);
  }
  if (resumeFile.files && resumeFile.files[0]) {
    updated.resume = await readFile(resumeFile.files[0]);
  }

  // remove undefined keys
  Object.keys(updated).forEach(k => updated[k] === undefined && delete updated[k]);

  const { error } = await sb.from('profile').update(updated).eq('id', 1);
  const msg = document.getElementById('profile-saved-msg');
  if (error) {
    msg.textContent = '✗ Error: ' + error.message;
    msg.style.color = 'var(--red)';
  } else {
    msg.textContent = '✓ Profile saved successfully';
    msg.style.color = 'var(--green)';
    renderHome();
  }
  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 3000);
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

async function addProject() {
  const title  = document.getElementById('proj-title').value.trim();
  const link   = document.getElementById('proj-link').value.trim();
  const desc   = document.getElementById('proj-desc').value.trim();
  const tech   = document.getElementById('proj-tech').value.split(',').map(t => t.trim()).filter(Boolean);
  const imgUrl = document.getElementById('proj-img-url').value.trim();
  const imgFile = document.getElementById('proj-img-file');

  if (!title) return alert('Project title is required.');

  let img = imgUrl || null;
  if (imgFile.files && imgFile.files[0]) {
    img = await new Promise(res => {
      const r = new FileReader();
      r.onload = e => res(e.target.result);
      r.readAsDataURL(imgFile.files[0]);
    });
  }

  const { error } = await sb.from('projects').insert({ title, link, description: desc, tech, img });
  if (error) return alert('Error adding project: ' + error.message);

  clearProjectForm();
  await renderAdminProjects();
}

function clearProjectForm() {
  ['proj-title','proj-link','proj-desc','proj-tech','proj-img-url'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('proj-img-file').value = '';
  document.getElementById('proj-img-preview-wrap').classList.add('hidden');
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  const { error } = await sb.from('projects').delete().eq('id', id);
  if (error) return alert('Error: ' + error.message);
  await renderAdminProjects();
}

function toggleProjectEdit(id) {
  const form  = document.getElementById('proj-edit-' + id);
  const arrow = document.getElementById('proj-arrow-' + id);
  const isOpen = !form.classList.contains('hidden');
  document.querySelectorAll('.edit-form').forEach(f => f.classList.add('hidden'));
  document.querySelectorAll('.list-arrow').forEach(a => a.textContent = '▶');
  if (!isOpen) { form.classList.remove('hidden'); arrow.textContent = '▼'; }
}

async function saveProject(id) {
  const title  = document.getElementById(`ep-title-${id}`).value.trim();
  const link   = document.getElementById(`ep-link-${id}`).value.trim();
  const desc   = document.getElementById(`ep-desc-${id}`).value.trim();
  const tech   = document.getElementById(`ep-tech-${id}`).value.split(',').map(t => t.trim()).filter(Boolean);
  const imgUrl = document.getElementById(`ep-img-url-${id}`).value.trim();
  const imgFile = document.getElementById(`ep-img-file-${id}`);

  if (!title) return alert('Title is required.');

  const updates = { title, link, description: desc, tech };
  if (imgUrl) updates.img = imgUrl;
  if (imgFile.files && imgFile.files[0]) {
    updates.img = await new Promise(res => {
      const r = new FileReader();
      r.onload = e => res(e.target.result);
      r.readAsDataURL(imgFile.files[0]);
    });
  }

  const { error } = await sb.from('projects').update(updates).eq('id', id);
  if (error) return alert('Error: ' + error.message);
  await renderAdminProjects();
}

async function renderAdminProjects() {
  const list = document.getElementById('admin-projects-list');
  list.innerHTML = '<p class="loading-msg">// loading...</p>';
  const projects = await getProjects();
  list.innerHTML = '';
  projects.forEach(p => {
    const item = document.createElement('div');
    item.className = 'admin-list-item-wrap';
    item.innerHTML = `
      <div class="admin-list-item" onclick="toggleProjectEdit(${p.id})">
        <span class="list-arrow" id="proj-arrow-${p.id}">▶</span>
        <span class="list-item-name">${p.title}</span>
        <div class="list-item-tags">${(p.tech||[]).map(t=>`<span class="skill-tag">${t}</span>`).join('')}</div>
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
            <input type="text" id="ep-link-${p.id}" value="${escHtml(p.link||'')}" />
          </div>
        </div>
        <div class="form-group">
          <label>description</label>
          <textarea id="ep-desc-${p.id}" rows="3">${escHtml(p.description||'')}</textarea>
        </div>
        <div class="form-group">
          <label>tech (comma-separated)</label>
          <input type="text" id="ep-tech-${p.id}" value="${escHtml((p.tech||[]).join(', '))}" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>new image (upload)</label>
            <input type="file" id="ep-img-file-${p.id}" accept="image/*" />
          </div>
          <div class="form-group">
            <label>or image URL</label>
            <input type="text" id="ep-img-url-${p.id}" value="${escHtml(!p.img||p.img.startsWith('data:')?'':p.img)}" placeholder="https://..." />
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
async function addSkillCategory() {
  const icon  = document.getElementById('skill-icon').value.trim() || '⚙️';
  const title = document.getElementById('skill-title').value.trim();
  const items = document.getElementById('skill-items').value.split(',').map(i => i.trim()).filter(Boolean);

  if (!title) return alert('Skill category title is required.');

  const { error } = await sb.from('skills').insert({ icon, title, items });
  if (error) return alert('Error: ' + error.message);

  document.getElementById('skill-icon').value  = '';
  document.getElementById('skill-title').value = '';
  document.getElementById('skill-items').value = '';
  await renderAdminSkills();
}

async function deleteSkill(id) {
  if (!confirm('Delete this skill category?')) return;
  const { error } = await sb.from('skills').delete().eq('id', id);
  if (error) return alert('Error: ' + error.message);
  await renderAdminSkills();
}

function toggleSkillEdit(id) {
  const form  = document.getElementById('skill-edit-' + id);
  const arrow = document.getElementById('skill-arrow-' + id);
  const isOpen = !form.classList.contains('hidden');
  document.querySelectorAll('.edit-form').forEach(f => f.classList.add('hidden'));
  document.querySelectorAll('.list-arrow').forEach(a => a.textContent = '▶');
  if (!isOpen) { form.classList.remove('hidden'); arrow.textContent = '▼'; }
}

async function saveSkill(id) {
  const icon  = document.getElementById(`es-icon-${id}`).value.trim() || '⚙️';
  const title = document.getElementById(`es-title-${id}`).value.trim();
  const items = document.getElementById(`es-items-${id}`).value.split(',').map(i => i.trim()).filter(Boolean);

  if (!title) return alert('Title is required.');

  const { error } = await sb.from('skills').update({ icon, title, items }).eq('id', id);
  if (error) return alert('Error: ' + error.message);
  await renderAdminSkills();
}

async function renderAdminSkills() {
  const list = document.getElementById('admin-skills-list');
  list.innerHTML = '<p class="loading-msg">// loading...</p>';
  const skills = await getSkills();
  list.innerHTML = '';
  skills.forEach(s => {
    const item = document.createElement('div');
    item.className = 'admin-list-item-wrap';
    item.innerHTML = `
      <div class="admin-list-item" onclick="toggleSkillEdit(${s.id})">
        <span class="list-arrow" id="skill-arrow-${s.id}">▶</span>
        <span class="list-item-name">${s.icon||''} ${s.title}</span>
        <div class="list-item-tags">${(s.items||[]).map(i=>`<span class="skill-tag">${i}</span>`).join('')}</div>
        <div class="list-item-actions" onclick="event.stopPropagation()">
          <button class="btn-edit" onclick="toggleSkillEdit(${s.id})">Edit</button>
          <button class="btn-del"  onclick="deleteSkill(${s.id})">Delete</button>
        </div>
      </div>
      <div class="edit-form hidden" id="skill-edit-${s.id}">
        <div class="form-row">
          <div class="form-group" style="max-width:90px">
            <label>icon (emoji)</label>
            <input type="text" id="es-icon-${s.id}" value="${escHtml(s.icon||'')}" />
          </div>
          <div class="form-group">
            <label>title</label>
            <input type="text" id="es-title-${s.id}" value="${escHtml(s.title)}" />
          </div>
        </div>
        <div class="form-group">
          <label>items (comma-separated)</label>
          <input type="text" id="es-items-${s.id}" value="${escHtml((s.items||[]).join(', '))}" />
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
