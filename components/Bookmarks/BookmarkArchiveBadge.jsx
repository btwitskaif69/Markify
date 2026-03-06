import { Database, AlertTriangle, LoaderCircle } from "lucide-react";
import PropTypes from "prop-types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const getArchiveStatusMeta = (archive) => {
  if (!archive) {
    return {
      label: "No saved copy",
      Icon: Database,
      className: "border-border/70 text-muted-foreground",
    };
  }

  if (archive.status === "READY") {
    return {
      label: "Saved copy ready",
      Icon: Database,
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    };
  }

  if (archive.status === "PENDING") {
    return {
      label: "Saving copy",
      Icon: LoaderCircle,
      className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300",
    };
  }

  return {
    label: "Save failed",
    Icon: AlertTriangle,
    className: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300",
  };
};

export default function BookmarkArchiveBadge({ archive, className }) {
  const { label, Icon, className: statusClassName } = getArchiveStatusMeta(archive);

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 px-2 py-1 text-[11px] font-medium", statusClassName, className)}
    >
      <Icon className={cn("h-3.5 w-3.5", archive?.status === "PENDING" && "animate-spin")} />
      {label}
    </Badge>
  );
}

BookmarkArchiveBadge.propTypes = {
  archive: PropTypes.object,
  className: PropTypes.string,
};
