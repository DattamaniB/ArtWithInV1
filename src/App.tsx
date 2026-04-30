import React, { useMemo, useState, useEffect, useRef, ReactNode } from "react";
import {
  Home,
  Search,
  MessageSquare,
  Bell,
  LayoutDashboard,
  User,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Send,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  CircleDollarSign,
  CheckCircle2,
  MoreVertical,
  Filter,
  Users,
  Camera,
  Film,
  Circle,
  MapPin,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  paper: "#F4F1EA",
  ink: "#111111",
  inkMid: "#444444",
  inkFaint: "#888888",
  rule: "#C8C0B0",
  accent: "#B5342A",
  accentBg: "rgba(181,52,42,0.06)",
  surface: "#FDFBF7",
  white: "#FFFFFF",
  success: "#2a7a4b",
  border: "rgba(0, 0, 0, 0.15)",
  line: "rgba(0, 0, 0, 0.1)",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{height:100%;}
  body{background:${C.paper};color:${C.ink};font-family:'Spectral', serif; -webkit-font-smoothing: antialiased;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:${C.paper};}
  ::-webkit-scrollbar-thumb{background:${C.rule};}
  input,textarea,select,button{font-family:'Spectral', serif;}
  input:focus,textarea:focus,select:focus{outline:none;}
  .byline{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:${C.inkFaint};font-weight: 500;}
  .headline-xl{font-family:'Bodoni Moda',serif;font-weight:700;font-size:clamp(32px,5vw,60px);line-height:1.05;}
  .headline-lg{font-family:'Bodoni Moda',serif;font-weight:600;font-size:clamp(24px,3.5vw,40px);line-height:1.1;}
  .headline-md{font-family:'Bodoni Moda',serif;font-weight:600;font-size:24px;line-height:1.2;}
  .headline-sm{font-family:'Bodoni Moda',serif;font-weight:600;font-size:18px;line-height:1.3;}
  .body-copy{font-family:'Spectral', serif; font-size:17px;line-height:1.6;color:${C.inkMid};}
  .italic-serif{font-family:'Spectral',serif;font-style:italic;}
  .mono{font-family:'JetBrains Mono',monospace;font-size:11px;}
  .section-tag{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:${C.white};background:${C.ink};padding:2px 8px;display:inline-block;}
  .section-tag-red{background:${C.accent};}
  .drop-cap::first-letter{font-family:'Bodoni Moda',serif;font-size:3.6em;font-weight:700;line-height:0.75;float:left;margin:4px 6px 0 0;color:${C.ink};}
  .pull-quote{font-family:'Bodoni Moda',serif;font-style:italic;font-size:22px;line-height:1.4;border-top:2px solid ${C.ink};border-bottom:2px solid ${C.ink};padding:12px 0;margin:14px 0;color:${C.ink};}
  .nav-btn{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:8px 18px;background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;color:${C.inkMid};transition:color .15s; font-weight: 500;}
  .nav-btn:hover{color:${C.ink};}
  .nav-btn.active{color:${C.accent};border-bottom:2px solid ${C.accent};font-weight:700;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);}}
  .fade-in{animation:fadeIn .3s ease forwards;}
  .paper-grain{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E");}
  
  .hoarding-frame {
    border: 1px solid ${C.ink};
    padding: 4px;
    background: ${C.paper};
    position: relative;
  }
  .hoarding-inner {
    border: 4px double ${C.ink};
    padding: 2px;
    background: ${C.ink};
    overflow: hidden;
  }
  .hoarding-cap {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    background: ${C.ink};
    color: ${C.paper};
    padding: 4px 8px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    display: inline-block;
    margin-top: -1px;
    font-weight: 500;
  }
  .media-glow {
    filter: sepia(0.2) contrast(1.1);
  }
`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface User {
  _id: string;
  name: string;
  role: string;
  email: string;
  bio?: string;
  quote?: string;
  location?: string;
  skills?: string[];
  rate?: string;
  followers?: number;
  projects?: number;
  profilePic?: string;
  following?: string[];
  portfolio?: PortfolioItem[];
}
interface Post {
  _id: string;
  creatorId: string;
  name: string;
  role: string;
  text: string;
  likes: number;
  comments: number;
  cat: string;
  time: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}
interface Creator {
  _id: string;
  name: string;
  role: string;
  skills: string[];
  bio: string;
  quote?: string;
  location?: string;
  followers: number;
  projects: number;
  rate: string;
  profilePic?: string;
  following?: string[];
  portfolio?: PortfolioItem[];
}
interface PortfolioItem {
  id: string;
  title: string;
  type: string;
  url: string;
}
interface Convo {
  _id: string;
  name: string;
  unread: number;
  msgs: { from: string; text: string }[];
}
interface Notif {
  _id: string;
  type: string;
  icon: string | ReactNode;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  actionable: boolean;
  responded: string | null;
  linkId?: string;
  linkType?: "profile" | "message" | "post";
}

// ── Fallback Data ─────────────────────────────────────────────────────────────
const FB_CREATORS: Creator[] = [
  {
    _id: "1",
    name: "Aarav Shah",
    role: "Video Editor",
    skills: ["Premiere Pro", "DaVinci", "Color Grading"],
    bio: "Cinematic storyteller crafting luxury brand narratives with an eye for the extraordinary. Specializing in high-contrast editorial edits.",
    followers: 1240,
    projects: 38,
    rate: "₹3,500/hr",
  },
  {
    _id: "2",
    name: "Meera Iyer",
    role: "Graphic Designer",
    skills: ["Photoshop", "Figma", "Illustrator"],
    bio: "Bold identities for bold brands. Known for minimal black & white editorial aesthetics and grid-perfect layout architecture.",
    followers: 890,
    projects: 54,
    rate: "₹2,800/hr",
  },
  {
    _id: "3",
    name: "Kabir Mehta",
    role: "Photographer",
    skills: ["Lightroom", "Portraits", "Fashion"],
    bio: "Neon-lit fashion campaigns and editorial portraits — shooting the future of streetwear with analog soul.",
    followers: 2100,
    projects: 71,
    rate: "₹4,200/hr",
  },
];
const FB_POSTS: Post[] = [
  {
    _id: "p1",
    creatorId: "1",
    name: "Aarav Shah",
    role: "Video Editor",
    text: "Finished editing a luxury brand reel with cinematic transitions and moody color grading. Client approved on the first draft — a rare triumph in the industry.",
    likes: 120,
    comments: 18,
    cat: "Video",
    time: "2h",
    mediaUrl:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
    mediaType: "image",
  },
  {
    _id: "p2",
    creatorId: "2",
    name: "Meera Iyer",
    role: "Graphic Designer",
    text: "Created a bold new logo for a startup coffee brand with a minimal black and red theme. The work ships next week after months in the drafting room.",
    likes: 85,
    comments: 11,
    cat: "Design",
    time: "5h",
    mediaUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    mediaType: "image",
  },
  {
    _id: "p3",
    creatorId: "3",
    name: "Kabir Mehta",
    role: "Photographer",
    text: "Shot a neon-themed fashion portrait series for a streetwear campaign. 48 final selects delivered to the art director this morning.",
    likes: 230,
    comments: 34,
    cat: "Photo",
    time: "1d",
    mediaUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200",
    mediaType: "image",
  },
];

// ── API ───────────────────────────────────────────────────────────────────────
const API_BASE = "/api";
const tok = () => localStorage.getItem("token") || "";
const ah = (): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${tok()}`,
});

const fetchJSON = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("Failed to parse JSON:", text);
  }
  if (!res.ok)
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  return data;
};

const api = {
  login: (d: object) =>
    fetchJSON(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
    }),
  register: (d: object) =>
    fetchJSON(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
    }),
  getMe: () => fetchJSON(`${API_BASE}/users/me`, { headers: ah() }),

  getPosts: (q?: string) =>
    fetchJSON(q ? `${API_BASE}/search?q=${q}` : `${API_BASE}/posts`).then(
      (d) => (q ? d.posts : d),
    ),
  getFollowingPosts: () =>
    fetchJSON(`${API_BASE}/posts/following`, { headers: ah() }),
  createPost: (data: object) =>
    fetchJSON(`${API_BASE}/posts`, {
      method: "POST",
      headers: ah(),
      body: JSON.stringify(data),
    }),
  likePost: (id: string) =>
    fetchJSON(`${API_BASE}/posts/${id}/like`, { method: "PUT", headers: ah() }),

  getUsers: (q?: string) =>
    fetchJSON(q ? `${API_BASE}/search?q=${q}` : `${API_BASE}/users`).then(
      (d) => (q ? d.users : d),
    ),
  getUser: (id: string) =>
    fetchJSON(`${API_BASE}/users/${id}`, { headers: ah() }),
  followUser: (id: string) =>
    fetchJSON(`${API_BASE}/users/${id}/follow`, {
      method: "POST",
      headers: ah(),
    }),

  getConvos: () =>
    fetchJSON(`${API_BASE}/messages/conversations`, { headers: ah() }),
  sendMessage: (data: object) =>
    fetchJSON(`${API_BASE}/messages`, {
      method: "POST",
      headers: ah(),
      body: JSON.stringify(data),
    }),
  startConversation: (partnerId: string) =>
    fetchJSON(`${API_BASE}/messages/start`, {
      method: "POST",
      headers: ah(),
      body: JSON.stringify({ partnerId }),
    }),

  getNotifs: () => fetchJSON(`${API_BASE}/notifications`, { headers: ah() }),
  markAllRead: () =>
    fetchJSON(`${API_BASE}/notifications/read-all`, {
      method: "PUT",
      headers: ah(),
    }),
  respondNotif: (id: string, response: string) =>
    fetchJSON(`${API_BASE}/notifications/${id}/respond`, {
      method: "PUT",
      headers: ah(),
      body: JSON.stringify({ response }),
    }),
  hireUser: (id: string) =>
    fetchJSON(`${API_BASE}/users/${id}/hire`, {
      method: "POST",
      headers: ah(),
    }),
  updateMe: (data: object) =>
    fetchJSON(`${API_BASE}/users/me`, {
      method: "PUT",
      headers: ah(),
      body: JSON.stringify(data),
    }),
  getDashboardStats: () =>
    fetchJSON(`${API_BASE}/dashboard/stats`, { headers: ah() }),
};

// ── Reusable Components ───────────────────────────────────────────────────────
const HR = ({
  thick = false,
  style = {},
}: {
  thick?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      borderTop: thick ? `3px double ${C.ink}` : `1px solid ${C.rule}`,
      ...style,
    }}
  />
);

const Tag = ({
  children,
  red = false,
}: {
  children: string;
  red?: boolean;
}) => (
  <span className={`section-tag${red ? " section-tag-red" : ""}`}>
    {children}
  </span>
);

const Byline = ({
  author,
  role,
  time,
}: {
  author: string;
  role?: string;
  time?: string;
}) => (
  <div className="byline" style={{ marginBottom: 5 }}>
    By <strong>{author}</strong>
    {role ? ` · ${role}` : ""}
    {time ? ` · ${time}` : ""}
  </div>
);

const Ink = ({
  name,
  size = 40,
  color,
  src,
}: {
  name: string;
  size?: number;
  color?: string;
  src?: string;
}) => {
  const bg = color || C.ink;
  if (src)
    return (
      <img
        src={src}
        style={{
          width: size,
          height: size,
          border: `1px solid ${C.ink}`,
          objectFit: "cover",
          flexShrink: 0,
        }}
        referrerPolicy="no-referrer"
      />
    );
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `1px solid ${C.ink}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Bodoni Moda', serif",
        fontWeight: 700,
        fontSize: size * 0.38,
        color: bg,
        background: C.paper,
        flexShrink: 0,
        letterSpacing: "-0.02em",
      }}
    >
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

const Btn = ({
  children,
  onClick,
  variant = "primary",
  style = {},
  disabled = false,
  fullWidth = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "success" | "danger";
  style?: React.CSSProperties;
  disabled?: boolean;
  fullWidth?: boolean;
}) => {
  const [hov, setHov] = useState(false);
  const base: React.CSSProperties = {
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "8px 18px",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    transition: "all .15s",
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? "100%" : "auto",
    ...style,
  };
  const vs: Record<string, React.CSSProperties> = {
    primary: {
      background: hov && !disabled ? C.inkMid : C.ink,
      color: C.paper,
    },
    ghost: {
      background: hov && !disabled ? C.ink : "transparent",
      color: hov && !disabled ? C.paper : C.ink,
      border: `1px solid ${C.ink}`,
    },
    success: {
      background: hov && !disabled ? C.success : "transparent",
      color: hov && !disabled ? C.paper : C.success,
      border: `1px solid ${C.success}`,
    },
    danger: {
      background: hov && !disabled ? C.accent : "transparent",
      color: hov && !disabled ? C.paper : C.accent,
      border: `1px solid ${C.accent}`,
    },
  };
  return (
    <button
      style={{ ...base, ...vs[variant] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Field = ({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  type = "text",
  style = {},
  onKeyDown,
}: {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  style?: React.CSSProperties;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) => {
  const base: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${C.rule}`,
    padding: "8px 2px",
    color: C.ink,
    fontFamily: "'Spectral',serif",
    fontStyle: "italic",
    fontSize: 14,
    outline: "none",
    resize: "none",
    ...style,
  };
  return multiline ? (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={base}
      rows={rows}
    />
  ) : (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={base}
      type={type}
      onKeyDown={onKeyDown}
    />
  );
};

const Card = ({
  children,
  style = {},
  className = "",
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  key?: any;
}) => (
  <div
    className={className}
    style={{ background: C.surface, border: `1px solid ${C.rule}`, ...style }}
  >
    {children}
  </div>
);

const Hoarding = ({
  url,
  type,
  label,
  caption,
  onLightbox,
}: {
  url: string;
  type: "image" | "video";
  label?: string;
  caption?: string;
  onLightbox?: (url: string, type: "image" | "video") => void;
}) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hov, setHov] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div
      className="hoarding-frame mb-6 shadow-sm group"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        className="hoarding-inner relative cursor-pointer overflow-hidden"
        onClick={() => onLightbox?.(url, type)}
      >
        {type === "video" ? (
          <div className="relative">
            <video
              ref={videoRef}
              src={url}
              className="w-full grayscale group-hover:grayscale-0 transition-all media-glow"
              loop
              muted={muted}
              playsInline
            />
            <div
              className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${hov || !playing ? "opacity-100" : "opacity-0"
                }`}
            >
              <div className="flex gap-4">
                <button
                  onClick={togglePlay}
                  className="bg-paper p-2 rounded-full border border-ink hover:bg-ink hover:text-paper transition-colors"
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={toggleMute}
                  className="bg-paper p-2 rounded-full border border-ink hover:bg-ink hover:text-paper transition-colors"
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>
            {!playing && (
              <div className="absolute top-2 right-2 byline bg-paper px-2 py-0.5 border border-ink">
                PAUSED
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <img
              src={url}
              className="w-full grayscale group-hover:grayscale-0 transition-all media-glow"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <Maximize2
                size={24}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
      {label && (
        <div className="hoarding-cap absolute -top-3 left-4">{label}</div>
      )}
      {caption && (
        <div className="italic-serif text-[12px] p-3 text-inkMid border-t border-ink leading-snug">
          {caption}
        </div>
      )}
    </div>
  );
};

const NewspaperLoading = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: C.paper,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
    className="paper-grain"
  >
    <motion.div
      animate={{
        rotateY: [0, 180, 360],
        scale: [1, 0.9, 1],
      }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      style={{
        width: 100,
        height: 130,
        background: C.white,
        border: `2px solid ${C.ink}`,
        position: "relative",
        boxShadow: "8px 8px 0 rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 15,
          left: 10,
          right: 10,
          height: 4,
          background: C.ink,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 10,
          right: 30,
          height: 2,
          background: C.rule,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 10,
          right: 10,
          height: 2,
          background: C.rule,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 15,
          left: 10,
          width: 30,
          height: 30,
          background: C.rule,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 15,
          right: 10,
          width: 40,
          height: 6,
          background: C.rule,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 10,
          width: 40,
          height: 6,
          background: C.rule,
        }}
      />
    </motion.div>
    <div
      className="byline"
      style={{ marginTop: 32, color: C.accent, fontWeight: 700 }}
    >
      Printing the Latest Dispatches…
    </div>
  </motion.div>
);

const LateBreakingTicker = ({
  setPage,
  setSelectedCreator,
  setActiveConvoId,
}: {
  setPage: (p: string) => void;
  setSelectedCreator: (c: any) => void;
  setActiveConvoId: (id: string) => void;
}) => {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () =>
    api
      .getNotifs()
      .then(setNotifs)
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchNotifs();
    const inv = setInterval(fetchNotifs, 10000);
    return () => clearInterval(inv);
  }, []);

  const handleAction = async (id: string, resp: string) => {
    try {
      await api.respondNotif(id, resp);
      setNotifs((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, responded: resp, read: true } : n,
        ),
      );
    } catch (e) {
      console.error("Action failed", e);
    }
  };

  const navigate = async (n: Notif) => {
    if (!n.linkId) return;
    if (n.linkType === "profile") {
      const u = await api.getUser(n.linkId);
      setSelectedCreator(u);
      setPage("Profile");
    } else if (n.linkType === "message") {
      setActiveConvoId(n.linkId);
      setPage("Messages");
    }
  };

  if (loading && notifs.length === 0) return null;

  return (
    <aside
      style={{
        paddingLeft: 32,
        borderLeft: `1px solid ${C.rule}`,
        height: "fit-content",
        position: "sticky",
        top: 120,
      }}
    >
      <div className="section-tag mb-4 section-tag-red">Late-Breaking</div>
      <HR style={{ marginBottom: 20 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {notifs.slice(0, 8).map((n) => (
          <motion.div
            key={n._id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ position: "relative", opacity: n.read ? 0.6 : 1 }}
          >
            <div
              className="byline"
              style={{
                fontSize: 8,
                color: C.accent,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {n.icon} {n.type.toUpperCase()} · {n.time}
            </div>
            <div
              className={`headline-sm ${n.linkId ? "cursor-pointer hover:underline" : ""}`}
              onClick={() => navigate(n)}
              style={{ fontSize: 13, lineHeight: 1.25, fontWeight: 800 }}
            >
              {n.title.toUpperCase()}
            </div>
            <div
              className="italic-serif"
              style={{
                fontSize: 11,
                color: C.inkMid,
                marginTop: 4,
                lineHeight: 1.4,
              }}
            >
              {n.detail}
            </div>

            {n.actionable && !n.responded && (
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => handleAction(n._id, "accepted")}
                  style={{
                    fontSize: 9,
                    padding: "4px 8px",
                    background: C.success,
                    color: C.white,
                    border: "none",
                    cursor: "pointer",
                  }}
                  className="byline"
                >
                  ACCEPT
                </button>
                <button
                  onClick={() => handleAction(n._id, "declined")}
                  style={{
                    fontSize: 9,
                    padding: "4px 8px",
                    background: C.ink,
                    color: C.white,
                    border: "none",
                    cursor: "pointer",
                  }}
                  className="byline"
                >
                  PASS
                </button>
              </div>
            )}

            {n.responded && (
              <div
                className="byline"
                style={{ fontSize: 8, color: C.accent, marginTop: 8 }}
              >
                ◆ PROTOCOL {n.responded.toUpperCase()}
              </div>
            )}

            <HR
              style={{ marginTop: 20, borderStyle: "dotted", opacity: 0.5 }}
            />
          </motion.div>
        ))}
        {notifs.length === 0 && (
          <div className="italic-serif text-sm opacity-40 text-center py-10">
            No urgent dispatches at this hour. All channels reported quiet.
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 32,
          padding: 12,
          background: C.accentBg,
          border: `1px dashed ${C.accent}`,
          textAlign: "center",
        }}
      >
        <div className="byline" style={{ fontSize: 7, opacity: 0.5 }}>
          Official Gazette Registry v1.1.2
        </div>
      </div>
    </aside>
  );
};

// ── Onboarding Tour ───────────────────────────────────────────────────────────
const OnboardingTour = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Universal Intelligence",
      description:
        "Use the top search bar to discover archives, creator dossiers, and active project plates across the entire talent ecosystem.",
    },
    {
      title: "Creator Directory",
      description:
        "Explore the talent ledger to find specialized artisans. Filter by expertise or reach to find the perfect collaborator.",
    },
    {
      title: "Direct Channels",
      description:
        "Establish private links through our correspondence channel. Secure, instantaneous communication for negotiation and strategy.",
    },
    {
      title: "Establish Your Presence",
      description:
        "Navigate to your dossier to showcase your valuation and skills. Your portfolio is your currency in this decentralized agency.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <Card
        style={{ maxWidth: 460, width: "100%", padding: 48 }}
        className="shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={onComplete}
            className="text-muted hover:text-ink transition-colors"
          >
            <Plus className="w-4 h-4 rotate-45" />
          </button>
        </div>

        <div className="mb-10">
          <span
            className="byline"
            style={{ display: "block", marginBottom: 12, color: C.accent }}
          >
            Induction — Phase 0{step + 1}
          </span>
          <h2 className="headline-xl" style={{ marginBottom: 20 }}>
            {steps[step].title}
          </h2>
          <p className="italic-serif text-lg leading-relaxed text-zinc-600">
            {steps[step].description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "between",
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${C.rule}`,
          }}
        >
          <div style={{ display: "flex", gap: 8, flex: 1 }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 3,
                  width: 16,
                  transition: "all .3s",
                  background: i === step ? C.ink : C.rule,
                }}
              />
            ))}
          </div>
          <Btn
            onClick={() => {
              if (step < steps.length - 1) setStep((s) => s + 1);
              else onComplete();
            }}
          >
            {step === steps.length - 1 ? "Begin Operation" : "Next Briefing"}
          </Btn>
        </div>
      </Card>
    </motion.div>
  );
};

// ── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage({
  onAuth,
  wrapApi,
}: {
  onAuth: (user: User, token: string) => void;
  wrapApi?: <T>(fn: () => Promise<T>) => Promise<T>;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Designer");
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberedEmail") ? true : false,
  );
  const [email, setEmail] = useState(
    localStorage.getItem("rememberedEmail") || "",
  );
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date()
    .toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  useEffect(() => {
    if (rememberMe) localStorage.setItem("rememberedEmail", email);
    else localStorage.removeItem("rememberedEmail");
  }, [email, rememberMe]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    try {
      const payload =
        mode === "login"
          ? { email, password }
          : { name, email, password, role };
      const data = await (wrapApi
        ? wrapApi(() => api[mode](payload))
        : api[mode](payload));
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      if (!data.token) {
        setError("Authentication failed — please try again.");
        setLoading(false);
        return;
      }

      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");

      if (mode === "register") {
        setSuccess("Registration successful! You may now sign in.");
        setMode("login");
        setName("");
        setPassword("");
        setLoading(false);
        return;
      }
      onAuth(data.user, data.token);
    } catch (err: any) {
      setError(
        err.message ||
        "Server unreachable — please ensure the backend is running.",
      );
    }
    setLoading(false);
  };

  const ROLES = [
    "Designer",
    "Video Editor",
    "Photographer",
    "UI/UX Designer",
    "Filmmaker",
    "Animator",
    "Illustrator",
    "Motion Designer",
  ];

  return (
    <div
      className="paper-grain"
      style={{
        minHeight: "100vh",
        background: C.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 0 }}>
          <HR thick />
          <div
            className="byline"
            style={{ padding: "6px 0", letterSpacing: "0.4em" }}
          >
            {today}
          </div>
          <HR />
          <div
            className="headline-xl"
            style={{ padding: "14px 0 6px", letterSpacing: "-0.02em" }}
          >
            ARTWITHIN
          </div>
          <div
            className="italic-serif"
            style={{ fontSize: 13, color: C.inkMid, marginBottom: 10 }}
          >
            "The Creative Commerce Gazette"
          </div>
          <HR thick />
        </div>

        <Card style={{ padding: "32px 36px" }}>
          <div
            style={{
              display: "flex",
              borderBottom: `1px solid ${C.rule}`,
              marginBottom: 24,
            }}
          >
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                  setSuccess("");
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: mode === m ? C.ink : C.inkFaint,
                  borderBottom:
                    mode === m ? `2px solid ${C.ink}` : "2px solid transparent",
                  fontWeight: mode === m ? 700 : 400,
                  marginBottom: -1,
                }}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div
            className="byline"
            style={{
              textAlign: "center",
              marginBottom: 20,
              fontSize: 9,
              letterSpacing: "0.5em",
            }}
          >
            {mode === "login"
              ? "— PRESS CREDENTIALS —"
              : "— NEW CORRESPONDENT ENROLMENT —"}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {mode === "register" && (
              <>
                <div>
                  <div className="byline" style={{ marginBottom: 6 }}>
                    Full Name
                  </div>
                  <Field
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Shah"
                  />
                </div>
                <div>
                  <div className="byline" style={{ marginBottom: 6 }}>
                    Primary Discipline
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: `1px solid ${C.rule}`,
                      padding: "8px 2px",
                      color: C.ink,
                      fontFamily: "'Spectral',serif",
                      fontStyle: "italic",
                      fontSize: 14,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div>
              <div className="byline" style={{ marginBottom: 6 }}>
                Email Address
              </div>
              <Field
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correspondent@gazette.com"
                type="email"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <div>
              <div className="byline" style={{ marginBottom: 6 }}>
                Password
              </div>
              <Field
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
              onClick={() => setRememberMe(!rememberMe)}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${C.rule}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: rememberMe ? C.ink : "transparent",
                }}
              >
                {rememberMe && <CheckCircle2 size={10} color={C.white} />}
              </div>
              <span className="byline" style={{ fontSize: 8 }}>
                Remember Credentials
              </span>
            </div>
          </div>

          {error && (
            <div
              className="byline"
              style={{
                marginTop: 16,
                padding: "10px 14px",
                background: C.accentBg,
                border: `1px solid ${C.accent}`,
                color: C.accent,
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="byline"
              style={{
                marginTop: 16,
                padding: "10px 14px",
                background: "rgba(42,122,75,0.06)",
                border: `1px solid ${C.success}`,
                color: C.success,
              }}
            >
              {success}
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <Btn
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
              style={{ padding: "12px 0" }}
            >
              {loading
                ? "Processing..."
                : mode === "login"
                  ? "Enter the Gazette →"
                  : "Submit Application →"}
            </Btn>
          </div>

          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: `1px solid ${C.rule}`,
              textAlign: "center",
            }}
          >
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setSuccess("");
              }}
              className="byline"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 9,
                textDecoration: "underline",
              }}
            >
              {mode === "login"
                ? "No account? Register as a Correspondent"
                : "Already enrolled? Sign In"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Pages ───────────────────────────────────────────────────────────────────

function HomePage({
  posts,
  setPosts,
  setPage,
  setSelectedCreator,
  currentUser,
  search,
  setSearch,
  wrapApi,
  onLightbox,
}: {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setPage: (p: string) => void;
  setSelectedCreator: (c: Creator) => void;
  currentUser: User | null;
  search: string;
  setSearch: (s: string) => void;
  wrapApi?: <T>(fn: () => Promise<T>) => Promise<T>;
  onLightbox?: (url: string, type: "image" | "video") => void;
}) {
  const [text, setText] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [feedType, setFeedType] = useState<"all" | "following">("all");
  const [media, setMedia] = useState<{
    url: string;
    type: "image" | "video";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    const fetchPosts =
      feedType === "all" ? api.getPosts(search) : api.getFollowingPosts();
    fetchPosts
      .then((d) => {
        setPosts(Array.isArray(d) && d.length > 0 ? d : FB_POSTS);
        setLoading(false);
      })
      .catch(() => {
        setPosts(FB_POSTS);
        setLoading(false);
      });
  }, [search, feedType]);

  const handlePost = async () => {
    if (!text.trim() && !media) return;
    setPosting(true);
    try {
      const saved = await (wrapApi
        ? wrapApi(async () =>
          api.createPost({
            text: text.trim(),
            cat: "General",
            mediaUrl: media?.url,
            mediaType: media?.type,
          }),
        )
        : api.createPost({
          text: text.trim(),
          cat: "General",
          mediaUrl: media?.url,
          mediaType: media?.type,
        }));
      setPosts((prev) => [saved, ...prev]);
      setText("");
      setMedia(null);
    } catch (err) {
      console.error("Posting failed:", err);
    }
    setPosting(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      const type = file.type.startsWith("video") ? "video" : "image";
      setMedia({ url, type });
    };
    reader.readAsDataURL(file);
  };

  const toggleLike = async (id: string) => {
    const was = likedIds.has(id);
    setLikedIds((prev) => {
      const n = new Set(prev);
      was ? n.delete(id) : n.add(id);
      return n;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, likes: p.likes + (was ? -1 : 1) } : p,
      ),
    );
    try {
      await api.likePost(id);
    } catch { }
  };

  if (loading)
    return (
      <div
        className="italic-serif"
        style={{ textAlign: "center", padding: 80, color: C.inkFaint }}
      >
        Gathering the morning edition…
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fade-in"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderBottom: `1px solid ${C.rule}`,
          marginBottom: 24,
        }}
      >
        {[
          ["Direct Dispatch", "14", "New Briefs Filed"],
          ["Portfolio Reach", "4.8K", "Unique Impressions"],
          ["Active Strategy", "29", "Messages Pending"],
        ].map(([l, v, s], i) => (
          <div
            key={l}
            style={{
              padding: "12px 16px",
              borderRight: i < 2 ? `1px solid ${C.rule}` : "none",
              textAlign: "center",
            }}
          >
            <div className="byline" style={{ marginBottom: 4 }}>
              {l}
            </div>
            <div className="headline-lg" style={{ lineHeight: 1 }}>
              {v}
            </div>
            <div
              className="italic-serif"
              style={{ fontSize: 11, color: C.inkFaint }}
            >
              {s}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          borderBottom: `1px solid ${C.rule}`,
        }}
      >
        <button
          onClick={() => setFeedType("all")}
          className={`nav-btn ${feedType === "all" ? "active" : ""}`}
          style={{ padding: "12px 0" }}
        >
          All Dispatches
        </button>
        {currentUser && (
          <button
            onClick={() => setFeedType("following")}
            className={`nav-btn ${feedType === "following" ? "active" : ""}`}
            style={{ padding: "12px 0" }}
          >
            Following
          </button>
        )}
      </div>

      <Card style={{ padding: 16, marginBottom: 24 }}>
        <div className="byline" style={{ marginBottom: 10 }}>
          SUBMIT A DISPATCH TO THE GAZETTE
        </div>
        <Field
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share a creative update, project announcement, or portfolio piece…"
          multiline
          rows={3}
        />
        {media && (
          <div
            style={{
              position: "relative",
              marginTop: 12,
              border: `1px solid ${C.rule}`,
              height: 200,
              overflow: "hidden",
            }}
          >
            {media.type === "image" ? (
              <img src={media.url} className="w-full h-full object-cover" />
            ) : (
              <video
                src={media.url}
                className="w-full h-full object-cover"
                controls
              />
            )}
            <button
              onClick={() => setMedia(null)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: C.ink,
                color: C.white,
                border: "none",
                borderRadius: "50%",
                width: 20,
                height: 20,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            paddingTop: 10,
            borderTop: `1px solid ${C.rule}`,
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*,video/*"
              onChange={onFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="byline"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Camera className="w-3 h-3" /> ATTACH ASSET
            </button>
          </div>
          <Btn
            onClick={handlePost}
            disabled={posting || (!text.trim() && !media)}
          >
            {posting ? "Publishing…" : "Publish Dispatch →"}
          </Btn>
        </div>
      </Card>

      {posts.length === 0 && (
        <div
          className="italic-serif"
          style={{ textAlign: "center", padding: 60, color: C.inkFaint }}
        >
          No dispatches on current record.
        </div>
      )}

      {posts.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 0,
            borderTop: `3px double ${C.ink}`,
          }}
        >
          <div
            style={{
              padding: "16px 24px 16px 0",
              borderRight: `1px solid ${C.rule}`,
            }}
          >
            <Tag red>{posts[0].cat}</Tag>
            <h2 className="headline-xl" style={{ margin: "12px 0" }}>
              {posts[0].name.toUpperCase()} REVEALS LATEST PLATE ARCHITECTURE
            </h2>
            <HR style={{ margin: "12px 0" }} />
            <Byline
              author={posts[0].name}
              role={posts[0].role}
              time={posts[0].time}
            />
            {posts[0].mediaUrl ? (
              <Hoarding
                url={posts[0].mediaUrl}
                type={posts[0].mediaType || "image"}
                label={`PLATE EXHIBIT — ${posts[0].cat.toUpperCase()}`}
                caption={`Documented capture from ${posts[0].name}'s latest workshop session. Metadata suggests technical variance in color space.`}
                onLightbox={onLightbox}
              />
            ) : (
              <div
                style={{
                  margin: "16px 0",
                  border: `3px double ${C.ink}`,
                  padding: 4,
                  background: C.paper,
                }}
              >
                <div
                  style={{
                    border: `1px solid ${C.ink}`,
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.inkFaint,
                  }}
                  className="byline"
                >
                  No visual dispatch attached
                </div>
              </div>
            )}
            <p className="body-copy drop-cap">
              {posts[0].text} This contribution signifies a notable shift in the
              ecosystem, according to various archive observers.
            </p>
            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 20,
                paddingTop: 12,
                borderTop: `1px solid ${C.rule}`,
              }}
            >
              <button
                onClick={() => toggleLike(posts[0]._id)}
                className="byline"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: likedIds.has(posts[0]._id) ? C.accent : C.inkMid,
                }}
              >
                {likedIds.has(posts[0]._id) ? "♥" : "♡"} {posts[0].likes} LIKES
              </button>
              <button
                className="byline"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✎ {posts[0].comments} RESPONSES
              </button>
              <Btn
                variant="ghost"
                style={{ marginLeft: "auto", fontSize: 8, padding: "4px 10px" }}
                onClick={() => {
                  api.getUser(posts[0].creatorId).then((u) => {
                    setSelectedCreator(u);
                    setPage("Profile");
                  });
                }}
              >
                PROFILE →
              </Btn>
            </div>
          </div>
          <div style={{ padding: "16px 0 16px 24px" }}>
            <div className="byline" style={{ marginBottom: 12 }}>
              OTHER DISPATCHES
            </div>
            {posts.slice(1, 6).map((p) => (
              <div
                key={p._id}
                style={{
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: `1px solid ${C.rule}`,
                }}
              >
                <div className="headline-sm">
                  {p.name}: {p.text.split(" ").slice(0, 6).join(" ")}…
                </div>
                <Byline author={p.name} time={p.time} />
                <button
                  onClick={() => toggleLike(p._id)}
                  className="byline"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginTop: 4,
                    color: likedIds.has(p._id) ? C.accent : C.inkFaint,
                  }}
                >
                  {likedIds.has(p._id) ? "♥" : "♡"} {p.likes}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ExplorePage({
  setPage,
  setSelectedCreator,
  search,
}: {
  setPage: (p: string) => void;
  setSelectedCreator: (c: Creator) => void;
  search: string;
}) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [activeSkill, setActiveSkill] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = search || (activeSkill === "All" ? "" : activeSkill);
    api
      .getUsers(q)
      .then((d) => {
        setCreators(Array.isArray(d) && d.length > 0 ? d : FB_CREATORS);
        setLoading(false);
      })
      .catch(() => {
        setCreators(FB_CREATORS);
        setLoading(false);
      });
  }, [activeSkill, search]);

  if (loading)
    return (
      <div
        className="italic-serif"
        style={{ textAlign: "center", padding: 60, color: C.inkFaint }}
      >
        Consulting the registry…
      </div>
    );

  return (
    <div className="fade-in">
      <div style={{ textAlign: "center" }}>
        <HR thick />
        <div className="headline-xl" style={{ padding: "10px 0 4px" }}>
          TALENT REGISTRY
        </div>
        <div
          className="italic-serif"
          style={{ fontSize: 12, color: C.inkMid, marginBottom: 8 }}
        >
          A Complete Survey of All Creative Correspondents
        </div>
        <HR thick />
      </div>

      <div
        style={{
          display: "flex",
          gap: 20,
          margin: "16px 0",
          overflowX: "auto",
          paddingBottom: 10,
          borderBottom: `1px solid ${C.rule}`,
        }}
      >
        {[
          "All",
          "Designer",
          "Video Editor",
          "Photographer",
          "UI/UX Designer",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setActiveSkill(s)}
            className={`nav-btn${activeSkill === s ? " active" : ""}`}
            style={{ padding: "4px 0", fontSize: 9 }}
          >
            {s}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {creators.map((c) => (
          <Card key={c._id} style={{ padding: 20 }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <Ink name={c.name} size={48} />
              <div>
                <div className="headline-sm">{c.name}</div>
                <div className="byline">{c.role}</div>
              </div>
            </div>
            <p
              className="body-copy"
              style={{ fontStyle: "italic", fontSize: 12, marginBottom: 16 }}
            >
              "{c.bio}"
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                borderTop: `1px solid ${C.rule}`,
                paddingTop: 12,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div className="byline" style={{ fontSize: 8 }}>
                  FOLLOWERS
                </div>
                <div className="headline-sm">{c.followers}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="byline" style={{ fontSize: 8 }}>
                  PLATES
                </div>
                <div className="headline-sm">{c.projects}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="byline" style={{ fontSize: 8 }}>
                  RATE
                </div>
                <div className="headline-sm" style={{ fontSize: 10 }}>
                  {c.rate}
                </div>
              </div>
            </div>
            <Btn
              fullWidth
              variant="ghost"
              style={{ marginTop: 20, fontSize: 9 }}
              onClick={() => {
                setSelectedCreator(c);
                setPage("Profile");
              }}
            >
              Examine Dossier →
            </Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MessagesPage({
  activeConvoId,
  setActiveConvoId,
  incomingMsg,
  currentUser,
  wrapApi,
}: {
  activeConvoId: string;
  setActiveConvoId: (id: string) => void;
  incomingMsg: any;
  currentUser: User | null;
  wrapApi?: <T>(fn: () => Promise<T>) => Promise<T>;
}) {
  const [convos, setConvos] = useState<Convo[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getConvos().then((d) => {
      setConvos(d);
      if (!activeConvoId && d.length) setActiveConvoId(d[0]._id);
    });
  }, []);

  useEffect(() => {
    if (incomingMsg) {
      setConvos((prev) =>
        prev.map((c) =>
          c._id === incomingMsg.conversationId
            ? { ...c, msgs: [...c.msgs, incomingMsg.msg] }
            : c,
        ),
      );
    }
  }, [incomingMsg]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convos]);

  const active = convos.find((c) => c._id === activeConvoId);

  const send = async () => {
    if (!input.trim()) return;
    const txt = input.trim();
    setInput("");
    setConvos((prev) =>
      prev.map((c) =>
        c._id === activeConvoId
          ? {
            ...c,
            msgs: [...c.msgs, { from: currentUser?._id || "me", text: txt }],
          }
          : c,
      ),
    );
    if (wrapApi) {
      await wrapApi(() =>
        api.sendMessage({ conversationId: activeConvoId, text: txt }),
      );
    } else {
      await api.sendMessage({ conversationId: activeConvoId, text: txt });
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        height: 600,
        border: `1px solid ${C.rule}`,
      }}
    >
      <div
        style={{
          borderRight: `1px solid ${C.rule}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="byline"
          style={{ padding: 16, borderBottom: `1px solid ${C.rule}` }}
        >
          CORRESPONDENCE
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {convos.map((c) => (
            <div
              key={c._id}
              onClick={() => setActiveConvoId(c._id)}
              style={{
                padding: 16,
                cursor: "pointer",
                background:
                  activeConvoId === c._id ? C.accentBg : "transparent",
                borderBottom: `1px solid ${C.rule}`,
              }}
            >
              <div className="headline-sm" style={{ fontSize: 13 }}>
                {c.name}
              </div>
              <div className="byline" style={{ fontSize: 8 }}>
                Latest Message Attached
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: 16,
            borderBottom: `1px solid ${C.rule}`,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Ink name={active?.name || "?"} size={30} />
          <div className="headline-sm">
            {active?.name || "Select dispatch thread"}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {active?.msgs.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf:
                  m.from === currentUser?._id ? "flex-end" : "flex-start",
                maxWidth: "70%",
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  background: m.from === currentUser?._id ? C.ink : C.white,
                  color: m.from === currentUser?._id ? C.white : C.ink,
                  border: `1px solid ${C.rule}`,
                  fontFamily: "'Spectral',serif",
                  fontStyle: "italic",
                  fontSize: 14,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
        <div
          style={{
            padding: 16,
            borderTop: `1px solid ${C.rule}`,
            display: "flex",
            gap: 12,
          }}
        >
          <Field
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type dispatch…"
            style={{ flex: 1 }}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Btn onClick={send}>Send →</Btn>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="italic-serif text-center py-20 opacity-40">
        Compiling financial ledgers...
      </div>
    );

  const ITEMS = [
    ["Profile Reach", stats?.reach || "0", "+12%"],
    ["Engagements", stats?.engagements || "0", "+4%"],
    ["Portfolio Items", stats?.portfolioCount || "0", "Updated"],
    ["Followers", stats?.followers || "0", "+2%"],
  ];

  return (
    <div className="fade-in">
      <div
        className="headline-xl"
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        QUARTERLY EARNINGS REPORT
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
        }}
      >
        {ITEMS.map(([l, v, t]) => (
          <Card key={l} style={{ padding: 20, textAlign: "center" }}>
            <div className="byline" style={{ fontSize: 8 }}>
              {l}
            </div>
            <div className="headline-lg">{v}</div>
            <div
              className="italic-serif"
              style={{ fontSize: 10, color: C.success }}
            >
              {t} Movement
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({
  creator,
  setPage,
  setActiveConvoId,
  currentUser,
  onUpdate,
  wrapApi,
  onLightbox,
}: {
  creator: Creator | null;
  setPage: (p: string) => void;
  setActiveConvoId: (id: string) => void;
  currentUser: User | null;
  onUpdate?: (u: any) => void;
  wrapApi?: <T>(fn: () => Promise<T>) => Promise<T>;
  onLightbox?: (url: string, type: "image" | "video") => void;
}) {
  const [profile, setProfile] = useState<Creator | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editQuote, setEditQuote] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editRate, setEditRate] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editProfilePic, setEditProfilePic] = useState("");
  const [editFollowers, setEditFollowers] = useState(0);
  const [editProjects, setEditProjects] = useState(0);
  const [editPortfolio, setEditPortfolio] = useState<PortfolioItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [hiring, setHiring] = useState(false);
  const [newPortTitle, setNewPortTitle] = useState("");
  const [newPortUrl, setNewPortUrl] = useState("");
  const [newPortType, setNewPortType] = useState<"image" | "video">("image");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const portFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creator) setProfile(creator);
    else if (currentUser) {
      setProfile({
        _id: currentUser._id,
        name: currentUser.name,
        role: currentUser.role,
        bio: currentUser.bio || "Dossier pending update.",
        quote: currentUser.quote || "True excellence is not a single dispatch, but the cumulative ledger of one's creative output.",
        location: currentUser.location || "Location redacted",
        skills: currentUser.skills || [],
        followers: currentUser.followers || 0,
        projects: currentUser.projects || 0,
        rate: currentUser.rate || "Contact for rate",
        profilePic: currentUser.profilePic,
        portfolio: currentUser.portfolio || [],
      });
      setEditBio(currentUser.bio || "");
      setEditQuote(currentUser.quote || "");
      setEditLocation(currentUser.location || "");
      setEditRate(currentUser.rate || "");
      setEditSkills(currentUser.skills?.join(", ") || "");
      setEditName(currentUser.name || "");
      setEditRole(currentUser.role || "");
      setEditProfilePic(currentUser.profilePic || "");
      setEditFollowers(currentUser.followers || 0);
      setEditProjects(currentUser.projects || 0);
      setEditPortfolio(currentUser.portfolio || []);
    }
  }, [creator, currentUser]);

  useEffect(() => {
    if (profile) setEditPortfolio(profile.portfolio || []);
  }, [profile]);

  useEffect(() => {
    if (profile && currentUser) {
      setFollowing(currentUser.following?.includes(profile._id) || false);
    }
  }, [profile, currentUser]);

  const handleMsg = async () => {
    if (!profile) return;
    const convo = await (wrapApi
      ? wrapApi(() => api.startConversation(profile._id))
      : api.startConversation(profile._id));
    setActiveConvoId(convo._id);
    setPage("Messages");
  };

  const handleFollow = async () => {
    if (!profile || !currentUser) return;
    setFollowLoading(true);
    try {
      const res = await api.followUser(profile._id);
      setFollowing(!following);
      setProfile({ ...profile, followers: res.followers });
      onUpdate?.({ ...currentUser, following: res.following });
    } catch (err) {
      console.error("Follow failed:", err);
    }
    setFollowLoading(false);
  };

  const handleHire = async () => {
    if (!profile) return;
    setHiring(true);
    try {
      await api.hireUser(profile._id);
      alert("Proposal dispatched to correspondent registry.");
    } catch (e) {
      console.error("Hire failed", e);
    }
    setHiring(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const skillsArr = editSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const updated = await (wrapApi
        ? wrapApi(() =>
          api.updateMe({
            name: editName,
            role: editRole,
            bio: editBio,
            quote: editQuote,
            location: editLocation,
            rate: editRate,
            followers: editFollowers,
            projects: editProjects,
            skills: skillsArr,
            profilePic: editProfilePic,
            portfolio: editPortfolio,
          }),
        )
        : api.updateMe({
          name: editName,
          role: editRole,
          bio: editBio,
          quote: editQuote,
          location: editLocation,
          rate: editRate,
          followers: editFollowers,
          projects: editProjects,
          skills: skillsArr,
          profilePic: editProfilePic,
          portfolio: editPortfolio,
        }));
      onUpdate?.(updated);
      setProfile({
        ...profile!,
        name: updated.name,
        role: updated.role,
        bio: updated.bio,
        quote: updated.quote,
        location: updated.location,
        rate: updated.rate,
        followers: updated.followers,
        projects: updated.projects,
        skills: updated.skills,
        profilePic: updated.profilePic,
        portfolio: updated.portfolio,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
    setSaving(false);
  };

  const onProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditProfilePic(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onPortFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setNewPortUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!profile) return null;

  const isMe = currentUser?._id === profile._id;

  const checklist = [
    { label: "IDENTITY DEFINED", done: !!profile.name && profile.name !== "NEW ARCHIVE CREATOR" },
    { label: "ROLE ASSIGNED", done: !!profile.role && profile.role !== "FIELD OPERATIVE" },
    { label: "BIOGRAPHICAL DATA", done: !!profile.bio && profile.bio.length > 10 },
    { label: "VISUAL DESIGNEE", done: !!profile.profilePic },
    { label: "FISCAL VALUATION", done: !!profile.rate },
    { label: "SKILL REPERTOIRE", done: (profile.skills?.length || 0) > 0 },
    { label: "ARCHIVE SAMPLES", done: (profile.portfolio?.length || 0) > 0 },
  ];

  const completedCount = checklist.filter((i) => i.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Ink
            name={profile.name}
            size={100}
            color={C.accent}
            src={isEditing ? editProfilePic : profile.profilePic}
          />
          {isEditing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: C.ink,
                color: C.white,
                border: "none",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Camera size={14} />
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={onProfilePicChange}
          />
        </div>
        {isEditing ? (
          <div style={{ marginTop: 20, maxWidth: 400, margin: "20px auto 0" }}>
            <Field
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Full Name"
              style={{
                textAlign: "center",
                fontSize: 24,
                fontWeight: 700,
                fontFamily: "'Bodoni Moda', serif",
              }}
            />
            <Field
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              placeholder="e.g. Video Editor"
              style={{
                textAlign: "center",
                fontSize: 12,
                marginTop: 8,
                letterSpacing: "0.2em",
              }}
            />
          </div>
        ) : (
          <>
            <h1
              className="headline-xl"
              style={{ margin: "20px 0 8px", fontSize: 42 }}
            >
              {profile.name.toUpperCase()}
            </h1>
            <div
              className="byline"
              style={{ letterSpacing: "0.6em", color: C.accent }}
            >
              {profile.role}
            </div>
          </>
        )}
        <div className="italic-serif text-sm mt-4 opacity-60">
          Credential Hash: {profile._id.slice(-8).toUpperCase()}
        </div>
        <HR thick style={{ marginTop: 32 }} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 50,
          marginBottom: 60,
        }}
      >
        <div>
          <div className="byline" style={{ marginBottom: 16 }}>
            CORRESPONDENT DOSSIER
          </div>
          {isEditing ? (
            <div style={{ marginBottom: 20 }}>
              <div className="byline" style={{ fontSize: 8, marginBottom: 4 }}>LOCATION</div>
              <Field
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="e.g. London, UK"
                style={{ fontSize: 13 }}
              />
              <div className="byline" style={{ fontSize: 8, marginBottom: 4, marginTop: 12 }}>BIOGRAPHICAL DATA</div>
              <Field
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Biographical notes..."
                multiline
                rows={4}
                style={{ fontSize: 15, fontStyle: "normal" }}
              />
            </div>
          ) : (
            <>
              <div className="mono" style={{ fontSize: 10, color: C.accent, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={10} /> {profile.location || "LOCATION UNKNOWN"}
              </div>
              <p className="body-copy drop-cap" style={{ fontSize: 15 }}>
                {profile.bio}
              </p>
            </>
          )}
          <div className="pull-quote">
            {isEditing ? (
              <div>
                <div className="byline" style={{ fontSize: 8, marginBottom: 4 }}>PERSONAL CREDO / QUOTE</div>
                <Field
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  placeholder="Insert mission statement..."
                  multiline
                  rows={2}
                  style={{ fontSize: 18, fontStyle: "italic", border: 'none', padding: 0 }}
                />
              </div>
            ) : (
              `"${profile.quote || "True excellence is not a single dispatch, but the cumulative ledger of one's creative output. My work is my testimony."}"`
            )}
          </div>
        </div>
        <div>
          <div className="byline" style={{ marginBottom: 16 }}>
            VALUATION METRICS
          </div>
          <div style={{ marginBottom: 28 }}>
            {[
              ["Followers", isEditing ? (
                <Field
                  value={String(editFollowers)}
                  onChange={(e) => setEditFollowers(parseInt(e.target.value) || 0)}
                  type="number"
                  style={{ width: 60, textAlign: 'right', fontSize: 11 }}
                />
              ) : profile.followers],
              ["Plates Filed", isEditing ? (
                <Field
                  value={String(editProjects)}
                  onChange={(e) => setEditProjects(parseInt(e.target.value) || 0)}
                  type="number"
                  style={{ width: 60, textAlign: 'right', fontSize: 11 }}
                />
              ) : profile.projects],
              ["Contract Rate", isEditing ? "RATE BELOW" : profile.rate],
              ["Status", "ACTIVE"],
              ["Report Status", progressPercent >= 100 ? "VERIFIED" : "PROVISIONAL"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: `1px solid ${C.rule}`,
                }}
              >
                <span className="byline" style={{ fontSize: 8 }}>
                  {k}
                </span>
                <span
                  className="headline-sm"
                  style={{
                    fontSize: 11,
                    color: k === "Status" ? C.success : C.ink,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          {isMe && progressPercent < 100 && (
            <div
              style={{
                border: `1px solid ${C.rule}`,
                padding: 16,
                background: `${C.rule}33`,
                marginBottom: 32,
              }}
            >
              <div className="byline" style={{ marginBottom: 12, color: C.accent }}>
                PROFILE INTEGRITY REPORT
              </div>
              <div
                style={{
                  height: 4,
                  background: C.rule,
                  marginBottom: 16,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: C.accent,
                    width: `${progressPercent}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {checklist.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      opacity: item.done ? 0.4 : 1,
                    }}
                  >
                    {item.done ? (
                      <CheckCircle2 size={10} color={C.success} />
                    ) : (
                      <Circle size={10} color={C.inkFaint} />
                    )}
                    <span
                      className="mono"
                      style={{
                        fontSize: 8,
                        textDecoration: item.done ? "line-through" : "none",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div
                  className="byline"
                  style={{ fontSize: 8, marginBottom: 4 }}
                >
                  RATE
                </div>
                <Field
                  value={editRate}
                  onChange={(e) => setEditRate(e.target.value)}
                  placeholder="e.g. ₹3,500/hr"
                />
              </div>
              <div>
                <div
                  className="byline"
                  style={{ fontSize: 8, marginBottom: 4 }}
                >
                  SKILLS (COMMA SEPARATED)
                </div>
                <Field
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="Premiere Pro, DaVinci..."
                />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <Btn fullWidth onClick={saveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save Dossier"}
                </Btn>
                <Btn
                  fullWidth
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Btn>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {isMe ? (
                <Btn
                  fullWidth
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  Revise Dossier →
                </Btn>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <Btn
                    fullWidth
                    onClick={handleMsg}
                    style={{ padding: "12px 0" }}
                  >
                    Establish Correspondence →
                  </Btn>
                  <Btn
                    fullWidth
                    variant="success"
                    onClick={handleHire}
                    disabled={hiring}
                    style={{ padding: "12px 0" }}
                  >
                    {hiring ? "Sending Proposal..." : "◆ Propose Assignment"}
                  </Btn>
                  <Btn
                    fullWidth
                    variant={following ? "ghost" : "primary"}
                    onClick={handleFollow}
                    disabled={followLoading}
                    style={{ padding: "12px 0" }}
                  >
                    {following ? "◆ Unfollow Dispatch" : "◇ Follow Dispatch"}
                  </Btn>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-20">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Tag red>Archives & Artifacts</Tag>
          <h2 className="headline-lg" style={{ marginTop: 12 }}>
            THE PORTFOLIO LEDGER
          </h2>
          <HR style={{ width: 100, margin: "16px auto" }} />
        </div>

        {isEditing && (
          <Card
            style={{
              padding: 24,
              marginBottom: 32,
              border: `2px dashed ${C.rule}`,
            }}
          >
            <div className="byline" style={{ marginBottom: 16 }}>
              ADD NEW ARCHIVE ENTRY
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <div className="byline" style={{ fontSize: 8, marginBottom: 4 }}>
                  TITLE
                </div>
                <Field
                  value={newPortTitle}
                  onChange={(e) => setNewPortTitle(e.target.value)}
                  placeholder="e.g. Artifact 05"
                />
              </div>
              <div>
                <div className="byline" style={{ fontSize: 8, marginBottom: 4 }}>
                  TYPE & MEDIA
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <select
                    value={newPortType}
                    onChange={(e) =>
                      setNewPortType(e.target.value as "image" | "video")
                    }
                    className="mono bg-transparent border-b border-rule p-2 text-[10px]"
                    style={{ color: C.ink }}
                  >
                    <option value="image">IMAGE</option>
                    <option value="video">VIDEO</option>
                  </select>
                  <Btn
                    variant="ghost"
                    onClick={() => portFileInputRef.current?.click()}
                    style={{ fontSize: 10, padding: "0 10px" }}
                  >
                    Upload File
                  </Btn>
                </div>
                <input
                  type="file"
                  ref={portFileInputRef}
                  hidden
                  accept={newPortType === "image" ? "image/*" : "video/*"}
                  onChange={onPortFileChange}
                />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div className="byline" style={{ fontSize: 8, marginBottom: 4 }}>
                OR EXTERNAL URL
              </div>
              <Field
                value={newPortUrl}
                onChange={(e) => setNewPortUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <Btn
              onClick={() => {
                if (newPortTitle && newPortUrl) {
                  setEditPortfolio([
                    ...editPortfolio,
                    {
                      id: String(Date.now()),
                      title: newPortTitle,
                      type: newPortType,
                      url: newPortUrl,
                    },
                  ]);
                  setNewPortTitle("");
                  setNewPortUrl("");
                }
              }}
            >
              + Add to Ledger
            </Btn>
          </Card>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {(isEditing ? editPortfolio : profile.portfolio || []).map((item) => (
            <div key={item.id} style={{ position: "relative" }}>
              <Hoarding
                url={item.url}
                type={item.type as any}
                label={item.title}
                caption={`${item.type.toUpperCase()} dispatch attributed to ${profile.name}'s archive.`}
                onLightbox={onLightbox}
              />
              {isEditing && (
                <button
                  onClick={() =>
                    setEditPortfolio(editPortfolio.filter((p) => p.id !== item.id))
                  }
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    background: C.accent,
                    color: C.white,
                    border: "none",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {!isEditing &&
            (!profile.portfolio || profile.portfolio.length === 0) && (
              <div className="col-span-2 italic-serif text-center py-20 opacity-40">
                No archives currently filed for this correspondent.
              </div>
            )}
        </div>
      </div>

      <div style={{ textAlign: "center", paddingBottom: 40 }}>
        <div className="byline" style={{ opacity: 0.3 }}>
          — END OF DOSSIER —
        </div>
      </div>
    </div>
  );
}

const Lightbox = ({
  url,
  type,
  onClose,
}: {
  url: string;
  type: "image" | "video";
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 2000,
      background: "rgba(0,0,0,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
    }}
    onClick={onClose}
  >
    <button
      onClick={onClose}
      style={{
        position: "absolute",
        top: 24,
        right: 24,
        color: "white",
        background: "none",
        border: "none",
        cursor: "pointer",
        zIndex: 2001,
      }}
    >
      <X size={32} />
    </button>
    <div
      style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}
      onClick={(e) => e.stopPropagation()}
    >
      {type === "video" ? (
        <video
          src={url}
          controls
          autoPlay
          style={{
            maxWidth: "100%",
            maxHeight: "90vh",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        />
      ) : (
        <img
          src={url}
          style={{
            maxWidth: "100%",
            maxHeight: "90vh",
            objectFit: "contain",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        />
      )}
    </div>
  </motion.div>
);

// ── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Home");
  const [user, setUser] = useState<User | null>(null);
  const [lightbox, setLightbox] = useState<{
    url: string;
    type: "image" | "video";
  } | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [activeConvoId, setActiveConvoId] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [incomingMsg, setIncomingMsg] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .getMe()
        .then((u) => {
          setUser(u);
          if (!localStorage.getItem(`onboarded_${u._id}`))
            setShowOnboarding(true);
          setupWS(token);
        })
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  const wrapApi = async (fn: () => Promise<any>) => {
    setGlobalLoading(true);
    try {
      const res = await fn();
      return res;
    } finally {
      setTimeout(() => setGlobalLoading(false), 800); // Small delay for visual impact
    }
  };

  const setupWS = (token: string) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    ws.onopen = () => ws.send(JSON.stringify({ type: "auth", token }));
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "message") setIncomingMsg(data);
    };
  };

  const handleAuth = async (u: User, token: string) => {
    await wrapApi(async () => {
      localStorage.setItem("token", token);
      setUser(u);
      if (!localStorage.getItem(`onboarded_${u._id}`)) setShowOnboarding(true);
      setupWS(token);
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setPage("Home");
  };

  if (!authChecked)
    return (
      <div className="paper-grain h-screen flex items-center justify-center italic-serif">
        Initializing Registry…
      </div>
    );
  if (!user)
    return (
      <>
        <style>{G}</style>
        <AnimatePresence>
          {globalLoading && <NewspaperLoading />}
        </AnimatePresence>
        <AuthPage onAuth={handleAuth} wrapApi={wrapApi} />
      </>
    );

  return (
    <>
      <style>{G}</style>
      <div
        className="paper-grain"
        style={{ minHeight: "100vh", background: C.paper }}
      >
        <AnimatePresence>
          {showOnboarding && (
            <OnboardingTour
              onComplete={() => {
                setShowOnboarding(false);
                localStorage.setItem(`onboarded_${user._id}`, "true");
              }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {globalLoading && <NewspaperLoading />}
        </AnimatePresence>

        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: C.paper,
            borderBottom: `1px solid ${C.rule}`,
          }}
        >
          <div style={{ height: 4, background: C.accent }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 32px",
              borderBottom: `1px solid ${C.rule}`,
            }}
          >
            <div className="byline">
              {new Date()
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
                .toUpperCase()}
            </div>
            <div
              className="headline-xl"
              style={{
                fontSize: 42,
                letterSpacing: "0.15em",
                cursor: "pointer",
                lineHeight: 1,
                margin: "10px 0",
                fontWeight: 800,
              }}
              onClick={() => setPage("Home")}
            >
              ARTWITHIN
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "right" }}>
                <div className="headline-sm" style={{ fontSize: 13 }}>
                  {user.name}
                </div>
                <div className="byline" style={{ fontSize: 8 }}>
                  {user.role}
                </div>
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedCreator(null);
                  setPage("Profile");
                }}
              >
                <Ink name={user.name} size={34} src={user.profilePic} />
              </div>
              <button
                onClick={logout}
                className="byline"
                style={{
                  padding: "4px 10px",
                  border: `1px solid ${C.rule}`,
                  background: "none",
                  cursor: "pointer",
                }}
              >
                EXIT
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "0 32px",
            }}
          >
            {["Home", "Explore", "Messages", "Dashboard", "Profile"].map(
              (p) => (
                <button
                  key={p}
                  className={`nav-btn${page === p ? " active" : ""}`}
                  onClick={() => {
                    if (p === "Profile") setSelectedCreator(null);
                    setPage(p);
                  }}
                >
                  {p}
                </button>
              ),
            )}
          </div>
        </header>

        <main
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "24px 32px 80px",
            display: "grid",
            gridTemplateColumns:
              page === "Home" || page === "Explore" || page === "Profile"
                ? "1fr 280px"
                : "1fr",
            gap: 32,
          }}
        >
          <div style={{ minWidth: 0 }}>
            {page === "Home" && (
              <HomePage
                posts={posts}
                setPosts={setPosts}
                setPage={setPage}
                setSelectedCreator={setSelectedCreator}
                currentUser={user}
                search={search}
                setSearch={setSearch}
                wrapApi={wrapApi}
                onLightbox={(url, type) => setLightbox({ url, type })}
              />
            )}
            {page === "Explore" && (
              <ExplorePage
                setPage={setPage}
                setSelectedCreator={setSelectedCreator}
                search={search}
              />
            )}
            {page === "Messages" && (
              <MessagesPage
                activeConvoId={activeConvoId}
                setActiveConvoId={setActiveConvoId}
                incomingMsg={incomingMsg}
                currentUser={user}
                wrapApi={wrapApi}
              />
            )}
            {page === "Dashboard" && <DashboardPage />}
            {page === "Profile" && (
              <ProfilePage
                creator={selectedCreator}
                setPage={setPage}
                setActiveConvoId={setActiveConvoId}
                currentUser={user}
                onUpdate={setUser}
                wrapApi={wrapApi}
                onLightbox={(url, type) => setLightbox({ url, type })}
              />
            )}
          </div>
          {(page === "Home" || page === "Explore" || page === "Profile") && (
            <LateBreakingTicker
              setPage={setPage}
              setSelectedCreator={setSelectedCreator}
              setActiveConvoId={setActiveConvoId}
            />
          )}
        </main>
        <AnimatePresence>
          {lightbox && (
            <Lightbox
              url={lightbox.url}
              type={lightbox.type}
              onClose={() => setLightbox(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
