import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Braces,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Eye,
  ExternalLink,
  Facebook,
  FileDown,
  FileJson2,
  Hash,
  Github,
  GraduationCap,
  Image,
  Instagram,
  LayoutDashboard,
  Linkedin,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Palette,
  Phone,
  Plus,
  Quote,
  Radio,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Server,
  Sparkles,
  ToggleLeft,
  Trash2,
  Type,
  Upload,
  Twitter,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api, clearToken, getToken, setToken } from "./api/client";
import { fallbackContent } from "./data/fallbackContent";

const contentKeys = [
  "settings",
  "navigation",
  "hero",
  "socials",
  "stats",
  "about",
  "timeline",
  "skillGroups",
  "projects",
  "services",
  "testimonials",
  "customSections",
  "contact"
];

const iconMap = {
  ArrowUpRight,
  Braces,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Eye,
  ExternalLink,
  Facebook,
  FileDown,
  FileJson2,
  Hash,
  Github,
  GraduationCap,
  Image,
  Instagram,
  LayoutDashboard,
  Linkedin,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Palette,
  Phone,
  Plus,
  Quote,
  Radio,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Server,
  Sparkles,
  ToggleLeft,
  Trash2,
  Type,
  Upload,
  Twitter,
  X
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function cloneValue(value) {
  return structuredClone(value ?? null);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatLabel(key) {
  return String(key || "item")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function describeItem(value, fallback = "Item") {
  if (isPlainObject(value)) {
    return value.title || value.name || value.label || value.heading || value.email || fallback;
  }

  if (typeof value === "string" && value.trim()) return value;
  return fallback;
}

function isLongTextKey(key) {
  return /body|summary|description|message|quote|note|bio|content/i.test(String(key));
}

function isImageKey(key) {
  return /image|avatar|portrait|background|photo|thumbnail/i.test(String(key));
}

function isUrlKey(key) {
  return /url|href|link|repo|resume/i.test(String(key));
}

function createEmptyValue(type) {
  const values = {
    string: "",
    longText: "",
    number: 0,
    boolean: false,
    object: {},
    array: []
  };

  return values[type] ?? "";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Image could not be read."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not be loaded."));
    image.src = src;
  });
}

async function imageFileToDataUrl(file) {
  const maxFileSize = 8 * 1024 * 1024;
  const maxDimension = 1800;

  if (!file?.type?.startsWith("image/")) {
    throw new Error("Choose an image file.");
  }

  if (file.size > maxFileSize) {
    throw new Error("Image is too large. Choose an image under 8 MB.");
  }

  const dataUrl = await readFileAsDataUrl(file);

  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return dataUrl;
  }

  const image = await loadImage(dataUrl);
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);

  const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(mimeType, 0.86);
}

function cloneArrayTemplate(items) {
  if (!items.length) return "";
  const firstItem = items[0];

  if (isPlainObject(firstItem)) {
    return Object.fromEntries(
      Object.entries(firstItem).map(([key, value]) => {
        if (typeof value === "boolean") return [key, false];
        if (typeof value === "number") return [key, 0];
        if (Array.isArray(value)) return [key, []];
        if (isPlainObject(value)) return [key, {}];
        return [key, ""];
      })
    );
  }

  if (Array.isArray(firstItem)) return [];
  if (typeof firstItem === "boolean") return false;
  if (typeof firstItem === "number") return 0;
  return "";
}

function getAtPath(source, path) {
  return path.reduce((cursor, key) => cursor?.[key], source);
}

function updateAtPath(source, path, updater) {
  if (path.length === 0) return updater(cloneValue(source));

  const copy = cloneValue(source);
  let cursor = copy;

  path.slice(0, -1).forEach((key) => {
    cursor = cursor[key];
  });

  const lastKey = path.at(-1);
  cursor[lastKey] = updater(cursor[lastKey]);
  return copy;
}

function removeAtPath(source, path) {
  const copy = cloneValue(source);
  let cursor = copy;

  path.slice(0, -1).forEach((key) => {
    cursor = cursor[key];
  });

  const lastKey = path.at(-1);
  if (Array.isArray(cursor)) {
    cursor.splice(lastKey, 1);
  } else if (isPlainObject(cursor)) {
    delete cursor[lastKey];
  }

  return copy;
}

function IconGlyph({ name, size = 20 }) {
  const Component = iconMap[name] || Sparkles;
  return <Component size={size} strokeWidth={1.8} aria-hidden="true" />;
}

function externalProps(href) {
  if (!href || href === "#") return {};
  return { target: "_blank", rel: "noopener noreferrer" };
}

function setPath(source, path, value) {
  const copy = structuredClone(source);
  const keys = path.split(".");
  let cursor = copy;

  keys.slice(0, -1).forEach((key) => {
    if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = {};
    cursor = cursor[key];
  });

  cursor[keys.at(-1)] = value;
  return copy;
}

function usePortfolioContent() {
  const [content, setContent] = useState(fallbackContent);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let mounted = true;
    api("/content", { token: null })
      .then((data) => {
        if (!mounted) return;
        setContent(data);
        setState("ready");
      })
      .catch(() => {
        if (!mounted) return;
        setState("fallback");
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    document.title = content.settings?.siteTitle || fallbackContent.settings.siteTitle;
    const description = content.settings?.metaDescription;
    if (description) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", description);
    }
  }, [content]);

  return { content, state };
}

function App() {
  const adminPath = window.location.pathname === "/DonChandu" || window.location.pathname === "/DonChandu/";
  return adminPath ? <AdminApp /> : <PortfolioApp />;
}

function PortfolioApp() {
  const { content, state } = usePortfolioContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeProject, setActiveProject] = useState(null);

  const categories = useMemo(() => {
    const projectCategories = asArray(content.projects).map((project) => project.category);
    return ["All", ...new Set(projectCategories.filter(Boolean))];
  }, [content.projects]);

  const projects = useMemo(() => {
    const allProjects = asArray(content.projects);
    if (selectedCategory === "All") return allProjects;
    return allProjects.filter((project) => project.category === selectedCategory);
  }, [content.projects, selectedCategory]);

  const style = {
    "--accent": content.settings?.accentColor || "#e23d6f",
    "--secondary": content.settings?.secondaryColor || "#48d5c4"
  };

  return (
    <div className="portfolio-shell" style={style}>
      <header className="site-header">
        <a className="brand-mark" href="#home" aria-label="Go to home">
          {content.hero?.name?.slice(0, 1) || "M"}
        </a>

        <button
          className="icon-button menu-button"
          type="button"
          aria-label="Open navigation"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>

        <nav className="desktop-nav" aria-label="Main navigation">
          {asArray(content.navigation).map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="icon-button mobile-close"
              type="button"
              aria-label="Close navigation"
              onClick={() => setMenuOpen(false)}
            >
              <X size={22} />
            </button>
            {asArray(content.navigation).map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section className="hero-section" id="home">
          <div
            className="hero-media"
            style={{
              backgroundImage: `url(${content.hero?.backgroundUrl})`
            }}
          />
          <div className="hero-grid page-grid">
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="hero-kicker-row">
                <span className="eyebrow">{content.hero?.eyebrow}</span>
                <span className="hero-location">
                  <MapPin size={15} />
                  {content.settings?.location}
                </span>
              </div>
              <span className="hero-name">{content.hero?.name}</span>
              <h1>{content.hero?.title}</h1>
              <p>{content.hero?.summary}</p>
              <div className="hero-actions">
                <a className="primary-button" href={content.hero?.ctaHref || "#work"}>
                  <Sparkles size={18} />
                  {content.hero?.ctaLabel || "Explore Work"}
                </a>
                <a className="ghost-button" href={content.settings?.resumeUrl || "#"}>
                  <FileDown size={18} />
                  Resume
                </a>
              </div>
              <div className="hero-socials" aria-label="Social links">
                {asArray(content.socials).map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    aria-label={social.label}
                    {...externalProps(social.url)}
                  >
                    <IconGlyph name={social.icon} size={18} />
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="portrait-stage"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <img src={content.hero?.portraitUrl} alt={content.hero?.name || "Portfolio owner"} />
              <div className="portrait-caption">
                <strong>{content.hero?.name}</strong>
                <span>{content.hero?.eyebrow}</span>
              </div>
              <div className="availability-pill">
                <Radio size={16} />
                {content.settings?.availability}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="stats-band" aria-label="Portfolio stats">
          <div className="page-grid stats-grid">
            {asArray(content.stats).map((stat) => (
              <div className="stat-item" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section page-grid split-section" id="about">
          <div className="section-media">
            <img src={content.about?.imageUrl} alt={`${content.hero?.name || "Portfolio"} portrait`} />
          </div>
          <div>
            <SectionIntro kicker="About" title={content.about?.heading} />
            <p className="lead-text">{content.about?.body}</p>
            <div className="highlight-list">
              {asArray(content.about?.highlights).map((highlight) => (
                <div className="highlight-row" key={highlight}>
                  <CheckCircle2 size={18} />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section page-grid" id="skills">
          <SectionIntro kicker="Capabilities" title="A practical stack for modern product work." />
          <div className="skills-grid">
            {asArray(content.skillGroups).map((group) => (
              <article className="skill-card" key={group.title}>
                <div className="card-icon">
                  <IconGlyph name={group.icon} />
                </div>
                <h3>{group.title}</h3>
                <p>{group.subtitle}</p>
                <div className="skill-bars">
                  {asArray(group.skills).map((skill) => (
                    <div className="skill-meter" key={skill.name}>
                      <div>
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <meter min="0" max="100" value={skill.level}>
                        {skill.level}%
                      </meter>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section page-grid timeline-section">
          <SectionIntro kicker="Journey" title="Education and experience that shaped the craft." />
          <TimelineColumn title="Education" icon="GraduationCap" items={content.timeline?.education} />
          <TimelineColumn title="Experience" icon="BriefcaseBusiness" items={content.timeline?.experience} />
        </section>

        <section className="section page-grid" id="work">
          <div className="section-heading-row">
            <SectionIntro kicker="Recent Work" title="Selected projects with measurable product impact." />
            <div className="filter-row" aria-label="Project filters">
              {categories.map((category) => (
                <button
                  className={selectedCategory === category ? "filter-button active" : "filter-button"}
                  type="button"
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <motion.article
                className="project-card"
                key={project.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img src={project.imageUrl} alt={`${project.title} preview`} />
                <div className="project-content">
                  <div className="project-meta">
                    <span>{project.category}</span>
                    {project.featured && <span>Featured</span>}
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  {asArray(project.metrics).length > 0 && (
                    <div className="metric-row">
                      {asArray(project.metrics).map((metric) => (
                        <span key={metric}>{metric}</span>
                      ))}
                    </div>
                  )}
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => setActiveProject(project)}
                  >
                    Details
                    <ArrowUpRight size={17} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section page-grid" id="services">
          <SectionIntro kicker="Services" title="Flexible help from design polish to full-stack delivery." />
          <div className="services-grid">
            {asArray(content.services).map((service) => (
              <article className="service-card" key={service.title}>
                <div className="card-icon">
                  <IconGlyph name={service.icon} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <ul>
                  {asArray(service.deliverables).map((item) => (
                    <li key={item}>
                      <Check size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section page-grid testimonials-section">
          <SectionIntro kicker="Testimonials" title="A few words from collaborators and clients." />
          <div className="testimonial-grid">
            {asArray(content.testimonials).map((testimonial) => (
              <article className="testimonial-card" key={testimonial.name}>
                <Quote size={28} />
                <p>{testimonial.quote}</p>
                <div className="person-row">
                  <img src={testimonial.avatarUrl} alt={testimonial.name} />
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <CustomSections sections={content.customSections} />

        <ContactSection content={content} />
      </main>

      <footer className="site-footer">
        <div className="page-grid footer-grid">
          <div>
            <strong>{content.hero?.name}</strong>
            <span>{content.hero?.eyebrow}</span>
          </div>
          <div className="social-row">
            {asArray(content.socials).map((social) => (
              <a
                key={social.label}
                href={social.url}
                aria-label={social.label}
                {...externalProps(social.url)}
              >
                <IconGlyph name={social.icon} size={19} />
              </a>
            ))}
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>

      {state === "fallback" && (
        <div className="status-toast">API offline. Showing bundled portfolio content.</div>
      )}
    </div>
  );
}

function SectionIntro({ kicker, title }) {
  return (
    <div className="section-intro">
      <span>{kicker}</span>
      <h2>{title}</h2>
    </div>
  );
}

function TimelineColumn({ title, icon, items }) {
  return (
    <article className="timeline-column">
      <h3>
        <IconGlyph name={icon} />
        {title}
      </h3>
      <div className="timeline-list">
        {asArray(items).map((item) => (
          <div className="timeline-item" key={`${item.title}-${item.period}`}>
            <span className="timeline-dot" />
            <strong>{item.title}</strong>
            <p>
              {item.organization}
              {item.location ? `, ${item.location}` : ""}
            </p>
            <small>{item.period}</small>
          </div>
        ))}
      </div>
    </article>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
      onMouseDown={onClose}
    >
      <motion.div
        className="project-modal"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="icon-button modal-close" type="button" aria-label="Close" onClick={onClose}>
          <X size={22} />
        </button>
        <img src={project.imageUrl} alt={`${project.title} preview`} />
        <div>
          <span className="eyebrow">{project.category}</span>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <div className="tag-row">
            {asArray(project.technologies).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <div className="modal-facts">
            <div>
              <strong>Role</strong>
              <span>{project.role}</span>
            </div>
            <div>
              <strong>Created</strong>
              <span>{project.createdAt}</span>
            </div>
          </div>
          <div className="hero-actions">
            <a className="primary-button" href={project.url || "#"} {...externalProps(project.url)}>
              <ExternalLink size={18} />
              Visit
            </a>
            <a className="ghost-button" href={project.repo || "#"} {...externalProps(project.repo)}>
              <Github size={18} />
              Code
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CustomSections({ sections }) {
  const visibleSections = asArray(sections).filter(
    (section) => section && (section.title || section.body || asArray(section.items).length)
  );

  if (!visibleSections.length) return null;

  return visibleSections.map((section, index) => {
    const sectionId = section.id || slugify(section.title) || `custom-section-${index + 1}`;
    const items = asArray(section.items);

    return (
      <section className="section page-grid custom-section" id={sectionId} key={sectionId}>
        <div className={section.imageUrl ? "custom-section-layout" : ""}>
          <div>
            <SectionIntro
              kicker={section.kicker || "Featured"}
              title={section.title || "Custom section"}
            />
            {section.body && <p className="lead-text">{section.body}</p>}
          </div>
          {section.imageUrl && (
            <div className="section-media">
              <img src={section.imageUrl} alt={section.title || "Custom section"} />
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="custom-card-grid">
            {items.map((item, itemIndex) => (
              <article className="custom-card" key={`${sectionId}-${item.title || itemIndex}`}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.title || "Custom card"} />}
                <div>
                  {item.kicker && <span className="eyebrow">{item.kicker}</span>}
                  {item.title && <h3>{item.title}</h3>}
                  {item.body && <p>{item.body}</p>}
                  {item.label && item.url && (
                    <a className="text-button" href={item.url} {...externalProps(item.url)}>
                      {item.label}
                      <ArrowUpRight size={17} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  });
}

function ContactSection({ content }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setState("sending");
    setError("");

    try {
      await api("/messages", { method: "POST", body: form, token: null });
      setForm({ name: "", email: "", phone: "", message: "" });
      setState("sent");
    } catch (requestError) {
      setError(requestError.message);
      setState("error");
    }
  }

  return (
    <section className="section page-grid contact-section" id="contact">
      <div>
        <SectionIntro kicker="Contact" title={content.contact?.headline} />
        <p className="lead-text">{content.contact?.body}</p>
        <div className="contact-methods">
          <a href={`mailto:${content.contact?.email}`}>
            <Mail size={18} />
            {content.contact?.email}
          </a>
          <a href={`tel:${content.contact?.phone}`}>
            <Phone size={18} />
            {content.contact?.phone}
          </a>
          <span>
            <MapPin size={18} />
            {content.settings?.location}
          </span>
        </div>
      </div>

      <form className="contact-form" onSubmit={submit}>
        <label>
          <span>Name</span>
          <input name="name" value={form.name} onChange={updateField} required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" value={form.phone} onChange={updateField} />
        </label>
        <label>
          <span>Message</span>
          <textarea name="message" value={form.message} onChange={updateField} required />
        </label>
        <button className="primary-button" type="submit" disabled={state === "sending"}>
          <Send size={18} />
          {state === "sending" ? "Sending" : "Send Message"}
        </button>
        {state === "sent" && <p className="form-note success">Message sent.</p>}
        {state === "error" && (
          <p className="form-note error">{error || "Message could not be sent."}</p>
        )}
      </form>
    </section>
  );
}

function AdminApp() {
  const [tokenState, setTokenState] = useState(getToken());

  if (!tokenState) {
    return <AdminLogin onLogin={(token) => setTokenState(token)} />;
  }

  return <AdminDashboard token={tokenState} onLogout={() => setTokenState(null)} />;
}

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: "admin@example.com", password: "change-me-now" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const data = await api("/auth/login", { method: "POST", body: form, token: null });
      setToken(data.token);
      onLogin(data.token);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login">
      <form className="login-panel" onSubmit={submit}>
        <div className="card-icon">
          <Lock size={22} />
        </div>
        <h1>Portfolio CMS</h1>
        <label>
          <span>Email</span>
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            type="email"
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            type="password"
            required
          />
        </label>
        <button className="primary-button" type="submit" disabled={busy}>
          <LogIn size={18} />
          {busy ? "Signing in" : "Sign In"}
        </button>
        {error && <p className="form-note error">{error}</p>}
      </form>
    </main>
  );
}

function AdminDashboard({ token, onLogout }) {
  const [content, setContent] = useState(fallbackContent);
  const [draft, setDraft] = useState(fallbackContent);
  const [activeKey, setActiveKey] = useState("overview");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Loading CMS content");
  const isDirty = JSON.stringify(content) !== JSON.stringify(draft);

  useEffect(() => {
    document.title = "Portfolio CMS";
    refresh();
  }, []);

  async function refresh() {
    try {
      const [freshContent, freshMessages] = await Promise.all([
        api("/content", { token }),
        api("/messages", { token })
      ]);
      setContent(freshContent);
      setDraft(freshContent);
      setMessages(freshMessages);
      setStatus("Ready");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function save() {
    setStatus("Saving");
    try {
      const saved = await api("/content", {
        method: "PUT",
        body: draft,
        token
      });
      setContent(saved);
      setDraft(saved);
      setStatus("Saved");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function resetToDefault() {
    setStatus("Resetting");
    try {
      const saved = await api("/content/reset", { method: "POST", token });
      setContent(saved);
      setDraft(saved);
      setStatus("Reset");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function updateMessage(id, nextStatus) {
    try {
      await api(`/messages/${id}`, {
        method: "PATCH",
        body: { status: nextStatus },
        token
      });
      await refresh();
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function deleteMessage(id) {
    try {
      await api(`/messages/${id}`, { method: "DELETE", token });
      await refresh();
      setStatus("Message deleted");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function logout() {
    clearToken();
    onLogout();
  }

  const editorValue = activeKey === "raw" ? draft : draft[activeKey];
  const counts = [
    ["Projects", asArray(draft.projects).length],
    ["Services", asArray(draft.services).length],
    ["Skills", asArray(draft.skillGroups).length],
    ["Custom", asArray(draft.customSections).length],
    ["Messages", asArray(messages).length]
  ];

  return (
    <main className="cms-shell">
      <aside className="cms-sidebar">
        <a className="brand-mark cms-mark" href="/" aria-label="Open portfolio">
          {draft.hero?.name?.slice(0, 1) || "M"}
        </a>
        <button
          className={activeKey === "overview" ? "cms-nav active" : "cms-nav"}
          type="button"
          onClick={() => setActiveKey("overview")}
        >
          <LayoutDashboard size={18} />
          Overview
        </button>
        {contentKeys.map((key) => (
          <button
            className={activeKey === key ? "cms-nav active" : "cms-nav"}
            type="button"
            key={key}
            onClick={() => setActiveKey(key)}
          >
            <FileJson2 size={18} />
            {key}
          </button>
        ))}
        <button
          className={activeKey === "raw" ? "cms-nav active" : "cms-nav"}
          type="button"
          onClick={() => setActiveKey("raw")}
        >
          <Braces size={18} />
          Raw JSON
        </button>
      </aside>

      <section className="cms-main">
        <div className="cms-topbar">
          <div>
            <span className="eyebrow">CMS Dashboard</span>
            <h1>{draft.settings?.siteTitle}</h1>
          </div>
          <div className="cms-actions">
            <span className="cms-status">{isDirty ? "Unsaved changes" : status}</span>
            <a className="ghost-button" href="/" target="_blank" rel="noopener noreferrer">
              <Eye size={17} />
              Preview
            </a>
            <button className="ghost-button" type="button" onClick={refresh}>
              <RefreshCw size={17} />
              Refresh
            </button>
            <button className="primary-button" type="button" onClick={save} disabled={!isDirty}>
              <Save size={17} />
              Save
            </button>
            <button className="ghost-button" type="button" onClick={logout}>
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>

        <div className="cms-counts">
          {counts.map(([label, value]) => (
            <div className="cms-count" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {activeKey === "overview" ? (
          <OverviewEditor draft={draft} setDraft={setDraft} onReset={resetToDefault} />
        ) : activeKey === "raw" ? (
          <JsonSectionEditor
            key={activeKey}
            label={activeKey}
            value={editorValue}
            onApply={(nextValue) => {
              setDraft(activeKey === "raw" ? nextValue : { ...draft, [activeKey]: nextValue });
              setStatus("Draft updated");
            }}
          />
        ) : (
          <FlexibleSectionEditor
            key={activeKey}
            label={activeKey}
            value={editorValue}
            fallbackValue={fallbackContent[activeKey]}
            onChange={(nextValue) => {
              setDraft((current) => ({ ...current, [activeKey]: nextValue }));
              setStatus("Draft updated");
            }}
          />
        )}

        <MessagesPanel messages={messages} onStatus={updateMessage} onDelete={deleteMessage} />
      </section>
    </main>
  );
}

function OverviewEditor({ draft, setDraft, onReset }) {
  function update(path, value) {
    setDraft((current) => setPath(current, path, value));
  }

  return (
    <section className="cms-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Fast Edit</span>
          <h2>Core profile settings</h2>
        </div>
        <button className="ghost-button" type="button" onClick={onReset}>
          <RotateCcw size={17} />
          Reset Content
        </button>
      </div>

      <div className="cms-form-grid">
        <CmsField
          label="Site title"
          value={draft.settings?.siteTitle}
          onChange={(value) => update("settings.siteTitle", value)}
        />
        <CmsField
          label="Location"
          value={draft.settings?.location}
          onChange={(value) => update("settings.location", value)}
        />
        <CmsField
          label="Accent color"
          type="color"
          value={draft.settings?.accentColor}
          onChange={(value) => update("settings.accentColor", value)}
        />
        <CmsField
          label="Secondary color"
          type="color"
          value={draft.settings?.secondaryColor}
          onChange={(value) => update("settings.secondaryColor", value)}
        />
        <CmsField
          label="Name"
          value={draft.hero?.name}
          onChange={(value) => update("hero.name", value)}
        />
        <CmsField
          label="Role"
          value={draft.hero?.eyebrow}
          onChange={(value) => update("hero.eyebrow", value)}
        />
        <CmsField
          label="Hero title"
          value={draft.hero?.title}
          onChange={(value) => update("hero.title", value)}
          wide
        />
        <CmsField
          label="Hero summary"
          value={draft.hero?.summary}
          onChange={(value) => update("hero.summary", value)}
          textarea
          wide
        />
        <CmsField
          label="About heading"
          value={draft.about?.heading}
          onChange={(value) => update("about.heading", value)}
          wide
        />
        <CmsField
          label="About body"
          value={draft.about?.body}
          onChange={(value) => update("about.body", value)}
          textarea
          wide
        />
        <CmsField
          label="Email"
          value={draft.contact?.email}
          onChange={(value) => update("contact.email", value)}
        />
        <CmsField
          label="Phone"
          value={draft.contact?.phone}
          onChange={(value) => update("contact.phone", value)}
        />
      </div>
    </section>
  );
}

function CmsField({ label, value = "", onChange, type = "text", textarea = false, wide = false }) {
  const Input = textarea ? "textarea" : "input";

  return (
    <label className={wide ? "cms-field wide" : "cms-field"}>
      <span>{label}</span>
      <Input
        type={textarea ? undefined : type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function FlexibleSectionEditor({ label, value, fallbackValue, onChange }) {
  const safeValue = value ?? cloneValue(fallbackValue) ?? {};
  const [mode, setMode] = useState("visual");

  function fallbackAt(path) {
    let cursor = fallbackValue;

    for (const key of path) {
      if (Array.isArray(cursor) && cursor[key] === undefined) {
        cursor = cursor[0];
      } else {
        cursor = cursor?.[key];
      }
    }

    return cursor;
  }

  function updatePath(path, nextValue) {
    onChange(updateAtPath(safeValue, path, () => nextValue));
  }

  function updatePathWith(path, updater) {
    onChange(updateAtPath(safeValue, path, updater));
  }

  function removePath(path) {
    onChange(removeAtPath(safeValue, path));
  }

  return (
    <section className="cms-panel flexible-editor-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Visual Editor</span>
          <h2>{formatLabel(label)}</h2>
        </div>
        <div className="segmented-control" aria-label="Editor mode">
          <button
            className={mode === "visual" ? "active" : ""}
            type="button"
            onClick={() => setMode("visual")}
          >
            <Type size={16} />
            Visual
          </button>
          <button
            className={mode === "json" ? "active" : ""}
            type="button"
            onClick={() => setMode("json")}
          >
            <Braces size={16} />
            JSON
          </button>
        </div>
      </div>

      {mode === "json" ? (
        <JsonSectionEditor label={label} value={safeValue} onApply={onChange} embedded />
      ) : (
        <FieldEditor
          fieldKey={label}
          value={safeValue}
          fallbackValue={fallbackValue}
          path={[]}
          rootValue={safeValue}
          canRemove={false}
          onUpdate={updatePath}
          onUpdateWith={updatePathWith}
          onRemove={removePath}
          getFallback={fallbackAt}
        />
      )}
    </section>
  );
}

function FieldEditor({
  fieldKey,
  value,
  fallbackValue,
  path,
  rootValue,
  canRemove = true,
  onUpdate,
  onUpdateWith,
  onRemove,
  getFallback
}) {
  if (Array.isArray(value)) {
    return (
      <ArrayEditor
        fieldKey={fieldKey}
        value={value}
        fallbackValue={fallbackValue}
        path={path}
        onUpdate={onUpdate}
        onUpdateWith={onUpdateWith}
        onRemove={onRemove}
        getFallback={getFallback}
      />
    );
  }

  if (isPlainObject(value)) {
    return (
      <ObjectEditor
        fieldKey={fieldKey}
        value={value}
        path={path}
        rootValue={rootValue}
        canRemove={canRemove}
        onUpdate={onUpdate}
        onUpdateWith={onUpdateWith}
        onRemove={onRemove}
        getFallback={getFallback}
      />
    );
  }

  return (
    <PrimitiveEditor
      fieldKey={fieldKey}
      value={value}
      path={path}
      canRemove={canRemove}
      onUpdate={onUpdate}
      onRemove={onRemove}
    />
  );
}

function ObjectEditor({
  fieldKey,
  value,
  path,
  rootValue,
  canRemove,
  onUpdate,
  onUpdateWith,
  onRemove,
  getFallback
}) {
  const entries = Object.entries(value);

  function addField(name, type) {
    if (!name) return;
    onUpdate([...path, name], createEmptyValue(type));
  }

  return (
    <div className={path.length === 0 ? "object-editor root-object" : "object-editor"}>
      {path.length > 0 && (
        <div className="editor-group-heading">
          <div>
            <span>{formatLabel(fieldKey)}</span>
            <small>{entries.length} fields</small>
          </div>
          {canRemove && (
            <button
              className="icon-button danger-icon"
              type="button"
              aria-label={`Remove ${formatLabel(fieldKey)}`}
              onClick={() => onRemove(path)}
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>
      )}

      <div className="field-stack">
        {entries.map(([key, childValue]) => {
          const childPath = [...path, key];
          return (
            <div className="field-row" key={key}>
              <FieldEditor
                fieldKey={key}
                value={childValue}
                fallbackValue={getFallback(childPath)}
                path={childPath}
                rootValue={rootValue}
                onUpdate={onUpdate}
                onUpdateWith={onUpdateWith}
                onRemove={onRemove}
                getFallback={getFallback}
              />
            </div>
          );
        })}
      </div>

      <AddFieldForm existingKeys={Object.keys(value)} onAdd={addField} />
    </div>
  );
}

function ArrayEditor({
  fieldKey,
  value,
  fallbackValue,
  path,
  onUpdate,
  onUpdateWith,
  onRemove,
  getFallback
}) {
  const items = asArray(value);

  function addItem() {
    const templateSource = items.length ? items : asArray(fallbackValue);
    onUpdate(path, [...items, cloneArrayTemplate(templateSource)]);
  }

  function duplicateItem(index) {
    onUpdate(path, [
      ...items.slice(0, index + 1),
      cloneValue(items[index]),
      ...items.slice(index + 1)
    ]);
  }

  function moveItem(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const nextItems = [...items];
    const [item] = nextItems.splice(index, 1);
    nextItems.splice(nextIndex, 0, item);
    onUpdate(path, nextItems);
  }

  return (
    <div className="array-editor">
      <div className="editor-group-heading">
        <div>
          <span>{formatLabel(fieldKey)}</span>
          <small>{items.length} items</small>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={addItem}>
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="array-list">
        {items.length === 0 && <p className="muted-text">No items yet.</p>}
        {items.map((item, index) => {
          const itemPath = [...path, index];
          return (
            <div className="array-item" key={`${path.join(".")}-${index}`}>
              <div className="array-item-heading">
                <strong>{describeItem(item, `${formatLabel(fieldKey)} ${index + 1}`)}</strong>
                <div className="array-actions">
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Move up"
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Move down"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 1)}
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Duplicate item"
                    onClick={() => duplicateItem(index)}
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    className="icon-button danger-icon"
                    type="button"
                    aria-label="Remove item"
                    onClick={() => onRemove(itemPath)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <FieldEditor
                fieldKey={index}
                value={item}
                fallbackValue={getFallback(itemPath)}
                path={itemPath}
                canRemove={false}
                onUpdate={onUpdate}
                onUpdateWith={onUpdateWith}
                onRemove={onRemove}
                getFallback={getFallback}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrimitiveEditor({ fieldKey, value, path, canRemove, onUpdate, onRemove }) {
  const label = formatLabel(fieldKey);
  const key = String(fieldKey);
  const valueType = typeof value;
  const inputId = `field-${path.join("-") || key}`;
  const [uploadError, setUploadError] = useState("");

  if (valueType === "boolean") {
    return (
      <div className="primitive-field boolean-field">
        <label htmlFor={inputId}>
          <ToggleLeft size={17} />
          <span>{label}</span>
        </label>
        <div className="inline-actions">
          <input
            id={inputId}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onUpdate(path, event.target.checked)}
          />
          {canRemove && (
            <button
              className="icon-button danger-icon"
              type="button"
              aria-label={`Remove ${label}`}
              onClick={() => onRemove(path)}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  const isNumber = valueType === "number";
  const Input = isLongTextKey(key) ? "textarea" : "input";
  const validColor = /^#[0-9a-f]{6}$/i.test(String(value || ""));
  const inputType = isNumber
    ? "number"
    : key.toLowerCase().includes("color") && validColor
      ? "color"
      : isUrlKey(key) || isImageKey(key)
        ? "url"
        : "text";

  return (
    <label className="primitive-field" htmlFor={inputId}>
      <span>
        {isImageKey(key) && <Image size={16} />}
        {isNumber && <Hash size={16} />}
        {!isImageKey(key) && !isNumber && <Type size={16} />}
        {label}
      </span>
      <div className="field-input-row">
        <Input
          id={inputId}
          type={Input === "textarea" ? undefined : inputType}
          value={value ?? ""}
          onChange={(event) => {
            const nextValue = isNumber ? Number(event.target.value) : event.target.value;
            onUpdate(path, nextValue);
          }}
        />
        {canRemove && (
          <button
            className="icon-button danger-icon"
            type="button"
            aria-label={`Remove ${label}`}
            onClick={() => onRemove(path)}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      {isImageKey(key) && (
        <div className="image-upload-row">
          <label className="ghost-button compact-button image-upload-button">
            <Upload size={16} />
            Choose image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;

                try {
                  setUploadError("");
                  const nextDataUrl = await imageFileToDataUrl(file);
                  onUpdate(path, nextDataUrl);
                } catch (error) {
                  setUploadError(error.message);
                }
              }}
            />
          </label>
          {value && (
            <button
              className="ghost-button compact-button"
              type="button"
              onClick={() => onUpdate(path, "")}
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      )}
      {uploadError && <p className="form-note error">{uploadError}</p>}
      {isImageKey(key) && value && (
        <img className="field-image-preview" src={value} alt={`${label} preview`} />
      )}
    </label>
  );
}

function AddFieldForm({ existingKeys, onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("string");
  const normalizedName = name.trim();
  const exists = existingKeys.includes(normalizedName);

  function submit(event) {
    event.preventDefault();
    if (!normalizedName || exists) return;
    onAdd(normalizedName, type);
    setName("");
    setType("string");
  }

  return (
    <form className="add-field-form" onSubmit={submit}>
      <input
        aria-label="New field name"
        placeholder="New field name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <select value={type} onChange={(event) => setType(event.target.value)}>
        <option value="string">Text</option>
        <option value="longText">Long text</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
        <option value="object">Group</option>
        <option value="array">List</option>
      </select>
      <button className="ghost-button compact-button" type="submit" disabled={!normalizedName || exists}>
        <Plus size={16} />
        Field
      </button>
    </form>
  );
}

function JsonSectionEditor({ label, value, onApply, embedded = false }) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState("");

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
    setError("");
  }, [value]);

  function apply() {
    try {
      const parsed = JSON.parse(text);
      setError("");
      onApply(parsed);
    } catch (parseError) {
      setError(parseError.message);
    }
  }

  return (
    <section className={embedded ? "json-editor-panel embedded" : "cms-panel json-editor-panel"}>
      {!embedded && (
        <div className="panel-heading">
          <div>
            <span className="eyebrow">JSON Editor</span>
            <h2>{label}</h2>
          </div>
          <button className="primary-button" type="button" onClick={apply}>
            <CheckCheck size={17} />
            Apply Draft
          </button>
        </div>
      )}
      {embedded && (
        <button className="primary-button compact-button" type="button" onClick={apply}>
          <CheckCheck size={17} />
          Apply JSON
        </button>
      )}
      <textarea
        className="json-editor"
        value={text}
        onChange={(event) => setText(event.target.value)}
        spellCheck="false"
      />
      {error && <p className="form-note error">{error}</p>}
    </section>
  );
}

function MessagesPanel({ messages, onStatus, onDelete }) {
  return (
    <section className="cms-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Inbox</span>
          <h2>Contact messages</h2>
        </div>
      </div>
      <div className="message-list">
        {asArray(messages).length === 0 && <p className="muted-text">No messages yet.</p>}
        {asArray(messages).map((message) => (
          <article className="message-card" key={message._id}>
            <div>
              <strong>{message.name}</strong>
              <a href={`mailto:${message.email}`}>{message.email}</a>
              <p>{message.message}</p>
            </div>
            <div className="message-actions">
              <span>{message.status}</span>
              <button type="button" onClick={() => onStatus(message._id, "read")}>
                Mark read
              </button>
              <button type="button" onClick={() => onStatus(message._id, "archived")}>
                Archive
              </button>
              <button className="danger-text-button" type="button" onClick={() => onDelete(message._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default App;
