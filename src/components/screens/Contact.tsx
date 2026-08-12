import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, ArrowUpRight } from "lucide-react";

const LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: "krushnachaudhary.kc@gmail.com",
    href: "mailto:krushnachaudhary.kc@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9637128787",
    href: "tel:+919637128787",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "krushna-chaudhary",
    href: "https://www.linkedin.com/in/krushna-chaudhary/",
    external: true,
  },
];

const Contact = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container relative z-10 px-6">
        <div className="panel-raised max-w-4xl mx-auto p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                LET'S BUILD SOMETHING
              </h2>
              <p className="text-muted-foreground mb-5">
                Ready to bring your next game to life? Let's talk.
              </p>
              <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20 text-xs font-display tracking-wider">
                ● OPEN TO OPPORTUNITIES
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 h-16 px-4 rounded-xl border border-border hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                    <link.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-subtle-foreground">{link.label}</p>
                    <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors break-all">
                      {link.value}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
