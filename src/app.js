import reazy from 'reazy';
import routerActions from 'reazy-native-router-actions';

import mobx from './services/mobx';

//create a public app constant
const app = reazy();

app.use(mobx(), 'state');
app.use(routerActions(), 'routerActions');

export default app;






