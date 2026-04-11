import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure global app and security settings.</p>
      </div>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">App Name</Label>
            <Input defaultValue="Tips & Steps" className="h-9" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Support Email</Label>
            <Input defaultValue="support@tipsandsteps.com" className="h-9" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Default Language</Label>
            <Input defaultValue="Arabic (ar)" className="h-9" />
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Session Timeout</p>
              <p className="text-xs text-muted-foreground">Auto-logout after inactivity (30 min)</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Audit Logging</p>
              <p className="text-xs text-muted-foreground">Log all admin actions</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
