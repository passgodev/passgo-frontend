import { useContext, useEffect, useState } from "react";
import useInterceptedFetch from "../hook/useInterceptedFetch.ts";
import AuthContext from "../context/AuthProvider.tsx";
import Privilege from "../model/member/Privilege.ts";
import API_ENDPOINTS from "../util/endpoint/ApiEndpoint.ts";

interface Faq {
    id: number;
    question: string;
    answer: string;
}

const FaqPage = () => {
    const { auth } = useContext(AuthContext);
    const isAdmin = auth?.privilege === Privilege.ADMINISTRATOR;
    const interceptedFetch = useInterceptedFetch();

    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    
    // Admin States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ question: "", answer: "" });

    const loadFaqs = async () => {
        try {
            const res = await interceptedFetch({ endpoint: API_ENDPOINTS.faq });
            if (res.ok) {
                const data = await res.json();
                
                // --- THE FIX ---
                // If it's an array, use it. 
                // If it's a Spring Page object, use data.content. 
                // Otherwise, default to an empty array.
                const faqArray = Array.isArray(data) ? data : (data?.content || []);
                setFaqs(faqArray);
            }
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
            setFaqs([]); // Prevent map crash on error
        }
    };

    useEffect(() => { loadFaqs(); }, []);

    const handleSave = async () => {
        const method = "POST"; // or PUT if editing
        const res = await interceptedFetch({
            endpoint: API_ENDPOINTS.faq,
            reqInit: {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }
        });
        if (res.ok) {
            setIsDialogOpen(false);
            setFormData({ question: "", answer: "" });
            loadFaqs();
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto animation-fade-in">
            {/* Header Section */}
            <div className="mb-10 border-l-4 border-primary pl-6">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Resource Portal</p>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">FAQ</h1>
                        <p className="text-slate-500 text-sm mt-2 max-w-2xl font-medium">
                            Operational guidelines and organizational protocols for event managers and system nodes.
                        </p>
                    </div>
                    {isAdmin && (
                        <button 
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-primary text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-primary-dim transition-all shadow-sm flex items-center"
                        >
                            <span className="material-symbols-outlined text-sm mr-2">add</span>
                            New Protocol
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Bar Mockup */}
            <div className="flex justify-between items-center border-y border-slate-200 py-3 mb-8">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-400 text-lg">filter_list</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category: All</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Order: Relevance
                </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={faq.id} className="border border-slate-200 rounded-sm bg-white overflow-hidden shadow-sm transition-all">
                        <button 
                            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-5">
                                <span className="text-[10px] font-mono font-bold text-primary bg-blue-50 px-2 py-1 rounded-sm">
                                    0{index + 1}
                                </span>
                                <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                                    {faq.question}
                                </span>
                            </div>
                            <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`}>
                                keyboard_arrow_down
                            </span>
                        </button>

                        {openId === faq.id && (
                            <div className="px-5 pb-6 pt-2 border-t border-slate-50 animation-slide-down">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                    <div className="md:col-span-3">
                                        <p className="text-slate-600 text-[13px] leading-relaxed mb-4">
                                            {faq.answer}
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-sm uppercase">Logistics</span>
                                            <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-sm uppercase">Safety</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 border-l-2 border-slate-200">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Internal Ref</p>
                                        <p className="text-[10px] font-mono font-bold text-slate-700 uppercase">PR-HAZ-2024-0{faq.id}</p>
                                        
                                        {isAdmin && (
                                            <div className="mt-6 flex gap-2">
                                                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button className="p-1.5 text-slate-400 hover:text-error transition-colors">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Admin Dialog Overlay */}
            {isAdmin && isDialogOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-sm shadow-2xl border border-slate-300 animation-fade-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Define New Protocol</h2>
                            <button onClick={() => setIsDialogOpen(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-600">close</button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Protocol Question</label>
                                <input 
                                    type="text" 
                                    value={formData.question}
                                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                                    className="w-full border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" 
                                    placeholder="Enter subject line..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Resolution/Answer</label>
                                <textarea 
                                    rows={5}
                                    value={formData.answer}
                                    onChange={(e) => setFormData({...formData, answer: e.target.value})}
                                    className="w-full border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" 
                                    placeholder="Provide detailed documentation..."
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                            <button onClick={() => setIsDialogOpen(false)} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800">Discard</button>
                            <button onClick={handleSave} className="bg-primary text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-primary-dim shadow-md">Deploy Protocol</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FaqPage;