export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
      <div className="theme-container container flex flex-1 scroll-mt-20 flex-col">
        <div className="bg-background flex flex-col overflow-hidden rounded-lg border bg-clip-padding md:flex-1 xl:rounded-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
