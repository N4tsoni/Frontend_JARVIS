<script setup lang="ts">
</script>

<template>
  <div class="data-collector-view">
    <!-- Header -->
    <header class="page-header">
      <div class="header-icon">🌐</div>
      <h1 class="page-title">Data Collector</h1>
      <p class="page-subtitle">
        Aspirateur intelligent de données pour enrichir vos Knowledge Graphs
      </p>
    </header>

    <!-- Coming Soon Content -->
    <main class="coming-soon-content">
      <div class="preview-card">
        <div class="preview-illustration">
          <div class="data-flow">
            <div class="source-group">
              <div class="source">
                <span class="source-icon">🌍</span>
                <span class="source-label">Web</span>
              </div>
              <div class="source">
                <span class="source-icon">📡</span>
                <span class="source-label">APIs</span>
              </div>
              <div class="source">
                <span class="source-icon">📚</span>
                <span class="source-label">Wikipedia</span>
              </div>
            </div>

            <div class="flow-arrows">
              <div class="arrow arrow-1"></div>
              <div class="arrow arrow-2"></div>
              <div class="arrow arrow-3"></div>
            </div>

            <div class="collector-center">
              <div class="collector-icon">🕷️</div>
              <div class="pulse-ring"></div>
            </div>

            <div class="flow-arrow-out"></div>

            <div class="target">
              <span class="target-icon">🧠</span>
              <span class="target-label">Knowledge Graph</span>
            </div>
          </div>
        </div>

        <div class="preview-info">
          <span class="coming-badge">Coming Soon</span>
          <h2 class="preview-title">Collecte Automatisée de Données</h2>
          <p class="preview-description">
            Aspirez et structurez automatiquement des données depuis le web,
            des APIs et des bases de connaissances pour enrichir vos Knowledge Graphs.
            Entity Linking intelligent avec Wikidata et DBpedia.
          </p>

          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">🕷️</span>
              <span>Web Scraping intelligent</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔌</span>
              <span>Connecteurs APIs</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔗</span>
              <span>Entity Linking</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⏰</span>
              <span>Collecte planifiée</span>
            </div>
          </div>

          <div class="sources-preview">
            <h4>Sources supportées</h4>
            <div class="sources-grid">
              <div class="source-badge">Wikipedia</div>
              <div class="source-badge">Wikidata</div>
              <div class="source-badge">DBpedia</div>
              <div class="source-badge">REST APIs</div>
              <div class="source-badge">RSS Feeds</div>
              <div class="source-badge">+ Custom</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped src="./DataCollectorView.scss"></style>
