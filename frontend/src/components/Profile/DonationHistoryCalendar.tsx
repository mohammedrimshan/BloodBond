import { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import type { IDonation } from '@/types/DonationTypes';

interface Props {
  donations: IDonation[];
}

const DonationHistoryCalendar = ({ donations }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0-6)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Check if a date has a donation
  const getDonationForDate = (day: number) => {
    return donations.find(d => {
      const donateDate = new Date(d.donatedAt);
      return donateDate.getDate() === day && 
             donateDate.getMonth() === month && 
             donateDate.getFullYear() === year;
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar grid
  const days = [];
  // Empty slots for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-full" />);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const donation = getDonationForDate(d);
    days.push(
      <div 
        key={d} 
        className="relative h-10 w-full flex items-center justify-center text-[13px] font-semibold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
      >
        {d}
        {donation && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="mt-6 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping absolute" />
            <div className="mt-6 w-1.5 h-1.5 bg-red-500 rounded-full absolute shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
        <h2 className="text-[14px] font-bold text-slate-800 flex items-center gap-2.5">
          <Droplets size={15} className="text-red-500" />
          History View
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Month/Year */}
        <div className="text-center mb-4">
          <span className="text-[13px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {monthNames[month]} {year}
          </span>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 py-3 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Donation Day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistoryCalendar;
