import {
  AudioLinesIcon,
  GaugeIcon,
  MicIcon,
  MoonIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "Sleepify",
  description: "Fall asleep to YouTube, peacefully.",
  cta: "Try Sleepify",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: [
    "YouTube Sleep",
    "Audio Processing",
    "Sleep Aid",
    "Background Noise Removal",
    "Volume Normalization",
    "Sleep App",
  ],
  links: {
    email: "support@sleepify.app",
    twitter: "https://twitter.com/sleepifyapp",
    discord: "https://discord.gg/sleepifyapp",
    github: "https://github.com/sleepifyapp",
    instagram: "https://instagram.com/sleepifyapp",
  },
  features: [
    {
      name: "Background Music Removal",
      description:
        "Strips away loud background music so you only hear the voice you want to fall asleep to.",
      icon: <VolumeXIcon className="h-6 w-6" />,
    },
    {
      name: "Volume Normalization",
      description:
        "Evens out volume inconsistencies so nothing jolts you awake with sudden loudness.",
      icon: <Volume2Icon className="h-6 w-6" />,
    },
    {
      name: "Sound Effect Filter",
      description:
        "Removes sudden laughter, applause, coughing, and other jarring sound effects.",
      icon: <AudioLinesIcon className="h-6 w-6" />,
    },
    {
      name: "Pace Adjustment",
      description:
        "Slows down fast-paced speech to a calm, sleep-friendly tempo.",
      icon: <GaugeIcon className="h-6 w-6" />,
    },
    {
      name: "Voice Pitch Control",
      description:
        "Lowers high-pitched voices to a soothing, deeper register that helps you drift off.",
      icon: <MicIcon className="h-6 w-6" />,
    },
    {
      name: "Sleep Timer",
      description:
        "Set a timer to automatically stop playback after you fall asleep.",
      icon: <MoonIcon className="h-6 w-6" />,
    },
  ],
  featureHighlight: [
    {
      title: "Background Music Removal",
      description:
        "Strips away loud background music so you only hear the voice you want to fall asleep to.",
      imageSrc: "/Device-2.png",
      direction: "rtl" as const,
    },
    {
      title: "Volume Normalization",
      description:
        "Evens out volume inconsistencies so nothing jolts you awake with sudden loudness.",
      imageSrc: "/Device-3.png",
      direction: "ltr" as const,
    },
    {
      title: "Sound Effect Filter",
      description:
        "Removes sudden laughter, applause, coughing, and other jarring sound effects.",
      imageSrc: "/Device-4.png",
      direction: "rtl" as const,
    },
  ],
  bento: [
    {
      title: "Paste a YouTube URL",
      content:
        "Simply paste any YouTube video link and Sleepify processes the audio in real-time, removing disruptions and optimizing it for sleep.",
      imageSrc: "/Device-1.png",
      imageAlt: "YouTube URL input illustration",
      fullWidth: true,
    },
    {
      title: "Volume Normalization",
      content:
        "No more volume rollercoasters. Sleepify smooths out sudden volume spikes and dips so the audio stays at a consistent, comfortable level.",
      imageSrc: "/Device-2.png",
      imageAlt: "Volume normalization illustration",
      fullWidth: false,
    },
    {
      title: "Sound Effect Filter",
      content:
        "Laughter, applause, coughing, clapping — gone. Our AI detects and removes jarring non-speech sounds that interrupt your rest.",
      imageSrc: "/Device-3.png",
      imageAlt: "Sound filter illustration",
      fullWidth: false,
    },
    {
      title: "Voice Optimization",
      content:
        "Adjust speaking pace and voice pitch to your comfort. Slow down fast talkers and lower high-pitched voices for a calming listening experience.",
      imageSrc: "/Device-4.png",
      imageAlt: "Voice optimization illustration",
      fullWidth: true,
    },
  ],
  benefits: [
    {
      id: 1,
      text: "Fall asleep faster with clean, consistent audio.",
      image: "/Device-6.png",
    },
    {
      id: 2,
      text: "No more being jolted awake by sudden loud noises.",
      image: "/Device-7.png",
    },
    {
      id: 3,
      text: "Listen to any YouTube content as a sleep aid.",
      image: "/Device-8.png",
    },
    {
      id: 4,
      text: "Wake up more rested with uninterrupted sleep.",
      image: "/Device-1.png",
    },
  ],
  pricing: [
    {
      name: "Free",
      href: "/dashboard",
      price: "$0",
      period: "month",
      yearlyPrice: "$0",
      features: [
        "3 videos per day",
        "Basic volume normalization",
        "Background music reduction",
        "Sleep timer",
      ],
      description: "Perfect for trying Sleepify",
      buttonText: "Start Free",
      isPopular: false,
    },
    {
      name: "Pro",
      href: "/dashboard",
      price: "$6",
      period: "month",
      yearlyPrice: "$48",
      features: [
        "Unlimited videos",
        "Advanced volume normalization",
        "Full sound effect removal",
        "Pace adjustment",
        "Voice pitch control",
        "Priority processing",
        "Offline playlists",
      ],
      description: "For the best sleep experience",
      buttonText: "Upgrade to Pro",
      isPopular: true,
    },
  ],
  faqs: [
    {
      question: "How does Sleepify process YouTube audio?",
      answer: (
        <span>
          Paste any YouTube URL into Sleepify and our audio processing engine
          analyzes the audio track in real-time. It identifies and removes
          background music, normalizes volume levels, filters out sound effects,
          and can adjust speaking pace and pitch — all before streaming the
          clean audio to you.
        </span>
      ),
    },
    {
      question: "What kinds of audio problems does Sleepify fix?",
      answer: (
        <span>
          Sleepify addresses six common issues: loud background music,
          inconsistent volume levels, sudden sound effects (laughter, applause,
          coughing), fast speaking pace, high voice pitch, and other disruptive
          audio elements that prevent you from falling asleep.
        </span>
      ),
    },
    {
      question: "Can I use Sleepify with any YouTube video?",
      answer: (
        <span>
          Yes, Sleepify works with any public YouTube video. It&apos;s especially
          useful for podcasts, audiobooks, lectures, ASMR, documentaries, and
          ambient content — anything you might listen to while falling asleep.
        </span>
      ),
    },
    {
      question: "Does Sleepify work offline?",
      answer: (
        <span>
          The free tier requires an internet connection to process videos. Pro
          users can save processed audio to offline playlists, so you can listen
          without an internet connection once the audio has been processed.
        </span>
      ),
    },
    {
      question: "Is Sleepify available as a mobile app?",
      answer: (
        <span>
          Sleepify is a Progressive Web App (PWA), which means you can install it
          directly from your browser on any device — phone, tablet, or desktop.
          It works like a native app with offline support and home screen access.
        </span>
      ),
    },
  ],
  footer: [
    {
      id: 1,
      menu: [
        { href: "#features", text: "Features" },
        { href: "#pricing", text: "Pricing" },
        { href: "#faq", text: "FAQ" },
        { href: "#", text: "Blog" },
        { href: "#", text: "Contact" },
      ],
    },
  ],
  testimonials: [
    {
      id: 1,
      text: "I used to wake up every night because of sudden loud music in podcasts. Sleepify fixed that completely.",
      name: "Alice Johnson",
      role: "Podcast Listener",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 2,
      text: "The volume normalization is a game changer. No more reaching for my phone to adjust volume at 2am.",
      name: "Bob Brown",
      role: "Audiobook Enthusiast",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 3,
      text: "I listen to history lectures to fall asleep, but the professors talk so fast. Pace adjustment is perfect.",
      name: "Charlie Davis",
      role: "Student",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 4,
      text: "Finally I can listen to true crime without jump-scare sound effects waking me up.",
      name: "Diana Evans",
      role: "True Crime Fan",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 5,
      text: "The sound effect filter is incredible. No more audience laughter jolting me awake during comedy podcasts.",
      name: "Ethan Ford",
      role: "Comedy Fan",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 6,
      text: "I have trouble sleeping and YouTube ambient videos help, but the ads and volume changes ruined it. Not anymore.",
      name: "Fiona Grant",
      role: "Light Sleeper",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 7,
      text: "The pitch control lets me lower high voices to a soothing tone. It makes such a difference for sleep.",
      name: "George Harris",
      role: "ASMR Listener",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 8,
      text: "Sleepify turned my YouTube watching habit into a genuine sleep aid. Best purchase this year.",
      name: "Hannah Irving",
      role: "Remote Worker",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 9,
      text: "As someone with insomnia, having clean consistent audio to fall asleep to has been life-changing.",
      name: "Ian Johnson",
      role: "Insomnia Sufferer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 10,
      text: "I use Sleepify every single night. The sleep timer combined with volume normalization is perfect.",
      name: "Julia Kim",
      role: "Meditation Practitioner",
      image:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 11,
      text: "My partner and I both use it now. No more fights about random loud noises from my phone at night.",
      name: "Kevin Lee",
      role: "Night Owl",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 12,
      text: "Documentary narrators sometimes whisper then suddenly shout. Sleepify makes them perfectly even.",
      name: "Laura Martinez",
      role: "Documentary Lover",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 13,
      text: "The background music removal is so clean. I can finally hear just the narrator without the dramatic score.",
      name: "Michael Nelson",
      role: "History Buff",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 14,
      text: "I tried white noise apps but I prefer real content. Sleepify makes any YouTube video sleep-friendly.",
      name: "Natalie Owens",
      role: "Shift Worker",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 15,
      text: "The pace adjustment is subtle but effective. Fast-talking YouTubers become perfectly relaxing.",
      name: "Oscar Parker",
      role: "Relaxation Seeker",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 16,
      text: "Works as a PWA on my phone, feels like a native app. Brilliant design and concept.",
      name: "Patricia Quinn",
      role: "Tech Enthusiast",
      image:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 17,
      text: "My sleep quality improved measurably since using Sleepify. My fitness tracker confirms it.",
      name: "Quincy Roberts",
      role: "Health Optimizer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 18,
      text: "I recommend Sleepify to all my clients who struggle with sleep. Simple, effective, brilliant.",
      name: "Rachel Stevens",
      role: "Sleep Coach",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 19,
      text: "As a writer, I listen to interviews for research while falling asleep. Sleepify makes the audio perfect.",
      name: "Samuel Thompson",
      role: "Writer",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 20,
      text: "The free tier is generous enough for my needs. Three videos a night is plenty to fall asleep to.",
      name: "Tina Upton",
      role: "Casual User",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 21,
      text: "I upgraded to Pro for the offline playlists. Now I have my sleep playlist ready even when traveling.",
      name: "Ulysses Vaughn",
      role: "Frequent Traveler",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 22,
      text: "Sleepify solved a problem I did not even know had a solution. Pure genius.",
      name: "Victoria White",
      role: "YouTube Viewer",
      image:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 23,
      text: "My kids fall asleep to bedtime stories on YouTube. Sleepify removes the scary sound effects. Thank you.",
      name: "William Xavier",
      role: "Parent",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 24,
      text: "I have sensory processing issues and sudden sounds are painful. Sleepify has been a godsend.",
      name: "Xena Yates",
      role: "Accessibility Advocate",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 25,
      text: "The team clearly understands the problem. Every feature addresses a real pain point. Well done.",
      name: "Yannick Zimmerman",
      role: "Product Designer",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
