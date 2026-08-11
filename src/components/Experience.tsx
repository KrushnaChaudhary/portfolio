import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { careerData } from "@/data/careerData";

const Experience = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">WORK</span>{" "}
            <span className="text-warning">EXPERIENCE</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            5+ years of professional game development
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary to-warning transform md:-translate-x-1/2" />

          {careerData.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative mb-12 md:mb-16 ${
                index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:ml-auto"
              } md:w-1/2 pl-8 md:pl-0`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute ${
                  index % 2 === 0 ? "left-0 md:-right-3" : "left-0 md:-left-3"
                } top-0 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center`}
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>

              <div className="p-6 rounded-xl border border-border bg-card/50 hover:border-primary/50 transition-all duration-300">
                <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-primary font-display text-sm tracking-wider">
                    {exp.role}
                  </span>
                </div>
                
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {exp.company}
                </h3>
                
                <div className={`flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {exp.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {exp.period}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {exp.summary}
                </p>

                <ul className={`space-y-2 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                  {exp.objectives.map((achievement) => (
                    <li
                      key={achievement}
                      className={`flex items-center gap-2 text-sm text-foreground/80 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
