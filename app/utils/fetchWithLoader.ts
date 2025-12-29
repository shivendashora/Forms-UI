import { useLoaderStore } from "../store/loaderStore";

export async function fetchWithLoader(url: string, options?: RequestInit) {
  const setLoading = useLoaderStore.getState().setLoading;

  setLoading(true);
  try {
    const response = await fetch(url, options);
    return response;
  } finally {
    setLoading(false);
  }
}
