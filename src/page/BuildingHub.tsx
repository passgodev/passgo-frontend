import { useContext, useEffect, useState } from "react";
import useInterceptedFetch from "../hook/useInterceptedFetch.ts";
import ApiEndpoint from "../util/endpoint/ApiEndpoint.ts";
import { BuildingDto } from "../model/building/BuildingDto.ts";
import { Sector } from "../model/building/Sector.ts";
import AuthContext from "../context/AuthProvider.tsx";
import Privilege from "../model/member/Privilege.ts";
import StandingAreaEditor from "../component/StandingAreaEditor.tsx";
import SectorEditor from "../component/SectorEditor.tsx";

type ViewState = "LIST" | "ADD" | "DETAILS";



const BuildingHub = () => {
    const { auth } = useContext(AuthContext);
    const role = auth.privilege;
    const fetch = useInterceptedFetch();

    // --- STATES ---
    const [view, setView] = useState<ViewState>("LIST");
    const [buildings, setBuildings] = useState<BuildingDto[]>([]);
    const [selected, setSelected] = useState<BuildingDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form States
    const [formData, setFormData] = useState({
        name: "",
        address: { country: "", city: "", street: "", postalCode: "", buildingNumber: "" }
    });

    // NOWE STANY DLA SEKTORÓW
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [hasStandingArea, setHasStandingArea] = useState<boolean>(false);
    const [standingAreaSector, setStandingAreaSector] = useState<Sector>({
        name: "Standing",
        standingArea: true,
        rows: [{ rowNumber: 0, seatsCount: 0 }]
    });

    // === NOWE STANY DLA ZDJĘCIA ===
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // Generuje lokalny URL do podglądu zdjęcia
        }
    };

    // --- API CALLS ---
    const loadBuildings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch({ endpoint: ApiEndpoint.buildings, reqInit: { method: "GET" } });
            if (res.ok) {
                const data = await res.json();
                setBuildings(Array.isArray(data) ? data : data?.content || []);
            }
        } catch (error) {
            console.error("Failed to load buildings", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBuildings();
    }, []);

    const loadDetails = async (id: number) => {
        try {
            const res = await fetch({ endpoint: `${ApiEndpoint.buildings}/${id}`, reqInit: { method: "GET" } });
            if (res.ok) {
                setSelected(await res.json());
                setView("DETAILS");
            }
        } catch (error) {
            console.error("Failed to load details", error);
        }
    };

    const handleStatusChange = async (id: number, status: "APPROVED" | "REJECTED") => {
        try {
            await fetch({
                endpoint: `${ApiEndpoint.buildings}/${id}/status?status=${status}`,
                reqInit: { method: "PATCH" },
            });
            loadBuildings();
        } catch (error) {
            console.error(`Failed to ${status} building`, error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to permanently delete this building?")) return;
        try {
            await fetch({
                endpoint: `${ApiEndpoint.buildings}/${id}`,
                reqInit: { method: "DELETE" },
            });
            loadBuildings();
        } catch (error) {
            console.error("Failed to delete building", error);
        }
    };

    const handleAddSubmit = async () => {
        const finalSectors = hasStandingArea ? [standingAreaSector, ...sectors] : sectors;
        const payload = { ...formData, sectors: finalSectors }; 

        try {
            // KROK 1: Tworzymy budynek wysyłając czystego JSONa (tak jak wymaga Twój backend)
            const res = await fetch({
                endpoint: ApiEndpoint.buildings,
                reqInit: {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            });

            if (res.ok) {
                // Odczytujemy odpowiedź z backendu, żeby zdobyć ID nowo utworzonego budynku
                const createdBuilding = await res.json();

                // KROK 2: Jeśli użytkownik dodał zdjęcie, wysyłamy je na specjalny endpoint
                if (imageFile && createdBuilding && createdBuilding.id) {
                    const imageFormData = new FormData();
                    imageFormData.append("file", imageFile); // Upewnij się, że backend oczekuje nazwy "file"

                    // Konstruujemy URL dla zdjęcia budynku. 
                    // Jeśli masz to w ApiEndpoint.ts, możesz użyć: ApiEndpoint.buildingImage.replace(":id", createdBuilding.id)
                    const imageUploadUrl = `${ApiEndpoint.buildings}/${createdBuilding.id}/image`;

                    try {
                        await fetch({
                            endpoint: imageUploadUrl,
                            reqInit: {
                                method: "POST", // (lub PUT, zależy jak zdefiniowałeś to w Spring Boot)
                                body: imageFormData,
                            }
                        });
                    } catch (imgError) {
                        console.error("Building created, but image upload failed:", imgError);
                        // Możesz tu dodać alerta, że zdjęcie się nie wgrało
                    }
                }

                // KROK 3: Sprzątanie i powrót do listy
                setView("LIST");
                loadBuildings();
                setFormData({ name: "", address: { country: "", city: "", street: "", postalCode: "", buildingNumber: "" } });
                setSectors([]);
                setImageFile(null);
                setImagePreview(null);
            } else {
                console.error("Failed to create building. Status:", res.status);
            }
        } catch (error) {
            console.error("Network error while adding building:", error);
        }
    };

    // --- DERIVED STATS ---
    const approvedCount = buildings.filter(b => b.status === "APPROVED").length;
    const pendingCount = buildings.filter(b => b.status === "PENDING").length;

    // ==========================================
    // WIDOK 1: LISTA (LIST)
    // ==========================================
    if (view === "LIST") {
        return (
            <div className="w-full max-w-7xl mx-auto animation-fade-in">
                {/* Nagłówek i Statystyki */}
                <div className="mb-8">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Organization / Building Hub</p>
                    <div className="flex justify-between items-end">
                        <h1 className="text-3xl font-black text-[#1a232c] tracking-tight uppercase">Building Inventory</h1>
                        
                        {(role === Privilege.ORGANIZER || role === Privilege.ADMINISTRATOR) && (
                            <button 
                                onClick={() => setView("ADD")}
                                className="px-5 py-2.5 bg-[#0053db] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#0048c1] transition-colors rounded-sm shadow-sm flex items-center"
                            >
                                <span className="material-symbols-outlined text-[16px] mr-2">add</span>
                                Add Building
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">TOTAL ASSETS</p>
                        <h3 className="text-3xl font-black text-slate-900">{buildings.length.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white border-b-4 border-b-[#0053db] border border-slate-200 p-5 rounded-sm shadow-sm">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">APPROVED</p>
                        <h3 className="text-3xl font-black text-[#0053db]">{approvedCount}</h3>
                    </div>
                    <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">PENDING REVIEW</p>
                        <h3 className="text-3xl font-black text-red-600">{pendingCount}</h3>
                    </div>
                </div>

                {/* Tabela Budynków */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/50 border-b border-slate-200">
                                <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Building Name</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Address</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isLoading ? (
                                <tr><td colSpan={4} className="py-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Assets...</td></tr>
                            ) : buildings.length === 0 ? (
                                <tr><td colSpan={4} className="py-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No buildings found.</td></tr>
                            ) : (
                                buildings.map((b) => (
                                    <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-sm flex items-center justify-center text-slate-400">
                                                    <span className="material-symbols-outlined">domain</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 uppercase tracking-wide text-xs">{b.name}</p>
                                                    <p className="text-[10px] font-mono text-slate-400">ID: BLD-{b.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-semibold text-slate-700 text-xs">{b.address?.street} {b.address?.buildingNumber}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{b.address?.city}, {b.address?.country}</p>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                                b.status === "APPROVED" ? "bg-blue-100 text-[#0053db]" : 
                                                b.status === "REJECTED" ? "bg-slate-200 text-slate-500" : 
                                                "bg-red-100 text-red-600"
                                            }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                {/* ADMIN ACTIONS */}
                                                {role === Privilege.ADMINISTRATOR && b.status === "PENDING" && (
                                                    <>
                                                        <button onClick={() => handleStatusChange(b.id, "APPROVED")} className="px-3 py-1.5 bg-[#0053db] text-white text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#0048c1] transition-colors">Approve</button>
                                                        <button onClick={() => handleStatusChange(b.id, "REJECTED")} className="px-3 py-1.5 bg-white border border-red-500 text-red-600 text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-50 transition-colors">Reject</button>
                                                    </>
                                                )}
                                                
                                                {/* ORGANIZER ACTIONS */}
                                                {role === Privilege.ORGANIZER && (
                                                    <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-50 transition-colors">Edit</button>
                                                )}

                                                {/* SHARED ACTIONS */}
                                                <button onClick={() => loadDetails(b.id)} className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-50 transition-colors">Details</button>
                                                
                                                <button onClick={() => handleDelete(b.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors ml-2" title="Delete">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // ==========================================
    // WIDOK 2: DODAWANIE (ADD)
    // ==========================================
    if (view === "ADD") {
        return (
            <div className="w-full max-w-4xl mx-auto animation-fade-in">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-[#0053db] uppercase tracking-widest cursor-pointer hover:underline" onClick={() => setView("LIST")}>
                            &larr; Back to Inventory
                        </p>
                        <h1 className="text-2xl font-black text-[#1a232c] tracking-tight uppercase mt-2">Register New Node</h1>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Infrastructure Configuration</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Building Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-[#0053db] focus:outline-none focus:ring-1 focus:ring-[#0053db]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">City</label>
                                <input type="text" value={formData.address.city} onChange={e => setFormData({...formData, address: {...formData.address, city: e.target.value}})} className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-[#0053db] focus:outline-none focus:ring-1 focus:ring-[#0053db]" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Country</label>
                                <input type="text" value={formData.address.country} onChange={e => setFormData({...formData, address: {...formData.address, country: e.target.value}})} className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-[#0053db] focus:outline-none focus:ring-1 focus:ring-[#0053db]" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Street</label>
                                <input type="text" value={formData.address.street} onChange={e => setFormData({...formData, address: {...formData.address, street: e.target.value}})} className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-[#0053db] focus:outline-none focus:ring-1 focus:ring-[#0053db]" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Bldg #</label>
                                    <input type="text" value={formData.address.buildingNumber} onChange={e => setFormData({...formData, address: {...formData.address, buildingNumber: e.target.value}})} className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-[#0053db] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Postal</label>
                                    <input type="text" value={formData.address.postalCode} onChange={e => setFormData({...formData, address: {...formData.address, postalCode: e.target.value}})} className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-[#0053db] focus:outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button onClick={() => setView("LIST")} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-600 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-50 transition-colors">Cancel</button>
                        <button onClick={handleAddSubmit} className="px-5 py-2.5 bg-[#0053db] text-white text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#0048c1] transition-colors shadow-sm">Deploy Node</button>
                    </div>
                </div>

                <div className="space-y-6"> {/* Zmień z space-y-4 na space-y-6 dla lepszych odstępów */}
                        
                    {/* --- NOWA STREFA WGRYWANIA ZDJĘCIA --- */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2">Asset Visualization (Image)</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-56 border-2 border-slate-300 border-dashed rounded-sm cursor-pointer bg-slate-50/50 hover:bg-slate-100 transition-colors relative overflow-hidden group">
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center bg-black/50 px-3 py-1.5 rounded-sm backdrop-blur-sm">
                                                <span className="material-symbols-outlined text-[16px] mr-2">edit</span> Change Image
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-3 shadow-sm text-[#0053db]">
                                            <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
                                        </div>
                                        <p className="mb-2 text-sm text-slate-600 font-bold"><span className="text-[#0053db]">Click to upload</span> or drag and drop</p>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">PNG, JPG, WEBP (MAX. 5MB)</p>
                                    </div>
                                )}
                                <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        {imagePreview && (
                            <div className="flex justify-end mt-2">
                                <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:underline flex items-center">
                                    <span className="material-symbols-outlined text-[14px] mr-1">delete</span> Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Wklej to w BuildingHub.tsx, widok ADD, przed przyciskami Cancel/Deploy Node */}
                    <div className="mt-8">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Sector & Capacity Configuration</h2>
                        
                        <StandingAreaEditor 
                            hasStandingArea={hasStandingArea}
                            setHasStandingArea={setHasStandingArea}
                            standingAreaSector={standingAreaSector}
                            setStandingAreaSector={setStandingAreaSector}
                        />

                        {sectors.map((sector, index) => (
                            <div key={index} className="border border-slate-200 p-6 rounded-sm mb-4 relative bg-white">
                                <div className="absolute top-4 right-4 text-3xl font-black text-slate-100 pointer-events-none">
                                    0{index + 1}
                                </div>
                                <SectorEditor 
                                    sector={sector} 
                                    onChange={(updated) => {
                                        const newSectors = [...sectors];
                                        newSectors[index] = updated;
                                        setSectors(newSectors);
                                    }} 
                                />
                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                    <button onClick={() => {
                                        const newSectors = [...sectors];
                                        newSectors.splice(index, 1);
                                        setSectors(newSectors);
                                    }} className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:underline flex items-center">
                                        <span className="material-symbols-outlined text-[14px] mr-1">close</span> Remove Sector
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button onClick={() => setSectors([...sectors, { name: "", standingArea: false, rows: [] }])} className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 hover:border-[#0053db] hover:text-[#0053db] transition-colors rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px] mr-2">add_circle</span> Add Custom Sector
                        </button>
                    </div>
            </div>
        );
    }

    // ==========================================
    // WIDOK 3: SZCZEGÓŁY (DETAILS)
    // ==========================================
    if (view === "DETAILS" && selected) {
        return (
            <div className="w-full max-w-5xl mx-auto animation-fade-in">
                <p className="text-[10px] font-bold text-[#0053db] uppercase tracking-widest cursor-pointer hover:underline mb-4" onClick={() => setView("LIST")}>
                    &larr; Back to Inventory
                </p>
                <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
                        <div>
                            <p className="text-[10px] font-mono text-[#0053db] font-bold tracking-widest bg-blue-50 inline-block px-2 py-0.5 rounded-sm mb-2">NODE ID: BLD-{selected.id}</p>
                            <h1 className="text-3xl font-black text-slate-900">{selected.name}</h1>
                            <p className="text-slate-500 text-sm mt-1 flex items-center">
                                <span className="material-symbols-outlined text-[16px] mr-1">location_on</span>
                                {selected.address?.street} {selected.address?.buildingNumber}, {selected.address?.city}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Configuration Lock</p>
                            <span className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center justify-end ${selected.status === "PENDING" ? "text-red-600 bg-red-50" : "text-[#0053db] bg-blue-50"}`}>
                                <span className="material-symbols-outlined text-[14px] mr-1">{selected.status === "PENDING" ? "lock" : "lock_open"}</span>
                                {selected.status}
                            </span>
                        </div>
                    </div>

                    {/* Sectors Display */}
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sector Hierarchy & Seating Matrices</h2>
                    {selected.sectors && selected.sectors.length > 0 ? (
                        <div className="space-y-4">
                            {selected.sectors.map((sector, i) => (
                                <div key={i} className="border border-slate-200 rounded-sm p-4 bg-slate-50/50">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-black text-slate-300">0{i + 1}</span>
                                            <div>
                                                <h3 className="font-bold text-slate-800 uppercase tracking-wide">{sector.name}</h3>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                    Standing Area: <span className={sector.standingArea ? "text-[#0053db]" : "text-slate-400"}>{sector.standingArea ? "ACTIVE" : "NONE"}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Wylistowanie rzędów */}
                                    {sector.rows && sector.rows.length > 0 && (
                                        <div className="mt-3 bg-white border border-slate-200 rounded-sm overflow-hidden">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50 border-b border-slate-200">
                                                    <tr>
                                                        <th className="py-2 px-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Row Number</th>
                                                        <th className="py-2 px-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest text-right">Units (Seats)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sector.rows.map((row, j) => (
                                                        <tr key={j} className="border-b border-slate-100 last:border-0">
                                                            <td className="py-2 px-4 font-mono font-bold text-slate-700">ROW_{row.rowNumber}</td>
                                                            <td className="py-2 px-4 text-right text-slate-500 font-semibold">{row.seatsCount} Seats</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest text-center py-8 border border-dashed border-slate-300 rounded-sm">No sectors mapped.</p>
                    )}
                </div>
            </div>
        );
    }

    return null;
};

export default BuildingHub;