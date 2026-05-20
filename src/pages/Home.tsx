import LibraryCard from '@/components/LibraryCard/LibraryCard';
import LibrarySectionHeader from '@/components/LibrarySectionHeader/LibrarySectionHeader';
import useRecentlyPlayed from '@/hooks/useRecentlyPlayed';

export default function Home() {
  const { items: recentlyPlayed } = useRecentlyPlayed(6);

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-6 px-9 pt-9 pb-6">
        <h1 className="font-display text-[38px] font-normal leading-none tracking-[-0.02em]">
          Home
        </h1>
      </div>

      <div className="px-9 pb-15">
        {recentlyPlayed.length > 0 && (
          <div className="mb-12">
            <LibrarySectionHeader title="Recently Played" />
            <div className="grid grid-cols-2 gap-5.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {recentlyPlayed.map((item) => (
                <LibraryCard
                  key={item.key}
                  coverArtId={item.coverArt}
                  title={item.title}
                  meta={item.meta}
                  to={item.to}
                  variant={item.variant}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
