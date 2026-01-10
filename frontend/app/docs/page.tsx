"use client"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy, Github } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Highlight, themes } from "prism-react-renderer"

const CodeBlock = ({ language, code }: { language: string, code: string }) => {
    const [copied, setCopied] = useState(false)

    const onCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative my-4 rounded-lg overflow-hidden border border-zinc-800 bg-[#0d1117]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/80">
                <span className="text-xs text-zinc-500 font-mono uppercase tracking-wide">{language || 'code'}</span>
                <button
                    onClick={onCopy}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-800"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <>
                            <Check className="size-3.5 text-green-400" />
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="size-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <Highlight
                theme={themes.nightOwl}
                code={code.trim()}
                language={language === 'text' ? 'markup' : (language || 'python')}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className="p-4 overflow-x-auto text-sm leading-relaxed" style={{ ...style, backgroundColor: 'transparent', margin: 0 }}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })} className="table-row">
                                <span className="table-cell pr-4 text-zinc-600 select-none text-right w-8">{i + 1}</span>
                                <span className="table-cell">
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </span>
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    )
}

export default function DocsPage() {
    return (
        <div className="space-y-16 pb-16">
            {/* Introduction */}
            <section id="introduction" className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                            Krira Chunker
                        </h1>
                        <Badge variant="secondary" className="text-sm font-medium">Beta</Badge>
                    </div>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        High-Performance Rust Chunking Engine for RAG Pipelines
                    </p>
                </div>
                <div className="rounded-xl border bg-gradient-to-r from-primary/5 to-primary/10 p-6">
                    <p className="leading-7 text-foreground">
                        Process gigabytes of text in seconds. <span className="font-semibold text-primary">40x faster than LangChain</span> with <span className="font-semibold text-primary">O(1) memory usage</span>.
                    </p>
                </div>
            </section>

            {/* Installation */}
            <section id="installation" className="space-y-4">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-3">
                    Installation
                </h2>
                <CodeBlock language="bash" code="pip install krira-augment" />
            </section>

            {/* Quick Usage */}
            <section id="quick-usage" className="space-y-4">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-3">
                    Quick Usage
                </h2>
                <CodeBlock language="python" code={`from krira_augment.krira_chunker import Pipeline, PipelineConfig, SplitStrategy

config = PipelineConfig(
    chunk_size=512,
    strategy=SplitStrategy.SMART,
    clean_html=True,
    clean_unicode=True,
)

pipeline = Pipeline(config=config)

result = pipeline.process("sample.csv", output_path="output.jsonl")

print(result)
print(f"Chunks Created: {result.chunks_created}")
print(f"Execution Time: {result.execution_time:.2f}s")
print(f"Throughput: {result.mb_per_second:.2f} MB/s")
print(f"Preview: {result.preview_chunks[:3]}")`} />
            </section>

            {/* Performance Benchmark */}
            <section id="performance" className="space-y-4">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-3">
                    Performance Benchmark
                </h2>
                <p className="leading-7 text-muted-foreground">
                    Processing <strong className="text-foreground">42.4 million chunks</strong> in <strong className="text-foreground">105 seconds</strong> (51.16 MB/s).
                </p>
                <CodeBlock language="text" code={`============================================================
✅ KRIRA AUGMENT - Processing Complete
============================================================
📊 Chunks Created:  42,448,765
⏱️  Execution Time:  113.79 seconds
🚀 Throughput:      47.51 MB/s
📁 Output File:     output.jsonl
============================================================

📝 Preview (Top 3 Chunks):
------------------------------------------------------------
[1] event_time,event_type,product_id,category_id,...
[2] 2019-10-01 00:00:00 UTC,view,44600062,...
[3] 2019-10-01 00:00:00 UTC,view,3900821,...`} />
            </section>

            {/* Local RAG Example */}
            <section id="local-rag" className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-3">
                    Complete Example: Local (ChromaDB) - FREE
                </h2>
                <p className="text-muted-foreground">No API keys required. Runs entirely on your machine.</p>
                <CodeBlock language="bash" code="pip install sentence-transformers chromadb" />
                <CodeBlock language="python" code={`from krira_augment.krira_chunker import Pipeline, PipelineConfig
from sentence_transformers import SentenceTransformer
import chromadb
import json

# Step 1: Chunk the file (Rust Core)
config = PipelineConfig(chunk_size=512, chunk_overlap=50)
pipeline = Pipeline(config=config)
result = pipeline.process("sample.csv", output_path="chunks.jsonl")

# Step 2: Embed and store (Local)
print("Loading model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
client = chromadb.Client()
collection = client.get_or_create_collection("my_rag_db")

with open("chunks.jsonl", "r") as f:
    for line_num, line in enumerate(f, 1):
        chunk = json.loads(line)
        embedding = model.encode(chunk["text"])
        
        collection.add(
            ids=[f"chunk_{line_num}"],
            embeddings=[embedding.tolist()],
            metadatas=[chunk.get("metadata")] if chunk.get("metadata") else None,
            documents=[chunk["text"]]
        )`} />
            </section>

            {/* Cloud Integrations */}
            <section id="cloud-integrations" className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-3">
                    Cloud Integrations
                </h2>
                <p className="text-muted-foreground">Swap Local step with these integrations if you have API keys.</p>

                <Tabs defaultValue="openai-pinecone" className="w-full">
                    <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-muted/50 p-1 rounded-lg">
                        <TabsTrigger value="openai-pinecone" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">OpenAI + Pinecone</TabsTrigger>
                        <TabsTrigger value="openai-qdrant" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">OpenAI + Qdrant</TabsTrigger>
                        <TabsTrigger value="openai-weaviate" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">OpenAI + Weaviate</TabsTrigger>
                        <TabsTrigger value="cohere-pinecone" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Cohere + Pinecone</TabsTrigger>
                    </TabsList>

                    <TabsContent value="openai-pinecone" className="mt-4">
                        <CodeBlock language="python" code={`from openai import OpenAI
from pinecone import Pinecone

client = OpenAI(api_key="sk-...")
pc = Pinecone(api_key="pcone-...")
index = pc.Index("my-rag")

with open("chunks.jsonl", "r") as f:
    for line_num, line in enumerate(f, 1):
        chunk = json.loads(line)
        
        response = client.embeddings.create(
            input=chunk["text"],
            model="text-embedding-3-small"
        )
        embedding = response.data[0].embedding
        
        index.upsert(vectors=[(
            f"chunk_{line_num}",
            embedding,
            chunk.get("metadata", {})
        )])`} />
                    </TabsContent>
                    <TabsContent value="openai-qdrant" className="mt-4">
                        <CodeBlock language="python" code={`from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct

client = OpenAI(api_key="sk-...")
qdrant = QdrantClient(url="https://xyz.qdrant.io", api_key="qdrant-...")

with open("chunks.jsonl", "r") as f:
    for line_num, line in enumerate(f, 1):
        chunk = json.loads(line)
        response = client.embeddings.create(
            input=chunk["text"],
            model="text-embedding-3-small"
        )
        embedding = response.data[0].embedding
        
        qdrant.upsert(
            collection_name="my-chunks",
            points=[PointStruct(
                id=line_num,
                vector=embedding,
                payload=chunk.get("metadata", {})
            )]
        )`} />
                    </TabsContent>
                    <TabsContent value="openai-weaviate" className="mt-4">
                        <CodeBlock language="python" code={`import weaviate
from openai import OpenAI

client_w = weaviate.connect_to_wcs(
    cluster_url="https://xyz.weaviate.network",
    auth_credentials=weaviate.auth.AuthApiKey("weaviate-...")
)
client_o = OpenAI(api_key="sk-...")

collection = client_w.collections.get("Chunk")

with open("chunks.jsonl", "r") as f:
    for line_num, line in enumerate(f, 1):
        chunk = json.loads(line)
        response = client_o.embeddings.create(
            input=chunk["text"],
            model="text-embedding-3-small"
        )
        embedding = response.data[0].embedding
        
        collection.data.insert(
            properties={"text": chunk["text"]},
            vector=embedding
        )`} />
                    </TabsContent>
                    <TabsContent value="cohere-pinecone" className="mt-4">
                        <CodeBlock language="python" code={`import cohere
from pinecone import Pinecone

co = cohere.Client("co-...")
pc = Pinecone(api_key="pcone-...")
index = pc.Index("my-rag")

with open("chunks.jsonl", "r") as f:
    for line_num, line in enumerate(f, 1):
        chunk = json.loads(line)
        response = co.embed(
            texts=[chunk["text"]],
            model="embed-english-v3.0"
        )
        embedding = response.embeddings[0]
        
        index.upsert(vectors=[(
            f"chunk_{line_num}",
            embedding,
            chunk.get("metadata", {})
        )])`} />
                    </TabsContent>
                </Tabs>
            </section>

            {/* Streaming Mode */}
            <section id="streaming-mode" className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-3">
                    Streaming Mode (No Files)
                </h2>
                <p className="leading-7 text-muted-foreground">
                    Process chunks without saving to disk - maximum efficiency for real-time pipelines.
                </p>
                <CodeBlock language="python" code={`from krira_augment.krira_chunker import Pipeline, PipelineConfig

# Configure pipeline
config = PipelineConfig(chunk_size=512, chunk_overlap=50)
pipeline = Pipeline(config=config)

# Stream and embed (no file created)
for chunk in pipeline.process_stream("data.csv"):
    # process chunk directly
    embedding = model.encode(chunk["text"])
    # store immediately...`} />

                <div className="my-8">
                    <h3 className="text-lg font-semibold mb-4">When to Use Streaming vs File-Based</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-green-500/20 bg-green-500/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base text-green-600 dark:text-green-400">Use Streaming When</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-center gap-2"><Check className="size-4 text-green-500" /> Maximum speed (no disk writes)</div>
                                <div className="flex items-center gap-2"><Check className="size-4 text-green-500" /> Real-time pipelines</div>
                                <div className="flex items-center gap-2"><Check className="size-4 text-green-500" /> Limited disk space</div>
                            </CardContent>
                        </Card>
                        <Card className="border-blue-500/20 bg-blue-500/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base text-blue-600 dark:text-blue-400">Use File-Based When</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-center gap-2"><Check className="size-4 text-blue-500" /> Inspect/debug chunks</div>
                                <div className="flex items-center gap-2"><Check className="size-4 text-blue-500" /> Re-process data</div>
                                <div className="flex items-center gap-2"><Check className="size-4 text-blue-500" /> Sharing chunks</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Supported Formats */}
            <section id="supported-formats" className="space-y-4">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-3">
                    Supported Formats
                </h2>
                <div className="rounded-xl border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr className="*:px-4 *:py-3 *:text-left *:font-medium">
                                <th>Format</th>
                                <th>Extension</th>
                                <th>Method</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>CSV</td><td><code className="text-xs bg-muted px-1.5 py-0.5 rounded">.csv</code></td><td>Direct processing</td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>Text</td><td><code className="text-xs bg-muted px-1.5 py-0.5 rounded">.txt</code></td><td>Direct processing</td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>JSONL</td><td><code className="text-xs bg-muted px-1.5 py-0.5 rounded">.jsonl</code></td><td>Direct processing</td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>JSON</td><td><code className="text-xs bg-muted px-1.5 py-0.5 rounded">.json</code></td><td>Auto-flattening</td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>PDF</td><td><code className="text-xs bg-muted px-1.5 py-0.5 rounded">.pdf</code></td><td>pdfplumber extraction</td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>Word</td><td><code className="text-xs bg-muted px-1.5 py-0.5 rounded">.docx</code></td><td>python-docx extraction</td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>Excel</td><td><code className="text-xs bg-muted px-1.5 py-0.5 rounded">.xlsx</code></td><td>openpyxl extraction</td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>XML</td><td><code className="text-xs bg-muted px-1.5 py-0.5 rounded">.xml</code></td><td>ElementTree parsing</td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>URLs</td><td><code className="text-xs bg-muted px-1.5 py-0.5 rounded">http://</code></td><td>BeautifulSoup scraping</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Provider Comparison */}
            <section id="provider-comparison" className="space-y-4">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-3">
                    Provider Comparison
                </h2>
                <div className="rounded-xl border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr className="*:px-4 *:py-3 *:text-left *:font-medium">
                                <th>Provider</th>
                                <th>Cost</th>
                                <th>Streaming</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>OpenAI + Pinecone</td><td>Paid</td><td><span className="text-green-500">✓</span></td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>OpenAI + Qdrant</td><td>Paid</td><td><span className="text-green-500">✓</span></td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>SentenceTransformers + ChromaDB</td><td><Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">FREE</Badge></td><td><span className="text-green-500">✓</span></td></tr>
                            <tr className="*:px-4 *:py-3 hover:bg-muted/30 transition-colors"><td>Hugging Face + FAISS</td><td><Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">FREE</Badge></td><td><span className="text-green-500">✓</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Development */}
            <section id="development" className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-3">
                    Development
                </h2>

                <Link
                    href="https://github.com/Krira-Labs/krira-chunker"
                    target="_blank"
                    className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent transition-colors group"
                >
                    <div className="p-2 rounded-lg bg-foreground text-background">
                        <Github className="size-5" />
                    </div>
                    <div>
                        <div className="font-medium group-hover:underline">Open Source on GitHub</div>
                        <div className="text-sm text-muted-foreground">github.com/Krira-Labs/krira-chunker</div>
                    </div>
                </Link>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Local Development</h3>
                    <CodeBlock language="bash" code={`# Clone the repository
git clone https://github.com/Krira-Labs/krira-chunker.git
cd krira-chunker

# Install Maturin (Rust-Python build tool)
pip install maturin

# Build and install locally
maturin develop`} />
                </div>
            </section>
        </div>
    )
}
