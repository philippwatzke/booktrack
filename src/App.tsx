import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/Layout/AppLayout";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Reading from "./pages/Reading";
import Finished from "./pages/Finished";
import Wishlist from "./pages/Wishlist";
import Tags from "./pages/Tags";
import Quotes from "./pages/Quotes";
import Notes from "./pages/Notes";
import Goals from "./pages/Goals";
import Stats from "./pages/Stats";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import BookDetail from "./pages/BookDetail";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/reading" element={<Reading />} />
              <Route path="/finished" element={<Finished />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:id" element={<CollectionDetail />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/book/:id" element={<BookDetail />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
