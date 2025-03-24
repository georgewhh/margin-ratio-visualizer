
import { toast } from "@/components/ui/use-toast";

export interface MarginRatioDataPoint {
  date: string;
  value: number;
  securityName: string;
}

interface ApiResponse {
  data: {
    list: Array<{
      security_name: string;
      rzrq_margin_trading_bal_flow_value_rate: number;
      timestamp: number;
    }>;
  };
}

/**
 * Fetches margin ratio data from the API
 * @param days Number of trading days to fetch (default: 200)
 * @returns Promise containing the margin ratio data
 */
export const fetchMarginRatioData = async (days: number = 200): Promise<MarginRatioDataPoint[]> => {
  try {
    const response = await fetch("https://dq.10jqka.com.cn/fuyao/rzrq_data/default/v1/fetch_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codeSelectors: '{\n "include": [\n {\n "type": "block_code",\n "values": [\n "1B"\n ]\n }\n ]\n}',
        indexInfo: '[{"index_id":"security_name"},{"index_id":"rzrq_margin_trading_bal_flow_value_rate","attribute":{},"timestamp":0,"time_type":"SNAPSHOT"}]',
        appId: "tangram-data-view-stocklist",
        columnMap: '{"rzrq_margin_trading_bal_flow_value_rate":{"title":"融资融券余额占流通市值比","sortBy":true,"fit":true}}',
        page: `{size:${days}}`,
        sort: "{}",
        fixed: "20"
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json() as ApiResponse;
    
    // Transform the API response to our data format
    return result.data.list.map(item => ({
      date: new Date(item.timestamp).toISOString().split('T')[0],
      value: Number(item.rzrq_margin_trading_bal_flow_value_rate),
      securityName: item.security_name
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error("Error fetching margin ratio data:", error);
    toast({
      title: "Failed to load data",
      description: "Unable to fetch margin ratio data. Please try again later.",
      variant: "destructive",
    });
    
    // Return empty array instead of mock data
    return [];
  }
};
