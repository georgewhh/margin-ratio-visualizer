
import { toast } from "@/components/ui/use-toast";

export interface MarginRatioDataPoint {
  date: string;
  value: number;
  securityName: string;
}

interface ApiResponse {
  data: {
    items: Array<{
      item: {
        "48:883957": {
          rzrq_margin_trading_bal_flow_value_rate: number;
        };
      };
      trade_date: string;
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
    // Get current date and convert to timestamp for the 'end' parameter
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000); // Convert to seconds timestamp
    
    const response = await fetch("https://dataq.10jqka.com.cn/fetch-data-server/fetch/v1/interval_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "platform": "hevo",
        "Source-Id": "PC"
      },
      body: JSON.stringify({
        time_range: {
          time_type: "TRADE_DAILY",
          end: timestamp.toString(),
          offset: `-${days}`
        },
        indexes: [
          {
            codes: ["48:883957"],
            index_info: [
              {
                index_id: "rzrq_margin_trading_bal_flow_value_rate"
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json() as ApiResponse;
    
    // Transform the API response to our data format
    const transformedData = result.data.items.map(item => ({
      date: formatTradeDate(item.trade_date),
      value: Number(item.item["48:883957"].rzrq_margin_trading_bal_flow_value_rate),
      securityName: "融资融券余额占流通市值比" // Since we don't get security name from the new API
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching margin ratio data:", error);
    toast({
      title: "Failed to load data",
      description: "Unable to fetch margin ratio data. Please try again later.",
      variant: "destructive",
    });
    
    // Return empty array on error
    return [];
  }
};

/**
 * Formats trade date from YYYYMMDD to YYYY-MM-DD format
 * @param tradeDate Trade date in YYYYMMDD format
 * @returns Formatted date string in YYYY-MM-DD format
 */
const formatTradeDate = (tradeDate: string): string => {
  if (tradeDate.length !== 8) return tradeDate;
  
  const year = tradeDate.substring(0, 4);
  const month = tradeDate.substring(4, 6);
  const day = tradeDate.substring(6, 8);
  
  return `${year}-${month}-${day}`;
};
