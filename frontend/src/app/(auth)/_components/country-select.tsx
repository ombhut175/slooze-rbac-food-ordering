"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "./auth-card";

// Country options with flag emojis
const COUNTRY_OPTIONS = [
  { value: "IN", label: "India", flag: "🇮🇳" },
  { value: "US", label: "United States", flag: "🇺🇸" },
] as const;

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CountrySelect({ value, onChange, error }: CountrySelectProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <Field label="Select your country" error={error}>
      <div className="group relative">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={[
              "h-11 w-full rounded-[10px] border bg-white/90 px-3 text-sm text-slate-900 shadow-sm outline-none transition-all",
              "border-slate-200 hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10",
              "dark:border-orange-900/30 dark:bg-orange-950/20 dark:text-slate-100",
              "data-[placeholder]:text-slate-400",
            ].join(" ")}
          >
            <SelectValue placeholder="Select your country">
              {value && (
                <span className="flex items-center gap-2">
                  <span>
                    {COUNTRY_OPTIONS.find((c) => c.value === value)?.flag}
                  </span>
                  <span>
                    {COUNTRY_OPTIONS.find((c) => c.value === value)?.label}
                  </span>
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_OPTIONS.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Animated focus glow matching Input component */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: focused ? 1 : 0 }}
          className="pointer-events-none absolute -inset-0.5 rounded-[12px] bg-gradient-to-r from-orange-500/10 via-orange-400/10 to-orange-500/10 blur-md"
        />
      </div>
    </Field>
  );
}
