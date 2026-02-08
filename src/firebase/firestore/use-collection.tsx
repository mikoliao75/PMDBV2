'use client';
import {
  onSnapshot,
  type CollectionReference,
  type Query,
} from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T>(query: CollectionReference | Query | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = useCallback(() => {
    setRefetchIndex((prevIndex) => prevIndex + 1);
  }, []);

  useEffect(() => {
    if (!query) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // The 'query' object can be unstable if created inline in a component.
    // This useEffect will re-run if the query reference changes.
    // For performance, memoize the query in the parent component with useMemo.
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const newDocs = snapshot.docs.map((doc) => ({
          ...(doc.data() as T),
          id: doc.id,
        })) as T[];

        console.log('Firestore data loaded successfully');
        setData(newDocs);
        setIsLoading(false);
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err);
        // Attempt to get path for error reporting, acknowledging it might not exist on all query types directly.
        const path = typeof query === 'object' && query && 'path' in query ? (query as CollectionReference).path : 'unknown';
        const permissionError = new FirestorePermissionError({
          path: path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query, refetchIndex]); // Re-run on query change or manual refetch

  return { data, isLoading, error, refetch };
}
