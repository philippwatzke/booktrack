import { Book, BookOpen, Library, Clock } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { FloatingLeaves } from "@/components/nature/FloatingLeaves";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReadingStreak } from "@/components/dashboard/ReadingStreak";
import { CurrentlyReading } from "@/components/dashboard/CurrentlyReading";
import { ReadingGoal } from "@/components/dashboard/ReadingGoal";
import { RecentQuotes } from "@/components/dashboard/RecentQuotes";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useBooks } from "@/hooks/useBooks";

const Index = () => {
  const { data: stats } = useDashboardStats();
  const { data: allBooks } = useBooks({});

  const booksFinished = stats?.booksFinished || 0;
  const pagesRead = stats?.pagesRead || 0;
  const readingTime = stats?.readingTime || 0;
  const totalBooks = allBooks?.length || 0;

  // Format reading time to hours
  const readingHours = Math.floor(readingTime / 60);

  return (
    <MainLayout>
      <NatureBackground />
      <FloatingLeaves />

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        <WelcomeHeader />

        {/* Stats Overview */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            icon={<Library className="w-6 h-6" />}
            label="Gelesene Bücher"
            value={booksFinished}
            subtext="Dieses Jahr"
            className="animate-fade-in"
            style={{ animationDelay: "100ms" } as React.CSSProperties}
          />
          <StatsCard
            icon={<BookOpen className="w-6 h-6" />}
            label="Seiten gelesen"
            value={pagesRead.toLocaleString('de-DE')}
            subtext="Insgesamt"
            className="animate-fade-in"
            style={{ animationDelay: "200ms" } as React.CSSProperties}
          />
          <StatsCard
            icon={<Clock className="w-6 h-6" />}
            label="Lesezeit"
            value={`${readingHours}h`}
            subtext="Dieses Jahr"
            variant="primary"
            className="animate-fade-in"
            style={{ animationDelay: "300ms" } as React.CSSProperties}
          />
          <StatsCard
            icon={<Book className="w-6 h-6" />}
            label="In der Bibliothek"
            value={totalBooks}
            subtext="Bücher gespeichert"
            variant="accent"
            className="animate-fade-in"
            style={{ animationDelay: "400ms" } as React.CSSProperties}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Currently Reading & Quotes */}
          <div className="lg:col-span-2 space-y-6">
            <CurrentlyReading />
            <RecentQuotes />
          </div>

          {/* Right Column - Streak & Goal */}
          <div className="space-y-6">
            <ReadingStreak />
            <ReadingGoal />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
