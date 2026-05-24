import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTheme } from "@/components/theme/theme-provider"

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-32 p-2">
                <div className="flex flex-col gap-1">
                    <Button variant="ghost" className="justify-start h-8 px-2" onClick={() => setTheme("light")}>
                        Light
                    </Button>
                    <Button variant="ghost" className="justify-start h-8 px-2" onClick={() => setTheme("dark")}>
                        Dark
                    </Button>
                    <Button variant="ghost" className="justify-start h-8 px-2" onClick={() => setTheme("system")}>
                        System
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
