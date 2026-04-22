import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDonationCertificate = (donationId: string) => {
  return useQuery({
    queryKey: ["donation-certificate", donationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/donations/${donationId}/certificate`, { withCredentials: true });
      return data.donation;
    },
    enabled: !!donationId,
  });
};
