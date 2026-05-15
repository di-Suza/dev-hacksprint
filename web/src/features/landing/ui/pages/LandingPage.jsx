import {
  ArrowRight,
  BookOpenText,
  Code2,
  Database,
  FileText,
  GitBranch,
  Heart,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  PencilLine,
  Search,
  Sparkles,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import { Link } from "react-router";

const productFeatures = [
  {
    icon: UserRound,
    title: "Portfolio profiles that feel alive",
    copy: "Create a developer profile with avatar, banner, bio, skills, social links, and a clean portfolio showcase.",
  },
  {
    icon: Layers3,
    title: "Project showcases with real context",
    copy: "Upload projects, add descriptions, tech stack tags, GitHub links, live links, and keep everything editable.",
  },
  {
    icon: BookOpenText,
    title: "Technical blogs for builders",
    copy: "Publish engineering notes, tutorials, build logs, categories, and dynamic blog pages from one writing flow.",
  },
  {
    icon: Search,
    title: "Discover developers and projects",
    copy: "Search users, filter projects by tech stack, and find people building with the same tools you use.",
  },
  {
    icon: LockKeyhole,
    title: "Secure account system",
    copy: "Signup, login, protected routes, JWT/session handling, and secure password flows for production basics.",
  },
  {
    icon: Database,
    title: "Backend-ready product structure",
    copy: "Designed around scalable APIs, proper database relationships, clean folders, and deployable architecture.",
  },
];

const bonusFeatures = [
  { icon: MessageSquareText, label: "Comments and discussions" },
  { icon: Heart, label: "Likes and saved posts" },
  { icon: GitBranch, label: "GitHub API profile sync" },
  { icon: PencilLine, label: "Markdown blog editor" },
  { icon: UsersRound, label: "Follow and unfollow devs" },
  { icon: Zap, label: "Real-time messaging" },
];

const workflow = [
  "Build a profile",
  "Publish projects",
  "Write technical blogs",
  "Get discovered",
];

function DevHubMark() {
  return (
    <span
      className="grid h-5 w-5 grid-cols-3 grid-rows-3 gap-0.5"
      aria-hidden="true"
    >
      <span className="rounded-[1px] bg-(--color-text)" />
      <span className="rounded-[1px] bg-(--color-text)" />
      <span />
      <span />
      <span className="rounded-[1px] bg-(--color-text)" />
      <span />
      <span className="rounded-[1px] bg-(--color-text)" />
      <span />
      <span className="rounded-[1px] bg-(--color-text)" />
    </span>
  );
}

function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-130 animate-float rounded-xl border border-(--color-border) bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-3 shadow-[0_35px_120px_rgba(0,0,0,0.65)]">
      <div className="flex items-center gap-1.5 border-b border-(--color-border) pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-danger)" />
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-warn)" />
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-accent)" />
        <span className="ml-auto rounded-full border border-(--color-border) px-3 py-1 text-[10px] text-(--color-muted)">
          devhub.app/arya
        </span>
      </div>

      <div className="grid gap-3 pt-3 sm:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-(--color-border) bg-(--color-bg) p-4">
          <div className="h-20 rounded-lg bg-[linear-gradient(135deg,var(--color-accent),transparent_62%),#171717]" />
          <div className="-mt-7 ml-3 h-14 w-14 rounded-2xl border-4 border-(--color-bg) bg-(--color-text)" />
          <div className="mt-3 h-3 w-24 rounded-full bg-(--color-text)" />
          <div className="mt-2 h-2 w-32 rounded-full bg-(--color-border-strong)" />
          <div className="mt-5 flex flex-wrap gap-2">
            {["React", "Node", "Mongo"].map((tag) => (
              <span
                className="rounded-full border border-(--color-border) px-2.5 py-1 text-[10px] text-(--color-muted)"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-lg border border-(--color-border) bg-(--color-surface) p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Project: API Pulse</span>
              <Code2
                size={16}
                className="text-(--color-accent)"
                aria-hidden="true"
              />
            </div>
            <div className="mt-4 grid gap-2">
              <span className="h-2 rounded-full bg-(--color-border-strong)" />
              <span className="h-2 w-4/5 rounded-full bg-(--color-border)" />
              <span className="h-2 w-3/5 rounded-full bg-(--color-border)" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-(--color-border) bg-(--color-surface) p-4">
              <FileText
                size={16}
                className="mb-5 text-(--color-accent)"
                aria-hidden="true"
              />
              <span className="block h-2 w-16 rounded-full bg-(--color-text)" />
              <span className="mt-2 block h-2 w-20 rounded-full bg-(--color-border)" />
            </div>
            <div className="rounded-lg border border-(--color-border) bg-(--color-surface) p-4">
              <Search
                size={16}
                className="mb-5 text-(--color-accent)"
                aria-hidden="true"
              />
              <span className="block h-2 w-20 rounded-full bg-(--color-text)" />
              <span className="mt-2 block h-2 w-14 rounded-full bg-(--color-border)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_12%,rgba(64,224,176,0.12),transparent_27%),linear-gradient(90deg,transparent_0,transparent_calc(50%-520px),rgba(255,255,255,0.08)_calc(50%-519px),transparent_calc(50%-518px),transparent_calc(50%+518px),rgba(255,255,255,0.08)_calc(50%+519px),transparent_calc(50%+520px)),var(--color-bg)] text-(--color-text)">
      <header className="sticky top-0 z-30 mx-auto flex h-14 w-full max-w-6xl items-center justify-between border-b border-(--color-border) bg-[rgba(3,3,3,0.74)] px-5 backdrop-blur-xl">
        <Link className="flex items-center gap-2 text-xl font-black" to="/">
          <DevHubMark />
          DevHub
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-(--color-muted) md:flex">
          <a className="transition hover:text-(--color-text)" href="#features">
            Features
          </a>
          <a className="transition hover:text-(--color-text)" href="#workflow">
            Workflow
          </a>
          <a className="transition hover:text-(--color-text)" href="#bonus">
            Bonus
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="rounded-lg border border-(--color-border) px-3 py-2 text-sm transition hover:-translate-y-0.5 hover:border-(--color-border-strong) hover:bg-(--color-surface)"
            to="/signin"
          >
            Sign In
          </Link>
          <Link
            className="rounded-lg bg-(--color-text) px-3 py-2 text-sm font-bold text-(--color-bg) transition hover:-translate-y-0.5 hover:bg-white"
            to="/signup"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-56px)] w-full max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="absolute inset-x-5 top-0 h-px bg-(--color-border)" />
        <div className="animate-soft-in">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs text-(--color-muted)">
            <Sparkles
              size={14}
              className="text-(--color-accent)"
              aria-hidden="true"
            />
            Developer social platform
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.96] tracking-normal text-balance sm:text-6xl lg:text-7xl">
            One home for your code, projects, blogs, and developer network.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-(--color-muted)">
            DevHub helps developers create a portfolio, showcase shipped
            projects, publish technical blogs, and connect with builders through
            discovery and real interactions.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              className="group inline-flex items-center gap-2 rounded-lg bg-(--color-text) px-5 py-3 text-sm font-black text-(--color-bg) transition hover:-translate-y-0.5 hover:bg-white"
              to="/signup"
            >
              Create your profile
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              className="rounded-lg border border-(--color-border) px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-(--color-border-strong) hover:bg-(--color-surface)"
              href="#features"
            >
              See features
            </a>
          </div>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-center">
            {[
              ["Profiles", "Portfolio ready"],
              ["Projects", "Showcase work"],
              ["Blogs", "Share learnings"],
            ].map(([value, label]) => (
              <div
                className="rounded-lg border border-(--color-border) bg-[rgba(255,255,255,0.025)] p-3"
                key={value}
              >
                <strong className="block text-sm">{value}</strong>
                <span className="mt-1 block text-[11px] text-(--color-dim)">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <ProductMockup />
      </section>

      <section className="mx-auto w-full max-w-6xl border-y border-(--color-border) px-5 py-8">
        <div className="grid gap-3 md:grid-cols-4" id="workflow">
          {workflow.map((item, index) => (
            <div
              className="group flex min-h-24 items-end justify-between rounded-xl border border-(--color-border) bg-(--color-surface) p-5 transition hover:-translate-y-1 hover:border-(--color-border-strong)"
              key={item}
            >
              <span className="max-w-28 text-lg font-bold leading-tight">
                {item}
              </span>
              <span className="text-4xl font-black text-(--color-border-strong) transition group-hover:text-(--color-accent)">
                0{index + 1}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20" id="features">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs uppercase text-(--color-accent)">
            Core product
          </span>
          <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            Built around what developers actually want to show.
          </h2>
          <p className="mt-4 text-(--color-muted)">
            The platform is not a hackathon report page. It is a product
            experience focused on identity, work, writing, search, and
            community.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {productFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                className="animate-reveal-up rounded-xl border border-(--color-border) bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] p-6 transition hover:-translate-y-1 hover:border-(--color-border-strong)"
                key={feature.title}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(112,241,201,0.22)] bg-[rgba(112,241,201,0.08)] text-(--color-accent)">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-black leading-tight">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-(--color-muted)">
                  {feature.copy}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="mx-auto grid w-full max-w-6xl gap-10 border-y border-(--color-border) px-5 py-20 lg:grid-cols-[0.82fr_1.18fr]"
        id="bonus"
      >
        <div>
          <span className="text-xs uppercase text-(--color-accent)">
            Bonus layer
          </span>
          <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            Add community features when the basics are strong.
          </h2>
          <p className="mt-4 leading-7 text-(--color-muted)">
            These optional modules make DevHub feel like a real developer
            network: people can react, follow, save, sync GitHub work, write
            markdown, and talk.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {bonusFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                className="flex items-center gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-5 transition hover:-translate-y-1 hover:border-(--color-border-strong)"
                key={feature.label}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.055)] text-(--color-accent)">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="font-bold">{feature.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="rounded-2xl border border-(--color-border) bg-[radial-gradient(circle_at_20%_20%,rgba(112,241,201,0.14),transparent_28%),var(--color-surface)] p-8 text-center sm:p-12">
          <span className="text-xs uppercase text-(--color-accent)">
            Ready for sprint demo
          </span>
          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            A clean frontend foundation for the full stack DevHub app.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-(--color-muted)">
            Start with auth and landing, then connect profile, projects, blogs,
            search, and interaction flows to the backend.
          </p>
          <Link
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-(--color-text) px-5 py-3 text-sm font-black text-(--color-bg) transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
            to="/signup"
          >
            Start with sign in
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
