import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

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
            <Button onClick={() => navigate("/admin?tab=about")}>Edit About</Button>
            <Button onClick={() => navigate("/admin?tab=experience")}>Manage Experience</Button>
            <Button onClick={() => navigate("/admin?tab=skills")}>Update Skills</Button>
            <Button onClick={() => navigate("/admin?tab=certificates")}>Add Certificate</Button>
            <Button onClick={() => navigate("/admin?tab=education")}>Edit Education</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
