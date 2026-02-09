import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils"

export function AnimatedListItem({
  children
}) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}

export const AnimatedList = React.memo(({
  children,
  className,
  delay = 1000,
  ...props
}) => {
  const [index, setIndex] = useState(0)
  const childrenArray = useMemo(() => React.Children.toArray(children), [children])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((prevIndex) => prevIndex + 1)
    }, delay)

    return () => clearTimeout(timeout);
  }, [index, delay])

  const itemsToShow = useMemo(() => {
    const items = []
    for (let i = 0; i < 4; i++) {
      const item = childrenArray[(index + i) % childrenArray.length];
      const uniqueKey = `${item.key}-${index + i}`;
      items.push(React.cloneElement(item, { key: uniqueKey }));
    }
    return items;
  }, [index, childrenArray])

  return (
    <div className={cn(`flex flex-col-reverse items-center gap-4`, className)} {...props}>
      <AnimatePresence>
        {itemsToShow.map((item) => (
          <AnimatedListItem key={item.key}>
            {item}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
})

AnimatedList.displayName = "AnimatedList"
