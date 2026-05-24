import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

type Deal = {
  id: number;
  startup: {
    name: string;
    logo: string;
    industry: string;
  };
  amount: string;
  equity: string;
  status: string;
  stage: string;
  lastActivity: string;
};

const deals: Deal[] = [
  {
    id: 1,
    startup: { name: 'TechWave AI', logo: '', industry: 'FinTech' },
    amount: '$1.5M',
    equity: '15%',
    status: 'Due Diligence',
    stage: 'Series A',
    lastActivity: '2024-02-15'
  }
];

export const DealsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const statuses = ['Due Diligence', 'Term Sheet', 'Negotiation'];

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleViewDetails = (deal: Deal) => {
    alert(`Viewing ${deal.startup.name}`);
  };

  return (
    <div className="space-y-6">

      {/* Search */}
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        startAdornment={<Search size={18} />}
        fullWidth
      />

      {/* Filter */}
      <div className="flex gap-2 flex-wrap items-center">
        <Filter size={18} />
        {statuses.map(status => (
          <button
            key={status}
            type="button"
            onClick={() => toggleStatus(status)}
            className="focus:outline-none"
          >
            <Badge
              className={`cursor-pointer transition-opacity ${
                selectedStatus.includes(status)
                  ? 'opacity-100 ring-2 ring-offset-1 ring-primary'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {status}
            </Badge>
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>Deals</CardHeader>
        <CardBody>
          {deals.map(deal => (
            <div key={deal.id} className="flex justify-between p-2 border-b">
              <div>{deal.startup.name}</div>
              <Button onClick={() => handleViewDetails(deal)}>
                View
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};