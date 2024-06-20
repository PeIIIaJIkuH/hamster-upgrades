import { FirebaseApp } from 'firebase/app';
import { User, getAuth, signInAnonymously } from 'firebase/auth';
import { createStore, produce } from 'solid-js/store';

type AuthState = {
	user: User | null;
	error: Error | null;
	loading: boolean;
};

export const useAuth = (app: FirebaseApp) => {
	const [authState, setAuthState] = createStore<AuthState>({
		user: null,
		error: null,
		loading: true,
	});
	const auth = getAuth(app);

	auth.onAuthStateChanged(
		(user) => {
			if (user) {
				setAuthState(
					produce((state) => {
						state.user = user;
						state.loading = false;
					}),
				);
			}
		},
		(error) => {
			if (error) {
				setAuthState(
					produce((state) => {
						state.error = error;
						state.loading = false;
					}),
				);
			}
		},
		() => {
			setAuthState(
				produce((state) => {
					state.loading = false;
				}),
			);
		},
	);

	signInAnonymously(auth).then((data) => {
		setAuthState(
			produce((state) => {
				state.user = data.user;
			}),
		);
	});

	return authState;
};
