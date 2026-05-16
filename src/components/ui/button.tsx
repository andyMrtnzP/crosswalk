import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        outline: 'border border-input bg-background text-foreground hover:bg-secondary',
        icon: 'grid h-10 w-10 place-items-center rounded-full border border-hairline-2 text-ink-2 transition hover:border-ink-3 hover:text-foreground gap-2',
        main: 'inline-flex h-10 items-center gap-4 rounded-full bg-accent-gold pl-4.5 pr-5.5 text-[13px] font-semibold tracking-[-0.005em] text-on-accent transition hover:-translate-y-px hover:bg-accent-deep',
        'icon-invisible':
          'grid place-items-center rounded p-1 text-ink-3 opacity-0 transition hover:text-accent-gold group-hover:opacity-100',
        'icon-transparent': 'text-ink-3 transition-colors hover:text-foreground',
        link: 'bg-transparent text-[11.5px] uppercase tracking-[0.08em] text-ink-3 transition-colors hover:text-accent-gold',
        glow: 'mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-accent-gold text-sm font-semibold text-on-accent shadow-(--shadow-accent) transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        hero: 'h-11 rounded-full px-5 w-auto flex',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};

export { Button };
