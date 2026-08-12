import { motion } from "framer-motion";
import { MapPin, Calendar, Check } from "lucide-react";
import { careerData } from "@/data/careerData";

const QuestLog = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">QUEST</span>{" "}
            <span className="text-primary">LOG</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            5+ years of professional game development
          </p>
        </motion.div>

        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />

          <div className="space-y-8">
            {careerData.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12"
              >
                <span
                  className={`absolute left-2.5 top-2 w-4 h-4 rounded-full border-2 ${
                    quest.status === "active"
                      ? "bg-primary border-primary"
                      : "bg-background border-border-strong"
                  }`}
                />

                <div className="panel p-6">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {quest.company}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-display tracking-wider uppercase rounded-full border ${
                        quest.status === "active"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-success/10 text-success border-success/20"
                      }`}
                    >
                      {quest.status === "active" ? "● Active" : "✓ Complete"}
                    </span>
                  </div>

                  <p className="text-primary font-display text-sm tracking-wider mb-3">
                    {quest.role}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-subtle-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {quest.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {quest.period}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">{quest.summary}</p>

                  <ul className="space-y-2">
                    {quest.objectives.map((objective) => (
                      <li key={objective} className="flex items-start gap-2 text-sm text-foreground/80">
                        {quest.status === "active" ? (
                          <span className="text-primary mt-0.5 shrink-0">▸</span>
                        ) : (
                          <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        )}
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestLog;
