import React, { useState,useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchOrdersAndCalculateStatsForEachDay,DriverDayStats } from '../../services/driverService';
import { useAuthStore } from '../../stores/authStore';

const data = [
  {
    date: '23/11/24',
    core: 145,
    potential: 82,
    coreChange: 5,
    potentialChange: -2
  },
  {
    date: '24/11/24',
    core: 148,
    potential: 85,
    coreChange: 3,
    potentialChange: 3
  },
  {
    date: '25/11/24',
    core: 150,
    potential: 83,
    coreChange: 2,
    potentialChange: -2
  },
  {
    date: '26/11/24',
    core: 152,
    potential: 86,
    coreChange: 2,
    potentialChange: 3
  },
  {
    date: '27/11/24',
    core: 154,
    potential: 88,
    coreChange: 2,
    potentialChange: 2
  },
  {
    date: '28/11/24',
    core: 155,
    potential: 87,
    coreChange: 1,
    potentialChange: -1
  },
  {
    date: '29/11/24',
    core: 156,
    potential: 89,
    coreChange: 1,
    potentialChange: 2
  },
  {
    date: '30/11/24',
    core: 158,
    potential: 90,
    coreChange: 2,
    potentialChange: 1
  }
];

type Period = '7d' | '1m' | '3m' | 'custom';

export default function DriverSegmentsTable() {
  const [period, setPeriod] = useState<Period>('7d');
  const [startDate, setStartDate] = useState<Date | null>(new Date('2024-11-23'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2024-11-30'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [stats, setStats] = useState<DriverDayStats[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    if (newPeriod === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };
  const { workspace } = useAuthStore();
  const setToMidnight = (date: Date): Date => {
    const adjustedDate = new Date(date); // Cloner la date pour éviter les effets de bord
    adjustedDate.setHours(0, 0, 0, 0);  // Réinitialiser l'heure, les minutes, les secondes et les millisecondes
    return adjustedDate;
  };
  
  const handleFetchStats = async () => {
    if (period === 'custom' && (!startDate || !endDate)) {
      setError('Veuillez sélectionner une période valide.');
      return;
    }
  
    setError(null);
    setLoading(true);
  
    let formattedStartDate: string;
    let formattedEndDate: string;
    const today = new Date(); // Date actuelle immuable
  
    switch (period) {
      case '7d': {
        const startDate = setToMidnight(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)); // 7 jours avant, minuit
        formattedStartDate = startDate.toISOString();
        formattedEndDate = today.toISOString();
        break;
      }
      case '1m': {
        const startDate = setToMidnight(new Date(new Date(today).setMonth(today.getMonth() - 1))); // 1 mois avant, minuit
        formattedStartDate = startDate.toISOString();
        formattedEndDate = today.toISOString();
        break;
      }
      case '3m': {
        const startDate = setToMidnight(new Date(new Date(today).setMonth(today.getMonth() - 3))); // 3 mois avant, minuit
        formattedStartDate = startDate.toISOString();
        formattedEndDate = today.toISOString();
        break;
      }
      case 'custom': {
        if (startDate && endDate) {
          formattedStartDate = setToMidnight(startDate).toISOString(); // Start à minuit
          formattedEndDate = endDate.toISOString(); // End avec l'heure courante
        } else {
          setError('Veuillez sélectionner une période personnalisée valide.');
          setLoading(false);
          return;
        }
        break;
      }
      default:
        return;
    }
  
    console.log('data select', formattedStartDate, formattedEndDate);
  
    try {
      const result = await fetchOrdersAndCalculateStatsForEachDay(formattedStartDate, formattedEndDate,workspace?.id);
      setStats(result);
      console.log('stats', result, period);
    } catch (err: any) {
      setError('Erreur lors de la récupération des statistiques.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  

  // Charger les statistiques de la date d'aujourd'hui au démarrage
  useEffect(() => {
    handleFetchStats();
  }, [period,startDate,endDate]); // Se déclenche quand la période change


  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Évolution des Segments
          </h3>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => handlePeriodChange('7d')}
                className={`glass-button px-3 py-1.5 text-sm ${period === '7d' ? 'active' : ''}`}
              >
                7 jours
              </button>
              <button
                onClick={() => handlePeriodChange('1m')}
                className={`glass-button px-3 py-1.5 text-sm ${period === '1m' ? 'active' : ''}`}
              >
                1 mois
              </button>
              <button
                onClick={() => handlePeriodChange('3m')}
                className={`glass-button px-3 py-1.5 text-sm ${period === '3m' ? 'active' : ''}`}
              >
                3 mois
              </button>
              <button
                onClick={() => handlePeriodChange('custom')}
                className={`glass-button px-3 py-1.5 text-sm ${period === 'custom' ? 'active' : ''}`}
              >
                Personnalisé
              </button>
            </div>

            {(period === 'custom' || showDatePicker) && (
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => {
                    const [start, end] = dates as [Date, Date];
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  className="glass-input px-4 py-2 pl-10 [&:not(:placeholder-shown)]:text-black dark:text-text-primary text-sm"
                  dateFormat="dd/MM/yyyy"
                />
                <Calendar className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-left text-sm font-medium text-text-secondary">Date</th>
              <th className="p-4 text-left text-sm font-medium text-text-secondary">Noyau Dur</th>
              <th className="p-4 text-left text-sm font-medium text-text-secondary">Variation</th>
              <th className="p-4 text-left text-sm font-medium text-text-secondary">Électrons</th>
              <th className="p-4 text-left text-sm font-medium text-text-secondary">Variation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            
            {loading ? (
              <>
              <tr>
               <td colSpan={4}>
                   <div className='w-24 h-24 text-white animate-spin  ' ></div>
               </td>
              </tr>
              </>
            ) : stats?.map((row, index) => (
              <tr key={index} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm text-text-primary">{row.date}</td>
                <td className="p-4 text-sm text-accent font-medium">{row.coreDrivers}</td>
                <td className="p-4">
                  <div className={`flex items-center space-x-1 text-sm ${
                    row.coreChange > 0 ? 'text-accent-success' : 'text-accent-warning'
                  }`}>
                    {row.coreChange > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(row.coreChange)}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-accent-warning font-medium">{row.electrons}</td>
                <td className="p-4">
                  <div className={`flex items-center space-x-1 text-sm ${
                    row.electronsChange > 0 ? 'text-accent-success' : 'text-accent-warning'
                  }`}>
                    {row.electronsChange > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(row.electronsChange)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}