import { MainLayout } from "@/components/layout/MainLayout";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Target,
  Flame,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { useDashboardStats } from "@/hooks/useDashboard";

const monthlyData = [
  { month: "Jan", books: 2, pages: 580 },
  { month: "Feb", books: 3, pages: 890 },
  { month: "Mar", books: 2, pages: 620 },
  { month: "Apr", books: 1, pages: 340 },
  { month: "Mai", books: 3, pages: 920 },
  { month: "Jun", books: 2, pages: 680 },
  { month: "Jul", books: 2, pages: 540 },
  { month: "Aug", books: 1, pages: 380 },
  { month: "Sep", books: 2, pages: 720 },
  { month: "Okt", books: 3, pages: 860 },
  { month: "Nov", books: 2, pages: 640 },
  { month: "Dez", books: 1, pages: 320 },
];

const genreData = [
  { name: "Fantasy", value: 8, color: "hsl(var(--primary))" },
  { name: "Sachbuch", value: 6, color: "hsl(var(--amber-warm))" },
  { name: "Klassiker", value: 4, color: "hsl(var(--forest-light))" },
  { name: "Sci-Fi", value: 3, color: "hsl(var(--nature-water))" },
  { name: "Roman", value: 3, color: "hsl(var(--secondary))" },
];

const readingTimeData = [
  { day: "Mo", minutes: 45 },
  { day: "Di", minutes: 30 },
  { day: "Mi", minutes: 60 },
  { day: "Do", minutes: 25 },
  { day: "Fr", minutes: 50 },
  { day: "Sa", minutes: 90 },
  { day: "So", minutes: 75 },
];

export default function Stats() {
  const { data: stats, isLoading } = useDashboardStats();

  const statsCards = [
    {
      title: "Bücher gelesen",
      value: stats?.finishedBooks?.toString() || "0",
      subtext: "+3 diesen Monat",
      icon: BookOpen,
      trend: "up",
    },
    {
      title: "Seiten gesamt",
      value: stats?.totalPagesRead?.toLocaleString() || "0",
      subtext: "Über alle Bücher",
      icon: Target,
      trend: "up",
    },
    {
      title: "Lesezeit",
      value: "127h",
      subtext: "Ø 5.3h pro Buch",
      icon: Clock,
      trend: "up",
    },
    {
      title: "Längster Streak",
      value: stats?.currentStreak?.toString() || "0",
      subtext: "Tage am Stück",
      icon: Flame,
      trend: "neutral",
    },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <NatureBackground />
        <div className="relative p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Statistiken werden geladen...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <NatureBackground />

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-primary" />
            Statistiken
          </h1>
          <p className="text-muted-foreground">
            Detaillierte Einblicke in dein Leseverhalten
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <Card
              key={stat.title}
              className="bg-card/80 backdrop-blur-sm border-border animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  {stat.trend === "up" && (
                    <TrendingUp className="w-4 h-4 text-primary ml-auto" />
                  )}
                </div>
                <p className="text-2xl font-serif font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-primary mt-1">{stat.subtext}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Reading Chart */}
          <Card className="bg-card/80 backdrop-blur-sm border-border animate-fade-in delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Bücher pro Monat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="books" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Genre Distribution */}
          <Card className="bg-card/80 backdrop-blur-sm border-border animate-fade-in delay-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Genre-Verteilung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={genreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {genreData.map((genre) => (
                    <div key={genre.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: genre.color }}
                      />
                      <span className="text-sm text-foreground flex-1">
                        {genre.name}
                      </span>
                      <Badge variant="secondary">{genre.value}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reading Time This Week */}
          <Card className="bg-card/80 backdrop-blur-sm border-border animate-fade-in lg:col-span-2 delay-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Lesezeit diese Woche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={readingTimeData}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value} Min`, "Lesezeit"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorMinutes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
