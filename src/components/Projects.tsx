import { motion } from "framer-motion";
import { Gamepad2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projectsList } from "@/data/projectsData";

// Animation variants for staggered reveals
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const imageVariants = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const Projects = () => {
  // Skip first 3 projects as they're shown in hero
  const remainingProjects = projectsList.slice(3);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent pointer-events-none" />
      
      <div className="container px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">MORE</span>{" "}
            <span className="text-neon-purple text-glow-purple">PROJECTS</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Additional games and systems I've shipped
          </p>
        </motion.div>

        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {remainingProjects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={cardVariants}
              className="group"
            >
              <Link to={`/project/${project.slug}`}>
                <motion.div 
                  className="relative rounded-2xl border border-border bg-card/50 overflow-hidden transition-colors duration-300 cursor-pointer hover:border-neon-cyan/50"
                  whileHover={{ 
                    scale: 1.01,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                    {/* Image */}
                    <div className={`relative h-64 md:h-80 overflow-hidden ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                      {project.image ? (
                        <motion.div
                          className="w-full h-full"
                          variants={imageVariants}
                        >
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                          />
                        </motion.div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neon-purple/20 via-card to-neon-cyan/10 flex items-center justify-center">
                          <motion.div
                            initial={{ rotate: 0 }}
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Gamepad2 className="w-20 h-20 text-neon-purple/40" />
                          </motion.div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className={`p-6 md:p-8 flex flex-col justify-center ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                      <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-neon-cyan font-display text-sm tracking-wider">
                            {project.subtitle}
                          </span>
                        </div>
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-neon-cyan transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag, tagIndex) => (
                            <motion.span
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.3 + tagIndex * 0.05 }}
                              className="px-3 py-1 text-xs font-medium rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>

                        <ul className="grid grid-cols-2 gap-2 mb-6">
                          {project.highlights.slice(0, 4).map((highlight, hIndex) => (
                            <motion.li
                              key={highlight}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.4 + hIndex * 0.05 }}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple flex-shrink-0" />
                              {highlight}
                            </motion.li>
                          ))}
                        </ul>

                        <motion.div 
                          className="flex items-center gap-2 text-neon-cyan font-display text-sm tracking-wider"
                          whileHover={{ x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span>VIEW PROJECT</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
