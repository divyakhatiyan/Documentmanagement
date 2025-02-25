import { Document } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileIcon, Trash2Icon } from "lucide-react";
import { format } from "date-fns";
import ApprovalWorkflow from "@/components/ApprovalWorkflow";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function DocumentCard({ document }: { document: Document }) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await apiRequest("DELETE", `/api/documents/${document.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return format(new Date(date), "PP");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{document.title}</CardTitle>
          <Badge variant={document.status === "approved" ? "default" : "secondary"}>
            {document.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{document.description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileIcon className="h-4 w-4" />
          <span>{document.fileType.toUpperCase()}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Created: {formatDate(document.createdAt)}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <ApprovalWorkflow documentId={document.id} />
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}