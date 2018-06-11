import { init } from 'sapper/runtime.js';
import { Store } from 'svelte/store.js';
import { routes } from './manifest/client.js';
import App from './App.html';

init({
	target: document.querySelector('#sapper'),
	routes,
	App,
	store: data => {
		// `data` is whatever was in the server-side store
		return new Store(data);
	}
});