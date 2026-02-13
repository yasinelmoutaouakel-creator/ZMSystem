
import React from 'react';
import { useApp } from '../store';
import { Role } from '../types';
import { INITIAL_EMPLOYEES } from '../constants';

export const RoleSelector: React.FC = () => {
  const { setCurrentUser } = useApp();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">OmniChef Enterprise</h2>
          <p className="text-slate-400 text-lg">Select a user profile to enter the POS system</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_EMPLOYEES.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setCurrentUser(emp)}
              className="bg-slate-800 border border-slate-700 p-6 rounded-3xl text-left hover:border-indigo-500 hover:bg-slate-800/80 transition-all group"
            >
              <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                <span className="text-xl font-bold text-white">{emp.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{emp.name}</h3>
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4">{emp.role.replace('_', ' ')}</p>
              <div className="flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${emp.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                 <span className="text-xs text-slate-500 font-medium">Shift: {emp.shift}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
