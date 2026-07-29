"use client";

import { useState, useRef, useEffect } from "react";
import { VerifiedIcon } from "lucide-react";

const UploadIcon = () => (
  <svg
    className="w-6 h-6 text-[#003a47]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const EmptyIcon = () => (
  <svg
    className="w-5 h-5 text-[#94a3b8]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

function SectionStatus({ completed }) {
  if (!completed) return null;
  return (
    <svg
      className="w-5 h-5 text-emerald-500 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

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

  const displayFiles = values
    ? Array.isArray(values)
      ? values
      : [values]
    : [];

  return (
    <div>
      <label className="field-label">{label}</label>
      <div
        className={`file-drop ${drag ? "dragover" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLnpmeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => ref.current?.click()}
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        {displayFiles.length > 0 ? (
          <div className="space-y-1.5">
            {displayFiles.map((f, i) => {
              const previewUrl = f.type?.startsWith("image/")
                ? URL.createObjectURL(f)
                : null;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 bg-white rounded-lg px-3 py-2 text-sm border border-[rgba(0,58,71,0.08)]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt=""
                        className="w-8 h-8 rounded object-cover border border-[rgba(0,58,71,0.08)] shrink-0"
                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                      />
                    )}
                    <span className="truncate text-[#1a1a2e]">{f.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
            {multiple && (
              <span className="text-xs text-[#94a3b8] inline-flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Click to add more files
              </span>
            )}
          </div>
        ) : (
          <div>
            <div className="file-icon">
              <UploadIcon />
            </div>
            <p className="text-sm text-[#1a1a2e] font-medium">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-[#94a3b8] mt-1">
              {accept ? `Accepts: ${accept}` : "All files accepted"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DynamicList({
  items = [],
  onAdd,
  onRemove,
  onChange,
  label,
  emptyText,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="field-label mb-0">{label}</span>
        <button type="button" onClick={onAdd} className="btn-ghost btn-small">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Item
        </button>
      </div>
      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <EmptyIcon />
          </div>
          <p className="text-sm text-[#94a3b8]">
            {emptyText || "No items added yet"}
          </p>
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start mb-3 animate-fade-in">
          <div className="flex-1">{onChange(i)(item)}</div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="text-red-400 hover:text-red-600 p-2 mt-2 transition-colors shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
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

function SectionNav({ sections, activeSection, sectionStatus }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[rgba(0,58,71,0.06)] shadow-none sm:shadow-sm">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 py-2.5">
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {sections.map((s, i) => (
            <a
              key={i}
              href={`#section-${i + 1}`}
              className={`nav-link ${activeSection === i ? "active" : ""} inline-flex items-center gap-1.5`}
            >
              <span className="hidden sm:inline">{s.short}</span>
              <span className="sm:hidden">
                {String(i + 1).padStart(2, "0")}
              </span>
              {sectionStatus[i] && (
                <svg
                  className="w-3 h-3 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows,
  hint,
}) {
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
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

const SECTION_CONFIGS = [
  {
    id: "section-1",
    title: "Business Name",
    tag: "01",
  },
  {
    id: "section-2",
    title: "Header Section",
    tag: "02",
  },
  {
    id: "section-3",
    title: "Business Overview ",
    tag: "03",
  },
  {
    id: "section-4",
    title: "About Us ",
    tag: "04",
  },
  {
    id: "section-5",
    title: "Products & Services Matrix",
    tag: "05",
  },
  {
    id: "section-6",
    title: "Newsletter Subscription & Preferences",
    tag: "06",
  },
  {
    id: "section-7",
    title: "Team & Leadership Roles",
    tag: "07",
  },
  {
    id: "section-8",
    title: "Social Proofs",
    tag: "08",
  },
  {
    id: "section-9",
    title: "Extended FAQ Engine",
    tag: "09",
  },
  {
    id: "section-10",
    title: "Contact Information & Location",
    tag: "10",
  },
  {
    id: "section-11",
    title: "Footer Configuration",
    tag: "11",
  },
];

export default function Form() {
  const initialData = {
    customerName: "",
    brandName: "",
    transparentLogo: null,
    nonTransparentLogo: null,
    favicon: null,
    appIcon: null,
    primaryAccent: "",
    secondaryAccent: "",
    neutralBg: "",
    textColor: "",
    headingFont: "",
    bodyFont: "",
    studioPhotos: [],
    heroVideo: null,
    partnerLogos: [],
    navLinks: [],
    heroHeadline: "",
    heroSubheadline: "",
    primaryCtaLabel: "",
    primaryCtaUrl: "",
    secondaryCtaLabel: "",
    secondaryCtaAction: "",
    elevatorPitch: "",
    features: [],
    originStory: "",
    missionVision: "",
    process: "",
    qualityAssurance: "",
    communityImpact: "",
    products: [],
    newsletterHeadline: "",
    newsletterSubcopy: "",
    emailFormat: "html",
    frequency: "weekly",
    topicFilters: [],
    dataConsent: false,
    teamMembers: [],
    testimonials: [],
    keyMetrics: [],
    brandsWorkedWith: [],
    awardsBadges: [],
    faqs: [],
    supportEmail: "",
    phoneNumber: "",
    streetAddress: "",
    officeHours: "",
    mapCoordinates: "",
    copyrightYear: "",
    legalBusinessName: "",
    socialLinks: [],
    privacyPolicyUrl: "",
    termsUrl: "",
    cookiePolicyUrl: "",
    securityUrl: "",
    leadHandling: "view",
  };
  const [data, setData] = useState(initialData);
  const [files, setFiles] = useState({});
  const [extraColors, setExtraColors] = useState([]);
  const [extraLogos, setExtraLogos] = useState([]);
  const [extraMedia, setExtraMedia] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const sectionRefs = useRef([]);

  const update = (field) => (value) =>
    setData((prev) => ({ ...prev, [field]: value }));
  const updateFiles = (field) => (value) =>
    setFiles((prev) => ({ ...prev, [field]: value }));
  const toggleArray = (field) => (item) =>
    setData((prev) => {
      const arr = prev[field] || [];
      return {
        ...prev,
        [field]: arr.includes(item)
          ? arr.filter((i) => i !== item)
          : [...arr, item],
      };
    });

  const addItem = (field, template = "") =>
    setData((prev) => ({
      ...prev,
      [field]: [
        ...(prev[field] || []),
        typeof template === "function" ? template() : template,
      ],
    }));
  const removeItem = (field) => (i) =>
    setData((prev) => {
      const arr = [...(prev[field] || [])];
      arr.splice(i, 1);
      return { ...prev, [field]: arr };
    });
  const updateItem = (field) => (i, val) =>
    setData((prev) => {
      const arr = [...(prev[field] || [])];
      arr[i] = typeof val === "function" ? val(arr[i]) : val;
      return { ...prev, [field]: arr };
    });

  const addExtraColor = () => setExtraColors((prev) => [...prev, ""]);
  const removeExtraColor = (i) =>
    setExtraColors((prev) => prev.filter((_, idx) => idx !== i));
  const updateExtraColor = (i) => (value) =>
    setExtraColors((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });

  const addLogoSet = () =>
    setExtraLogos((prev) => [...prev, { id: Date.now() }]);
  const removeLogoSet = (i) =>
    setExtraLogos((prev) => prev.filter((_, idx) => idx !== i));

  const addMediaSet = () =>
    setExtraMedia((prev) => [...prev, { id: Date.now() }]);
  const removeMediaSet = (i) =>
    setExtraMedia((prev) => prev.filter((_, idx) => idx !== i));

  const sections = SECTION_CONFIGS.map((c) => ({
    short: c.tag + " " + c.title.split(" ").slice(0, 3).join(" "),
    full: c.title,
    tag: c.tag,
  }));

  const sectionFilled = useRef({});

  const getSectionStatus = () => {
    const status = {};
    const check = (fields) =>
      fields.some((f) => {
        const v = data[f];
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "boolean") return v;
        return !!v;
      });
    const checkFiles = (fields) =>
      fields.some((f) => {
        const v = files[f];
        if (Array.isArray(v)) return v.length > 0;
        return !!v;
      });
    status[0] =
      check(["customerName", "brandName"]) ||
      checkFiles([
        "transparentLogo",
        "nonTransparentLogo",
        "favicon",
        "appIcon",
      ]) ||
      check([
        "primaryColor",
        "secondaryColor",
        "neutralBg",
        "textColor",
        "headingFont",
        "bodyFont",
      ]) ||
      checkFiles(["studioPhotos", "heroVideo", "partnerLogos"]);
    status[1] =
      check(["navLinks", "heroHeadline", "heroSubheadline"]) ||
      check(["primaryCtaLabel", "secondaryCtaLabel"]);
    status[2] = check(["elevatorPitch", "features"]);
    status[3] = check([
      "originStory",
      "missionVision",
      "process",
      "qualityAssurance",
      "communityImpact",
    ]);
    status[4] = check(["products"]);
    status[5] =
      check(["newsletterHeadline", "newsletterSubcopy"]) ||
      data.dataConsent ||
      check(["topicFilters"]) ||
      data.leadHandling !== "view";
    status[6] = check(["teamMembers"]);
    status[7] =
      check(["testimonials", "keyMetrics"]) ||
      checkFiles(["brandsWorkedWith", "awardsBadges"]);
    status[8] = check(["faqs"]);
    status[9] = check(["supportEmail", "phoneNumber", "streetAddress"]);
    status[10] = check(["copyrightYear", "legalBusinessName", "socialLinks"]);
    return status;
  };

  const sectionStatus = getSectionStatus();
  const completedCount = Object.values(sectionStatus).filter(Boolean).length;
  const totalSections = sections.length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            if (!isNaN(idx)) setActiveSection(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    sectionRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = new FormData();
      const submitData = {
        ...data,
        extraColors,
        extraLogos: extraLogos.map(() => ({})),
        extraMedia: extraMedia.map(() => ({})),
      };
      payload.append("formData", JSON.stringify(submitData));
      const allFiles = Object.entries(files).flatMap(([field, f]) => {
        if (!f) return [];
        if (Array.isArray(f))
          return f.map((file) => {
            file.fieldname = field;
            return file;
          });
        f.fieldname = field;
        return [f];
      });
      allFiles.forEach((f) => payload.append("files", f));

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
    const cfg = SECTION_CONFIGS[index];
    const cardClass = "section-card mb-0 sm:mb-8 scroll-mt-24";
    const completed = sectionStatus[index];

    switch (index) {
      case 0:
        return (
          <div
            ref={(el) => (sectionRefs.current[0] = el)}
            data-index={0}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <TextInput
                label="Name of the Customer"
                value={data.customerName}
                onChange={update("customerName")}
                placeholder="e.g. John Doe"
              />
              <TextInput
                label="Brand Name"
                value={data.brandName}
                onChange={update("brandName")}
                placeholder="e.g. Acme Inc."
              />
            </div>
            <div className="section-divider" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-main text-lg flex items-center gap-2">
                  Logos & Brand Identity
                </h3>
                <button
                  type="button"
                  onClick={addLogoSet}
                  className="btn-ghost btn-small"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Set
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FileUpload
                  label="Transparent Logo (PNG/SVG)"
                  accept=".png,.svg"
                  onChange={updateFiles("transparentLogo")}
                  values={files.transparentLogo}
                />
                <FileUpload
                  label="Non-Transparent Logo (PNG/JPG)"
                  accept=".png,.jpg,.jpeg"
                  onChange={updateFiles("nonTransparentLogo")}
                  values={files.nonTransparentLogo}
                />
                <FileUpload
                  label="Favicon (32x32px SVG)"
                  accept=".svg,.ico,.png"
                  onChange={updateFiles("favicon")}
                  values={files.favicon}
                />
                <FileUpload
                  label="White/Dark Mode (180x180px)(optional)"
                  accept=".png"
                  onChange={updateFiles("appIcon")}
                  values={files.appIcon}
                />
              </div>
              {extraLogos.map((_, i) => (
                <div
                  key={i}
                  className="mt-6 p-4 border border-[rgba(0,58,71,0.08)] rounded-lg bg-[#f8fafb] relative animate-fade-in"
                >
                  <button
                    type="button"
                    onClick={() => removeLogoSet(i)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FileUpload
                      label="Transparent Logo (PNG/SVG)"
                      accept=".png,.svg"
                      onChange={updateFiles(`extraLogo_${i}_transparent`)}
                      values={files[`extraLogo_${i}_transparent`]}
                    />
                    <FileUpload
                      label="Non-Transparent Logo (PNG/JPG)"
                      accept=".png,.jpg,.jpeg"
                      onChange={updateFiles(`extraLogo_${i}_nonTransparent`)}
                      values={files[`extraLogo_${i}_nonTransparent`]}
                    />
                    <FileUpload
                      label="Favicon (32x32px SVG)"
                      accept=".svg,.ico,.png"
                      onChange={updateFiles(`extraLogo_${i}_favicon`)}
                      values={files[`extraLogo_${i}_favicon`]}
                    />
                    <FileUpload
                      label="White/Dark Mode (180x180px)(optional)"
                      accept=".png"
                      onChange={updateFiles(`extraLogo_${i}_appIcon`)}
                      values={files[`extraLogo_${i}_appIcon`]}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="section-divider" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-main text-lg flex items-center gap-2">
                  Color Palette & Design Tokens
                </h3>
                <button
                  type="button"
                  onClick={addExtraColor}
                  className="btn-ghost btn-small"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Color
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ColorInput
                  label="Primary Color"
                  value={data.primaryAccent}
                  onChange={update("primaryAccent")}
                />
                <ColorInput
                  label="Secondary Color"
                  value={data.secondaryAccent}
                  onChange={update("secondaryAccent")}
                />
                <ColorInput
                  label="Neutral Backgrounds"
                  value={data.neutralBg}
                  onChange={update("neutralBg")}
                />
                <ColorInput
                  label="Text Color"
                  value={data.textColor}
                  onChange={update("textColor")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <TextInput
                  label="Heading Font Family"
                  value={data.headingFont}
                  onChange={update("headingFont")}
                  placeholder="e.g. Outfit, Syne, Space Grotesk"
                />
                <TextInput
                  label="Body Font Family"
                  value={data.bodyFont}
                  onChange={update("bodyFont")}
                  placeholder="e.g. Inter, DM Sans"
                />
              </div>
              {extraColors.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {extraColors.map((c, i) => (
                    <div key={i} className="relative animate-fade-in">
                      <button
                        type="button"
                        onClick={() => removeExtraColor(i)}
                        className="absolute -top-2 -right-2 z-10 w-5 h-5 bg-red-400 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <ColorInput
                        label={`Custom Color ${i + 1}`}
                        value={c}
                        onChange={updateExtraColor(i)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="section-divider" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-main text-lg flex items-center gap-2">
                  Business Pictures
                </h3>
                <button
                  type="button"
                  onClick={addMediaSet}
                  className="btn-ghost btn-small"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Set
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FileUpload
                  label="Studio Photography"
                  accept="image/*"
                  multiple
                  onChange={updateFiles("studioPhotos")}
                  values={files.studioPhotos}
                />
                <FileUpload
                  label="Hero Video Background (10-15s MP4/WebM)  (optional)"
                  accept=".mp4,.webm"
                  onChange={updateFiles("heroVideo")}
                  values={files.heroVideo}
                />
                <FileUpload
                  label="Partner & Client Logos (SVG)"
                  accept=".svg"
                  multiple
                  onChange={updateFiles("partnerLogos")}
                  values={files.partnerLogos}
                />
              </div>
              {extraMedia.map((_, i) => (
                <div
                  key={i}
                  className="mt-6 p-4 border border-[rgba(0,58,71,0.08)] rounded-lg bg-[#f8fafb] relative animate-fade-in"
                >
                  <button
                    type="button"
                    onClick={() => removeMediaSet(i)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FileUpload
                      label="Studio Photography"
                      accept="image/*"
                      multiple
                      onChange={updateFiles(`extraMedia_${i}_photos`)}
                      values={files[`extraMedia_${i}_photos`]}
                    />
                    <FileUpload
                      label="Hero Video (optional)"
                      accept=".mp4,.webm"
                      onChange={updateFiles(`extraMedia_${i}_video`)}
                      values={files[`extraMedia_${i}_video`]}
                    />
                    <FileUpload
                      label="Partner & Client Logos (SVG)"
                      accept=".svg"
                      multiple
                      onChange={updateFiles(`extraMedia_${i}_logos`)}
                      values={files[`extraMedia_${i}_logos`]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div
            ref={(el) => (sectionRefs.current[1] = el)}
            data-index={1}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0.05s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <div className="mb-6">
              <DynamicList
                label="Navigation Links"
                items={data.navLinks}
                onAdd={() => addItem("navLinks", { label: "", url: "" })}
                onRemove={removeItem("navLinks")}
                onChange={(i) => (item) => (
                  <div className="item-card">
                    <div className="flex gap-2">
                      <input
                        className="field-input flex-1"
                        placeholder="Label"
                        value={item.label}
                        onChange={(e) =>
                          updateItem("navLinks")(i, {
                            ...item,
                            label: e.target.value,
                          })
                        }
                      />
                      <input
                        className="field-input flex-1"
                        placeholder="URL / #section-id"
                        value={item.url}
                        onChange={(e) =>
                          updateItem("navLinks")(i, {
                            ...item,
                            url: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                emptyText="Add navigation links for the header menu"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <TextInput
                label="Hero Headline (8-12 words)"
                value={data.heroHeadline}
                onChange={update("heroHeadline")}
                placeholder="Sharp, high-converting value proposition"
                multiline
                rows={2}
              />
              <TextInput
                label="Subheadline (15-30 words)"
                value={data.heroSubheadline}
                onChange={update("heroSubheadline")}
                placeholder="Clear explanation of features and audience benefits"
                multiline
                rows={3}
              />
            </div>
            <div className="section-divider" />
            <h3 className="font-heading font-semibold text-main mb-4 text-lg flex items-center gap-2">
              Call to Action Pair
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="Primary CTA Label"
                value={data.primaryCtaLabel}
                onChange={update("primaryCtaLabel")}
                placeholder='e.g. "Start Free Trial"'
              />
              <TextInput
                label="Primary CTA URL"
                value={data.primaryCtaUrl}
                onChange={update("primaryCtaUrl")}
                placeholder="e.g. https://..."
              />
              <TextInput
                label="Secondary CTA Label"
                value={data.secondaryCtaLabel}
                onChange={update("secondaryCtaLabel")}
                placeholder='e.g. "Watch Demo"'
              />
              <TextInput
                label="Secondary CTA Action"
                value={data.secondaryCtaAction}
                onChange={update("secondaryCtaAction")}
                placeholder="e.g. modal trigger, scroll to section"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div
            ref={(el) => (sectionRefs.current[2] = el)}
            data-index={2}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <TextInput
              label="Company Elevator Pitch (2-3 paragraphs) (600-1000) Words and  Above"
              value={data.elevatorPitch}
              onChange={update("elevatorPitch")}
              placeholder="Mission, unique value positioning, and market focus..."
              multiline
              rows={6}
            />
            <div className="section-divider" />
            <DynamicList
              label="Feature Highlights Grid (3-8 Features)"
              items={data.features}
              onAdd={() =>
                addItem("features", {
                  title: "",
                  icon: "",
                  description: "",
                  benefits: "",
                })
              }
              onRemove={removeItem("features")}
              onChange={(i) => (item) => (
                <div className="item-card">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="field-input"
                      placeholder="Feature Title"
                      value={item.title}
                      onChange={(e) =>
                        updateItem("features")(i, {
                          ...item,
                          title: e.target.value,
                        })
                      }
                    />
                    <input
                      className="field-input"
                      placeholder="Icon/Graphic Spec"
                      value={item.icon}
                      onChange={(e) =>
                        updateItem("features")(i, {
                          ...item,
                          icon: e.target.value,
                        })
                      }
                    />
                  </div>
                  <textarea
                    className="field-textarea mt-3"
                    placeholder="Short Description (20-40 words)"
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      updateItem("features")(i, {
                        ...item,
                        description: e.target.value,
                      })
                    }
                  />
                  <input
                    className="field-input mt-3"
                    placeholder="Key Benefits / Outcome Metric"
                    value={item.benefits}
                    onChange={(e) =>
                      updateItem("features")(i, {
                        ...item,
                        benefits: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              emptyText="Add features to highlight in the grid"
            />
          </div>
        );
      case 3:
        return (
          <div
            ref={(el) => (sectionRefs.current[3] = el)}
            data-index={3}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                  <p className="text-sm text-[#94a3b8] mt-1">
                    Target: 600-1,000+ words
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <TextInput
                label="Our Origin & Founder Story"
                value={data.originStory}
                onChange={update("originStory")}
                placeholder="Founding background, problem identified, how the business came to life..."
                multiline
                rows={6}
              />
              <TextInput
                label="Mission & Vision Statements"
                value={data.missionVision}
                onChange={update("missionVision")}
                placeholder="Long-term goals, ethical commitments, driving principles..."
                multiline
                rows={5}
              />
              <TextInput
                label="Our Process / Methodology"
                value={data.process}
                onChange={update("process")}
                placeholder="Step-by-step breakdown of how services/products are delivered..."
                multiline
                rows={5}
              />
              <TextInput
                label="Quality Assurance & Standards"
                value={data.qualityAssurance}
                onChange={update("qualityAssurance")}
                placeholder="Precision engineering, materials, certifications..."
                multiline
                rows={4}
              />
              <TextInput
                label="Community, Sustainability & Impact"
                value={data.communityImpact}
                onChange={update("communityImpact")}
                placeholder="Social impact, environmental practices, community outreach..."
                multiline
                rows={4}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div
            ref={(el) => (sectionRefs.current[4] = el)}
            data-index={4}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <DynamicList
              label="Products / Services"
              items={data.products}
              onAdd={() =>
                addItem("products", {
                  name: "",
                  tagline: "",
                  description: "",
                  specs: "",
                  pricing: "",
                  pricingLabel: "Fixed",
                  media: "",
                  ctaLabel: "Purchase",
                  ctaUrl: "",
                })
              }
              onRemove={removeItem("products")}
              onChange={(i) => (item) => (
                <div className="item-card">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="field-input"
                      placeholder="Product/Service Name"
                      value={item.name}
                      onChange={(e) =>
                        updateItem("products")(i, {
                          ...item,
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      className="field-input"
                      placeholder="Tagline / Summary Phrase"
                      value={item.tagline}
                      onChange={(e) =>
                        updateItem("products")(i, {
                          ...item,
                          tagline: e.target.value,
                        })
                      }
                    />
                  </div>
                  <textarea
                    className="field-textarea mt-3"
                    placeholder="Description"
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      updateItem("products")(i, {
                        ...item,
                        description: e.target.value,
                      })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3">
                    <input
                      className="field-input"
                      placeholder="Technical Specs / Inclusions"
                      value={item.specs}
                      onChange={(e) =>
                        updateItem("products")(i, {
                          ...item,
                          specs: e.target.value,
                        })
                      }
                    />
                    <input
                      className="field-input"
                      placeholder="Pricing (e.g. $XX.XX)"
                      value={item.pricing}
                      onChange={(e) =>
                        updateItem("products")(i, {
                          ...item,
                          pricing: e.target.value,
                        })
                      }
                    />
                    <select
                      className="field-input"
                      value={item.pricingLabel}
                      onChange={(e) =>
                        updateItem("products")(i, {
                          ...item,
                          pricingLabel: e.target.value,
                        })
                      }
                    >
                      <option value="Fixed">Fixed Price</option>
                      <option value="Custom Quote">Custom Quote</option>
                      <option value="Subscription">Subscription</option>
                      <option value="Free">Free</option>
                    </select>
                    <input
                      className="field-input"
                      placeholder="CTA Label"
                      value={item.ctaLabel}
                      onChange={(e) =>
                        updateItem("products")(i, {
                          ...item,
                          ctaLabel: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 mt-3">
                    <FileUpload
                      label="Product Image"
                      accept="image/*"
                      onChange={updateFiles(`productImage_${i}`)}
                      values={files[`productImage_${i}`]}
                    />
                  </div>
                </div>
              )}
              emptyText="Add your products or services"
            />
          </div>
        );
      case 5:
        return (
          <div
            ref={(el) => (sectionRefs.current[5] = el)}
            data-index={5}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0.25s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <TextInput
                label="Headline"
                value={data.newsletterHeadline}
                onChange={update("newsletterHeadline")}
                placeholder='e.g. "Stay Ahead of the Curve"'
              />
              <TextInput
                label="Sub-copy"
                value={data.newsletterSubcopy}
                onChange={update("newsletterSubcopy")}
                placeholder="Select your preferences to receive updates..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="field-label">Email Format</label>
                <select
                  className="field-input"
                  value={data.emailFormat}
                  onChange={(e) => update("emailFormat")(e.target.value)}
                >
                  <option value="plain">Plain Text</option>
                  <option value="html">HTML</option>
                  <option value="markdown">Markdown Digest</option>
                </select>
              </div>
              <div>
                <label className="field-label">Frequency</label>
                <select
                  className="field-input"
                  value={data.frequency}
                  onChange={(e) => update("frequency")(e.target.value)}
                >
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                  <option value="monthly">Monthly Roundup</option>
                </select>
              </div>
              <div>
                <label className="field-label">Attachments</label>
                <select
                  className="field-input"
                  value={data.attachments}
                  onChange={(e) => update("attachments")(e.target.value)}
                >
                  <option value="">None</option>
                  <option value="video">Video Highlights</option>
                  <option value="pdf">PDF Reports</option>
                  <option value="articles">Articles Only</option>
                </select>
              </div>
            </div>
            <div className="section-divider" />
            <div className="mb-6">
              <label className="field-label">Topic / Category Filters</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Product Updates & Feature Releases",
                  "Industry Insights & Deep-Dive Articles",
                  "Special Deals, Pricing & Promotional Offers",
                  "Case Studies & Client Stories",
                ].map((topic) => (
                  <label key={topic} className="check-radio">
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
            <div className="section-divider" />
            <div className="mb-6">
              <label className="field-label">Lead Handling Preference</label>
              <p className="text-xs text-[#94a3b8] mb-3">
                How would you like to manage submissions and leads?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    value: "email",
                    label: "Email Notifications",
                    desc: "Submissions sent to your inbox",
                  },
                  {
                    value: "mailchimp",
                    label: "Mailchimp Integration",
                    desc: "Sync leads to Mailchimp",
                  },
                  {
                    value: "view",
                    label: "View & Export CSV",
                    desc: "Manage in the admin dashboard",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`check-radio cursor-pointer ${data.leadHandling === opt.value ? "border-main bg-[rgba(0,58,71,0.04)]" : ""}`}
                  >
                    <input
                      type="radio"
                      name="leadHandling"
                      value={opt.value}
                      checked={data.leadHandling === opt.value}
                      onChange={(e) => update("leadHandling")(e.target.value)}
                      className="w-4 h-4 accent-[#003a47]"
                    />
                    <div>
                      <span className="text-sm font-medium text-[#1a1a2e] block">
                        {opt.label}
                      </span>
                      <span className="text-xs text-[#94a3b8]">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-start gap-3 p-4 rounded-lg bg-[#f8fafb] border border-[rgba(0,58,71,0.08)] cursor-pointer hover:border-[rgba(0,58,71,0.2)] transition-colors">
              <input
                type="checkbox"
                checked={data.dataConsent}
                onChange={(e) => update("dataConsent")(e.target.checked)}
                className="w-4 h-4 accent-[#003a47] mt-0.5"
              />
              <span className="text-sm text-[#1a1a2e]">
                GDPR/CAN-SPAM compliant opt-in statement &amp; link to Privacy
                Policy.
              </span>
            </label>
          </div>
        );
      case 6:
        return (
          <div
            ref={(el) => (sectionRefs.current[6] = el)}
            data-index={6}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <DynamicList
              label="Team Members"
              items={data.teamMembers}
              onAdd={() =>
                addItem("teamMembers", {
                  name: "",
                  title: "",
                  department: "",
                  bio: "",
                  linkedin: "",
                  github: "",
                  twitter: "",
                  portfolio: "",
                })
              }
              onRemove={removeItem("teamMembers")}
              onChange={(i) => (item) => (
                <div className="item-card">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="field-input"
                      placeholder="Full Name"
                      value={item.name}
                      onChange={(e) =>
                        updateItem("teamMembers")(i, {
                          ...item,
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      className="field-input"
                      placeholder="Official Title"
                      value={item.title}
                      onChange={(e) =>
                        updateItem("teamMembers")(i, {
                          ...item,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <input
                    className="field-input mt-3"
                    placeholder="Department"
                    value={item.department}
                    onChange={(e) =>
                      updateItem("teamMembers")(i, {
                        ...item,
                        department: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="field-textarea mt-3"
                    placeholder="Extended Bio (3-5 sentences)"
                    rows={3}
                    value={item.bio}
                    onChange={(e) =>
                      updateItem("teamMembers")(i, {
                        ...item,
                        bio: e.target.value,
                      })
                    }
                  />
                  <div className="mt-3">
                    <FileUpload
                      label="Photo"
                      accept="image/*"
                      onChange={updateFiles(`teamMemberPhoto_${i}`)}
                      values={files[`teamMemberPhoto_${i}`]}
                    />
                  </div>
                  <p className="text-xs text-[#94a3b8] mt-3 mb-1 font-medium">
                    Social Links (optional)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="field-input"
                      placeholder="LinkedIn URL"
                      value={item.linkedin}
                      onChange={(e) =>
                        updateItem("teamMembers")(i, {
                          ...item,
                          linkedin: e.target.value,
                        })
                      }
                    />
                    <input
                      className="field-input"
                      placeholder="GitHub URL"
                      value={item.github}
                      onChange={(e) =>
                        updateItem("teamMembers")(i, {
                          ...item,
                          github: e.target.value,
                        })
                      }
                    />
                    <input
                      className="field-input"
                      placeholder="X/Twitter URL"
                      value={item.twitter}
                      onChange={(e) =>
                        updateItem("teamMembers")(i, {
                          ...item,
                          twitter: e.target.value,
                        })
                      }
                    />
                    <input
                      className="field-input"
                      placeholder="Portfolio URL"
                      value={item.portfolio}
                      onChange={(e) =>
                        updateItem("teamMembers")(i, {
                          ...item,
                          portfolio: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              emptyText="Add team members to display"
            />
          </div>
        );
      case 7:
        return (
          <div
            ref={(el) => (sectionRefs.current[7] = el)}
            data-index={7}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0.35s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <div className="mb-6">
              <DynamicList
                label="Client Testimonials"
                items={data.testimonials}
                onAdd={() =>
                  addItem("testimonials", {
                    quote: "",
                    clientName: "",
                    title: "",
                    organization: "",
                    rating: 5,
                  })
                }
                onRemove={removeItem("testimonials")}
                onChange={(i) => (item) => (
                  <div className="item-card">
                    <textarea
                      className="field-textarea"
                      placeholder="Full quote"
                      rows={3}
                      value={item.quote}
                      onChange={(e) =>
                        updateItem("testimonials")(i, {
                          ...item,
                          quote: e.target.value,
                        })
                      }
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-3">
                      <input
                        className="field-input"
                        placeholder="Client Name"
                        value={item.clientName}
                        onChange={(e) =>
                          updateItem("testimonials")(i, {
                            ...item,
                            clientName: e.target.value,
                          })
                        }
                      />
                      <input
                        className="field-input"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) =>
                          updateItem("testimonials")(i, {
                            ...item,
                            title: e.target.value,
                          })
                        }
                      />
                      <input
                        className="field-input"
                        placeholder="Organization"
                        value={item.organization}
                        onChange={(e) =>
                          updateItem("testimonials")(i, {
                            ...item,
                            organization: e.target.value,
                          })
                        }
                      />
                      <select
                        className="field-input"
                        value={item.rating}
                        onChange={(e) =>
                          updateItem("testimonials")(i, {
                            ...item,
                            rating: Number(e.target.value),
                          })
                        }
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} Star{r > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                emptyText="Add client testimonials"
              />
            </div>
            <div className="section-divider" />
            <div className="mb-6">
              <label className="field-label">Key Metrics / Data Callouts</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {(data.keyMetrics || []).map((m, i) => (
                  <span key={i} className="tag">
                    {m}
                    <button
                      type="button"
                      onClick={() => {
                        const arr = [...(data.keyMetrics || [])];
                        arr.splice(i, 1);
                        update("keyMetrics")(arr);
                      }}
                      className="tag-remove"
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  id="metric-input"
                  className="field-input flex-1"
                  placeholder='e.g. "99.9% Uptime"'
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const input = document.getElementById("metric-input");
                      if (input.value) {
                        update("keyMetrics")([
                          ...(data.keyMetrics || []),
                          input.value,
                        ]);
                        input.value = "";
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("metric-input");
                    if (input.value) {
                      update("keyMetrics")([
                        ...(data.keyMetrics || []),
                        input.value,
                      ]);
                      input.value = "";
                    }
                  }}
                  className="btn-primary btn-small"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FileUpload
                label="Brands Worked With (Logos)"
                accept=".svg,.png"
                multiple
                onChange={updateFiles("brandsWorkedWith")}
                values={files.brandsWorkedWith}
              />
              <FileUpload
                label="Awards & Compliance Badges"
                accept=".svg,.png"
                multiple
                onChange={updateFiles("awardsBadges")}
                values={files.awardsBadges}
              />
            </div>
          </div>
        );
      case 8:
        return (
          <div
            ref={(el) => (sectionRefs.current[8] = el)}
            data-index={8}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                  <p className="text-sm text-[#94a3b8] mt-1">
                    5-10 categorized questions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <DynamicList
              label="FAQ Items"
              items={data.faqs}
              onAdd={() =>
                addItem("faqs", {
                  category: "General",
                  question: "",
                  answer: "",
                })
              }
              onRemove={removeItem("faqs")}
              onChange={(i) => (item) => (
                <div className="item-card">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      className="field-input"
                      value={item.category}
                      onChange={(e) =>
                        updateItem("faqs")(i, {
                          ...item,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="General">General & Onboarding</option>
                      <option value="Pricing">Pricing & Billing</option>
                      <option value="Technical">Technical & Support</option>
                    </select>
                    <input
                      className="field-input sm:col-span-2"
                      placeholder="Question"
                      value={item.question}
                      onChange={(e) =>
                        updateItem("faqs")(i, {
                          ...item,
                          question: e.target.value,
                        })
                      }
                    />
                  </div>
                  <textarea
                    className="field-textarea mt-3"
                    placeholder="Answer"
                    rows={3}
                    value={item.answer}
                    onChange={(e) =>
                      updateItem("faqs")(i, { ...item, answer: e.target.value })
                    }
                  />
                </div>
              )}
              emptyText="Add frequently asked questions"
            />
          </div>
        );
      case 9:
        return (
          <div
            ref={(el) => (sectionRefs.current[9] = el)}
            data-index={9}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0.45s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <h3 className="font-heading font-semibold text-main mb-4 text-lg flex items-center gap-2">
              Primary Contact Channels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <TextInput
                label="Support Email"
                value={data.supportEmail}
                onChange={update("supportEmail")}
                placeholder="support@example.com"
              />
              <TextInput
                label="Phone Number (with country code)"
                value={data.phoneNumber}
                onChange={update("phoneNumber")}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="section-divider" />
            <h3 className="font-heading font-semibold text-main mb-4 text-lg flex items-center gap-2">
              Physical Location
            </h3>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <TextInput
                label="Full Street Address"
                value={data.streetAddress}
                onChange={update("streetAddress")}
                placeholder="123 Main St, City, Country"
              />
              <TextInput
                label="Office Hours"
                value={data.officeHours}
                onChange={update("officeHours")}
                placeholder="Mon-Fri 9:00 AM - 6:00 PM"
              />
              <TextInput
                label="Map Coordinates / Embed Code"
                value={data.mapCoordinates}
                onChange={update("mapCoordinates")}
                placeholder="Google Maps embed URL or coordinates"
                multiline
                rows={2}
              />
            </div>
            <div className="section-divider" />
            <div>
              <h3 className="font-heading font-semibold text-main mb-4 text-lg flex items-center gap-2">
                Interactive Contact Form Structure
              </h3>
              <p className="text-sm text-[#94a3b8]">
                The form will include: Full Name, Company Email, Phone Number,
                Subject, Message Body, Project Budget.
              </p>
            </div>
          </div>
        );
      case 10:
        return (
          <div
            ref={(el) => (sectionRefs.current[10] = el)}
            data-index={10}
            id={cfg.id}
            className={cardClass}
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <span className="tag mb-2 block w-fit">
                    Section {cfg.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-main">
                    {cfg.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SectionStatus completed={completed} />
                <span className="section-number">{cfg.tag}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <TextInput
                label="Copyright Year"
                value={data.copyrightYear}
                onChange={update("copyrightYear")}
                placeholder="2024"
              />
              <TextInput
                label="Legal Business Name"
                value={data.legalBusinessName}
                onChange={update("legalBusinessName")}
                placeholder="Acme Inc."
              />
            </div>
            <div className="section-divider" />
            <DynamicList
              label="Social Network Links"
              items={data.socialLinks}
              onAdd={() => addItem("socialLinks", { platform: "", url: "" })}
              onRemove={removeItem("socialLinks")}
              onChange={(i) => (item) => (
                <div className="item-card">
                  <div className="flex gap-2">
                    <input
                      className="field-input w-40"
                      placeholder="Platform"
                      value={item.platform}
                      onChange={(e) =>
                        updateItem("socialLinks")(i, {
                          ...item,
                          platform: e.target.value,
                        })
                      }
                    />
                    <input
                      className="field-input flex-1"
                      placeholder="Full URL"
                      value={item.url}
                      onChange={(e) =>
                        updateItem("socialLinks")(i, {
                          ...item,
                          url: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              emptyText="Add social media links (LinkedIn, X/Twitter, Instagram, etc.)"
            />
            <div className="section-divider" />
            <h3 className="font-heading font-semibold text-main mb-4 text-lg flex items-center gap-2">
              Legal & Governance URLs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="Privacy Policy URL"
                value={data.privacyPolicyUrl}
                onChange={update("privacyPolicyUrl")}
                placeholder="https://..."
              />
              <TextInput
                label="Terms of Service URL"
                value={data.termsUrl}
                onChange={update("termsUrl")}
                placeholder="https://..."
              />
              <TextInput
                label="Cookie Policy URL"
                value={data.cookiePolicyUrl}
                onChange={update("cookiePolicyUrl")}
                placeholder="https://..."
              />
              <TextInput
                label="Security / Status Page URL"
                value={data.securityUrl}
                onChange={update("securityUrl")}
                placeholder="https://..."
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grid px-4">
        <div className="text-center max-w-lg animate-slide-up">
          <div className="success-check">
            <VerifiedIcon className="w-12 h-12 text-main" />
          </div>
          <h2 className="text-3xl font-heading font-semibold text-main mb-3 animate-fade-in">
            Submission Received
          </h2>
          <p className="text-[#1a1a2e] mb-2">
            Thank you! Your asset collection has been submitted successfully.
          </p>
          <p className="text-sm text-[#94a3b8] mb-8">
            We&apos;ll review everything and get back to you shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setData(initialData);
              setFiles({});
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn-primary"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid">
      <header className="border-b border-[rgba(0,58,71,0.06)] bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 py-5 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Brand logo"
              className="h-8 sm:h-10 w-auto"
            />
            <div>
              <h1 className="font-heading font-semibold text-xl sm:text-2xl text-main">
                Master Operational Brief
              </h1>
              <p className="text-xs sm:text-sm text-[#94a3b8]">
                Landing Page Asset &amp; Copy Checklist
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#94a3b8] hidden sm:block">
              A streamlined operational framework
            </p>
            <p className="text-xs text-main font-medium mt-0.5">
              {completedCount} of {totalSections} complete
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-4 pb-4 sm:pb-4">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1.5">
              {sections.map((s, i) => (
                <a
                  key={i}
                  href={`#section-${i + 1}`}
                  className={`nav-dot ${activeSection === i ? "active" : ""} ${sectionStatus[i] ? "filled" : ""}`}
                  title={sections[i].full}
                />
              ))}
            </div>
            <span className="text-xs text-[#94a3b8] font-medium">
              {progressPercent}% complete
            </span>
          </div>
        </div>
      </header>

      <SectionNav
        sections={sections}
        activeSection={activeSection}
        sectionStatus={sectionStatus}
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto px-0 sm:px-4 py-8"
      >
        <div className="text-center mb-6 sm:mb-10 px-4 sm:px-0 animate-fade-in">
          <p className="text-sm text-[#94a3b8] max-w-2xl mx-auto">
            Collect copy, high-resolution media, and configuration
            specifications prior to design and development execution.
          </p>
        </div>

        {error && (
          <div className="mx-4 sm:mx-0 mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-slide-up">
            {error}
          </div>
        )}

        {Array.from({ length: 11 }, (_, i) => (
          <div key={i}>{renderSection(i)}</div>
        ))}

        <div className="text-center pt-4 pb-8 sm:pt-6 sm:pb-12">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary text-lg px-10 py-4"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Submit Asset Collection
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            )}
          </button>
        </div>
      </form>

      <footer className="border-t sm:border-t-0 border-[rgba(0,58,71,0.06)] py-4 sm:py-6 text-center">
        <p className="text-xs text-[#94a3b8]">
          Master Operational Brief &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
