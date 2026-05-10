import { Sector } from "../model/building/Sector.ts";

interface Props {
    hasStandingArea: boolean;
    setHasStandingArea: (val: boolean) => void;
    standingAreaSector: Sector;
    setStandingAreaSector: (sector: Sector) => void;
}

const StandingAreaEditor = ({ hasStandingArea, setHasStandingArea, standingAreaSector, setStandingAreaSector }: Props) => {
    const handleCapacityChange = (capacity: number) => {
        setStandingAreaSector({
            ...standingAreaSector,
            rows: [{ rowNumber: 0, seatsCount: capacity }]
        });
    };

    return (
        <div className="border border-slate-200 rounded-sm p-6 mb-6 bg-slate-50/50">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Main Standing Area</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">General admission floor space without assigned seating</p>
                </div>
                
                {/* Tailwind Toggle Switch */}
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={hasStandingArea} 
                            onChange={(e) => setHasStandingArea(e.target.checked)} 
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${hasStandingArea ? 'bg-[#0053db]' : 'bg-slate-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hasStandingArea ? 'translate-x-4' : ''}`}></div>
                    </div>
                </label>
            </div>

            {/* Input na pojemność (pojawia się tylko gdy włączone) */}
            {hasStandingArea && (
                <div className="pt-5 border-t border-slate-200 mt-5 animation-fade-in">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Maximum Capacity (Pax)</label>
                    <input 
                        type="number" 
                        min="0"
                        value={standingAreaSector.rows[0]?.seatsCount || 0} 
                        onChange={(e) => handleCapacityChange(parseInt(e.target.value) || 0)}
                        className="w-full max-w-xs border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-[#0053db] focus:outline-none focus:ring-1 focus:ring-[#0053db]"
                    />
                </div>
            )}
        </div>
    );
};

export default StandingAreaEditor;