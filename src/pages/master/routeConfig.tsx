import { lazy } from 'react';

import WrapperRouteComponent from '@app/routes/config';
import Loadable from '@components/Loadable';
import CommonLayout from '@layout/CommonLayout';

const Countries = Loadable(lazy(() => import('@pages/master/countries/Countries')));
const States = Loadable(lazy(() => import('@pages/master/states/States')));
const Cities = Loadable(lazy(() => import('@pages/master/cities/Cities')));
const Companys = Loadable(lazy(() => import('@pages/master/./company/sections/Company')));
const Shapes = Loadable(lazy(() => import('@pages/master/shapes/sections/Shapes')));
const Colors = Loadable(lazy(() => import('@pages/master/colors/sections/Colors')));
const Cuts = Loadable(lazy(() => import('@pages/master/cuts/sections/Cuts')));
const Symms = Loadable(lazy(() => import('@pages/master/symms/sections/Symms')));
const Purities = Loadable(lazy(() => import('@pages/master/purities/sections/Purities')));
const Polishs = Loadable(lazy(() => import('@pages/master/polishs/sections/Polishs')));
const Labs = Loadable(lazy(() => import('@pages/master/labs/sections/Labs')));
const Currencies = Loadable(lazy(() => import('@pages/master/currencies/sections/Currencies')));
const Flss = Loadable(lazy(() => import('@pages/master/flss/sections/Flss')));
const Paras = Loadable(lazy(() => import('@pages/master/paras/sections/Paras')));
const Props = Loadable(lazy(() => import('@pages/master/props/sections/Props')));
const Range = Loadable(lazy(() => import('@pages/master/ranges/sections/Ranges')));
const Rapaports = Loadable(lazy(() => import('@pages/master/rapaport/sections/Rapaports')));
const Parties = Loadable(lazy(() => import('@pages/master/party/sections/Party')));
const Kapans = Loadable(lazy(() => import('@pages/master/kapan/sections/Kapan')));
const Emps = Loadable(lazy(() => import('@pages/master/emp/sections/Emp')));
const Appointments = Loadable(
	lazy(() => import('@pages/master/appointments/sections/Appointments'))
);
const Tenders = Loadable(lazy(() => import('@pages/master/tenders/sections/Tenders')));
const TenderLotImport = Loadable(
	lazy(() => import('@pages/master/tenderlotimport/sections/TenderLotImport'))
);
const Nonesaleables = Loadable(
	lazy(() => import('@pages/master/nonesaleables/sections/Nonesaleables'))
);
const PriceCharts = Loadable(lazy(() => import('@pages/master/priceCharts/sections/PriceCharts')));
const ParaRules = Loadable(lazy(() => import('@pages/master/paraRules/sections/ParaRules')));
const TenderLotPlan = Loadable(
	lazy(() => import('@pages/master/tenderlotplan/sections/TenderLotPlan'))
);
const TenderView = Loadable(lazy(() => import('@pages/master/tenderView/sections/TenderLotView')));
const Departments = Loadable(lazy(() => import('@pages/master/departments/sections/Department')));
const Invoice = Loadable(lazy(() => import('@pages/master/invoice/sections/Invoice')));
const PacketCreation = Loadable(
	lazy(() => import('@pages/master/packetcreation/sections/PacketCreation'))
);
const FormToPricing = Loadable(
	lazy(() => import('@pages/master/formtopricing/sections/FormToPricing'))
);

const MasterRoutes = {
	settings: {
		layout: {
			config: {}
		}
	},

	routes: [
		{
			path: '/',
			element: <CommonLayout />,
			children: [
				{
					path: 'country',
					element: <WrapperRouteComponent element={<Countries />} titleId="Country" />
				},
				{
					path: 'state',
					element: <WrapperRouteComponent element={<States />} titleId="State" />
				},
				{
					path: 'city',
					element: <WrapperRouteComponent element={<Cities />} titleId="City" />
				},
				{
					path: 'company',
					element: <WrapperRouteComponent element={<Companys />} titleId="Company" />
				},
				{
					path: 'shape',
					element: <WrapperRouteComponent element={<Shapes />} titleId="Shape" />
				},
				{
					path: 'color',
					element: <WrapperRouteComponent element={<Colors />} titleId="Color" />
				},
				{
					path: 'cut',
					element: <WrapperRouteComponent element={<Cuts />} titleId="Cut" />
				},
				{
					path: 'symm',
					element: <WrapperRouteComponent element={<Symms />} titleId="Symm" />
				},
				{
					path: 'purity',
					element: <WrapperRouteComponent element={<Purities />} titleId="Purity" />
				},
				{
					path: 'polish',
					element: <WrapperRouteComponent element={<Polishs />} titleId="Polish" />
				},
				{
					path: 'lab',
					element: <WrapperRouteComponent element={<Labs />} titleId="Lab" />
				},
				{
					path: 'fls',
					element: <WrapperRouteComponent element={<Flss />} titleId="fls" />
				},
				{
					path: 'currency',
					element: <WrapperRouteComponent element={<Currencies />} titleId="Currency" />
				},
				{
					path: 'para',
					element: <WrapperRouteComponent element={<Paras />} titleId="Para" />
				},
				{
					path: 'prop',
					element: <WrapperRouteComponent element={<Props />} titleId="Prop" />
				},
				{
					path: 'range',
					element: <WrapperRouteComponent element={<Range />} titleId="Ranges" />
				},
				{
					path: 'rapaport',
					element: <WrapperRouteComponent element={<Rapaports />} titleId="Rapaport" />
				},
				{
					path: 'party',
					element: <WrapperRouteComponent element={<Parties />} titleId="Party" />
				},
				{
					path: 'employee',
					element: <WrapperRouteComponent element={<Emps />} titleId="employee" />
				},
				{
					path: 'tender',
					element: <WrapperRouteComponent element={<Tenders />} titleId="tender" />
				},
				{
					path: 'appointment',
					element: (
						<WrapperRouteComponent element={<Appointments />} titleId="appointment" />
					)
				},
				{
					path: 'tenderlotimport',
					element: (
						<WrapperRouteComponent
							element={<TenderLotImport />}
							titleId="tenderlotimport"
						/>
					)
				},
				{
					path: 'nonesaleables',
					element: (
						<WrapperRouteComponent
							element={<Nonesaleables />}
							titleId="nonesaleables"
						/>
					)
				},
				{
					path: 'pricechart',
					element: (
						<WrapperRouteComponent element={<PriceCharts />} titleId="price chart" />
					)
				},
				{
					path: 'pararule',
					element: <WrapperRouteComponent element={<ParaRules />} titleId="para rule" />
				},
				{
					path: 'tenderlotplan',
					element: (
						<WrapperRouteComponent
							element={<TenderLotPlan />}
							titleId="tender lot plan"
						/>
					)
				},
				{
					path: 'department',
					element: (
						<WrapperRouteComponent element={<Departments />} titleId="department" />
					)
				},
				{
					path: 'invoice',
					element: <WrapperRouteComponent element={<Invoice />} titleId="invoice" />
				},
				{
					path: 'kapan',
					element: <WrapperRouteComponent element={<Kapans />} titleId="kapan" />
				},
				{
					path: 'tenderlotview',
					element: (
						<WrapperRouteComponent element={<TenderView />} titleId="tenderlotview" />
					)
				},
				{
					path: 'packetcreation',
					element: (
						<WrapperRouteComponent
							element={<PacketCreation />}
							titleId="packet creation"
						/>
					)
				},
				{
					path: 'fromtopricing',
					element: (
						<WrapperRouteComponent
							element={<FormToPricing />}
							titleId="form to pricing"
						/>
					)
				}
			]
		}
	]
};

export default MasterRoutes;
