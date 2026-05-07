import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Classroom from "./pages/Classroom";
import Schedule from "./pages/Schedule";
import Marketplace from "./pages/Marketplace";
import TutorProfile from "./pages/TutorProfile";
import StudentProfile from "./pages/StudentProfile";
import Homework from "./pages/Homework";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/tutors" element={<Marketplace />} />
            <Route path="/tutors/:id" element={<TutorProfile />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute allowedRoles={['tutor']}><Schedule /></ProtectedRoute>} />
            <Route path="/classroom/:lessonId" element={<ProtectedRoute><Classroom /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/homework" element={<ProtectedRoute><Homework /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
