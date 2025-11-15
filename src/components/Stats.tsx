import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation();
  
  const stats = [
    { value: "$2M+", label: t('stats.paidToCreators') },
    { value: "500+", label: t('stats.activeCreators') },
    { value: "10K+", label: t('stats.videosProduced') },
    { value: "$100K+", label: t('stats.donatedToCauses') },
  ];

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
