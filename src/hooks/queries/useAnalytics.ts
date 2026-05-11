import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface AnalyticsDashboardData {
  kpis: {
    totalUsers: number;
    activeUsers: number;
    publishedContent: number;
    healthSignals: number;
    totalContent: number;
    engagementRate: number;
    [key: string]: number;
  };
  monthlyData: {
    monthName: string;
    users: number;
    content: number;
    engagement: number;
  }[];
  engagementByContent: {
    type: string;
    views: number;
    likes: number;
    shares: number;
  }[];
}

export const useAnalytics = () => {
  return useQuery<AnalyticsDashboardData>({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/analytics/dashboard");
      return data;
    },
  });
};

export const useDashboardKPIs = () => {
  const { data, ...rest } = useAnalytics();
  return {
    ...rest,
    data: data?.kpis,
  };
};
