const stats = [
  { value: "$1K-$50K", label: "Script Writer Earnings/Month" },
  { value: "$1K-$3K", label: "Video Editor Earnings/Month" },
  { value: "10K+", label: "Viral Videos Created" },
  { value: "$100K+", label: "Donated to Causes" },
];

const Stats = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary via-primary-glow to-accent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-primary-foreground/90 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
