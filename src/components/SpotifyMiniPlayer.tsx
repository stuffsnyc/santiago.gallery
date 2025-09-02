import { useState, useEffect } from 'react';
import { Play, Pause, ExternalLink } from 'lucide-react';

interface SpotifyMiniPlayerProps {
  playlistUrl: string;
  className?: string;
}

export function SpotifyMiniPlayer({ playlistUrl, className = '' }: SpotifyMiniPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [playlistName, setPlaylistName] = useState<string>('Spotify Playlist');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract playlist ID from various Spotify URL formats
    const extractPlaylistId = (url: string): string | null => {
      const patterns = [
        /spotify:playlist:([a-zA-Z0-9]+)/,
        /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
        /spotify\.com\/playlist\/([a-zA-Z0-9]+)/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      return null;
    };

    const playlistId = extractPlaylistId(playlistUrl);
    if (playlistId) {
      setEmbedUrl(`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`);
      setPlaylistName('Event Playlist');
    }
    setIsLoading(false);
  }, [playlistUrl]);

  const openInSpotify = () => {
    window.open(playlistUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-muted rounded-lg h-20 ${className}`}>
        <div className="flex items-center p-3 space-x-3">
          <div className="w-14 h-14 bg-muted-foreground/20 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
            <div className="h-2 bg-muted-foreground/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div className={`bg-muted/50 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">Playlist</p>
              <p className="text-xs text-muted-foreground">Spotify</p>
            </div>
          </div>
          <button
            onClick={openInSpotify}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            title="Open in Spotify"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      <div className="relative">
        <iframe
          src={embedUrl}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-lg"
        />
        <div className="absolute top-2 right-2">
          <button
            onClick={openInSpotify}
            className="p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
            title="Open in Spotify"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}