import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { FileText, BarChart3, Building2, Clock } from "lucide-react";

const sections = [
  {
    name: "Prosper",
    description: "Financial and investment documents",
    path: "/prosper",
    icon: BarChart3,
  },
  {
    name: "Bankermart",
    description: "Banking and marketplace documents",
    path: "/bankermart",
    icon: Building2,
  },
  {
    name: "Time",
    description: "Time-sensitive and scheduled documents",
    path: "/time",
    icon: Clock,
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="pb-8 border-b">
        <h1 className="text-4xl font-bold mb-4">Welcome to DocManager</h1>
        <p className="text-lg text-muted-foreground">
          Your secure document management hub for financial and business documents
        </p>
      </div>

      {/* Document Sections */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Document Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.path} href={section.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{section.name}</CardTitle>
                    </div>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Documents</CardDescription>
            <CardTitle>128</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pending Approvals</CardDescription>
            <CardTitle>12</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Recently Added</CardDescription>
            <CardTitle>24</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Users</CardDescription>
            <CardTitle>8</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}