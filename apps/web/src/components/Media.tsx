import Image from 'next/image';
import { getMedia } from '@c-event/content';
import { asset } from '@/lib/env';

/** Alle Bilder und Videos laufen über die Medien-Registry (Austausch gegen Celias Material per ID). */
export function Media({
  id,
  sizes = '100vw',
  priority,
  className,
  fill = true,
  video,
}: {
  id: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  /** Videos automatisch abspielen (stumm, Loop). */
  video?: 'autoplay' | 'poster';
}) {
  const m = getMedia(id);
  const stock = m.stock ? ' is-stock' : '';
  if (m.kind === 'video') {
    return (
      <video
        className={`media${stock} ${className ?? ''}`}
        src={asset(m.src)}
        poster={m.poster ? asset(m.poster) : undefined}
        muted
        loop
        playsInline
        autoPlay={video !== 'poster'}
        preload="metadata"
        aria-label={m.alt}
      />
    );
  }
  return fill ? (
    <Image className={`media${stock} ${className ?? ''}`} src={asset(m.src)} alt={m.alt} fill sizes={sizes} priority={priority} />
  ) : (
    <Image
      className={`media${stock} ${className ?? ''}`}
      src={asset(m.src)}
      alt={m.alt}
      width={m.width}
      height={m.height}
      sizes={sizes}
      priority={priority}
    />
  );
}
