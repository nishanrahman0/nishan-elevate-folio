import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminPanel = () => {
  const { isAdmin, user } = useAuth();

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
        <CardDescription>Manage your portfolio content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Logged in as: {user?.email}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button>Edit About</Button>
            <Button>Manage Experience</Button>
            <Button>Update Skills</Button>
            <Button>Add Certificate</Button>
            <Button>Edit Education</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
