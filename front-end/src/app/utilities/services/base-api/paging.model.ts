
/**
 * DRF can handle pagination by default, we can intercept that here.
 * Good practice, not the most useful for the scale of our op.
 */
 export interface Pageable<T> {
  count: number;
  results: T[];
}
