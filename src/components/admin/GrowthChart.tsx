
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocale } from "@/components/providers/LocaleProvider";

interface GrowthChartProps {
  title: string;
  data: any[];
  lines: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  tooltipFormatter?: (value: any) => [string, string];
}

export function GrowthChart({ title, data, lines, tooltipFormatter }: GrowthChartProps) {
  const { t } = useLocale();
  
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t(title)}</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="metric_date" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={50}
              tickMargin={5}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip 
              formatter={tooltipFormatter}
              contentStyle={{
                fontSize: '11px',
                padding: '8px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                name={t(line.name)}
                strokeWidth={1.5}
                dot={{ r: 2 }}
                activeDot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
