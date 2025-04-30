import React, { useState, useEffect } from 'react';
import AuthModal from '../../AuthModal/AuthModal';
import SearchDropdown from '../../SearchDropdown/SearchDropdown';
import NavBar from '../../NavBar/NavBar';

const userApiUrl = process.env.REACT_APP_USER_API_URL;

//Static navigation bar items
const navItems = [
  { icon: '/home_icon.png', label: 'Home', href: '/' },
  { icon: '/email_icon.png', label: 'Contact', href: 'mailto:rafic.george.haddad@gmail.com', external: true },
  { icon: '/ressources_icon.png', label: 'Ressources', href: '/ressources' },
  { icon: '/github_icon.png', label: 'GitHub', href: 'https://github.com/haddad-github/coptic-scribe', external: true },
  { icon: '/text_icon.png', label: 'Coptic Text', href: '#', comingSoon: true },
];

//Props expected by Header component (auth state, user info, and bookmark handlers)
interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  setToken: (token: string | null) => void;
  setUserEmail: (email: string | null) => void;
  userEmail: string | null;
  token: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedBookmark: (bookmark: any) => void;
}

const Header: React.FC<HeaderProps> = ({isLoggedIn, setIsLoggedIn, setToken, setUserEmail, userEmail, token, setSelectedBookmark}) => {
  //Auth and modal states
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  //Temporary success message after logout
  const [logoutSuccessMsg, setLogoutSuccessMsg] = useState<string | null>(null);

  //Bookmarks and dropdown state
  const [showBookmarksDropdown, setShowBookmarksDropdown] = useState(false);
  const [bookmarks, setBookmarks] = useState<{ id: number; name: string }[]>([]);

  //Handle logout (clears auth state and localStorage)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUserEmail(null);

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');

    setLogoutSuccessMsg('Successfully logged out.');

    setTimeout(() => {
      setLogoutSuccessMsg(null);
    }, 1500);
  };

  //Fetch bookmarks when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${userApiUrl}/bookmarks/user/${userEmail}`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          setBookmarks(data);
        })
        .catch(err => console.error('Failed to load bookmarks', err));
    } else {
      setBookmarks([]);
    }
  }, [isLoggedIn, userEmail]);

  //Handle bookmark updates and refresh via global events
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdate = (e: any) => {
      setSelectedBookmark(e.detail);
    };

    const handleRefreshBookmarks = () => {
      if (isLoggedIn && userEmail) {
        fetch(`${userApiUrl}/bookmarks/user/${userEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            setBookmarks(data);
          })
          .catch(err => console.error('Refresh failed', err));
      }
    };

    window.addEventListener('updateSelectedBookmark', handleUpdate);
    window.addEventListener('refreshBookmarks', handleRefreshBookmarks);
    return () => {
      window.removeEventListener('updateSelectedBookmark', handleUpdate);
      window.removeEventListener('refreshBookmarks', handleRefreshBookmarks);
    };
  }, [isLoggedIn, userEmail]);

  return (
    <>
      <header className="flex flex-col items-center justify-center pt-2 pb-0 bg-custom-red_2 relative">

        {/* Top-center: Logo */}
        <div className="mb-1 flex items-center justify-center w-32 h-32 bg-custom-red rounded-t-full rounded-b-none overflow-hidden">
          <img src="/main_logo.png" alt="Main Logo" className="w-28 h-auto object-cover translate-y-2" />
        </div>

        {/* Top-left: static links */}
        <div className="absolute top-4 left-4 sm:top-9 sm:left-12 flex flex-col gap-3 items-start">
          <a
            href="/changelogs"
            className="text-custom-red text-base font-semibold hover:underline flex items-center gap-2"
          >
            <img src="/history_icon.png" alt="Changes" className="w-7 h-7" />
            <span>Change Logs</span>
          </a>
          <a
            href="/upcoming"
            className="text-custom-red text-base font-semibold hover:underline flex items-center gap-2"
          >
            <img src="/future_icon.png" alt="upcoming" className="w-7 h-7" />
            <span>Upcoming</span>
          </a>
        </div>

        {/* Site title */}
        <h1 className="text-3xl font-bold text-center text-custom-red">Coptic Scribe</h1>

        {/* Subtitle line */}
        <p className="text-center text-sm pt-4 pb-2 text-custom-red font-bold">
          Transliteration&nbsp;✠&nbsp;Translation&nbsp;✠&nbsp;Bible search
        </p>

        {/* Horizontal nav bar */}
        <NavBar items={navItems} />

        {/* Top-right: auth and bookmark buttons */}
        <div className="absolute top-4 right-4 sm:top-9 sm:right-12 flex flex-col sm:flex-row gap-2 sm:gap-3 items-end sm:items-center">
        {isLoggedIn ? (
          <>
            {/* Bookmarks toggle */}
            <button
              onClick={() => setShowBookmarksDropdown(prev => !prev)}
              className="bg-yellow-800 hover:bg-yellow-700 text-white font-semibold px-5 py-2 rounded-full shadow transition"
            >
              Bookmarks
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-800 text-white font-semibold px-5 py-2 rounded-full shadow transition"
            >
              Logout
            </button>

            {/* Bookmarks dropdown with rename/delete/select */}
            {showBookmarksDropdown && (
              <SearchDropdown
                bookmarks={bookmarks}
                onSelect={(bookmark) => {
                  setShowBookmarksDropdown(false);
                  setSelectedBookmark(bookmark);
                }}
                onRename={(id, newName) => {
                  fetch(`${userApiUrl}/bookmarks/rename/${id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name: newName }),
                  })
                    .then(() => {
                      setBookmarks(prev =>
                        prev.map(b => b.id === id ? { ...b, name: newName } : b)
                      );
                    });
                }}
                onDelete={(id) => {
                  fetch(`${userApiUrl}/bookmarks/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  })
                    .then(() => {
                      setBookmarks(prev => prev.filter(b => b.id !== id));
                    });
                }}
                onClose={() => setShowBookmarksDropdown(false)}
              />
            )}


          </>
          ) : (
            <>
              {/* Login button */}
              <button
                onClick={() => setShowLogin(true)}
                className="bg-custom-red hover:bg-red-800 text-white font-semibold px-5 py-2 rounded-full shadow transition"
              >
                Login
              </button>

              {/* Sign up button */}
              <button
                onClick={() => setShowSignUp(true)}
                className="bg-[#8A4F38] hover:bg-[#623928] text-white font-medium px-5 py-2 rounded-full shadow transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Bottom divider */}
        <hr className="w-full border-t-2 border-black-900 mt-2" />
      </header>

      {/* Display logout confirmation if triggered */}
      {logoutSuccessMsg && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded shadow-lg text-lg font-medium animate-fade-in-out">
            {logoutSuccessMsg}
          </div>
        </div>
      )}

      {/* Auth Modal for login/signup */}
      {(showLogin || showSignUp) && (
        <AuthModal
        mode={showSignUp ? 'signup' : 'login'}
        onClose={() => {
          setShowLogin(false);
          setShowSignUp(false);
        }}
        onSubmit={async (email, password) => {
          try {
            if (showSignUp) {
              const res = await fetch(`${userApiUrl}/users/sign_up`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
              });

              if (!res.ok) {
                const msg = await res.text();
                return msg || 'Sign up failed.';
              }

              //Auto-login after sign up
              const loginRes = await fetch(`${userApiUrl}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
              });

              if (!loginRes.ok) {
                return 'Sign up succeeded, but login failed.';
              }

              const data = await loginRes.json();
              setIsLoggedIn(true);
              setToken(data.token);
              setUserEmail(email);

              localStorage.setItem('token', data.token);
              localStorage.setItem('userEmail', email);

              //do not close modal here
              return null;
            } else {
              //Regular login
              const res = await fetch(`${userApiUrl}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
              });

              if (!res.ok) {
                const msg = await res.text();
                return msg || 'Invalid email or password.';
              }

              const data = await res.json();
              setIsLoggedIn(true);
              setToken(data.token);
              setUserEmail(email);

              localStorage.setItem('token', data.token);
              localStorage.setItem('userEmail', email);

              //do not close modal here
              return null;
            }
          } catch (err) {
            console.error('Login error:', err);
            return 'Something went wrong.';
          }
        }}
      />
      )}
    </>
  );
};

export default Header;
