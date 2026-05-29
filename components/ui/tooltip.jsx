import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import PropTypes from "prop-types"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return (<TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />);
}

function Tooltip({
  ...props
}) {
  return (
    (<TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>)
  );
}

function TooltipTrigger({
  ...props
}) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  variant = "primary",
  children,
  ...props
}) {
  const contentClassName =
    variant === "neutral"
      ? "bg-popover text-popover-foreground border border-border shadow-md"
      : "bg-primary text-primary-foreground";

  const arrowClassName =
    variant === "neutral" ? "bg-popover fill-popover" : "bg-primary fill-primary";

  return (
    (<TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          contentClassName,
          className
        )}
        {...props}>
        {children}
        <TooltipPrimitive.Arrow
          className={cn(
            "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]",
            arrowClassName
          )} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>)
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

TooltipProvider.propTypes = {
  delayDuration: PropTypes.number,
}

Tooltip.propTypes = {
  children: PropTypes.node,
}

TooltipTrigger.propTypes = {
  children: PropTypes.node,
}

TooltipContent.propTypes = {
  className: PropTypes.string,
  sideOffset: PropTypes.number,
  variant: PropTypes.oneOf(["primary", "neutral"]),
  children: PropTypes.node,
}
