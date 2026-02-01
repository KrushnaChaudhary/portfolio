import { motion } from "framer-motion";
import { Gamepad2, Network, Wrench, Cpu, Palette, Zap } from "lucide-react";

const skills = [
  {
    icon: Gamepad2,
    title: "Game Engines",
    items: ["Unity 3D/2D", "Unreal Engine", "Roblox Studio"],
    color: "neon-cyan",
  },
  {
    icon: Network,
    title: "Networking",
    items: ["Photon Fusion", "Photon PUN 2", "Unity Relay/Lobby"],
    color: "neon-purple",
  },
  {
    icon: Cpu,
    title: "Core Systems",
    items: ["Gameplay AI", "Combat", "Meta-Economy", "Physics"],
    color: "neon-gold",
  },
  {
    icon: Wrench,
    title: "Development",
    items: ["C#", "Visual Studio", "JetBrains Rider", "Git"],
    color: "neon-cyan",
  },
  {
    icon: Zap,
    title: "Productivity",
    items: ["n8n Automation", "CI/CD", "Jenkins", "JIRA"],
    color: "neon-pink",
  },
  {
    icon: Palette,
    title: "Creative Tools",
    items: ["Blender", "Maya", "Photoshop", "After Effects"],
    color: "neon-purple",
  },
];

const Skills = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">TECHNICAL</span>{" "}
            <span className="text-neon-cyan text-glow-cyan">ARSENAL</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The tools and technologies I wield to bring games to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-card to-background rounded-xl" />
              <div className="relative p-6 rounded-xl border border-border hover:border-neon-cyan/50 transition-all duration-500 gradient-border">
                <div className={`inline-flex p-3 rounded-lg bg-${skill.color}/10 mb-4`}>
                  <skill.icon className={`w-6 h-6 text-${skill.color}`} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-3 text-foreground">
                  {skill.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
