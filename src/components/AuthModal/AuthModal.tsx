import React, { useState } from 'react';

//Enum-like type representing the three modal modes
type AuthMode = 'login' | 'signup' | 'reset';

//Props for the AuthModal component
interface AuthModalProps {
  mode: AuthMode;
  onSubmit: (email: string, password?: string, confirmPassword?: string) => Promise<string | null>;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onSubmit, onClose }) => {
  //Controlled input states for email, password, and confirm password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //Tracks current view mode (login/signup/reset)
  const [modeState, setModeState] = useState<AuthMode>(mode);

  //Used to display feedback to the user
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  //Display titles for each auth mode
  const titleMap: Record<AuthMode, string> = {
    login: 'Login',
    signup: 'Sign Up',
    reset: 'Password Reset'
  };

  //Validates form and submits data to the parent-provided handler
  const handleSubmit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    //Prevent submission if passwords don't match in signup mode
    if (modeState === 'signup' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    // Call the provided onSubmit function with user credentials
    const error = await onSubmit(email, password, confirmPassword);

    //If there's an error, show it; otherwise show a success message
    if (error) {
      setErrorMsg(error);
    } else {
      //Show success message for both login and signup
      const msg =
        modeState === 'login'
          ? 'Successfully signed in.'
          : 'Account created and signed in.';

      setSuccessMsg(msg);

      //Close the modal after a short delay so user can read the message
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-80 relative">

        {/* Header section with logo and title */}
        <div className="flex items-center justify-center mb-4">
          <img src="/main_logo.png" alt="icon" className="w-8 h-8 mr-2" />
          <h2 className="text-xl font-bold text-custom-red">{titleMap[modeState]}</h2>
        </div>

        {/* Form inputs (hidden if success message is shown) */}
        {!successMsg && (
          <>
            {/* Email field (shown for all modes) */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none"
            />

            {/* Password field (not shown in reset mode) */}
            {modeState !== 'reset' && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none"
              />
            )}

            {/* Confirm password field (shown only in signup mode) */}
            {modeState === 'signup' && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none"
              />
            )}

            {/* "Forgot password?" link (shown only in login mode) */}
            {modeState === 'login' && (
              <p
                className="text-sm text-blue-600 hover:underline mb-3 cursor-pointer"
                onClick={() => {
                  setModeState('reset');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
              >
                Forgot password?
              </p>
            )}
          </>
        )}

        {/* Feedback message area (either error or success) */}
        {errorMsg && <p className="text-red-600 text-sm font-medium mb-3">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm font-medium mb-3">{successMsg}</p>}

        {/* Action buttons (hidden if success message is shown) */}
        {!successMsg && (
          <div className="flex justify-between items-center">
            <button onClick={onClose} className="text-gray-600 hover:text-black">Cancel</button>
            <button
              onClick={handleSubmit}
              className="bg-custom-red text-white px-4 py-1 rounded hover:bg-red-800 transition"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
