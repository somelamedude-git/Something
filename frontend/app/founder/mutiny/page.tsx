"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Send, Loader2 } from "lucide-react"
import MutinyResults from "@/components/mutiny-results"
import FeedbackPanel from "@/components/feedback-panel"
import { queryMutiny, type MutinyResponse } from "@/lib/mock-mutiny"

type Message = { id: string; from: "you" | "bot"; text: string; ts: string }

export default function FounderMutinyPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [mode, setMode] = useState<"mut" | "iny" | "mutiny">("mutiny")
  const [results, setResults] = useState<MutinyResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = {
      id: Date.now().toString(),
      from: "you",
      text: text.trim(),
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await queryMutiny(text, mode)
      setResults(res)
      const botText = res.rationale || "Here are some matches and suggestions."
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        from: "bot",
        text: botText,
        ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, botMsg])
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 60)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const downloadChats = () => {
    const payload = { createdAt: new Date().toISOString(), mode, messages }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mutiny-chat-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const toggles: { key: "mut" | "iny" | "mutiny"; label: string; color: string }[] = [
    { key: "mut", label: "Mut", color: "bg-red-500" },
    { key: "iny", label: "Iny", color: "bg-green-500" },
    { key: "mutiny", label: "Mutiny", color: "bg-purple-600" },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto px-6">
      {/* Header */}
      <header className="flex items-center justify-end gap-3 py-6">
        <div className="flex items-center gap-1" role="group" aria-label="Model selection">
          {toggles.map((t) => (
            <button
              key={t.key}
              aria-label={`Select ${t.label} model`}
              aria-pressed={mode === t.key}
              onClick={() => setMode(t.key)}
              className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors ${
                mode === t.key ? `${t.color} text-white` : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={downloadChats}
          aria-label="Download chat as JSON"
          className="text-white/60 hover:text-white hover:bg-white/5"
        >
          <Download className="h-4 w-4" />
        </Button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-3xl font-bold text-white">Think or Die a potato</h1>
            <p className="mt-3 text-white/50">Start a conversation — the models are ready.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-6">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    m.from === "you" ? "bg-white text-black" : "bg-zinc-800 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <time className={`block text-xs mt-2 ${m.from === "you" ? "text-black/40" : "text-white/40"}`}>
                    {m.ts}
                  </time>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 px-4 py-3 rounded-2xl">
                  <Loader2 className="h-5 w-5 animate-spin text-white/60" />
                </div>
              </div>
            )}

            {results && !loading && (
              <div className="mt-8 space-y-4">
                <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
                  <MutinyResults data={results} />
                </div>
                <FeedbackPanel />
              </div>
            )}

            <div ref={endRef} />
          </div>
        )}
      </main>

      {/* Composer */}
      <footer className="py-6 border-t border-white/5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(input)
          }}
          className="flex items-end gap-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            aria-label="Message input"
            rows={1}
            className="flex-1 min-h-[48px] max-h-[160px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
          />
          <Button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="h-12 px-5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  )
}
