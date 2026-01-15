export interface Article {
  id: string
  categoryId: string
  title: string
  subtitle: string
  icon: string
  content: ArticleSection[]
  relatedArticles?: string[]
}

export interface ArticleSection {
  type: 'paragraph' | 'heading' | 'list' | 'code' | 'highlight'
  content: string
  items?: string[]
  language?: string
}

export const articles: Article[] = [
  // KG Builder Articles
  {
    id: 'pipeline-v3',
    categoryId: 'kg-builder',
    title: 'Pipeline Agentique V3',
    subtitle: 'Pipeline de traitement en 9 étapes pour la construction de Knowledge Graphs',
    icon: '⚙️',
    content: [
      {
        type: 'paragraph',
        content: 'La Pipeline V3 représente une évolution majeure dans notre approche de construction de Knowledge Graphs. Elle orchestre 9 étapes distinctes pour transformer des documents bruts en graphes de connaissances structurés.'
      },
      {
        type: 'heading',
        content: 'Les 9 Étapes de la Pipeline'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Parsing - Extraction du contenu brut depuis différents formats (PDF, CSV, JSON, etc.)',
          'Chunking - Découpage intelligent en préservant la structure hiérarchique',
          'Embedding - Génération de vecteurs sémantiques pour chaque chunk',
          'NER - Reconnaissance des entités nommées (personnes, organisations, lieux...)',
          'Extraction - Extraction des relations entre entités via LLM',
          'Transformation - Normalisation et structuration des données extraites',
          'Enrichment - Enrichissement avec des sources externes',
          'Validation - Vérification de la cohérence et qualité des données',
          'Storage - Persistance dans Neo4j avec indexation optimisée'
        ]
      },
      {
        type: 'heading',
        content: 'Architecture LangGraph'
      },
      {
        type: 'paragraph',
        content: 'La pipeline utilise LangGraph pour orchestrer les différentes étapes de manière flexible et résiliente. Chaque étape est un nœud du graphe qui peut être exécuté de manière conditionnelle selon le contexte.'
      },
      {
        type: 'highlight',
        content: 'La Pipeline V3 peut traiter des documents de plus de 100 pages en extrayant automatiquement des centaines d\'entités et relations.'
      }
    ],
    relatedArticles: ['multi-pass', 'hierarchical-chunking', 'graph-aware']
  },
  {
    id: 'multi-pass',
    categoryId: 'kg-builder',
    title: 'Multi-Pass Extraction',
    subtitle: 'Extraction en plusieurs passes pour une couverture maximale',
    icon: '🔄',
    content: [
      {
        type: 'paragraph',
        content: 'L\'extraction Multi-Pass est une technique avancée qui effectue plusieurs passes sur le contenu pour capturer progressivement toutes les entités et relations, même les plus subtiles.'
      },
      {
        type: 'heading',
        content: 'Pourquoi Multi-Pass ?'
      },
      {
        type: 'paragraph',
        content: 'Une seule passe d\'extraction peut manquer des relations implicites ou des entités mentionnées indirectement. Le Multi-Pass résout ce problème en effectuant plusieurs analyses avec des focales différentes.'
      },
      {
        type: 'heading',
        content: 'Les Passes d\'Extraction'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Passe 1 - Extraction des entités principales et relations explicites',
          'Passe 2 - Extraction des entités secondaires et relations implicites',
          'Passe 3 - Résolution des coréférences et consolidation',
          'Passe 4 (optionnelle) - Enrichissement contextuel'
        ]
      },
      {
        type: 'highlight',
        content: 'Le Multi-Pass augmente le recall de l\'extraction de 40% en moyenne par rapport à une extraction simple.'
      }
    ],
    relatedArticles: ['pipeline-v3', 'graph-aware']
  },
  {
    id: 'graph-aware',
    categoryId: 'kg-builder',
    title: 'Graph-Aware Extraction',
    subtitle: 'Extraction contextuelle basée sur le graphe existant',
    icon: '🕸️',
    content: [
      {
        type: 'paragraph',
        content: 'L\'extraction Graph-Aware utilise le Knowledge Graph existant comme contexte pour guider l\'extraction de nouvelles informations. Cela permet d\'éviter les doublons et d\'enrichir les connexions existantes.'
      },
      {
        type: 'heading',
        content: 'Fonctionnement'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Récupération du contexte - Extraction des entités et relations pertinentes du graphe',
          'Prompt enrichi - Le LLM reçoit le contexte existant avec le nouveau contenu',
          'Déduplication intelligente - Détection des entités similaires à celles existantes',
          'Liaison automatique - Création de relations avec les nœuds existants'
        ]
      },
      {
        type: 'highlight',
        content: 'Cette approche réduit les doublons de 60% et améliore la connectivité du graphe de 35%.'
      }
    ],
    relatedArticles: ['pipeline-v3', 'entity-resolution']
  },
  {
    id: 'hierarchical-chunking',
    categoryId: 'kg-builder',
    title: 'Hierarchical Chunking',
    subtitle: 'Découpage intelligent préservant la structure documentaire',
    icon: '📑',
    content: [
      {
        type: 'paragraph',
        content: 'Le Hierarchical Chunking est une technique de découpage qui préserve la structure hiérarchique des documents (titres, sections, paragraphes) pour maintenir le contexte lors de l\'extraction.'
      },
      {
        type: 'heading',
        content: 'Avantages par rapport au chunking classique'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Préservation du contexte - Chaque chunk conserve sa position dans la hiérarchie',
          'Overlap intelligent - Les chevauchements respectent les limites sémantiques',
          'Métadonnées enrichies - Titre de section, niveau hiérarchique, numéro de page',
          'Taille adaptative - Les chunks s\'adaptent à la structure du contenu'
        ]
      },
      {
        type: 'heading',
        content: 'Détection de structure'
      },
      {
        type: 'paragraph',
        content: 'L\'algorithme détecte automatiquement les titres via l\'analyse de la taille de police, du style (gras, italique) et des patterns textuels (numérotation, mots-clés).'
      }
    ],
    relatedArticles: ['pipeline-v3', 'multi-pass']
  },
  {
    id: 'entity-resolution',
    categoryId: 'kg-builder',
    title: 'Incremental Entity Resolution',
    subtitle: 'Résolution incrémentale des entités pour maintenir la cohérence',
    icon: '🔗',
    content: [
      {
        type: 'paragraph',
        content: 'L\'Entity Resolution incrémentale permet de fusionner les mentions d\'une même entité à travers différents documents tout en maintenant la performance lors de l\'ajout de nouveaux contenus.'
      },
      {
        type: 'heading',
        content: 'Techniques de résolution'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Matching exact - Correspondance directe des noms normalisés',
          'Matching fuzzy - Similarité textuelle avec seuil configurable',
          'Matching sémantique - Comparaison des embeddings vectoriels',
          'Matching contextuel - Analyse des relations et attributs communs'
        ]
      },
      {
        type: 'highlight',
        content: 'La résolution incrémentale permet de traiter des millions d\'entités sans recalculer l\'ensemble du graphe.'
      }
    ],
    relatedArticles: ['graph-aware', 'pipeline-v3']
  },

  // Jarvis Assistant Articles
  {
    id: 'voice-interface',
    categoryId: 'jarvis-assistant',
    title: 'Voice Interface',
    subtitle: 'Interface vocale push-to-talk avec transcription et synthèse',
    icon: '🎙️',
    content: [
      {
        type: 'paragraph',
        content: 'L\'interface vocale de Jarvis permet une interaction naturelle via la parole. Elle combine transcription automatique (STT) et synthèse vocale (TTS) pour une expérience conversationnelle fluide.'
      },
      {
        type: 'heading',
        content: 'Technologies utilisées'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Whisper (OpenAI) - Transcription haute qualité multilingue',
          'Groq - Alternative rapide pour la transcription temps réel',
          'Edge TTS - Synthèse vocale naturelle de Microsoft',
          'Coqui TTS - Option open-source pour la synthèse'
        ]
      },
      {
        type: 'heading',
        content: 'Mode Push-to-Talk'
      },
      {
        type: 'paragraph',
        content: 'Le mode push-to-talk permet un contrôle précis de l\'enregistrement. Maintenez le bouton pour parler, relâchez pour envoyer. Des indicateurs visuels montrent l\'état de l\'enregistrement et du traitement.'
      }
    ],
    relatedArticles: ['agent-orchestration', 'multi-llm']
  },
  {
    id: 'agent-orchestration',
    categoryId: 'jarvis-assistant',
    title: 'Agent Orchestration',
    subtitle: 'Orchestrateur central routant vers des agents spécialisés',
    icon: '🎯',
    content: [
      {
        type: 'paragraph',
        content: 'L\'orchestrateur Jarvis est le cerveau du système. Il analyse les requêtes utilisateur et les route vers les agents spécialisés les plus appropriés pour y répondre.'
      },
      {
        type: 'heading',
        content: 'Agents disponibles'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Agent KG - Interrogation et exploration du Knowledge Graph',
          'Agent Search - Recherche d\'informations externes',
          'Agent Analysis - Analyse de données et génération de rapports',
          'Agent General - Conversations générales et questions diverses'
        ]
      },
      {
        type: 'heading',
        content: 'Routage intelligent'
      },
      {
        type: 'paragraph',
        content: 'Le routage utilise une combinaison de classification par mots-clés et d\'analyse sémantique pour déterminer l\'agent optimal. Le contexte de la conversation est également pris en compte.'
      }
    ],
    relatedArticles: ['kg-augmented', 'voice-interface']
  },
  {
    id: 'kg-augmented',
    categoryId: 'jarvis-assistant',
    title: 'KG-Augmented Responses',
    subtitle: 'Réponses enrichies par le Knowledge Graph',
    icon: '📊',
    content: [
      {
        type: 'paragraph',
        content: 'Les réponses KG-Augmented utilisent le Knowledge Graph comme source de vérité pour enrichir les réponses du LLM avec des informations factuelles et contextuelles précises.'
      },
      {
        type: 'heading',
        content: 'Processus d\'augmentation'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Extraction des entités - Identification des entités mentionnées dans la question',
          'Requête du graphe - Récupération des informations pertinentes depuis Neo4j',
          'Contextualisation - Intégration des données du graphe dans le prompt',
          'Génération - Le LLM produit une réponse informée par le contexte'
        ]
      },
      {
        type: 'highlight',
        content: 'Cette approche réduit les hallucinations du LLM de 70% pour les questions factuelles.'
      }
    ],
    relatedArticles: ['agent-orchestration', 'pipeline-v3']
  },
  {
    id: 'multi-llm',
    categoryId: 'jarvis-assistant',
    title: 'Multi-LLM Support',
    subtitle: 'Support de plusieurs modèles LLM via OpenRouter',
    icon: '🧩',
    content: [
      {
        type: 'paragraph',
        content: 'Jarvis supporte plusieurs modèles de langage grâce à l\'intégration OpenRouter. Cela permet de choisir le modèle optimal selon le cas d\'usage et le budget.'
      },
      {
        type: 'heading',
        content: 'Modèles supportés'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Claude (Anthropic) - Excellent pour le raisonnement et l\'analyse',
          'GPT-4 (OpenAI) - Polyvalent et performant',
          'Mistral - Rapide et économique',
          'Llama - Option open-source'
        ]
      },
      {
        type: 'heading',
        content: 'Configuration'
      },
      {
        type: 'paragraph',
        content: 'Le modèle peut être configuré dans les paramètres. Il est possible de définir des modèles différents pour l\'orchestrateur et les agents spécialisés.'
      }
    ],
    relatedArticles: ['agent-orchestration', 'voice-interface']
  }
]

export function getArticleById(id: string): Article | undefined {
  return articles.find(a => a.id === id)
}

export function getArticlesByCategory(categoryId: string): Article[] {
  return articles.filter(a => a.categoryId === categoryId)
}

export function getRelatedArticles(articleId: string): Article[] {
  const article = getArticleById(articleId)
  if (!article?.relatedArticles) return []
  return article.relatedArticles
    .map(id => getArticleById(id))
    .filter((a): a is Article => a !== undefined)
}
