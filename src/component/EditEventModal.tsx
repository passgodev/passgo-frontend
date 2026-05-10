import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useManageEvent from "../hook/useManageEvent";
import { UpdateEventDto } from "../model/event/UpdateEventDto";

interface EditEventModalProps {
    eventId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

const EditEventModal = ({ eventId, onClose, onSuccess }: EditEventModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { getEvent, updateEvent } = useManageEvent();

    useEffect(() => {
        if (eventId == null) return;
        setIsLoading(true);
        getEvent(eventId).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                setName(data.name ?? "");
                setDescription(data.description ?? "");
                setCategory(data.category ?? "");
                setDate(dayjs(data.date).format("YYYY-MM-DDTHH:mm"));
            }
            setIsLoading(false);
        });
    }, [eventId]);

    const handleSubmit = async () => {
        if (eventId == null) return;
        setIsSaving(true);
        const dto: UpdateEventDto = { name, description, category, date };
        const res = await updateEvent(eventId, dto);
        setIsSaving(false);
        if (res.ok) {
            onSuccess();
            onClose();
        }
    };

    if (eventId == null) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-lg mx-4 rounded-sm shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="border-l-4 border-l-[#0053db] pl-4 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-black tracking-tighter text-[#2a3439] uppercase leading-none">Modify Event</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#566166] mt-1">Event Configuration Interface</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors ml-4">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-10 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Querying Data...
                    </div>
                ) : (
                    <div className="p-6 space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Event Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Event Name"
                                className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm font-medium text-[#2a3439] focus:outline-none focus:border-[#0053db] transition-colors"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Description"
                                rows={3}
                                className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm font-medium text-[#2a3439] focus:outline-none focus:border-[#0053db] transition-colors resize-none"
                            />
                        </div>

                        {/* Category + Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    placeholder="Category"
                                    className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm font-medium text-[#2a3439] focus:outline-none focus:border-[#0053db] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm font-medium text-[#2a3439] focus:outline-none focus:border-[#0053db] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="flex-1 bg-[#0053db] text-white py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#0048c1] disabled:opacity-50 transition-colors"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 border border-slate-200 text-slate-600 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditEventModal;