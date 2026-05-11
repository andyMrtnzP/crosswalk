function Header() {
  return (
    <header className="border-b border-border bg-card/75 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Crosswalk</p>
          <h1 className="text-xl font-semibold text-card-foreground">Navidrome Browser</h1>
        </div>
      </div>
    </header>
  )
}

export default Header
