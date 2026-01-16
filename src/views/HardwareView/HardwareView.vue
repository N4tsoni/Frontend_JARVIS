<script setup lang="ts">
import { ref } from 'vue'

interface HardwareFeature {
  title: string
  description: string
  icon: string
  status: 'planned' | 'in-progress' | 'research'
}

interface ComponentItem {
  name: string
  description: string
  icon: string
  specs?: string[]
}

const hardwareFeatures = ref<HardwareFeature[]>([
  {
    title: 'Voice Activation',
    description: 'Activation vocale "Hey Jarvis" avec détection de wake word locale sur ESP32.',
    icon: '🎤',
    status: 'planned'
  },
  {
    title: 'Audio Processing',
    description: 'Capture audio haute qualité avec filtrage de bruit et beam-forming multi-microphones.',
    icon: '🔊',
    status: 'research'
  },
  {
    title: 'LED Feedback',
    description: 'Anneau LED RGB pour feedback visuel : écoute, traitement, réponse, erreur.',
    icon: '💡',
    status: 'planned'
  },
  {
    title: 'WiFi Connectivity',
    description: 'Connexion WiFi pour communication avec le serveur Jarvis backend.',
    icon: '📡',
    status: 'planned'
  },
  {
    title: 'Low Power Mode',
    description: 'Mode veille ultra basse consommation avec réveil sur wake word.',
    icon: '🔋',
    status: 'research'
  },
  {
    title: 'OTA Updates',
    description: 'Mise à jour firmware over-the-air pour évolutions sans câble.',
    icon: '⬆️',
    status: 'planned'
  }
])

const components = ref<ComponentItem[]>([
  {
    name: 'ESP32-S3',
    description: 'Microcontrôleur principal avec support audio natif et WiFi/Bluetooth.',
    icon: '🔧',
    specs: ['Dual-core 240MHz', '8MB PSRAM', 'WiFi + BLE 5.0', 'USB OTG']
  },
  {
    name: 'INMP441 Microphone',
    description: 'Microphone MEMS I2S haute qualité avec excellente sensibilité.',
    icon: '🎙️',
    specs: ['I2S Digital Output', 'SNR 61dB', 'Omnidirectionnel', '-26dBFS Sensitivity']
  },
  {
    name: 'MAX98357A Amplifier',
    description: 'Amplificateur audio I2S classe D pour sortie speaker.',
    icon: '🔈',
    specs: ['3.2W Output', 'I2S Input', 'Filterless', '92% Efficiency']
  },
  {
    name: 'WS2812B LED Ring',
    description: 'Anneau de 12 LEDs RGB adressables pour feedback visuel.',
    icon: '💫',
    specs: ['12 LEDs RGB', '5V Logic', '800Kbps', '16.7M Colors']
  },
  {
    name: 'Speaker 3W',
    description: 'Haut-parleur compact pour reproduction vocale claire.',
    icon: '📢',
    specs: ['3W RMS', '4Ω Impedance', '80-20kHz', '40mm Driver']
  }
])

const printSpecs = ref({
  material: 'PLA ou PETG',
  infill: '20%',
  layerHeight: '0.2mm',
  supports: 'Minimal',
  printTime: '~4 heures',
  dimensions: '80 x 80 x 45 mm'
})

function getStatusBadge(status: HardwareFeature['status']) {
  switch (status) {
    case 'planned':
      return { text: 'Planifié', class: 'status-planned' }
    case 'in-progress':
      return { text: 'En cours', class: 'status-progress' }
    case 'research':
      return { text: 'Recherche', class: 'status-research' }
  }
}
</script>

<template>
  <div class="hardware-view">
    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">COMING SOON</div>
        <h1 class="hero-title">
          <span class="hero-icon">🔌</span>
          Jarvis Hardware
        </h1>
        <p class="hero-subtitle">
          Un boîtier physique autonome pour interagir avec Jarvis via la voix
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">ESP32</span>
            <span class="stat-label">Microcontrôleur</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">3D</span>
            <span class="stat-label">Impression</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">WiFi</span>
            <span class="stat-label">Connectivité</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Vision Section -->
    <section class="vision-section">
      <h2 class="section-title">La Vision</h2>
      <div class="vision-content">
        <div class="vision-text">
          <p>
            Imaginez un petit boîtier élégant sur votre bureau. Vous dites simplement
            <strong>"Hey Jarvis"</strong> et l'anneau LED s'illumine en bleu. Vous posez
            votre question, Jarvis interroge son Knowledge Graph et répond avec sa voix
            synthétisée. Simple, intuitif, toujours disponible.
          </p>
          <p>
            Ce projet combine l'électronique embarquée (ESP32), l'impression 3D pour le
            boîtier, et l'infrastructure Jarvis existante pour créer un assistant
            physique tangible.
          </p>
        </div>
        <div class="vision-diagram">
          <div class="diagram-box">
            <div class="diagram-icon">🎤</div>
            <div class="diagram-label">Voice Input</div>
          </div>
          <div class="diagram-arrow">→</div>
          <div class="diagram-box">
            <div class="diagram-icon">📡</div>
            <div class="diagram-label">ESP32 WiFi</div>
          </div>
          <div class="diagram-arrow">→</div>
          <div class="diagram-box">
            <div class="diagram-icon">🧠</div>
            <div class="diagram-label">Jarvis Server</div>
          </div>
          <div class="diagram-arrow">→</div>
          <div class="diagram-box">
            <div class="diagram-icon">🔊</div>
            <div class="diagram-label">Voice Output</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">Fonctionnalités Prévues</h2>
      <div class="features-grid">
        <article
          v-for="feature in hardwareFeatures"
          :key="feature.title"
          class="feature-card"
        >
          <div class="feature-header">
            <span class="feature-icon">{{ feature.icon }}</span>
            <span class="feature-status" :class="getStatusBadge(feature.status).class">
              {{ getStatusBadge(feature.status).text }}
            </span>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </article>
      </div>
    </section>

    <!-- Components Section -->
    <section class="components-section">
      <h2 class="section-title">Composants Électroniques</h2>
      <div class="components-grid">
        <article
          v-for="component in components"
          :key="component.name"
          class="component-card"
        >
          <div class="component-icon">{{ component.icon }}</div>
          <div class="component-info">
            <h3 class="component-name">{{ component.name }}</h3>
            <p class="component-description">{{ component.description }}</p>
            <ul v-if="component.specs" class="component-specs">
              <li v-for="spec in component.specs" :key="spec">{{ spec }}</li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <!-- 3D Print Section -->
    <section class="print-section">
      <h2 class="section-title">Boîtier Imprimé 3D</h2>
      <div class="print-content">
        <div class="print-preview">
          <div class="preview-placeholder">
            <span class="preview-icon">📦</span>
            <span class="preview-text">Modèle 3D</span>
            <span class="preview-subtext">Design en cours</span>
          </div>
        </div>
        <div class="print-specs">
          <h3>Spécifications d'impression</h3>
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">Matériau</span>
              <span class="spec-value">{{ printSpecs.material }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Remplissage</span>
              <span class="spec-value">{{ printSpecs.infill }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Hauteur couche</span>
              <span class="spec-value">{{ printSpecs.layerHeight }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Supports</span>
              <span class="spec-value">{{ printSpecs.supports }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Temps</span>
              <span class="spec-value">{{ printSpecs.printTime }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Dimensions</span>
              <span class="spec-value">{{ printSpecs.dimensions }}</span>
            </div>
          </div>
          <div class="print-features">
            <h4>Caractéristiques du design</h4>
            <ul>
              <li>Ouvertures pour microphone et speaker</li>
              <li>Diffuseur pour anneau LED visible</li>
              <li>Ventilation passive pour dissipation thermique</li>
              <li>Accès USB-C pour alimentation et programmation</li>
              <li>Montage mural optionnel</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Architecture Section -->
    <section class="architecture-section">
      <h2 class="section-title">Architecture Système</h2>
      <div class="architecture-diagram">
        <pre class="ascii-diagram">
┌─────────────────────────────────────────────────────────────────────┐
│                        JARVIS HARDWARE BOX                          │
│                                                                     │
│  ┌─────────────┐    ┌─────────────────────────────┐    ┌─────────┐ │
│  │  INMP441    │───▶│        ESP32-S3             │───▶│  LED    │ │
│  │  Microphone │    │                             │    │  Ring   │ │
│  └─────────────┘    │  ┌─────────────────────┐   │    └─────────┘ │
│                     │  │  Wake Word Engine   │   │                │
│                     │  │  (Local Detection)  │   │                │
│  ┌─────────────┐    │  └─────────────────────┘   │    ┌─────────┐ │
│  │  Speaker    │◀───│                             │    │  Button │ │
│  │  3W         │    │  ┌─────────────────────┐   │◀───│  (opt)  │ │
│  └─────────────┘    │  │  Audio Streaming    │   │    └─────────┘ │
│                     │  │  (WiFi → Server)    │   │                │
│                     │  └─────────────────────┘   │                │
│                     └──────────────┬──────────────┘                │
│                                    │ WiFi                         │
└────────────────────────────────────┼───────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        JARVIS SERVER (Docker)                       │
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐ │
│  │  STT        │───▶│  Jarvis     │───▶│  Knowledge Graph        │ │
│  │  (Whisper)  │    │  Agent      │    │  (Neo4j)                │ │
│  └─────────────┘    └──────┬──────┘    └─────────────────────────┘ │
│                            │                                       │
│                            ▼                                       │
│                     ┌─────────────┐                                │
│                     │  TTS        │                                │
│                     │  (Edge TTS) │                                │
│                     └──────┬──────┘                                │
│                            │                                       │
└────────────────────────────┼───────────────────────────────────────┘
                             │
                             ▼
                      Audio Response
                      (Streamed back)
        </pre>
      </div>
    </section>

    <!-- Roadmap Section -->
    <section class="roadmap-section">
      <h2 class="section-title">Roadmap</h2>
      <div class="roadmap-timeline">
        <div class="timeline-item">
          <div class="timeline-marker research"></div>
          <div class="timeline-content">
            <h4>Phase 1 - Recherche</h4>
            <p>Sélection des composants, tests de faisabilité, prototypage breadboard</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker planned"></div>
          <div class="timeline-content">
            <h4>Phase 2 - Design</h4>
            <p>Design du PCB, modélisation 3D du boîtier, schémas électriques</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker planned"></div>
          <div class="timeline-content">
            <h4>Phase 3 - Firmware</h4>
            <p>Développement firmware ESP32, wake word, streaming audio</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker planned"></div>
          <div class="timeline-content">
            <h4>Phase 4 - Intégration</h4>
            <p>API hardware côté serveur, tests end-to-end, optimisations</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker planned"></div>
          <div class="timeline-content">
            <h4>Phase 5 - Production</h4>
            <p>Documentation, fichiers STL publics, guide d'assemblage</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped src="./HardwareView.scss"></style>
