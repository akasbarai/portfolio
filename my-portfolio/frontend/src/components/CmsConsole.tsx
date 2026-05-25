import React, { useState } from "react";
import { 
  Save, 
  Trash2, 
  Plus, 
  Sparkles, 
  RotateCcw, 
  ArrowLeft, 
  Eye, 
  Edit, 
  FileText, 
  Settings, 
  User, 
  Briefcase, 
  BookOpen, 
  Check, 
  FileCode2,
  Wand2,
  Lock,
  Image as ImageIcon,
  Copy,
  CheckCheck,
  PlusCircle,
  FileImage
} from "lucide-react";
import { PortfolioData, Project, BlogPost, Experience, Education, AstrologyUser } from "../types";
import NeumorphicImageUploader from "./NeumorphicImageUploader";

interface CmsConsoleProps {
  data: PortfolioData;
  onSave: (updatedData: PortfolioData) => Promise<void>;
  onReset: () => Promise<void>;
  onPreview?: (draftData: PortfolioData) => void;
  onSignOut?: () => void;
}

export default function CmsConsole({ data, onSave, onReset, onPreview, onSignOut }: CmsConsoleProps) {
  // We keep a clone of the data in local state for drafts
  const [draft, setDraft] = useState<PortfolioData>({ ...data });
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "blogs" | "photos" | "experience" | "education" | "astrology">("profile");
  
  // Specific Entity states
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Astrology seeker states
  const [astrologyUsers, setAstrologyUsers] = useState<AstrologyUser[]>([]);
  const [loadingAstroUsers, setLoadingAstroUsers] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    message: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const requestConfirm = (message: string, onConfirm: () => void | Promise<void>) => {
    setConfirmAction({ message, onConfirm });
  };

  const fetchAstrologyUsers = async () => {
    try {
      setLoadingAstroUsers(true);
      const res = await fetch("/api/astrology/users", {
        headers: {
          "x-owner-token": sessionStorage.getItem("owner_token") || ""
        }
      });
      if (res.ok) {
        const d = await res.json();
        setAstrologyUsers(d.users || []);
      }
    } catch (e) {
      console.error("Failed to fetch astrology users data", e);
      showToast("Failed to fetch astrology users.", "error");
    } finally {
      setLoadingAstroUsers(false);
    }
  };

  const handleVerifyAstroUser = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/astrology/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-owner-token": sessionStorage.getItem("owner_token") || ""
        },
        body: JSON.stringify({ userId, verify: !currentStatus })
      });
      if (res.ok) {
        fetchAstrologyUsers();
        showToast(currentStatus ? "Astrology access revoked." : "Astrology user verified.", "success");
      } else {
        const err = await res.json();
        showToast(err.error || "Verification failed.", "error");
      }
    } catch (e) {
      console.error("Verification toggle fail:", e);
      showToast("Verification request failed.", "error");
    }
  };

  const deleteAstroUser = async (userId: string) => {
    try {
      const res = await fetch("/api/astrology/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-owner-token": sessionStorage.getItem("owner_token") || ""
        },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        fetchAstrologyUsers();
        showToast("Astrology account deleted.", "success");
      } else {
        const err = await res.json();
        showToast(err.error || "Deletion failed.", "error");
      }
    } catch (e) {
      console.error("Deletion toggle fail:", e);
      showToast("Deletion request failed.", "error");
    }
  };

  const handleDeleteAstroUser = (userId: string) => {
    requestConfirm(
      "Permanently delete this astrology account and its consultation history?",
      () => deleteAstroUser(userId)
    );
  };

  // Photos management states
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchPhotosLibrary = async () => {
    try {
      const res = await fetch("/api/portfolio/uploads", {
        headers: {
          "x-owner-token": sessionStorage.getItem("owner_token") || ""
        }
      });
      if (res.ok) {
        const d = await res.json();
        setUploadedPhotos(d.files || []);
      }
    } catch (e) {
      console.error("Failed to load uploads gallery", e);
      showToast("Failed to load uploads gallery.", "error");
    }
  };

  const deletePhoto = async (photoUrl: string) => {
    try {
      const res = await fetch("/api/portfolio/uploads/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-owner-token": sessionStorage.getItem("owner_token") || ""
        },
        body: JSON.stringify({ url: photoUrl })
      });
      if (res.ok) {
        fetchPhotosLibrary();
        showToast("Photo deleted.", "success");
      } else {
        const errData = await res.json();
        showToast(errData.error || "Failed to delete photo.", "error");
      }
    } catch (e) {
      console.error("Delete photo error:", e);
      showToast("Delete photo request failed.", "error");
    }
  };

  const handleDeletePhoto = (photoUrl: string) => {
    requestConfirm("Permanently delete this photo from disk?", () => deletePhoto(photoUrl));
  };

  const handleCopyClipboard = (url: string) => {
    const absoluteUrl = window.location.origin + url;
    navigator.clipboard.writeText(absoluteUrl);
    setCopiedUrl(url);
    showToast("Photo URL copied to clipboard.", "success");
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  React.useEffect(() => {
    if (activeTab === "photos") {
      fetchPhotosLibrary();
    }
    if (activeTab === "astrology") {
      fetchAstrologyUsers();
    }
  }, [activeTab]);

  // Gemini AI loaders
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Form states for AI suggestions
  const [aiKeywords, setAiKeywords] = useState<string>("");
  const [aiTone, setAiTone] = useState<string>("Professional & innovative");
  const [aiLength, setAiLength] = useState<string>("350");

  const [aiFocusArea, setAiFocusArea] = useState<string>("");

  const activeProject = draft.projects.find((p) => p.id === selectedProjectId) || null;
  const activeBlog = draft.blogs.find((b) => b.id === selectedBlogId) || null;
  const hasUnsavedChanges = React.useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(data);
  }, [draft, data]);

  React.useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // --- Actions ---
  const handleProfileChange = (key: string, value: any) => {
    setDraft((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value
      }
    }));
  };

  const handleSocialChange = (key: string, value: any) => {
    setDraft((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        socialLinks: {
          ...prev.profile.socialLinks,
          [key]: value
        }
      }
    }));
  };

  const handleSeoChange = (key: string, value: any) => {
    setDraft((prev) => {
      const currentSeo = prev.profile.seo || { metaTitle: "", metaDescription: "", metaKeywords: "" };
      return {
        ...prev,
        profile: {
          ...prev.profile,
          seo: {
            ...currentSeo,
            [key]: value
          }
        }
      };
    });
  };

  const handleSaveAll = async () => {
    try {
      setAiLoading(true);
      await onSave(draft);
      setAiError(null);
      showToast("Portfolio changes published.", "success");
    } catch (err) {
      setAiError("Failed to publish edits. Please check console logs.");
      showToast("Failed to publish edits.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleResetDb = async () => {
    requestConfirm("Reset portfolio details to the default starter content?", async () => {
      try {
        setAiLoading(true);
        await onReset();
        showToast("Portfolio reset complete.", "success");
        // Since parent will reload, let's keep draft in sync
        window.location.reload();
      } catch (err) {
        setAiError("Reset request failed.");
        showToast("Reset request failed.", "error");
      } finally {
        setAiLoading(false);
      }
    });
  };

  // --- Project Management Actions ---
  const handleCreateProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: "Unnamed Artifact",
      category: "Web Development",
      description: "Quick summary of this amazing artifact.",
      longDescription: "Detailed summary documenting critical architectural solutions.",
      techStack: ["React", "TypeScript", "Tailwind CSS"],
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      featured: false,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setDraft((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));
    setSelectedProjectId(newProj.id);
  };

  const handleUpdateProject = (field: keyof Project, value: any) => {
    if (!selectedProjectId) return;
    setDraft((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => 
        p.id === selectedProjectId ? { ...p, [field]: value } : p
      )
    }));
  };

  const deleteProject = (id: string) => {
    if (selectedProjectId === id) setSelectedProjectId(null);
    setDraft((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  const handleDeleteProject = (id: string) => {
    requestConfirm("Delete this project draft?", () => deleteProject(id));
  };

  const handleDuplicateProject = (id: string) => {
    const project = draft.projects.find((p) => p.id === id);
    if (!project) return;
    const copy: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      title: `${project.title} Copy`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    setDraft((prev) => ({
      ...prev,
      projects: [copy, ...prev.projects]
    }));
    setSelectedProjectId(copy.id);
    showToast("Project duplicated.", "success");
  };

  // --- Blog Management Actions ---
  const handleCreateBlog = () => {
    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      title: "Empowering publication platforms",
      excerpt: "Summary highlights of what our editorial contains.",
      content: "## Heading 1\n\nWrite your standard markdown content here...",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      tags: ["Dev", "UX"],
      publishedAt: new Date().toISOString().split("T")[0],
      readTime: "3 min read",
      published: false
    };

    setDraft((prev) => ({
      ...prev,
      blogs: [newBlog, ...prev.blogs]
    }));
    setSelectedBlogId(newBlog.id);
  };

  const handleUpdateBlog = (field: keyof BlogPost, value: any) => {
    if (!selectedBlogId) return;
    setDraft((prev) => ({
      ...prev,
      blogs: prev.blogs.map((b) => 
        b.id === selectedBlogId ? { ...b, [field]: value } : b
      )
    }));
  };

  const deleteBlog = (id: string) => {
    if (selectedBlogId === id) setSelectedBlogId(null);
    setDraft((prev) => ({
      ...prev,
      blogs: prev.blogs.filter((b) => b.id !== id)
    }));
  };

  const handleDeleteBlog = (id: string) => {
    requestConfirm("Delete this blog draft?", () => deleteBlog(id));
  };

  const handleDuplicateBlog = (id: string) => {
    const blog = draft.blogs.find((b) => b.id === id);
    if (!blog) return;
    const copy: BlogPost = {
      ...blog,
      id: `blog-${Date.now()}`,
      title: `${blog.title} Copy`,
      published: false,
      publishedAt: new Date().toISOString().split("T")[0]
    };
    setDraft((prev) => ({
      ...prev,
      blogs: [copy, ...prev.blogs]
    }));
    setSelectedBlogId(copy.id);
    showToast("Blog draft duplicated.", "success");
  };

  // --- Experience / Work History ---
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      role: "Lead Systems Engineer",
      company: "Innovate LLC",
      period: "2025 - Present",
      description: "Spearheaded complex system architectures and UI pipelines."
    };
    setDraft((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }));
  };

  const handleUpdateExperience = (id: string, field: keyof Experience, value: string) => {
    setDraft((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleDeleteExperience = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id)
    }));
  };

  // --- Education History ---
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: "Associate in Product Design",
      institution: "Metropolitan Institute",
      period: "2022 - 2024"
    };
    setDraft((prev) => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: string) => {
    setDraft((prev) => ({
      ...prev,
      education: prev.education.map((edu) => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleDeleteEducation = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id)
    }));
  };

  // ================= GEMINI AI SECURE SERVICE HANDLERS =================
  const triggerGenerateBio = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch("/api/gemini/generate-bio", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-owner-token": sessionStorage.getItem("owner_token") || ""
        },
        body: JSON.stringify({
          name: draft.profile.name,
          title: draft.profile.title,
          skills: draft.profile.skills,
          focusArea: aiFocusArea || "modern high utility design structures"
        })
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      if (resData.bio) {
        handleProfileChange("bio", resData.bio);
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI bio generation failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const triggerRefineProject = async () => {
    if (!activeProject) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch("/api/gemini/refine-project", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-owner-token": sessionStorage.getItem("owner_token") || ""
        },
        body: JSON.stringify({
          title: activeProject.title,
          description: activeProject.description,
          techStack: activeProject.techStack
        })
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      if (resData.refinedShort) {
        handleUpdateProject("description", resData.refinedShort);
      }
      if (resData.refinedLong) {
        handleUpdateProject("longDescription", resData.refinedLong);
      }
      if (resData.suggestedTags && Array.isArray(resData.suggestedTags)) {
        handleUpdateProject("techStack", Array.from(new Set([...activeProject.techStack, ...resData.suggestedTags])));
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI project refiner failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const triggerGenerateBlogContent = async () => {
    if (!activeBlog) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch("/api/gemini/generate-blog", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-owner-token": sessionStorage.getItem("owner_token") || ""
        },
        body: JSON.stringify({
          title: activeBlog.title,
          keywords: aiKeywords,
          targetLength: aiLength,
          tone: aiTone
        })
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      if (resData.content) {
        handleUpdateBlog("content", resData.content);
        // Autocreate snappy excerpt
        const shortExcerpt = resData.content.substring(0, 160).replace(/[#`_*]/g, "") + "...";
        handleUpdateBlog("excerpt", shortExcerpt);
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI blog generation failed.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-[#EBF2FA] min-h-screen pt-4 pb-20 px-4 sm:px-6 lg:px-8 text-stone-700 font-sans tracking-tight">
      {toast && (
        <div
          className={`fixed right-5 top-20 z-50 max-w-sm rounded-2xl border px-4 py-3 text-xs font-bold shadow-neu-out ${
            toast.type === "error"
              ? "bg-red-50 text-red-700 border-red-200"
              : toast.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-white text-stone-700 border-stone-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white bg-[#EBF2FA] p-6 text-center shadow-neu-out">
            <h3 className="text-sm font-black text-stone-850">Confirm Action</h3>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">{confirmAction.message}</p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-white bg-[#EBF2FA] px-4 py-2 text-xs font-bold text-stone-500 shadow-neu-out-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const action = confirmAction.onConfirm;
                  setConfirmAction(null);
                  await action();
                }}
                className="rounded-xl border border-rose-500 bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-neu-out-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Top action header info */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-stone-850 tracking-tight flex items-center gap-2">
            <span className="p-2 bg-stone-900 text-white rounded-xl shadow-neu-out border border-white">
              <Settings className="h-4 w-4 animate-spin" />
            </span>
            <span>Portfolio Editorial Panel</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">Deploy changes directly, refine structures with active server-side Gemini assistants.</p>
          {hasUnsavedChanges && (
            <p className="mt-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600">Unsaved draft changes</p>
          )}
        </div>

        {/* Global Save Controls */}
        <div className="flex items-center gap-3">
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="px-4 py-2.5 rounded-xl bg-[#EBF2FA] shadow-neu-out border border-white text-xs font-semibold text-rose-600 hover:text-rose-700 focus:shadow-neu-in transition-all flex items-center gap-1.5"
              title="Lock editor portal and log out instantly"
              id="btn-cms-signout"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Lock Portal</span>
            </button>
          )}

          <button
            onClick={() => {
              onPreview?.(draft);
              showToast("Previewing current draft without publishing.", "info");
            }}
            className="px-4 py-2.5 rounded-xl bg-[#EBF2FA] shadow-neu-out border border-white text-xs font-semibold text-stone-600 hover:text-teal-700 focus:shadow-neu-in transition-all flex items-center gap-1.5"
            title="Preview current draft without writing to disk"
            id="btn-cms-preview"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview Changes</span>
          </button>

          <button
            onClick={handleResetDb}
            disabled={aiLoading}
            className="px-4 py-2.5 rounded-xl bg-[#EBF2FA] shadow-neu-out border border-white text-xs font-semibold text-stone-500 hover:text-red-700 focus:shadow-neu-in transition-all flex items-center gap-1.5"
            title="Reset to original showcase data"
            id="btn-cms-reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo DB</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={aiLoading}
            className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-neu-out border border-teal-500 hover:bg-teal-700 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
            id="btn-cms-publish"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{aiLoading ? "Publishing..." : "Save & Publish Site"}</span>
          </button>
        </div>
      </div>

      {/* Main CMS Layout Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation panel */}
        <aside className="lg:col-span-3 space-y-2 bg-[#EBF2FA] p-4 rounded-3xl shadow-neu-out border border-white/50 sticky top-24">
          <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400 px-3.5 mb-2 font-semibold">CMS Sections</p>
          
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2.5 border border-white/30 ${
              activeTab === "profile" 
                ? "bg-white text-teal-600 shadow-neu-in" 
                : "text-stone-500 hover:bg-white/40 shadow-neu-out-sm"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Profile Identity</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2.5 border border-white/30 ${
              activeTab === "projects" 
                ? "bg-white text-teal-600 shadow-neu-in" 
                : "text-stone-500 hover:bg-white/40 shadow-neu-out-sm"
            }`}
          >
            <FileCode2 className="h-4 w-4" />
            <span>Manage Creations</span>
          </button>

          <button
            onClick={() => setActiveTab("blogs")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2.5 border border-white/30 ${
              activeTab === "blogs" 
                ? "bg-white text-teal-600 shadow-neu-in" 
                : "text-stone-500 hover:bg-white/40 shadow-neu-out-sm"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Manage Journal</span>
          </button>

          <button
            onClick={() => setActiveTab("photos")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2.5 border border-white/30 ${
              activeTab === "photos" 
                ? "bg-white text-teal-600 shadow-neu-in" 
                : "text-stone-500 hover:bg-white/40 shadow-neu-out-sm"
            }`}
            id="sidemenu-photos-btn"
          >
            <ImageIcon className="h-4 w-4" />
            <span>Image Assets Library</span>
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2.5 border border-white/30 ${
              activeTab === "experience" 
                ? "bg-white text-teal-600 shadow-neu-in" 
                : "text-stone-500 hover:bg-white/40 shadow-neu-out-sm"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Experience Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab("education")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2.5 border border-white/30 ${
              activeTab === "education" 
                ? "bg-white text-teal-600 shadow-neu-in" 
                : "text-stone-500 hover:bg-white/40 shadow-neu-out-sm"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Education Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab("astrology")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2.5 border border-white/30 ${
              activeTab === "astrology" 
                ? "bg-white text-purple-650 shadow-neu-in border-purple-200" 
                : "text-stone-500 hover:bg-white/40 shadow-neu-out-sm"
            }`}
            id="sidemenu-astrology-btn"
          >
            <Settings className="h-4 w-4 text-purple-600 animate-pulse animate-spin" style={{ animationDuration: '6s' }} />
            <span>Astrology Verification</span>
          </button>
        </aside>

        {/* Console Workspace Box */}
        <main className="lg:col-span-9 bg-[#EBF2FA] rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/50" id="cms-editor-workspace">
          
          {/* Response status indicators */}
          {aiError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              ⚠️ {aiError}
            </div>
          )}

          {/* ================= COMPONENT tab: PROFILE ================= */}
          {activeTab === "profile" && (
            <div className="space-y-6" id="cms-tab-profile">
              <h3 className="text-lg font-extrabold text-stone-850 tracking-tight mb-4">Edit Profile Identity</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-400 mb-1.5">Full Professional Name</label>
                  <input
                    type="text"
                    value={draft.profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    className="w-full text-xs px-4 py-3 rounded-xl bg-[#EBF2FA] border border-stone-200 shadow-neu-in focus:outline-none focus:border-teal-400 text-stone-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-400 mb-1.5">Hero Title Headline</label>
                  <input
                    type="text"
                    value={draft.profile.title}
                    onChange={(e) => handleProfileChange("title", e.target.value)}
                    className="w-full text-xs px-4 py-3 rounded-xl bg-[#EBF2FA] border border-stone-200 shadow-neu-in focus:outline-none focus:border-teal-400 text-stone-700 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-white/30 p-4.5 rounded-2xl border border-white/55 shadow-neu-out-sm">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-400 mb-1.5">Avatar Picture URL</label>
                  <input
                    type="text"
                    value={draft.profile.avatarUrl}
                    onChange={(e) => handleProfileChange("avatarUrl", e.target.value)}
                    className="w-full text-xs px-4 py-3 rounded-xl bg-[#EBF2FA] border border-stone-200 shadow-neu-in focus:outline-none focus:border-teal-400 text-stone-700 font-medium"
                    placeholder="example: /uploads/myphoto.jpg or HTTPs URL"
                  />
                </div>
                <NeumorphicImageUploader
                  label="Or upload Avatar Photo"
                  currentValue={draft.profile.avatarUrl}
                  onUploadSuccess={(url) => handleProfileChange("avatarUrl", url)}
                  id="uploader-profile-avatar"
                />
              </div>

              {/* BIO tag with Gemini Helper Box */}
              <div className="p-5 bg-teal-50 border border-teal-100 rounded-2xl shadow-neu-in-sm">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-teal-700">Quick Profile Pitch (Bio)</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="text"
                      placeholder="Focus: highly immersive frontend UI / AI"
                      value={aiFocusArea}
                      onChange={(e) => setAiFocusArea(e.target.value)}
                      className="text-[10px] px-2.5 py-1 bg-white border border-teal-200 rounded-lg text-teal-800 tracking-tight"
                    />
                    <button
                      onClick={triggerGenerateBio}
                      disabled={aiLoading}
                      className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                    >
                      <Wand2 className="h-3 w-3" />
                      <span>{aiLoading ? "Polishing..." : "AI Suggest tagline"}</span>
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={draft.profile.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                  className="w-full text-xs px-4 py-3 rounded-xl bg-white border border-teal-200 focus:outline-none focus:border-teal-500 text-stone-700 leading-relaxed"
                  placeholder="Enter a snappy tagline bio summary..."
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-400 mb-1.5">Full Depth Bio text (Who Am I?)</label>
                <textarea
                  rows={4}
                  value={draft.profile.aboutText}
                  onChange={(e) => handleProfileChange("aboutText", e.target.value)}
                  className="w-full text-xs px-4 py-3 rounded-xl bg-[#EBF2FA] border border-stone-200 shadow-neu-in focus:outline-none focus:border-teal-400 text-stone-700 leading-relaxed"
                />
              </div>

              {/* Skills Comma Separated */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-400 mb-1.5">Primary Core Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={draft.profile.skills.join(", ")}
                  onChange={(e) => handleProfileChange("skills", e.target.value.split(",").map(s => s.trim()))}
                  className="w-full text-xs px-4 py-3 rounded-xl bg-[#EBF2FA] border border-stone-200 shadow-neu-in focus:outline-none focus:border-teal-400 text-stone-700 font-semibold"
                />
              </div>

              {/* Social Channels Context */}
              <div className="border-t border-stone-200/50 pt-5 space-y-4">
                <h4 className="text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-3">Linked Social Accounts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1">GitHub Address</label>
                    <input
                      type="text"
                      value={draft.profile.socialLinks.github || ""}
                      onChange={(e) => handleSocialChange("github", e.target.value)}
                      className="w-full text-xs px-4.5 py-2.5 rounded-lg bg-[#EBF2FA] border border-stone-200 shadow-neu-in text-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1">LinkedIn Account</label>
                    <input
                      type="text"
                      value={draft.profile.socialLinks.linkedin || ""}
                      onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                      className="w-full text-xs px-4.5 py-2.5 rounded-lg bg-[#EBF2FA] border border-stone-200 shadow-neu-in text-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1">Twitter Handle</label>
                    <input
                      type="text"
                      value={draft.profile.socialLinks.twitter || ""}
                      onChange={(e) => handleSocialChange("twitter", e.target.value)}
                      className="w-full text-xs px-4.5 py-2.5 rounded-lg bg-[#EBF2FA] border border-stone-200 shadow-neu-in text-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1">Email Address</label>
                    <input
                      type="text"
                      value={draft.profile.socialLinks.email || ""}
                      onChange={(e) => handleSocialChange("email", e.target.value)}
                      className="w-full text-xs px-4.5 py-2.5 rounded-lg bg-[#EBF2FA] border border-stone-200 shadow-neu-in text-stone-700"
                    />
                  </div>
                </div>
              </div>

              {/* Site-wide SEO Metadata section */}
              <div className="border-t border-stone-200/50 pt-5 space-y-4" id="profile-seo-metadata-sect">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">Site-Wide SEO Metadata</h4>
                    <p className="text-[10px] text-stone-400 mt-0.5">Customize description, search engine tags, and viewport browser title tags.</p>
                  </div>
                  <span className="self-start sm:self-auto px-2 py-0.5 text-[9px] font-bold font-mono tracking-wider bg-teal-100 text-teal-800 rounded-md border border-teal-200">
                    Auto-Applied on Sync
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 bg-white/40 p-5 rounded-2xl border border-white/60 shadow-neu-out-sm">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold">
                        Meta Browser Title Tag
                      </label>
                      <span className="text-[9px] font-mono text-stone-400">
                        {(draft.profile.seo?.metaTitle || "").length} / 60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={draft.profile.seo?.metaTitle || ""}
                      onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
                      placeholder="e.g. Akash Prasad Barai | Developer & UI Craftsman"
                      className="w-full text-xs px-4 py-3 rounded-xl bg-[#EBF2FA] border border-stone-200 shadow-neu-in focus:outline-none focus:border-teal-400 text-stone-750 font-medium"
                      id="seo-meta-title-input"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold">
                        Meta Description (Search Snippet)
                      </label>
                      <span className="text-[9px] font-mono text-stone-400">
                        {(draft.profile.seo?.metaDescription || "").length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={draft.profile.seo?.metaDescription || ""}
                      onChange={(e) => handleSeoChange("metaDescription", e.target.value)}
                      placeholder="A short descriptive paragraph indexing your specialty and stack for Google, Bing, DuckDuckGo etc."
                      className="w-full text-xs px-4 py-3 rounded-xl bg-[#EBF2FA] border border-stone-200 shadow-neu-in focus:outline-none focus:border-teal-400 text-stone-750 font-medium leading-relaxed"
                      id="seo-meta-description-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold mb-1">
                      Meta Keywords (Separated with commas)
                    </label>
                    <input
                      type="text"
                      value={draft.profile.seo?.metaKeywords || ""}
                      onChange={(e) => handleSeoChange("metaKeywords", e.target.value)}
                      placeholder="React, CSS, full-stack, Swiss layout, web dev, resume"
                      className="w-full text-xs px-4 py-3 rounded-xl bg-[#EBF2FA] border border-stone-200 shadow-neu-in focus:outline-none focus:border-teal-400 text-stone-750 font-medium"
                      id="seo-meta-keywords-input"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= COMPONENT tab: PHOTOS LIBRARY ================= */}
          {activeTab === "photos" && (
            <div className="space-y-6" id="cms-tab-photos">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <h3 className="text-lg font-extrabold text-stone-850 tracking-tight">Disk Media & Photo Assets</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Manage local physical image assets on port 3000. Upload any custom photos here for creations or articles.</p>
                </div>
              </div>

              {/* Main Uploader widget inside Library */}
              <div className="bg-white/40 p-6 rounded-2xl border border-white/60 shadow-neu-out-sm mb-6">
                <NeumorphicImageUploader
                  label="Upload New Photo Asset to disk server"
                  currentValue=""
                  onUploadSuccess={(url) => {
                    fetchPhotosLibrary();
                  }}
                  id="library-main-uploader"
                />
              </div>

              {/* Image Grid with copying capabilities */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-400">Disk Assets Gallery ({uploadedPhotos.length} Images)</h4>
                
                {uploadedPhotos.length === 0 ? (
                  <div className="text-center py-12 bg-white/20 border border-dashed border-stone-300 rounded-3xl shadow-neu-in p-6">
                    <ImageIcon className="h-9 w-9 text-stone-300 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs font-semibold text-stone-500">Your localized photo assets library is currently empty.</p>
                    <p className="text-[10px] text-stone-400 mt-1">Upload visual files above (images, icons, mockups) to instantiate server file addresses.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="cms-photo-library-grid">
                    {uploadedPhotos.map((url) => {
                      const filename = url.replace("/uploads/", "");
                      const isCopied = copiedUrl === url;
                      return (
                        <div 
                          key={url} 
                          className="group relative rounded-2xl bg-[#EBF2FA] shadow-neu-out border border-white/60 overflow-hidden aspect-square flex flex-col p-2.5 transition-all hover:scale-[1.01]"
                        >
                          <div className="w-full h-[65%] rounded-xl bg-stone-100 overflow-hidden border border-white/70 relative flex items-center justify-center">
                            <img 
                              src={url} 
                              alt={filename} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            {isCopied && (
                              <div className="absolute inset-0 bg-teal-600/90 backdrop-blur-xs flex flex-col items-center justify-center text-white px-1.5 text-center animate-in fade-in duration-200">
                                <CheckCheck className="h-4 w-4 mb-1 text-emerald-300" />
                                <span className="text-[9px] font-mono uppercase font-bold tracking-widest leading-none">Path Copied!</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-2 text-left flex flex-col justify-between flex-1 min-w-0">
                            <p 
                              className="text-[9px] font-mono text-stone-400 truncate max-w-full font-bold select-all" 
                              title={filename}
                            >
                              {filename}
                            </p>

                            <div className="flex items-center gap-1 mt-1 shrink-0 font-sans">
                              <button
                                onClick={() => {
                                  handleProfileChange("avatarUrl", url);
                                  showToast(`Buffered ${filename} as your draft avatar. Save to publish it.`, "success");
                                }}
                                className="p-1 px-1.5 text-[8px] font-extrabold uppercase font-mono tracking-wider bg-teal-50 text-teal-700 hover:bg-teal-100 rounded border border-teal-200/60 transition"
                                title="Set as Profile Avatar image in draft"
                              >
                                Set Avatar
                              </button>

                              <button
                                onClick={() => handleCopyClipboard(url)}
                                className="p-1 text-stone-500 hover:text-stone-900 bg-white shadow-neu-out-sm border border-white/85 rounded transition hover:shadow-neu-in ml-auto"
                                title="Copy asset path code"
                              >
                                {isCopied ? (
                                  <CheckCheck className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>

                              <button
                                onClick={() => handleDeletePhoto(url)}
                                className="p-1 text-stone-400 hover:text-rose-600 bg-white shadow-neu-out-sm border border-white/85 rounded transition hover:shadow-neu-in"
                                title="Erase image permanently from port 3000 disk"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= COMPONENT tab: PROJECTS ================= */}
          {activeTab === "projects" && (
            <div className="space-y-6" id="cms-tab-projects">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-extrabold text-stone-850 tracking-tight">Manage Architectural Creations</h3>
                <button
                  onClick={handleCreateProject}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-neu-out border border-teal-500 transition-all flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4 text-teal-100" />
                  <span>Create Creation</span>
                </button>
              </div>

              {/* Horizontal List Selector of Draft Items */}
              <div className="flex flex-wrap gap-2.5 mb-5 overflow-x-auto pb-2">
                {draft.projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-between gap-5 border border-white/45 ${
                      selectedProjectId === proj.id
                        ? "bg-stone-900 text-white shadow-neu-in"
                        : "bg-[#EBF2FA] text-stone-600 shadow-neu-out-sm hover:text-stone-900"
                    }`}
                  >
                    <span>{proj.title}</span>
                    <span className="flex items-center gap-2">
                      <Copy
                        className="h-3.5 w-3.5 text-stone-400 hover:text-teal-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateProject(proj.id);
                        }}
                      />
                      <Trash2 
                        className="h-3.5 w-3.5 text-stone-400 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(proj.id);
                        }}
                      />
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Project Details Editor Frame */}
              {activeProject ? (
                <div className="space-y-5 p-5 bg-stone-50 rounded-2xl border border-stone-250/20 shadow-neu-in">
                  
                  <div className="flex justify-between items-center pb-3 border-b border-stone-200/50">
                    <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-stone-400">Editing Artifact: <span className="text-stone-700 font-bold font-sans normal-case">{activeProject.title}</span></h4>
                    
                    {/* Gemini integration refinement action */}
                    <button
                      onClick={triggerRefineProject}
                      disabled={aiLoading}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold font-mono tracking-wider hover:bg-teal-100 flex items-center gap-1.5"
                      title="Refine formatting, wording and SEO suggested tags automatically"
                    >
                      <Sparkles className="h-3 w-3 text-teal-600 animate-pulse" />
                      <span>{aiLoading ? "Polishing details..." : "Gemini Refine Details"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Artifact Title</label>
                      <input
                        type="text"
                        value={activeProject.title}
                        onChange={(e) => handleUpdateProject("title", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-750 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Category Class</label>
                      <input
                        type="text"
                        value={activeProject.category}
                        onChange={(e) => handleUpdateProject("category", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Image Cover URL</label>
                        <input
                          type="text"
                          value={activeProject.imageUrl}
                          onChange={(e) => handleUpdateProject("imageUrl", e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700"
                        />
                      </div>
                      <NeumorphicImageUploader
                        label="Or upload Project Cover Photo"
                        currentValue={activeProject.imageUrl}
                        onUploadSuccess={(url) => handleUpdateProject("imageUrl", url)}
                        id={`uploader-project-${activeProject.id}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Tech stack tags (Comma Separated)</label>
                      <input
                        type="text"
                        value={activeProject.techStack.join(", ")}
                        onChange={(e) => handleUpdateProject("techStack", e.target.value.split(",").map(t => t.trim()))}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 font-semibold mb-3.5"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Launch Live Demo URL</label>
                    <input
                      type="text"
                      value={activeProject.liveUrl || ""}
                      onChange={(e) => handleUpdateProject("liveUrl", e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Snappy Short hook description (Raw text)</label>
                    <textarea
                      rows={2}
                      value={activeProject.description}
                      onChange={(e) => handleUpdateProject("description", e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-750"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Detailed Architectural challenges (autofilled by Gemini refiner)</label>
                    <textarea
                      rows={4}
                      value={activeProject.longDescription || ""}
                      onChange={(e) => handleUpdateProject("longDescription", e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="proj-featured"
                      checked={activeProject.featured}
                      onChange={(e) => handleUpdateProject("featured", e.target.checked)}
                      className="h-4 w-4 text-teal-600 rounded bg-[#EBF2FA] focus:ring-0"
                    />
                    <label htmlFor="proj-featured" className="text-xs text-stone-500 font-semibold">Mark as spotlight project on public view</label>
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 rounded-2xl bg-stone-100/30 border border-dashed border-stone-250 p-6 shadow-neu-in">
                  <FileCode2 className="h-8 w-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-400">Select an existing creation tab or click "Create Creation" above to initiate architectural outlines.</p>
                </div>
              )}

            </div>
          )}

          {/* ================= COMPONENT tab: BLOG SUITE ================= */}
          {activeTab === "blogs" && (
            <div className="space-y-6" id="cms-tab-blogs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-extrabold text-stone-850 tracking-tight">Editorial Journal Suite</h3>
                <button
                  onClick={handleCreateBlog}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-neu-out border border-teal-500 transition-all flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4 text-teal-100" />
                  <span>Write Blog draft</span>
                </button>
              </div>

              {/* Horizontal List Selector of Draft Items */}
              <div className="flex flex-wrap gap-2.5 mb-5 overflow-x-auto pb-2">
                {draft.blogs.map((blog) => (
                  <button
                    key={blog.id}
                    onClick={() => setSelectedBlogId(blog.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-between gap-5 border border-white/45 ${
                      selectedBlogId === blog.id
                        ? "bg-stone-900 text-white shadow-neu-in"
                        : "bg-[#EBF2FA] text-stone-600 shadow-neu-out-sm hover:text-stone-900"
                    }`}
                  >
                    <span>{blog.title}</span>
                    <span className="flex items-center gap-2">
                      <Copy
                        className="h-3.5 w-3.5 text-stone-400 hover:text-teal-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateBlog(blog.id);
                        }}
                      />
                      <Trash2 
                        className="h-3.5 w-3.5 text-stone-400 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlog(blog.id);
                        }}
                      />
                    </span>
                  </button>
                ))}
              </div>

              {/* Active blog details editor frame */}
              {activeBlog ? (
                <div className="space-y-5 p-5 bg-stone-50 rounded-2xl border border-stone-250/20 shadow-neu-in">
                  
                  {/* AI secure Blog writing proxy block */}
                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-150 shadow-neu-in-sm space-y-3.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-teal-700 font-mono tracking-wider uppercase">
                      <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
                      <span>Gemini Server-Side Copywriter</span>
                    </span>
                    <p className="text-[11px] text-teal-600">Provide focal keywords, length, and tone settings. Gemini will automatically write a compelling markdown article draft inside your text block.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase font-mono tracking-wider text-teal-600 font-bold">Focal Keywords</label>
                        <input
                          type="text"
                          placeholder="e.g. backend proxy, typescript"
                          value={aiKeywords}
                          onChange={(e) => setAiKeywords(e.target.value)}
                          className="w-full text-[11px] px-2.5 py-1.5 bg-white border border-teal-200 rounded-lg text-teal-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono tracking-wider text-teal-600 font-bold">Editorial Tone</label>
                        <select
                          value={aiTone}
                          onChange={(e) => setAiTone(e.target.value)}
                          className="w-full text-[11px] px-2 py-1.5 bg-white border border-teal-200 rounded-lg text-teal-800"
                        >
                          <option value="Professional & architectural">Technical & Deep</option>
                          <option value="Poetic & descriptive">Poetic & Aesthetic</option>
                          <option value="Snappy & conversational">Conversational & Clear</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono tracking-wider text-teal-600 font-bold">Length (Words)</label>
                        <input
                          type="number"
                          value={aiLength}
                          onChange={(e) => setAiLength(e.target.value)}
                          className="w-full text-[11px] px-2.5 py-1.5 bg-white border border-teal-200 rounded-lg text-teal-800"
                        />
                      </div>
                    </div>

                    <button
                      onClick={triggerGenerateBlogContent}
                      disabled={aiLoading}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Wand2 className="h-3.5 w-3.5" />
                      <span>{aiLoading ? "Constructing article blueprint..." : "Generate Markdown Blog Draft"}</span>
                    </button>
                  </div>

                  {/* Manual input controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Article Title</label>
                      <input
                        type="text"
                        value={activeBlog.title}
                        onChange={(e) => handleUpdateBlog("title", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-750 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Read time estimation (e.g. 5 min read)</label>
                      <input
                        type="text"
                        value={activeBlog.readTime}
                        onChange={(e) => handleUpdateBlog("readTime", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Cover Image URL</label>
                        <input
                          type="text"
                          value={activeBlog.imageUrl}
                          onChange={(e) => handleUpdateBlog("imageUrl", e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700"
                        />
                      </div>
                      <NeumorphicImageUploader
                        label="Or upload Cover Photo"
                        currentValue={activeBlog.imageUrl}
                        onUploadSuccess={(url) => handleUpdateBlog("imageUrl", url)}
                        id={`uploader-blog-${activeBlog.id}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Subject Tags (Comma Separated)</label>
                      <input
                        type="text"
                        value={activeBlog.tags.join(", ")}
                        onChange={(e) => handleUpdateBlog("tags", e.target.value.split(",").map(t => t.trim()))}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 font-semibold mb-3.5"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Short Excerpt synopsis text</label>
                    <textarea
                      rows={2}
                      value={activeBlog.excerpt}
                      onChange={(e) => handleUpdateBlog("excerpt", e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5 font-bold text-teal-700">Body Article markdown source code (Supporting standard Headings & lists)</label>
                    <textarea
                      rows={8}
                      value={activeBlog.content}
                      onChange={(e) => handleUpdateBlog("content", e.target.value)}
                      className="w-full font-mono text-[11px] px-3.5 py-3 rounded-xl bg-stone-900 text-teal-200 border border-stone-850"
                    />
                  </div>

                  <div className="rounded-2xl border border-stone-200/60 bg-white/60 p-4 shadow-neu-in">
                    <p className="mb-3 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">Markdown Preview</p>
                    <div className="max-h-56 overflow-y-auto space-y-3 text-xs leading-relaxed text-stone-600">
                      {activeBlog.content.split("\n\n").slice(0, 10).map((block, idx) => {
                        const trimmed = block.trim();
                        if (!trimmed) return null;
                        if (trimmed.startsWith("##")) {
                          return <h4 key={idx} className="text-sm font-black text-stone-850">{trimmed.replace(/^#+/, "").trim()}</h4>;
                        }
                        if (trimmed.startsWith("-")) {
                          return (
                            <ul key={idx} className="list-disc pl-5">
                              {trimmed.split("\n").map((item, itemIdx) => (
                                <li key={itemIdx}>{item.replace(/^-/, "").trim()}</li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={idx}>{trimmed.replace(/[*_`]/g, "")}</p>;
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="blog-published"
                      checked={activeBlog.published}
                      onChange={(e) => handleUpdateBlog("published", e.target.checked)}
                      className="h-4 w-4 text-teal-600 rounded bg-[#EBF2FA] focus:ring-0"
                    />
                    <label htmlFor="blog-published" className="text-xs text-stone-500 font-semibold">Publish this article draft to public reading layout</label>
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 rounded-2xl bg-stone-100/30 border border-dashed border-stone-250 p-6 shadow-neu-in">
                  <FileText className="h-8 w-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-400">Select an existing draft tab or click "Write Blog draft" above to generate technical outlines securely.</p>
                </div>
              )}

            </div>
          )}

          {/* ================= COMPONENT tab: EXPERIENCE ================= */}
          {activeTab === "experience" && (
            <div className="space-y-6" id="cms-tab-experience">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-extrabold text-stone-850 tracking-tight">Work Experience Timeline</h3>
                <button
                  onClick={handleAddExperience}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-neu-out border border-teal-500 transition-all flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4 text-teal-100" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-5">
                {draft.experiences.map((exp) => (
                  <div key={exp.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200/50 shadow-neu-in space-y-4 relative">
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="absolute top-4 right-4 p-2 bg-[#EBF2FA] text-stone-400 hover:text-red-650 rounded-xl shadow-neu-out hover:shadow-neu-in transition-all"
                      title="Remove experience block"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Role Designation</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-stone-200 text-stone-750 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Company Affilation</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-stone-200 text-stone-700 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Time Period (e.g. 2025 - Present)</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => handleUpdateExperience(exp.id, "period", e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-stone-200 text-stone-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5 font-bold">Key contributions & achievements</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= COMPONENT tab: EDUCATION ================= */}
          {activeTab === "education" && (
            <div className="space-y-6" id="cms-tab-education">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-extrabold text-stone-850 tracking-tight">Academic History Timeline</h3>
                <button
                  onClick={handleAddEducation}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-neu-out border border-teal-500 transition-all flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4 text-teal-100" />
                  <span>Add Degree Block</span>
                </button>
              </div>

              <div className="space-y-5">
                {draft.education.map((edu) => (
                  <div key={edu.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200/50 shadow-neu-in space-y-4 relative">
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="absolute top-4 right-4 p-2 bg-[#EBF2FA] text-stone-400 hover:text-red-650 rounded-xl shadow-neu-out hover:shadow-neu-in transition-all"
                      title="Remove academic block"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Degree Honors title</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-stone-200 text-stone-750 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Alma Mater institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(edu.id, "institution", e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-stone-200 text-stone-700 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-0.5">Academic Years (e.g. 2021 - 2025)</label>
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => handleUpdateEducation(edu.id, "period", e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-stone-200 text-stone-750"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= COMPONENT tab: ASTROLOGY VERIFICATION ================= */}
          {activeTab === "astrology" && (
            <div className="space-y-6 animate-in fade-in duration-200" id="cms-tab-astrology">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="text-lg font-black text-stone-850 tracking-tight">Vedic Astrology Ledger & Seeker Verification</h3>
                  <p className="text-xs text-stone-400 mt-1">Review astrological birth configurations, verify registered users, and audit active consultations.</p>
                </div>
                <button
                  type="button"
                  onClick={fetchAstrologyUsers}
                  disabled={loadingAstroUsers}
                  className="px-4 py-2 bg-[#EBF2FA] shadow-neu-out border border-white rounded-xl text-xs font-bold text-stone-600 hover:text-purple-650 transition cursor-pointer"
                >
                  {loadingAstroUsers ? "Resyncing Ledger..." : "Resync Ledger"}
                </button>
              </div>

              {/* Status Stats Summary Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white/40 p-5 rounded-2xl border border-white/50 shadow-neu-out text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Total Registered</span>
                  <p className="text-3xl font-black text-stone-800 mt-1">{astrologyUsers.length}</p>
                </div>
                <div className="bg-white/40 p-5 rounded-2xl border border-white/50 shadow-neu-out text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Pending Verification</span>
                  <p className="text-3xl font-black text-amber-600 mt-1">
                    {astrologyUsers.filter((u) => !u.isVerified).length}
                  </p>
                </div>
                <div className="bg-white/40 p-5 rounded-2xl border border-white/50 shadow-neu-out text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Verified Seekers</span>
                  <p className="text-3xl font-black text-emerald-600 mt-1">
                    {astrologyUsers.filter((u) => u.isVerified).length}
                  </p>
                </div>
              </div>

              {/* Seeker Grid details */}
              {astrologyUsers.length === 0 ? (
                <div className="text-center py-16 rounded-2xl bg-stone-50 border border-stone-200/50 shadow-neu-in">
                  <p className="text-stone-400 text-xs font-semibold">No astrology profiles registered on the server yet.</p>
                  <p className="text-[10px] text-stone-400 mt-1">When users sign up via the Service portal, they will list here for vetting.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {astrologyUsers.map((user) => (
                    <div key={user.id} className="bg-white/55 p-5 rounded-2xl border border-white/60 shadow-neu-out relative space-y-4">
                      
                      {/* Flex core item metrics */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-sm font-black text-stone-850">{user.name}</h4>
                            {user.isVerified ? (
                              <span className="px-2 py-0.5 text-[8px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded">
                                Verified Active Seeker
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[8px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded animate-pulse">
                                Awaiting Owner Verification
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-mono text-stone-400 mt-1">Registered Seeker ID: {user.id}</p>
                        </div>

                        {/* Top-right action triggers */}
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleVerifyAstroUser(user.id, user.isVerified)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-semibold min-w-28 transition ${
                              user.isVerified
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-emerald-650 hover:bg-emerald-700 text-white border border-emerald-600 shadow-md"
                            }`}
                          >
                            {user.isVerified ? "Revoke Access" : "Verify & Activate"}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleDeleteAstroUser(user.id)}
                            className="p-2 bg-[#EBF2FA] text-stone-400 hover:text-rose-600 rounded-xl shadow-neu-out border border-white hover:shadow-neu-in transition"
                            title="Delete astrology account completely"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Alignments table */}
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5 bg-stone-50 p-4.5 rounded-xl border border-stone-200/50 text-[10px] font-mono">
                        <div>
                          <span className="text-stone-400 block uppercase font-bold text-[8px] mb-0.5">Birth Date (AD)</span>
                          <span className="text-stone-800 font-semibold">{user.birthdateAd || user.birthdate || "-"}</span>
                        </div>
                        <div>
                          <span className="text-purple-600 block uppercase font-bold text-[8px] mb-0.5">Birth Date (BS)</span>
                          <span className="text-purple-750 font-bold">{user.birthdateBs || "Synced auto"}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block uppercase font-bold text-[8px] mb-0.5">Birth Time</span>
                          <span className="text-stone-800 font-semibold">{user.birthtime}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-stone-400 block uppercase font-bold text-[8px] mb-0.5">Birth Place</span>
                          <span className="text-stone-800 font-semibold break-word">{user.birthplace}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block uppercase font-bold text-[8px] mb-0.5">Lunar Rasi</span>
                          <span className="text-purple-650 font-bold">{user.rasi}</span>
                        </div>
                      </div>

                      {/* Nesting Consultations audit list */}
                      <div className="pt-2">
                        <span className="text-[10px] font-mono font-bold text-stone-400 pr-1.5 uppercase block mb-2">
                          Active Consultations Audit ({user.consultations?.length || 0})
                        </span>

                        {(!user.consultations || user.consultations.length === 0) ? (
                          <p className="text-[10px] italic text-stone-400 pl-2">This seeker has not initiated any consultations yet.</p>
                        ) : (
                          <div className="space-y-3 pl-2.5 border-l-2 border-stone-250">
                            {user.consultations.map((cons: any, idx: number) => (
                              <div key={cons.id} className="bg-stone-50/40 p-3 rounded-xl border border-stone-200/30 text-[11px] leading-relaxed relative">
                                <span className="font-mono text-[8px] uppercase tracking-wider text-purple-600 block mb-1 font-bold">Inquiry #{idx + 1} - Audit Scribe</span>
                                <p className="font-semibold text-stone-800 leading-snug">Q: "{cons.question}"</p>
                                <div className="mt-2 text-stone-500 whitespace-pre-line text-justify pl-3 border-l border-stone-300">
                                  {cons.answer.substring(0, 180)}...
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
