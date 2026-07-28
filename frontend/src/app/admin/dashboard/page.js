"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

function Modal({ submission, onClose, apiUrl }) {
  const fileUrl = (f) => `${apiUrl}/api/files/${encodeURIComponent(f.filename)}`;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const pdfRef = useRef(null);

  const downloadPdf = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const el = pdfRef.current;
    if (!el) return;
    html2pdf()
      .set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${data?.form_data?.brandName || `submission-${submission.id}`}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(el)
      .save();
  };

  useEffect(() => {
    if (!submission) return;
    setLoading(true);
    fetch(`${apiUrl}/api/submissions/${submission.id}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject("Failed"))
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [submission, apiUrl]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!submission) return null;

  const copy = (text) => navigator.clipboard?.writeText(String(text));

  const CopyBtn = ({ text }) => (
    <button onClick={() => copy(text)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-[#94a3b8] hover:text-main shrink-0" title="Copy">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
    </button>
  );

  const renderValue = (key, value) => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      if (typeof value[0] === "object") {
        return (
          <div className="space-y-3">
            {value.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-[rgba(0,58,71,0.06)] group">
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} className="mb-1 flex items-start gap-1">
                    <span className="text-xs font-heading font-semibold text-main uppercase tracking-wider shrink-0">{k}: </span>
                    <span className="text-sm text-[#1a1a2e] break-words">{v || "—"}</span>
                    {v && <CopyBtn text={v} />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((v, i) => <span key={i} className="tag group cursor-default">{v}<CopyBtn text={v} /></span>)}
        </div>
      );
    }
    if (typeof value === "object" && value !== null) {
      const entries = Object.entries(value).filter(([, v]) => v !== null && v !== undefined && v !== "");
      if (entries.length === 0) return null;
      return (
        <div className="bg-white rounded-xl p-4 border border-[rgba(0,58,71,0.06)] group">
          {entries.map(([k, v]) => (
            <div key={k} className="mb-1 flex items-start gap-1">
              <span className="text-xs font-heading font-semibold text-main uppercase tracking-wider shrink-0">{k}: </span>
              <span className="text-sm text-[#1a1a2e] break-words">{v || "—"}</span>
              {v && <CopyBtn text={v} />}
            </div>
          ))}
        </div>
      );
    }
    if (value === null || value === undefined || value === "") return null;
    return (
      <span className="group inline-flex items-center">
        <span className="text-sm text-[#1a1a2e] break-words">{String(value)}</span>
        <CopyBtn text={value} />
      </span>
    );
  };

  const sectionLabels = {
    customerName: "Customer Name", brandName: "Brand Name",
    primaryAccent: "Primary Accent", secondaryAccent: "Secondary Accent", neutralBg: "Neutral Backgrounds", textColor: "Text Color",
    headingFont: "Heading Font", bodyFont: "Body Font",
    heroHeadline: "Hero Headline", heroSubheadline: "Subheadline",
    primaryCtaLabel: "Primary CTA Label", primaryCtaUrl: "Primary CTA URL", secondaryCtaLabel: "Secondary CTA Label", secondaryCtaAction: "Secondary CTA Action",
    elevatorPitch: "Elevator Pitch",
    originStory: "Origin Story", missionVision: "Mission & Vision", process: "Process/Methodology", qualityAssurance: "Quality Assurance", communityImpact: "Community Impact",
    newsletterHeadline: "Newsletter Headline", newsletterSubcopy: "Newsletter Sub-copy", emailFormat: "Email Format", frequency: "Frequency", attachments: "Attachments", topicFilters: "Topic Filters", dataConsent: "Data Consent",
    supportEmail: "Support Email", phoneNumber: "Phone Number", streetAddress: "Street Address", officeHours: "Office Hours", mapCoordinates: "Map Coordinates",
    copyrightYear: "Copyright Year", legalBusinessName: "Legal Business Name", leadHandling: "Lead Handling",
    privacyPolicyUrl: "Privacy Policy URL", termsUrl: "Terms of Service URL", cookiePolicyUrl: "Cookie Policy URL", securityUrl: "Security URL",
  };

  const groups = [
    { title: "Brand & Visual Assets", keys: ["customerName", "brandName", "primaryAccent", "secondaryAccent", "neutralBg", "textColor", "headingFont", "bodyFont"], cols: 2 },
    { title: "Navigation & Hero", keys: ["navLinks", "heroHeadline", "heroSubheadline", "primaryCtaLabel", "primaryCtaUrl", "secondaryCtaLabel", "secondaryCtaAction"], cols: 2 },
    { title: "Business Overview", keys: ["elevatorPitch", "features"], cols: 1 },
    { title: "About Us", keys: ["originStory", "missionVision", "process", "qualityAssurance", "communityImpact"], cols: 2 },
    { title: "Products & Services", keys: ["products"], cols: 1 },
    { title: "Newsletter Preferences", keys: ["newsletterHeadline", "newsletterSubcopy", "emailFormat", "frequency", "attachments", "topicFilters", "dataConsent", "leadHandling"], cols: 2 },
    { title: "Team Roster", keys: ["teamMembers"], cols: 1 },
    { title: "Social Proof", keys: ["testimonials", "keyMetrics", "brandsWorkedWith", "awardsBadges"], cols: 2 },
    { title: "FAQ", keys: ["faqs"], cols: 1 },
    { title: "Contact", keys: ["supportEmail", "phoneNumber", "streetAddress", "officeHours", "mapCoordinates"], cols: 2 },
    { title: "Footer", keys: ["copyrightYear", "legalBusinessName", "socialLinks", "privacyPolicyUrl", "termsUrl", "cookiePolicyUrl", "securityUrl"], cols: 2 },
  ];

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content select-all">
        <div className="sticky top-0 bg-white z-10 border-b border-[rgba(0,58,71,0.06)] -mx-6 px-6 pb-4 pt-5 mb-6 rounded-t-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-2xl font-heading font-semibold text-main truncate">{data?.form_data?.brandName || `Submission #${submission.id}`}</h2>
              <p className="text-sm text-[#94a3b8] mt-0.5">Submitted {new Date(submission.created_at).toLocaleString()}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#f8fafb] border border-[rgba(0,58,71,0.1)] flex items-center justify-center text-[#94a3b8] hover:bg-[#003a47] hover:text-white transition-all shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button onClick={() => { const text = document.querySelector('.modal-content')?.innerText; if (text) navigator.clipboard?.writeText(text); }} className="btn-ghost btn-small" title="Copy all text">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Copy
            </button>
            <button onClick={downloadPdf} className="btn-primary btn-small">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Download PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-8 h-8 text-main" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        ) : data ? (
          <div className="space-y-5">
            {groups.map((group) => {
              const hasData = group.keys.some(k => {
                const v = data.form_data[k];
                return v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);
              });
              if (!hasData) return null;
              return (
                <div key={group.title} className="bg-[#f8fafb] rounded-xl p-5 border border-[rgba(0,58,71,0.06)]">
                  <h3 className="font-heading font-semibold text-main text-base mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-main rounded-full inline-block" />
                    {group.title}
                  </h3>
                  <div className="space-y-3">
                    {group.keys.map((k) => {
                      const v = data.form_data[k];
                      if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) return null;
                      return (
                        <div key={k}>
                          <span className="text-xs font-heading font-semibold text-[#94a3b8] uppercase tracking-wider block mb-1">
                            {sectionLabels[k] || k}
                          </span>
                          <div className="text-sm text-[#1a1a2e]">{renderValue(k, v)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {data.files_data && data.files_data.length > 0 && (
              <div className="bg-[#f8fafb] rounded-xl p-5 border border-[rgba(0,58,71,0.06)]">
                <h3 className="font-heading font-semibold text-main text-base mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-main rounded-full inline-block" />
                  Uploaded Files
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.files_data.map((f, i) => {
                    const isImage = f.mimetype?.startsWith("image/");
                    const isVideo = f.mimetype?.startsWith("video/");
                    return (
                      <div key={i} className="bg-white rounded-xl border border-[rgba(0,58,71,0.08)] overflow-hidden hover:shadow-sm transition-shadow">
                        {isImage ? (
                          <button onClick={() => setLightbox(fileUrl(f))} className="w-full text-left">
                            <img src={fileUrl(f)} alt={f.originalName} className="w-full h-36 object-cover" loading="lazy" />
                          </button>
                        ) : isVideo ? (
                          <video src={fileUrl(f)} controls className="w-full h-36 object-cover" />
                        ) : (
                          <a href={fileUrl(f)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4">
                            <div className="w-10 h-10 rounded-lg bg-main/5 flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-[#1a1a2e] truncate font-medium">{f.originalName}</p>
                              <p className="text-xs text-[#94a3b8]">{(f.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </a>
                        )}
                        <div className="px-3 pb-2 -mt-1">
                          <p className="text-xs text-[#94a3b8] truncate">{f.originalName}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            </div>
            <p className="text-sm text-[#94a3b8]">Failed to load submission details.</p>
          </div>
        )}
      </div>

      <div ref={pdfRef} className="hidden">
        <div style={{ padding: "0.5in", fontFamily: "system-ui, sans-serif", color: "#1a1a2e" }}>
          <div style={{ background: "#003a47", color: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "22px", margin: 0 }}>{data?.form_data?.brandName || `Submission #${submission.id}`}</h1>
            <p style={{ fontSize: "13px", opacity: 0.8, margin: "4px 0 0" }}>Submitted {data ? new Date(submission.created_at).toLocaleString() : ""}</p>
          </div>
          {data && groups.map((group) => {
            const hasData = group.keys.some(k => data.form_data[k] !== undefined && data.form_data[k] !== null && data.form_data[k] !== "" && !(Array.isArray(data.form_data[k]) && data.form_data[k].length === 0));
            if (!hasData) return null;
            return (
              <div key={group.title} style={{ marginBottom: "16px" }}>
                <h2 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 8px", color: "#003a47" }}>{group.title}</h2>
                {group.keys.map((k) => {
                  const v = data.form_data[k];
                  if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) return null;
                  return (
                    <div key={k} style={{ marginBottom: "6px", fontSize: "12px" }}>
                      <span style={{ fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px" }}>{sectionLabels[k] || k}: </span>
                      <span>{Array.isArray(v) ? JSON.stringify(v) : typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "8px", fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>
            Generated from Master Operational Brief — {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/check-auth`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (!d.authenticated) { router.push("/admin"); return; }
        setAuthChecking(false);
        loadSubmissions();
      })
      .catch(() => { router.push("/admin"); });
  }, [router, apiUrl]);

  const loadSubmissions = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/submissions`, { credentials: "include" });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setSubmissions(data);
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, router]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this submission? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${apiUrl}/api/submissions/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        setSubmissions(prev => prev.filter(s => s.id !== id));
        if (selectedSubmission?.id === id) setSelectedSubmission(null);
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleLogout = async () => {
    await fetch(`${apiUrl}/api/logout`, { method: "POST", credentials: "include" });
    router.push("/admin");
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grid">
        <svg className="animate-spin w-8 h-8 text-main" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid">
      <header className="border-b border-[rgba(0,58,71,0.06)] bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-semibold text-xl text-main">Admin Dashboard</h1>
            <p className="text-xs text-[#94a3b8]">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary btn-small">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-0 sm:px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-8 h-8 text-main" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#f8fafb] border border-[rgba(0,58,71,0.08)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <h2 className="text-xl font-heading font-semibold text-main mb-2">No Submissions Yet</h2>
            <p className="text-sm text-[#94a3b8]">Form submissions will appear here once they start coming in.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((sub) => (
              <div key={sub.id}
                className="section-card p-5 cursor-pointer hover:border-main transition-all mb-0 sm:mb-4"
                onClick={() => setSelectedSubmission(sub)}
              >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-main/5 border border-[rgba(0,58,71,0.08)] flex items-center justify-center flex-shrink-0">
                        <span className="font-heading font-bold text-main text-lg">#{sub.id}</span>
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-[#1a1a2e]">{sub.brandName || `Submission #${sub.id}`}</p>
                        <p className="text-xs text-[#94a3b8]">{new Date(sub.created_at).toLocaleString()}{sub.customerName ? ` — ${sub.customerName}` : ""}</p>
                      </div>
                    </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(sub.id); }}
                    className="btn-danger btn-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedSubmission && (
        <Modal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          apiUrl={apiUrl}
        />
      )}
    </div>
  );
}
