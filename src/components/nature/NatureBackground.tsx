export function NatureBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />

      {/* Ambient Light Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-glow/5 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-forest-light/5 rounded-full blur-[80px] animate-float-delayed" />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-nature-water/5 rounded-full blur-[120px] animate-float-slow" />

      {/* Subtle Water Ripple Effect at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--water))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--water-light))" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waterGradient)"
            d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z"
            className="animate-ripple"
          />
          <path
            fill="url(#waterGradient)"
            d="M0,80 C200,100 400,50 600,80 C800,110 1000,50 1200,80 L1200,120 L0,120 Z"
            className="animate-ripple"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>
      </div>

      {/* Decorative Trees Silhouette */}
      <div className="absolute bottom-0 left-0 w-full h-48 opacity-10">
        <svg
          viewBox="0 0 1200 200"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--forest-deep))" />
              <stop offset="100%" stopColor="hsl(var(--forest-light))" />
            </linearGradient>
          </defs>
          {/* Tree silhouettes */}
          <path
            fill="url(#treeGradient)"
            d="M0,200 L0,150 L30,150 L50,80 L70,150 L100,150 L100,200 Z"
            className="animate-sway origin-bottom"
          />
          <path
            fill="url(#treeGradient)"
            d="M150,200 L150,120 L180,120 L200,40 L220,120 L250,120 L250,200 Z"
            className="animate-sway origin-bottom"
            style={{ animationDelay: "0.3s" }}
          />
          <path
            fill="url(#treeGradient)"
            d="M1000,200 L1000,130 L1030,130 L1050,50 L1070,130 L1100,130 L1100,200 Z"
            className="animate-sway origin-bottom"
            style={{ animationDelay: "0.6s" }}
          />
          <path
            fill="url(#treeGradient)"
            d="M1100,200 L1100,160 L1130,160 L1150,100 L1170,160 L1200,160 L1200,200 Z"
            className="animate-sway origin-bottom"
            style={{ animationDelay: "0.9s" }}
          />
        </svg>
      </div>
    </div>
  );
}
