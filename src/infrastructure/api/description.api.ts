const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export const fetchDescriptionStream = async (
  businessName: string,
  category: string | null,
  type: 1 | 2,
  previousDescription?: string
): Promise<ReadableStreamDefaultReader> => {
  let url = `${API_URL}ai/builder/description?businessName=${businessName}&category=${category}&type=${type}`;
  if (type === 2 && previousDescription) {
    url += `&description1=${encodeURIComponent(previousDescription)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch description");
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  return response.body?.getReader()!;
};
