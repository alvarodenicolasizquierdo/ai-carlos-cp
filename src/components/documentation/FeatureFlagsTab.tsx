import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { isFeatureEnabled } from '@/config/featureFlags';
import { useState } from 'react';

type FlagKey = 'NEW_IA_NAV_AND_HOME' | 'AI_ASSIST' | 'DPP_INTEGRATION' | 'MAP_VIEW';

interface FlagDef {
  key: FlagKey;
  id: string;
  label: string;
  description: string;
  screens: string[];
}

const FLAG_DEFINITIONS: FlagDef[] = [
  {
    key: 'NEW_IA_NAV_AND_HOME',
    id: 'new-ia-nav',
    label: 'New IA Nav & Home',
    description: 'Sidebar regrouping, Today/Next dashboard strip, and progressive disclosure for dense lists.',
    screens: ['dashboard', 'sidebar'],
  },
  {
    key: 'AI_ASSIST',
    id: 'ai-assist',
    label: 'AI Assist Panel',
    description: 'Shows AI suggestion panels and assessment strips on detail pages.',
    screens: ['dashboard', 'style-detail', 'trf-detail'],
  },
  {
    key: 'DPP_INTEGRATION',
    id: 'dpp-integration',
    label: 'DPP Integration',
    description: 'Enables Digital Product Passport features and readiness tracking.',
    screens: ['dashboard', 'style-detail', 'analytics'],
  },
  {
    key: 'MAP_VIEW',
    id: 'map-view',
    label: 'Inspection Map View',
    description: 'Enables geographic map view for inspections.',
    screens: ['inspections'],
  },
];

export function FeatureFlagsTab() {
  const [, rerender] = useState(0);

  const toggle = (key: FlagKey) => {
    const lsKey = `ff_${key}`;
    const current = isFeatureEnabled(key);
    localStorage.setItem(lsKey, current ? '0' : '1');
    rerender((n) => n + 1);
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flags</CardTitle>
        <CardDescription>
          Platform features that can be toggled on or off for testing or gradual rollout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Flag ID</TableHead>
              <TableHead className="w-[140px]">Name</TableHead>
              <TableHead className="w-[80px]">Default</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Affected Screens</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FLAG_DEFINITIONS.map((flag) => {
              const enabled = isFeatureEnabled(flag.key);
              return (
                <TableRow key={flag.key}>
                  <TableCell>
                    <code className="text-xs px-2 py-1 rounded bg-muted">{flag.id}</code>
                  </TableCell>
                  <TableCell className="font-medium">{flag.label}</TableCell>
                  <TableCell>
                    <Switch
                      checked={enabled}
                      onCheckedChange={() => toggle(flag.key)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {flag.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-1">
                      {flag.screens.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
