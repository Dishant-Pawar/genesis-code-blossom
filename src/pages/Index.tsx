
import { ArrowRight, Sparkles, Code, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation */}
      <nav className="w-full p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Your App</span>
          </div>
          <Button variant="outline" size="sm">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ready to Build
            <span className="block text-blue-600">Something Amazing?</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your blank canvas is ready. Start creating your next great project with modern tools and beautiful design.
          </p>
          <Button size="lg" className="group">
            Start Building
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Modern Stack</CardTitle>
              <CardDescription>
                Built with React, TypeScript, and Tailwind CSS for a modern development experience.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Beautiful Design</CardTitle>
              <CardDescription>
                Carefully crafted components and layouts that look great out of the box.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Ready to Scale</CardTitle>
              <CardDescription>
                Structured and organized codebase that grows with your project needs.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4" />
            <span>Ready when you are</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
