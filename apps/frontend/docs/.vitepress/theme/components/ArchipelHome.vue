<script setup lang="ts">
import { withBase } from 'vitepress';
import packagesData from 'virtual:packages-data';

// Packages are loaded at BUILD TIME from libs/platform-{name}/package.json.
// Add a new library with package.json and it appears automatically.
// Set `archipel.featured: true` in package.json to highlight a package.
const packages = packagesData.packages.map((pkg) => ({
    name: pkg.slug,
    desc: pkg.description,
    featured: pkg.featured,
}));

const packageCount = packagesData.count;
</script>

<template>
    <div class="archipel-home">
        <section class="hero" aria-labelledby="home-title">
            <div class="hero-content">
                <h1 id="home-title" class="hero-title">A foundation for NestJS applications</h1>
                <p class="hero-tagline">Build backend services with modular packages for authentication, data, observability and more.</p>
                <div class="hero-actions">
                    <a :href="withBase('/guides/')" class="btn btn-primary">Get Started</a>
                    <a :href="withBase('/packages/')" class="btn btn-secondary">View Packages</a>
                </div>
            </div>
            <img class="hero-art" :src="withBase('/brand/hero.webp')" alt="" width="1820" height="694" fetchpriority="high" />
        </section>

        <!-- Package registry -->
        <section class="registry-card" aria-labelledby="registry-title">
            <div class="registry-copy">
                <span class="registry-eyebrow">Package Registry</span>
                <h2 id="registry-title">Published on GitHub Packages</h2>
                <p>
                    Archipel packages are publicly available under the
                    <code>@pixel-brewery</code> scope. GitHub requires a personal access token with <code>read:packages</code> permission for installation.
                </p>
            </div>
            <div class="registry-actions">
                <code>https://npm.pkg.github.com</code>
                <a :href="withBase('/guides/getting-started.html#install-the-foundation')"> Configure package access → </a>
            </div>
        </section>

        <!-- Stats -->
        <section class="stats">
            <div class="stat">
                <span class="stat-value">{{ packageCount }}</span>
                <span class="stat-label">Packages</span>
            </div>
            <div class="stat">
                <span class="stat-value">100%</span>
                <span class="stat-label">Modular</span>
            </div>
            <div class="stat">
                <span class="stat-value">Hexagonal</span>
                <span class="stat-label">Architecture</span>
            </div>
            <div class="stat">
                <span class="stat-value">Strict</span>
                <span class="stat-label">Type Safety</span>
            </div>
        </section>

        <!-- Packages grid -->
        <section class="packages">
            <h2 class="section-title">Platform Modules</h2>
            <p class="section-desc">Each module is independently configurable, type-safe, and follows the Ports &amp; Adapters pattern.</p>
            <div class="packages-grid">
                <a
                    v-for="pkg in packages"
                    :key="pkg.name"
                    :href="withBase(`/packages/${pkg.name}/api/`)"
                    class="package-card"
                    :class="{ 'package-card--featured': pkg.featured }"
                >
                    <div class="package-card-header">
                        <span v-if="pkg.featured" class="package-badge">Featured</span>
                    </div>
                    <h3 class="package-name">{{ pkg.name }}</h3>
                    <p class="package-desc">{{ pkg.desc }}</p>
                </a>
            </div>
        </section>

        <!-- Architecture principles -->
        <section class="principles">
            <h2 class="section-title">Architecture Principles</h2>
            <div class="principles-grid">
                <div class="principle">
                    <div class="principle-icon">🔷</div>
                    <h3>Hexagonal Architecture</h3>
                    <p>Business logic decoupled from infrastructure via abstract ports. Consuming apps provide concrete adapters.</p>
                </div>
                <div class="principle">
                    <div class="principle-icon">⚙️</div>
                    <h3>Dynamic Modules</h3>
                    <p>Every library exposes <code>register()</code> or <code>forRoot()</code> for type-safe configuration at import time.</p>
                </div>
                <div class="principle">
                    <div class="principle-icon">🔀</div>
                    <h3>Strategy Pattern</h3>
                    <p>Pluggable implementations for email, blob storage, document rendering, and more.</p>
                </div>
                <div class="principle">
                    <div class="principle-icon">🛡️</div>
                    <h3>Type Safety</h3>
                    <p>Full TypeScript strict mode. No <code>any</code>. Abstract classes serve as DI tokens and type contracts.</p>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.archipel-home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 80px;
}

/* ─── Hero ─── */
.hero {
    position: relative;
    isolation: isolate;
    display: grid;
    align-items: center;
    min-height: clamp(24rem, 39vw, 29rem);
    margin: 1.75rem 0 2.85rem;
    overflow: hidden;
    border: 1px solid var(--archipel-border-subtle);
    border-radius: 1.25rem;
    background: #f0f5ef;
}

.hero-content {
    width: 50%;
    padding: clamp(1.8rem, 4.25vw, 4rem);
}

.hero-art {
    position: absolute;
    inset: 50% 0 auto;
    z-index: -1;
    display: block;
    width: 100%;
    height: auto;
    transform: translateY(-50%);
    mask-image: linear-gradient(transparent, black 12%, black 88%, transparent);
}

.hero-title {
    max-width: 14ch;
    margin: 0;
    color: #182f2b;
    font-family: var(--archipel-font-display);
    font-size: clamp(2.55rem, 5.35vw, 4.4rem);
    font-weight: 700;
    letter-spacing: -0.055em;
    line-height: 1.04;
    text-wrap: balance;
}

.hero-tagline {
    max-width: 35ch;
    margin: 1.25rem 0 0;
    color: #3f554f;
    font-size: 1.125rem;
    line-height: 1.6;
}

.hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 1.6rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.75rem;
    padding: 0.55rem 1.05rem;
    border: 1px solid #176361;
    border-radius: 0.6rem;
    font-size: 0.95rem;
    font-weight: 650;
    text-decoration: none;
}

.btn:focus-visible {
    outline: 3px solid #176361;
    outline-offset: 4px;
}

.btn-primary {
    background: #176361;
    color: #fff;
}

.btn-primary:hover {
    background: #206e6b;
    color: #fff;
}

.btn-secondary {
    background: #fff;
    color: #176361;
}

.btn-secondary:hover {
    background: #f0f5ef;
    color: #176361;
}

@media (max-width: 58rem) {
    .hero {
        min-height: 0;
    }

    .hero-content {
        width: 100%;
        padding-bottom: 0;
    }

    .hero-art {
        position: static;
        height: clamp(11rem, 39vw, 20rem);
        transform: none;
        object-fit: cover;
        object-position: right center;
        mask-image: linear-gradient(transparent, black 18%);
    }
}

/* ─── Package registry ─── */
.registry-card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 32px;
    padding: 28px 32px;
    margin: 0 0 32px;
    border: 1px solid rgb(var(--brand-rgb) / 0.25);
    border-radius: 12px;
    background: linear-gradient(135deg, var(--archipel-bg-alt) 0%, rgb(var(--brand-rgb) / 0.06) 100%);
}

.dark .registry-card {
    background: linear-gradient(135deg, var(--archipel-bg-elevated) 0%, rgb(var(--brand-rgb) / 0.1) 100%);
}

.registry-eyebrow {
    display: block;
    margin-bottom: 6px;
    color: var(--vp-c-brand-1);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.registry-copy h2 {
    margin: 0 0 8px;
    color: var(--archipel-text);
    font-family: var(--archipel-font-display);
    font-size: 1.25rem;
}

.registry-copy p {
    max-width: 680px;
    margin: 0;
    color: var(--archipel-text-muted);
    font-size: 0.9rem;
    line-height: 1.6;
}

.registry-copy code,
.registry-actions code {
    font-family: var(--vp-font-family-mono);
}

.registry-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.registry-actions code {
    padding: 6px 10px;
    border: 1px solid var(--archipel-border-subtle);
    border-radius: 6px;
    background: var(--vp-code-bg);
    color: var(--archipel-text-muted);
    font-size: 0.78rem;
}

.registry-actions a {
    color: var(--vp-c-brand-1);
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
}

.registry-actions a:hover {
    text-decoration: underline;
}

/* ─── Stats ─── */
.stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--archipel-border-subtle);
    border: 1px solid var(--archipel-border-subtle);
    border-radius: 12px;
    overflow: hidden;
    margin: 0 0 80px;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;
    background: var(--archipel-bg);
}

.dark .stat {
    background: var(--archipel-bg-elevated);
}

.stat-value {
    font-family: var(--archipel-font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--archipel-text);
    margin-bottom: 4px;
}

.stat-label {
    font-size: 0.8rem;
    color: var(--archipel-text-faint);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* ─── Section headers ─── */
.section-title {
    font-family: var(--archipel-font-display);
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    text-align: center;
    margin-bottom: 8px;
    color: var(--archipel-text);
}

.section-desc {
    text-align: center;
    color: var(--archipel-text-muted);
    font-size: 1rem;
    margin-bottom: 40px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

/* ─── Package cards ─── */
.packages {
    margin-bottom: 80px;
}

.packages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}

.package-card {
    display: block;
    padding: 24px;
    border: 1px solid var(--archipel-border-subtle);
    border-radius: 12px;
    background: var(--archipel-bg-alt);
    text-decoration: none;
    color: inherit;
    transition:
        border-color 0.25s ease,
        box-shadow 0.25s ease,
        transform 0.25s ease;
}

.package-card:hover {
    border-color: rgb(var(--brand-rgb) / 0.3);
    box-shadow: 0 4px 20px rgb(var(--brand-rgb) / 0.08);
    transform: translateY(-2px);
}

.dark .package-card {
    background: var(--archipel-bg-elevated);
}

.dark .package-card:hover {
    box-shadow: 0 4px 20px rgb(var(--brand-rgb) / 0.15);
}

.package-card-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 12px;
    min-height: 24px;
}

.package-card--featured {
    border-color: rgb(var(--brand-rgb) / 0.4);
    background: linear-gradient(135deg, var(--archipel-bg-alt) 0%, rgb(var(--brand-rgb) / 0.05) 100%);
}

.dark .package-card--featured {
    background: linear-gradient(135deg, var(--archipel-bg-elevated) 0%, rgb(var(--brand-rgb) / 0.08) 100%);
}

.package-badge {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--vp-c-brand-1);
    background: rgb(var(--brand-rgb) / 0.1);
    border: 1px solid rgb(var(--brand-rgb) / 0.2);
    padding: 2px 8px;
    border-radius: 20px;
}

.package-name {
    font-family: var(--vp-font-family-mono);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--archipel-text);
    margin: 0 0 8px;
}

.package-desc {
    font-size: 0.85rem;
    color: var(--archipel-text-muted);
    line-height: 1.5;
    margin: 0;
}

/* ─── Principles ─── */
.principles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
}

.principle {
    padding: 24px;
    border: 1px solid var(--archipel-border-subtle);
    border-radius: 12px;
    background: var(--archipel-bg-alt);
    transition: border-color 0.25s ease;
}

.principle:hover {
    border-color: var(--archipel-border);
}

.dark .principle {
    background: var(--archipel-bg-elevated);
}

.principle-icon {
    font-size: 1.5rem;
    margin-bottom: 12px;
}

.principle h3 {
    font-family: var(--archipel-font-display);
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 8px;
    color: var(--archipel-text);
}

.principle p {
    font-size: 0.85rem;
    color: var(--archipel-text-muted);
    line-height: 1.6;
    margin: 0;
}

.principle code {
    font-size: 0.8em;
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
    padding: 1px 5px;
    border-radius: 4px;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
    .registry-card {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .stats {
        grid-template-columns: repeat(2, 1fr);
    }

    .packages-grid,
    .principles-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .hero-content {
        padding-inline: 1.3rem;
    }

    .hero-tagline {
        font-size: 1rem;
    }

    .stats {
        grid-template-columns: 1fr 1fr;
    }
}
</style>
