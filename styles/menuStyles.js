// Sistema de plantillas de estilos para menús web dinámicos
export const menuStyles = {
    // Estilo por defecto (el actual - Verde/Emerald)
    default: {
        name: "Clásico",
        colors: {
            primary: "green",
            secondary: "emerald",
            accent: "teal",
            background: "from-green-50 via-white to-emerald-50",
            headerGradient: "from-green-500 via-emerald-500 to-teal-500",
            cardBg: "bg-white",
            cardBorder: "border-green-100",
            buttonGradient: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
            textPrimary: "text-green-700",
            textSecondary: "text-green-600",
            textCard: "text-gray-800",
            textDescription: "text-gray-600",
            badge: "bg-green-500",
            badgeBg: "bg-green-100",
            badgeText: "text-green-800",
            inputBg: "bg-white/80",
            inputText: "text-green-800",
            inputPlaceholder: "placeholder-gray-400",
            inputBorder: "border-green-200 focus:ring-green-500 focus:border-green-500",
            sidebarBg: "from-green-100 to-emerald-100",
            sidebarText: "text-green-800",
            sidebarHover: "hover:bg-green-200",
            restaurantNameText: "text-gray-800",
            restaurantInfoText: "text-gray-700",
            decorativeCircles: [
                "bg-green-100",
                "bg-emerald-100",
                "bg-teal-100",
                "bg-green-200"
            ],
            overlayBg: "backdrop-brightness-50"
        }
    },

    // Estilo Tokyo (Neón/Cyberpunk) - MEJORADO
    tokyo: {
        name: "Tokyo Nights",
        colors: {
            primary: "pink",
            secondary: "purple",
            accent: "cyan",
            background: "from-slate-950 via-purple-950 to-slate-900",
            headerGradient: "from-fuchsia-600 via-purple-600 to-cyan-500",
            cardBg: "bg-slate-900/90",
            cardBorder: "border-fuchsia-500/40",
            buttonGradient: "from-fuchsia-500 via-purple-600 to-cyan-500 hover:from-fuchsia-600 hover:via-purple-700 hover:to-cyan-600",
            textPrimary: "text-cyan-400",
            textSecondary: "text-fuchsia-400",
            textCard: "text-cyan-300",
            textDescription: "text-purple-300",
            badge: "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500",
            badgeBg: "bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20",
            badgeText: "text-cyan-300",
            inputBg: "bg-slate-900/90",
            inputText: "text-cyan-300",
            inputPlaceholder: "placeholder-purple-400/50",
            inputBorder: "border-fuchsia-500/50 focus:ring-cyan-500 focus:border-cyan-400",
            sidebarBg: "from-slate-900 via-purple-950 to-slate-900",
            sidebarText: "text-cyan-300",
            sidebarHover: "hover:bg-fuchsia-900/40",
            restaurantNameText: "text-cyan-300",
            restaurantInfoText: "text-purple-300",
            decorativeCircles: [
                "bg-fuchsia-500/15",
                "bg-purple-500/15",
                "bg-cyan-500/15",
                "bg-violet-500/15"
            ],
            overlayBg: "backdrop-brightness-30",
            // Efectos especiales para Tokyo
            neonGlow: "shadow-[0_0_20px_rgba(217,70,239,0.6),0_0_40px_rgba(217,70,239,0.3)]",
            cardGlow: "shadow-[0_0_30px_rgba(168,85,247,0.5)]",
            textGlow: "drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]",
            backgroundPattern: "bg-[radial-gradient(ellipse_at_top_right,rgba(217,70,239,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.15),transparent_50%)]"
        }
    },

    // Estilo Midnight (Minimalista Oscuro Moderno)
    midnight: {
        name: "Midnight",
        colors: {
            primary: "slate",
            secondary: "zinc",
            accent: "indigo",
            background: "from-slate-950 via-zinc-900 to-slate-950",
            headerGradient: "from-slate-800 via-zinc-800 to-slate-900",
            cardBg: "bg-zinc-900/80",
            cardBorder: "border-zinc-700/50",
            buttonGradient: "from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500",
            textPrimary: "text-slate-100",
            textSecondary: "text-indigo-400",
            textCard: "text-slate-100",
            textDescription: "text-slate-400",
            badge: "bg-indigo-600",
            badgeBg: "bg-indigo-950/50",
            badgeText: "text-indigo-300",
            inputBg: "bg-zinc-900/90",
            inputText: "text-slate-100",
            inputPlaceholder: "placeholder-slate-500",
            inputBorder: "border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500",
            sidebarBg: "from-zinc-950 to-slate-950",
            sidebarText: "text-slate-200",
            sidebarHover: "hover:bg-zinc-800/50",
            restaurantNameText: "text-slate-100",
            restaurantInfoText: "text-slate-400",
            decorativeCircles: [
                "bg-indigo-500/10",
                "bg-violet-500/10",
                "bg-slate-500/10",
                "bg-zinc-500/10"
            ],
            overlayBg: "backdrop-brightness-30",
            cardShadow: "shadow-[0_0_30px_rgba(99,102,241,0.1)]",
            minimalist: true
        }
    },

    // Estilo Sunset Grill (Cálido y Acogedor)
    sunset: {
        name: "Sunset Grill",
        colors: {
            primary: "orange",
            secondary: "red",
            accent: "yellow",
            background: "from-orange-50 via-amber-50 to-red-50",
            headerGradient: "from-red-600 via-orange-500 to-amber-500",
            cardBg: "bg-white",
            cardBorder: "border-orange-200",
            buttonGradient: "from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:via-orange-600 hover:to-amber-600",
            textPrimary: "text-red-800",
            textSecondary: "text-orange-600",
            textCard: "text-gray-900",
            textDescription: "text-gray-700",
            badge: "bg-gradient-to-r from-red-500 to-orange-500",
            badgeBg: "bg-gradient-to-r from-orange-100 to-red-100",
            badgeText: "text-red-800",
            inputBg: "bg-white/90",
            inputText: "text-gray-900",
            inputPlaceholder: "placeholder-orange-400",
            inputBorder: "border-orange-300 focus:ring-red-500 focus:border-red-400",
            sidebarBg: "from-red-100 via-orange-100 to-amber-100",
            sidebarText: "text-red-900",
            sidebarHover: "hover:bg-orange-200",
            restaurantNameText: "text-red-800",
            restaurantInfoText: "text-orange-700",
            decorativeCircles: [
                "bg-red-200",
                "bg-orange-200",
                "bg-amber-200",
                "bg-yellow-200"
            ],
            overlayBg: "backdrop-brightness-50",
            warmGlow: "shadow-[0_0_40px_rgba(249,115,22,0.3)]"
        }
    },

    // Estilo Ocean Deep (Marino Profundo)
    ocean: {
        name: "Ocean Deep",
        colors: {
            primary: "blue",
            secondary: "cyan",
            accent: "teal",
            background: "from-blue-950 via-cyan-950 to-teal-950",
            headerGradient: "from-blue-600 via-cyan-600 to-teal-500",
            cardBg: "bg-blue-950/80",
            cardBorder: "border-cyan-500/30",
            buttonGradient: "from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:via-cyan-500 hover:to-teal-500",
            textPrimary: "text-cyan-300",
            textSecondary: "text-teal-400",
            textCard: "text-cyan-100",
            textDescription: "text-cyan-300",
            badge: "bg-gradient-to-r from-blue-500 to-cyan-500",
            badgeBg: "bg-cyan-950/50",
            badgeText: "text-cyan-200",
            inputBg: "bg-blue-950/90",
            inputText: "text-cyan-100",
            inputPlaceholder: "placeholder-cyan-500/50",
            inputBorder: "border-cyan-600/50 focus:ring-teal-500 focus:border-cyan-400",
            sidebarBg: "from-blue-950 to-cyan-950",
            sidebarText: "text-cyan-200",
            sidebarHover: "hover:bg-cyan-900/40",
            restaurantNameText: "text-cyan-200",
            restaurantInfoText: "text-teal-300",
            decorativeCircles: [
                "bg-blue-500/20",
                "bg-cyan-500/20",
                "bg-teal-500/20",
                "bg-sky-500/20"
            ],
            overlayBg: "backdrop-brightness-30",
            waterGlow: "shadow-[0_0_30px_rgba(6,182,212,0.4)]",
            backgroundPattern: "bg-[radial-gradient(ellipse_at_bottom,rgba(6,182,212,0.15),transparent_50%)]"
        }
    },

    // Estilo Golden Luxury (Elegante y Lujoso)
    luxury: {
        name: "Golden Luxury",
        colors: {
            primary: "amber",
            secondary: "yellow",
            accent: "orange",
            background: "from-slate-900 via-amber-950 to-slate-900",
            headerGradient: "from-amber-600 via-yellow-600 to-amber-700",
            cardBg: "bg-slate-900/90",
            cardBorder: "border-amber-500/40",
            buttonGradient: "from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600",
            textPrimary: "text-amber-400",
            textSecondary: "text-yellow-500",
            textCard: "text-amber-200",
            textDescription: "text-amber-300",
            badge: "bg-gradient-to-r from-amber-500 to-yellow-500",
            badgeBg: "bg-amber-950/50",
            badgeText: "text-amber-200",
            inputBg: "bg-slate-900/90",
            inputText: "text-amber-200",
            inputPlaceholder: "placeholder-amber-600/50",
            inputBorder: "border-amber-600/50 focus:ring-yellow-500 focus:border-amber-400",
            sidebarBg: "from-slate-900 to-amber-950",
            sidebarText: "text-amber-200",
            sidebarHover: "hover:bg-amber-900/40",
            restaurantNameText: "text-amber-300",
            restaurantInfoText: "text-yellow-400",
            decorativeCircles: [
                "bg-amber-500/15",
                "bg-yellow-500/15",
                "bg-orange-500/15",
                "bg-amber-600/15"
            ],
            overlayBg: "backdrop-brightness-30",
            luxuryGlow: "shadow-[0_0_30px_rgba(245,158,11,0.5)]",
            backgroundPattern: "bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1),transparent_50%)]"
        }
    },

    // Estilo Fresh Garden (Fresco y Natural)
    garden: {
        name: "Fresh Garden",
        colors: {
            primary: "lime",
            secondary: "green",
            accent: "emerald",
            background: "from-lime-50 via-green-50 to-emerald-50",
            headerGradient: "from-lime-600 via-green-600 to-emerald-600",
            cardBg: "bg-white",
            cardBorder: "border-lime-200",
            buttonGradient: "from-lime-500 via-green-600 to-emerald-600 hover:from-lime-600 hover:via-green-700 hover:to-emerald-700",
            textPrimary: "text-green-800",
            textSecondary: "text-lime-700",
            textCard: "text-gray-900",
            textDescription: "text-gray-700",
            badge: "bg-gradient-to-r from-lime-500 to-emerald-500",
            badgeBg: "bg-lime-100",
            badgeText: "text-green-900",
            inputBg: "bg-white/90",
            inputText: "text-gray-900",
            inputPlaceholder: "placeholder-green-400",
            inputBorder: "border-lime-300 focus:ring-green-500 focus:border-lime-400",
            sidebarBg: "from-lime-100 to-emerald-100",
            sidebarText: "text-green-900",
            sidebarHover: "hover:bg-lime-200",
            restaurantNameText: "text-green-900",
            restaurantInfoText: "text-green-700",
            decorativeCircles: [
                "bg-lime-200",
                "bg-green-200",
                "bg-emerald-200",
                "bg-teal-200"
            ],
            overlayBg: "backdrop-brightness-50",
            freshGlow: "shadow-[0_0_40px_rgba(132,204,22,0.3)]"
        }
    },

    // Estilo Berry Sweet (Dulce y Moderno)
    berry: {
        name: "Berry Sweet",
        colors: {
            primary: "pink",
            secondary: "rose",
            accent: "fuchsia",
            background: "from-pink-50 via-rose-50 to-fuchsia-50",
            headerGradient: "from-pink-500 via-rose-500 to-fuchsia-500",
            cardBg: "bg-white",
            cardBorder: "border-pink-200",
            buttonGradient: "from-pink-500 via-rose-500 to-fuchsia-600 hover:from-pink-600 hover:via-rose-600 hover:to-fuchsia-700",
            textPrimary: "text-pink-800",
            textSecondary: "text-rose-600",
            textCard: "text-gray-900",
            textDescription: "text-gray-700",
            badge: "bg-gradient-to-r from-pink-500 to-fuchsia-500",
            badgeBg: "bg-pink-100",
            badgeText: "text-pink-900",
            inputBg: "bg-white/90",
            inputText: "text-gray-900",
            inputPlaceholder: "placeholder-pink-400",
            inputBorder: "border-pink-300 focus:ring-rose-500 focus:border-pink-400",
            sidebarBg: "from-pink-100 to-fuchsia-100",
            sidebarText: "text-pink-900",
            sidebarHover: "hover:bg-pink-200",
            restaurantNameText: "text-pink-900",
            restaurantInfoText: "text-rose-700",
            decorativeCircles: [
                "bg-pink-200",
                "bg-rose-200",
                "bg-fuchsia-200",
                "bg-pink-300"
            ],
            overlayBg: "backdrop-brightness-50",
            sweetGlow: "shadow-[0_0_35px_rgba(236,72,153,0.3)]"
        }
    },

    // Estilo Espresso (Café y Tierra)
    espresso: {
        name: "Espresso",
        colors: {
            primary: "amber",
            secondary: "orange",
            accent: "stone",
            background: "from-stone-100 via-amber-50 to-orange-50",
            headerGradient: "from-stone-800 via-amber-800 to-orange-800",
            cardBg: "bg-white",
            cardBorder: "border-stone-300",
            buttonGradient: "from-stone-700 via-amber-700 to-orange-700 hover:from-stone-800 hover:via-amber-800 hover:to-orange-800",
            textPrimary: "text-stone-900",
            textSecondary: "text-amber-800",
            textCard: "text-stone-900",
            textDescription: "text-stone-700",
            badge: "bg-gradient-to-r from-stone-700 to-amber-700",
            badgeBg: "bg-amber-100",
            badgeText: "text-stone-900",
            inputBg: "bg-white/90",
            inputText: "text-stone-900",
            inputPlaceholder: "placeholder-stone-400",
            inputBorder: "border-stone-300 focus:ring-amber-600 focus:border-amber-500",
            sidebarBg: "from-stone-200 to-amber-100",
            sidebarText: "text-stone-900",
            sidebarHover: "hover:bg-stone-300",
            restaurantNameText: "text-stone-900",
            restaurantInfoText: "text-amber-800",
            decorativeCircles: [
                "bg-stone-300",
                "bg-amber-200",
                "bg-orange-200",
                "bg-stone-400"
            ],
            overlayBg: "backdrop-brightness-50",
            earthyGlow: "shadow-[0_0_35px_rgba(120,113,108,0.3)]"
        }
    },

    // Estilo Aurora (Colores Boreales)
    aurora: {
        name: "Aurora",
        colors: {
            primary: "violet",
            secondary: "indigo",
            accent: "cyan",
            background: "from-indigo-950 via-violet-950 to-purple-950",
            headerGradient: "from-violet-600 via-indigo-600 to-cyan-500",
            cardBg: "bg-indigo-950/85",
            cardBorder: "border-violet-500/40",
            buttonGradient: "from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-500",
            textPrimary: "text-violet-300",
            textSecondary: "text-indigo-400",
            textCard: "text-violet-200",
            textDescription: "text-indigo-300",
            badge: "bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500",
            badgeBg: "bg-violet-950/50",
            badgeText: "text-violet-200",
            inputBg: "bg-indigo-950/90",
            inputText: "text-violet-200",
            inputPlaceholder: "placeholder-indigo-400/50",
            inputBorder: "border-violet-600/50 focus:ring-cyan-500 focus:border-violet-400",
            sidebarBg: "from-indigo-950 to-violet-950",
            sidebarText: "text-violet-200",
            sidebarHover: "hover:bg-violet-900/40",
            restaurantNameText: "text-violet-200",
            restaurantInfoText: "text-indigo-300",
            decorativeCircles: [
                "bg-violet-500/15",
                "bg-indigo-500/15",
                "bg-purple-500/15",
                "bg-cyan-500/15"
            ],
            overlayBg: "backdrop-brightness-25",
            auroraGlow: "shadow-[0_0_40px_rgba(139,92,246,0.5)]",
            backgroundPattern: "bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(6,182,212,0.15),transparent_50%)]"
        }
    },

    // Estilo Café Latte (Especial para Cafeterías)
    latte: {
        name: "Café Latte",
        colors: {
            primary: "amber",
            secondary: "orange",
            accent: "yellow",
            background: "from-amber-50 via-orange-50 to-yellow-50",
            headerGradient: "from-amber-700 via-orange-600 to-yellow-600",
            cardBg: "bg-white",
            cardBorder: "border-amber-200",
            buttonGradient: "from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700",
            textPrimary: "text-amber-900",
            textSecondary: "text-orange-700",
            textCard: "text-amber-900",
            textDescription: "text-amber-800",
            badge: "bg-gradient-to-r from-amber-600 to-orange-600",
            badgeBg: "bg-amber-100",
            badgeText: "text-amber-900",
            inputBg: "bg-amber-50/80",
            inputText: "text-amber-900",
            inputPlaceholder: "placeholder-amber-500",
            inputBorder: "border-amber-300 focus:ring-orange-500 focus:border-amber-400",
            sidebarBg: "from-amber-100 via-orange-100 to-yellow-100",
            sidebarText: "text-amber-900",
            sidebarHover: "hover:bg-amber-200",
            restaurantNameText: "text-amber-900",
            restaurantInfoText: "text-orange-800",
            decorativeCircles: [
                "bg-amber-200",
                "bg-orange-200",
                "bg-yellow-200",
                "bg-amber-300"
            ],
            overlayBg: "backdrop-brightness-50",
            cozyGlow: "shadow-[0_0_30px_rgba(217,119,6,0.25)]"
        }
    },

    // Estilo Mocha (Cafetería Moderna)
    mocha: {
        name: "Mocha",
        colors: {
            primary: "stone",
            secondary: "amber",
            accent: "orange",
            background: "from-stone-50 via-amber-50 to-orange-50",
            headerGradient: "from-stone-700 via-amber-700 to-orange-700",
            cardBg: "bg-white/95",
            cardBorder: "border-stone-300",
            buttonGradient: "from-stone-700 via-amber-700 to-orange-700 hover:from-stone-800 hover:via-amber-800 hover:to-orange-800",
            textPrimary: "text-stone-900",
            textSecondary: "text-amber-800",
            textCard: "text-stone-900",
            textDescription: "text-stone-700",
            badge: "bg-gradient-to-r from-stone-700 to-amber-700",
            badgeBg: "bg-stone-200",
            badgeText: "text-stone-900",
            inputBg: "bg-white/90",
            inputText: "text-stone-900",
            inputPlaceholder: "placeholder-stone-500",
            inputBorder: "border-stone-300 focus:ring-amber-600 focus:border-stone-400",
            sidebarBg: "from-stone-100 via-amber-100 to-orange-100",
            sidebarText: "text-stone-900",
            sidebarHover: "hover:bg-stone-200",
            restaurantNameText: "text-stone-900",
            restaurantInfoText: "text-amber-800",
            decorativeCircles: [
                "bg-stone-300",
                "bg-amber-200",
                "bg-orange-200",
                "bg-stone-400"
            ],
            overlayBg: "backdrop-brightness-50",
            warmGlow: "shadow-[0_0_35px_rgba(120,113,108,0.3)]"
        }
    },

    // Estilo Cappuccino (Cafetería Elegante)
    cappuccino: {
        name: "Cappuccino",
        colors: {
            primary: "amber",
            secondary: "stone",
            accent: "orange",
            background: "from-stone-900 via-amber-950 to-orange-950",
            headerGradient: "from-amber-700 via-stone-700 to-orange-700",
            cardBg: "bg-stone-900/90",
            cardBorder: "border-amber-700/40",
            buttonGradient: "from-amber-700 via-stone-700 to-orange-700 hover:from-amber-600 hover:via-stone-600 hover:to-orange-600",
            textPrimary: "text-amber-300",
            textSecondary: "text-orange-400",
            textCard: "text-amber-200",
            textDescription: "text-stone-300",
            badge: "bg-gradient-to-r from-amber-600 to-orange-600",
            badgeBg: "bg-amber-950/60",
            badgeText: "text-amber-200",
            inputBg: "bg-stone-900/90",
            inputText: "text-amber-200",
            inputPlaceholder: "placeholder-amber-700/50",
            inputBorder: "border-amber-700/50 focus:ring-orange-500 focus:border-amber-500",
            sidebarBg: "from-stone-950 to-amber-950",
            sidebarText: "text-amber-200",
            sidebarHover: "hover:bg-amber-900/40",
            restaurantNameText: "text-amber-300",
            restaurantInfoText: "text-orange-400",
            decorativeCircles: [
                "bg-amber-600/20",
                "bg-stone-600/20",
                "bg-orange-600/20",
                "bg-amber-700/20"
            ],
            overlayBg: "backdrop-brightness-30",
            richGlow: "shadow-[0_0_35px_rgba(217,119,6,0.4)]",
            backgroundPattern: "bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.12),transparent_50%)]"
        }
    },

    // Estilo Fiesta (Mexicano Vibrante)
    fiesta: {
        name: "Fiesta Mexicana",
        colors: {
            primary: "red",
            secondary: "green",
            accent: "yellow",
            background: "from-red-50 via-yellow-50 to-green-50",
            headerGradient: "from-red-600 via-yellow-500 to-green-600",
            cardBg: "bg-white",
            cardBorder: "border-red-300",
            buttonGradient: "from-red-600 via-yellow-500 to-green-600 hover:from-red-700 hover:via-yellow-600 hover:to-green-700",
            textPrimary: "text-red-800",
            textSecondary: "text-green-700",
            textCard: "text-red-900",
            textDescription: "text-gray-800",
            badge: "bg-gradient-to-r from-red-600 via-yellow-500 to-green-600",
            badgeBg: "bg-yellow-100",
            badgeText: "text-red-900",
            inputBg: "bg-yellow-50/80",
            inputText: "text-gray-900",
            inputPlaceholder: "placeholder-red-400",
            inputBorder: "border-red-300 focus:ring-green-500 focus:border-yellow-400",
            sidebarBg: "from-red-100 via-yellow-100 to-green-100",
            sidebarText: "text-red-900",
            sidebarHover: "hover:bg-yellow-200",
            restaurantNameText: "text-red-900",
            restaurantInfoText: "text-green-800",
            decorativeCircles: [
                "bg-red-300",
                "bg-yellow-300",
                "bg-green-300",
                "bg-orange-300"
            ],
            overlayBg: "backdrop-brightness-50",
            vibrantGlow: "shadow-[0_0_35px_rgba(220,38,38,0.3)]"
        }
    },

    // Estilo Azteca (Mexicano Tradicional)
    azteca: {
        name: "Azteca",
        colors: {
            primary: "orange",
            secondary: "red",
            accent: "amber",
            background: "from-orange-900 via-red-950 to-amber-950",
            headerGradient: "from-orange-700 via-red-700 to-amber-700",
            cardBg: "bg-orange-950/90",
            cardBorder: "border-orange-600/40",
            buttonGradient: "from-orange-600 via-red-600 to-amber-600 hover:from-orange-500 hover:via-red-500 hover:to-amber-500",
            textPrimary: "text-orange-300",
            textSecondary: "text-amber-400",
            textCard: "text-orange-200",
            textDescription: "text-amber-300",
            badge: "bg-gradient-to-r from-orange-600 to-amber-600",
            badgeBg: "bg-orange-950/60",
            badgeText: "text-orange-200",
            inputBg: "bg-orange-950/90",
            inputText: "text-orange-200",
            inputPlaceholder: "placeholder-orange-500/50",
            inputBorder: "border-orange-600/50 focus:ring-amber-500 focus:border-orange-400",
            sidebarBg: "from-orange-950 to-red-950",
            sidebarText: "text-orange-200",
            sidebarHover: "hover:bg-orange-900/40",
            restaurantNameText: "text-orange-300",
            restaurantInfoText: "text-amber-400",
            decorativeCircles: [
                "bg-orange-600/20",
                "bg-red-600/20",
                "bg-amber-600/20",
                "bg-orange-700/20"
            ],
            overlayBg: "backdrop-brightness-30",
            ancientGlow: "shadow-[0_0_40px_rgba(234,88,12,0.5)]",
            backgroundPattern: "bg-[radial-gradient(circle_at_top_right,rgba(234,88,12,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.15),transparent_50%)]"
        }
    },

    // Estilo Mariachi (Mexicano Festivo)
    mariachi: {
        name: "Mariachi",
        colors: {
            primary: "yellow",
            secondary: "red",
            accent: "green",
            background: "from-slate-900 via-red-950 to-slate-900",
            headerGradient: "from-yellow-500 via-red-600 to-green-600",
            cardBg: "bg-slate-900/90",
            cardBorder: "border-yellow-500/40",
            buttonGradient: "from-yellow-500 via-red-600 to-green-600 hover:from-yellow-600 hover:via-red-700 hover:to-green-700",
            textPrimary: "text-yellow-400",
            textSecondary: "text-red-400",
            textCard: "text-yellow-300",
            textDescription: "text-green-300",
            badge: "bg-gradient-to-r from-yellow-500 via-red-500 to-green-500",
            badgeBg: "bg-yellow-950/50",
            badgeText: "text-yellow-200",
            inputBg: "bg-slate-900/90",
            inputText: "text-yellow-300",
            inputPlaceholder: "placeholder-red-500/50",
            inputBorder: "border-yellow-600/50 focus:ring-red-500 focus:border-yellow-400",
            sidebarBg: "from-slate-900 via-red-950 to-slate-900",
            sidebarText: "text-yellow-300",
            sidebarHover: "hover:bg-red-900/40",
            restaurantNameText: "text-yellow-300",
            restaurantInfoText: "text-red-400",
            decorativeCircles: [
                "bg-yellow-500/20",
                "bg-red-500/20",
                "bg-green-500/20",
                "bg-yellow-600/20"
            ],
            overlayBg: "backdrop-brightness-30",
            festiveGlow: "shadow-[0_0_40px_rgba(234,179,8,0.5)]",
            backgroundPattern: "bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15),transparent_50%)]"
        }
    },

    // Estilo Tequila (Mexicano Premium)
    tequila: {
        name: "Tequila Sunrise",
        colors: {
            primary: "orange",
            secondary: "amber",
            accent: "red",
            background: "from-orange-50 via-amber-50 to-red-50",
            headerGradient: "from-orange-600 via-amber-600 to-red-600",
            cardBg: "bg-white",
            cardBorder: "border-orange-300",
            buttonGradient: "from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:via-amber-700 hover:to-red-700",
            textPrimary: "text-orange-900",
            textSecondary: "text-amber-700",
            textCard: "text-orange-900",
            textDescription: "text-red-800",
            badge: "bg-gradient-to-r from-orange-600 to-red-600",
            badgeBg: "bg-orange-100",
            badgeText: "text-orange-900",
            inputBg: "bg-amber-50/90",
            inputText: "text-orange-900",
            inputPlaceholder: "placeholder-orange-400",
            inputBorder: "border-orange-300 focus:ring-red-500 focus:border-amber-400",
            sidebarBg: "from-orange-100 via-amber-100 to-red-100",
            sidebarText: "text-orange-900",
            sidebarHover: "hover:bg-orange-200",
            restaurantNameText: "text-orange-900",
            restaurantInfoText: "text-red-800",
            decorativeCircles: [
                "bg-orange-200",
                "bg-amber-200",
                "bg-red-200",
                "bg-orange-300"
            ],
            overlayBg: "backdrop-brightness-50",
            sunriseGlow: "shadow-[0_0_40px_rgba(249,115,22,0.3)]"
        }
    }
};

// Función helper para obtener el estilo
export const getMenuStyle = (styleName) => {
    return menuStyles[styleName] || menuStyles.default;
};

