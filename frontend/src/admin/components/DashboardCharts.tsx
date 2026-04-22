import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

interface Props {
  bloodGroups: { _id: string; count: number }[];
  userGrowth: { _id: { month: number; year: number }; count: number }[];
}

const COLORS = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];

const DashboardCharts: React.FC<Props> = ({ bloodGroups, userGrowth }) => {
  // Format user growth data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedGrowth = userGrowth.map(item => ({
    name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    users: item.count
  }));

  // Format blood group data
  const formattedBloodGroups = bloodGroups.map(item => ({
    name: item._id,
    value: item.count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
      {/* Blood Group Distribution */}
      <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl shadow-black/20">
        <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Blood Group Availability</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedBloodGroups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {formattedBloodGroups.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth Trend */}
      <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl shadow-black/20">
        <h3 className="text-xl font-bold text-white mb-6 tracking-tight">User Growth Trend</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4, stroke: '#0f172a' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
