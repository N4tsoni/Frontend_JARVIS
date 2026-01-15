<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getArticleById, getRelatedArticles } from '@/data/articles'

interface Props {
  articleId: string
  onBack: () => void
  onNavigate: (articleId: string) => void
}

const props = defineProps<Props>()

const article = computed(() => getArticleById(props.articleId))
const relatedArticles = computed(() => getRelatedArticles(props.articleId))

function handleRelatedClick(relatedId: string) {
  props.onNavigate(relatedId)
}
</script>

<template>
  <div class="article-view">
    <!-- Back Button -->
    <button class="back-button" @click="onBack">
      <el-icon><ArrowLeft /></el-icon>
      <span>Retour aux Features</span>
    </button>

    <article v-if="article" class="article-content">
      <!-- Article Header -->
      <header class="article-header">
        <span class="article-icon">{{ article.icon }}</span>
        <div class="article-meta">
          <h1 class="article-title">{{ article.title }}</h1>
          <p class="article-subtitle">{{ article.subtitle }}</p>
        </div>
      </header>

      <!-- Article Body -->
      <div class="article-body">
        <template v-for="(section, index) in article.content" :key="index">
          <!-- Paragraph -->
          <p v-if="section.type === 'paragraph'" class="section-paragraph">
            {{ section.content }}
          </p>

          <!-- Heading -->
          <h2 v-else-if="section.type === 'heading'" class="section-heading">
            {{ section.content }}
          </h2>

          <!-- List -->
          <ul v-else-if="section.type === 'list'" class="section-list">
            <li v-for="(item, i) in section.items" :key="i">{{ item }}</li>
          </ul>

          <!-- Code -->
          <pre v-else-if="section.type === 'code'" class="section-code"><code>{{ section.content }}</code></pre>

          <!-- Highlight -->
          <div v-else-if="section.type === 'highlight'" class="section-highlight">
            <span class="highlight-icon">💡</span>
            <p>{{ section.content }}</p>
          </div>
        </template>
      </div>

      <!-- Related Articles -->
      <footer v-if="relatedArticles.length > 0" class="related-articles">
        <h3 class="related-title">Articles connexes</h3>
        <div class="related-grid">
          <button
            v-for="related in relatedArticles"
            :key="related.id"
            class="related-card"
            @click="handleRelatedClick(related.id)"
          >
            <span class="related-icon">{{ related.icon }}</span>
            <span class="related-name">{{ related.title }}</span>
          </button>
        </div>
      </footer>
    </article>

    <!-- Not Found -->
    <div v-else class="article-not-found">
      <span class="not-found-icon">📄</span>
      <h2>Article non trouvé</h2>
      <p>L'article demandé n'existe pas.</p>
      <button class="back-button" @click="onBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>Retour aux Features</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./ArticleView.scss"></style>
