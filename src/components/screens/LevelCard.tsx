import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ProjectData } from "@/data/projectsData";

const STATUS_STYLE: Record<string, string> = {
  Shipped: "bg-success/10 text-success border-success/20",
  "In Development": "bg-warning/10 text-warning border-warning/20",
  Prototype: "bg-primary/10 text-primary border-primary/20",
};

const LevelCard = ({ project, slug }: { project: ProjectData; slug: string }) => {
  const meta = project.meta;
  const statusLabel = meta?.status ?? "";
  const statusClass = STATUS_STYLE[statusLabel] ?? "bg-surface-2 text-muted-foreground border-border";

  return (
    <Link to={`/project/${slug}`} className="group block">
      <motion.div
        className="panel overflow-hidden hover:shadow-e3 hover:-translate-y-1 transition-all duration-300"
        layout
      >
        <div className="relative aspect-video overflow-hidden bg-surface-2">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              width={640}
              height={360}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )}
          {statusLabel && (
            <span
              className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-display tracking-wider uppercase rounded-full border ${statusClass}`}
            >
              {statusLabel}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="font-display text-xs tracking-wider text-foreground">▶ VIEW</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-display text-base font-semibold text-foreground mb-1 truncate">
            {project.title}
          </h3>
          <p className="text-xs text-subtle-foreground mb-3 truncate">
            {meta ? `${meta.genre} · ${meta.studio}` : project.subtitle}
          </p>

          {meta && (
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
              <div>
                <p className="text-[10px] text-subtle-foreground uppercase tracking-wider mb-0.5">Year</p>
                <p className="stat-num text-xs text-foreground">{meta.year}</p>
              </div>
              <div>
                <p className="text-[10px] text-subtle-foreground uppercase tracking-wider mb-0.5">Engine</p>
                <p className="stat-num text-xs text-foreground truncate">{meta.engine}</p>
              </div>
              <div>
                <p className="text-[10px] text-subtle-foreground uppercase tracking-wider mb-0.5">Platform</p>
                <p className="stat-num text-xs text-foreground truncate">{meta.platforms.join("/")}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default LevelCard;
