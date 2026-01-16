<script setup lang="ts">
import { ref } from 'vue'
import { ElIcon } from 'element-plus'
import { Reading } from '@element-plus/icons-vue'

interface Module {
  id: string
  name: string
  description: string
  icon: string
  color: string
  link?: string
}

const modules = ref<Module[]>([
  {
    id: 'orchestrator',
    name: 'Agent Orchestrator',
    description: 'Le cerveau de Jarvis. Il analyse les requêtes, détermine les agents nécessaires et coordonne leurs actions pour fournir des réponses complètes et contextuelles.',
    icon: '🎯',
    color: '#667eea'
  },
  {
    id: 'kg-agents',
    name: 'Agents Spécialisés',
    description: 'Des agents experts connectés à des Knowledge Graphs spécifiques. Chaque agent maîtrise un domaine et peut interroger son KG pour des réponses précises.',
    icon: '🤖',
    color: '#10b981'
  },
  {
    id: 'mcp',
    name: 'MCP Actions',
    description: 'Model Context Protocol permet aux agents d\'exécuter des actions concrètes : recherches web, appels API, manipulations de fichiers, et bien plus.',
    icon: '⚡',
    color: '#f59e0b'
  },
  {
    id: 'kg-builder',
    name: 'KG Builder',
    description: 'Module permettant à tout développeur ou utilisateur de créer son propre Knowledge Graph et de l\'intégrer comme nouveau module à Jarvis.',
    icon: '🧠',
    color: '#8b5cf6',
    link: 'kg-builder'
  },
  {
    id: 'voice',
    name: 'Voice Assistant',
    description: 'Interface vocale naturelle pour communiquer avec Jarvis. Parlez, et Jarvis comprend, traite et répond vocalement.',
    icon: '🎙️',
    color: '#ec4899',
    link: 'voice'
  },
  {
    id: 'data-collector',
    name: 'Data Collector',
    description: 'Outil d\'aide à la construction de KG. Collecte automatisée de données depuis le web, APIs et bases de connaissances externes.',
    icon: '🌐',
    color: '#ef4444',
    link: 'data-collector'
  }
])

const emit = defineEmits<{
  navigate: [page: string]
}>()

function navigateTo(page: string) {
  emit('navigate', page)
}

const showGraphRagArticle = ref(false)
</script>

<template>
  <div class="jarvis-view">
    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-content">
        <div class="jarvis-logo">
          <span class="logo-icon">🤖</span>
          <div class="logo-pulse"></div>
        </div>
        <h1 class="hero-title">Jarvis</h1>
        <p class="hero-tagline">Agent Orchestrator Intelligent</p>
        <p class="hero-description">
          Une plateforme d'intelligence artificielle modulaire qui connecte des agents spécialisés
          à des Knowledge Graphs pour des réponses précises, contextuelles et actionnables.
        </p>
      </div>
    </header>

    <!-- Architecture Overview -->
    <section class="architecture-section">
      <h2 class="section-title">Comment fonctionne Jarvis ?</h2>

      <div class="architecture-diagram">
        <!-- User Input -->
        <div class="arch-node user-node">
          <span class="node-icon">👤</span>
          <span class="node-label">Utilisateur</span>
        </div>

        <div class="arch-arrow">→</div>

        <!-- Orchestrator -->
        <div class="arch-node orchestrator-node">
          <span class="node-icon">🎯</span>
          <span class="node-label">Orchestrator</span>
          <span class="node-sublabel">Analyse & Route</span>
        </div>

        <div class="arch-arrow">→</div>

        <!-- Agents -->
        <div class="agents-group">
          <div class="arch-node agent-node">
            <span class="node-icon">🤖</span>
            <span class="node-label">Agent KG</span>
          </div>
          <div class="arch-node agent-node">
            <span class="node-icon">🔍</span>
            <span class="node-label">Agent Search</span>
          </div>
          <div class="arch-node agent-node">
            <span class="node-icon">⚡</span>
            <span class="node-label">Agent MCP</span>
          </div>
        </div>

        <div class="arch-arrow">→</div>

        <!-- Knowledge Graphs -->
        <div class="kg-group">
          <div class="arch-node kg-node">
            <span class="node-icon">🕸️</span>
            <span class="node-label">Knowledge Graphs</span>
          </div>
        </div>
      </div>

      <div class="architecture-explanation">
        <div class="explanation-step">
          <span class="step-number">1</span>
          <p>Vous posez une question ou demandez une action à Jarvis</p>
        </div>
        <div class="explanation-step">
          <span class="step-number">2</span>
          <p>L'Orchestrator analyse votre requête et identifie les agents nécessaires</p>
        </div>
        <div class="explanation-step">
          <span class="step-number">3</span>
          <p>Les agents interrogent leurs Knowledge Graphs ou exécutent des actions via MCP</p>
        </div>
        <div class="explanation-step">
          <span class="step-number">4</span>
          <p>Jarvis synthétise les réponses et vous fournit une réponse enrichie et contextuelle</p>
        </div>
      </div>
    </section>

    <!-- GraphRAG Section -->
    <section class="graphrag-section">
      <div class="graphrag-card" @click="showGraphRagArticle = true">
        <div class="graphrag-icon">📊</div>
        <div class="graphrag-content">
          <h3>Pourquoi GraphRAG ?</h3>
          <p>Découvrez pourquoi les Knowledge Graphs révolutionnent le RAG traditionnel et comment Jarvis en tire parti.</p>
          <button class="read-article-btn">
            <ElIcon><Reading /></ElIcon>
            <span>Lire l'article</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Modules Grid -->
    <section class="modules-section">
      <h2 class="section-title">Les Modules de Jarvis</h2>
      <div class="modules-grid">
        <article
          v-for="module in modules"
          :key="module.id"
          class="module-card"
          :style="{ '--module-color': module.color }"
          :class="{ clickable: module.link }"
          @click="module.link && navigateTo(module.link)"
        >
          <div class="module-icon">{{ module.icon }}</div>
          <h3 class="module-name">{{ module.name }}</h3>
          <p class="module-description">{{ module.description }}</p>
          <span v-if="module.link" class="module-link">
            Explorer →
          </span>
        </article>
      </div>
    </section>

    <!-- Vision Section -->
    <section class="vision-section">
      <div class="vision-content">
        <h2>Notre Vision</h2>
        <p>
          Jarvis n'est pas qu'un simple chatbot. C'est une plateforme extensible où chaque utilisateur
          peut créer ses propres Knowledge Graphs, les connecter à des agents spécialisés, et enrichir
          continuellement l'intelligence collective du système.
        </p>
        <div class="vision-features">
          <div class="vision-feature">
            <span class="feature-icon">🔌</span>
            <span>Modulaire</span>
          </div>
          <div class="vision-feature">
            <span class="feature-icon">🧩</span>
            <span>Extensible</span>
          </div>
          <div class="vision-feature">
            <span class="feature-icon">🎯</span>
            <span>Contextuel</span>
          </div>
          <div class="vision-feature">
            <span class="feature-icon">⚡</span>
            <span>Actionnable</span>
          </div>
        </div>
      </div>
    </section>

    <!-- GraphRAG Article Modal -->
    <Teleport to="body">
      <div v-if="showGraphRagArticle" class="article-modal" @click.self="showGraphRagArticle = false">
        <div class="article-modal-content">
          <button class="close-btn" @click="showGraphRagArticle = false">×</button>

          <article class="graphrag-article">
            <header class="article-header">
              <span class="article-icon">📊</span>
              <div>
                <h1>GraphRAG : La Révolution du RAG</h1>
                <p class="article-subtitle">Pourquoi les Knowledge Graphs changent tout</p>
              </div>
            </header>

            <div class="article-body">
              <h2>Le problème du RAG traditionnel</h2>
              <p>
                Le RAG (Retrieval-Augmented Generation) classique fonctionne en découpant des documents
                en chunks, les vectorisant, puis en récupérant les plus pertinents pour augmenter le contexte
                du LLM. Simple et efficace... mais limité.
              </p>
              <p>
                Le problème ? Les chunks sont isolés. Ils perdent le contexte global, les relations entre
                entités, et la structure hiérarchique de l'information. Demandez "Quels sont les partenaires
                de l'entreprise X qui travaillent aussi avec Y ?" et le RAG classique peine à répondre.
              </p>

              <h2>GraphRAG : La puissance des relations</h2>
              <p>
                GraphRAG révolutionne cette approche en structurant l'information sous forme de graphe de
                connaissances. Au lieu de chunks isolés, on a des <strong>entités</strong> (personnes,
                organisations, concepts) reliées par des <strong>relations</strong> explicites.
              </p>

              <div class="highlight-box">
                <span class="highlight-icon">💡</span>
                <p>
                  Un Knowledge Graph ne stocke pas du texte, il stocke de la <em>connaissance structurée</em>.
                  La différence est fondamentale : on peut naviguer, raisonner et découvrir des connexions
                  impossibles à trouver dans du texte brut.
                </p>
              </div>

              <h2>Les avantages concrets</h2>
              <ul>
                <li>
                  <strong>Requêtes multi-hop</strong> : Traverser plusieurs relations pour répondre à des
                  questions complexes ("Qui connaît quelqu'un qui travaille sur X ?")
                </li>
                <li>
                  <strong>Contexte global</strong> : Comprendre comment les informations sont connectées
                  à l'échelle du graphe entier
                </li>
                <li>
                  <strong>Réponses traçables</strong> : Chaque fait peut être tracé jusqu'à sa source
                  dans le graphe
                </li>
                <li>
                  <strong>Mise à jour incrémentale</strong> : Ajouter de nouvelles informations sans
                  tout réindexer
                </li>
                <li>
                  <strong>Réduction des hallucinations</strong> : Le LLM est contraint par les faits
                  du graphe
                </li>
              </ul>

              <h2>Comment Jarvis utilise GraphRAG</h2>
              <p>
                Jarvis pousse le concept encore plus loin avec une architecture multi-agents. Chaque agent
                spécialisé a accès à son propre Knowledge Graph, optimisé pour son domaine d'expertise.
              </p>
              <p>
                Quand vous posez une question, l'Orchestrator identifie quels agents (et donc quels KG)
                sont pertinents. Les agents interrogent leurs graphes en parallèle, et Jarvis synthétise
                une réponse enrichie par de multiples sources de connaissances structurées.
              </p>

              <div class="highlight-box success">
                <span class="highlight-icon">🚀</span>
                <p>
                  Avec le module <strong>KG Builder</strong>, vous pouvez créer vos propres Knowledge Graphs
                  et les intégrer à Jarvis. Transformez vos documents en connaissances structurées et
                  donnez à Jarvis l'expertise de votre domaine.
                </p>
              </div>

              <h2>L'avenir est graphique</h2>
              <p>
                Les géants de la tech l'ont compris : Google avec son Knowledge Graph, Microsoft avec
                GraphRAG, et maintenant Jarvis. La structuration de l'information sous forme de graphe
                n'est pas une mode, c'est un changement de paradigme fondamental dans la façon dont
                l'IA accède et raisonne sur la connaissance.
              </p>
            </div>
          </article>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped src="./JarvisView.scss"></style>
