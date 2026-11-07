"use client";
import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { 
    ArrowUpRight, 
    TextAlignJustify, 
    BellRing, 
    Globe,
    Headset,
    LucideIcon,
    Salad,
    ScanText,
    Star,
    Video,
    Bookmark,
    LogOut,
    ReceiptText,
    Settings,
    User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
    useCallback, 
    useEffect, 
    useState, 
    type ReactElement, 
    type ReactNode 
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "motion/react";
import { ThemeProvider, useTheme } from "next-themes"

export type NavigationSection = {
  title: string;
  href: string;
};

const navigationData: NavigationSection[] = [
  {
    title: "Parks",
    href: "/parks",
  },
  {
    title: "Reservations",
    href: "/reservations",
  },
//   {
//     title: "Work",
//     href: "#",
//   },
//   {
//     title: "Team",
//     href: "#",
//   },
//   {
//     title: "Pricing",
//     href: "#",
//   },
//   {
//     title: "Awards",
//     href: "#",
//   },
];

const CollaborateButton = ({ className }: { className?: string }) => (
  <Button className={cn("relative text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-4 w-fit overflow-hidden hover:bg-primary/80", className)}>
    <span className="relative z-10 transition-all duration-500 hover:cursor-pointer">
      Let's Collaborate
    </span>
    <div className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
      <ArrowUpRight size={16} />
    </div>
  </Button>
);

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <div className="shrink-0">
      <header className="bg-background">
        <div className="max-w-7xl mx-auto w-full px-4 py-4 sm:px-6">
          <nav
            className={cn(
              "w-full flex items-center h-fit justify-between gap-3.5 lg:gap-6 transition-all duration-500",
              sticky
                ? "p-2.5 bg-background/60 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full"
                : "bg-transparent border-transparent"
            )}
          >
            <a href="/">
              <Logo />
            </a>
            <div>
              <NavigationMenu className="bg-muted p-0.5 rounded-full">
                <NavigationMenuList className="flex gap-0">
                  {navigationData.map((navItem) => (
                    <NavigationMenuItem key={navItem.title}>
                      <NavigationMenuLink
                        href={navItem.href}
                        className="px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal"
                      >
                        {navItem.title}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            {/* <CollaborateButton className="hidden lg:flex" /> */}
            <div className="flex items-center gap-2.5 hidden md:flex">
              <ThemeToggle/>
              <NotificationDropdown
                defaultOpen={false}
                align="center"
                trigger={
                  <div className="rounded-full p-2 hover:bg-accent relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1">
                    <BellRing className="size-4" />
                  </div>
                }
              />
              <LanguageDropdown
                trigger={
                  <div
                    id="language-dropdown-trigger"
                    className="rounded-full hover:bg-accent/80 cursor-pointer p-2"
                  >
                    <Globe size={16} />
                  </div>
                }
              />
              <ProfileDropdown
                trigger={
                  <div
                    id="profile-dropdown-trigger"
                    className="rounded-full cursor-pointer"
                  >
                    <Avatar className="size-7 rounded-full">
                      <AvatarImage src="https://images.shadcnspace.com/assets/profiles/user-11.jpg" />
                      <AvatarFallback>NJ</AvatarFallback>
                    </Avatar>
                  </div>
                }
              />
            </div>

            <div className="lg:hidden">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className="rounded-full bg-background border border-border p-2 outline-none flex items-center justify-center cursor-pointer transition-colors">
                  <TextAlignJustify size={20} />
                  <span className="sr-only">Menu</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-2"
                >
                  {navigationData.map((item) => (
                    <DropdownMenuItem key={item.title}>
                      <a href={item.href} className="w-full cursor-pointer text-sm font-medium">{item.title}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;

/////// Language Dropdown ///////////

type LanguageProps = {
    trigger: ReactElement
    defaultOpen?: boolean
    align?: 'start' | 'center' | 'end'
}

type Language = {
    value: string
    label: string
    icon: string
}

const LANGUAGES: Language[] = [
    {
        value: 'english',
        label: 'English (UK)',
        icon: 'https://images.shadcnspace.com/assets/flags/flag-us.svg',
    },
    {
        value: 'chinese',
        label: '中国人 (Chinese)',
        icon: 'https://images.shadcnspace.com/assets/flags/flag-china.svg',
    },
    {
        value: 'french',
        label: 'français (French)',
        icon: 'https://images.shadcnspace.com/assets/flags/flag-france.svg',
    },
    {
        value: 'arabic',
        label: 'عربي (Arabic)',
        icon: 'https://images.shadcnspace.com/assets/flags/flag-australia.svg',
    },
]

const languageItemClass =
    'cursor-pointer gap-2 pl-2 text-sm data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground [&>span]:hidden'

const LanguageDropdown = ({ trigger, defaultOpen, align = 'end' }: LanguageProps) => {
    const [language, setLanguage] = useState(LANGUAGES[0].value)

    return (
        <DropdownMenu defaultOpen={defaultOpen}>
            <DropdownMenuTrigger>
                {trigger}
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-50" align={align}>
                <DropdownMenuRadioGroup
                    value={language}
                    onValueChange={setLanguage}
                    className="flex flex-col gap-2"
                >
                    {LANGUAGES.map(({ value, label, icon }) => (
                        <DropdownMenuRadioItem key={value} value={value} className={languageItemClass}>
                            <img src={icon} alt={label} width={16} height={16} className='rounded-full' />
                            {label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

/////// Notification Dropdown ///////////

type NotificationProps = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

type MenuItem = {
  textColor: string;
  bgColor: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  time: string;
};

const NOTIFICATION_ITEMS: MenuItem[] = [
  {
    textColor: "stroke-blue-500",
    bgColor: "bg-blue-500/10",
    icon: Star,
    title: "Event Today",
    desc: "Just reminder that you have to",
    time: "9:00 AM",
  },
  {
    textColor: "stroke-orange-400",
    bgColor: "bg-orange-400/10",
    icon: Video,
    title: "Team Meeting",
    desc: "Discuss project updates and next steps",
    time: "10:00 AM",
  },
  {
    textColor: "stroke-teal-400",
    bgColor: "bg-teal-400/10",
    icon: Salad,
    title: "Lunch Break",
    desc: "Take a break and recharge",
    time: "12:30 PM",
  },
  {
    textColor: "stroke-red-500",
    bgColor: "bg-red-500/10",
    icon: Headset,
    title: "Client Call",
    desc: "Monthly check-in with the client",
    time: "3:00 PM",
  },
  {
    textColor: "stroke-sky-400",
    bgColor: "bg-sky-400/10",
    icon: ScanText,
    title: "Project Review",
    desc: "Review project deliverables with client",
    time: "4:00 PM",
  },
];

const NotificationDropdown = ({
  trigger,
  defaultOpen,
  align = "end",
}: NotificationProps) => {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className="p-0 w-sm rounded-2xl data-open:slide-in-from-top-20! data-closed:slide-out-to-top-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400"
        >
          <DropdownMenuGroup>
            {/* title */}
            <DropdownMenuLabel className="flex items-center justify-between p-4">
              <p className="text-base font-medium text-popover-foreground">
                Notifications
              </p>
              <Badge className="h-5 font-normal leading-0">5 New</Badge>
            </DropdownMenuLabel>

            {/* Notifications */}
            {NOTIFICATION_ITEMS.map(
              ({ bgColor, textColor, icon: Icon, title, desc, time }) => (
                <DropdownMenuItem
                  key={title}
                  className={
                    "mx-1.5 my-1 p-2 flex items-center justify-between cursor-pointer"
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-xl", bgColor)}>
                      <Icon size={20} className={cn("size-5", textColor)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-popover-foreground">
                        {title}
                      </p>
                      <p className="max-w-52 truncate text-sm text-muted-foreground">
                        {desc}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{time}</p>
                </DropdownMenuItem>
              ),
            )}

            {/* button */}
            <div className="mx-1.5 my-1 p-2">
              <Button className="rounded-xl w-full cursor-pointer hover:bg-primary/80">
                See All Notifications
              </Button>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

/////// Profile Dropdown ///////////

type ProfileProps = {
  trigger: ReactElement;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

type ProfileMenuItem = {
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
};

const PROFILE_ITEMS: ProfileMenuItem[] = [
  { label: "My Profile", icon: User },
  { label: "My Subscription", icon: Bookmark },
  { label: "My Invoice", icon: ReceiptText },
];

const SETTINGS_ITEMS: ProfileMenuItem[] = [
  { label: "Account Settings", icon: Settings },
];

const LOGOUT_ITEM: ProfileMenuItem = {
  label: "Signout",
  icon: LogOut,
  destructive: true,
};

const itemClass = "px-4 py-2.5 text-base cursor-pointer gap-3";

const ProfileDropdown = ({ trigger, defaultOpen, align = "end" }: ProfileProps) => {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align={align}>
        <DropdownMenuGroup>
          {/* User Info */}
          <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
            <div className="relative">
              <Avatar className="size-10">
                <AvatarImage
                  src="https://images.shadcnspace.com/assets/profiles/user-11.jpg"
                  alt="David McMichael"
                />
                <AvatarFallback>DM</AvatarFallback>
              </Avatar>
              <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
            </div>

            <div className="flex flex-col">
              <span className="text-foreground text-lg font-semibold">
                David McMichael
              </span>
              <span className="text-muted-foreground text-sm">
                david.mcmichael@example.com
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Main Links */}
          {PROFILE_ITEMS.map(({ label, icon: Icon }) => (
            <DropdownMenuItem key={label} className={itemClass}>
              <Icon size={20} className="text-foreground" />
              <span>{label}</span>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Settings */}
          <DropdownMenuGroup>
            {SETTINGS_ITEMS.map(({ label, icon: Icon }) => (
              <DropdownMenuItem key={label} className={itemClass}>
                <Icon size={20} className="text-foreground" />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem variant="destructive" className={itemClass}>
            <LOGOUT_ITEM.icon size={20} />
            <span>{LOGOUT_ITEM.label}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

///////////// Theme Toggle ///////////

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [isDark, setIsDark] = useState(resolvedTheme === "dark");

  const switchTheme = ()=>{
    if(resolvedTheme === "light"){
      setTheme("dark")
      setIsDark(true)
    }
    if(resolvedTheme === "dark"){
      setTheme("light")
      setIsDark(false)
    }
  }

  return (
    <button
    //   onClick={() => setIsDark((prev) => !prev)}
      onClick={()=>switchTheme()}
      aria-label="Toggle theme animate"
      type="button"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
        animate={{
          rotate: isDark ? 40 : 0,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
      >
        <mask id="moon-mask-01">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle
            cx="25"
            cy="0"
            r="8"
            fill="black"
            animate={{
              cx: isDark ? 18 : 25,
              cy: isDark ? 6 : 0,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
          />
        </mask>

        <motion.circle
          cx="12"
          cy="12"
          r="9"
          fill="currentColor"
          mask="url(#moon-mask-01)"
          animate={{
            r: isDark ? 8 : 5,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 15 }}
        />

        <motion.g
          stroke="currentColor"
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.3 : 1,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 15 }}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </motion.g>
      </motion.svg>
    </button>
  );
};
