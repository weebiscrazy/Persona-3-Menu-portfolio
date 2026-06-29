export interface SocialLink {
	platform: string;
	url: string;
	icon: string;
	color: string;
}

export interface Friend {
	name: string;
	role: string;
	quote: string;
	avatar: string;
	platform?: string;
	url?: string;
}

export interface Persona {
	name: string;
	icon: string;
	description: string;
	favorites: string[];
	rating: number;
	funFact: string;
	color: string;
}

export interface ProfileData {
	name: string;
	title: string;
	tagline: string;
	bio: string;
	avatar: string;
	stats: { label: string; value: string }[];
	socialLinks: SocialLink[];
}

export const profileData: ProfileData = {
	name: "Ayush",
	title: "Full Stack Developer",
	tagline: "Building cool things on the web",
	bio: "Building cool things on the web. Passionate about clean code, great UX, and Persona games. Currently exploring the intersection of gaming aesthetics and modern web development.",
	avatar: "/avatar.png",
	stats: [
		{ label: "Years Coding", value: "5+" },
		{ label: "Projects Shipped", value: "20+" },
		{ label: "Coffee / Day", value: "3+" },
		{ label: "Persona Playthroughs", value: "Too Many" }
	],
	socialLinks: [
		{ platform: "GitHub", url: "https://github.com/ayush", icon: "mdi:github", color: "#333" },
		{ platform: "LinkedIn", url: "https://linkedin.com/in/ayush", icon: "mdi:linkedin", color: "#0A66C2" },
		{ platform: "Twitter", url: "https://x.com/ayush", icon: "mdi:twitter", color: "#1DA1F2" },
		{ platform: "Email", url: "mailto:ayush@example.com", icon: "mdi:email", color: "#EA4335" }
	]
};

export const friendsData: Friend[] = [
	{
		name: "Ryuji",
		role: "Phantom Thief",
		quote: "Ayush codes like he fights Shadows - with style and a little chaos.",
		avatar: "/friends/ryuji.png",
		platform: "Twitter",
		url: "https://x.com/ryuji"
	},
	{
		name: "Makoto",
		role: "Student Council President",
		quote: "Reliable, organized, and always ships on time. A true leader.",
		avatar: "/friends/makoto.png",
		platform: "LinkedIn",
		url: "https://linkedin.com/in/makoto"
	},
	{
		name: "Futaba",
		role: "Hacker Extraordinaire",
		quote: "Her code is cleaner than my browser history. 10/10 would merge.",
		avatar: "/friends/futaba.png",
		platform: "GitHub",
		url: "https://github.com/futaba"
	},
	{
		name: "Yusuke",
		role: "Artist",
		quote: "Turns bugs into masterpieces. The Bob Ross of debugging.",
		avatar: "/friends/yusuke.png"
	}
];

export const personaData: Persona[] = [
	{
		name: "Gaming",
		icon: "mdi:controller-classic",
		description: "JRPGs, strategy games, and anything with a deep story. A comfort genre.",
		favorites: ["Persona 3 Reload", "Elden Ring", "Hades", "Celeste", "Chained Echoes"],
		rating: 5,
		funFact: "Platinum'd P3R in 87 hours. Elizabeth still haunts my dreams.",
		color: "#FD77D9"
	},
	{
		name: "Music",
		icon: "mdi:music-note",
		description: "Piano, synthwave, and video game OSTs. Lotus Juice on repeat.",
		favorites: ["Persona 3 OST", "Daft Punk — Discovery", "Nujabes", "T-Square", "Mass Destruction"],
		rating: 5,
		funFact: "Can play the P3 battle theme with one hand while coding with the other.",
		color: "#16CFFB"
	},
	{
		name: "Coffee",
		icon: "mdi:coffee",
		description: "Single origin pour-over enthusiast. Third wave or bust.",
		favorites: ["Ethiopian Yirgacheffe", "V60", "Aeropress", "Blue Bottle", "Hario Kettle"],
		rating: 4,
		funFact: "Owns 4 grinders. Has a favorite mug for each day of the week.",
		color: "#7DE6FD"
	},
	{
		name: "Anime",
		icon: "mdi:television-classic",
		description: "Seasonal watcher with a spreadsheet. No, really.",
		favorites: ["Frieren", "Oshi no Ko", "Spy x Family", "Steins;Gate", "Sonny Boy"],
		rating: 4,
		funFact: "Has a spreadsheet tracking every anime watched since 2019.",
		color: "#FD77D9"
	},
	{
		name: "Keyboards",
		icon: "mdi:keyboard",
		description: "Custom builds, lubed switches, and the eternal search for the perfect thock.",
		favorites: ["Keychron Q1", "GMK Olive", "Gateron Oil Kings", "Tofu60", "KAT Mizu"],
		rating: 4,
		funFact: "Spent 6 hours filming a 'thock' test video. Deleted it.",
		color: "#16CFFB"
	},
	{
		name: "Photography",
		icon: "mdi:camera",
		description: "Street and urban exploration. Golden hour is non-negotiable.",
		favorites: ["Sony A7IV", "Sigma 35mm f/1.4", "Urban Exploration", "Golden Hour", "Tokyo Nights"],
		rating: 3,
		funFact: "Once waited 3 hours for the perfect golden hour shot of a convenience store.",
		color: "#7DE6FD"
	}
];

export const skillsData = [
	{ category: "Frontend", items: ["Svelte", "React", "TypeScript", "Tailwind CSS", "Anime.js", "Three.js"] },
	{ category: "Backend", items: ["Node.js", "Go", "PostgreSQL", "Redis", "GraphQL", "REST APIs"] },
	{ category: "Tools", items: ["Git", "Docker", "Vite", "Vercel", "AWS", "Linux"] },
	{ category: "Game Dev", items: ["Unity", "Godot", "C#", "GDScript", "Shader Graph"] }
];