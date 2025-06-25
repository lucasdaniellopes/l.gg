"use client";

import { 
  Navbar as HeroNavbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link, 
  Button
} from "@heroui/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Champions", href: "/" },
    { label: "Search Player", href: "/player" },
    { label: "Login", href: "/login" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <HeroNavbar 
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      height="56px"
      isBordered
      classNames={{
        base: "bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-default-200/50 shadow-lg drop-shadow-lg",
        wrapper: "px-4 h-14 flex items-center",
        item: "data-[active=true]:text-primary h-full flex items-center",
        content: "gap-6 flex items-center",
      }}
    >
      <NavbarContent className="gap-4">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-r from-primary to-secondary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              L.gg
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarItem isActive>
          <Link 
            href="/" 
            color="primary" 
            className="font-medium text-sm px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            aria-current="page"
          >
            Champions
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="/player" 
            color="foreground" 
            className="font-medium text-sm px-3 py-2 rounded-lg hover:bg-default-100 hover:text-primary transition-colors"
          >
            Pesquisar Jogador
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="/login" 
            color="foreground" 
            className="font-medium text-sm px-3 py-2 rounded-lg hover:bg-default-100 hover:text-primary transition-colors"
          >
            Pro Builds
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex items-center">
          <Button
            as={Link}
            href="/login"
            color="primary"
            variant="flat"
            size="sm"
            className="text-xs px-3 h-8 flex items-center"
          >
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              color={index === 0 ? "primary" : "foreground"}
              className="w-full text-base py-3"
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroNavbar>
  );
}