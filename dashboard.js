/* =========================================================
   ANAS ABUQUTA — PORTFOLIO DASHBOARD
   dashboard.js
   ========================================================= */
(function () {

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */
  function loadInitialData() {
    try {
      const stored = localStorage.getItem('portfolioData');
      if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(window.SITE_DATA));
  }

  let state = loadInitialData();
  let activeSection = 'brand';

  /* ---------------------------------------------------------
     PATH HELPERS  (dot paths, numeric segments index arrays)
  --------------------------------------------------------- */
  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  function setPath(obj, path, value) {
    const keys = path.split('.');
    let o = obj;
    for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
    o[keys[keys.length - 1]] = value;
  }

  /* ---------------------------------------------------------
     LIVE PREVIEW BRIDGE (debounced postMessage to iframe)
  --------------------------------------------------------- */
  const previewFrame = document.getElementById('previewFrame');
  let previewTimer = null;
  function schedulePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      try {
        previewFrame.contentWindow.postMessage({ type: 'PORTFOLIO_PREVIEW_UPDATE', payload: state }, '*');
      } catch (e) { /* iframe not ready yet */ }
    }, 250);
  }
  previewFrame.addEventListener('load', schedulePreview);

  function setStatus(msg) {
    const el = document.getElementById('statusMsg');
    el.textContent = msg;
    setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 2600);
  }

  /* ---------------------------------------------------------
     SMALL HTML BUILDERS
  --------------------------------------------------------- */
  function escAttr(str) { return String(str == null ? '' : str).replace(/"/g, '&quot;'); }

  function textField(label, path, value, opts) {
    opts = opts || {};
    const type = opts.type || 'text';
    return `
      <div class="field">
        <label>${label}</label>
        <input type="${type}" data-bind="${path}" data-vtype="${opts.vtype || 'string'}" value="${escAttr(value)}">
        ${opts.hint ? `<span class="sub-hint">${opts.hint}</span>` : ''}
      </div>`;
  }

  function textareaField(label, path, value, opts) {
    opts = opts || {};
    return `
      <div class="field">
        <label>${label}</label>
        <textarea data-bind="${path}" data-vtype="${opts.vtype || 'string'}" rows="${opts.rows || 4}">${value == null ? '' : String(value)}</textarea>
        ${opts.hint ? `<span class="sub-hint">${opts.hint}</span>` : ''}
      </div>`;
  }

  /* ---------------------------------------------------------
     SECTION RENDERERS
     Each returns an HTML string for the form panel.
  --------------------------------------------------------- */
  const sections = {};

  sections.brand = () => `
    <h2>Brand &amp; Meta</h2>
    <p class="hint">Site title, description, and the brand mark shown in the nav and footer.</p>
    ${textField('Brand name', 'meta.brandName', state.meta.brandName)}
    ${textField('Brand initials (nav mark)', 'meta.brandInitials', state.meta.brandInitials)}
    ${textField('Browser tab title', 'meta.pageTitle', state.meta.pageTitle)}
    ${textareaField('SEO description', 'meta.pageDescription', state.meta.pageDescription, { rows: 3 })}
    ${textField('Loader coordinate text', 'loader.coordinate', state.loader.coordinate, { hint: 'Shown on the loading screen, e.g. your city\u2019s coordinates.' })}
  `;

  sections.hero = () => `
    <h2>Hero</h2>
    <p class="hint">The first thing visitors see.</p>
    ${textField('Eyebrow tag', 'hero.eyebrow', state.hero.eyebrow)}
    <div class="field-row--3 field-row" style="margin-bottom:20px">
      ${textField('Title line 1', 'hero.titleLine1', state.hero.titleLine1)}
      ${textField('Italic word', 'hero.titleEm', state.hero.titleEm)}
      ${textField('Title line 2', 'hero.titleLine2', state.hero.titleLine2)}
    </div>
    ${textField('Title line 3', 'hero.titleLine3', state.hero.titleLine3)}
    ${textareaField('Rotating role titles (one per line)', 'hero.roles', state.hero.roles.join('\n'), { vtype: 'lines', rows: 4 })}
    ${textareaField('Summary paragraph', 'hero.summary', state.hero.summary, { rows: 4 })}
    <div class="field-row">
      ${textField('Primary button text', 'hero.primaryCtaText', state.hero.primaryCtaText)}
      ${textField('Secondary button text', 'hero.secondaryCtaText', state.hero.secondaryCtaText)}
    </div>
  `;

  sections.about = () => `
    <h2>About</h2>
    ${textField('Eyebrow tag', 'about.eyebrow', state.about.eyebrow)}
    ${textField('Section title (HTML allowed, e.g. &lt;br&gt;)', 'about.title', state.about.title)}
    ${textareaField('Paragraphs (leave a blank line between paragraphs)', 'about.paragraphs', state.about.paragraphs.join('\n\n'), { vtype: 'paragraphs', rows: 8 })}
    <div class="field" style="margin-top:24px">
      <label>Quick facts</label>
      <div class="rep-list" id="repList-facts"></div>
      <button class="add-btn" data-action="add-fact"><i class="fa-solid fa-plus"></i> Add fact</button>
    </div>
  `;

  sections.experience = () => `
    <h2>Experience</h2>
    ${textField('Eyebrow tag', 'experience.eyebrow', state.experience.eyebrow)}
    ${textField('Section title', 'experience.title', state.experience.title)}
    ${textareaField('Lede', 'experience.lede', state.experience.lede, { rows: 2 })}
    <div class="field" style="margin-top:20px">
      <label>Positions</label>
      <div class="rep-list" id="repList-experience"></div>
      <button class="add-btn" data-action="add-experience"><i class="fa-solid fa-plus"></i> Add position</button>
    </div>
  `;

  sections.education = () => `
    <h2>Education</h2>
    ${textField('Degree', 'education.degree', state.education.degree)}
    ${textField('Institution', 'education.institution', state.education.institution)}
    ${textField('GPA / grade', 'education.gpa', state.education.gpa)}
  `;

  sections.skills = () => `
    <h2>Skills</h2>
    ${textField('Eyebrow tag', 'skills.eyebrow', state.skills.eyebrow)}
    ${textField('Section title', 'skills.title', state.skills.title)}
    ${textareaField('Lede', 'skills.lede', state.skills.lede, { rows: 2 })}
    <div class="field" style="margin-top:20px">
      <label>Skill groups</label>
      <div class="rep-list" id="repList-skillgroups"></div>
      <button class="add-btn" data-action="add-skillgroup"><i class="fa-solid fa-plus"></i> Add group</button>
    </div>
    ${textareaField('Soft skills (comma-separated)', 'skills.softSkills', state.skills.softSkills.join(', '), { vtype: 'csv', rows: 2 })}
  `;

  sections.projects = () => `
    <h2>Projects</h2>
    ${textField('Eyebrow tag', 'projectsSection.eyebrow', state.projectsSection.eyebrow)}
    ${textField('Section title', 'projectsSection.title', state.projectsSection.title)}
    ${textareaField('Lede', 'projectsSection.lede', state.projectsSection.lede, { rows: 2 })}
    <div class="field" style="margin-top:20px">
      <label>Project list</label>
      <div class="rep-list" id="repList-projects"></div>
      <button class="add-btn" data-action="add-project"><i class="fa-solid fa-plus"></i> Add project</button>
    </div>
  `;

  sections.services = () => `
    <h2>Services</h2>
    ${textField('Eyebrow tag', 'services.eyebrow', state.services.eyebrow)}
    ${textField('Section title', 'services.title', state.services.title)}
    <div class="field" style="margin-top:20px">
      <label>Service cards</label>
      <div class="rep-list" id="repList-services"></div>
      <button class="add-btn" data-action="add-service"><i class="fa-solid fa-plus"></i> Add service</button>
    </div>
  `;

  sections.achievements = () => `
    <h2>Achievements</h2>
    ${textField('Eyebrow tag', 'achievements.eyebrow', state.achievements.eyebrow)}
    ${textField('Section title', 'achievements.title', state.achievements.title)}
    ${textField('Footnote', 'achievements.note', state.achievements.note)}
    <div class="field" style="margin-top:20px">
      <label>Counters</label>
      <div class="rep-list" id="repList-achievements"></div>
      <button class="add-btn" data-action="add-achievement"><i class="fa-solid fa-plus"></i> Add counter</button>
    </div>
  `;

  sections.certifications = () => `
    <h2>Certifications</h2>
    ${textField('Eyebrow tag', 'certifications.eyebrow', state.certifications.eyebrow)}
    ${textField('Section title', 'certifications.title', state.certifications.title)}
    <div class="field" style="margin-top:20px">
      <label>Certificates</label>
      <div class="rep-list" id="repList-certifications"></div>
      <button class="add-btn" data-action="add-certification"><i class="fa-solid fa-plus"></i> Add certificate</button>
    </div>
  `;

  sections.testimonials = () => `
    <h2>Testimonials</h2>
    ${textField('Eyebrow tag', 'testimonials.eyebrow', state.testimonials.eyebrow)}
    ${textField('Section title', 'testimonials.title', state.testimonials.title)}
    <div class="field" style="margin-top:20px">
      <label>Quotes</label>
      <div class="rep-list" id="repList-testimonials"></div>
      <button class="add-btn" data-action="add-testimonial"><i class="fa-solid fa-plus"></i> Add testimonial</button>
    </div>
  `;

  sections.dispatch = () => `
    <h2>Dispatch Log</h2>
    <p class="hint">The rotating lines in the hero's "live dispatch" panel — mix field-ops and code lines for the dual-identity effect.</p>
    <div class="field">
      <label>Log lines</label>
      <div class="rep-list" id="repList-dispatch"></div>
      <button class="add-btn" data-action="add-dispatch"><i class="fa-solid fa-plus"></i> Add line</button>
    </div>
  `;

  sections.github = () => `
    <h2>GitHub</h2>
    ${textField('Eyebrow tag', 'github.eyebrow', state.github.eyebrow)}
    ${textField('Section title', 'github.title', state.github.title)}
    ${textField('GitHub username', 'github.username', state.github.username, { hint: 'Used to build the stats-card embed snippet shown on the site.' })}
  `;

  sections.contact = () => `
    <h2>Contact &amp; Footer</h2>
    ${textField('Eyebrow tag', 'contact.eyebrow', state.contact.eyebrow)}
    ${textField('Section title', 'contact.title', state.contact.title)}
    ${textareaField('Lede', 'contact.lede', state.contact.lede, { rows: 2 })}
    <div class="field-row">
      ${textField('Email', 'contact.email', state.contact.email, { type: 'email' })}
      ${textField('Phone', 'contact.phone', state.contact.phone)}
    </div>
    <div class="field-row">
      ${textField('LinkedIn URL', 'contact.linkedin', state.contact.linkedin, { type: 'url' })}
      ${textField('Links', 'contact.github', state.contact.github, { type: 'url' })}
    </div>
    ${textField('Location', 'contact.location', state.contact.location)}
    ${textField('CV file URL', 'contact.cvUrl', state.contact.cvUrl, { hint: 'e.g. assets/Anas-AbuQuta-CV.pdf — leave blank to show a placeholder alert.' })}
    <hr style="border:none;border-top:1px solid var(--border);margin:26px 0">
    ${textareaField('Footer tagline', 'footer.tagline', state.footer.tagline, { rows: 2 })}
    ${textField('Footer copyright line', 'footer.copy', state.footer.copy)}
  `;

  /* ---------------------------------------------------------
     REPEATABLE LIST RENDERERS
     Each rebuilds its container's HTML from state, wiring
     data-bind paths for text edits and data-action for
     structural add/remove.
  --------------------------------------------------------- */
  function renderRepLists() {
    renderFacts();
    renderExperience();
    renderSkillGroups();
    renderProjectsList();
    renderServicesList();
    renderAchievementsList();
    renderCertificationsList();
    renderTestimonialsList();
    renderDispatchList();
  }

  function renderFacts() {
    const el = document.getElementById('repList-facts');
    if (!el) return;
    el.innerHTML = state.about.facts.map((f, i) => `
      <div class="rep-card">
        <div class="rep-card__head">
          <span class="rep-card__title">Fact ${i + 1}</span>
          <button class="rep-card__remove" data-action="remove-fact" data-index="${i}"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="field-row">
          ${textField('Label', `about.facts.${i}.label`, f.label)}
          ${textField('Value', `about.facts.${i}.value`, f.value)}
        </div>
      </div>`).join('');
  }

  function renderExperience() {
    const el = document.getElementById('repList-experience');
    if (!el) return;
    el.innerHTML = state.experience.items.map((item, i) => `
      <div class="rep-card">
        <div class="rep-card__head">
          <span class="rep-card__title">${item.role || 'Position ' + (i + 1)}</span>
          <button class="rep-card__remove" data-action="remove-experience" data-index="${i}"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="field-row">
          ${textField('Role title', `experience.items.${i}.role`, item.role)}
          ${textField('Date range', `experience.items.${i}.dateRange`, item.dateRange)}
        </div>
        <div class="field-row">
          ${textField('Organization', `experience.items.${i}.org`, item.org)}
          ${textField('Marker label (e.g. "now", "01")', `experience.items.${i}.marker`, item.marker)}
        </div>
        ${textareaField('Bullet points (one per line)', `experience.items.${i}.bullets`, item.bullets.join('\n'), { vtype: 'lines', rows: 4 })}
        ${textField('Tags (comma-separated)', `experience.items.${i}.tags`, item.tags.join(', '), { vtype: 'csv' })}
      </div>`).join('');
  }

  function renderSkillGroups() {
    const el = document.getElementById('repList-skillgroups');
    if (!el) return;
    el.innerHTML = state.skills.groups.map((group, gi) => `
      <div class="rep-card">
        <div class="rep-card__head">
          <span class="rep-card__title">${group.title || 'Group ' + (gi + 1)}</span>
          <button class="rep-card__remove" data-action="remove-skillgroup" data-index="${gi}"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="field-row">
          ${textField('Group title', `skills.groups.${gi}.title`, group.title)}
          ${textField('Icon class (Font Awesome)', `skills.groups.${gi}.icon`, group.icon)}
        </div>
        <label style="display:block;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);margin:14px 0 8px">Skills in this group</label>
        <div class="nested-list">
          ${group.items.map((it, ii) => `
            <div class="nested-row">
              <input type="text" placeholder="Skill label" data-bind="skills.groups.${gi}.items.${ii}.label" value="${escAttr(it.label)}">
              <input type="number" class="level-input" placeholder="%" min="0" max="100" data-bind="skills.groups.${gi}.items.${ii}.level" data-vtype="number" value="${escAttr(it.level)}">
              <button class="nested-remove" data-action="remove-skillitem" data-index="${gi}" data-subindex="${ii}"><i class="fa-solid fa-xmark"></i></button>
            </div>`).join('')}
        </div>
        <button class="add-btn dbtn--small" data-action="add-skillitem" data-index="${gi}"><i class="fa-solid fa-plus"></i> Add skill</button>
      </div>`).join('');
  }

  function renderProjectsList() {
    const el = document.getElementById('repList-projects');
    if (!el) return;
    el.innerHTML = state.projects.map((p, i) => `
      <div class="rep-card">
        <div class="rep-card__head">
          <span class="rep-card__title">${p.title || 'Project ' + (i + 1)}</span>
          <button class="rep-card__remove" data-action="remove-project" data-index="${i}"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="field-row">
          ${textField('Title', `projects.${i}.title`, p.title)}
          ${textField('Icon class (Font Awesome)', `projects.${i}.icon`, p.icon)}
        </div>
        <div class="field-row">
          <div class="field">
            <label>Category</label>
            <select data-bind="projects.${i}.category" style="width:100%;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;padding:11px 13px;color:var(--text-primary);font-size:.9rem;">
              <option value="fullstack" ${p.category === 'fullstack' ? 'selected' : ''}>Full-Stack</option>
              <option value="data" ${p.category === 'data' ? 'selected' : ''}>Data &amp; Python</option>
            </select>
          </div>
          ${textField('Tags (comma-separated)', `projects.${i}.tags`, p.tags.join(', '), { vtype: 'csv' })}
        </div>
        ${textareaField('Short description (card view)', `projects.${i}.short`, p.short, { rows: 2 })}
        ${textareaField('Full description (modal view)', `projects.${i}.description`, p.description, { rows: 3 })}
        ${textareaField('Features (one per line)', `projects.${i}.features`, p.features.join('\n'), { vtype: 'lines', rows: 4 })}
      </div>`).join('');
  }

  function renderServicesList() {
    const el = document.getElementById('repList-services');
    if (!el) return;
    el.innerHTML = state.services.items.map((s, i) => `
      <div class="rep-card">
        <div class="rep-card__head">
          <span class="rep-card__title">${s.title || 'Service ' + (i + 1)}</span>
          <button class="rep-card__remove" data-action="remove-service" data-index="${i}"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="field-row">
          ${textField('Title', `services.items.${i}.title`, s.title)}
          ${textField('Icon class (Font Awesome)', `services.items.${i}.icon`, s.icon)}
        </div>
        ${textareaField('Description', `services.items.${i}.text`, s.text, { rows: 2 })}
      </div>`).join('');
  }

  function renderAchievementsList() {
    const el = document.getElementById('repList-achievements');
    if (!el) return;
    el.innerHTML = state.achievements.counters.map((c, i) => `
      <div class="rep-card">
        <div class="rep-card__head">
          <span class="rep-card__title">${c.label || 'Counter ' + (i + 1)}</span>
          <button class="rep-card__remove" data-action="remove-achievement" data-index="${i}"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="field-row">
          ${textField('Label', `achievements.counters.${i}.label`, c.label)}
          ${textField('Target number', `achievements.counters.${i}.target`, c.target, { type: 'number', vtype: 'number' })}
        </div>
      </div>`).join('');
  }

  function renderCertificationsList() {
    const el = document.getElementById('repList-certifications');
    if (!el) return;
    el.innerHTML = state.certifications.items.map((c, i) => `
      <div class="rep-card">
        <div class="rep-card__head">
          <span class="rep-card__title">${c.title || 'Certificate ' + (i + 1)}</span>
          <button class="rep-card__remove" data-action="remove-certification" data-index="${i}"><i class="fa-solid fa-trash"></i></button>
        </div>
        ${textField('Title', `certifications.items.${i}.title`, c.title)}
        <div class="field-row">
          ${textField('Issuer / date', `certifications.items.${i}.issuer`, c.issuer)}
          ${textField('Credential link', `certifications.items.${i}.link`, c.link, { type: 'url' })}
        </div>
      </div>`).join('');
  }

  function renderTestimonialsList() {
    const el = document.getElementById('repList-testimonials');
    if (!el) return;
    el.innerHTML = state.testimonials.items.map((t, i) => `
      <div class="rep-card">
        <div class="rep-card__head">
          <span class="rep-card__title">${t.name || 'Testimonial ' + (i + 1)}</span>
          <button class="rep-card__remove" data-action="remove-testimonial" data-index="${i}"><i class="fa-solid fa-trash"></i></button>
        </div>
        ${textareaField('Quote', `testimonials.items.${i}.quote`, t.quote, { rows: 3 })}
        <div class="field-row">
          ${textField('Name', `testimonials.items.${i}.name`, t.name)}
          ${textField('Role / organization', `testimonials.items.${i}.role`, t.role)}
        </div>
      </div>`).join('');
  }

  function renderDispatchList() {
    const el = document.getElementById('repList-dispatch');
    if (!el) return;
    el.innerHTML = state.dispatchLog.map((d, i) => `
      <div class="nested-row">
        <input type="text" style="flex:0 0 90px" placeholder="[tag]" data-bind="dispatchLog.${i}.tag" value="${escAttr(d.tag)}">
        <input type="text" placeholder="Log line text" data-bind="dispatchLog.${i}.text" value="${escAttr(d.text)}">
        <button class="nested-remove" data-action="remove-dispatch" data-index="${i}"><i class="fa-solid fa-xmark"></i></button>
      </div>`).join('');
  }

  /* ---------------------------------------------------------
     STRUCTURAL ADD / REMOVE HANDLERS
  --------------------------------------------------------- */
  const structuralActions = {
    'add-fact': () => state.about.facts.push({ label: 'New label', value: 'New value' }),
    'remove-fact': (i) => state.about.facts.splice(i, 1),

    'add-experience': () => state.experience.items.unshift({
      marker: 'new', role: 'New role', dateRange: 'Month Year — Present', org: 'Organization name',
      bullets: ['Describe a responsibility'], tags: ['Tag']
    }),
    'remove-experience': (i) => state.experience.items.splice(i, 1),

    'add-skillgroup': () => state.skills.groups.push({ title: 'New group', icon: 'fa-solid fa-star', items: [{ label: 'New skill', level: 70 }] }),
    'remove-skillgroup': (i) => state.skills.groups.splice(i, 1),
    'add-skillitem': (i) => state.skills.groups[i].items.push({ label: 'New skill', level: 70 }),
    'remove-skillitem': (i, sub) => state.skills.groups[i].items.splice(sub, 1),

    'add-project': () => state.projects.unshift({
      id: 'project-' + Date.now(), category: 'fullstack', icon: 'fa-solid fa-diagram-project',
      title: 'New project', short: 'Short one-line description.', tags: ['Tag'],
      description: 'Full description for the modal view.', features: ['Feature one']
    }),
    'remove-project': (i) => state.projects.splice(i, 1),

    'add-service': () => state.services.items.push({ icon: 'fa-solid fa-star', title: 'New service', text: 'Describe this service.' }),
    'remove-service': (i) => state.services.items.splice(i, 1),

    'add-achievement': () => state.achievements.counters.push({ label: 'New metric', target: 1 }),
    'remove-achievement': (i) => state.achievements.counters.splice(i, 1),

    'add-certification': () => state.certifications.items.push({ title: 'Certificate title', issuer: 'Issuer · Date', link: '#' }),
    'remove-certification': (i) => state.certifications.items.splice(i, 1),

    'add-testimonial': () => state.testimonials.items.push({ quote: 'Quote text here.', name: 'Name', role: 'Role, Organization' }),
    'remove-testimonial': (i) => state.testimonials.items.splice(i, 1),

    'add-dispatch': () => state.dispatchLog.push({ tag: '[tag]', text: 'New log line' }),
    'remove-dispatch': (i) => state.dispatchLog.splice(i, 1)
  };

  /* ---------------------------------------------------------
     RENDER CURRENT SECTION
  --------------------------------------------------------- */
  const formRoot = document.getElementById('formRoot');
  function renderSection() {
    formRoot.innerHTML = `<div class="dform-section is-active">${sections[activeSection]()}</div>`;
    renderRepLists();
  }

  document.getElementById('dashNav').addEventListener('click', (e) => {
    const btn = e.target.closest('.dash__nav-item');
    if (!btn) return;
    document.querySelectorAll('.dash__nav-item').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    activeSection = btn.dataset.section;
    renderSection();
  });

  /* ---------------------------------------------------------
     INPUT DELEGATION — updates state + schedules preview
  --------------------------------------------------------- */
  formRoot.addEventListener('input', (e) => {
    const el = e.target;
    const path = el.dataset.bind;
    if (!path) return;
    const vtype = el.dataset.vtype || 'string';
    let value = el.value;
    if (vtype === 'number') value = Number(value) || 0;
    else if (vtype === 'lines') value = value.split('\n').map(s => s.trim()).filter(Boolean);
    else if (vtype === 'csv') value = value.split(',').map(s => s.trim()).filter(Boolean);
    else if (vtype === 'paragraphs') value = value.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    setPath(state, path, value);
    schedulePreview();
  });

  // <select> uses 'change' rather than 'input'
  formRoot.addEventListener('change', (e) => {
    const el = e.target;
    if (el.tagName === 'SELECT' && el.dataset.bind) {
      setPath(state, el.dataset.bind, el.value);
      schedulePreview();
    }
  });

  /* ---------------------------------------------------------
     STRUCTURAL ACTION DELEGATION (add/remove buttons)
  --------------------------------------------------------- */
  formRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (!structuralActions[action]) return;
    const index = btn.dataset.index !== undefined ? parseInt(btn.dataset.index, 10) : undefined;
    const subindex = btn.dataset.subindex !== undefined ? parseInt(btn.dataset.subindex, 10) : undefined;
    structuralActions[action](index, subindex);
    renderRepLists();
    schedulePreview();
  });

  /* ---------------------------------------------------------
     TOP BAR ACTIONS
  --------------------------------------------------------- */
  document.getElementById('saveBtn').addEventListener('click', () => {
    try {
      localStorage.setItem('portfolioData', JSON.stringify(state));
      schedulePreview();
      setStatus('Saved ✓');
    } catch (e) {
      setStatus('Save failed — storage unavailable');
    }
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    const fileContent = 'window.SITE_DATA = ' + JSON.stringify(state, null, 2) + ';\n';
    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus('Exported data.js');
  });

  document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (jsonErr) {
        try {
          const fn = new Function('window', text + '\nreturn window.SITE_DATA;');
          parsed = fn({});
        } catch (jsErr) {
          setStatus('Import failed — invalid file');
          return;
        }
      }
      if (parsed && typeof parsed === 'object') {
        state = parsed;
        renderSection();
        schedulePreview();
        setStatus('Imported ✓ — click Save to persist');
      } else {
        setStatus('Import failed — no data found');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Reset all edits back to the original defaults? This clears your saved changes.')) return;
    localStorage.removeItem('portfolioData');
    state = JSON.parse(JSON.stringify(window.SITE_DATA));
    renderSection();
    schedulePreview();
    setStatus('Reset to defaults');
  });

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  renderSection();
})();
