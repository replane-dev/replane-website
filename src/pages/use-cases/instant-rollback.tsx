import {
  RotateCcw,
  History,
  Clock,
  Shield,
  GitBranch,
  Eye,
  Server,
  Zap,
  Layers
} from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Instant Rollback',
  title: 'Revert in seconds',
  subtitle: 'Every change is versioned, every state is recoverable',
  description:
    'Complete version history for every config. See what changed, when, and by whom. Revert to any previous state with one click—changes apply instantly.',
  accentColor: 'emerald',

  painPoints: [
    {
      title: 'No config history',
      description: "When something breaks, you don't know what changed. Debugging takes hours."
    },
    {
      title: 'Slow recovery',
      description: 'Reverting a bad config requires finding the old value, deploying, and waiting.'
    },
    {
      title: 'No audit trail',
      description: "Can't tell who changed what. Compliance audits are painful."
    },
    {
      title: 'Manual snapshots',
      description: "Have to remember to save before changes. Often forget until it's too late."
    }
  ],
  solutions: [
    {
      title: 'Automatic versioning',
      description: 'Every save creates a new version. Complete history, always.'
    },
    {
      title: 'One-click rollback',
      description: 'Select any version, click restore. Changes apply in milliseconds.'
    },
    {
      title: 'Full audit trail',
      description: 'Every change logged with timestamp, author, and optional message.'
    },
    {
      title: 'Visual diff',
      description: 'See exactly what changed between versions before rolling back.'
    }
  ],

  features: [
    {
      title: 'Unlimited Versions',
      description: 'Complete history preserved for every config',
      icon: <Server className='h-6 w-6' />
    },
    {
      title: 'Instant Recovery',
      description: 'Rollback takes effect in under a second',
      icon: <Zap className='h-6 w-6' />
    },
    {
      title: 'Full Auditability',
      description: 'Track every change with complete history',
      icon: <History className='h-6 w-6' />
    },
    {
      title: 'One-Click Restore',
      description: 'Restore any previous version instantly',
      icon: <Layers className='h-6 w-6' />
    }
  ],

  steps: [
    {
      title: 'Automatic versioning',
      description:
        'Every save creates a new version. No manual snapshots needed—your history is always complete.',
      icon: <History className='h-8 w-8' />
    },
    {
      title: 'Compare changes',
      description:
        'Visual diff shows exactly what changed between versions. Understand the impact before rolling back.',
      icon: <GitBranch className='h-8 w-8' />
    },
    {
      title: 'One-click revert',
      description:
        'Select any previous version and restore. Changes propagate to all servers instantly.',
      icon: <RotateCcw className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Complete history',
      description:
        'Every version is preserved with timestamp, author, and optional commit message.',
      icon: <Clock className='h-6 w-6' />
    },
    {
      title: 'Instant recovery',
      description: 'Rollback takes effect in milliseconds. No deploy, no downtime, no waiting.',
      icon: <Shield className='h-6 w-6' />
    },
    {
      title: 'Audit compliance',
      description: 'Full audit trail satisfies SOC 2, HIPAA, and other compliance requirements.',
      icon: <Eye className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'How long is version history retained?',
      answer:
        'Forever. We never delete version history. You can rollback to any previous state, no matter how old. This is essential for compliance and debugging production issues.'
    },
    {
      question: 'Can I compare two versions before rolling back?',
      answer:
        'Yes! The dashboard shows a visual diff between any two versions. See exactly what values changed, what was added, and what was removed before deciding to rollback.'
    },
    {
      question: 'What happens to in-flight requests during rollback?',
      answer:
        'In-flight requests complete with their current config. New requests immediately use the rolled-back config. There is no downtime or inconsistent state.'
    },
    {
      question: 'Can I rollback just one config, not all of them?',
      answer:
        'Yes! Each config has its own version history. You can rollback individual configs independently without affecting others.'
    },
    {
      question: 'Is there a way to add notes to versions?',
      answer:
        'Yes! You can add optional commit messages when saving changes. This helps your team understand why a change was made when reviewing history later.'
    }
  ],

  relatedUseCases: [
    {
      title: 'Kill Switch',
      description: 'Instantly disable features when things go wrong.',
      href: '/use-cases/kill-switch',
      accentColor: 'red'
    },
    {
      title: 'Feature Flags',
      description: 'Ship features safely with gradual rollouts.',
      href: '/use-cases/feature-flags',
      accentColor: 'blue'
    },
    {
      title: 'Operational Tuning',
      description: 'Adjust system parameters with easy rollback.',
      href: '/use-cases/operational-tuning',
      accentColor: 'violet'
    }
  ],

  codeExamples: [
    {
      sdk: 'typescript',
      label: 'TypeScript',
      docsLink: '/docs/sdk/javascript',
      code: `import { Replane } from '@replanejs/sdk'

interface Configs {
  'max-upload-size-mb': number
  'allowed-formats': string[]
  'compression-enabled': boolean
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Your code automatically uses the latest config
const maxUploadSize = replane.get('max-upload-size-mb')
const allowedFormats = replane.get('allowed-formats')

// When you rollback in the dashboard,
// all connected clients receive the update instantly
replane.subscribe('max-upload-size-mb', (config) => {
  console.log('Config updated:', config.value)
  // Your app automatically uses the rolled-back values
})

// Example: using config values that might be rolled back
function getUploadConfig() {
  return {
    maxSize: replane.get('max-upload-size-mb'),
    formats: replane.get('allowed-formats'),
    compress: replane.get('compression-enabled')
  }
}`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'

function UploadForm() {
  // Config values update automatically when rolled back
  const maxSize = useConfig<number>('max-upload-size-mb')
  const allowedFormats = useConfig<string[]>('allowed-formats')

  const handleUpload = async (file: File) => {
    // Validation uses current config values
    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(\`File too large. Max: \${maxSize}MB\`)
    }

    const ext = file.name.split('.').pop()
    if (!allowedFormats.includes(ext)) {
      throw new Error(\`Format not allowed: \${ext}\`)
    }

    await uploadFile(file)
  }

  return (
    <div>
      <p>Max size: {maxSize}MB</p>
      <p>Formats: {allowedFormats.join(', ')}</p>
      <FileInput onUpload={handleUpload} />
    </div>
  )
}

// If limits cause issues, rollback in dashboard
// Component re-renders with previous values automatically`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// app/api/upload/route.ts
import { getReplaneSnapshot } from '@replanejs/next'

export async function POST(request: Request) {
  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })
  
  // These values can be rolled back instantly
  const maxSize = snapshot.get('max-upload-size-mb') * 1024 * 1024
  const allowedFormats = snapshot.get('allowed-formats')

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (file.size > maxSize) {
    return Response.json(
      { error: 'File too large' },
      { status: 413 }
    )
  }

  // Process upload...
  return Response.json({ success: true })
}

// When you rollback config in the dashboard:
// 1. Change is saved with full version history
// 2. SSE pushes update to all servers
// 3. Next request uses rolled-back values
// 4. No redeploy needed`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'

  // Reactive to config changes (including rollbacks)
  const maxSize = config<number>('max-upload-size-mb')
  const allowedFormats = config<string[]>('allowed-formats')

  async function handleUpload(event) {
    const file = event.target.files[0]
    
    if (file.size > $maxSize * 1024 * 1024) {
      alert(\`File too large. Max: \${$maxSize}MB\`)
      return
    }

    await uploadFile(file)
  }
</script>

<div>
  <p>Max upload size: {$maxSize}MB</p>
  <p>Allowed formats: {$allowedFormats.join(', ')}</p>
  
  <input 
    type="file" 
    accept={$allowedFormats.map(f => '.' + f).join(',')}
    on:change={handleUpload}
  />
</div>

<!-- Rollback in dashboard → values update here instantly -->`
    },
    {
      sdk: 'python',
      label: 'Python',
      docsLink: '/docs/sdk/python',
      code: `from replane import Replane
from fastapi import FastAPI, UploadFile, HTTPException
import os

app = FastAPI()

replane = Replane(
    base_url=os.environ["REPLANE_BASE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"]
)

@app.on_event("startup")
async def startup():
    replane.connect()

@app.on_event("shutdown")
async def shutdown():
    replane.close()

@app.post("/api/upload")
async def upload_file(file: UploadFile):
    # Values can be rolled back instantly
    max_size = replane.get("max-upload-size-mb") * 1024 * 1024
    allowed_formats = replane.get("allowed-formats")
    
    # Validate against current config
    if file.size > max_size:
        raise HTTPException(413, "File too large")
    
    ext = file.filename.split(".")[-1]
    if ext not in allowed_formats:
        raise HTTPException(400, f"Format not allowed: {ext}")
    
    # Process upload...
    return {"success": True}

# Rollback in dashboard:
# - Version history shows all changes
# - One click restores previous values  
# - SSE pushes to all servers instantly
# - Next request uses rolled-back config`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;
using Microsoft.AspNetCore.Mvc;

public class UploadController : ControllerBase
{
    private readonly IReplaneClient _replane;

    public UploadController(IReplaneClient replane)
    {
        _replane = replane;
    }

    [HttpPost("api/upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        // These values can be rolled back instantly
        var maxSize = _replane.Get<int>("max-upload-size-mb") * 1024 * 1024;
        var allowedFormats = _replane.Get<List<string>>("allowed-formats");

        if (file.Length > maxSize)
        {
            return StatusCode(413, new { 
                error = "File too large" 
            });
        }

        var ext = Path.GetExtension(file.FileName)
            .TrimStart('.');
            
        if (!allowedFormats.Contains(ext))
        {
            return BadRequest(new { 
                error = $"Format not allowed: {ext}" 
            });
        }

        // Process upload...
        return Ok(new { success = true });
    }
}`
    }
  ]
}

export default function InstantRollbackPage() {
  return <UseCaseLayout {...content} />
}
