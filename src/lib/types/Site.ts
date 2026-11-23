export interface SiteFooterLink {
	label: string;
	href_key: string; // clave en PersonalInfo (website, behance, github, linkedin, whatsapp, email, maps)
	icon: string;
	accent?: boolean;
	mailto?: boolean;
}

export interface SiteFooterSection {
	title: string;
	links: SiteFooterLink[];
}

export interface SiteFooterSections {
	links: SiteFooterSection;
	contact: SiteFooterSection;
}

export interface SiteFooter {
	bio: string;
	sections: SiteFooterSections;
}

export interface SiteNav {
	theme_toggle_aria: string;
	lang_toggle_aria: string;
}

export interface SiteMeta {
	tagline: string;
	description: string;
}

export interface SiteData {
	meta: SiteMeta;
	nav: SiteNav;
	footer: SiteFooter;
}
