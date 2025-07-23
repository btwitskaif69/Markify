import { Bookmark } from "lucide-react"

export function BrandHeader() {
  return (
    <div className="flex items-center gap-2 px-2 pt-2 ">
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <Bookmark className="h-4 w-4 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-white">MARKIFY</span>
      </div>
    </div>
  )
}
