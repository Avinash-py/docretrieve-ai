"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
// import { Send, FileText, Clock } from "lucide-react";
import { Home, Upload, Search, FileText, Send } from "lucide-react";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

   const handleSearch = async () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error("Search failed");
      }

      const result = await response.json();

      const aiResponse = {
        type: "ai",
        content: result.answer || "Sorry, I couldn't find relevant information.",
        sources: result.sources || []
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Search error:", error);
      const errorResponse = {
        type: "ai",
        content: "❌ Could not connect to the search engine. Make sure the backend is running.",
        sources: []
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <div className="w-72 bg-white border-r h-screen p-6 flex flex-col fixed">
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-blue-600">DocRetrieve AI</h1>
          <p className="text-xs text-gray-500 mt-1">Enterprise Knowledge Engine</p>
        </div>

        <nav className="flex-1 space-y-1">
          <a href="/" className="block">
            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-left">
              <Home size={20} /> Dashboard
            </Button>
          </a>

          <a href="/upload" className="block">
            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-left">
              <Upload size={20} /> Upload Documents
            </Button>
          </a>

          <a href="/search" className="block">
            <Button variant="default" className="w-full justify-start gap-3 h-12 text-left">
              <Send size={20} /> Intelligent Search
            </Button>
          </a>

          <a href="/documents" className="block">
            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-left">
              <FileText size={20} /> My Documents
            </Button>
          </a>
        </nav>
      </div> */}

      {/* Main Chat Area */}
      <div className="flex-1 ml-72 flex flex-col">
        <header className="bg-white border-b px-8 py-5">
          <h2 className="text-2xl font-semibold">Intelligent Search</h2>
          <p className="text-gray-600">Ask natural questions — get precise answers with sources</p>
        </header>

        {/* Messages Area */}
        <div className="flex-1 p-8 overflow-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Ask anything about your documents</h3>
              <p className="text-gray-500 max-w-md">
                Example: "What is the leave policy?" or "Summarize the payment terms in the vendor contract"
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-5 rounded-2xl ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                    <p>{msg.content}</p>
                    {msg.sources && (
                      <div className="mt-4 text-xs opacity-75">
                        Sources: {msg.sources.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border p-5 rounded-2xl">Thinking...</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-6">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="min-h-[60px] resize-y"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSearch())}
            />
            <Button 
              onClick={handleSearch} 
              disabled={!query.trim() || isLoading}
              size="lg"
            >
              <Send size={20} />
            </Button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            Answers are grounded in your uploaded documents with citations
          </p>
        </div>
      </div>
    </div>
  );
}