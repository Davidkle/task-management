import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Users, Zap, ArrowRight, Star } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TaskFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize Your Life with <span className="text-blue-600">TaskFlow</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The ultimate todo list app that helps you stay productive, organized, and focused on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center mt-8 text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>Trusted by ONE productive person</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to stay organized</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            TaskFlow combines simplicity with powerful features to help you manage your tasks efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Organization</h3>
              <p className="text-gray-600">
                Automatically categorize and prioritize your tasks with intelligent sorting and filtering.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Tracking</h3>
              <p className="text-gray-600">
                Track time spent on tasks and get insights into your productivity patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-gray-600">Share tasks and collaborate with your team members in real-time.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Actions</h3>
              <p className="text-gray-600">Add, edit, and complete tasks with lightning-fast keyboard shortcuts.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Goal Setting</h3>
              <p className="text-gray-600">Set and track your goals with progress visualization and milestones.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reminders</h3>
              <p className="text-gray-600">Never miss a deadline with smart notifications and reminders.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have transformed their workflow with TaskFlow.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm mt-4 opacity-75">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">TaskFlow</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <Link href="#" className="hover:text-gray-900">
              Privacy
            </Link>
            <Link href="#" className="hover:text-gray-900">
              Terms
            </Link>
            <Link href="#" className="hover:text-gray-900">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
