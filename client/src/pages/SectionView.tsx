import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import DocumentCard from "@/components/DocumentCard";
import FileUpload from "@/components/FileUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Building2, Clock } from "lucide-react";

const sectionIcons = {
  prosper: BarChart3,
  bankermart: Building2,
  time: Clock,
};

const subSections = {
  prosper: ["Investments", "Reports", "Analytics"],
  bankermart: ["Transactions", "Markets", "Accounts"],
  time: ["Schedules", "Calendar", "Deadlines"]
};

export default function SectionView({ section }: { section: keyof typeof subSections }) {
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents", section],
  });

  const Icon = sectionIcons[section];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 pb-6 border-b">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold capitalize">{section}</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your {section} documents
          </p>
        </div>
      </div>

      <FileUpload section={section} />

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue={subSections[section][0]}>
            <TabsList className="mb-6">
              {subSections[section].map((sub) => (
                <TabsTrigger key={sub} value={sub}>
                  {sub}
                </TabsTrigger>
              ))}
            </TabsList>

            {subSections[section].map((sub) => (
              <TabsContent key={sub} value={sub}>
                {documents?.filter((doc) => doc.subSection === sub).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No documents in this section
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents
                      ?.filter((doc) => doc.subSection === sub)
                      .map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                      ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}