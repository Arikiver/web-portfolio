// Site content. Every claim here comes from the owner's résumés (Game Developer and Game Designer
// editions, Nov 2026), portfolio-research.json (itch pages, Drive, owner decisions) or owner
// decisions; edit this file to change what the site says.

export type Video =
  | { kind: 'youtube'; id: string; title: string }
  | { kind: 'drive'; id: string; title: string };

export type Link = { label: string; url: string };

export type Section = { heading: string; points: string[] };

/** The three hats; projects list the ones they show. */
export type Discipline = 'development' | 'technical-art' | 'design';

export const disciplineLabel: Record<Discipline, string> = {
  development: 'Development',
  'technical-art': 'Technical art',
  design: 'Design',
};

export type Project = {
  slug: string;
  title: string;
  pitch: string;
  /** File in /images (subfolders allowed, e.g. 'Roblox/icon_title.png'). */
  cover: string;
  coverPixelated?: boolean;
  /** Focal point when the cover is cropped into a non-square card. */
  coverPosition?: string;
  /** Wide image for the project page hero (file in /images), and its focal point. */
  banner?: string;
  bannerPosition?: string;
  featured: boolean;
  disciplines: Discipline[];
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
  title: 'Game Developer · Technical Artist · Game Designer',
  /** One-line headline for the hero. */
  headline: 'Game developer, technical artist and game designer',
  focus: ['Unity', 'Roblox (Luau)', 'HLSL shaders', 'Gameplay systems', 'Systems and balance design'],
  location: 'Indore, India',
  email: 'bhatiyaaaradhya@gmail.com',
  photo: 'profile.jpeg',
  /** The one hard fact for the first screen. */
  fact: '3+ years building shipped games and real-time applications across mobile, WebGL, AR and Roblox.',
  intro:
    'I take games from GDD to release: gameplay architecture and data-driven systems, custom HLSL shaders and visual development, and systems design backed by numerical balancing.',
  about: [
    'I take ideas from concept to release on my own: design, configure the content in data, implement it, playtest and iterate. I am comfortable working inside existing codebases and toolchains, scripting in C#, Luau and SQL, and creating or adapting game art myself through pixel art, Blender and custom HLSL shaders.',
    'Recently I owned the full Unity client of a 3D companion app, lead a five-person team on an original horror game, and designed and built a large co-op Roblox game end-to-end with an AI-assisted workflow. Clear, practical documentation is part of how I work.',
  ],
  resume: 'Aaradhya_Bhatiya_Resume_GameDeveloper.pdf',
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
    slug: 'paranormal-inc',
    title: 'Paranormal Inc.',
    pitch: 'A 1–4 player co-op horror investigation game on Roblox, designed and built end-to-end.',
    cover: 'Roblox/icon_title.png',
    coverPosition: '50% 100%',
    // Screenshots carry a caption along the bottom; anchoring to the top crops it out.
    banner: 'Roblox/06_keyart_revenant_hallway_title.png',
    bannerPosition: '50% 0%',
    featured: true,
    disciplines: ['design', 'development'],
    meta: [
      { label: 'Type', value: 'Co-op horror investigation' },
      { label: 'Role', value: 'Lead designer and developer' },
      { label: 'Dates', value: '2026 – Present' },
      { label: 'Engine', value: 'Roblox (Luau)' },
      { label: 'Players', value: '1–4, persistent progression' },
    ],
    status: 'Playable, playtested build',
    gallery: [
      { file: 'Roblox/01_hq_overview_title.png', alt: 'Paranormal Inc.: The crew headquarters hub' },
      { file: 'Roblox/02_hq_case_board_title.png', alt: 'Paranormal Inc.: The case board in the headquarters, with clues pinned to it' },
      { file: 'Roblox/03_bloodmoon_house_title.png', alt: 'Paranormal Inc.: A house under a red blood moon' },
      { file: 'Roblox/04_bloodmoon_graveyard_title.png', alt: 'Paranormal Inc.: A graveyard at night under the red blood moon' },
      { file: 'Roblox/05_house_hallway_flashlight_title.png', alt: 'Paranormal Inc.: A dark house hallway lit by a flashlight' },
      { file: 'Roblox/06_keyart_revenant_hallway_title.png', alt: 'Paranormal Inc.: Key art: a ghostly figure at the end of a dark hallway' },
      { file: 'Roblox/07_revenant_close_title.png', alt: 'Paranormal Inc.: A revenant seen close up in a corridor' },
      { file: 'Roblox/08_camcorder_evidence_title.png', alt: 'Paranormal Inc.: Holding the camcorder to catch evidence in a dark hallway' },
      { file: 'Roblox/09_store_exterior_title.png', alt: 'Paranormal Inc.: The abandoned convenience store at night, with a van parked outside' },
      { file: 'Roblox/10_store_aisles_title.png', alt: 'Paranormal Inc.: Inside the convenience store aisles, lit by a flashlight' },
      { file: 'Roblox/11_van_drive_off_title.png', alt: 'Paranormal Inc.: The crew van driving away at night' },
      { file: 'Roblox/12_school_gym_title.png', alt: 'Paranormal Inc.: A dark corridor inside Ravenwood Elementary' },
      { file: 'Roblox/13_school_classroom_title.png', alt: 'Paranormal Inc.: A classroom in the school' },
      { file: 'Roblox/14_school_exterior_title.png', alt: 'Paranormal Inc.: The school exterior at night, with a school bus' },
      { file: 'Roblox/15_motel_exterior_title.png', alt: 'Paranormal Inc.: The old motel at night, with a van parked out front' },
      { file: 'Roblox/16_motel_corridor_title.png', alt: 'Paranormal Inc.: A motel corridor' },
      { file: 'Roblox/17_lobby_vans_title.png', alt: 'Paranormal Inc.: The lobby, where players pick a van' },
    ],
    overview: [
      'A first-person co-op horror investigation game for 1–4 players with persistent progression: 4 maps (80 rooms), 5 entities each with a unique 3-of-7 evidence fingerprint, 10 upgradeable devices, 45 paranormal events and 12 location stories.',
      'I own it from concept to a playable, playtested build: design, configuring the content in data, implementation in Luau, then playtesting and iteration.',
    ],
    role: 'Lead designer and developer: the core loop, systems and balance, all implementation, and playtest-driven updates.',
    sections: [
      {
        heading: 'Game design',
        points: [
          'The core loop, 4 maps (80 rooms), 5 enemy types each with a unique 3-of-7 evidence fingerprint, 10 upgradeable tools with tier-2 versions, and 45 scripted events.',
          '5 enemy types with distinct behaviours and counters, an escalating 5-stage threat model, and events paced by stage, with rare set pieces and quiet periods.',
        ],
      },
      {
        heading: 'Progression and economy',
        points: [
          'A 16-rank reputation curve tuned by Monte Carlo simulation of ~12-minute sessions: new content after almost every early job, the hardest tier at ~16 hours, top rank at ~35 hours, with map and tier unlocks staggered to keep goals in view.',
          'Itemized payouts (evidence, photos, objectives, identification) with a co-op bonus of +10% per teammate, softened failure and death payouts, penalties for wrong answers, and one-time first-clear and story rewards; gear prices and reputation gates act as sinks.',
        ],
      },
      {
        heading: 'Difficulty and pacing',
        points: [
          '5 difficulty tiers built from separate levers: enemy aggression growth, grace period, attack thresholds, cooldowns, attack duration and speed, sanity drain, item effectiveness, hidden-information chance and spawn weights. Rewards scale ×1 to ×5.',
          'An agitation-based pacing model: threat follows a baseline curve plus player-driven provocation spikes, with stage-based event cadence, quiet periods after big moments, and rare events rolled once per session.',
        ],
      },
      {
        heading: 'Live-style content',
        points: [
          'Rotating side objectives (10 types), 12 location stories with randomized clue placement, and a rare 3% blood-moon event with its own deduction puzzle, all driven from configuration.',
          'An HQ hub with social activities, and fair monetization: revives and private servers only, nothing that affects balance.',
        ],
      },
      {
        heading: 'Multiplayer and live service',
        points: [
          'Lobby-to-crew-server teleports with a host and voting flow, session-locked DataStore saves and MemoryStore private-server listings.',
          'Voice-driven mechanics using mic loudness and speech-to-text.',
        ],
      },
      {
        heading: 'Architecture and tools',
        points: [
          'Server-authoritative, ~43k lines of Luau: 38 services, 40 client controllers and 15 data-definition modules, so all balance is data and tuning never needs code.',
          'Built with an AI-assisted workflow (Claude via Roblox Studio MCP) and 25 in-house editor tools; every system reviewed and playtested, including client-side snapshot interpolation for smooth AI movement.',
        ],
      },
      {
        heading: 'Iteration and documentation',
        points: [
          'Multiple structured playtest rounds of 20–25 feedback items each, all triaged, shipped and documented, including re-pacing the whole game when players said too much happened too fast.',
        ],
      },
    ],
    stack: ['Roblox Studio', 'Luau', 'DataStore', 'MemoryStore', 'TeleportService', 'MarketplaceService', 'Voice and audio API', 'Monte Carlo simulation', 'Claude via Roblox Studio MCP'],
    links: [{ label: 'Play on Roblox', url: 'https://www.roblox.com/games/84916613959771' }],
  },
  {
    slug: 'chalo-yaar',
    title: 'Chalo Yaar!',
    pitch: 'A cozy 3D travel simulator about road trips, exploration, photography, and vanlife.',
    cover: 'chaloyaar-itch-cover.png',
    banner: 'chaloyaar-itch-background.png',
    bannerPosition: '50% 45%',
    featured: true,
    disciplines: ['development', 'technical-art', 'design'],
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
        heading: 'Design and gameplay systems',
        points: [
          'Designed a cozy progression loop: a drivable campervan hub, wildlife photography progression, inventory and survival stats.',
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
      { label: 'Full showcase (Google Drive)', url: driveView('1KkieP9slHRFRl7YmbWSE84LF88rfoGQb') },
    ],
  },
  {
    slug: 'the-god-they-buried',
    title: 'The God They Buried',
    pitch: 'An original 2D pixel-art horror game rooted in Asian folklore, built at TONIZTOZ.',
    cover: 'toniztoz.gif',
    coverPixelated: true,
    featured: true,
    disciplines: ['design', 'technical-art', 'development'],
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
    role: 'Design ownership from storyline, storyboard and GDD onward; setting priorities and direction for the team; technical direction and project architecture, core systems, all shader work, and mentoring juniors on Unity, Aseprite and asset workflows.',
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
    disciplines: ['development', 'design'],
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
    banner: 'slenderar-itch-background.jpg',
    bannerPosition: '35% 60%',
    featured: true,
    disciplines: ['development', 'design'],
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
      { label: 'Playtest footage (Google Drive)', url: driveView('1RoG6BoumUp7bktaa1O9LrWjW650XPstF') },
      { label: 'Full playthrough (Google Drive)', url: driveView('1K9-HDN53aUhRCyGS1xclat-_x72OZvib') },
    ],
    note: 'Play in an open space.',
  },
  {
    slug: 'casino-games',
    title: 'Casino Games',
    pitch: 'Four real-time casino games — Mines, Roulette, Crash and Teen Patti — whose numbers I designed and built in Unity for a web platform.',
    cover: 'casino.png',
    featured: false,
    disciplines: ['design', 'development'],
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
        heading: 'Design: the numbers',
        points: [
          'Designed the RTP mathematical models, probability systems and payout balance for all four games.',
          'Retention-focused gameplay loops.',
        ],
      },
      {
        heading: 'Systems',
        points: [
          'Backend API integration with live wallet systems, balance synchronisation and currency switching.',
        ],
      },
    ],
    stack: ['Unity', 'C#', 'WebGL', 'Backend API integration'],
    links: [{ label: 'Watch the showcase', url: driveView('1z-a7FEdexifu57A-EBr27j9TohTP_SBw') }],
  },
  {
    slug: 'ar-vr',
    title: 'AR & VR Work',
    pitch: '15+ AR Unity projects for freelance clients: real-time tracking, indoor navigation and interactive environments.',
    cover: 'ar.png',
    featured: false,
    disciplines: ['development'],
    meta: [
      { label: 'Role', value: 'Independent contractor' },
      { label: 'Dates', value: '2024 – Present' },
      { label: 'Engine', value: 'Unity' },
      { label: 'Platforms', value: 'Desktop and mobile' },
    ],
    video: { kind: 'drive', id: '1iMk_JXJmiUd9uYt55lHy2tGyB1OgJUSP', title: 'AR/VR showreel' },
    overview: [
      'I have delivered 15+ AR Unity projects for local freelance clients across desktop and mobile, owning each from requirements to delivery. The showreel collects AR and VR work.',
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
    slug: '2minwin',
    title: '2MinWin',
    pitch: '17+ mini-games built from scratch for a live production title by MINWIN Digital Studios.',
    cover: '2minwin.jpg',
    featured: false,
    disciplines: ['development'],
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
    disciplines: ['development', 'design'],
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

/** The three hats, each with résumé facts and the projects that show it. */
/** The three hats, each with résumé figures (animated counters) and the projects that show it. */
export const disciplines: {
  id: Discipline;
  title: string;
  text: string;
  stats: { value: string; label: string }[];
  links: string[];
}[] = [
  {
    id: 'development',
    title: 'Game development',
    text: 'Gameplay architecture and data-driven systems in Unity (C#) and Roblox (Luau): behaviour and state systems, animation, physics, AI pathfinding, server-authoritative multiplayer and custom editor tooling.',
    stats: [
      { value: '27', label: 'data-driven behaviours run by a 20-step interpreter' },
      { value: '43k', label: 'lines of server-authoritative Luau' },
      { value: '17+', label: 'mini-games built for a live title' },
    ],
    links: ['boop', 'paranormal-inc', '2minwin'],
  },
  {
    id: 'technical-art',
    title: 'Technical art',
    text: 'Custom HLSL shaders and visual development: volumetric fog and lighting, Worley-noise water caustics, GPU foliage wind and a pixel-art horror lighting pipeline, backed by profiling and optimisation.',
    stats: [
      { value: '130k → 30k', label: 'draw-call batches after optimisation' },
      { value: '15 → 50+', label: 'sustained fps after the same pass' },
      { value: '3', label: 'URP quality tiers with device detection' },
    ],
    links: ['chalo-yaar', 'the-god-they-buried'],
  },
  {
    id: 'design',
    title: 'Game design',
    text: 'Systems, progression and economy design backed by numerical balancing: probability and RTP models, Monte Carlo-tuned progression, difficulty built from separate levers, encounter and pacing design, GDDs and playtest-driven iteration.',
    stats: [
      { value: '16', label: 'rank progression tuned with Monte Carlo simulation' },
      { value: '5', label: 'difficulty tiers built from ~12 levers each' },
      { value: '4', label: 'shipped casino games with RTP models I designed' },
    ],
    links: ['paranormal-inc', 'casino-games', 'the-god-they-buried'],
  },
];

export const experience = [
  {
    role: 'Lead designer and developer',
    org: 'Paranormal Inc.',
    mode: 'Independent project · Roblox',
    dates: '2026 – Present',
    summary: 'Designing and building a co-op horror investigation game end-to-end: difficulty tiers, a simulation-tuned 16-rank progression curve, an itemized reward economy, 45 scripted events and playtest-driven updates.',
    projects: ['paranormal-inc'],
  },
  {
    role: 'Unity Developer',
    org: 'Boop',
    mode: 'Remote, contract',
    dates: 'Jun 2026 – Sep 2026',
    summary: 'Took over the Unity client of a 3D companion app mid-development and delivered it to a near-release build on my own: a data-driven behaviour system I designed, animation, rendering and designer-facing tools.',
    projects: ['boop'],
  },
  {
    role: 'Lead Game Developer',
    org: 'TONIZTOZ',
    mode: 'Remote',
    dates: 'Mar 2025 – Present',
    summary: 'Leading a five-person cross-disciplinary team on an original 2D pixel-art horror game: I own its design from storyline, storyboard and GDD, set technical direction, and drive the look through custom HLSL shaders.',
    projects: ['the-god-they-buried'],
  },
  {
    role: 'Unity Developer Intern',
    org: 'Pythrust Technologies',
    mode: 'Gurugram, India',
    dates: 'Oct 2025 – Jan 2026',
    summary: 'Built 17+ complete mini-games for 2MinWin, a live title by MINWIN Digital Studios, working with UI and sound design to keep designs achievable in engine, with IronSource ads, analytics events and cross-device QA.',
    projects: ['2minwin'],
  },
  {
    role: 'Independent Contractor',
    org: 'Freelance',
    mode: 'Remote',
    dates: '2024 – Present',
    summary: 'Designed the numbers for four shipped real-time casino games (RTP models, probability systems and payout balance) and delivered 15+ AR projects, owning each from requirements to delivery.',
    projects: ['casino-games', 'ar-vr'],
  },
];

export const skills = [
  { group: 'Languages', items: ['C#', 'Luau/Lua', 'C/C++', 'HLSL', 'GML', 'Python', 'JavaScript', 'SQL'] },
  {
    group: 'Engines',
    items: ['Unity 3D/2D (URP)', 'Roblox Studio', 'Source 2 (Half-Life: Alyx modding)', 'GameMaker Studio', 'Proprietary in-house engines', 'Custom engine architecture'],
  },
  {
    group: 'Gameplay and systems',
    items: ['Behaviour and state architecture', 'Animation systems and state machines', 'Character controllers', 'Physics', 'AI pathfinding', 'Server-authoritative multiplayer (Netcode for GameObjects, Roblox)', 'Data-driven content pipelines', 'Custom editor tooling'],
  },
  {
    group: 'Technical art',
    items: ['Custom HLSL shaders', 'Shader Graph', 'Real-time VFX', 'Volumetric fog and lighting', 'Planar reflections', 'Procedural generation', 'OpenGL 3.3', 'WebGL', 'Profiling and optimisation', 'Blender', 'Aseprite', 'Pixel art'],
  },
  {
    group: 'Game design',
    items: ['Systems and progression design', 'Economy and numerical balancing (RTP and probability models, Monte Carlo simulation)', 'Difficulty tuning', 'Encounter and pacing design', 'GDDs', 'Playtest-driven iteration'],
  },
  {
    group: 'Roblox platform',
    items: ['DataStore (session-locked saves)', 'MemoryStore', 'TeleportService and reserved servers', 'MarketplaceService', 'Voice and audio API'],
  },
  {
    group: 'Pipeline and tools',
    items: ['Android/iOS builds', 'Play Store submission', 'IronSource', 'Analytics', 'Native plugins (Objective-C, Java/JNI)', 'React Native interop', 'Cross-device QA', 'AI-assisted development (Claude Code, Roblox Studio MCP)', 'Git/GitHub', 'JIRA', 'Asana', 'Figma'],
  },
];

/* ---------- Lab: everything else from the portfolio Drive, the AssistSense repo and side work ---------- */

export type LabCategory = 'engines' | 'games' | 'tech-art' | 'blender' | 'pixel';

export const labCategoryLabel: Record<LabCategory, string> = {
  engines: 'Engines & tools',
  games: 'Games & prototypes',
  'tech-art': 'Shaders & motion',
  blender: 'Blender',
  pixel: 'Pixel art',
};

export type LabItem = {
  id: string;
  title: string;
  /** Short medium / context line. */
  kind: string;
  category: LabCategory;
  year?: string;
  text: string;
  points?: string[];
  stack?: string[];
  /** Stills from /images; the first is the card image. */
  images?: string[];
  /** Pixel-art sprites from /images, shown unsmoothed. */
  sprites?: { file: string; alt: string }[];
  /** Brand mark shown whole on a solid background instead of a still. */
  logo?: { svg: 'assistsense'; bg: string };
  /** Google Drive video played in the viewer. */
  video?: { id: string; length: string };
  links: Link[];
  /** Spans two grid columns on wide screens. */
  wide?: boolean;
};

const driveFolder = (id: string) => `https://drive.google.com/drive/folders/${id}`;

/** The whole portfolio folder on Google Drive. */
export const driveArchive = driveFolder('1IPBCjdRn0tulM7xojXfIyYjYkTnx51yU');

export const lab: LabItem[] = [
  {
    id: 'alyx-mod',
    title: 'Half-Life: Alyx mod',
    kind: 'Source 2 · Hammer',
    category: 'engines',
    text: 'Mod work for Half-Life: Alyx in Valve’s Source 2 tools: spaces built in the Hammer editor and playtested in-engine. Beyond Unity and Roblox I have worked in proprietary in-house engines and know how a custom engine is architected and built.',
    images: ['lab/source-alyx.jpg', 'lab/source-alyx-2.jpg'],
    video: { id: '1r2Xh1ESMqrQNh5n0zQi5U7X1YyX2YyKy', length: '1:13' },
    stack: ['Source 2', 'Hammer', 'Half-Life: Alyx Workshop Tools'],
    links: [{ label: 'Watch on Google Drive', url: driveView('1r2Xh1ESMqrQNh5n0zQi5U7X1YyX2YyKy') }],
    wide: true,
  },
  {
    id: 'feasts-and-fables',
    title: 'Feasts & Fables',
    kind: 'Pixel-art cooking RPG',
    category: 'games',
    year: '2025',
    text: 'A tavern-and-dungeon game: head down into an isometric pixel-art dungeon to fight its creatures and gather ingredients, then cook from the recipe book to fill the orders of the guests waiting at the tavern.',
    images: ['lab/feasts-and-fables.jpg', 'lab/feasts-and-fables-2.jpg'],
    video: { id: '1k-QQBjAf_nswZ4Cp7wf_dIIeLQxfQDah', length: '2:23' },
    links: [
      { label: 'Watch on Google Drive', url: driveView('1k-QQBjAf_nswZ4Cp7wf_dIIeLQxfQDah') },
      { label: 'Project folder', url: driveFolder('18_Kw4aAqh5xBZuftXrvesmMJJigZCWT2') },
    ],
    wide: true,
  },
  {
    id: 'assistsense',
    title: 'AssistSense',
    kind: 'Python desktop automation',
    category: 'engines',
    year: '2025',
    text: 'A PC automation manager that runs macros from hand gestures, gaze detection and voice commands. Built in a two-person team.',
    points: [
      'Macro engine with timed input recording and IF/ELIF/ELSE playback; positions are stored normalised, so a macro replays on any screen resolution.',
      'Hand-gesture and gaze tracking from the webcam with MediaPipe and OpenCV.',
      'Wake-word voice listener with offline speech recognition (Vosk) and a multi-modal trigger dispatcher.',
      'Custom PyQt6 interface.',
    ],
    logo: { svg: 'assistsense', bg: '#000' },
    stack: ['Python', 'PyQt6', 'MediaPipe', 'OpenCV', 'Vosk'],
    links: [{ label: 'Source on GitHub', url: 'https://github.com/NavySaw23/AssistSense' }],
  },
  {
    id: 'questify',
    title: 'Questify',
    kind: 'Gamified task manager',
    category: 'games',
    year: '2024',
    text: 'A C# task manager that verifies real productivity through a GraphQL API and GitHub activity tracking. Tasks carry a difficulty and pay out points when completed, inside a pixel-art world with turn-based battles and treasure to find.',
    images: ['lab/questify.jpg', 'lab/questify-2.jpg'],
    video: { id: '1na1UvksidDMB4rjn3ypSMUGCrZfxCgoC', length: '2:29' },
    stack: ['C#', 'GraphQL'],
    links: [
      { label: 'Watch the demo', url: driveView('1na1UvksidDMB4rjn3ypSMUGCrZfxCgoC') },
      { label: 'Project folder', url: driveFolder('18tPgMMLOqlX9nFiKS_qoykYIJajOnydn') },
    ],
  },
  {
    id: 'water-shader',
    title: 'Stylised water',
    kind: 'Shader programming',
    category: 'tech-art',
    text: 'A water shader demo: depth-tinted transparency over the sand, animated shoreline foam and sun glints on the surface.',
    images: ['lab/water-shader.jpg', 'lab/water-shader-2.jpg'],
    video: { id: '1wLZJBbWDxyc11s9tCwr85KceozpofH-U', length: '0:36' },
    stack: ['Unity', 'Shaders'],
    links: [{ label: 'Watch on Google Drive', url: driveView('1wLZJBbWDxyc11s9tCwr85KceozpofH-U') }],
  },
  {
    id: 'pixel-art',
    title: 'Pixel art',
    kind: 'Sprites and scenes',
    category: 'pixel',
    year: '2025',
    text: 'Characters, creatures and scenes: folklore ghosts such as the pontianak and krasue, a knight, a cyber-centaur, a bus-window title scene and an eight-frame candle loop.',
    sprites: [
      { file: 'lab/pixel/knight.png', alt: 'Armoured knight' },
      { file: 'lab/pixel/krasue-01.png', alt: 'Krasue, a floating folklore ghost' },
      { file: 'lab/pixel/cybercentaur.png', alt: 'Cyber-centaur with twin pistols' },
      { file: 'lab/pixel/ghost.png', alt: 'Long-tongued ghost' },
      { file: 'lab/pixel/pontianak.gif', alt: 'Pontianak ghost, animated' },
      { file: 'lab/pixel/abraham1.png', alt: 'Caped warrior' },
      { file: 'lab/pixel/paparazzi.png', alt: 'Shadowy figure in a trench coat' },
      { file: 'lab/pixel/bustitlescene.png', alt: 'Title scene: a passenger at a bus window' },
      { file: 'lab/pixel/foregroundsilhouette.png', alt: 'Silhouetted village skyline' },
    ],
    stack: ['Pixel art', 'Sprite animation'],
    links: [{ label: 'Pixel art folder', url: driveFolder('1V_FXm4vllIXooeOWwsRxcV9KpmwunOzI') }],
    wide: true,
  },
  {
    id: 'ggj-911',
    title: '911',
    kind: 'Global Game Jam',
    category: 'games',
    text: 'A hand-drawn, sketchbook-style 2D runner made at Global Game Jam.',
    images: ['lab/ggj-911.jpg'],
    video: { id: '1V4sXVNiqRM3_T5bDQdBF9RPnUzBfn4XI', length: '0:35' },
    links: [{ label: 'Watch gameplay', url: driveView('1V4sXVNiqRM3_T5bDQdBF9RPnUzBfn4XI') }],
  },
  {
    id: 'himeji',
    title: 'Himeji Castle',
    kind: 'Blender environment',
    category: 'blender',
    year: '2024',
    text: 'A creative interpretation of Himeji Castle in front of Mount Fuji, with particle emitters and wind physics animating sakura petals, and camera work for a bokeh effect.',
    images: ['Himeji castle.png', 'lab/himeji-viewport.jpg'],
    video: { id: '1VuFisoCUSwrHld3dpTSCOmUxqKBrg9N8', length: '0:56' },
    stack: ['Blender', 'Particles', 'Physics'],
    links: [
      { label: 'Watch the fly-through', url: driveView('1VuFisoCUSwrHld3dpTSCOmUxqKBrg9N8') },
      { label: 'Render and video folder', url: driveFolder('10Iq7DFO_q4Xh09AojgfRaRQKPMe-KS5c') },
    ],
    wide: true,
  },
  {
    id: 'fishnet',
    title: 'FishNet multiplayer',
    kind: 'Unity networking prototype',
    category: 'engines',
    year: '2026',
    text: 'A turn-based 2D multiplayer prototype on the FishNet networking library: host and join flow and synchronised turns, tested side by side across two clients.',
    images: ['lab/fishnet-multiplayer.jpg'],
    video: { id: '1Xn2Lv8Dsb2IEgg6Cudd_PVsVaAVwHB61', length: '1:09' },
    stack: ['Unity', 'C#', 'FishNet'],
    links: [{ label: 'Watch on Google Drive', url: driveView('1Xn2Lv8Dsb2IEgg6Cudd_PVsVaAVwHB61') }],
  },
  {
    id: 'color-theory',
    title: 'Colour theory, animated',
    kind: '2D animation',
    category: 'tech-art',
    year: '2023',
    text: 'A hand-drawn explainer that makes the basics of colour theory easier to understand: hue, tint, tone and shade, colour harmonies and Gestalt principles. Animated in FlipaClip, effects and final render in After Effects, stop-motion visuals and logos in Photoshop; every asset is hand-made.',
    images: ['lab/color-theory.jpg'],
    video: { id: '1QVK3pNVDA8it543__k_aoz4806m8hlbe', length: '2:48' },
    stack: ['FlipaClip', 'After Effects', 'Photoshop'],
    links: [
      { label: 'Watch on Google Drive', url: driveView('1QVK3pNVDA8it543__k_aoz4806m8hlbe') },
      { label: 'Project folder', url: driveFolder('1XEg-Su3FEzQszAqrw76JL-g0Cz369WhL') },
    ],
  },
  {
    id: 'ball-battle',
    title: 'Ball Battle',
    kind: 'Unity assignment',
    category: 'games',
    year: '2026',
    text: 'A cat-versus-dog arena battler with health bars, hit effects and camera shake, plus a full walkthrough of building it.',
    images: ['lab/ball-battle.jpg'],
    video: { id: '1u25v0pAVhK8jDcvS1dI91NJOznY7vFGP', length: '0:15' },
    stack: ['Unity', 'C#'],
    links: [
      { label: 'Watch gameplay', url: driveView('1u25v0pAVhK8jDcvS1dI91NJOznY7vFGP') },
      { label: 'Build walkthrough', url: driveView('1_5vkcT3bcMOmHLpOT5sKRn9OQr-Bj5wb') },
    ],
  },
  {
    id: 'roll-a-ball',
    title: 'Gyro Roll-a-Ball',
    kind: 'Unity · Android',
    category: 'games',
    year: '2024',
    text: 'A roll-a-ball game for Android steered by tilting the phone, made to learn Android integration, a custom gyroscope input system and a following camera.',
    images: ['lab/roll-a-ball.jpg'],
    video: { id: '17abmqzt7i_tntL7lzwbzm1Ijrw7UJay-', length: '0:24' },
    stack: ['Unity', 'C#', 'Android'],
    links: [{ label: 'Watch gameplay', url: driveView('17abmqzt7i_tntL7lzwbzm1Ijrw7UJay-') }],
  },
  {
    id: 'semester-showreel',
    title: '4th-semester showreel',
    kind: 'Unity coursework',
    category: 'games',
    year: '2024',
    text: 'A semester of coursework in one reel: the gyro roll-a-ball, a candle-lit survival game with randomised runs where the light going out ends the run, and a mobile vertical shooter built to learn sprite editing in Unity.',
    images: ['lab/semester-showreel.jpg'],
    video: { id: '1LGQj7piE7zXXaiLqGli4FWIv8PyT1cHV', length: '3:50' },
    stack: ['Unity', 'C#', 'Android'],
    links: [{ label: 'Watch the showreel', url: driveView('1LGQj7piE7zXXaiLqGli4FWIv8PyT1cHV') }],
  },
  {
    id: 'bmw',
    title: 'BMW M3 E30',
    kind: 'Blender render',
    category: 'blender',
    year: '2025',
    text: 'A studio render of the classic E30 M3.',
    images: ['lab/bmw-m3-e30.jpg'],
    stack: ['Blender'],
    links: [{ label: 'Full-size render', url: driveView('1oSQ0Z-gzYD8jjgFVnuh7QMbCwfuIur5o') }],
  },
  {
    id: 'ocean',
    title: 'Night ocean',
    kind: 'Blender animation',
    category: 'blender',
    year: '2025',
    text: 'A stormy night-time ocean: heavy swells and a lone buoy light glinting across the waves.',
    images: ['lab/ocean-render.jpg'],
    video: { id: '1nK13NViWE02FmuHESZejh6Vk5ZcTREHw', length: '0:13' },
    stack: ['Blender'],
    links: [{ label: 'Watch on Google Drive', url: driveView('1nK13NViWE02FmuHESZejh6Vk5ZcTREHw') }],
  },
  {
    id: 'desert',
    title: 'Desert storm',
    kind: 'Blender animation',
    category: 'blender',
    year: '2025',
    text: 'A short animated shot: a lone figure on a red desert under a giant moon, then a towering fire storm.',
    images: ['lab/desert-render.jpg'],
    video: { id: '1bHN4ZXP_idfI3KuzpJXAHNWXwTXZp9l9', length: '0:03' },
    stack: ['Blender'],
    links: [{ label: 'Watch on Google Drive', url: driveView('1bHN4ZXP_idfI3KuzpJXAHNWXwTXZp9l9') }],
  },
  {
    id: 'furniture',
    title: 'Furniture interiors',
    kind: 'Blender renders',
    category: 'blender',
    year: '2025',
    text: 'Two modelled and lit interiors: an isometric bedroom diorama and a warm evening lounge.',
    images: ['lab/furniture-room.jpg', 'lab/furniture-lounge.jpg'],
    stack: ['Blender'],
    links: [{ label: 'Renders folder', url: driveFolder('1pzD5rexm3tAqXkBd9DBmAti0Ec9IEj9N') }],
  },
  {
    id: 'iphone',
    title: 'iPhone launch spot',
    kind: 'Blender animation',
    category: 'blender',
    year: '2024',
    text: 'A product-launch style animation: phones turning and separating against a clean studio backdrop.',
    images: ['lab/iphone-render.jpg'],
    video: { id: '11ow3Dr4mWPbO00GevBonArhSqiwcYZ2l', length: '0:16' },
    stack: ['Blender'],
    links: [{ label: 'Watch on Google Drive', url: driveView('11ow3Dr4mWPbO00GevBonArhSqiwcYZ2l') }],
  },
  {
    id: 'donut',
    title: 'The donut',
    kind: 'Blender render and animation',
    category: 'blender',
    year: '2025',
    text: 'The Blender rite of passage, taken to a lit studio render and a short animation.',
    images: ['lab/donut-render.jpg'],
    video: { id: '1MN7EHLerymDmw9zkEh3NIgdXBSnZJOJj', length: '0:09' },
    stack: ['Blender'],
    links: [
      { label: 'Watch the animation', url: driveView('1MN7EHLerymDmw9zkEh3NIgdXBSnZJOJj') },
      { label: 'Renders folder', url: driveFolder('12pU2bT_2g0RkDXC55yMljCP1GX2dmqVX') },
    ],
  },
  {
    id: 'bow',
    title: 'Bow and arrow',
    kind: 'Blender animation',
    category: 'blender',
    year: '2025',
    text: 'A short bow-and-arrow animation.',
    images: ['lab/bow-and-arrow.jpg'],
    video: { id: '1JoZkk2TBcAi_qUcSKUFzy7tccNxD1dQw', length: '0:01' },
    stack: ['Blender'],
    links: [{ label: 'Watch on Google Drive', url: driveView('1JoZkk2TBcAi_qUcSKUFzy7tccNxD1dQw') }],
  },
];
