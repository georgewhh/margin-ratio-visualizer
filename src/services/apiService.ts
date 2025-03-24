
import { toast } from "@/components/ui/use-toast";

export interface MarginRatioDataPoint {
  date: string;
  value: number;
  securityName: string;
}

interface ApiResponse {
  data: {
    indexes: Array<{
      index_id: string;
      attribute: Record<string, any>;
      value_type: string;
    }>;
    data: Array<{
      code: string;
      values: Array<{
        idx: number;
        values: number[];
      }>;
    }>;
    time_range: string[]; // Array of timestamps
  };
  status_code: number;
  status_msg: string;
}

/**
 * Fetches margin ratio data from the API
 * @returns Promise containing the margin ratio data
 */
export const fetchMarginRatioData = async (): Promise<MarginRatioDataPoint[]> => {
  try {
    // Get current date and convert to timestamp for the 'end' parameter
    const now = new Date();
    const endTimestamp = Math.floor(now.getTime() / 1000); // Convert to seconds timestamp
    
    // Use January 5, 2024 as the earliest date
    const startDate = new Date('2024-01-05T00:00:00Z');
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    
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
          start: startTimestamp.toString(),
          end: endTimestamp.toString()
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
    
    // Check if we got a successful response
    if (result.status_code !== 0 || !result.data || !result.data.data || !result.data.time_range) {
      throw new Error(`API returned error: ${result.status_msg}`);
    }
    
    // Get the timestamps array and values array
    const timestamps = result.data.time_range;
    const valuesArray = result.data.data[0]?.values[0]?.values || [];
    
    // Transform the API response to our data format by pairing timestamps with values
    const transformedData = timestamps.map((timestamp, index) => {
      return {
        date: formatTimestampToDate(timestamp),
        value: valuesArray[index] || 0,
        securityName: "融资融券余额占流通市值比"
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
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
 * Formats Unix timestamp to YYYY-MM-DD format
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string in YYYY-MM-DD format
 */
const formatTimestampToDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp) * 1000); // Convert to milliseconds
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
