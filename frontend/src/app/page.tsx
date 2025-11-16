"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { ROUTES } from "@/constants/routes";
import hackLog from "@/lib/logger";
import {
  UtensilsCrossed,
  Star,
  Clock,
  MapPin,
  ArrowRight,
  Flame,
  Leaf,
  ChefHat,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

type RestaurantCard = {
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  image: string;
  discount?: number;
};

export default function HomePage() {
  React.useEffect(() => {
    hackLog.componentMount("HomePage", {
      timestamp: new Date().toISOString(),
      route: "/",
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-card/20 text-foreground antialiased">
      <BackgroundAura />
      <Header />
      
      <main className="relative z-10 px-4 md:px-6">
        <Hero />
        <FeaturedRestaurants />
        <WhyChooseUs />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 shadow-md">
            <UtensilsCrossed className="h-5 w-5 text-white" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-foreground">FoodHub</span>
            <span className="text-[10px] text-muted-foreground">Food Delivery</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <HeaderLink href="#restaurants">Restaurants</HeaderLink>
          <HeaderLink href="#features">Why Us</HeaderLink>
          <HeaderLink href="/styleguide">Styleguide</HeaderLink>
        </nav>

        <div className="flex items-center gap-2">
          <GhostLink href={ROUTES.AUTH.LOGIN} className="hidden sm:inline-flex">
            Login
          </GhostLink>
          <PrimaryLink href={ROUTES.AUTH.SIGNUP}>Order Now</PrimaryLink>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href as any}
      className="group relative rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -z-0 rounded-md bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 py-14 md:grid-cols-2 md:py-20 lg:py-24">
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm"
        >
          <Flame className="h-3.5 w-3.5 text-primary" />
          Fastest delivery in your area
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-4 bg-gradient-to-r from-foreground via-primary to-orange-600 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent md:text-5xl lg:text-6xl dark:via-red-400 dark:to-orange-400"
        >
          Craving Something Delicious?
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg"
        >
          Discover local restaurants and get your favorite food delivered hot and fresh. From gourmet bistros to street food favorites.
        </motion.p>

        <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3">
          <PrimaryLink href={ROUTES.AUTH.SIGNUP} className="gap-2">
            Start Ordering
            <ArrowRight className="h-4 w-4" />
          </PrimaryLink>
          <GhostLink href="#restaurants" className="gap-2">
            <MapPin className="h-4 w-4" />
            View Restaurants
          </GhostLink>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            30-45 min delivery
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-secondary" />
            Trusted by 50k+ customers
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-80 rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl"
            >
              🍕
            </motion.div>
            <p className="mt-4 text-sm font-medium text-foreground/80">Premium Food Ordering</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function FeaturedRestaurants() {
  const restaurants: RestaurantCard[] = [
    {
      name: "The Rustic Bistro",
      cuisine: "French • Bistro",
      rating: 4.8,
      deliveryTime: 35,
      image: "🍽️",
      discount: 20,
    },
    {
      name: "Spice Route",
      cuisine: "Indian • Fine Dining",
      rating: 4.7,
      deliveryTime: 40,
      image: "🌶️",
      discount: 15,
    },
    {
      name: "The Pasta House",
      cuisine: "Italian • Casual",
      rating: 4.9,
      deliveryTime: 30,
      image: "🍝",
    },
    {
      name: "Dragon Wok",
      cuisine: "Chinese • Asian",
      rating: 4.6,
      deliveryTime: 35,
      image: "🥢",
      discount: 25,
    },
  ];

  return (
    <section id="restaurants" className="mx-auto max-w-7xl py-12 md:py-16 lg:py-20">
      <div className="mb-10 md:mb-14">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Restaurants</h2>
        <p className="mt-2 text-muted-foreground">Discover amazing food from your favorite local restaurants</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
      >
        {restaurants.map((restaurant) => (
          <motion.div
            key={restaurant.name}
            variants={item}
            whileHover={{ y: -4 }}
            className="group"
          >
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg">
              <div className="relative h-40 bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/10 flex items-center justify-center text-5xl">
                {restaurant.image}
                {restaurant.discount && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    {restaurant.discount}% OFF
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg leading-tight tracking-tight text-foreground">
                  {restaurant.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{restaurant.cuisine}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {restaurant.deliveryTime} min
                  </div>
                </div>

                <button className="mt-4 w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Order Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function WhyChooseUs() {
  const features = [
    {
      icon: <ChefHat className="h-6 w-6" />,
      title: "Premium Quality",
      description: "Only the finest restaurants and ingredients",
    },
    {
      icon: <Flame className="h-6 w-6" />,
      title: "Super Fast",
      description: "Average delivery in 30-45 minutes, hot and fresh",
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Healthy Options",
      description: "Curated selection of nutritious meals",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Guaranteed Fresh",
      description: "Real-time tracking and quality assurance",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl py-12 md:py-16 lg:py-20">
      <div className="mb-10 md:mb-14 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why Choose Us</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We're dedicated to bringing you the best food ordering experience with premium quality and exceptional service
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={item}>
            <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/15 text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg leading-tight mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl py-12 md:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 shadow-lg backdrop-blur-sm"
      >
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
              Start Your Food Journey Today
            </h3>
            <p className="mt-3 text-base text-muted-foreground">
              Join thousands of happy customers. Create your account now and get exclusive welcome discounts on your first order.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <PrimaryLink href={ROUTES.AUTH.SIGNUP} className="gap-2">
              Create Account
              <ArrowRight className="h-4 w-4" />
            </PrimaryLink>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto mt-14 max-w-7xl border-t border-border/40 py-10 text-sm text-muted-foreground">
      <div className="grid gap-8 md:grid-cols-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-foreground font-semibold mb-4">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            FoodHub
          </div>
          <p className="text-xs">Bringing quality food to your doorstep</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Company</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-foreground transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Support</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
            <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between">
        <p>© 2024 FoodHub. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Facebook</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Instagram</Link>
        </div>
      </div>
    </footer>
  );
}

function BackgroundAura() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-primary/25 to-secondary/20 blur-3xl dark:from-primary/15 dark:to-secondary/10" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-accent/20 to-primary/15 blur-3xl dark:from-accent/10 dark:to-primary/10" />

      <div
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(100,116,139,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "-1px -1px",
        }}
      />

      <div className="absolute inset-x-0 top-[64px] h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
    </div>
  );
}

function PrimaryLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href as any}
      className={[
        "group relative inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-primary-foreground",
        "bg-primary shadow-md shadow-primary/40 ring-1 ring-white/20",
        "transition-all hover:shadow-lg hover:shadow-primary/50 hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        }}
      />
    </Link>
  );
}

function GhostLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href as any}
      className={[
        "relative inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold",
        "border border-border bg-card/60 text-foreground hover:bg-card hover:border-primary/40",
        "transition-all shadow-sm hover:shadow-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Link>
  );
}
