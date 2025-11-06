import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const FavoritesTab = () => {
  const [, navigate] = useLocation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Dishes</CardTitle>
        <CardDescription>Dishes you&apos;ve saved for later</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Saved dishes would be fetched and displayed here */}
        <div className="py-8 text-center text-muted-foreground">
          <p>You haven&apos;t saved any dishes yet.</p>
          <Button variant="link" className="mt-2" onClick={() => navigate("/dishes")}>
            Browse dishes to find your favorites
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
