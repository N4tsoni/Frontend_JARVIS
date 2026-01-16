<script setup lang="ts">
import { ref } from 'vue'
import { Reading } from '@element-plus/icons-vue'
import { ArticleView } from '@/views/ArticleView'
import { getArticleById } from '@/data/articles'

interface Feature {
  title: string
  description: string
  status: 'active' | 'beta' | 'coming'
  icon: string
  articleId?: string
}

interface FeatureCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  features: Feature[]
}

const categories = ref<FeatureCategory[]>([
  {
    id: 'kg-builder',
    name: 'Knowledge Graph Builder',
    description: 'Construction automatisée de graphes de connaissances à partir de documents via une pipeline agentique multi-étapes.',
    icon: '🧠',
    color: '#667eea',
    features: [
      {
        title: 'Pipeline Agentique V3',
        description: 'Pipeline de traitement en 9 étapes : Parsing → Chunking → Embedding → NER → Extraction → Transformation → Enrichment → Validation → Storage',
        status: 'active',
        icon: '⚙️',
        articleId: 'pipeline-v3'
      },
      {
        title: 'Multi-Pass Extraction',
        description: 'Extraction en plusieurs passes pour capturer les entités et relations complexes avec raffinement progressif.',
        status: 'active',
        icon: '🔄',
        articleId: 'multi-pass'
      },
      {
        title: 'Graph-Aware Extraction',
        description: 'Extraction contextuelle qui prend en compte le graphe existant pour éviter les doublons et enrichir les connexions.',
        status: 'active',
        icon: '🕸️',
        articleId: 'graph-aware'
      },
      {
        title: 'Hierarchical Chunking',
        description: 'Découpage intelligent des documents en préservant la structure hiérarchique (sections, paragraphes).',
        status: 'active',
        icon: '📑',
        articleId: 'hierarchical-chunking'
      },
      {
        title: 'Incremental Entity Resolution',
        description: 'Résolution incrémentale des entités pour fusionner les mentions similaires et maintenir la cohérence.',
        status: 'active',
        icon: '🔗',
        articleId: 'entity-resolution'
      },
      {
        title: 'Multi-Format Support',
        description: 'Support des formats PDF, CSV, JSON, TXT, XLSX et XML avec parsers spécialisés.',
        status: 'active',
        icon: '📄',
        articleId: 'stage-parsing'
      },
      {
        title: 'Batch Processing',
        description: 'Traitement par lots de plusieurs documents avec déduplication cross-fichiers.',
        status: 'active',
        icon: '📦'
      },
      {
        title: 'Neo4j Storage',
        description: 'Stockage persistant dans Neo4j avec requêtes Cypher optimisées.',
        status: 'active',
        icon: '💾',
        articleId: 'stage-storage'
      },
      // Pipeline Stages détaillés
      {
        title: 'Chunking Stage',
        description: 'Découpage intelligent des documents longs en segments optimisés pour le contexte LLM.',
        status: 'active',
        icon: '✂️',
        articleId: 'stage-chunking'
      },
      {
        title: 'Embedding Stage',
        description: 'Génération de vecteurs sémantiques (384 dims) pour la recherche et résolution d\'entités.',
        status: 'active',
        icon: '🧮',
        articleId: 'stage-embedding'
      },
      {
        title: 'NER Stage',
        description: 'Pré-extraction rapide des entités avec spaCy avant l\'analyse LLM.',
        status: 'active',
        icon: '🏷️',
        articleId: 'stage-ner'
      },
      {
        title: 'Extraction Stage',
        description: 'Extraction des entités et relations via Claude avec modes GUIDED/OPEN/HYBRID.',
        status: 'active',
        icon: '🤖',
        articleId: 'stage-extraction'
      },
      {
        title: 'Validation Stage',
        description: 'Vérification de la qualité et cohérence des données extraites.',
        status: 'active',
        icon: '✅',
        articleId: 'stage-validation'
      }
    ]
  },
  {
    id: 'jarvis-assistant',
    name: 'Jarvis Assistant',
    description: 'Orchestrateur intelligent qui coordonne des agents spécialisés et exploite les Knowledge Graphs pour répondre aux questions.',
    icon: '🤖',
    color: '#10b981',
    features: [
      {
        title: 'Voice Interface',
        description: 'Interface vocale push-to-talk avec transcription (Whisper/Groq) et synthèse vocale (Edge TTS/Coqui).',
        status: 'active',
        icon: '🎙️',
        articleId: 'voice-interface'
      },
      {
        title: 'Agent Orchestration',
        description: 'Orchestrateur central qui route les requêtes vers des agents spécialisés selon le contexte.',
        status: 'active',
        icon: '🎯',
        articleId: 'agent-orchestration'
      },
      {
        title: 'KG-Augmented Responses',
        description: 'Réponses enrichies par les connaissances du graphe pour des informations contextuelles précises.',
        status: 'active',
        icon: '📊',
        articleId: 'kg-augmented'
      },
      {
        title: 'Conversation History',
        description: 'Historique persistant des conversations avec gestion multi-sessions.',
        status: 'active',
        icon: '💬'
      },
      {
        title: 'Multi-LLM Support',
        description: 'Support de plusieurs modèles LLM via OpenRouter (Claude, GPT-4, Mistral...).',
        status: 'active',
        icon: '🧩',
        articleId: 'multi-llm'
      },
      {
        title: 'Text Input Mode',
        description: 'Mode texte alternatif pour les interactions silencieuses.',
        status: 'active',
        icon: '⌨️'
      },
      // Graph RAG Components
      {
        title: 'Graph RAG Pipeline',
        description: 'Retrieval-Augmented Generation enrichi par Knowledge Graph pour des réponses factuelles.',
        status: 'active',
        icon: '🎯',
        articleId: 'graph-rag-overview'
      },
      {
        title: 'Semantic Retrieval',
        description: 'Recherche vectorielle combinant embeddings et traversée du graphe.',
        status: 'active',
        icon: '🔍',
        articleId: 'semantic-retrieval'
      },
      {
        title: 'Multi-Factor Ranking',
        description: 'Scoring combiné Embedding + NER + Graph Centrality pour sélectionner le contexte optimal.',
        status: 'active',
        icon: '📊',
        articleId: 'multi-factor-ranking'
      },
      {
        title: 'Intelligent Routing',
        description: 'Routage dynamique KG/LLM basé sur le kg_match_score et la décomposition de requêtes.',
        status: 'active',
        icon: '🧭',
        articleId: 'intelligent-routing'
      },
      {
        title: 'KG + Embeddings + GDS',
        description: 'Approche hybride combinant structure du graphe, sémantique vectorielle et Graph Data Science.',
        status: 'active',
        icon: '🔬',
        articleId: 'kg-gds-combination'
      }
    ]
  },
  {
    id: 'architecture',
    name: 'Architecture & Visualisation',
    description: 'Outils de visualisation et compréhension de l\'architecture du système.',
    icon: '🏗️',
    color: '#f59e0b',
    features: [
      {
        title: 'Architecture Canvas',
        description: 'Visualisation interactive de l\'architecture Jarvis style n8n avec les flux de données.',
        status: 'coming',
        icon: '🎨'
      },
      {
        title: 'Graph Explorer',
        description: 'Exploration visuelle du Knowledge Graph avec filtres et recherche.',
        status: 'active',
        icon: '🔍'
      },
      {
        title: 'Pipeline Monitor',
        description: 'Suivi en temps réel de l\'exécution des pipelines avec progress bars.',
        status: 'active',
        icon: '📈'
      }
    ]
  },
  {
    id: 'data-collector',
    name: 'Data Collector',
    description: 'Aspirateur de données pour la collecte et l\'enrichissement automatique des Knowledge Graphs.',
    icon: '🌐',
    color: '#ef4444',
    features: [
      {
        title: 'Web Scraping',
        description: 'Extraction automatisée de données depuis des pages web avec parsing intelligent.',
        status: 'coming',
        icon: '🕷️'
      },
      {
        title: 'API Connectors',
        description: 'Connecteurs pour APIs externes (Wikipedia, Wikidata, DBpedia...).',
        status: 'coming',
        icon: '🔌'
      },
      {
        title: 'Entity Linking',
        description: 'Liaison des entités extraites avec des bases de connaissances externes.',
        status: 'beta',
        icon: '🔗'
      },
      {
        title: 'Scheduled Collection',
        description: 'Collecte planifiée et mise à jour automatique des données.',
        status: 'coming',
        icon: '⏰'
      }
    ]
  }
])

const activeCategory = ref<string>('kg-builder')
const currentArticleId = ref<string | null>(null)

function setActiveCategory(categoryId: string) {
  activeCategory.value = categoryId
}

function getStatusBadge(status: Feature['status']) {
  switch (status) {
    case 'active':
      return { text: 'Actif', class: 'status-active' }
    case 'beta':
      return { text: 'Beta', class: 'status-beta' }
    case 'coming':
      return { text: 'À venir', class: 'status-coming' }
  }
}

function getActiveCategory() {
  return categories.value.find(c => c.id === activeCategory.value)
}

function hasArticle(articleId?: string): boolean {
  return articleId ? !!getArticleById(articleId) : false
}

function openArticle(articleId: string) {
  currentArticleId.value = articleId
}

function closeArticle() {
  currentArticleId.value = null
}

function navigateToArticle(articleId: string) {
  currentArticleId.value = articleId
}
</script>

<template>
  <div class="features-view">
    <!-- Article View -->
    <ArticleView
      v-if="currentArticleId"
      :article-id="currentArticleId"
      :on-back="closeArticle"
      :on-navigate="navigateToArticle"
    />

    <!-- Features List -->
    <template v-else>
      <!-- Hero Section -->
      <header class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-icon">✨</span>
          Jarvis Platform
        </h1>
        <p class="hero-subtitle">
          Plateforme intelligente de construction de Knowledge Graphs et d'assistance IA
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">4</span>
            <span class="stat-label">Modules</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">30+</span>
            <span class="stat-label">Features</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">20+</span>
            <span class="stat-label">Articles</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Category Navigation -->
    <nav class="category-nav">
      <button
        v-for="category in categories"
        :key="category.id"
        class="category-tab"
        :class="{ active: activeCategory === category.id }"
        :style="{ '--category-color': category.color }"
        @click="setActiveCategory(category.id)"
      >
        <span class="tab-icon">{{ category.icon }}</span>
        <span class="tab-name">{{ category.name }}</span>
      </button>
    </nav>

    <!-- Category Content -->
    <main class="category-content">
      <div v-if="getActiveCategory()" class="category-detail">
        <!-- Category Header -->
        <div class="category-header" :style="{ '--category-color': getActiveCategory()?.color }">
          <div class="category-icon">{{ getActiveCategory()?.icon }}</div>
          <div class="category-info">
            <h2 class="category-title">{{ getActiveCategory()?.name }}</h2>
            <p class="category-description">{{ getActiveCategory()?.description }}</p>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="features-grid">
          <article
            v-for="feature in getActiveCategory()?.features"
            :key="feature.title"
            class="feature-card"
            :class="feature.status"
          >
            <div class="feature-header">
              <span class="feature-icon">{{ feature.icon }}</span>
              <span class="feature-status" :class="getStatusBadge(feature.status).class">
                {{ getStatusBadge(feature.status).text }}
              </span>
            </div>
            <h3 class="feature-title">
              {{ feature.title }}
              <span v-if="feature.status === 'coming'" class="coming-soon">(prochainement)</span>
            </h3>
            <p class="feature-description">{{ feature.description }}</p>
            <button
              v-if="hasArticle(feature.articleId)"
              class="read-more-btn"
              @click="openArticle(feature.articleId!)"
            >
              <el-icon><Reading /></el-icon>
              <span>En savoir plus</span>
            </button>
          </article>
        </div>
      </div>
    </main>

    <!-- Tech Stack -->
    <section class="tech-stack">
      <h3 class="section-title">Stack Technique</h3>

      <!-- Backend -->
      <div class="stack-category">
        <h4 class="stack-category-title">🔧 Backend</h4>
        <div class="tech-grid">
          <div class="tech-item">
            <span class="tech-icon">🐍</span>
            <span class="tech-name">FastAPI</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🔷</span>
            <span class="tech-name">Neo4j</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🐘</span>
            <span class="tech-name">PostgreSQL</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🤖</span>
            <span class="tech-name">Claude/GPT</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🎤</span>
            <span class="tech-name">Whisper</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🔊</span>
            <span class="tech-name">Edge TTS</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🦜</span>
            <span class="tech-name">LangGraph</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🐳</span>
            <span class="tech-name">Docker</span>
          </div>
        </div>
      </div>

      <!-- Frontend -->
      <div class="stack-category">
        <h4 class="stack-category-title">🎨 Frontend</h4>
        <div class="tech-grid">
          <div class="tech-item">
            <span class="tech-icon">⚡</span>
            <span class="tech-name">Vue 3</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">📘</span>
            <span class="tech-name">TypeScript</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🎯</span>
            <span class="tech-name">Vite</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">💅</span>
            <span class="tech-name">SCSS</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🧩</span>
            <span class="tech-name">Element Plus</span>
          </div>
        </div>
      </div>
    </section>
    </template>
  </div>
</template>

<style lang="scss" scoped src="./FeaturesView.scss"></style>
