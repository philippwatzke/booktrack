import { Card } from "@/components/ui/card";
import { mockBooks } from "@/data/mockBooks";
import { 
  BookOpen, 
  BookCheck, 
  BookmarkPlus, 
  TrendingUp,
  Clock,
  Star
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export default function Stats() {
  const totalBooks = mockBooks.length;
  const readingBooks = mockBooks.filter((b) => b.status === "READING").length;
  const finishedBooks = mockBooks.filter((b) => b.status === "FINISHED").length;
  const wishlistBooks = mockBooks.filter((b) => b.status === "WANT_TO_READ").length;

  const totalPagesRead = mockBooks
    .filter((b) => b.status === "FINISHED")
    .reduce((sum, b) => sum + b.pageCount, 0);

  const averageRating = mockBooks
    .filter((b) => b.rating)
    .reduce((sum, b, _, arr) => sum + (b.rating || 0) / arr.length, 0)
    .toFixed(1);

  const genreCount = mockBooks
    .flatMap((b) => b.genres || [])
    .reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Chart data
  const genreChartData = topGenres.map(([genre, count]) => ({
    genre,
    count,
  }));

  const monthlyReadingData = [
    { month: "Jan", pages: 450, books: 2 },
    { month: "Feb", pages: 620, books: 3 },
    { month: "Mär", pages: 380, books: 1 },
    { month: "Apr", pages: 890, books: 4 },
    { month: "Mai", pages: 540, books: 2 },
    { month: "Jun", pages: 710, books: 3 },
  ];

  const pieChartData = topGenres.map(([genre, count]) => ({
    name: genre,
    value: count,
  }));

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--primary) / 0.6)", "hsl(var(--accent) / 0.6)", "hsl(var(--muted-foreground))"];

  const chartConfig = {
    count: {
      label: "Bücher",
      color: "hsl(var(--primary))",
    },
    pages: {
      label: "Seiten",
      color: "hsl(var(--primary))",
    },
    books: {
      label: "Bücher",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Statistiken</h1>
          <p className="text-muted-foreground">Deine Lese-Übersicht auf einen Blick</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Gesamte Bücher</p>
            <p className="text-4xl font-bold text-foreground">{totalBooks}</p>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <BookCheck className="h-6 w-6 text-accent" />
              </div>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Gelesen</p>
            <p className="text-4xl font-bold text-foreground">{finishedBooks}</p>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Aktuell lesen</p>
            <p className="text-4xl font-bold text-foreground">{readingBooks}</p>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <BookmarkPlus className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Wunschliste</p>
            <p className="text-4xl font-bold text-foreground">{wishlistBooks}</p>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Seiten gelesen</p>
            <p className="text-4xl font-bold text-foreground">{totalPagesRead.toLocaleString()}</p>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Star className="h-6 w-6 text-accent fill-accent" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Ø Bewertung</p>
            <p className="text-4xl font-bold text-foreground">{averageRating}</p>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Genre Bar Chart */}
          <Card className="p-8 rounded-2xl border-border shadow-md">
            <h2 className="text-2xl font-bold text-foreground mb-6">Top Genres</h2>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genreChartData}>
                  <XAxis 
                    dataKey="genre" 
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>

          {/* Genre Pie Chart */}
          <Card className="p-8 rounded-2xl border-border shadow-md">
            <h2 className="text-2xl font-bold text-foreground mb-6">Genre-Verteilung</h2>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </div>

        {/* Monthly Reading Progress */}
        <Card className="p-8 rounded-2xl border-border shadow-md">
          <h2 className="text-2xl font-bold text-foreground mb-6">Lese-Fortschritt</h2>
          <ChartContainer config={chartConfig} className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyReadingData}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="pages" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 6 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="books" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
}
