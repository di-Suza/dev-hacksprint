import {
  ArrowRight,
  Bell,
  BookOpenText,
  Code2,
  Heart,
  ImagePlus,
  Layers3,
  MessageCircle,
  MessagesSquare,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router";

import logo from "../../../../shared/assets/images/logo.png";
import useLandingPage from "./useLandingPage";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#showcase", label: "Showcase" },
  { href: "#community", label: "Community" },
];

const heroStats = [
  { label: "Profile", value: "Portfolio" },
  { label: "Publish", value: "Projects" },
  { label: "Write", value: "Blogs" },
  { label: "Talk", value: "Chat" },
];

const coreFeatures = [
  {
    icon: UserRound,
    title: "A profile that explains your work",
    copy: "Add your headline, about section, skills, education, experience, languages, interests, and social links in one place.",
  },
  {
    icon: ImagePlus,
    title: "Project posts with proof",
    copy: "Upload screenshots, add tags, write the context, and attach GitHub plus live links so people can inspect what you built.",
  },
  {
    icon: BookOpenText,
    title: "Technical blogs with markdown",
    copy: "Write drafts, publish finished notes, and keep your learning logs connected to the same developer identity.",
  },
  {
    icon: Search,
    title: "Search across people and work",
    copy: "Find developers, projects, and blogs by names, skills, tags, and topics instead of scrolling blindly.",
  },
  {
    icon: Heart,
    title: "Likes and comments",
    copy: "Make project and blog posts feel active with likes, comment threads, and counts that update across the app.",
  },
  {
    icon: MessagesSquare,
    title: "Private developer chat",
    copy: "Start a conversation from someone’s profile and continue it in a simple real-time message inbox.",
  },
];

const activityItems = [
  { icon: Bell, text: "Notifications for likes, comments, and follows" },
  { icon: UsersRound, text: "Follower and following lists on every profile" },
  { icon: ShieldCheck, text: "Cookie-based auth with refresh handling" },
  { icon: PenLine, text: "Editable dashboard for posts and profile data" },
];

const workflow = [
  "Create your developer profile",
  "Post a project with images and links",
  "Publish a technical blog",
  "Get discovered, followed, and messaged",
];

function AppPreview() {
  return (
    <div className="landing-preview pointer-events-none absolute -right-16 bottom-4 hidden w-[620px] max-w-[58vw] rotate-[-3deg] rounded-2xl border border-(--color-border) bg-(--color-surface)/95 p-4 shadow-[var(--shadow-soft)] backdrop-blur md:block">
      <div className="flex items-center gap-2 border-b border-(--color-border) pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-danger)" />
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-warn)" />
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-accent)" />
        <span className="ml-auto rounded-full border border-(--color-border) px-3 py-1 text-[10px] font-semibold text-(--color-muted)">
          devhub/profile/arya
        </span>
      </div>

      <div className="grid gap-4 pt-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4">
          <div className="h-24 rounded-xl bg-[linear-gradient(135deg,var(--color-accent),transparent_70%),var(--color-surface-strong)]" />
          <div className="-mt-8 ml-3 grid h-16 w-16 place-items-center rounded-2xl border-4 border-(--color-bg) bg-(--color-text) text-(--color-bg)">
            <Code2 size={24} />
          </div>
          <div className="mt-4 h-3 w-28 rounded-full bg-(--color-text)" />
          <div className="mt-2 h-2 w-40 rounded-full bg-(--color-border-strong)" />
          <div className="mt-5 flex flex-wrap gap-2">
            {["React", "Node", "MongoDB", "Socket"].map((tag) => (
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
          <div className="rounded-xl border border-(--color-border) bg-(--color-surface-strong) p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-(--color-muted)">Project</p>
                <p className="mt-1 font-black">Realtime issue tracker</p>
              </div>
              <Layers3 className="text-(--color-accent)" size={20} />
            </div>
            <div className="mt-4 grid gap-2">
              <span className="h-2 rounded-full bg-(--color-border-strong)" />
              <span className="h-2 w-4/5 rounded-full bg-(--color-border)" />
              <span className="h-2 w-3/5 rounded-full bg-(--color-border)" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["Blog", "Optimistic UI notes", BookOpenText],
              ["Chat", "3 new messages", MessageCircle],
            ].map(([label, title, Icon]) => (
              <div
                className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4"
                key={label}
              >
                <Icon className="text-(--color-accent)" size={18} />
                <p className="mt-5 text-xs text-(--color-muted)">{label}</p>
                <p className="mt-1 truncate text-sm font-bold">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const { spotlightStyle, updateSpotlight } = useLandingPage();

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-(--color-bg) text-(--color-text)"
      onMouseMove={updateSpotlight}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-80 transition-opacity duration-300"
        style={spotlightStyle}
      />

      <header className="sticky top-0 z-30 border-b border-(--color-border) bg-(--color-surface)/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Link className="flex items-center gap-2 text-xl font-black" to="/">
            <img
              alt="DevHub logo"
              className="h-12 w-auto rounded-lg object-contain"
              src={logo}
            />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-(--color-muted) md:flex">
            {navLinks.map((link) => (
              <a
                className="transition hover:text-(--color-text)"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mr-12 flex items-center gap-2 sm:mr-14">
            <Link
              className="rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm font-bold text-(--color-text) transition hover:-translate-y-0.5 hover:border-(--color-border-strong) hover:bg-(--color-surface-strong)"
              to="/signin"
            >
              Sign in
            </Link>
            <Link
              className="rounded-lg border border-(--color-accent) bg-(--color-accent) px-3 py-2 text-sm font-black text-black shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
              to="/signup"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl flex-col justify-center px-5 py-16 sm:py-20">
        <AppPreview />

        <div className="max-w-3xl animate-soft-in">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface)/90 px-3 py-1.5 text-xs font-bold text-(--color-muted) shadow-sm backdrop-blur">
            <Sparkles size={14} className="text-(--color-accent)" />
            Built for developers who ship and write about it
          </div>

          <h1 className="text-5xl font-black leading-[0.96] text-balance sm:text-6xl lg:text-7xl">
            DevHub is your public workspace for projects, blogs, and developer connections.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-(--color-muted)">
            Put your portfolio, project posts, technical writing, comments,
            follows, notifications, and chat in one simple developer network.
            No fake vanity layer. Just the work and the people around it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              className="group inline-flex items-center gap-2 rounded-xl border border-(--color-accent) bg-(--color-accent) px-5 py-3 text-sm font-black text-black shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
              to="/signup"
            >
              Create your profile
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
            <a
              className="rounded-xl border border-(--color-border) bg-(--color-surface)/90 px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-(--color-border-strong) hover:bg-(--color-surface-strong)"
              href="#features"
            >
              Explore features
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-4">
          {heroStats.map((stat, index) => (
            <div
              className="landing-rise rounded-xl border border-(--color-border) bg-(--color-surface)/88 p-4 shadow-sm backdrop-blur"
              key={stat.label}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <p className="text-xs font-bold uppercase text-(--color-dim)">
                {stat.label}
              </p>
              <p className="mt-1 text-lg font-black">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="relative z-10 mx-auto w-full max-w-6xl border-y border-(--color-border) px-5 py-10"
        id="showcase"
      >
        <div className="grid gap-3 md:grid-cols-4">
          {workflow.map((item, index) => (
            <div
              className="group flex min-h-28 items-end justify-between rounded-xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm transition hover:-translate-y-1 hover:border-(--color-border-strong)"
              key={item}
            >
              <span className="max-w-36 text-lg font-black leading-tight">
                {item}
              </span>
              <span className="text-4xl font-black text-(--color-border-strong) transition group-hover:text-(--color-accent)">
                0{index + 1}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="relative z-10 mx-auto w-full max-w-6xl px-5 py-20"
        id="features"
      >
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-black uppercase text-(--color-accent)">
            What is inside
          </span>
          <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            A social platform shaped around actual developer activity.
          </h2>
          <p className="mt-4 leading-7 text-(--color-muted)">
            DevHub is not just a pretty profile page. Every feature connects to
            something a developer already does: ship, explain, discover, react,
            and talk.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                className="landing-rise rounded-xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm transition hover:-translate-y-1 hover:border-(--color-border-strong) hover:shadow-[var(--shadow-soft)]"
                key={feature.title}
                style={{ animationDelay: `${index * 55}ms` }}
              >
                <div className="mb-8 grid h-11 w-11 place-items-center rounded-xl border border-(--color-border) bg-(--color-surface-strong) text-(--color-accent)">
                  <Icon size={21} />
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
        className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 border-y border-(--color-border) px-5 py-20 lg:grid-cols-[0.85fr_1.15fr]"
        id="community"
      >
        <div>
          <span className="text-xs font-black uppercase text-(--color-accent)">
            Community layer
          </span>
          <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            People can respond to your work, not just view it.
          </h2>
          <p className="mt-4 leading-7 text-(--color-muted)">
            Likes, comments, follows, notifications, and direct messages make
            DevHub feel active without turning it into a noisy feed.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {activityItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                className="flex items-center gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm transition hover:-translate-y-1 hover:border-(--color-border-strong)"
                key={item.text}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-(--color-surface-strong) text-(--color-accent)">
                  <Icon size={19} />
                </span>
                <span className="font-bold leading-6">{item.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 py-20">
        <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 shadow-[var(--shadow-soft)] sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="text-xs font-black uppercase text-(--color-accent)">
                Ready to build your corner?
              </span>
              <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
                Start with a profile, then let your projects and writing do the talking.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-(--color-muted)">
                Create an account, add your details, publish one project, and
                you already have a cleaner developer presence than a scattered
                set of links.
              </p>
            </div>

            <Link
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-(--color-accent) bg-(--color-accent) px-5 py-3 text-sm font-black text-black shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
              to="/signup"
            >
              Sign up
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
