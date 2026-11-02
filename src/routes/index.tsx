import { createFileRoute } from "@tanstack/react-router";
import Scene3D from "@/components/Scene3D";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Rakibul Islam Shawon — Data Analyst (3D)" },
      { name: "description", content: "Data analyst turning complex data into clear insights. A 3D portfolio." },
      { property: "og:title", content: "Rakibul Islam Shawon — Data Analyst" },
      { property: "og:description", content: "Turning complex data into clear insights, in 3D." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tools = ["SQL", "Python", "Power BI", "Tableau", "Excel"];
const projects = [
  { n: "/01", stat: "$758k ↗ 27.4%", label: "Revenue overview", tags: "Power BI · SQL · DAX", title: "Retail sales intelligence", d: "Finding the story behind sales, seasonality, and regional performance." },
  { n: "/02", stat: "3 segments", label: "Customer clusters", tags: "Python · Pandas · Scikit-learn", title: "Customer segmentation", d: "Turning purchase patterns into meaningful customer groups." },
  { n: "/03", stat: "84.6% on-time", label: "Delivery performance", tags: "SQL · Excel · Tableau", title: "Supply chain performance", d: "Making delivery bottlenecks and operational trends visible." },
];
const skills = [
  { k: "A reliable foundation", t: "Data wrangling", d: "Cleaning, transforming, and validating data so every insight starts on solid ground.", s: "SQL · Python · Pandas · Excel" },
  { k: "Clarity at a glance", t: "Visual storytelling", d: "Purposeful dashboards and visualizations that make important patterns easy to see.", s: "Power BI · Tableau · Matplotlib" },
  { k: "Beyond the surface", t: "Analytical thinking", d: "Exploring the why behind the numbers and connecting findings to business questions.", s: "EDA · Statistics · Segmentation" },
];

function Label({ n, children }: { n: string; children: string }) {
  return <p className="font-mono text-xs tracking-[0.3em] text-primary">{n} {children}</p>;
}

function Index() {
  return (
    <div className="relative text-foreground">
      <Scene3D />
      <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 font-mono text-xs tracking-widest md:px-6 md:py-5">
        <span className="text-primary">R.I.SHAWON</span>
        <div className="flex gap-3 text-muted-foreground md:gap-6">
          <a className="inline-flex min-h-11 items-center" href="#projects">WORK</a><a className="inline-flex min-h-11 items-center" href="#about">ABOUT</a><a className="inline-flex min-h-11 items-center" href="#contact">CONTACT</a>
        </div>
      </nav>

      <section className="flex min-h-screen flex-col justify-center px-6 pb-12 pt-24 md:px-16">
        <p className="mb-6 w-fit rounded-full border border-primary/40 px-3 py-1 font-mono text-xs tracking-widest text-primary">● OPEN TO OPPORTUNITIES</p>
        <p className="text-muted-foreground">Hello, I'm</p>
        <h1 className="font-display text-6xl font-bold leading-none md:text-8xl">Rakibul Islam<br /><span className="text-primary">Shawon.</span></h1>
        <p className="mt-6 font-mono text-sm tracking-widest text-muted-foreground">DATA ANALYST / PROBLEM SOLVER</p>
        <p className="mt-4 max-w-md text-lg">I turn complex data into clear insights. Connecting the dots between numbers and better business decisions.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">Explore my work</a>
          <a href="#contact" className="glass rounded-full px-6 py-3">Resume</a>
        </div>
        <div className="mt-16 flex flex-wrap gap-3 font-mono text-sm">
          {tools.map((t) => <span key={t} className="glass rounded-md px-4 py-2">{t}</span>)}
        </div>
      </section>

      <section id="projects" className="min-h-screen px-6 py-24 md:px-16">
        <Label n="01">SELECTED WORK</Label>
        <h2 className="mt-3 font-display text-5xl font-bold">Data. Insight. Impact.</h2>
        <p className="mt-3 text-muted-foreground">Real-world questions, data-driven answers.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((p) => (
            <article key={p.n} className="glass tilt rounded-2xl p-4 sm:p-6">
              <p className="font-mono text-xs text-muted-foreground">{p.label.toUpperCase()} ↗</p>
              <p className="mt-2 font-display text-3xl font-bold text-primary">{p.stat}</p>
              <p className="mt-8 font-mono text-xs text-muted-foreground">{p.n} · {p.tags}</p>
              <h3 className="mt-2 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="flex min-h-screen items-center px-6 py-24 md:px-16">
        <div className="glass max-w-2xl rounded-2xl p-5 sm:p-8">
          <Label n="02">A LITTLE ABOUT ME</Label>
          <h2 className="mt-3 font-display text-4xl font-bold">Curious by nature. <span className="text-primary">Analytical by practice.</span></h2>
          <p className="mt-6">I'm Rakibul Islam Shawon, a data analyst who enjoys uncovering patterns, asking better questions, and making the complex feel simple.</p>
          <p className="mt-4 text-muted-foreground">From cleaning messy datasets to building thoughtful dashboards that bring the bigger picture into view.</p>
          <p className="mt-6 font-mono text-sm text-primary">↳ Less guesswork. More clarity.</p>
        </div>
      </section>

      <section className="min-h-screen px-6 py-24 md:px-16">
        <Label n="03">MY TOOLKIT</Label>
        <h2 className="mt-3 font-display text-5xl font-bold">The right tools. The right questions.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {skills.map((s) => (
            <div key={s.t} className="glass tilt rounded-2xl p-4 sm:p-6">
              <p className="font-mono text-xs text-primary">{s.k}</p>
              <h3 className="mt-2 text-2xl font-semibold">{s.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
              <p className="mt-6 font-mono text-xs">{s.s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen items-center px-6 py-24 md:px-16">
        <div className="glass max-w-md rounded-2xl p-5 sm:p-8">
          <Label n="04">A CLOSER LOOK</Label>
          <h2 className="mt-3 font-display text-4xl font-bold">Numbers tell stories.</h2>
          <p className="mt-4 text-muted-foreground">A year of retail revenue in 3D — a clear upward trend.</p>
          <p className="mt-6 font-display text-5xl font-bold text-primary">$758,000</p>
          <p className="font-mono text-sm">↗ 37.0% · illustrative dataset</p>
        </div>
      </section>

      <section id="contact" className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <Label n="05">LET'S CONNECT</Label>
        <h2 className="mt-3 font-display text-5xl font-bold md:text-7xl">Have a question?<br /><span className="text-primary">Let's find the answer.</span></h2>
        <p className="mt-6 max-w-md text-muted-foreground">Open to data analyst roles, meaningful projects, and conversations about what data can do.</p>
        <a href="mailto:rishawon360@gmail.com" className="mt-8 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground">Start a conversation</a>
        <p className="mt-4 font-mono text-sm text-muted-foreground">rishawon360@gmail.com</p>
      </section>
    </div>
  );
}
