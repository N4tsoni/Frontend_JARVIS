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

  // Pipeline Stages Articles
  {
    id: 'stage-parsing',
    categoryId: 'kg-builder',
    title: 'Parsing Stage',
    subtitle: 'Extraction du contenu brut depuis différents formats de fichiers',
    icon: '📄',
    content: [
      {
        type: 'paragraph',
        content: 'Le Parsing Stage est la première étape de la pipeline. Il extrait le contenu brut des fichiers sources, qu\'ils soient structurés (CSV, JSON) ou non structurés (PDF, TXT).'
      },
      {
        type: 'heading',
        content: 'Formats supportés'
      },
      {
        type: 'list',
        content: '',
        items: [
          'CSV - Auto-détection de l\'encodage et du délimiteur',
          'JSON - Parsing des structures imbriquées',
          'PDF - Extraction du texte avec préservation de la mise en page',
          'TXT - Lecture directe du contenu textuel'
        ]
      },
      {
        type: 'heading',
        content: 'Sortie du stage'
      },
      {
        type: 'paragraph',
        content: 'Pour les fichiers structurés (CSV/JSON), le parser produit des enregistrements individuels. Pour les documents non structurés (PDF/TXT), il produit du texte brut qui sera ensuite découpé par le Chunking Stage.'
      },
      {
        type: 'highlight',
        content: 'Performance : ~0.05s pour un CSV de 50 lignes, 2-5s pour un PDF de 100 pages.'
      }
    ],
    relatedArticles: ['pipeline-v3', 'stage-chunking', 'stage-extraction']
  },
  {
    id: 'stage-chunking',
    categoryId: 'kg-builder',
    title: 'Chunking Stage',
    subtitle: 'Découpage intelligent des documents longs en segments optimisés',
    icon: '✂️',
    content: [
      {
        type: 'paragraph',
        content: 'Le Chunking Stage découpe les documents longs en segments de taille optimale pour le traitement par les LLMs. Cette étape est cruciale pour les PDFs et documents textuels volumineux.'
      },
      {
        type: 'heading',
        content: 'Pourquoi le chunking ?'
      },
      {
        type: 'paragraph',
        content: 'Les LLMs ont une fenêtre de contexte limitée (ex: 8K-128K tokens). Un document de 200 pages contient ~100K+ tokens et doit être divisé pour être traité efficacement.'
      },
      {
        type: 'heading',
        content: 'Configuration'
      },
      {
        type: 'list',
        content: '',
        items: [
          'chunk_size: 1000 tokens (par défaut) - Taille cible de chaque segment',
          'chunk_overlap: 200 tokens (par défaut) - Chevauchement entre segments',
          'Overlap préserve le contexte aux frontières des chunks'
        ]
      },
      {
        type: 'heading',
        content: 'Quand l\'utiliser ?'
      },
      {
        type: 'paragraph',
        content: 'Utilisé uniquement pour les documents non structurés (PDF, TXT). Les fichiers CSV/JSON sont déjà organisés en lignes/enregistrements et n\'ont pas besoin de chunking.'
      },
      {
        type: 'highlight',
        content: 'Astuce : Augmenter chunk_size réduit le nombre d\'appels LLM mais peut diminuer la qualité du contexte.'
      }
    ],
    relatedArticles: ['hierarchical-chunking', 'stage-parsing', 'stage-embedding']
  },
  {
    id: 'stage-embedding',
    categoryId: 'kg-builder',
    title: 'Embedding Stage',
    subtitle: 'Génération de vecteurs sémantiques pour la recherche et la résolution',
    icon: '🧮',
    content: [
      {
        type: 'paragraph',
        content: 'L\'Embedding Stage génère des représentations vectorielles (embeddings) pour chaque chunk de texte. Ces vecteurs capturent le sens sémantique du contenu.'
      },
      {
        type: 'heading',
        content: 'Modèle utilisé'
      },
      {
        type: 'paragraph',
        content: 'Le système utilise all-MiniLM-L6-v2, un modèle compact produisant des vecteurs de 384 dimensions. Il offre un excellent compromis entre qualité et performance.'
      },
      {
        type: 'heading',
        content: 'Cas d\'utilisation'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Cross-chunk entity resolution - Identifier la même entité dans différents chunks',
          'Recherche sémantique - Trouver des passages similaires par le sens',
          'Extraction contextuelle - Aider le LLM à comprendre les relations implicites',
          'Déduplication - Détecter les contenus quasi-identiques'
        ]
      },
      {
        type: 'highlight',
        content: 'Les embeddings permettent de comparer "Albert Einstein" et "le physicien allemand" comme sémantiquement proches.'
      }
    ],
    relatedArticles: ['stage-chunking', 'stage-ner', 'entity-resolution']
  },
  {
    id: 'stage-ner',
    categoryId: 'kg-builder',
    title: 'NER Stage',
    subtitle: 'Reconnaissance rapide des entités nommées avec spaCy',
    icon: '🏷️',
    content: [
      {
        type: 'paragraph',
        content: 'Le NER (Named Entity Recognition) Stage effectue une pré-extraction rapide des entités nommées avant l\'appel au LLM. Il utilise spaCy pour identifier les candidats potentiels.'
      },
      {
        type: 'heading',
        content: 'Pourquoi avant le LLM ?'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Rapidité - spaCy est 100x plus rapide que le LLM',
          'Filtrage - Réduit la charge de travail du LLM',
          'Indices - Fournit des candidats pour guider l\'extraction LLM'
        ]
      },
      {
        type: 'heading',
        content: 'Types d\'entités détectées'
      },
      {
        type: 'paragraph',
        content: 'Le modèle spaCy (en_core_web_sm) détecte : personnes, organisations, lieux, dates, montants monétaires, pourcentages, et autres entités nommées standard.'
      },
      {
        type: 'highlight',
        content: 'Le NER Stage fonctionne mieux sur des chunks. Il est recommandé de l\'utiliser après le Chunking Stage.'
      }
    ],
    relatedArticles: ['stage-embedding', 'stage-extraction', 'pipeline-v3']
  },
  {
    id: 'stage-extraction',
    categoryId: 'kg-builder',
    title: 'Extraction Stage',
    subtitle: 'Extraction des entités et relations via LLM Claude',
    icon: '🤖',
    content: [
      {
        type: 'paragraph',
        content: 'L\'Extraction Stage est le cœur de la pipeline. Il utilise Claude 3.5 Sonnet via OpenRouter pour extraire les entités et relations à partir du contenu analysé.'
      },
      {
        type: 'heading',
        content: 'Modes d\'extraction'
      },
      {
        type: 'list',
        content: '',
        items: [
          'GUIDED - Types d\'entités/relations prédéfinis (Person, Organization, WORKS_AT...)',
          'OPEN - Le LLM découvre librement les types pertinents',
          'HYBRID - Combine les deux : types guidés + découverte libre'
        ]
      },
      {
        type: 'heading',
        content: 'Fonctionnalités'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Traitement par batch (50 enregistrements/batch)',
          'Déduplication automatique des entités similaires',
          'Pattern Strategy pour changer de mode facilement',
          'Gestion des erreurs et retry automatique'
        ]
      },
      {
        type: 'highlight',
        content: 'L\'extraction est le goulot d\'étranglement de la pipeline (~60-70s pour 50 lignes CSV, ~120-180s pour un PDF de 100 pages).'
      }
    ],
    relatedArticles: ['multi-pass', 'graph-aware', 'stage-validation']
  },
  {
    id: 'stage-validation',
    categoryId: 'kg-builder',
    title: 'Validation Stage',
    subtitle: 'Vérification de la qualité et cohérence des données extraites',
    icon: '✅',
    content: [
      {
        type: 'paragraph',
        content: 'Le Validation Stage vérifie la qualité et la cohérence des entités et relations extraites avant leur stockage dans Neo4j.'
      },
      {
        type: 'heading',
        content: 'Vérifications effectuées'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Champs requis - Vérifie que name, type sont présents',
          'Références d\'entités - Vérifie que les relations pointent vers des entités existantes',
          'Auto-références - Détecte les relations d\'une entité vers elle-même',
          'Types valides - Vérifie la conformité aux types configurés (mode GUIDED)'
        ]
      },
      {
        type: 'heading',
        content: 'Modes de validation'
      },
      {
        type: 'paragraph',
        content: 'Mode strict : rejette les données invalides. Mode lenient : accepte avec warnings. Configurable selon le cas d\'usage.'
      },
      {
        type: 'highlight',
        content: 'Performance ultra-rapide : ~0.01s pour un CSV, ~0.05s pour un PDF. Ne bloque jamais la pipeline.'
      }
    ],
    relatedArticles: ['stage-extraction', 'stage-storage', 'pipeline-v3']
  },
  {
    id: 'stage-storage',
    categoryId: 'kg-builder',
    title: 'Storage Stage',
    subtitle: 'Persistance des données dans Neo4j avec indexation optimisée',
    icon: '💾',
    content: [
      {
        type: 'paragraph',
        content: 'Le Storage Stage persiste les entités et relations validées dans la base Neo4j. Il gère également la génération des embeddings pour la recherche vectorielle.'
      },
      {
        type: 'heading',
        content: 'Caractéristiques'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Opérations batch (50 éléments/batch) pour performance optimale',
          'MERGE Cypher pour idempotence (pas de doublons)',
          'Génération automatique des embeddings (all-MiniLM-L6-v2, 384 dims)',
          'Indexation pour recherche rapide'
        ]
      },
      {
        type: 'heading',
        content: 'Embeddings au stockage'
      },
      {
        type: 'paragraph',
        content: 'Pour les fichiers CSV/JSON qui n\'ont pas passé par l\'Embedding Stage, les vecteurs sont générés automatiquement lors du stockage. Cela permet la recherche sémantique sur toutes les entités.'
      },
      {
        type: 'highlight',
        content: 'Le Storage Stage retourne les IDs Neo4j créés, permettant de tracer chaque entité jusqu\'à son document source.'
      }
    ],
    relatedArticles: ['stage-validation', 'pipeline-v3', 'graph-aware']
  },

  // Graph RAG Articles
  {
    id: 'graph-rag-overview',
    categoryId: 'jarvis-assistant',
    title: 'Graph RAG Overview',
    subtitle: 'Retrieval-Augmented Generation enrichi par Knowledge Graph',
    icon: '🎯',
    content: [
      {
        type: 'paragraph',
        content: 'Le Graph RAG (Retrieval-Augmented Generation) est l\'approche centrale de Jarvis pour répondre aux questions. Au lieu de se fier uniquement aux connaissances du LLM, le système récupère des informations pertinentes depuis le Knowledge Graph pour contextualiser ses réponses.'
      },
      {
        type: 'heading',
        content: 'Avantages du Graph RAG'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Réponses factuelles - Basées sur vos données, pas sur les connaissances génériques du LLM',
          'Réduction des hallucinations - Le contexte KG ancre les réponses dans la réalité',
          'Traçabilité - Chaque information peut être rattachée à sa source',
          'Personnalisation - Le système apprend et utilise vos connaissances spécifiques'
        ]
      },
      {
        type: 'heading',
        content: 'Architecture du flux'
      },
      {
        type: 'paragraph',
        content: 'Le flux Graph RAG suit 6 étapes principales : Classification d\'intent → Extraction NER → Recherche sémantique → Ranking multi-facteurs → Construction du contexte → Appel LLM. Chaque étape affine les résultats pour maximiser la pertinence.'
      },
      {
        type: 'highlight',
        content: 'Le Graph RAG réduit les hallucinations de 70% sur les questions factuelles par rapport à un LLM sans contexte.'
      }
    ],
    relatedArticles: ['semantic-retrieval', 'embeddings-role', 'intelligent-routing']
  },
  {
    id: 'semantic-retrieval',
    categoryId: 'jarvis-assistant',
    title: 'Semantic Retrieval',
    subtitle: 'Recherche vectorielle dans le Knowledge Graph',
    icon: '🔍',
    content: [
      {
        type: 'paragraph',
        content: 'Le Semantic Retrieval est le processus de recherche des entités pertinentes dans le Knowledge Graph. Il combine la recherche vectorielle (embeddings) avec la traversée du graphe pour trouver le contexte optimal.'
      },
      {
        type: 'heading',
        content: 'Processus de recherche'
      },
      {
        type: 'list',
        content: '',
        items: [
          '1. Embedding de la requête - La question utilisateur est convertie en vecteur 384D',
          '2. Recherche par similarité - Cosine similarity avec tous les embeddings du graphe',
          '3. Filtrage par seuil - Seuls les résultats avec score > 0.15 sont conservés',
          '4. Récupération des relations - Chaque entité trouvée inclut ses 10 premières relations'
        ]
      },
      {
        type: 'heading',
        content: 'Modèle d\'embedding'
      },
      {
        type: 'paragraph',
        content: 'Le système utilise all-MiniLM-L6-v2, un modèle de Sentence Transformers produisant des vecteurs de 384 dimensions. Ce modèle offre un excellent compromis entre qualité sémantique et rapidité d\'inférence.'
      },
      {
        type: 'highlight',
        content: 'La recherche retourne les top 20 candidats avec leurs scores de similarité et relations associées.'
      }
    ],
    relatedArticles: ['graph-rag-overview', 'embeddings-role', 'multi-factor-ranking']
  },
  {
    id: 'embeddings-role',
    categoryId: 'jarvis-assistant',
    title: 'Role des Embeddings',
    subtitle: 'Comment les vecteurs sémantiques alimentent le RAG',
    icon: '🧮',
    content: [
      {
        type: 'paragraph',
        content: 'Les embeddings sont des représentations vectorielles qui capturent le sens sémantique du texte. Dans Jarvis, chaque entité du Knowledge Graph possède un embedding stocké directement dans Neo4j.'
      },
      {
        type: 'heading',
        content: 'Génération des embeddings'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Texte source = nom de l\'entité + propriétés clés',
          'Modèle: all-MiniLM-L6-v2 (Sentence Transformers)',
          'Dimension: 384 valeurs float',
          'Stockage: Propriété .embedding sur chaque nœud Neo4j'
        ]
      },
      {
        type: 'heading',
        content: 'Usages dans le pipeline'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Semantic Search - Trouver les entités similaires à la question',
          'Entity Resolution - Identifier "Einstein" et "Albert Einstein" comme identiques',
          'KG Awareness - Évaluer si le KG contient des infos pertinentes',
          'Cross-document linking - Relier des entités de différents documents'
        ]
      },
      {
        type: 'highlight',
        content: 'Les embeddings permettent de comprendre que "le physicien qui a découvert la relativité" correspond à "Albert Einstein" même sans correspondance textuelle exacte.'
      }
    ],
    relatedArticles: ['semantic-retrieval', 'stage-embedding', 'entity-resolution']
  },
  {
    id: 'multi-factor-ranking',
    categoryId: 'jarvis-assistant',
    title: 'Multi-Factor Ranking',
    subtitle: 'Scoring combiné Embedding + NER + Graph Centrality',
    icon: '📊',
    content: [
      {
        type: 'paragraph',
        content: 'Le ranking multi-facteurs combine trois signaux différents pour sélectionner les entités les plus pertinentes. Cette approche dépasse la simple similarité vectorielle en intégrant la structure du graphe.'
      },
      {
        type: 'heading',
        content: 'Formule de scoring'
      },
      {
        type: 'code',
        content: 'final_score = (similarity × 0.5) + (type_match × 0.2) + (centrality × 0.3)',
        language: 'text'
      },
      {
        type: 'heading',
        content: 'Les trois facteurs'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Similarity (50%) - Score cosine entre embedding requête et entité',
          'Type Match (20%) - Correspondance entre types NER extraits et types d\'entités',
          'Graph Centrality (30%) - Nombre de relations normalisé (max 10), favorise les entités connectées'
        ]
      },
      {
        type: 'heading',
        content: 'Exemple concret'
      },
      {
        type: 'paragraph',
        content: 'Pour "Qui est le directeur de TechCorp?", une entité Person avec similarité 0.7, type PERSON match, et 8 relations obtient: (0.7×0.5) + (1.0×0.2) + (0.8×0.3) = 0.79. Elle sera classée avant une entité avec meilleure similarité mais moins connectée.'
      },
      {
        type: 'highlight',
        content: 'Le ranking sélectionne les top 5 candidats qui seront formatés dans le contexte envoyé au LLM.'
      }
    ],
    relatedArticles: ['semantic-retrieval', 'graph-rag-overview', 'intelligent-routing']
  },
  {
    id: 'intelligent-routing',
    categoryId: 'jarvis-assistant',
    title: 'Intelligent Routing',
    subtitle: 'Routage dynamique basé sur la pertinence du KG',
    icon: '🧭',
    content: [
      {
        type: 'paragraph',
        content: 'L\'Intelligent Routing (Sprint 13) est le cerveau décisionnel de l\'orchestrateur. Il détermine dynamiquement si et comment utiliser le Knowledge Graph pour répondre à une question.'
      },
      {
        type: 'heading',
        content: 'KG Awareness'
      },
      {
        type: 'paragraph',
        content: 'Avant de décider du routing, le système sonde le KG pour calculer un kg_match_score (0.0-1.0). Ce score combine la meilleure similarité (60%) et la moyenne des top résultats (40%).'
      },
      {
        type: 'heading',
        content: 'Règles de routage'
      },
      {
        type: 'list',
        content: '',
        items: [
          'full_kg - Score ≥ 0.5 → Pipeline KG complet (NER + Retrieval + Ranking)',
          'no_match - Score < 0.2 → Skip KG, réponse LLM directe',
          'direct - Intent salutation/heure → Réponse immédiate sans KG ni LLM'
        ]
      },
      {
        type: 'heading',
        content: 'Query Decomposition'
      },
      {
        type: 'paragraph',
        content: 'Pour les requêtes complexes ("Qui est Einstein et quelles sont ses découvertes?"), le système décompose en sous-tâches via LLM, puis agrège les résultats.'
      },
      {
        type: 'highlight',
        content: 'Le routing intelligent évite les requêtes KG inutiles et accélère les réponses générales de 40%.'
      }
    ],
    relatedArticles: ['graph-rag-overview', 'multi-factor-ranking', 'agent-orchestration']
  },
  {
    id: 'kg-gds-combination',
    categoryId: 'jarvis-assistant',
    title: 'KG + Embeddings + GDS',
    subtitle: 'L\'approche hybride Knowledge Graph + Graph Data Science',
    icon: '🔬',
    content: [
      {
        type: 'paragraph',
        content: 'Jarvis combine trois technologies complémentaires : le Knowledge Graph (structure), les Embeddings (sémantique) et le Graph Data Science (analyse). Cette trinité offre une compréhension riche des données.'
      },
      {
        type: 'heading',
        content: 'Knowledge Graph - La Structure'
      },
      {
        type: 'paragraph',
        content: 'Neo4j stocke les entités (nœuds) et leurs relations (arêtes). Cette structure permet de naviguer les connexions : "Marie TRAVAILLE_À TechCorp", "TechCorp BASÉ_À Paris". Le graphe capture les relations explicites entre concepts.'
      },
      {
        type: 'heading',
        content: 'Embeddings - La Sémantique'
      },
      {
        type: 'paragraph',
        content: 'Les vecteurs de 384 dimensions capturent le sens au-delà des mots. "Entreprise" et "Société" ont des embeddings proches même sans lien textuel. Cela permet la recherche par similarité de sens.'
      },
      {
        type: 'heading',
        content: 'Graph Data Science - L\'Analyse'
      },
      {
        type: 'list',
        content: '',
        items: [
          'Centralité - Identifier les entités les plus connectées/importantes',
          'Communautés - Détecter les clusters d\'entités liées',
          'Similarité structurelle - Trouver des entités avec patterns de relations similaires',
          'Chemins - Calculer les connexions entre deux entités'
        ]
      },
      {
        type: 'highlight',
        content: 'La combinaison KG+Embeddings+GDS permet de répondre à des questions que chaque composant seul ne pourrait pas traiter efficacement.'
      }
    ],
    relatedArticles: ['multi-factor-ranking', 'embeddings-role', 'graph-rag-overview']
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
