
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
    const response = await fetch("http://dq.10jqka.com.cn/fuyao/rzrq_data/default/v1/fetch_data", {
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
    
    // Return mock data for development/preview purposes
    return generateMockData(days);
  }
};

/**
 * Generates mock data for development purposes
 * @param days Number of days to generate
 * @returns Array of mock data points
 */
const generateMockData = (days: number): MarginRatioDataPoint[] => {
  const data: MarginRatioDataPoint[] = [];
  const today = new Date();
  let baseValue = 2.5 + Math.random();

  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate a somewhat realistic looking trend
    baseValue += (Math.random() - 0.5) * 0.1;
    if (baseValue < 1) baseValue = 1 + Math.random() * 0.5;
    if (baseValue > 5) baseValue = 5 - Math.random() * 0.5;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(baseValue.toFixed(2)),
      securityName: "上证指数",
    });
  }

  return data;
};
