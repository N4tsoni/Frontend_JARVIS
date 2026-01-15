<script setup lang="ts">
</script>

<template>
  <div class="architecture-view">
    <!-- Header -->
    <header class="page-header">
      <div class="header-icon">🏗️</div>
      <h1 class="page-title">Architecture Canvas</h1>
      <p class="page-subtitle">
        Visualisation interactive de l'architecture Jarvis
      </p>
    </header>

    <!-- Coming Soon Content -->
    <main class="coming-soon-content">
      <div class="preview-card">
        <div class="preview-illustration">
          <div class="node node-1">
            <span class="node-icon">📄</span>
            <span class="node-label">Documents</span>
          </div>
          <div class="connector connector-1"></div>
          <div class="node node-2">
            <span class="node-icon">⚙️</span>
            <span class="node-label">Pipeline</span>
          </div>
          <div class="connector connector-2"></div>
          <div class="node node-3">
            <span class="node-icon">🧠</span>
            <span class="node-label">Knowledge Graph</span>
          </div>
          <div class="connector connector-3"></div>
          <div class="node node-4">
            <span class="node-icon">🤖</span>
            <span class="node-label">Jarvis</span>
          </div>
        </div>

        <div class="preview-info">
          <span class="coming-badge">Coming Soon</span>
          <h2 class="preview-title">Canvas Style n8n</h2>
          <p class="preview-description">
            Explorez visuellement l'architecture de Jarvis avec un canvas interactif
            inspiré de n8n. Visualisez les flux de données, les connexions entre
            composants et le pipeline de traitement en temps réel.
          </p>

          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">🎨</span>
              <span>Interface drag & drop</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔄</span>
              <span>Flux de données animés</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <span>Monitoring en temps réel</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔍</span>
              <span>Zoom et navigation</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped src="./ArchitectureView.scss"></style>
