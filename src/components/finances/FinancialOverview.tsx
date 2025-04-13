
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DownloadIcon, FilterIcon } from "lucide-react";
import { useFinancialOverviewData } from "./overview/hooks/useFinancialOverviewData";
import IncomeTable from "./overview/components/IncomeTable";
import ExpensesTable from "./overview/components/ExpensesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialOverviewProps {
  propertyId: string | null;
  selectedYear: number;
}

const FinancialOverview = ({ propertyId, selectedYear }: FinancialOverviewProps) => {
  const { t } = useLocale();
  const { tenants, payments, expenses, isLoading } = useFinancialOverviewData(propertyId, selectedYear);

  // Filter payments and expenses for the selected year
  const filteredPayments = payments || [];
  const filteredExpenses = expenses || [];

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-md dark:bg-gray-800/40 transition-all duration-200 hover:shadow-lg hover:bg-card/60">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-primary/90 dark:text-white/90">
            {t('financialOverview')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <FilterIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">{t('filters')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem className="text-xs cursor-pointer">
                  {t('allTransactions', { fallback: 'All Transactions' })}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs cursor-pointer">
                  {t('recentOnly', { fallback: 'Recent Only' })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <DownloadIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">{t('export')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem className="text-xs cursor-pointer">
                  {t('exportToExcel')}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs cursor-pointer">
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="income" className="w-full">
          <TabList className="mb-4 w-full flex space-x-4 border-b">
            <Tab value="income" className="pb-2 text-sm font-medium text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground">
              {t('income')}
            </Tab>
            <Tab value="expenses" className="pb-2 text-sm font-medium text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground">
              {t('expenses')}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="income">
              <IncomeTable payments={filteredPayments} tenants={tenants} isLoading={isLoading} />
            </TabPanel>
            <TabPanel value="expenses">
              <ExpensesTable expenses={filteredExpenses} isLoading={isLoading} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;
