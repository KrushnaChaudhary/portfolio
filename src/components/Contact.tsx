import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Linkedin, Instagram, ArrowUpRight } from "lucide-react";

const Contact = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Glow effects */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-neon-cyan/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-neon-cyan text-glow-cyan">HIRE</span>{" "}
            <span className="text-foreground">ME</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ready to bring your next game to life? Let's talk.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <a
                href="mailto:krushnachaudhary.kc@gmail.com"
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:border-neon-cyan/50 transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-neon-cyan/10">
                  <Mail className="w-6 h-6 text-neon-cyan" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium group-hover:text-neon-cyan transition-colors">
                    krushnachaudhary.kc@gmail.com
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-cyan transition-colors" />
              </a>

              <a
                href="tel:+919637128787"
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:border-neon-purple/50 transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-neon-purple/10">
                  <Phone className="w-6 h-6 text-neon-purple" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground font-medium group-hover:text-neon-purple transition-colors">
                    +91 9637128787
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-purple transition-colors" />
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50">
                <div className="p-3 rounded-lg bg-neon-gold/10">
                  <MapPin className="w-6 h-6 text-neon-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-foreground font-medium">Bangalore, India</p>
                </div>
              </div>
            </motion.div>

            {/* Social & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <div className="p-8 rounded-2xl border border-border bg-gradient-to-br from-card to-background">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  Social Links
                </h3>
                <div className="flex gap-4 mb-8">
                  <a
                    href="https://linkedin.com/in/krushnachaudhary"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-border hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 hover:box-glow-cyan"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="font-medium">LinkedIn</span>
                  </a>
                  <a
                    href="https://www.instagram.com/thekvcxo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-border hover:border-neon-pink hover:text-neon-pink transition-all duration-300 hover:box-glow-pink"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="font-medium">Instagram</span>
                  </a>
                </div>

                <a
                  href="mailto:krushnachaudhary.kc@gmail.com"
                  className="block w-full py-4 px-6 rounded-xl font-display font-semibold text-center bg-gradient-to-r from-neon-cyan to-neon-purple text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  GET IN TOUCH
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-24 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            © 2024 Krushna Chaudhary. Crafted with passion for games.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
