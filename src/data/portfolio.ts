// Site content. Every claim here comes from portfolio-research.json (resumes, itch pages,
// Drive, or owner decisions); edit this file to change what the site says.

export type Video =
  | { kind: 'youtube'; id: string; title: string }
  | { kind: 'drive'; id: string; title: string };

export type Link = { label: string; url: string };

export type Section = { heading: string; points: string[] };

export type Project = {
  slug: string;
  title: string;
  pitch: string;
  cover: string;
  coverPixelated?: boolean;
  featured: boolean;
  meta: { label: string; value: string }[];
  status?: string;
  video?: Video;
  gallery?: { file: string; alt: string }[];
  overview: string[];
  role?: string;
  sections: Section[];
  stack: string[];
  links: Link[];
  note?: string;
};

export const profile = {
  name: 'Aaradhya Bhatiya',
  title: 'Unity Developer | Technical Artist',
  location: 'Indore, India',
  email: 'bhatiyaaaradhya@gmail.com',
  photo: 'profile.jpeg',
  intro:
    'Unity developer and technical artist building shipped games and real-time applications across mobile, WebGL and AR, with depth in gameplay architecture, animation systems and custom HLSL shader programming.',
  about: [
    'I have 3+ years of experience building games and real-time applications, with production experience taking titles from GDD through Play Store release.',
    'Most recently I owned the entire Unity client of a 3D character-driven mobile product, building its behaviour, animation, rendering and tooling systems end-to-end. Alongside that I lead development at TONIZTOZ on an original 2D pixel-art horror game, where I drive the visuals through custom HLSL shaders.',
  ],
  resume: 'Aaradhya_Bhatiya_Resume_GameDev.pdf',
  links: [
    { label: 'itch.io', url: 'https://arikiver.itch.io/' },
    { label: 'GitHub', url: 'https://github.com/Arikiver' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/aaradhya-bhatiya-ab213124a/' },
  ] as Link[],
};

export const education = {
  degree: 'B.Tech Computer Science and Engineering (spz. Gaming and Graphics)',
  school: 'UPES, Dehradun',
  dates: '2022 – 2026',
  cgpa: '7.78',
};

const driveView = (id: string) => `https://drive.google.com/file/d/${id}/view`;

export const projects: Project[] = [
  {
    slug: 'chalo-yaar',
    title: 'Chalo Yaar!',
    pitch: 'A cozy 3D travel simulator about road trips, exploration, photography, and vanlife.',
    cover: 'chaloyaar-itch-cover.png',
    featured: true,
    meta: [
      { label: 'Type', value: '3D multiplayer travel game' },
      { label: 'Dates', value: 'Jan 2026 – May 2026' },
      { label: 'Engine', value: 'Unity (URP)' },
      { label: 'Platform', value: 'Windows' },
    ],
    status: 'In development · free on itch.io',
    video: { kind: 'youtube', id: 'oYaKnmNOppA', title: 'Chalo Yaar! trailer' },
    gallery: [1, 2, 3, 4, 5, 6].map((n) => ({
      file: `chaloyaar-screenshot-0${n}.png`,
      alt: `Chalo Yaar! in-game screenshot ${n}`,
    })),
    overview: [
      'The roadtrip you and your friends always talked about. Chalo Yaar! is a cozy first-person travel experience: explore peaceful environments, drive your campervan across stylized landscapes, capture moments through photography, and enjoy the atmosphere of the journey.',
      'It was inspired by that late-night conversation where everyone suddenly decides, "Chal yaar, Goa chalte hain" — and then the trip never happens. The game captures that feeling digitally: the freedom of the road, the calm of travel, and the warmth of shared adventures.',
    ],
    sections: [
      {
        heading: 'Rendering',
        points: [
          'Procedural water shader with Worley Noise caustics, written in HLSL.',
          'Volumetric fog generated from 3D noise.',
          'GPU foliage wind simulation via vertex displacement.',
        ],
      },
      {
        heading: 'Optimisation',
        points: [
          'Reduced draw call batches from 130,000+ to under 30,000.',
          'Raised sustained framerate from 15 fps to 50+ fps through shadow caster reduction, LOD tuning and volumetric fog masking foliage culling.',
        ],
      },
      {
        heading: 'Gameplay systems',
        points: [
          'First-person exploration with a drivable campervan hub.',
          'Wildlife photography progression, inventory and survival stat systems.',
          'Modular multiplayer architecture built on Netcode for GameObjects.',
        ],
      },
    ],
    stack: ['Unity (URP)', 'C#', 'HLSL', 'Netcode for GameObjects', 'Blender'],
    links: [
      { label: 'Download on itch.io (Windows, 553 MB)', url: 'https://arikiver.itch.io/chalo-yaar' },
      { label: 'Watch on YouTube', url: 'https://www.youtube.com/watch?v=oYaKnmNOppA' },
    ],
  },
  {
    slug: 'the-god-they-buried',
    title: 'The God They Buried',
    pitch: 'An original 2D pixel-art horror game rooted in Asian folklore, built at TONIZTOZ.',
    cover: 'toniztoz.gif',
    coverPixelated: true,
    featured: true,
    meta: [
      { label: 'Role', value: 'Lead Game Developer' },
      { label: 'Studio', value: 'TONIZTOZ' },
      { label: 'Dates', value: 'Mar 2025 – Present' },
      { label: 'Team', value: 'Five-person, cross-disciplinary' },
    ],
    status: 'In active development',
    video: { kind: 'drive', id: '126qnavgo7vb0iNE021qdISF64UULAAeX', title: 'The God They Buried demo' },
    overview: [
      'An original 2D pixel-art horror game rooted in Asian folklore. As the sole senior developer I own it from storyline, storyboard and GDD through active development, leading a five-person cross-disciplinary team.',
    ],
    role: 'Technical direction and project architecture, core systems, all shader work, and mentoring juniors on Unity, Aseprite and asset workflows.',
    sections: [
      {
        heading: 'Visual development in HLSL',
        points: [
          '2D volumetric fog.',
          'A pixel-art horror lighting pipeline.',
          'Bespoke ghost and demon shaders with distortion and translucency.',
        ],
      },
      {
        heading: 'Architecture',
        points: [
          'Full project groundwork and core systems, built end-to-end.',
          'Player animation pipeline and player class architecture.',
        ],
      },
    ],
    stack: ['Unity 2D', 'C#', 'HLSL', 'Aseprite'],
    links: [
      { label: 'Watch the demo', url: driveView('126qnavgo7vb0iNE021qdISF64UULAAeX') },
      { label: 'TONIZTOZ', url: 'https://www.toniztoz.com/' },
    ],
  },
  {
    slug: 'boop',
    title: 'Boop',
    pitch: 'Sole ownership of the Unity client for a 3D character-driven companion product.',
    cover: 'boop.png',
    featured: true,
    meta: [
      { label: 'Role', value: 'Unity Developer (contract)' },
      { label: 'Dates', value: 'Jun 2026 – Sep 2026' },
      { label: 'Engine', value: 'Unity (URP)' },
      { label: 'Platform', value: 'iOS and Android' },
    ],
    status: 'Delivered through to a near-release build',
    video: { kind: 'drive', id: '1gIUUimRCxfSjxRWRU8nEoRExLu8O3LdW', title: 'Boop visual fidelity showcase' },
    overview: [
      'I took over sole ownership of the Unity client after the other Unity developers departed, delivering all gameplay, animation, rendering and tooling work through to a near-release build. The video shows the visual fidelity work.',
    ],
    sections: [
      {
        heading: 'Behaviour system',
        points: [
          '27 ScriptableObject behaviours selected from live context by requirement matching and a priority ladder.',
          'Recency-weighted random selection, so ambient behaviour reads as spontaneous rather than looping.',
          'A 20-step execution interpreter composing performances from reusable steps — anchor navigation, animation playback, gesture-scrubbed clips, rig displacement, camera control — so new behaviours are authored in the Inspector without code, alongside 11 custom editor tools.',
        ],
      },
      {
        heading: 'Animation and movement',
        points: [
          'Animations authored flush against furniture play correctly by displacing the collider-free visual rig to an interaction anchor while the physics body holds its legal position.',
          'Movement refactored onto a single-writer motor, fixing a Rigidbody/transform desync that caused drift.',
          'State-driven animation variant swapping, spring-bone secondary motion, and a frame-accurate audio cue system locked to the animator playhead.',
        ],
      },
      {
        heading: 'Rendering and performance',
        points: [
          'Three URP quality tiers with automatic device-tier detection.',
          'A zero-allocation CPU/GPU profiling overlay.',
          'On-device profiling established the engine used 6–11 ms of a 33 ms frame budget, redirecting investigation to main-thread contention.',
        ],
      },
      {
        heading: 'Platform integration',
        points: [
          'Designed and documented the bi-directional message contract between the Unity runtime and the React Native host, with an acknowledgement protocol and a two-phase handshake that removed a startup deadlock.',
          'Native plugins in Objective-C (iOS) and Java/JNI (Android) with tiered degradation across hardware capability levels.',
        ],
      },
    ],
    stack: ['Unity (URP)', 'C#', 'ScriptableObjects', 'Editor tooling', 'Objective-C', 'Java/JNI', 'React Native interop'],
    links: [
      { label: 'Watch the showcase', url: driveView('1gIUUimRCxfSjxRWRU8nEoRExLu8O3LdW') },
      { label: 'heyboop.ai', url: 'https://heyboop.ai/' },
    ],
  },
  {
    slug: 'slenderar',
    title: 'SlenderAR',
    pitch: 'The Slenderman experience in augmented reality. Step into the portal where reality fades; the woods await.',
    cover: 'slenderar-itch-cover.jpg',
    featured: true,
    meta: [
      { label: 'Type', value: 'AR horror survival' },
      { label: 'Released', value: '2025' },
      { label: 'Engine', value: 'Unity + AR Foundation' },
      { label: 'Platform', value: 'Android' },
    ],
    status: 'Free on itch.io',
    video: { kind: 'youtube', id: '1bffKKCimHk', title: 'SlenderAR gameplay' },
    gallery: [1, 2, 3, 4, 5].map((n) => ({
      file: `slenderar-screenshot-0${n}.png`,
      alt: `SlenderAR screenshot ${n}`,
    })),
    overview: [
      'Step through a mysterious AR portal and find yourself lost in dark, ominous woods where the legendary Slenderman lurks in the shadows. You move by walking in the real world as your surroundings transform into a haunting forest filled with eerie sounds, flickering lights and creeping dread.',
    ],
    sections: [
      {
        heading: 'Technical highlights',
        points: [
          'Portal-based entry from the real world into the virtual forest.',
          'Real-world walking locomotion.',
          'Player-tracking AI and dynamic audio.',
        ],
      },
    ],
    stack: ['Unity', 'C#', 'AR Foundation', 'Android'],
    links: [
      { label: 'Download on itch.io (Android APK, 130 MB)', url: 'https://arikiver.itch.io/slenderar' },
      { label: 'Watch on YouTube', url: 'https://www.youtube.com/watch?v=1bffKKCimHk' },
    ],
    note: 'Play in an open space.',
  },
  {
    slug: 'ar-vr',
    title: 'AR & VR Work',
    pitch: '15+ AR Unity projects for freelance clients: real-time tracking, indoor navigation and interactive environments.',
    cover: 'ar.png',
    featured: false,
    meta: [
      { label: 'Role', value: 'Independent contractor' },
      { label: 'Dates', value: '2024 – Present' },
      { label: 'Engine', value: 'Unity' },
      { label: 'Platforms', value: 'Desktop and mobile' },
    ],
    video: { kind: 'drive', id: '1iMk_JXJmiUd9uYt55lHy2tGyB1OgJUSP', title: 'AR/VR showreel' },
    overview: [
      'I have delivered 15+ AR Unity projects for local freelance clients, across desktop and mobile. The showreel collects AR and VR work.',
    ],
    sections: [
      {
        heading: 'Client work included',
        points: [
          'Real-time tracking systems.',
          'Indoor navigation built on 3D spatial scans.',
          'Interactive AR environments.',
        ],
      },
    ],
    stack: ['Unity', 'C#', 'AR Foundation'],
    links: [{ label: 'Watch the showreel', url: driveView('1iMk_JXJmiUd9uYt55lHy2tGyB1OgJUSP') }],
    note: 'Client projects are shown in the showreel only.',
  },
  {
    slug: 'casino-games',
    title: 'Casino Games',
    pitch: 'Four real-time casino games — Mines, Roulette, Crash and Teen Patti — built in Unity for a web platform.',
    cover: 'casino.png',
    featured: false,
    meta: [
      { label: 'Role', value: 'Independent contractor' },
      { label: 'Dates', value: '2024 – Present' },
      { label: 'Engine', value: 'Unity' },
      { label: 'Platform', value: 'Web (Unity HTML5 build)' },
    ],
    status: 'Shipped',
    video: { kind: 'drive', id: '1z-a7FEdexifu57A-EBr27j9TohTP_SBw', title: 'Casino games showcase' },
    overview: [
      'Four real-time casual casino games, shipped as Unity HTML5 builds displayed directly inside the client platform\'s website UI.',
    ],
    sections: [
      {
        heading: 'Systems',
        points: [
          'Backend API integration with live wallet systems, balance synchronisation and currency switching.',
          'RTP mathematical models and probability systems.',
          'Retention-focused gameplay loops.',
        ],
      },
    ],
    stack: ['Unity', 'C#', 'WebGL', 'Backend API integration'],
    links: [{ label: 'Watch the showcase', url: driveView('1z-a7FEdexifu57A-EBr27j9TohTP_SBw') }],
  },
  {
    slug: '2minwin',
    title: '2MinWin',
    pitch: '17+ mini-games built from scratch for a live production title by MINWIN Digital Studios.',
    cover: '2minwin.jpg',
    featured: false,
    meta: [
      { label: 'Role', value: 'Unity Developer Intern' },
      { label: 'Company', value: 'Pythrust Technologies, Gurugram' },
      { label: 'Dates', value: 'Oct 2025 – Jan 2026' },
      { label: 'Engine', value: 'Unity' },
    ],
    overview: [
      'As part of a five-person team I developed 17+ complete mini-games from scratch inside 2MinWin, implementing multiplayer, VFX, UI and SFX end-to-end for each, and working with UI and sound design to keep proposed designs replicable in engine.',
    ],
    sections: [
      {
        heading: 'Production work',
        points: [
          'Integrated the IronSource ad mediation SDK alongside analytics and backend services.',
          'Ran cross-device regression testing and tracked delivery through Asana.',
        ],
      },
    ],
    stack: ['Unity', 'C#', 'Multiplayer', 'VFX', 'IronSource'],
    links: [{ label: '2MinWin', url: 'https://www.2min.win/' }],
  },
  {
    slug: 'lucius',
    title: 'Lucius: The Endless Maze Runner',
    pitch: 'A 3D horror maze runner with procedurally generated levels and adaptive enemy AI.',
    cover: 'lucius.png',
    featured: false,
    meta: [
      { label: 'Type', value: '3D horror maze runner' },
      { label: 'Dates', value: '2024 – 2025' },
    ],
    status: 'Unreleased',
    video: { kind: 'drive', id: '1mu2ZT26Vfk42WS5KUoU2iJ8OhXhLIaPG', title: 'Lucius gameplay' },
    overview: [
      'A 3D horror maze runner where every level is generated procedurally and the enemy hunts you through it.',
    ],
    sections: [
      {
        heading: 'Technical highlights',
        points: [
          'Procedural level generation using a backtracking algorithm.',
          'Enemy AI pathfinding that adapts dynamically to the player\'s position through generated mazes.',
        ],
      },
    ],
    stack: ['Procedural generation', 'AI pathfinding'],
    links: [{ label: 'Watch gameplay', url: driveView('1mu2ZT26Vfk42WS5KUoU2iJ8OhXhLIaPG') }],
  },
];

export const focusAreas = [
  {
    title: 'Shaders and rendering',
    text: 'Custom HLSL: Worley-noise water caustics, 3D-noise volumetric fog and GPU foliage wind in Chalo Yaar!; 2D volumetric fog, horror lighting and ghost shaders in The God They Buried.',
    links: ['chalo-yaar', 'the-god-they-buried'],
  },
  {
    title: 'Gameplay and animation systems',
    text: 'A data-driven behaviour system with 27 ScriptableObject behaviours, a 20-step execution interpreter and 11 editor tools; spring-bone motion and animator-locked audio cues.',
    links: ['boop'],
  },
  {
    title: 'Optimisation',
    text: 'Draw call batches cut from 130,000+ to under 30,000 and framerate raised from 15 to 50+ fps; three URP quality tiers with device-tier detection.',
    links: ['chalo-yaar', 'boop'],
  },
  {
    title: 'Multiplayer',
    text: 'Modular multiplayer architecture on Netcode for GameObjects, and multiplayer across 17+ mini-games in a live title.',
    links: ['chalo-yaar', '2minwin'],
  },
  {
    title: 'AR',
    text: '15+ client AR projects covering tracking and indoor navigation from 3D spatial scans, plus SlenderAR, a portal-based AR horror game.',
    links: ['ar-vr', 'slenderar'],
  },
];

export const experience = [
  {
    role: 'Unity Developer',
    org: 'Boop',
    mode: 'Remote / Contract',
    dates: 'Jun 2026 – Sep 2026',
    summary: 'Sole owner of the Unity client for a 3D companion product: behaviour, animation, rendering and tooling systems through to a near-release build.',
    projects: ['boop'],
  },
  {
    role: 'Lead Game Developer',
    org: 'TONIZTOZ',
    mode: 'Remote',
    dates: 'Mar 2025 – Present',
    summary: 'Leading a five-person team on an original 2D pixel-art horror game; architecture, core systems, HLSL visual development and mentoring.',
    projects: ['the-god-they-buried'],
  },
  {
    role: 'Unity Developer Intern',
    org: 'Pythrust Technologies',
    mode: 'Gurugram, India',
    dates: 'Oct 2025 – Jan 2026',
    summary: '17+ mini-games for 2MinWin by MINWIN Digital Studios; IronSource, analytics and backend integration; cross-device QA.',
    projects: ['2minwin'],
  },
  {
    role: 'Independent Contractor',
    org: 'Freelance',
    mode: 'Remote / Contract',
    dates: '2024 – Present',
    summary: '15+ AR Unity projects and four shipped real-time casino games with backend integration and RTP models.',
    projects: ['ar-vr', 'casino-games'],
  },
];

export const skills = [
  { group: 'Languages', items: ['C#', 'C/C++', 'HLSL', 'GML', 'Python', 'JavaScript', 'SQL'] },
  {
    group: 'Engines and graphics',
    items: ['Unity 3D/2D (URP)', 'GameMaker Studio', 'Custom HLSL shaders', 'Shader Graph', 'OpenGL 3.3', 'WebGL', 'Real-time VFX', 'Planar reflections', 'Procedural generation', 'Profiling and optimisation'],
  },
  {
    group: 'Gameplay systems',
    items: ['Behaviour and state architecture', 'Animation systems and state machines', 'Character controllers', 'Rigidbody physics', 'AI pathfinding', 'Netcode for GameObjects', 'Custom editor tooling'],
  },
  {
    group: 'Pipeline and tools',
    items: ['Android and iOS builds', 'Play Store submission', 'IronSource ad mediation', 'Native plugins (Objective-C, Java/JNI)', 'Cross-device QA', 'Blender', 'Aseprite', 'Figma', 'Pixel art', 'Git/GitHub', 'JIRA', 'Asana'],
  },
];

export const otherWork = [
  {
    title: 'Himeji Castle',
    kind: 'Blender environment',
    text: 'A creative interpretation of Himeji Castle in front of Mount Fuji, with particle emitters and wind physics animating sakura petals, and camera work for a bokeh effect.',
    image: 'Himeji castle.png',
    link: { label: 'Render and video', url: 'https://drive.google.com/drive/folders/10Iq7DFO_q4Xh09AojgfRaRQKPMe-KS5c' },
  },
  {
    title: 'AssistSense',
    kind: 'Python desktop automation',
    text: 'Macro engine with timed input recording and IF/ELIF/ELSE playback, a wake-word voice listener, multi-modal triggers and a PyQt6 interface. Built in a two-person team.',
  },
  {
    title: 'Questify',
    kind: 'Gamified task manager',
    text: 'A C# task manager integrating a GraphQL API and GitHub activity tracking to verify real user productivity.',
  },
];
