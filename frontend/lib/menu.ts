import {ICategory} from 'boundless-api-client';
import {getCategoryUrl} from './urls';
import {getCategoryImg} from './imgs';
import {IMenuItem} from '../@types/components';

export const makeMenuByCategoryTree = ({categoryTree, isActiveClb}: {categoryTree: ICategory[], isActiveClb?: (category: ICategory) => boolean}): IMenuItem[] => {
	const menu = categoryTree.map(category => {
		const item: IMenuItem = {
			title: category.title,
			url: getCategoryUrl(category),
		};

		if (isActiveClb) {
			item.isActive = isActiveClb(category);
		}

		if (category.children) {
			item.children = makeMenuByCategoryTree({categoryTree: category.children, isActiveClb});
			if (item.children.some(el => el.isActive)) {
				item.isActive = true;
			}
		}

		if (category.image) {
			item.img = getCategoryImg(category.image, 21);
		}

		return item;
	});


	return menu;
};

export const makeAllMenus = ({categoryTree, activeCategoryId}: {categoryTree: ICategory[], activeCategoryId?: number}): IMenus => {
	const mainMenu: IMenuItem[] = [
		{
			title: 'Buyer Dashboard',
			url: '/',
			isActive: activeCategoryId === undefined,  // Make active if no category is active
		}
	];


	// Add static Seller Dashboard link
	mainMenu.push({
		title: 'Seller Dashboard',
		url: '/SellerPage',  // Correct path for the SellerPage component
		isActive: false, // You can manage this based on user authentication if needed
	});

	const footerMenu = makeMenuByCategoryTree({categoryTree: categoryTree.filter(({level}) => level === 0)});

	return {
		mainMenu,
		footerMenu
	};
};

interface IMenus {
	mainMenu: IMenuItem[],
	footerMenu: IMenuItem[]
}