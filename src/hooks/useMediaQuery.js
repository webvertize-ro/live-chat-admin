import { useEffect, useState } from 'react';

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    const handler = () => setMatches(media.matches);
    media.addEventListener('change', handler);

    return () => media.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
