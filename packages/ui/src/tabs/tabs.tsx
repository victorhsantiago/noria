'use client';

import {
	Tabs as RACTabs,
	TabList as RACTabList,
	Tab as RACTab,
	TabPanel as RACTabPanel,
	TabsProps,
	TabListProps,
	TabProps,
	TabPanelProps,
} from 'react-aria-components';
import './tabs.css';

export const Tabs = (props: TabsProps) => {
	return <RACTabs {...props} className={props.className || 'noria-Tabs'} />;
};

export const TabList = <T extends object>(props: TabListProps<T>) => {
	return <RACTabList {...props} className={props.className || 'noria-TabList'} />;
};

export const Tab = (props: TabProps) => {
	return <RACTab {...props} className={props.className || 'noria-Tab'} />;
};

export const TabPanel = (props: TabPanelProps) => {
	return <RACTabPanel {...props} className={props.className || 'noria-TabPanel'} />;
};
