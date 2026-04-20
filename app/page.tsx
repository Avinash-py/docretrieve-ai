import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Avinash</h1>
        <p className="text-gray-600 mb-8">Here's an overview of your knowledge base</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents Indexed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-blue-600">24</p>
              <p className="text-sm text-gray-500 mt-1">+3 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-green-600">142</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-purple-600">47 hrs</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}