import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/Layout/AppLayout";
import Library from "./pages/Library";
import Reading from "./pages/Reading";
import Finished from "./pages/Finished";
import Wishlist from "./pages/Wishlist";
import Tags from "./pages/Tags";
import Quotes from "./pages/Quotes";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import BookDetail from "./pages/BookDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Library />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/finished" element={<Finished />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/book/:id" element={<BookDetail />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
