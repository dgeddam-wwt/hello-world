"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  RotateCcw,
  Globe,
  MousePointerClick,
  Palette,
} from "lucide-react";

const GREETINGS = [
  { text: "Hello, World!", lang: "English" },
  { text: "Hola, Mundo!", lang: "Spanish" },
  { text: "Bonjour, le Monde!", lang: "French" },
  { text: "Hallo, Welt!", lang: "German" },
  { text: "Ciao, Mondo!", lang: "Italian" },
  { text: "Olá, Mundo!", lang: "Portuguese" },
  { text: "こんにちは世界！", lang: "Japanese" },
  { text: "안녕하세요 세계!", lang: "Korean" },
  { text: "你好，世界！", lang: "Chinese" },
  { text: "Привет, мир!", lang: "Russian" },
  { text: "مرحباً بالعالم!", lang: "Arabic" },
  { text: "नमस्ते दुनिया!", lang: "Hindi" },
];

const THEMES = [
  { name: "Violet", from: "from-violet-500", to: "to-fuchsia-500", bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
  { name: "Sky", from: "from-sky-500", to: "to-cyan-400", bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400" },
  { name: "Emerald", from: "from-emerald-500", to: "to-teal-400", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  { name: "Rose", from: "from-rose-500", to: "to-pink-400", bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
  { name: "Amber", from: "from-amber-500", to: "to-orange-400", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
];

export default function Home() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [customName, setCustomName] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const theme = THEMES[themeIndex];
  const greeting = GREETINGS[greetingIndex];

  const cycleGreeting = useCallback(() => {
    setIsAnimating(true);
    setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    setClickCount((prev) => prev + 1);
    setTimeout(() => setIsAnimating(false), 500);
  }, []);

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % THEMES.length);
  };

  const spawnParticles = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 800);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const displayText = customName
    ? greeting.text.replace(/World|Mundo|le Monde|Welt|Mondo|世界|세계|мир|العالم|दुनिया/g, customName)
    : greeting.text;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Animated gradient background */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.from} ${theme.to} opacity-[0.07] transition-all duration-700`}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent dark:from-black/60" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-8">
        {/* Header badge */}
        <Badge variant="secondary" className={`${theme.bg} ${theme.text} gap-1.5 px-3 py-1 text-sm`}>
          <Globe className="h-3.5 w-3.5" />
          Interactive Hello World
        </Badge>

        {/* Main greeting card */}
        <Card
          className="group relative w-full cursor-pointer overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl"
          onClick={(e) => {
            cycleGreeting();
            spawnParticles(e);
          }}
        >
          {/* Card gradient accent */}
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.from} ${theme.to}`}
          />

          <CardContent className="relative flex flex-col items-center gap-4 p-10">
            {/* Particle effects */}
            {particles.map((p) => (
              <span
                key={p.id}
                className={`pointer-events-none absolute h-2 w-2 rounded-full bg-gradient-to-br ${theme.from} ${theme.to} animate-ping`}
                style={{ left: p.x, top: p.y }}
              />
            ))}

            <h1
              className={`text-center text-4xl font-bold tracking-tight transition-all duration-500 sm:text-5xl ${
                isAnimating ? "scale-110 opacity-80" : "scale-100 opacity-100"
              }`}
            >
              <span className={`bg-gradient-to-r ${theme.from} ${theme.to} bg-clip-text text-transparent`}>
                {displayText}
              </span>
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MousePointerClick className="h-3.5 w-3.5" />
              Click to cycle &middot;{" "}
              <span className="font-medium">{greeting.lang}</span>
            </p>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <Input
            placeholder="Enter your name..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={cycleTheme} title="Change theme">
              <Palette className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setCustomName("");
                setClickCount(0);
                setGreetingIndex(0);
                setThemeIndex(0);
              }}
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid w-full grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center p-4">
              <span className={`text-2xl font-bold ${theme.text}`}>{clickCount}</span>
              <span className="text-xs text-muted-foreground">Clicks</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center p-4">
              <span className={`text-2xl font-bold ${theme.text}`}>{GREETINGS.length}</span>
              <span className="text-xs text-muted-foreground">Languages</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center p-4">
              <Sparkles className={`h-6 w-6 ${theme.text}`} />
              <span className="text-xs text-muted-foreground">{theme.name}</span>
            </CardContent>
          </Card>
        </div>

        {/* Language grid */}
        <div className="flex flex-wrap justify-center gap-2">
          {GREETINGS.map((g, i) => (
            <button
              key={g.lang}
              onClick={() => {
                setGreetingIndex(i);
                setClickCount((c) => c + 1);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                i === greetingIndex
                  ? `bg-gradient-to-r ${theme.from} ${theme.to} text-white shadow-md`
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {g.lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
