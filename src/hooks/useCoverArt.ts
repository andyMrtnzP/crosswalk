import useNavidromeRequest from './useNavidromeRequest';

// Reuse the useNavidromeRequest hook to fetch cover art as a blob URL
export default function useCoverArt(id: string | undefined, size: number): string | null {
  const { data } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id, size },
    { responseType: 'blobUrl', skip: !id }
  );
  return data;
}
