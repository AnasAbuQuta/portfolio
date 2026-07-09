/* =========================================================
   ANAS ABUQUTA — PORTFOLIO
   script.js
   Renders everything from SITE_DATA (data.js) or from
   localStorage("portfolioData") if the dashboard saved edits.
   Exposes window.renderSite(data) so dashboard.html can push
   live preview updates into an embedded iframe via postMessage.
   ========================================================= */
(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let revealObserver, skillObserver, counterObserver;
  let typingGen = 0;
  let dispatchInterval = null;
  let projectsData = [];

  /* ---------------------------------------------------------
     LOAD DATA (dashboard overrides data.js via localStorage)
  --------------------------------------------------------- */
  function loadData() {
    try {
      const stored = localStorage.getItem("portfolioData");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      /* fall through to defaults */
    }
    return window.SITE_DATA;
  }

  /* ---------------------------------------------------------
     MAIN CONTENT RENDER — re-runnable for live preview
  --------------------------------------------------------- */
  function renderContent(data) {
    projectsData = data.projects || [];

    // Meta + nav + footer brand
    document.getElementById("pageTitle").textContent = data.meta.pageTitle;
    document
      .getElementById("pageDescription")
      .setAttribute("content", data.meta.pageDescription);
    document.getElementById("navBrandMark").textContent =
      data.meta.brandInitials;
    document.getElementById("navBrandText").textContent = data.meta.brandName;
    document.getElementById("footerBrandMark").textContent =
      data.meta.brandInitials;
    document.getElementById("footerBrandText").textContent =
      data.meta.brandName;
    document.getElementById("footerTagline").textContent = data.footer.tagline;
    document.getElementById("footerCopy").textContent = data.footer.copy;
    document.getElementById("loaderCoord").textContent = data.loader.coordinate;

    const navCv = document.getElementById("navCvLink");
    if (data.contact.cvUrl) {
      navCv.setAttribute("href", data.contact.cvUrl);
      navCv.removeAttribute("data-role");
    } else {
      navCv.setAttribute("href", "#");
      navCv.setAttribute("data-role", "cv-download");
    }

    // Hero
    document.getElementById("heroEyebrow").textContent = data.hero.eyebrow;
    document.getElementById("heroTitle").innerHTML =
      `${data.hero.titleLine1}<br><em>${data.hero.titleEm}</em> ${data.hero.titleLine2}<br>${data.hero.titleLine3}`;
    document.getElementById("heroSummary").textContent = data.hero.summary;
    document.querySelector("#heroPrimaryCta span").textContent =
      data.hero.primaryCtaText;
    document.getElementById("heroSecondaryCta").textContent =
      data.hero.secondaryCtaText;

    // About
    document.getElementById("aboutEyebrow").textContent = data.about.eyebrow;
    document.getElementById("aboutTitle").innerHTML = data.about.title;
    document.getElementById("aboutParagraphs").innerHTML = data.about.paragraphs
      .map((p) => `<p>${p}</p>`)
      .join("");
    document.getElementById("aboutFacts").innerHTML = data.about.facts
      .map(
        (f) => `
      <div class="fact"><span class="fact__label">${f.label}</span><span class="fact__value">${f.value}</span></div>`,
      )
      .join("");

    // Experience + education
    document.getElementById("expEyebrow").textContent = data.experience.eyebrow;
    document.getElementById("expTitle").textContent = data.experience.title;
    document.getElementById("expLede").textContent = data.experience.lede;
    document.getElementById("timeline").innerHTML = data.experience.items
      .map(
        (item) => `
      <div class="timeline__item reveal">
        <div class="timeline__marker"><span class="timeline__coord">${item.marker}</span></div>
        <div class="timeline__card">
          <div class="timeline__top"><h3>${item.role}</h3><span class="timeline__date">${item.dateRange}</span></div>
          <p class="timeline__org"><i class="fa-solid fa-location-dot"></i> ${item.org}</p>
          <ul class="timeline__list">${item.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
          <div class="timeline__tags">${item.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        </div>
      </div>`,
      )
      .join("");
    document.getElementById("eduDegree").textContent = data.education.degree;
    document.getElementById("eduInstitution").textContent =
      data.education.institution;
    document.getElementById("eduGpaNum").textContent = data.education.gpa;

    // Skills
    document.getElementById("skillsEyebrow").textContent = data.skills.eyebrow;
    document.getElementById("skillsTitle").textContent = data.skills.title;
    document.getElementById("skillsLede").textContent = data.skills.lede;
    document.getElementById("skillsGrid").innerHTML = data.skills.groups
      .map(
        (group) => `
      <div class="skill-group reveal">
        <h3 class="skill-group__title"><i class="${group.icon}"></i> ${group.title}</h3>
        ${group.items
          .map(
            (item) => `
          <div class="skill-bar" data-level="${item.level}">
            <span class="skill-bar__label">${item.label}</span>
            <div class="skill-bar__track"><div class="skill-bar__fill"></div></div>
          </div>`,
          )
          .join("")}
      </div>`,
      )
      .join("");
    document.getElementById("softSkills").innerHTML = data.skills.softSkills
      .map((s) => `<span>${s}</span>`)
      .join("");

    // Projects section header
    document.getElementById("projEyebrow").textContent =
      data.projectsSection.eyebrow;
    document.getElementById("projTitle").textContent =
      data.projectsSection.title;
    document.getElementById("projLede").textContent = data.projectsSection.lede;

    // Services
    document.getElementById("servEyebrow").textContent = data.services.eyebrow;
    document.getElementById("servTitle").textContent = data.services.title;
    document.getElementById("servicesGrid").innerHTML = data.services.items
      .map(
        (s) => `
      <div class="service-card reveal"><i class="${s.icon}"></i><h3>${s.title}</h3><p>${s.text}</p></div>`,
      )
      .join("");

    // Achievements
    document.getElementById("achEyebrow").textContent =
      data.achievements.eyebrow;
    document.getElementById("achTitle").textContent = data.achievements.title;
    document.getElementById("achNote").textContent = data.achievements.note;
    document.getElementById("counters").innerHTML = data.achievements.counters
      .map(
        (c) => `
      <div class="counter reveal"><span class="counter__num" data-target="${c.target}">0</span><span class="counter__label">${c.label}</span></div>`,
      )
      .join("");

    // Certifications
    document.getElementById("certEyebrow").textContent =
      data.certifications.eyebrow;
    document.getElementById("certTitle").textContent =
      data.certifications.title;
    document.getElementById("certsGrid").innerHTML = data.certifications.items
      .map(
        (c) => `
      <div class="cert-card reveal">
        <div class="cert-card__icon"><i class="fa-solid fa-certificate"></i></div>
        <h3>${c.title}</h3><p>${c.issuer}</p>
        <a href="${c.link}" class="cert-card__link">View credential <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
      </div>`,
      )
      .join("");

    // Testimonials
    document.getElementById("testiEyebrow").textContent =
      data.testimonials.eyebrow;
    document.getElementById("testiTitle").textContent = data.testimonials.title;
    document.getElementById("testimonialsGrid").innerHTML =
      data.testimonials.items
        .map(
          (t) => `
      <div class="testimonial-card reveal">
        <i class="fa-solid fa-quote-left testimonial-card__mark"></i>
        <p>${t.quote}</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar"></div>
          <div><span class="testimonial-card__name">${t.name}</span><span class="testimonial-card__role">${t.role}</span></div>
        </div>
      </div>`,
        )
        .join("");

    // GitHub panel
    document.getElementById("ghEyebrow").textContent = data.github.eyebrow;
    document.getElementById("ghTitle").textContent = data.github.title;
    loadGitHubData(data.github.username);

    // Contact + footer socials
    document.getElementById("contactEyebrow").textContent =
      data.contact.eyebrow;
    document.getElementById("contactTitle").textContent = data.contact.title;
    document.getElementById("contactLede").textContent = data.contact.lede;
    document.getElementById("contactInfo").innerHTML = `
      <a href="mailto:${data.contact.email}" class="contact__row"><i class="fa-solid fa-envelope"></i> ${data.contact.email}</a>
      <a href="tel:${data.contact.phone.replace(/\s+/g, "")}" class="contact__row"><i class="fa-solid fa-phone"></i> ${data.contact.phone}</a>
      <a href="${data.contact.linkedin}" class="contact__row" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin"></i> ${data.contact.linkedin.replace(/^https?:\/\//, "")}</a>
      <a href="${data.contact.github}" class="contact__row" target="_blank" rel="noopener"><i class="fas fa-link"></i> ${data.contact.github.replace(/^https?:\/\//, "")}</a>
      <a href="#" class="contact__row"><i class="fa-solid fa-location-dot"></i> ${data.contact.location}</a>
    `;
    document.getElementById("footerSocials").innerHTML = `
      <a href="${data.contact.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
      <a href="${data.contact.github}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
      <a href="mailto:${data.contact.email}" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
    `;

    // Hero typing animation (restart cleanly)
    typingGen++;
    startTyping(data.hero.roles || [], typingGen);

    // Dispatch log (restart cleanly)
    if (dispatchInterval) clearInterval(dispatchInterval);
    setupDispatchLog(data.dispatchLog || []);

    // Projects grid (reset filter to "all")
    document
      .querySelectorAll(".filter")
      .forEach((b) =>
        b.classList.toggle("is-active", b.dataset.filter === "all"),
      );
    renderProjects("all");

    // Re-observe elements for scroll animations / bars / counters
    document
      .querySelectorAll(".reveal:not(.is-visible)")
      .forEach((el) => revealObserver.observe(el));
    document
      .querySelectorAll(".skill-bar")
      .forEach((el) => skillObserver.observe(el));
    document
      .querySelectorAll(".counter__num")
      .forEach((el) => counterObserver.observe(el));
  }

  async function loadGitHubData(username) {
    const container = document.getElementById("githubLive");
    if (!container || !username) return;

    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      );

      if (!userRes.ok || !reposRes.ok) {
        throw new Error("GitHub API error");
      }

      const user = await userRes.json();
      const repos = await reposRes.json();

      const totalStars = repos.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0,
      );

      const latestRepos = repos.slice(0, 4);

      container.innerHTML = `
      <div class="github__stats-grid">
        <div class="github__stat-card">
          <span>${user.public_repos}</span>
          <p>Repositories</p>
        </div>

        <div class="github__stat-card">
          <span>${user.followers}</span>
          <p>Followers</p>
        </div>

        <div class="github__stat-card">
          <span>${totalStars}</span>
          <p>Total Stars</p>
        </div>

        <div class="github__stat-card">
          <span>${user.following}</span>
          <p>Following</p>
        </div>
      </div>

      <div class="github__repos">
        ${latestRepos
          .map(
            (repo) => `
          <a class="github__repo-card" href="${repo.html_url}" target="_blank" rel="noopener">
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description available."}</p>
            <div>
              <span>${repo.language || "Code"}</span>
              <span>★ ${repo.stargazers_count}</span>
            </div>
          </a>
        `,
          )
          .join("")}
      </div>
    `;
    } catch (error) {
      container.innerHTML = `<p>Unable to load GitHub data right now.</p>`;
    }
  }

  /* ---------------------------------------------------------
     HERO TYPING ANIMATION
  --------------------------------------------------------- */
  function startTyping(roles, gen) {
    const typedEl = document.getElementById("typedRole");
    if (!roles.length) {
      typedEl.textContent = "";
      return;
    }
    if (prefersReducedMotion) {
      typedEl.textContent = roles[0];
      return;
    }

    let roleIndex = 0,
      charIndex = 0,
      deleting = false;
    function loop() {
      if (gen !== typingGen) return; // a newer render superseded this loop
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(loop, 1600);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(loop, deleting ? 35 : 55);
    }
    loop();
  }

  /* ---------------------------------------------------------
     HERO DISPATCH LOG
  --------------------------------------------------------- */
  function setupDispatchLog(entries) {
    const logLines = document.getElementById("logLines");
    if (!entries.length) {
      logLines.innerHTML = "";
      return;
    }
    function renderLog() {
      logLines.innerHTML = "";
      let i = 0;
      function addLine() {
        if (i >= 4) return;
        const entry = entries[Math.floor(Math.random() * entries.length)];
        const div = document.createElement("div");
        div.className = "log__line";
        div.style.animationDelay = i * 0.15 + "s";
        div.innerHTML = `<span>${entry.tag}</span> ${entry.text}`;
        logLines.appendChild(div);
        i++;
        setTimeout(addLine, 900);
      }
      addLine();
    }
    renderLog();
    if (!prefersReducedMotion) dispatchInterval = setInterval(renderLog, 7000);
  }

  /* ---------------------------------------------------------
     PROJECTS — RENDER, FILTER, MODAL
  --------------------------------------------------------- */
  function renderProjects(filter) {
    const grid = document.getElementById("projectsGrid");
    grid.innerHTML = "";
    projectsData
      .filter((p) => filter === "all" || p.category === filter)
      .forEach((p) => {
        const card = document.createElement("div");
        card.className = "project-card reveal";
        card.innerHTML = `
          <div class="project-card__top">
            <div class="project-card__icon"><i class="${p.icon}"></i></div>
            <i class="fa-solid fa-arrow-up-right project-card__arrow"></i>
          </div>
          <h3>${p.title}</h3>
          <p>${p.short}</p>
          <div class="project-card__tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        `;
        card.addEventListener("click", () => openModal(p));
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", e.clientX - rect.left + "px");
          card.style.setProperty("--my", e.clientY - rect.top + "px");
        });
        grid.appendChild(card);
        revealObserver.observe(card);
        requestAnimationFrame(() => card.classList.add("is-visible"));
      });
  }

  function openModal(project) {
    const modal = document.getElementById("projectModal");
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
      <span class="modal__sub"><i class="${project.icon}"></i> ${project.tags.join(" · ")}</span>
      <h3>${project.title}</h3>
      <div class="modal__shot"><i class="fa-solid fa-image"></i>&nbsp; screenshot placeholder — add project image here</div>
      <p>${project.description}</p>
      <ul>${project.features.map((f) => `<li>${f}</li>`).join("")}</ul>
      <div class="modal__tags">${project.tags.map((t) => `<span>${t}</span>`).join("")}</div>
    `;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    const modal = document.getElementById("projectModal");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ---------------------------------------------------------
     ONE-TIME BEHAVIOR (loader, scroll, nav, cursor, canvas, etc.)
  --------------------------------------------------------- */
  function attachStaticBehavior() {
    // Loader
    const loader = document.getElementById("loader");
    window.addEventListener("load", () =>
      setTimeout(() => loader.classList.add("is-hidden"), 500),
    );
    setTimeout(() => loader.classList.add("is-hidden"), 3000);

    // Scroll progress + nav shadow + back-to-top visibility
    const progressBar = document.getElementById("progressBar");
    const nav = document.getElementById("nav");
    const toTop = document.getElementById("toTop");
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
      nav.classList.toggle("is-scrolled", scrollTop > 20);
      toTop.classList.toggle("is-visible", scrollTop > 500);
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", () =>
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      }),
    );

    // Mobile nav toggle
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks
      .querySelectorAll("a")
      .forEach((link) =>
        link.addEventListener("click", () =>
          navLinks.classList.remove("is-open"),
        ),
      );

    // Cursor ambient glow
    const glow = document.getElementById("cursorGlow");
    if (window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
      document.addEventListener("mousemove", (e) => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
        glow.classList.add("is-active");
      });
      document.addEventListener("mouseleave", () =>
        glow.classList.remove("is-active"),
      );
    }

    // Hero canvas — sparse floating data points
    const canvas = document.getElementById("fieldCanvas");
    if (canvas && !prefersReducedMotion) {
      const ctx = canvas.getContext("2d");
      let w, h, points;
      function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
      }
      function initPoints() {
        const count = Math.min(50, Math.floor((w * h) / 22000));
        points = Array.from({ length: count }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: Math.random() * 1.4 + 0.6,
        }));
      }
      function tick() {
        ctx.clearRect(0, 0, w, h);
        points.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle =
            i % 5 === 0 ? "rgba(227,168,87,0.55)" : "rgba(62,214,167,0.35)";
          ctx.fill();
          for (let j = i + 1; j < points.length; j++) {
            const q = points[j];
            const dist = Math.hypot(p.x - q.x, p.y - q.y);
            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(160,180,200,${0.08 * (1 - dist / 110)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
        requestAnimationFrame(tick);
      }
      resize();
      initPoints();
      tick();
      window.addEventListener("resize", () => {
        resize();
        initPoints();
      });
    }

    // Project filters
    document.querySelectorAll(".filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".filter")
          .forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderProjects(btn.dataset.filter);
      });
    });

    // Modal close
    document.getElementById("modalClose").addEventListener("click", closeModal);
    document
      .getElementById("modalBackdrop")
      .addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // Contact form
    const form = document.getElementById("contactForm");
    const formNote = document.getElementById("formNote");

    form.addEventListener("submit", () => {
      formNote.textContent = "Sending message...";
    });

    // CV download placeholder (delegated so it respects re-renders)
    document.addEventListener("click", (e) => {
      const btn = e.target.closest('[data-role="cv-download"]');
      if (btn) {
        e.preventDefault();
        alert(
          "Add your CV link in the dashboard (Contact section) to enable this button.",
        );
      }
    });

    // Footer year
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const fill = bar.querySelector(".skill-bar__fill");
            requestAnimationFrame(() => {
              fill.style.width = bar.dataset.level + "%";
            });
            skillObserver.unobserve(bar);
          }
        });
      },
      { threshold: 0.4 },
    );

    counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const duration = 1400;
            const start = performance.now();
            function step(now) {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.round(eased * target);
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );

    attachStaticBehavior();
    renderContent(loadData());

    // Expose for the dashboard's live preview (called on this window directly,
    // or via postMessage below when running inside an iframe).
    window.renderSite = renderContent;
  });

  // Live preview bridge: dashboard.html embeds this page in an iframe and
  // posts { type: 'PORTFOLIO_PREVIEW_UPDATE', payload: <data> } to update it
  // instantly without needing shared localStorage across origins.
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "PORTFOLIO_PREVIEW_UPDATE") {
      renderContent(e.data.payload);
    }
  });
})();
