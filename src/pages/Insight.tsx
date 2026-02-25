/**
 * Insight - Two-pattern layout: Overview (decision) + Transactions (execution)
 * Stripe Billing-style design with sub-tabs, metric grids, AI narratives
 */

import { useState, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, LayoutGrid, Receipt, Wallet, FileText } from 'lucide-react';
import { StripeOverviewTab } from '@/components/insights/StripeOverviewTab';
import { StripeTransactionsTab } from '@/components/insights/StripeTransactionsTab';
import { BalancesView } from '@/components/reports/BalancesView';
import { CustomReports } from '@/components/reports/CustomReports';

export default function Insight() {
  const [activeTab, setActiveTab] = useState('overview');
  useEffect(() => { tagScreen('ai-analytics'); }, []);

  return (
    <AppLayout
      title="Insight"
      subtitle="Decision-oriented insights on risk, compliance, and pipeline health"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Top-level tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 bg-transparent p-0 mb-6">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Receipt className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="balances"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Wallet className="w-4 h-4" />
              Balances
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <FileText className="w-4 h-4" />
              Custom Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <StripeOverviewTab />
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <StripeTransactionsTab />
          </TabsContent>

          <TabsContent value="balances" className="mt-0">
            <BalancesView />
          </TabsContent>

          <TabsContent value="custom" className="mt-0">
            <CustomReports />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
