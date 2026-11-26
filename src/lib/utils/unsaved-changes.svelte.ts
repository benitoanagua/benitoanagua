import { beforeNavigate } from '$app/navigation';
import { onMount } from 'svelte';

export const DEFAULT_DISCARD_MESSAGE =
	'Tienes cambios sin guardar. Si sales ahora se descartarán. ¿Quieres continuar?';

export function confirmDiscardChanges(message = DEFAULT_DISCARD_MESSAGE): boolean {
	return window.confirm(message);
}

/**
 * Warns before leaving the page with unsaved edits. SvelteKit's
 * `beforeNavigate` covers client-side navigation, while `beforeunload` covers
 * reloads and hard navigations.
 *
 * Form submissions are allowed through: saving must never be blocked by the
 * discard prompt. Actions reset their own dirty state after a successful save.
 */
export function useUnsavedChangesGuard(
	isDirty: () => boolean,
	message = DEFAULT_DISCARD_MESSAGE
): void {
	beforeNavigate((navigation) => {
		if (!isDirty()) return;
		// Full document unloads are covered by `beforeunload`; prompting here
		// too would show two dialogs for the same action.
		if (navigation.willUnload) return;
		if (!confirmDiscardChanges(message)) navigation.cancel();
	});

	onMount(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (!isDirty()) return;
			event.preventDefault();
			event.returnValue = '';
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	});
}
