
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
    <Card className="col-span-1 border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-200 hover:bg-card/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-primary/90 dark:text-white/90">{t(title)}</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="stroke-muted/50" />
            <XAxis 
              dataKey="metric_date" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={50}
              tickMargin={5}
              stroke="#888"
            />
            <YAxis tick={{ fontSize: 10 }} stroke="#888" />
            <Tooltip 
              formatter={tooltipFormatter}
              contentStyle={{
                fontSize: '11px',
                padding: '8px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
              cursor={{ stroke: '#888', strokeDasharray: '3 3', strokeWidth: 1 }}
            />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                name={t(line.name)}
                strokeWidth={1.5}
                dot={{ r: 2, strokeWidth: 1, stroke: line.color, fill: 'white' }}
                activeDot={{ r: 4, stroke: line.color, strokeWidth: 1, fill: 'white' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
