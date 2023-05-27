// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Vuetify
import { createVuetify } from 'vuetify';
import { VDataTable } from 'vuetify/lib/labs/components.mjs';

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

  components: {
    VDataTable,
  },
});
