import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Approval } from "@shared/schema";

export default function ApprovalWorkflow({ documentId }: { documentId: number }) {
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const { data: approvals } = useQuery<Approval[]>({
    queryKey: ["/api/documents", documentId, "approvals"],
  });

  const handleApproval = async (status: "approved" | "rejected") => {
    try {
      await apiRequest("POST", `/api/documents/${documentId}/approvals`, {
        status,
        comment
      });

      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/documents", documentId, "approvals"]
      });

      toast({
        title: "Success",
        description: `Document ${status} successfully`
      });
      setComment("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process approval",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Approve/Reject</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Document Approval</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {approvals?.map((approval) => (
            <div key={approval.id} className="border p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Approver #{approval.approverId}</span>
                <span className={approval.status === "approved" ? "text-green-600" : "text-red-600"}>
                  {approval.status}
                </span>
              </div>
              {approval.comment && (
                <p className="text-sm text-muted-foreground mt-2">{approval.comment}</p>
              )}
            </div>
          ))}

          <Textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex gap-2 justify-end">
            <Button variant="destructive" onClick={() => handleApproval("rejected")}>
              Reject
            </Button>
            <Button onClick={() => handleApproval("approved")}>
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}