import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertContext from '../../../context/AlertProvider.tsx';
import API_ENDPOINTS from '../../../util/endpoint/ApiEndpoint.ts';
import WEB_ENDPOINTS from '../../../util/endpoint/WebEndpoint.ts';
import HttpMethod from '../../../util/HttpMethod.ts';
import logger from '../../../util/logger/Logger.ts';

const fieldLabelClass = 'block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-1.5';
const inputClass = 'w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0053db] focus:outline-none focus:ring-1 focus:ring-[#0053db] bg-white placeholder:text-gray-300 placeholder:text-xs placeholder:uppercase placeholder:tracking-wider';

const ClientSignupCredentialComponent = (props: { handleSubmit: (func: () => void) => void }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { showAlert } = useContext(AlertContext);

    const signupBody = {
        credentials: { login, password, email },
        firstName,
        lastName,
        birthDate,
    };
    logger.log('SignupPage', 'Signup body', signupBody);

    const handleSubmit = async () => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        await fetch(
            `${API_ENDPOINTS.signup}?member=client`,
            { method: HttpMethod.POST, body: JSON.stringify(signupBody), headers }
        ).then((res) => {
            logger.log('SignupPage', 'Client signup response', res);
            if (res.status === 200) {
                logger.log('SignupPage', 'Client signup response - success');
                showAlert(res.statusText, 'info');
                navigate(WEB_ENDPOINTS.login);
            } else {
                const errorMessage = `${res.status} ${res.statusText}`;
                logger.log('SignupPage', 'got status code !== 200', errorMessage);
                showAlert(errorMessage, 'error');
            }
        }).catch((err) => {
            const errorMessage = `Error occured from signup request', ${err}`;
            logger.log('SignupPage', errorMessage);
            showAlert(errorMessage, 'error');
        });
    };

    props.handleSubmit(() => handleSubmit());

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={fieldLabelClass}>First Name</label>
                    <input
                        className={inputClass}
                        type="text"
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label className={fieldLabelClass}>Last Name</label>
                    <input
                        className={inputClass}
                        type="text"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label className={fieldLabelClass}>Date of Birth</label>
                <input
                    className={inputClass}
                    type="date"
                    onChange={(e) => setBirthDate(e.target.value)}
                />
            </div>

            <hr className="border-gray-200 !my-5" />

            <div>
                <label className={fieldLabelClass}>Corporate Email</label>
                <input
                    className={inputClass}
                    type="email"
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <label className={fieldLabelClass}>System Login ID</label>
                <input
                    className={inputClass}
                    type="text"
                    placeholder="Login"
                    onChange={(e) => setLogin(e.target.value)}
                />
            </div>

            <div>
                <label className={fieldLabelClass}>Secure Password</label>
                <div className="relative">
                    <input
                        className={`${inputClass} pr-10`}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientSignupCredentialComponent;