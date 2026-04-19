import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberType from '../../model/member/MemberType.ts';
import WEB_ENDPOINTS from '../../util/endpoint/WebEndpoint.ts';
import ClientSignupCredentialComponent from './member/ClientSignupCredentialComponent.tsx';
import OrganizerSignupCredentialComponent from './member/OrganizerSignupCredentialComponent.tsx';

const SignupPage = () => {
    const [activeMemberType, setActiveMemberType] = useState(MemberType.CLIENT);
    const navigate = useNavigate();

    let memberSubmitHandler: () => void;
    const populateSendSubmit = (memberHandleSubmitCallback: () => void) => {
        memberSubmitHandler = memberHandleSubmitCallback;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        memberSubmitHandler();
    };

    const memberCredentialsComponent = (member: MemberType) => {
        switch (member) {
            case MemberType.CLIENT:
                return <ClientSignupCredentialComponent handleSubmit={populateSendSubmit} />;
            case MemberType.ORGANIZER:
                return <OrganizerSignupCredentialComponent handleSubmit={populateSendSubmit} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-black tracking-[0.25em] text-[#0053db] uppercase">Passgo</h1>
                <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase mt-1">Secure Ticketing Platform</p>
            </div>

            <div className="bg-white border border-gray-200 w-full max-w-lg px-10 py-8">
                <h2 className="text-lg font-black uppercase tracking-wider text-gray-800">Create Account</h2>
                <p className="text-xs text-gray-400 mt-1">Initialize administrative credentials</p>

                <div className="mt-6">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                        Account Classification
                    </span>
                    <div className="grid grid-cols-2 border border-gray-200 divide-x divide-gray-200">
                        {Object.keys(MemberType)
                            .filter(key => isNaN(Number(key)))
                            .filter(key => MemberType[key as keyof typeof MemberType] !== MemberType.ADMINISTRATOR)
                            .map((key) => {
                                const memType = MemberType[key as keyof typeof MemberType];
                                const isActive = memType === activeMemberType;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setActiveMemberType(memType)}
                                        className={`py-2.5 text-xs font-bold tracking-[0.15em] uppercase transition-colors ${
                                            isActive
                                                ? 'bg-white text-[#0053db] border-b-2 border-[#0053db]'
                                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                        }`}
                                    >
                                        {key}
                                    </button>
                                );
                            })}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    {memberCredentialsComponent(activeMemberType)}

                    <button
                        type="submit"
                        className="w-full bg-[#0053db] text-white text-xs font-bold tracking-[0.2em] uppercase py-3.5 mt-6 hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        Finalize Registration
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        Already authenticated?{' '}
                        <button
                            onClick={() => navigate(WEB_ENDPOINTS.login)}
                            className="text-[#0053db] font-bold uppercase tracking-wider text-[10px] hover:underline cursor-pointer"
                        >
                            Login to Passgo
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;