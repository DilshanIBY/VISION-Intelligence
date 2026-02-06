/**
 * Settings Mock Data
 * Mock data for Settings & Profile page - Phase 3 UI prototype
 */

// =====================================================
// User Profile
// =====================================================

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'consultant' | 'viewer';
    avatar?: string;
    phone?: string;
    department?: string;
    joinedDate: string;
}

export const mockUserProfile: UserProfile = {
    id: 'user-001',
    firstName: 'John',
    lastName: 'Anderson',
    email: 'john.anderson@apparelconsult.com',
    role: 'consultant',
    phone: '+1 (555) 123-4567',
    department: 'Strategic Consulting',
    joinedDate: '2024-06-15',
};

// =====================================================
// User Preferences
// =====================================================

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    displayDensity: 'compact' | 'comfortable' | 'spacious';
    notifications: {
        email: boolean;
        desktop: boolean;
        calculationComplete: boolean;
        layoutValidation: boolean;
    };
    defaults: {
        workingHours: number;
        defaultEfficiency: number;
        defaultCurrency: string;
    };
}

export const mockUserPreferences: UserPreferences = {
    theme: 'system',
    accentColor: '#1E40AF',
    displayDensity: 'comfortable',
    notifications: {
        email: true,
        desktop: true,
        calculationComplete: true,
        layoutValidation: false,
    },
    defaults: {
        workingHours: 8,
        defaultEfficiency: 85,
        defaultCurrency: 'USD',
    },
};

// =====================================================
// Organization
// =====================================================

export interface Organization {
    id: string;
    name: string;
    logo?: string;
    industry: string;
    size: string;
    plan: 'free' | 'pro' | 'enterprise';
    createdAt: string;
}

export const mockOrganization: Organization = {
    id: 'org-001',
    name: 'Apparel Consulting Partners',
    industry: 'Apparel & Textile Consulting',
    size: '11-50 employees',
    plan: 'pro',
    createdAt: '2024-01-10',
};

// =====================================================
// Team Members
// =====================================================

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'consultant' | 'viewer';
    status: 'active' | 'invited' | 'inactive';
    avatar?: string;
    lastActive?: string;
}

export const mockTeamMembers: TeamMember[] = [
    {
        id: 'member-1',
        name: 'John Anderson',
        email: 'john.anderson@apparelconsult.com',
        role: 'admin',
        status: 'active',
        lastActive: '2 minutes ago',
    },
    {
        id: 'member-2',
        name: 'Sarah Chen',
        email: 'sarah.chen@apparelconsult.com',
        role: 'consultant',
        status: 'active',
        lastActive: '1 hour ago',
    },
    {
        id: 'member-3',
        name: 'Michael Roberts',
        email: 'michael.r@apparelconsult.com',
        role: 'consultant',
        status: 'active',
        lastActive: '3 hours ago',
    },
    {
        id: 'member-4',
        name: 'Emily Watson',
        email: 'emily.w@apparelconsult.com',
        role: 'viewer',
        status: 'invited',
    },
    {
        id: 'member-5',
        name: 'David Park',
        email: 'david.park@apparelconsult.com',
        role: 'consultant',
        status: 'inactive',
        lastActive: '2 weeks ago',
    },
];

// =====================================================
// App Info
// =====================================================

export const appInfo = {
    name: 'APPAREL',
    tagline: 'Where Apparel Intelligence Meets Elegant Design',
    version: '1.0.0-beta',
    buildNumber: '2026.02.06',
    releaseDate: '2026-02-03',
    environment: 'development',
    links: {
        documentation: 'https://docs.apparel.app',
        support: 'https://support.apparel.app',
        changelog: 'https://apparel.app/changelog',
        privacy: 'https://apparel.app/privacy',
        terms: 'https://apparel.app/terms',
    },
};

// =====================================================
// Theme Options
// =====================================================

export const themeOptions = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'system', label: 'System', icon: 'monitor' },
];

export const accentColorOptions = [
    { value: '#1E40AF', label: 'Deep Blue', name: 'blue' },
    { value: '#0D9488', label: 'Teal', name: 'teal' },
    { value: '#7C3AED', label: 'Purple', name: 'purple' },
    { value: '#DC2626', label: 'Red', name: 'red' },
    { value: '#059669', label: 'Emerald', name: 'emerald' },
    { value: '#EA580C', label: 'Orange', name: 'orange' },
];

export const densityOptions = [
    { value: 'compact', label: 'Compact', description: 'More content, less spacing' },
    { value: 'comfortable', label: 'Comfortable', description: 'Balanced spacing (default)' },
    { value: 'spacious', label: 'Spacious', description: 'More breathing room' },
];
