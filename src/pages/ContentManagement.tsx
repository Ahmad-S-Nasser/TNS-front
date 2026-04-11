import { useState } from "react";
import { Search, Plus, FileText, Eye, Edit, Trash2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockContent = [
  { id: 1, title: "10 Tips for Better Sleep", type: "Tip", status: "published", author: "Dr. Khalid", date: "2025-01-10", views: 2340 },
  { id: 2, title: "Morning Routine Steps", type: "Steps", status: "published", author: "Marketing", date: "2025-01-08", views: 1890 },
  { id: 3, title: "Nutrition Guide for Kids", type: "Article", status: "draft", author: "Dr. Hana", date: "2025-01-12", views: 0 },
  { id: 4, title: "Exercise at Home", type: "Video", status: "scheduled", author: "Marketing", date: "2025-01-20", views: 0 },
  { id: 5, title: "Mental Health Awareness", type: "Article", status: "published", author: "Dr. Khalid", date: "2024-12-28", views: 3120 },
  { id: 6, title: "Healthy Cooking Tips", type: "Tip", status: "draft", author: "Marketing", date: "2025-01-14", views: 0 },
];

const statusColors: Record<string, string> = {
  published: "border-success/30 text-success bg-success/5",
  draft: "border-warning/30 text-warning bg-warning/5",
  scheduled: "border-info/30 text-info bg-info/5",
};

const ContentManagement = () => {
  const [search, setSearch] = useState("");

  const filtered = mockContent.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, manage, and publish content for the app.</p>
        </div>
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-1.5" /> New Content
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({mockContent.length})</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">{item.type}</Badge>
                        <span className="text-[10px] text-muted-foreground">{item.author}</span>
                        <span className="text-[10px] text-muted-foreground">· {item.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="outline" className={`text-[10px] font-semibold ${statusColors[item.status]}`}>
                        {item.status}
                      </Badge>
                      {item.views > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span className="text-[10px]">{item.views.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
