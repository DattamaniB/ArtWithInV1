import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createHttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'magazine-secret-key-editorial';

async function startServer() {
  const app = express();
  const server = createHttpServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  // Track connected clients
  const clients = new Map<string, WebSocket>();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // In-memory "database" (Simulating real DB)
  let users = [
    {
      _id: "1", name: "Aarav", email: "aarav@example.com", password: await bcrypt.hash("password123", 10), role: "Video Editor", skills: ["Premiere Pro", "DaVinci", "Color Grading"], bio: "Cinematic storyteller crafting luxury brand narratives.", quote: "Creativity is the greatest rebellion in existence.", location: "Mumbai, India", followers: 1240, projects: 38, rate: "₹3,500/hr", profilePic: "", following: [], portfolio: [
        { id: "p1", title: "Midnight over Mumbai", type: "Video", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac" },
        { id: "p2", title: "Street Life Exhibit", type: "Stills", url: "https://images.unsplash.com/photo-1493238792000-8113da705763" }
      ]
    },
    {
      _id: "2", name: "Meera", email: "meera@example.com", password: await bcrypt.hash("password123", 10), role: "Graphic Designer", skills: ["Photoshop", "Figma", "Illustrator"], bio: "Bold identities for bold brands. Minimal black & white aesthetic.", quote: "Design is not what it looks like and feels like. Design is how it works.", location: "Bangalore, India", followers: 890, projects: 54, rate: "₹2,800/hr", profilePic: "", following: [], portfolio: [
        { id: "p3", title: "Vogue India Concept", type: "Layout", url: "https://images.unsplash.com/photo-1541462608141-ad511aaeee73" }
      ]
    },
  ];

  let posts = [
    { _id: "1", creatorId: "1", name: "Aarav", role: "Video Editor", text: "Finished editing a luxury brand reel with cinematic transitions and moody color grading. Client approved on the first draft!", likes: 120, comments: 18, cat: "Video", time: "2h" },
    { _id: "2", creatorId: "2", name: "Meera", role: "Graphic Designer", text: "Created a bold new logo for a startup coffee brand with a minimal black and red theme. Shipping next week!", likes: 85, comments: 11, cat: "Design", time: "5h" },
  ];

  let conversations: any[] = [
    { _id: "convo-1", participants: ["1", "2"], msgs: [{ from: "1", text: "Hi Meera, I saw your design work!", time: new Date().toISOString() }] },
  ];

  let notifications: any[] = [
    { _id: "1", userId: "1", type: "hire", icon: "💼", title: "Nexus Studio sent a hire request", detail: "Video Editor · 3-month contract · ₹45,000/mo", time: "2m ago", read: false, actionable: true, responded: null },
    { _id: "2", userId: "2", type: "like", icon: "❤️", title: "Aarav liked your portfolio post", detail: '"Cinematic reel — loved the color grade!"', time: "15m ago", read: false, actionable: false, responded: null },
  ];

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      req.user = decoded;
      next();
    });
  };

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: String(Date.now()),
        name,
        email,
        password: hashedPassword,
        role,
        skills: [],
        bio: `Editorial talent specializing in ${role}.`,
        quote: "True excellence is not a single dispatch, but the cumulative ledger of one's creative output.",
        location: "Location redacted",
        followers: 0,
        projects: 0,
        rate: "₹0",
        profilePic: "",
        following: [],
        portfolio: []
      };
      users.push(newUser);

      // Add welcome notification
      notifications.push({
        _id: String(Date.now() + 1),
        userId: newUser._id,
        type: "system",
        icon: "✨",
        title: "Welcome to the Ledger",
        detail: `Greetings, ${newUser.name}. Your editorial dossier has been established. Begin by showcasing your expertise.`,
        time: "Just now",
        read: false,
        actionable: false,
        responded: null
      });

      const token = jwt.sign({ id: newUser._id, name: newUser.name, role: newUser.role }, JWT_SECRET);
      const { password: _, ...userWithoutPass } = newUser;
      res.json({ token, user: userWithoutPass });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = users.find(u => u.email === email);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, JWT_SECRET);
      const { password: _, ...userWithoutPass } = user;
      res.json({ token, user: userWithoutPass });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/users/me', authenticate, (req: any, res) => {
    const user = users.find(u => u._id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...userWithoutPass } = user;
    res.json(userWithoutPass);
  });

  app.put('/api/users/me', authenticate, (req: any, res) => {
    const userIndex = users.findIndex(u => u._id === req.user.id);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    const { name, role, bio, quote, location, skills, rate, profilePic, portfolio, followers, projects } = req.body;

    users[userIndex] = {
      ...users[userIndex],
      name: name ?? users[userIndex].name,
      role: role ?? users[userIndex].role,
      bio: bio ?? users[userIndex].bio,
      quote: quote ?? (users[userIndex] as any).quote,
      location: location ?? (users[userIndex] as any).location,
      skills: skills ?? users[userIndex].skills,
      rate: rate ?? users[userIndex].rate,
      followers: followers ?? users[userIndex].followers,
      projects: projects ?? users[userIndex].projects,
      profilePic: profilePic ?? (users[userIndex] as any).profilePic,
      portfolio: portfolio ?? (users[userIndex] as any).portfolio
    };

    const { password: _, ...userWithoutPass } = users[userIndex];
    res.json(userWithoutPass);
  });

  // Search API
  app.get('/api/search', (req, res) => {
    const q = (req.query.q as string || '').toLowerCase().trim();
    if (!q) return res.json({ users: [], posts: [] });

    // Weight-based keyword matching algorithm
    const filterUsers = users.filter(u => {
      const matchName = u.name.toLowerCase().includes(q);
      const matchRole = u.role.toLowerCase().includes(q);
      const matchBio = u.bio.toLowerCase().includes(q);
      const matchSkills = u.skills.some(s => s.toLowerCase().includes(q));
      return matchName || matchRole || matchBio || matchSkills;
    }).map(({ password: _, ...u }) => u);

    const filterPosts = posts.filter(p => {
      const matchText = p.text.toLowerCase().includes(q);
      const matchCat = p.cat.toLowerCase().includes(q);
      const matchName = p.name.toLowerCase().includes(q);
      return matchText || matchCat || matchName;
    });

    res.json({ users: filterUsers, posts: filterPosts });
  });

  // API Routes
  app.get('/api/dashboard/stats', authenticate, (req: any, res) => {
    const user = users.find(u => u._id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userPosts = posts.filter(p => p.creatorId === user._id);
    const reach = (user.followers || 0) * 3.5 + userPosts.length * 12;
    const engagements = userPosts.reduce((sum, p) => sum + p.likes + p.comments, 0);

    res.json({
      reach: `${(reach / 1000).toFixed(1)}K`,
      engagements: engagements + (user.followers || 0) * 0.1,
      portfolioCount: (user as any).portfolio?.length || 0,
      followers: user.followers || 0
    });
  });

  app.get('/api/posts', (req, res) => res.json(posts));
  app.get('/api/posts/following', authenticate, (req: any, res) => {
    const user = users.find(u => u._id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const followingIds = (user as any).following || [];
    const filteredPosts = posts.filter(p => followingIds.includes(p.creatorId));
    res.json(filteredPosts);
  });
  app.post('/api/posts', authenticate, (req: any, res) => {
    const newPost = {
      _id: String(Date.now()),
      creatorId: req.user.id,
      name: req.user.name,
      role: req.user.role,
      text: req.body.text,
      likes: 0,
      comments: 0,
      cat: req.body.cat || "General",
      time: "now",
      mediaUrl: req.body.mediaUrl,
      mediaType: req.body.mediaType
    };
    posts = [newPost, ...posts];
    res.json(newPost);
  });
  app.put('/api/posts/:id/like', (req, res) => {
    const post = posts.find(p => p._id === req.params.id);
    if (post) {
      post.likes += 1;
      res.json({ likes: post.likes });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  });

  app.get('/api/users', (req, res) => res.json(users.map(({ password: _, ...u }) => u)));
  app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u._id === req.params.id);
    if (user) {
      const { password: _, ...userWithoutPass } = user;
      res.json(userWithoutPass);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  app.post('/api/users/:id/follow', authenticate, (req: any, res) => {
    const targetId = req.params.id;
    const userId = req.user.id;
    if (targetId === userId) return res.status(400).json({ error: "Cannot follow yourself" });

    const user = users.find(u => u._id === userId);
    const target = users.find(u => u._id === targetId);
    if (!user || !target) return res.status(404).json({ error: 'User not found' });

    const following = (user as any).following || [];
    const isFollowing = following.includes(targetId);

    if (isFollowing) {
      (user as any).following = following.filter((id: string) => id !== targetId);
      target.followers = Math.max(0, (target.followers || 0) - 1);
    } else {
      (user as any).following = [...following, targetId];
      target.followers = (target.followers || 0) + 1;

      // Notify target
      notifications.push({
        _id: String(Date.now()),
        userId: targetId,
        type: "follow",
        icon: "👤",
        title: `${user.name} followed you`,
        detail: "They'll now see your dispatches in their feed.",
        time: "Just now",
        read: false,
        actionable: false,
        responded: null,
        linkId: userId,
        linkType: "profile" as any
      });
    }

    res.json({ following: (user as any).following, followers: target.followers });
  });

  app.get('/api/messages/conversations', authenticate, (req: any, res) => {
    const userConvos = conversations.filter(c => c.participants.includes(req.user.id))
      .map(c => {
        const otherId = c.participants.find((p: string) => p !== req.user.id);
        const otherUser = users.find(u => u._id === otherId);
        return {
          ...c,
          name: otherUser?.name || "Member",
          otherId
        };
      });
    res.json(userConvos);
  });

  app.post('/api/messages/start', authenticate, (req: any, res) => {
    const { partnerId } = req.body;
    let convo = conversations.find(c =>
      c.participants.includes(req.user.id) && c.participants.includes(partnerId)
    );

    if (!convo) {
      convo = {
        _id: `convo-${Date.now()}`,
        participants: [req.user.id, partnerId],
        msgs: []
      };
      conversations.push(convo);
    }
    res.json(convo);
  });

  app.post('/api/messages', authenticate, (req: any, res) => {
    const { conversationId, text } = req.body;
    const convo = conversations.find(c => c._id === conversationId);
    if (convo) {
      const msg = { from: req.user.id, text, time: new Date().toISOString() };
      convo.msgs.push(msg);

      // Notify other participant via WS
      const otherId = convo.participants.find((p: string) => p !== req.user.id);
      const client = clients.get(otherId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'message', conversationId, msg }));
      }

      // Add notification for other user
      notifications.push({
        _id: String(Date.now()),
        userId: otherId,
        type: "message",
        icon: "✉️",
        title: `New message from ${req.user.name}`,
        detail: text,
        time: "Just now",
        read: false,
        actionable: false,
        responded: null,
        linkId: req.body.conversationId,
        linkType: "message" as any
      });

      res.json({ success: true, msg });
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }
  });

  app.post('/api/users/:id/hire', authenticate, (req: any, res) => {
    const targetId = req.params.id;
    const userId = req.user.id;
    const target = users.find(u => u._id === targetId);
    if (!target) return res.status(404).json({ error: 'User not found' });

    notifications.push({
      _id: String(Date.now()),
      userId: targetId,
      type: "hire",
      icon: "💼",
      title: `Service Proposal: ${req.user.name}`,
      detail: `${req.user.name} wants to engage your services for a new assignment.`,
      time: "Just now",
      read: false,
      actionable: true,
      responded: null,
      linkId: userId,
      linkType: "profile" as any
    });

    res.json({ success: true });
  });

  app.get('/api/notifications', authenticate, (req: any, res) => {
    const userNotifs = notifications.filter(n => n.userId === req.user.id);
    res.json(userNotifs);
  });
  app.put('/api/notifications/read-all', authenticate, (req: any, res) => {
    notifications = notifications.map(n =>
      n.userId === req.user.id ? { ...n, read: true } : n
    );
    res.json({ success: true });
  });
  app.put('/api/notifications/:id/respond', authenticate, (req: any, res) => {
    const notif = notifications.find(n => n._id === req.params.id && n.userId === req.user.id);
    if (notif) {
      notif.responded = req.body.response;
      notif.read = true;
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // WebSocket logic
  wss.on('connection', (ws, req) => {
    let userId: string | null = null;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'auth') {
          const decoded = jwt.verify(data.token, JWT_SECRET) as any;
          userId = decoded.id;
          if (userId) clients.set(userId, ws);
        }
      } catch (e) {
        console.error("WS Auth failed");
      }
    });

    ws.on('close', () => {
      if (userId) clients.delete(userId);
    });
  });
}

startServer();
