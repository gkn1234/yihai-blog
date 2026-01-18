// src/components/layout/Footer.tsx
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 py-8">
      <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
        <p>© {currentYear} 云深亦知梦. All rights reserved.</p>
      </div>
    </footer>
  )
}
