import { useQuery } from "@tanstack/react-query";
import { privateAxiosInstance } from "@/api/privateAxios.Instance";

export const useDonationCertificate = (donationId: string) => {
  return useQuery({
    queryKey: ["donation-certificate", donationId],
    queryFn: async () => {
      const { data } = await privateAxiosInstance.get(`/donations/${donationId}/certificate`);
      return data.donation || null;
    },
    enabled: !!donationId,
  });
};
