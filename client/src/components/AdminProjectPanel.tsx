import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2, MapPin, Globe } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function AdminProjectPanel() {
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);

  const queryClient = useQueryClient();
  const { data: pendingSubmissions, isLoading } = trpc.submissions.getPending.useQuery();
  const approveMutation = trpc.submissions.approve.useMutation();
  const rejectMutation = trpc.submissions.reject.useMutation();

  const handleApprove = async (submissionId: number) => {
    try {
      await approveMutation.mutateAsync({ submissionId });
      toast.success("Project approved and published!");
      queryClient.invalidateQueries({ queryKey: ["submissions", "getPending"] });
    } catch (error) {
      toast.error("Failed to approve project");
    }
  };

  const handleReject = async () => {
    if (!selectedSubmissionId || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        submissionId: selectedSubmissionId,
        reason: rejectionReason,
      });
      toast.success("Project rejected");
      setRejectionReason("");
      setSelectedSubmissionId(null);
      setShowRejectionDialog(false);
      queryClient.invalidateQueries({ queryKey: ["submissions", "getPending"] });
    } catch (error) {
      toast.error("Failed to reject project");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  if (!pendingSubmissions || pendingSubmissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Submissions</CardTitle>
          <CardDescription>No pending submissions to review</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Submissions</h2>
        <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
          {pendingSubmissions.length} Pending
        </span>
      </div>

      <div className="space-y-4">
        {pendingSubmissions.map((submission: any) => (
          <Card key={submission.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{submission.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4" />
                    {submission.location}
                  </CardDescription>
                </div>
                <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm font-semibold">
                  {submission.category}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Description</p>
                <p className="text-sm leading-relaxed">{submission.description}</p>
              </div>

              {submission.impact && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Impact</p>
                  <p className="text-sm leading-relaxed">{submission.impact}</p>
                </div>
              )}

              {submission.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4" />
                  <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {submission.website}
                  </a>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => handleApprove(submission.id)}
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-2"
                  onClick={() => {
                    setSelectedSubmissionId(submission.id);
                    setShowRejectionDialog(true);
                  }}
                  disabled={rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Project Submission</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this project submission. The submitter will receive this feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Explain why this project doesn't meet our criteria..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={rejectMutation.isPending}>
                {rejectMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
