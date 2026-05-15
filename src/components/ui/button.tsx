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
        icon: 'grid h-10 w-10 place-items-center rounded-full border border-hairline-2 text-ink-2 transition hover:border-ink-3 hover:text-foreground',
        main: 'inline-flex h-10 items-center gap-4 rounded-full bg-accent-gold pl-4.5 pr-5.5 text-[13px] font-semibold tracking-[-0.005em] text-on-accent transition hover:-translate-y-px hover:bg-accent-deep',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
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
