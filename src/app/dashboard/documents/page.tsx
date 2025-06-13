"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload, FileUp, Search, MessageSquare, Loader2 } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default function DocumentsPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [documentContent, setDocumentContent] = useState("")
  const [documentName, setDocumentName] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setDocumentName(file.name)

    // Simulate file upload and processing
    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result as string

      // For demo purposes, we'll just set the content directly
      // In a real app, you would upload this to Firebase Storage
      setDocumentContent(content)
      setIsUploading(false)
    }

    reader.readAsText(file)
  }

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !documentContent) return

    setIsAnalyzing(true)
    setAnswer("")

    try {
      // Use AI SDK to generate a response based on the document content and question
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Based on the following document content, please answer this question: "${question}"\n\nDocument content: ${documentContent}`,
        system:
          "You are a financial analyst assistant that helps users understand financial documents. Provide concise, accurate answers based on the document content only. If the answer is not in the document, say so clearly.",
      })

      setAnswer(text)
    } catch (error) {
      console.error("Error analyzing document:", error)
      setAnswer("Sorry, there was an error analyzing the document. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Document Analysis</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Document
        </Button>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
          <TabsTrigger value="library">Document Library</TabsTrigger>
          <TabsTrigger value="analysis">Analysis History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Upload Financial Document</CardTitle>
                <CardDescription>
                  Upload annual reports, financial statements, or research papers for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                  <FileUp className="h-8 w-8 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drag and drop your document</h3>
                  <p className="text-sm text-gray-500 mb-4">Supports PDF, DOCX, TXT, and CSV files up to 10MB</p>
                  <div className="relative">
                    <Input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.docx,.txt,.csv"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <Button variant="outline" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Browse Files
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{documentName ? `Analyzing: ${documentName}` : "Document Q&A"}</CardTitle>
                <CardDescription>Ask questions about your uploaded document</CardDescription>
              </CardHeader>
              <CardContent>
                {!documentContent ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <MessageSquare className="h-8 w-8 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No document uploaded</h3>
                    <p className="text-sm text-gray-500">Upload a document to start asking questions</p>
                  </div>
                ) : (
                  <form onSubmit={handleQuestionSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Ask a question about the document..."
                        className="min-h-[100px]"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Get Answer
                        </>
                      )}
                    </Button>
                    {answer && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <h4 className="font-medium mb-2">Answer:</h4>
                        <p className="text-sm">{answer}</p>
                      </div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>Access and manage your uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                <p className="text-sm text-gray-500 mb-4">Upload your first document to get started</p>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>View your previous document analysis sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No analysis history</h3>
                <p className="text-sm text-gray-500 mb-4">Your document analysis history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
