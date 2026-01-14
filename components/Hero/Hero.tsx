import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { PortfolioPage, PortfolioPageProps } from '../ui/starfall-portfolio-landing';
import { usePortfolioData } from '../../utils/usePortfolioData';

const Hero = () => {
    const { t, i18n } = useTranslation('common');
    const [mounted, setMounted] = useState(false);
    const { projects } = usePortfolioData();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Get current language for project descriptions
    const currentLanguage = i18n.language;

    // Map projects to starfall format
    const mappedProjects = projects.slice(0, 3).map(project => ({
        title: project.title,
        description: currentLanguage === 'es' 
            ? project.descriptionEs || project.descriptionEn || '' 
            : currentLanguage === 'en' 
            ? project.descriptionEn || project.descriptionEs || ''
            : project.descriptionKr || project.descriptionEn || '',
        tags: project.techStack ? project.techStack.split(',').map(t => t.trim()).filter(Boolean).slice(0, 3) : [],
        imageContent: project.img ? (
            <img 
                src={project.img} 
                alt={project.title}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800';
                }}
            />
        ) : (
            <div className="text-2xl text-white/50">📁</div>
        )
    }));

    // Prepare portfolio props
    const portfolioProps: PortfolioPageProps = {
        logo: {
            initials: 'JIG',
            name: 'Jorge Ignacio Garay',
        },
        navLinks: [
            { label: t('about'), href: '#about' },
            { label: t('portfolio'), href: '#portafolio' },
            { label: t('skills'), href: '#skills' },
        ],
        resume: {
            label: 'Resume',
            onClick: () => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            },
        },
        hero: {
            titleLine1: t('greeting'),
            titleLine2Gradient: t('role'),
            subtitle: t('about_text'),
        },
        ctaButtons: {
            primary: {
                label: 'View My Work',
                onClick: () => {
                    const projectsSection = document.getElementById('portafolio');
                    if (projectsSection) {
                        projectsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                },
            },
            secondary: {
                label: t('contact'),
                onClick: () => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                },
            },
        },
        projects: mappedProjects.length > 0 ? mappedProjects : [
            {
                title: 'Sample Project',
                description: 'A sample project to showcase my work',
                tags: ['React', 'TypeScript'],
                imageContent: <div className="text-2xl text-white/50">🚀</div>
            }
        ],
        stats: [
            { value: '4+', label: 'Years Experience' },
            { value: '20+', label: 'Projects Completed' },
            { value: '100%', label: 'Client Satisfaction' },
        ],
        showAnimatedBackground: true,
        heroOnly: true, // Only show hero section, not projects/stats
        showNavigation: false, // Hide navigation since Layout already has Navbar
    };

    return (
        <div className="relative min-h-screen">
            <PortfolioPage {...portfolioProps} />
        </div>
    );
};

export default Hero;
