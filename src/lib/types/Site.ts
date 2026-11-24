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
	main_aria: string;
	skip_to_content: string;
	theme_toggle_aria: string;
	lang_toggle_aria: string;
}

export interface SiteHome {
	topbar: string;
	eyebrow: string;
	explore_title: string;
	skills_label: string;
	skills_text: string;
	experience_label: string;
	experience_text: string;
	contact_title: string;
	email_label: string;
	linkedin_label: string;
	education_title: string;
}

export interface SiteMeta {
	tagline: string;
	description: string;
}

export interface SiteData {
	meta: SiteMeta;
	nav: SiteNav;
	home: SiteHome;
	footer: SiteFooter;
}
