<script lang="ts">
import PortalLayout from '$lib/components/PortalLayout.svelte';
import { Button, Badge, Card, TextField, Divider, ProjectCard, SectionHeading, Timeline, SocialLinks, Metric } from '$lib/design-system';

let contactValue = $state('');
const projects = [
  { title: 'Rescatados', description: 'A product concept focused on connecting surplus resources with people who need them.', href: '#catalog', category: 'Product / Engineering', year: '2026', tags: ['Svelte', 'Domain modeling'] },
  { title: 'TuCambio', description: 'A digital experience built around clear flows, useful information, and accessible interaction.', href: '#catalog', category: 'Web application', year: '2025', tags: ['TypeScript', 'UX'] }
];
const experience = [
  { period: '2024 — NOW', title: 'Software engineering', organization: 'Product and platform development', description: 'Building reliable software, improving architecture, and translating business rules into maintainable systems.' },
  { period: 'EARLIER', title: 'Technical foundations', organization: 'Continuous learning', description: 'Developing skills across backend systems, frontend interfaces, and delivery workflows.' }
];
const social = [
  { label: 'GitHub', href: 'https://github.com/benitoanagua' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com' }
];
</script>

<svelte:head>
  <title>Portfolio Design System — Benito Anagua</title>
  <meta name="description" content="Portfolio-oriented Svelte design system components and usage examples." />
</svelte:head>

<PortalLayout>
  <main class="ds-page">
    <header class="hero">
      <p class="eyebrow">DESIGN SYSTEM / SVELTE 5</p>
      <h1>Made for a<br /><em>portfolio.</em></h1>
      <p class="intro">A focused set of native Svelte components for presenting projects, experience, impact, and ways to connect.</p>
      <Button onclick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>Explore portfolio components</Button>
    </header>

    <section id="catalog">
      <SectionHeading eyebrow="01 / PROJECTS" title="Work worth showing" description="Project cards make the work, context, technologies, and next step easy to scan." />
      <div class="project-grid">
        {#each projects as project}
          <ProjectCard {project} />
        {/each}
      </div>
    </section>

    <section>
      <SectionHeading eyebrow="02 / ABOUT" title="A clear professional story" description="Use a compact timeline for experience, education, or meaningful milestones." />
      <Timeline items={experience} />
    </section>

    <section>
      <SectionHeading eyebrow="03 / IMPACT" title="Show outcomes, not just activity" />
      <div class="metrics">
        <Metric value="12+" label="Years learning and building" note="Replace with a verified portfolio metric." />
        <Metric value="20+" label="Projects and experiments" note="Use only a number you can substantiate." />
        <Metric value="3" label="Areas of focus" note="Engineering · Product · Design" />
      </div>
    </section>

    <section>
      <SectionHeading eyebrow="04 / CONNECT" title="Make the next step obvious" description="A small set of professional links and a simple contact-field example." />
      <Card title="Find me online">
        <SocialLinks items={social} />
        <Divider />
        <TextField id="ds-contact" label="Your email" placeholder="name@example.com" hint="Demo only — this field is not connected to a submission endpoint." bind:value={contactValue} />
        <p class="field-value">Current value: {contactValue || '—'}</p>
      </Card>
    </section>

    <section>
      <SectionHeading eyebrow="05 / PRIMITIVES" title="Small building blocks" />
      <div class="primitive-grid">
        <Card title="Actions"><div class="row"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button></div></Card>
        <Card title="Project metadata"><div class="row"><Badge>Featured</Badge><Badge tone="success">Live</Badge><Badge tone="warning">In progress</Badge></div></Card>
      </div>
    </section>
  </main>
</PortalLayout>

<style>
.ds-page{max-width:var(--container-xl);margin:auto;padding:clamp(1.25rem,4vw,4rem);color:var(--color-on-background)}.hero{padding:3rem 0 4rem;border-bottom:1px solid var(--color-outline-variant)}.eyebrow{color:var(--color-on-surface-variant);font:.7rem var(--font-mono);letter-spacing:.1em}.hero h1{margin:2rem 0 1rem;font:400 clamp(3.5rem,9vw,8rem)/.94 var(--font-display);letter-spacing:-.05em}.hero h1 em{color:var(--color-on-surface-variant);font-style:normal}.intro{max-width:42rem;margin:0 0 2rem;color:var(--color-on-surface-variant);font-size:1rem;line-height:1.7}section{padding:3.5rem 0}.project-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5rem}.primitive-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.row{display:flex;flex-wrap:wrap;gap:.5rem}.field-value{margin:.75rem 0 0;color:var(--ds-muted);font-size:.75rem}@media(max-width:700px){.project-grid,.primitive-grid{grid-template-columns:1fr}.metrics{grid-template-columns:1fr;gap:1.25rem}}
</style>