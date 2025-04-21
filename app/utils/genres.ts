export const TMDB_GENRES: { [key: string]: string } = {
  '28': 'Action',
  '12': 'Adventure',
  '16': 'Animation',
  '35': 'Comedy',
  '80': 'Crime',
  '99': 'Documentary',
  '18': 'Drama',
  '10751': 'Family',
  '14': 'Fantasy',
  '36': 'History',
  '27': 'Horror',
  '10402': 'Music',
  '9648': 'Mystery',
  '10749': 'Romance',
  '878': 'Science Fiction',
  '10770': 'TV Movie',
  '53': 'Thriller',
  '10752': 'War',
  '37': 'Western',
};

export type GenreId = keyof typeof TMDB_GENRES;

export function getGenreName(genreId: number): string {
  return TMDB_GENRES[genreId as GenreId] || 'Unknown';
}

export function getPrimaryGenre(genreIds?: number[]): string {
  return genreIds && genreIds.length > 0 ? getGenreName(genreIds[0]) : 'Movie';
}