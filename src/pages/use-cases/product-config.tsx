import { Sliders, Target, TrendingUp, Zap, RefreshCw, BarChart3, Rocket, RotateCcw } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Product Config',
  title: 'Tune algorithms live',
  subtitle: 'Adjust ranking weights, thresholds, and parameters in real-time',
  description:
    'Store ranking weights, similarity thresholds, and relevance parameters in Replane. Data scientists and product managers iterate on algorithms without waiting for deploys.',
  accentColor: 'fuchsia',

  painPoints: [
    {
      title: 'Hardcoded parameters',
      description: 'Algorithm weights buried in code. Changing them requires a deploy.'
    },
    {
      title: 'Slow experimentation',
      description: 'Testing new parameter values takes days with deploy cycles.'
    },
    {
      title: 'Engineering bottleneck',
      description: 'Data scientists wait for engineers to update and deploy parameter changes.'
    },
    {
      title: "Can't respond to feedback",
      description: 'Users complain about search results. Fixes take too long.'
    }
  ],
  solutions: [
    {
      title: 'Externalized parameters',
      description: 'Store all algorithm parameters in Replane. Change without code.'
    },
    {
      title: 'Instant iteration',
      description: 'Adjust weights, see results immediately. Iterate in minutes.'
    },
    {
      title: 'Self-service for data teams',
      description: 'Data scientists tune algorithms directly. No engineering bottleneck.'
    },
    {
      title: 'Quick response',
      description: 'Bad search results? Adjust parameters and fix in seconds.'
    }
  ],

  features: [
    { title: 'Instant Apply', description: 'Changes take effect in under a second', icon: <Zap className='h-6 w-6' /> },
    { title: 'No Deploys', description: 'Update product config without code changes', icon: <Rocket className='h-6 w-6' /> },
    { title: 'Unlimited Iterations', description: 'Tune parameters as often as needed', icon: <RefreshCw className='h-6 w-6' /> },
    { title: 'Instant Rollback', description: 'Revert any change with one click', icon: <RotateCcw className='h-6 w-6' /> }
  ],

  steps: [
    {
      title: 'Define parameters',
      description:
        'Store ranking weights, thresholds, and tuning parameters in Replane. Use structured JSON for complex configs.',
      icon: <Sliders className='h-8 w-8' />
    },
    {
      title: 'Observe behavior',
      description:
        'Monitor search quality, recommendation CTR, or matching accuracy. Identify opportunities.',
      icon: <BarChart3 className='h-8 w-8' />
    },
    {
      title: 'Tune and iterate',
      description:
        'Adjust parameters and see immediate impact. Find the optimal values through rapid iteration.',
      icon: <Target className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Rapid iteration',
      description:
        'Test new parameter values in minutes, not days. Accelerate algorithm improvement.',
      icon: <Zap className='h-6 w-6' />
    },
    {
      title: 'Safe experimentation',
      description:
        'Every change is versioned. Made things worse? Rollback to previous values instantly.',
      icon: <RefreshCw className='h-6 w-6' />
    },
    {
      title: 'Measurable impact',
      description:
        'A/B test different parameter sets. Measure the impact on your key metrics.',
      icon: <TrendingUp className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'What kind of parameters should I externalize?',
      answer:
        'Ranking weights, similarity thresholds, relevance boosts, matching criteria, score normalizations, and any numeric value that affects algorithm behavior. If you tune it during development, it belongs in Replane.'
    },
    {
      question: 'Can data scientists make changes directly?',
      answer:
        'Yes! Give your data team dashboard access. They can adjust parameters, run experiments, and iterate on algorithms without engineering involvement. RBAC ensures they can only modify what they should.'
    },
    {
      question: 'How do I A/B test different parameter sets?',
      answer:
        'Create multiple configs with different parameter values. Use override rules to serve different configs to different user percentages. Compare metrics in your analytics tools.'
    },
    {
      question: 'What if parameter changes break the algorithm?',
      answer:
        'Every change is versioned with full history. If a parameter change causes issues, rollback to the previous value with one click. Changes revert in milliseconds.'
    },
    {
      question: 'How do I coordinate parameter changes across services?',
      answer:
        'Replane pushes updates to all connected clients via SSE simultaneously. All services receive new parameters at the same time, ensuring consistent algorithm behavior.'
    }
  ],

  relatedUseCases: [
    {
      title: 'A/B Testing',
      description: 'Test different parameter sets with user segments.',
      href: '/use-cases/ab-testing',
      accentColor: 'amber'
    },
    {
      title: 'Performance Tuning',
      description: 'Optimize algorithm performance parameters.',
      href: '/use-cases/performance-tuning',
      accentColor: 'orange'
    },
    {
      title: 'Instant Rollback',
      description: 'Revert parameter changes if needed.',
      href: '/use-cases/instant-rollback',
      accentColor: 'emerald'
    }
  ],

  codeExamples: [
    {
      sdk: 'typescript',
      label: 'TypeScript',
      docsLink: '/docs/sdk/javascript',
      code: `import { Replane } from '@replanejs/sdk'

interface Configs {
  'search-weights': {
    title: number
    description: number
    tags: number
    recency: number
  }
  'similarity-threshold': number
  'max-results': number
  'boost-premium': number
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

function rankSearchResults(query: string, items: Item[]) {
  const weights = replane.get('search-weights')
  const threshold = replane.get('similarity-threshold')
  const maxResults = replane.get('max-results')
  const premiumBoost = replane.get('boost-premium')

  return items
    .map(item => ({
      item,
      score: 
        weights.title * scoreTitle(query, item.title) +
        weights.description * scoreDescription(query, item.description) +
        weights.tags * scoreTags(query, item.tags) +
        weights.recency * scoreRecency(item.createdAt) +
        (item.isPremium ? premiumBoost : 0)
    }))
    .filter(r => r.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
}`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'

function useSearchRanking() {
  const weights = useConfig<{
    title: number
    description: number
    tags: number
    recency: number
  }>('search-weights')
  
  const threshold = useConfig<number>('similarity-threshold')
  const maxResults = useConfig<number>('max-results')

  const rankResults = useCallback((query: string, items: Item[]) => {
    return items
      .map(item => ({
        item,
        score: 
          weights.title * scoreTitle(query, item.title) +
          weights.description * scoreDescription(query, item.description) +
          weights.tags * scoreTags(query, item.tags) +
          weights.recency * scoreRecency(item.createdAt)
      }))
      .filter(r => r.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
  }, [weights, threshold, maxResults])

  return { rankResults }
}

// Data scientists adjust weights in dashboard
// Search results update with new ranking immediately`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// app/api/search/route.ts
import { getReplaneSnapshot } from '@replanejs/next'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })
  
  const weights = snapshot.get('search-weights')
  const threshold = snapshot.get('similarity-threshold')
  const maxResults = snapshot.get('max-results')

  // Get items from database
  const items = await db.items.findMany()

  // Rank with configurable weights
  const results = items
    .map(item => ({
      ...item,
      score: 
        weights.title * scoreTitle(query, item.title) +
        weights.description * scoreDescription(query, item.description) +
        weights.tags * scoreTags(query, item.tags)
    }))
    .filter(r => r.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)

  return Response.json({ results })
}`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'

  const weights = config<{
    title: number
    description: number
    tags: number
  }>('search-weights')
  
  const threshold = config<number>('similarity-threshold')
  const maxResults = config<number>('max-results')

  function rankResults(query: string, items: Item[]) {
    return items
      .map(item => ({
        item,
        score: 
          $weights.title * scoreTitle(query, item.title) +
          $weights.description * scoreDescription(query, item.description) +
          $weights.tags * scoreTags(query, item.tags)
      }))
      .filter(r => r.score >= $threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, $maxResults)
  }
</script>

<!-- Display current weights for debugging -->
{#if import.meta.env.DEV}
  <pre>Weights: {JSON.stringify($weights, null, 2)}</pre>
{/if}`
    },
    {
      sdk: 'python',
      label: 'Python',
      docsLink: '/docs/sdk/python',
      code: `from replane import Replane
import os

replane = Replane(
    base_url=os.environ["REPLANE_BASE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"]
)

def rank_search_results(query: str, items: list) -> list:
    weights = replane.get("search-weights")
    threshold = replane.get("similarity-threshold")
    max_results = replane.get("max-results")
    
    results = []
    for item in items:
        score = (
            weights["title"] * score_title(query, item["title"]) +
            weights["description"] * score_description(query, item["description"]) +
            weights["tags"] * score_tags(query, item["tags"]) +
            weights["recency"] * score_recency(item["created_at"])
        )
        
        if score >= threshold:
            results.append({"item": item, "score": score})
    
    results.sort(key=lambda r: r["score"], reverse=True)
    return results[:max_results]

# React to weight changes for monitoring
def on_weights_change(config):
    print(f"Search weights updated: {config.value}")
    # Invalidate any caches if needed

replane.subscribe_config("search-weights", on_weights_change)`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;

public class SearchRankingService
{
    private readonly IReplaneClient _replane;

    public SearchRankingService(IReplaneClient replane)
    {
        _replane = replane;
    }

    public List<SearchResult> RankResults(
        string query, 
        List<Item> items)
    {
        var weights = _replane.Get<SearchWeights>("search-weights");
        var threshold = _replane.Get<double>("similarity-threshold");
        var maxResults = _replane.Get<int>("max-results");

        return items
            .Select(item => new SearchResult
            {
                Item = item,
                Score = 
                    weights.Title * ScoreTitle(query, item.Title) +
                    weights.Description * ScoreDescription(query, item.Description) +
                    weights.Tags * ScoreTags(query, item.Tags) +
                    weights.Recency * ScoreRecency(item.CreatedAt)
            })
            .Where(r => r.Score >= threshold)
            .OrderByDescending(r => r.Score)
            .Take(maxResults)
            .ToList();
    }
}

public class SearchWeights
{
    public double Title { get; set; }
    public double Description { get; set; }
    public double Tags { get; set; }
    public double Recency { get; set; }
}`
    }
  ]
}

export default function ProductConfigPage() {
  return <UseCaseLayout {...content} />
}
