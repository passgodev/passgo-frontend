import { Sector } from "../model/building/Sector.ts";

interface Props {
    sector: Sector;
    onChange: (sector: Sector) => void;
}

const SectorEditor = ({ sector, onChange }: Props) => {
    const updateName = (name: string) => {
        onChange({ ...sector, name });
    };

    const addRow = () => {
        // Znajduje najwyższy numer rzędu i dodaje +1, żeby zautomatyzować numerację
        const newRowNumber = sector.rows.length > 0 ? Math.max(...sector.rows.map(r => r.rowNumber)) + 1 : 1;
        onChange({
            ...sector,
            rows: [...sector.rows, { rowNumber: newRowNumber, seatsCount: 0 }]
        });
    };

    const updateRow = (index: number, field: 'rowNumber' | 'seatsCount', value: number) => {
        const newRows = [...sector.rows];
        newRows[index] = { ...newRows[index], [field]: value };
        onChange({ ...sector, rows: newRows });
    };

    const removeRow = (index: number) => {
        const newRows = [...sector.rows];
        newRows.splice(index, 1);
        onChange({ ...sector, rows: newRows });
    };

    return (
        <div className="space-y-5">
            {/* Sector Name */}
            <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Sector Name</label>
                <input 
                    type="text" 
                    value={sector.name} 
                    onChange={(e) => updateName(e.target.value)}
                    placeholder="e.g. ALPHA TERMINAL, VIP BALCONY"
                    className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-[#0053db] focus:outline-none focus:ring-1 focus:ring-[#0053db]"
                />
            </div>

            {/* Rows Configuration */}
            <div>
                <div className="flex justify-between items-end mb-2">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Row Configuration Matrix</label>
                    <button onClick={addRow} className="text-[9px] font-bold text-[#0053db] uppercase tracking-widest hover:underline flex items-center">
                        <span className="material-symbols-outlined text-[14px] mr-0.5">add</span> Add Row
                    </button>
                </div>
                
                {sector.rows.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-300 rounded-sm bg-slate-50/50">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No rows added to this sector.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sector.rows.map((row, index) => (
                            <div key={index} className="flex gap-3 items-center bg-white border border-slate-200 p-2.5 rounded-sm shadow-sm transition-all hover:border-slate-300">
                                <div className="flex-1">
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Row ID</label>
                                    <input 
                                        type="number" 
                                        value={row.rowNumber}
                                        onChange={(e) => updateRow(index, 'rowNumber', parseInt(e.target.value) || 0)}
                                        className="w-full border border-slate-200 rounded-sm px-2 py-1.5 text-xs font-mono focus:border-[#0053db] focus:outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Units (Seats)</label>
                                    <input 
                                        type="number" 
                                        value={row.seatsCount}
                                        onChange={(e) => updateRow(index, 'seatsCount', parseInt(e.target.value) || 0)}
                                        className="w-full border border-slate-200 rounded-sm px-2 py-1.5 text-xs font-mono focus:border-[#0053db] focus:outline-none"
                                    />
                                </div>
                                <button onClick={() => removeRow(index)} className="mt-3.5 p-1 text-slate-300 hover:text-red-600 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SectorEditor;