import { Toaster } from "@/components/ui/sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Landing from "./pages/Landing";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { BookClubProvider } from "@/context/BookClubContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Suggestions from "./pages/Suggestions";
import Discussions from "./pages/Discussions";
import ReadingProgress from "./pages/ReadingProgress";
import Goals from "./pages/Goals";
import Reviews from "./pages/Reviews";
import Discover from "./pages/Discover";
import Meetings from "./pages/Meetings";
import PersonalLibrary from "./pages/PersonalLibrary";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";


const queryClient = new QueryClient();
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
      <BookClubProvider>
        <Toaster />
        <Sonner />
          {/* <AppLayout> */}
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/discussions" element={<Discussions />} />
              <Route path="/progress" element={<ReadingProgress />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/library" element={<PersonalLibrary />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
           </AppLayout>
           </ProtectedRoute>
              }
              />
              </Routes>
      </BookClubProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
