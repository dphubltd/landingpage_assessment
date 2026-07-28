"use client";

import { useState, useRef, useEffect, useCallback } from "react";

function FileUpload({ label, accept, multiple, onChange, values }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const files = Array.from(e.dataTransfer.files);
    onChange(multiple ? [...(values || []), ...files] : files[0]);
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    onChange(multiple ? [...(values || []), ...files] : files[0]);
  };

  const removeFile = (i) => {
    if (multiple) {
      const updated = [...(values || [])];
      updated.splice(i, 1);
      onChange(updated);
    } else {
      onChange(null);
    }
  };

  const displayFiles = values ? (Array.isArray(values) ? values : [values]) : [];

  return (
    <div>
      <label className="field-label">{label}</label>
      <div
        className={`file-drop ${drag ? "dragover" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => ref.current?.click()}
      >
        <input ref={ref} type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" />
        {displayFiles.length > 0 ? (
          <div className="space-y-1.5">
            {displayFiles.map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-2 bg-white rounded-lg px-3 py-2 text-sm border border-[rgba(0,58,71,0.08)]">
                <span className="truncate text-[#1a1a2e]">{f.name}</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
              </div>
            ))}
            {multiple && <span className="text-xs text-[#94a3b8]">Click to add more files</span>}
          </div>
        ) : (
          <div>
            <span className="text-2xl text-[#003a47] mb-2 block">&#x2191;</span>
            <p className="text-sm text-[#1a1a2e] font-medium">Drop files here or click to browse</p>
            <p className="text-xs text-[#94a3b8] mt-1">{accept ? `Accepts: ${accept}` : "All files accepted"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DynamicList({ items, onAdd, onRemove, onChange, label, emptyText }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="field-label mb-0">{label}</span>
        <button type="button" onClick={onAdd} className="btn-secondary btn-small">&plus; Add Item</button>
      </div>
      {items.length === 0 && <p className="text-sm text-[#94a3b8] italic">{emptyText || "No items added yet"}</p>}
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start mb-2">
          <div className="flex-1">{onChange(i, item)}</div>
          <button type="button" onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 p-2 mt-1">&times;</button>
        </div>
      ))}
    </div>
  );
}

function ColorInput({ label, value, onChange }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-[rgba(0,58,71,0.1)] cursor-pointer bg-transparent p-0.5"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#HEX"
          className="field-input flex-1"
        />
      </div>
    </div>
  );
}

function SectionNav({ sections, activeSection }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[rgba(0,58,71,0.06)]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {sections.map((s, i) => (
            <a key={i} href={`#section-${i + 1}`} className={`nav-link ${activeSection === i ? "active" : ""}`}>
              <span className="hidden sm:inline">{s.short}</span>
              <span className="sm:hidden">{String(i + 1).padStart(2, "0")}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function TextInput({ label, value, onChange, placeholder, multiline, rows }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <label className="field-label">{label}</label>
      <Tag
        type={multiline ? undefined : "text"}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={multiline ? "field-textarea" : "field-input"}
        rows={rows || 4}
      />
    </div>
  );
}

export default function Form() {
  const [data, setData] = useState({
    customerName: "", brandName: "",
    transparentLogo: null, nonTransparentLogo: null, favicon: null, appIcon: null,
    primaryAccent: "", secondaryAccent: "", neutralBg: "", textColor: "",
    headingFont: "", bodyFont: "",
    studioPhotos: [], heroVideo: null, partnerLogos: [],
    navLinks: [], heroHeadline: "", heroSubheadline: "",
    primaryCtaLabel: "", primaryCtaUrl: "", secondaryCtaLabel: "", secondaryCtaAction: "",
    elevatorPitch: "", features: [],
    originStory: "", missionVision: "", process: "", qualityAssurance: "", communityImpact: "",
    products: [],
    newsletterHeadline: "", newsletterSubcopy: "", emailFormat: "html", frequency: "weekly",
    topicFilters: [], dataConsent: false,
    teamMembers: [],
    testimonials: [], keyMetrics: [], brandsWorkedWith: [], awardsBadges: [],
    faqs: [],
    supportEmail: "", phoneNumber: "", streetAddress: "", officeHours: "", mapCoordinates: "",
    copyrightYear: "", legalBusinessName: "",
    socialLinks: [], privacyPolicyUrl: "", termsUrl: "", cookiePolicyUrl: "", securityUrl: "",
  });
  const [files, setFiles] = useState({});
  const [activeSection, setActiveSection] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const sectionRefs = useRef([]);

  const update = (field) => (value) => setData(prev => ({ ...prev, [field]: value }));
  const updateFiles = (field) => (value) => setFiles(prev => ({ ...prev, [field]: value }));
  const toggleArray = (field) => (item) => setData(prev => {
    const arr = prev[field] || [];
    return { ...prev, [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
  });

  const addItem = (field, template = "") => setData(prev => ({
    ...prev, [field]: [...(prev[field] || []), typeof template === "function" ? template() : template]
  }));
  const removeItem = (field) => (i) => setData(prev => {
    const arr = [...(prev[field] || [])];
    arr.splice(i, 1);
    return { ...prev, [field]: arr };
  });
  const updateItem = (field) => (i, val) => setData(prev => {
    const arr = [...(prev[field] || [])];
    arr[i] = typeof val === "function" ? val(arr[i]) : val;
    return { ...prev, [field]: arr };
  });

  const sections = [
    { short: "Brand Assets", full: "Brand & Visual Assets" },
    { short: "Hero Section", full: "Strategic Header & Hero" },
    { short: "Overview", full: "Business Overview & Features" },
    { short: "About Us", full: "About Us Core Content" },
    { short: "Products", full: "Products & Services" },
    { short: "Newsletter", full: "Newsletter Preferences" },
    { short: "Team", full: "Team Roster" },
    { short: "Social Proof", full: "Social Proof & Trust" },
    { short: "FAQ", full: "FAQ Engine" },
    { short: "Contact", full: "Contact Information" },
    { short: "Footer", full: "Footer Configuration" },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.dataset.index);
          if (!isNaN(idx)) setActiveSection(idx);
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    sectionRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("formData", JSON.stringify(data));
      const allFiles = Object.entries(files).flatMap(([field, f]) => {
        if (!f) return [];
        if (Array.isArray(f)) return f.map(file => { file.fieldname = field; return file; });
        f.fieldname = field;
        return [f];
      });
      allFiles.forEach(f => payload.append("files", f));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submit`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderSection = (index) => {
    const cardClass = "section-card mb-8 scroll-mt-20";

    const Section1 = () => (
      <div ref={el => sectionRefs.current[0] = el} data-index={0} id="section-1" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 01</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">Brand & Visual Assets</h2>
          </div>
          <span className="section-number">01</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TextInput label="Name of the Customer" value={data.customerName} onChange={update("customerName")} placeholder="e.g. John Doe" />
          <TextInput label="Brand Name" value={data.brandName} onChange={update("brandName")} placeholder="e.g. Acme Inc." />
        </div>
        <div className="mt-8">
          <h3 className="font-heading font-semibold text-main mb-4 text-lg">Logos & Brand Identity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FileUpload label="Transparent Logo (PNG/SVG)" accept=".png,.svg" onChange={updateFiles("transparentLogo")} values={files.transparentLogo} />
            <FileUpload label="Non-Transparent Logo (PNG/JPG)" accept=".png,.jpg,.jpeg" onChange={updateFiles("nonTransparentLogo")} values={files.nonTransparentLogo} />
            <FileUpload label="Favicon (32x32px SVG)" accept=".svg,.ico,.png" onChange={updateFiles("favicon")} values={files.favicon} />
            <FileUpload label="Apple Touch Icon (180x180px)" accept=".png" onChange={updateFiles("appIcon")} values={files.appIcon} />
          </div>
        </div>
        <div className="mt-8">
          <h3 className="font-heading font-semibold text-main mb-4 text-lg">Color Palette & Design Tokens</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ColorInput label="Primary Accent" value={data.primaryAccent} onChange={update("primaryAccent")} />
            <ColorInput label="Secondary Accent" value={data.secondaryAccent} onChange={update("secondaryAccent")} />
            <ColorInput label="Neutral Backgrounds" value={data.neutralBg} onChange={update("neutralBg")} />
            <ColorInput label="Text Color" value={data.textColor} onChange={update("textColor")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <TextInput label="Heading Font Family" value={data.headingFont} onChange={update("headingFont")} placeholder="e.g. Outfit, Syne, Space Grotesk" />
            <TextInput label="Body Font Family" value={data.bodyFont} onChange={update("bodyFont")} placeholder="e.g. Inter, DM Sans" />
          </div>
        </div>
        <div className="mt-8">
          <h3 className="font-heading font-semibold text-main mb-4 text-lg">High-Vibrancy Media Assets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FileUpload label="Studio Photography" accept="image/*" multiple onChange={updateFiles("studioPhotos")} values={files.studioPhotos} />
            <FileUpload label="Hero Video Background (10-15s MP4/WebM)" accept=".mp4,.webm" onChange={updateFiles("heroVideo")} values={files.heroVideo} />
            <FileUpload label="Partner & Client Logos (SVG)" accept=".svg" multiple onChange={updateFiles("partnerLogos")} values={files.partnerLogos} />
          </div>
        </div>
      </div>
    );

    const Section2 = () => (
      <div ref={el => sectionRefs.current[1] = el} data-index={1} id="section-2" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 02</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">Strategic Header & Hero Section</h2>
          </div>
          <span className="section-number">02</span>
        </div>
        <div className="mb-6">
          <DynamicList
            label="Navigation Links"
            items={data.navLinks}
            onAdd={() => addItem("navLinks", { label: "", url: "" })}
            onRemove={removeItem("navLinks")}
            onChange={(i) => (item) => (
              <div className="flex gap-2">
                <input className="field-input flex-1" placeholder="Label" value={item.label} onChange={e => updateItem("navLinks")(i, { ...item, label: e.target.value })} />
                <input className="field-input flex-1" placeholder="URL / #section-id" value={item.url} onChange={e => updateItem("navLinks")(i, { ...item, url: e.target.value })} />
              </div>
            )}
            emptyText="Add navigation links for the header menu"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <TextInput label="Hero Headline (8-12 words)" value={data.heroHeadline} onChange={update("heroHeadline")} placeholder="Sharp, high-converting value proposition" multiline rows={2} />
          <TextInput label="Subheadline (15-30 words)" value={data.heroSubheadline} onChange={update("heroSubheadline")} placeholder="Clear explanation of features and audience benefits" multiline rows={3} />
        </div>
        <h3 className="font-heading font-semibold text-main mb-4 text-lg">Call to Action Pair</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput label="Primary CTA Label" value={data.primaryCtaLabel} onChange={update("primaryCtaLabel")} placeholder='e.g. "Start Free Trial"' />
          <TextInput label="Primary CTA URL" value={data.primaryCtaUrl} onChange={update("primaryCtaUrl")} placeholder="e.g. https://..." />
          <TextInput label="Secondary CTA Label" value={data.secondaryCtaLabel} onChange={update("secondaryCtaLabel")} placeholder='e.g. "Watch Demo"' />
          <TextInput label="Secondary CTA Action" value={data.secondaryCtaAction} onChange={update("secondaryCtaAction")} placeholder="e.g. modal trigger, scroll to section" />
        </div>
      </div>
    );

    const Section3 = () => (
      <div ref={el => sectionRefs.current[2] = el} data-index={2} id="section-3" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 03</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">Business Overview & Feature Architecture</h2>
          </div>
          <span className="section-number">03</span>
        </div>
        <TextInput label="Company Elevator Pitch (2-3 paragraphs)" value={data.elevatorPitch} onChange={update("elevatorPitch")} placeholder="Mission, unique value positioning, and market focus..." multiline rows={6} />
        <div className="mt-8">
          <DynamicList
            label="Feature Highlights Grid (3-8 Features)"
            items={data.features}
            onAdd={() => addItem("features", { title: "", icon: "", description: "", benefits: "" })}
            onRemove={removeItem("features")}
            onChange={(i) => (item) => (
              <div className="space-y-2 bg-[#f8fafb] rounded-xl p-4 border border-[rgba(0,58,71,0.06)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="field-input" placeholder="Feature Title" value={item.title} onChange={e => updateItem("features")(i, { ...item, title: e.target.value })} />
                  <input className="field-input" placeholder="Icon/Graphic Spec" value={item.icon} onChange={e => updateItem("features")(i, { ...item, icon: e.target.value })} />
                </div>
                <textarea className="field-textarea" placeholder="Short Description (20-40 words)" rows={2} value={item.description} onChange={e => updateItem("features")(i, { ...item, description: e.target.value })} />
                <input className="field-input" placeholder="Key Benefits / Outcome Metric" value={item.benefits} onChange={e => updateItem("features")(i, { ...item, benefits: e.target.value })} />
              </div>
            )}
            emptyText="Add features to highlight in the grid"
          />
        </div>
      </div>
    );

    const Section4 = () => (
      <div ref={el => sectionRefs.current[3] = el} data-index={3} id="section-4" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 04</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">About Us Core Content</h2>
            <p className="text-sm text-[#94a3b8] mt-1">Target: 600-1,000+ words</p>
          </div>
          <span className="section-number">04</span>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <TextInput label="Our Origin & Founder Story" value={data.originStory} onChange={update("originStory")} placeholder="Founding background, problem identified, how the business came to life..." multiline rows={6} />
          <TextInput label="Mission & Vision Statements" value={data.missionVision} onChange={update("missionVision")} placeholder="Long-term goals, ethical commitments, driving principles..." multiline rows={5} />
          <TextInput label="Our Process / Methodology" value={data.process} onChange={update("process")} placeholder="Step-by-step breakdown of how services/products are delivered..." multiline rows={5} />
          <TextInput label="Quality Assurance & Standards" value={data.qualityAssurance} onChange={update("qualityAssurance")} placeholder="Precision engineering, materials, certifications..." multiline rows={4} />
          <TextInput label="Community, Sustainability & Impact" value={data.communityImpact} onChange={update("communityImpact")} placeholder="Social impact, environmental practices, community outreach..." multiline rows={4} />
        </div>
      </div>
    );

    const Section5 = () => (
      <div ref={el => sectionRefs.current[4] = el} data-index={4} id="section-5" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 05</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">Products & Services Matrix</h2>
          </div>
          <span className="section-number">05</span>
        </div>
        <DynamicList
          label="Products / Services"
          items={data.products}
          onAdd={() => addItem("products", { name: "", tagline: "", description: "", specs: "", pricing: "", pricingLabel: "Fixed", media: "", ctaLabel: "Purchase", ctaUrl: "" })}
          onRemove={removeItem("products")}
          onChange={(i) => (item) => (
            <div className="space-y-3 bg-[#f8fafb] rounded-xl p-4 border border-[rgba(0,58,71,0.06)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="field-input" placeholder="Product/Service Name" value={item.name} onChange={e => updateItem("products")(i, { ...item, name: e.target.value })} />
                <input className="field-input" placeholder="Tagline / Summary Phrase" value={item.tagline} onChange={e => updateItem("products")(i, { ...item, tagline: e.target.value })} />
              </div>
              <textarea className="field-textarea" placeholder="Description" rows={2} value={item.description} onChange={e => updateItem("products")(i, { ...item, description: e.target.value })} />
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input className="field-input" placeholder="Technical Specs / Inclusions" value={item.specs} onChange={e => updateItem("products")(i, { ...item, specs: e.target.value })} />
                <input className="field-input" placeholder="Pricing (e.g. $XX.XX)" value={item.pricing} onChange={e => updateItem("products")(i, { ...item, pricing: e.target.value })} />
                <select className="field-input" value={item.pricingLabel} onChange={e => updateItem("products")(i, { ...item, pricingLabel: e.target.value })}>
                  <option value="Fixed">Fixed Price</option>
                  <option value="Custom Quote">Custom Quote</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Free">Free</option>
                </select>
                <input className="field-input" placeholder="CTA Label" value={item.ctaLabel} onChange={e => updateItem("products")(i, { ...item, ctaLabel: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="field-input" placeholder="CTA URL" value={item.ctaUrl} onChange={e => updateItem("products")(i, { ...item, ctaUrl: e.target.value })} />
                <input className="field-input" placeholder="Media spec (photo/video)" value={item.media} onChange={e => updateItem("products")(i, { ...item, media: e.target.value })} />
              </div>
            </div>
          )}
          emptyText="Add your products or services"
        />
      </div>
    );

    const Section6 = () => (
      <div ref={el => sectionRefs.current[5] = el} data-index={5} id="section-6" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 06</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">Newsletter Subscription & Preferences</h2>
          </div>
          <span className="section-number">06</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <TextInput label="Headline" value={data.newsletterHeadline} onChange={update("newsletterHeadline")} placeholder='e.g. "Stay Ahead of the Curve"' />
          <TextInput label="Sub-copy" value={data.newsletterSubcopy} onChange={update("newsletterSubcopy")} placeholder="Select your preferences to receive updates..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="field-label">Email Format</label>
            <select className="field-input" value={data.emailFormat} onChange={e => update("emailFormat")(e.target.value)}>
              <option value="plain">Plain Text</option>
              <option value="html">HTML</option>
              <option value="markdown">Markdown Digest</option>
            </select>
          </div>
          <div>
            <label className="field-label">Frequency</label>
            <select className="field-input" value={data.frequency} onChange={e => update("frequency")(e.target.value)}>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
              <option value="monthly">Monthly Roundup</option>
            </select>
          </div>
          <div>
            <label className="field-label">Attachments</label>
            <select className="field-input" value={data.attachments} onChange={e => update("attachments")(e.target.value)}>
              <option value="">None</option>
              <option value="video">Video Highlights</option>
              <option value="pdf">PDF Reports</option>
              <option value="articles">Articles Only</option>
            </select>
          </div>
        </div>
        <div className="mb-6">
          <label className="field-label">Topic / Category Filters</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Product Updates & Feature Releases",
              "Industry Insights & Deep-Dive Articles",
              "Special Deals, Pricing & Promotional Offers",
              "Case Studies & Client Stories",
            ].map((topic) => (
              <label key={topic} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(0,58,71,0.08)] cursor-pointer hover:border-[#003a47] transition-colors">
                <input
                  type="checkbox"
                  checked={(data.topicFilters || []).includes(topic)}
                  onChange={() => toggleArray("topicFilters")(topic)}
                  className="w-4 h-4 accent-[#003a47]"
                />
                <span className="text-sm text-[#1a1a2e]">{topic}</span>
              </label>
            ))}
          </div>
        </div>
        <label className="flex items-start gap-3 p-4 rounded-xl bg-[#f8fafb] border border-[rgba(0,58,71,0.08)] cursor-pointer">
          <input
            type="checkbox"
            checked={data.dataConsent}
            onChange={e => update("dataConsent")(e.target.checked)}
            className="w-4 h-4 accent-[#003a47] mt-0.5"
          />
          <span className="text-sm text-[#1a1a2e]">GDPR/CAN-SPAM compliant opt-in statement &amp; link to Privacy Policy.</span>
        </label>
      </div>
    );

    const Section7 = () => (
      <div ref={el => sectionRefs.current[6] = el} data-index={6} id="section-7" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 07</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">Team & Leadership Roster</h2>
          </div>
          <span className="section-number">07</span>
        </div>
        <DynamicList
          label="Team Members"
          items={data.teamMembers}
          onAdd={() => addItem("teamMembers", { name: "", title: "", department: "", bio: "", linkedin: "", github: "", twitter: "", portfolio: "" })}
          onRemove={removeItem("teamMembers")}
          onChange={(i) => (item) => (
            <div className="space-y-3 bg-[#f8fafb] rounded-xl p-4 border border-[rgba(0,58,71,0.06)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="field-input" placeholder="Full Name" value={item.name} onChange={e => updateItem("teamMembers")(i, { ...item, name: e.target.value })} />
                <input className="field-input" placeholder="Official Title" value={item.title} onChange={e => updateItem("teamMembers")(i, { ...item, title: e.target.value })} />
              </div>
              <input className="field-input" placeholder="Department" value={item.department} onChange={e => updateItem("teamMembers")(i, { ...item, department: e.target.value })} />
              <textarea className="field-textarea" placeholder="Extended Bio (3-5 sentences)" rows={3} value={item.bio} onChange={e => updateItem("teamMembers")(i, { ...item, bio: e.target.value })} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="field-input" placeholder="LinkedIn URL" value={item.linkedin} onChange={e => updateItem("teamMembers")(i, { ...item, linkedin: e.target.value })} />
                <input className="field-input" placeholder="GitHub URL" value={item.github} onChange={e => updateItem("teamMembers")(i, { ...item, github: e.target.value })} />
                <input className="field-input" placeholder="X/Twitter URL" value={item.twitter} onChange={e => updateItem("teamMembers")(i, { ...item, twitter: e.target.value })} />
                <input className="field-input" placeholder="Portfolio URL" value={item.portfolio} onChange={e => updateItem("teamMembers")(i, { ...item, portfolio: e.target.value })} />
              </div>
            </div>
          )}
          emptyText="Add team members to display"
        />
      </div>
    );

    const Section8 = () => (
      <div ref={el => sectionRefs.current[7] = el} data-index={7} id="section-8" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 08</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">Social Proof, Trust Signals & Media</h2>
          </div>
          <span className="section-number">08</span>
        </div>
        <div className="mb-6">
          <DynamicList
            label="Client Testimonials"
            items={data.testimonials}
            onAdd={() => addItem("testimonials", { quote: "", clientName: "", title: "", organization: "", rating: 5 })}
            onRemove={removeItem("testimonials")}
            onChange={(i) => (item) => (
              <div className="space-y-2 bg-[#f8fafb] rounded-xl p-4 border border-[rgba(0,58,71,0.06)]">
                <textarea className="field-textarea" placeholder="Full quote" rows={3} value={item.quote} onChange={e => updateItem("testimonials")(i, { ...item, quote: e.target.value })} />
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input className="field-input" placeholder="Client Name" value={item.clientName} onChange={e => updateItem("testimonials")(i, { ...item, clientName: e.target.value })} />
                  <input className="field-input" placeholder="Title" value={item.title} onChange={e => updateItem("testimonials")(i, { ...item, title: e.target.value })} />
                  <input className="field-input" placeholder="Organization" value={item.organization} onChange={e => updateItem("testimonials")(i, { ...item, organization: e.target.value })} />
                  <select className="field-input" value={item.rating} onChange={e => updateItem("testimonials")(i, { ...item, rating: Number(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
              </div>
            )}
            emptyText="Add client testimonials"
          />
        </div>
        <div className="mb-6">
          <label className="field-label">Key Metrics / Data Callouts</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(data.keyMetrics || []).map((m, i) => (
              <span key={i} className="tag flex items-center gap-1">
                {m}
                <button type="button" onClick={() => {
                  const arr = [...(data.keyMetrics || [])];
                  arr.splice(i, 1);
                  update("keyMetrics")(arr);
                }} className="text-red-400 hover:text-red-600 ml-1">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input id="metric-input" className="field-input flex-1" placeholder='e.g. "99.9% Uptime"' />
            <button type="button" onClick={() => { const input = document.getElementById("metric-input"); if (input.value) { update("keyMetrics")([...(data.keyMetrics || []), input.value]); input.value = ""; } }} className="btn-primary btn-small">Add</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FileUpload label="Brands Worked With (Logos)" accept=".svg,.png" multiple onChange={updateFiles("brandsWorkedWith")} values={files.brandsWorkedWith} />
          <FileUpload label="Awards & Compliance Badges" accept=".svg,.png" multiple onChange={updateFiles("awardsBadges")} values={files.awardsBadges} />
        </div>
      </div>
    );

    const Section9 = () => (
      <div ref={el => sectionRefs.current[8] = el} data-index={8} id="section-9" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 09</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">Extended FAQ Engine</h2>
            <p className="text-sm text-[#94a3b8] mt-1">5-10 categorized questions</p>
          </div>
          <span className="section-number">09</span>
        </div>
        <DynamicList
          label="FAQ Items"
          items={data.faqs}
          onAdd={() => addItem("faqs", { category: "General", question: "", answer: "" })}
          onRemove={removeItem("faqs")}
          onChange={(i) => (item) => (
            <div className="space-y-2 bg-[#f8fafb] rounded-xl p-4 border border-[rgba(0,58,71,0.06)]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select className="field-input" value={item.category} onChange={e => updateItem("faqs")(i, { ...item, category: e.target.value })}>
                  <option value="General">General & Onboarding</option>
                  <option value="Pricing">Pricing & Billing</option>
                  <option value="Technical">Technical & Support</option>
                </select>
                <input className="field-input sm:col-span-2" placeholder="Question" value={item.question} onChange={e => updateItem("faqs")(i, { ...item, question: e.target.value })} />
              </div>
              <textarea className="field-textarea" placeholder="Answer" rows={3} value={item.answer} onChange={e => updateItem("faqs")(i, { ...item, answer: e.target.value })} />
            </div>
          )}
          emptyText="Add frequently asked questions"
        />
      </div>
    );

    const Section10 = () => (
      <div ref={el => sectionRefs.current[9] = el} data-index={9} id="section-10" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 10</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">Contact Information & Location</h2>
          </div>
          <span className="section-number">10</span>
        </div>
        <h3 className="font-heading font-semibold text-main mb-4 text-lg">Primary Contact Channels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <TextInput label="Support Email" value={data.supportEmail} onChange={update("supportEmail")} placeholder="support@example.com" />
          <TextInput label="Phone Number (with country code)" value={data.phoneNumber} onChange={update("phoneNumber")} placeholder="+1 (555) 123-4567" />
        </div>
        <h3 className="font-heading font-semibold text-main mb-4 text-lg">Physical Location</h3>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <TextInput label="Full Street Address" value={data.streetAddress} onChange={update("streetAddress")} placeholder="123 Main St, City, Country" />
          <TextInput label="Office Hours" value={data.officeHours} onChange={update("officeHours")} placeholder="Mon-Fri 9:00 AM - 6:00 PM" />
          <TextInput label="Map Coordinates / Embed Code" value={data.mapCoordinates} onChange={update("mapCoordinates")} placeholder="Google Maps embed URL or coordinates" multiline rows={2} />
        </div>
        <h3 className="font-heading font-semibold text-main mb-4 text-lg">Interactive Contact Form Structure</h3>
        <p className="text-sm text-[#94a3b8] mb-4">The form will include: Full Name, Company Email, Phone Number, Subject, Message Body, Project Budget.</p>
      </div>
    );

    const Section11 = () => (
      <div ref={el => sectionRefs.current[10] = el} data-index={10} id="section-11" className={cardClass}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="tag mb-2 block w-fit">Section 11</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">Footer Configuration</h2>
          </div>
          <span className="section-number">11</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <TextInput label="Copyright Year" value={data.copyrightYear} onChange={update("copyrightYear")} placeholder="2024" />
          <TextInput label="Legal Business Name" value={data.legalBusinessName} onChange={update("legalBusinessName")} placeholder="Acme Inc." />
        </div>
        <div className="mb-6">
          <DynamicList
            label="Social Network Links"
            items={data.socialLinks}
            onAdd={() => addItem("socialLinks", { platform: "", url: "" })}
            onRemove={removeItem("socialLinks")}
            onChange={(i) => (item) => (
              <div className="flex gap-2">
                <input className="field-input w-40" placeholder="Platform" value={item.platform} onChange={e => updateItem("socialLinks")(i, { ...item, platform: e.target.value })} />
                <input className="field-input flex-1" placeholder="Full URL" value={item.url} onChange={e => updateItem("socialLinks")(i, { ...item, url: e.target.value })} />
              </div>
            )}
            emptyText="Add social media links (LinkedIn, X/Twitter, Instagram, etc.)"
          />
        </div>
        <h3 className="font-heading font-semibold text-main mb-4 text-lg">Legal & Governance URLs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput label="Privacy Policy URL" value={data.privacyPolicyUrl} onChange={update("privacyPolicyUrl")} placeholder="https://..." />
          <TextInput label="Terms of Service URL" value={data.termsUrl} onChange={update("termsUrl")} placeholder="https://..." />
          <TextInput label="Cookie Policy URL" value={data.cookiePolicyUrl} onChange={update("cookiePolicyUrl")} placeholder="https://..." />
          <TextInput label="Security / Status Page URL" value={data.securityUrl} onChange={update("securityUrl")} placeholder="https://..." />
        </div>
      </div>
    );

    const sections = [Section1, Section2, Section3, Section4, Section5, Section6, Section7, Section8, Section9, Section10, Section11];
    const Section = sections[index];
    return <Section />;
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grid px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-[#003a47] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-heading font-semibold text-main mb-3">Submission Received</h2>
          <p className="text-[#1a1a2e] mb-8">Thank you! Your asset collection has been submitted successfully. We&apos;ll review everything and get back to you shortly.</p>
          <button onClick={() => { setSubmitted(false); setData({}); setFiles({}); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-primary">
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid">
      <header className="border-b border-[rgba(0,58,71,0.06)] bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-semibold text-xl sm:text-2xl text-main">Master Operational Brief</h1>
            <p className="text-xs sm:text-sm text-[#94a3b8]">Landing Page Asset &amp; Copy Checklist</p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-[#94a3b8]">A streamlined operational framework</p>
          </div>
        </div>
      </header>

      <SectionNav sections={sections} activeSection={activeSection} />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <p className="text-sm text-[#94a3b8] max-w-2xl mx-auto">
            Collect copy, high-resolution media, and configuration specifications prior to design and development execution.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        {Array.from({ length: 11 }, (_, i) => <div key={i}>{renderSection(i)}</div>)}

        <div className="text-center pt-6 pb-12">
          <button type="submit" disabled={submitting} className="btn-primary text-lg px-10 py-4">
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Submitting...
              </span>
            ) : "Submit Asset Collection"}
          </button>
        </div>
      </form>

      <footer className="border-t border-[rgba(0,58,71,0.06)] py-6 text-center">
        <p className="text-xs text-[#94a3b8]">Master Operational Brief &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
