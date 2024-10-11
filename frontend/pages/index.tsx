import {IProduct} from 'boundless-api-client';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import ProductsList from '../components/ProductsList';
import MainLayout from '../layouts/Main';
import {apiClient} from '../lib/api';
import {makeAllMenus} from '../lib/menu';
// import VerticalMenu from '../components/VerticalMenu';
import {IMenuItem} from '../@types/components';
import SwiperSlider from '../components/SwiperSlider';
import cliffImg from '../assets/bann1.jpg';
import cliff2Img from '../assets/bann2.jpg';
// import CoverTextInCenter from '../components/CoverTextInCenter';
// import bgImg from '../assets/cover-bg.jpeg';
// import bgPortraitImg from '../assets/cover-bg-portrait.jpg';
import ProductsSliderByQuery from '../components/ProductsSliderByQuery';
import {IBasicSettings} from '../@types/settings';
import SearchBar from '../components/SearchBar';

export default function IndexPage({products, mainMenu, footerMenu, basicSettings}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<MainLayout mainMenu={mainMenu} footerMenu={footerMenu} basicSettings={basicSettings}>
			<div className='container'>
                <SearchBar />
				<MainPageSlider />
						<h1 className='page-heading page-heading_h1  page-heading_m-h1'>Shopper's Delight</h1>

			</div>
			
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps<IIndexPageProps> = async () => {
	const categoryTree = await apiClient.catalog.getCategoryTree({menu: 'category'});
	const {products} = await apiClient.catalog.getProducts({collection: ['main-page'], sort: 'in_collection'});
	const basicSettings = await apiClient.system.fetchSettings(['system.locale', 'system.currency']) as IBasicSettings;

	const menus = makeAllMenus({categoryTree});

	return {
		props: {
			products,
			basicSettings,
			...menus
		}
	};
};

interface IIndexPageProps {
	products: IProduct[];
	mainMenu: IMenuItem[];
	footerMenu: IMenuItem[];
	basicSettings: IBasicSettings;
}

function MainPageSlider() {
	const slides = [
		{
			'img': cliffImg.src,
			'link': '',
			'caption': 'We live in a digital age where the boundaries of commerce are expanding beyond traditional brick-and-mortar stores.',
			'captionPosition': 'center',
			'useFilling': true,
			'fillingColor': '#000000',
			'fillingOpacity': 0.40
		},
		{
			'img': cliff2Img.src,
			'link': '',
			'caption': 'By harnessing the power of technology and online platforms, businesses can tap into a global marketplace.',
			'captionPosition': null,
			'useFilling': true,
			'fillingColor': '#000000',
			'fillingOpacity': 0.4
		}
	];

	return (
		<SwiperSlider
			showPrevNext
			roundCorners
			pagination='progressbar'
			size={'large'}
			slides={slides}
			className={'mb-4'}
		/>
	);
}