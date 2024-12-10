import React from 'react';
import { Phone, TrendingUp, Clock } from 'lucide-react';
import { Driver } from '../../services/driverService';
interface StatsProps {
  driver: Driver;
}
export default function OperatorStats({driver}:StatsProps) {
  const stats = {
    todayCalls: 25,
    totalRevenue: driver.totalRevenue ?? 0,
    avgCallDuration: '4:30'
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center p-4 space-x-3 glass-card">
        <div className="p-2 rounded-lg bg-accent/10">
          <Phone className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">Appels aujourd'hui</p>
          <p className="text-lg font-semibold text-text-primary">{stats.todayCalls}</p>
        </div>
      </div>

      <div className="flex items-center p-4 space-x-3 glass-card">
        <div className="p-2 rounded-lg bg-accent-success/10">
          <TrendingUp className="w-5 h-5 text-accent-success" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">CA Généré</p>
          <p className="text-lg font-semibold text-text-primary">
            {parseFloat(stats.totalRevenue).toFixed(2).toLocaleString()} FCFA
          </p>
        </div>
      </div>

      <div className="flex items-center p-4 space-x-3 glass-card">
        <div className="p-2 rounded-lg bg-accent-warning/10">
          <Clock className="w-5 h-5 text-accent-warning" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">Temps moyen d'appel</p>
          <p className="text-lg font-semibold text-text-primary">{stats.avgCallDuration}</p>
        </div>
      </div>
    </div>
  );
}