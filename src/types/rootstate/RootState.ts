import { authState } from 'store/slice/auth/types';
import { globalState } from 'store/slice/global/types';
import { menuState } from 'store/slice/menu/types';
import { snackBarState } from 'store/slice/snackbar/types';

import { cityState } from '@pages/master/cities/store/slice/types';
import { colorsState } from '@pages/master/colors/store/slice/types';
import { countryState } from '@pages/master/countries/store/slice/types';
import { currenciesState } from '@pages/master/currencies/store/slice/types';
import { cutsState } from '@pages/master/cuts/store/slice/types';
import { flssState } from '@pages/master/flss/store/slice/types';
import { labsState } from '@pages/master/labs/store/slice/types';
import { organisationState } from '@pages/master/organisations/store/slice/types';
import { paraState } from '@pages/master/paras/store/slice/types';
import { polishsState } from '@pages/master/polishs/store/slice/types';
import { propsState } from '@pages/master/props/store/slice/types';
import { puritiesState } from '@pages/master/purities/store/slice/types';
import { rangeState } from '@pages/master/ranges/store/slice/types';
import { rapaportsState } from '@pages/master/rapaport/store/slice/types';
import { shapesState } from '@pages/master/shapes/store/slice/types';
import { stateState } from '@pages/master/states/store/slice/types';
import { symmsState } from '@pages/master/symms/store/slice/types';
import { userState } from '@pages/profile/store/user/slice/types';
import { empsState } from '@pages/master/emp/store/slice/types';
import { tenderState } from '@pages/master/tenders/store/slice/types';
import { partiesState } from '@pages/master/party/store/slice/types';
import { kapansState } from '@pages/master/kapan/store/slice/types';
import { tenderlotimportsState } from '@pages/master/tenderlotimport/store/slice/types';
import { appointmentState } from '@pages/master/appointments/store/slice/types';
import { nonesaleablesState } from '@pages/master/nonesaleables/store/slice/types';
import { priceChartsState } from '@pages/master/priceCharts/store/slice/types';
import { paraRulesState } from '@pages/master/paraRules/store/slice/types';
import { tenderlotplansState } from '@pages/master/tenderlotplan/store/slice/types';
import { tenderviewsState } from '@pages/master/tenderView/store/slice/types';
import { departmentState } from '@pages/master/departments/store/slice/types';
import { packetcreationsState } from '@pages/master/packetcreation/store/slice/types';
import { formtopricingsState } from '@pages/master/formtopricing/store/slice/types';
import { companysState } from '@pages/master/company/store/slice/types';
import { invoicesState } from '@pages/master/invoice/store/slice/types';
// import { invoiceState } from '@pages/transaction/invoices/store/slice/types';

// import { signInState } from '@pages/auth/signIn/slice/types';
// import { userState } from '@store/slice/user/types';

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
  Properties are optional because they are injected when the components are mounted sometime in your application's life. 
  So, not available always
*/
export interface RootState {
	purity: RootState;
	global?: globalState;
	menu?: menuState;
	snackbar?: snackBarState;

	/// *** AUTH ***//
	auth?: authState;

	/// *** MASTER ***//
	organisation?: organisationState;
	country?: countryState;
	state?: stateState;
	city?: cityState;

	/// *** PROFILE ***//
	user?: userState;

	/// *** TRANSACTION ***//
	// invoice?: invoiceState;

	shapes?: shapesState;
	colors?: colorsState;
	cuts?: cutsState;
	symms?: symmsState;
	flss?: flssState;
	// emps?: empsState;
	parties?: partiesState;

	/// *** RANGES ***//
	range?: rangeState;

	/// *** PURITIES ***//
	purities?: puritiesState;

	/// *** POLISH ***//
	polishs?: polishsState;

	/// *** LAB ***//
	labs?: labsState;
	currencies?: currenciesState;
	paras?: paraState;

	props?: propsState;
	rapaports?: rapaportsState;

	/// *** EMPLOYEE ***//
	emps?: empsState;

	// / *** TENDER *** //
	tender?: tenderState;

	// / *** TENDERLOTIMPORT *** //
	tenderlotimports?: tenderlotimportsState;

	// / *** APPOINTMENT *** //
	appointment?: appointmentState;

	// / *** COMPANY *** //
	companys?: companysState;
	priceCharts?: priceChartsState;

	paraRules?: paraRulesState;

	nonesaleables?: nonesaleablesState;
	tenderlotplans?: tenderlotplansState;
	tenderviews?: tenderviewsState;

	// / *** DEPARTMENT *** //
	departments?: departmentState;
	invoices?: invoicesState;
	packetcreations?: packetcreationsState;

	// / *** KAPAN *** //
	kapans?: kapansState;

	// / *** FORM TO PRICING *** //
	formtopricings?: formtopricingsState;

	// [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}

// import { GithubRepoFormState } from 'app/pages/HomePage/Features/GithubRepoForm/slice/types';
// import { ThemeState } from 'styles/theme/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly
