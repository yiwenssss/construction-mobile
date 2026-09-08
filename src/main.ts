import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'

const vuetify = createVuetify({
	components,
	directives,
	theme: {
		defaultTheme: 'siteSafety',
		themes: {
			siteSafety: {
				dark: false,
				colors: {
					primary: '#d97706',
					secondary: '#155e75',
					surface: '#fffdf8',
					background: '#f5f1e8',
				},
			},
		},
	},
	icons: {
		defaultSet: 'mdi',
	},
})

createApp(App).use(vuetify).mount('#app')
