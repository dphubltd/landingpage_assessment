"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

function Modal({ submission, onClose, apiUrl }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

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

  const renderValue = (key, value) => {
    if (value === null || value === undefined || value === "") return <span className="text-[#94a3b8] italic">Not provided</span>;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-[#94a3b8] italic">None</span>;
      if (typeof value[0] === "object") {
        return (
          <div className="space-y-3">
            {value.map((item, i) => (
              <div key={i} className="bg-[#f8fafb] rounded-xl p-4 border border-[rgba(0,58,71,0.06)]">
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} className="mb-1">
                    <span className="text-xs font-heading font-semibold text-main uppercase tracking-wider">{k}: </span>
                    <span className="text-sm text-[#1a1a2e]">{v || "—"}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((v, i) => <span key={i} className="tag">{v}</span>)}
        </div>
      );
    }
    if (typeof value === "object") {
      return (
        <div className="bg-[#f8fafb] rounded-xl p-4 border border-[rgba(0,58,71,0.06)]">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="mb-1">
              <span className="text-xs font-heading font-semibold text-main uppercase tracking-wider">{k}: </span>
              <span className="text-sm text-[#1a1a2e]">{v || "—"}</span>
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-sm text-[#1a1a2e] break-words">{String(value)}</span>;
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
    copyrightYear: "Copyright Year", legalBusinessName: "Legal Business Name",
    privacyPolicyUrl: "Privacy Policy URL", termsUrl: "Terms of Service URL", cookiePolicyUrl: "Cookie Policy URL", securityUrl: "Security URL",
  };

  const groups = [
    { title: "Brand & Visual Assets", keys: ["customerName", "brandName", "primaryAccent", "secondaryAccent", "neutralBg", "textColor", "headingFont", "bodyFont"] },
    { title: "Navigation & Hero", keys: ["navLinks", "heroHeadline", "heroSubheadline", "primaryCtaLabel", "primaryCtaUrl", "secondaryCtaLabel", "secondaryCtaAction"] },
    { title: "Business Overview", keys: ["elevatorPitch", "features"] },
    { title: "About Us", keys: ["originStory", "missionVision", "process", "qualityAssurance", "communityImpact"] },
    { title: "Products & Services", keys: ["products"] },
    { title: "Newsletter Preferences", keys: ["newsletterHeadline", "newsletterSubcopy", "emailFormat", "frequency", "attachments", "topicFilters", "dataConsent"] },
    { title: "Team Roster", keys: ["teamMembers"] },
    { title: "Social Proof", keys: ["testimonials", "keyMetrics", "brandsWorkedWith", "awardsBadges"] },
    { title: "FAQ", keys: ["faqs"] },
    { title: "Contact", keys: ["supportEmail", "phoneNumber", "streetAddress", "officeHours", "mapCoordinates"] },
    { title: "Footer", keys: ["copyrightYear", "legalBusinessName", "socialLinks", "privacyPolicyUrl", "termsUrl", "cookiePolicyUrl", "securityUrl"] },
  ];

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#f8fafb] border border-[rgba(0,58,71,0.1)] flex items-center justify-center text-[#1a1a2e] hover:bg-[#003a47] hover:text-white transition-all z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-heading font-semibold text-main">Submission #{submission.id}</h2>
          <p className="text-sm text-[#94a3b8]">Submitted on {new Date(submission.created_at).toLocaleString()}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-8 h-8 text-main" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {groups.map((group) => {
              const hasData = group.keys.some(k => {
                const v = data.form_data[k];
                return v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);
              });
              if (!hasData) return null;
              return (
                <div key={group.title} className="section-card p-5">
                  <h3 className="font-heading font-semibold text-main text-lg mb-4">{group.title}</h3>
                  <div className="space-y-4">
                    {group.keys.map((k) => {
                      const v = data.form_data[k];
                      if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) return null;
                      return (
                        <div key={k}>
                          <span className="text-xs font-heading font-semibold text-main uppercase tracking-wider block mb-1">
                            {sectionLabels[k] || k}
                          </span>
                          {renderValue(k, v)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {data.files_data && data.files_data.length > 0 && (
              <div className="section-card p-5">
                <h3 className="font-heading font-semibold text-main text-lg mb-4">Uploaded Files</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.files_data.map((f, i) => (
                    <a key={i} href={`${apiUrl}${f.path}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafb] border border-[rgba(0,58,71,0.06)] hover:border-main transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-main/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-[#1a1a2e] truncate">{f.originalName}</p>
                        <p className="text-xs text-[#94a3b8]">{(f.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-[#94a3b8]">Failed to load submission details.</div>
        )}
      </div>
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-semibold text-xl text-main">Admin Dashboard</h1>
            <p className="text-xs text-[#94a3b8]">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary btn-small">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
                className="section-card p-5 cursor-pointer hover:border-main transition-all"
                onClick={() => setSelectedSubmission(sub)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-main/5 border border-[rgba(0,58,71,0.08)] flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-main text-lg">#{sub.id}</span>
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-[#1a1a2e]">Submission #{sub.id}</p>
                      <p className="text-xs text-[#94a3b8]">{new Date(sub.created_at).toLocaleString()}</p>
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
