/**
 * Settings Page
 * User profile, theme preferences, and organization settings
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Palette,
  Building2,
  Info,
  Save,
  Camera,
  Mail,
  Phone,
  Calendar,
  Shield,
  Bell,
  Sun,
  Moon,
  Monitor,
  Check,
  Users,
  Crown,
  Eye,
  ExternalLink,
  FileText,
  HelpCircle,
  Heart,
} from 'lucide-react';
import { Toggle } from '../../components/ui/inputs/Toggle';
import {
  mockUserProfile,
  mockUserPreferences,
  mockOrganization,
  mockTeamMembers,
  appInfo,
  themeOptions,
  accentColorOptions,
  densityOptions,
} from '../../mocks/settings';

type SettingsTab = 'profile' | 'appearance' | 'organization' | 'about';

const tabConfig = [
  { id: 'profile' as const, label: 'Profile', icon: User },
  { id: 'appearance' as const, label: 'Appearance', icon: Palette },
  { id: 'organization' as const, label: 'Organization', icon: Building2 },
  { id: 'about' as const, label: 'About', icon: Info },
];

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Crown size={14} className="text-warning" />,
  consultant: <Shield size={14} className="text-primary" />,
  viewer: <Eye size={14} className="text-text-muted" />,
};

const themeIcons: Record<string, React.ReactNode> = {
  light: <Sun size={18} />,
  dark: <Moon size={18} />,
  system: <Monitor size={18} />,
};

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [hasChanges, setHasChanges] = useState(false);

  // Local state for settings (mock)
  const [theme, setTheme] = useState(mockUserPreferences.theme);
  const [accentColor, setAccentColor] = useState(mockUserPreferences.accentColor);
  const [density, setDensity] = useState(mockUserPreferences.displayDensity);
  const [notifications, setNotifications] = useState(mockUserPreferences.notifications);

  const handleThemeChange = (newTheme: typeof theme) => {
    setTheme(newTheme);
    setHasChanges(true);
    // In a real app, this would update the theme context
    document.documentElement.setAttribute('data-theme', newTheme === 'system' ? 'light' : newTheme);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Mock save - would persist to backend
    setHasChanges(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Profile Header */}
            <div className="card-float p-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {mockUserProfile.firstName[0]}{mockUserProfile.lastName[0]}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface border border-glass-border shadow-float flex items-center justify-center text-text-secondary hover:text-primary hover:bg-white transition-all">
                    <Camera size={14} />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary">
                    {mockUserProfile.firstName} {mockUserProfile.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {roleIcons[mockUserProfile.role]}
                    <span className="text-sm text-text-secondary capitalize">{mockUserProfile.role}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} />
                      {mockUserProfile.email}
                    </span>
                    {mockUserProfile.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} />
                        {mockUserProfile.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="card-float p-6">
              <h4 className="text-base font-semibold text-text-primary mb-4">Profile Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-text-muted uppercase tracking-wider">Department</label>
                  <p className="text-sm text-text-primary">{mockUserProfile.department || 'Not set'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-text-muted uppercase tracking-wider">Joined</label>
                  <p className="text-sm text-text-primary flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(mockUserProfile.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="card-float p-6">
              <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Bell size={18} />
                Notification Preferences
              </h4>
              <div className="space-y-4">
                <Toggle
                  label="Email Notifications"
                  description="Receive updates via email"
                  checked={notifications.email}
                  onCheckedChange={() => handleNotificationChange('email')}
                />
                <Toggle
                  label="Desktop Notifications"
                  description="Show desktop alerts"
                  checked={notifications.desktop}
                  onCheckedChange={() => handleNotificationChange('desktop')}
                />
                <Toggle
                  label="Calculation Complete"
                  description="Alert when calculations finish"
                  checked={notifications.calculationComplete}
                  onCheckedChange={() => handleNotificationChange('calculationComplete')}
                />
                <Toggle
                  label="Layout Validation"
                  description="Alert on layout validation results"
                  checked={notifications.layoutValidation}
                  onCheckedChange={() => handleNotificationChange('layoutValidation')}
                />
              </div>
            </div>
          </motion.div>
        );

      case 'appearance':
        return (
          <motion.div
            key="appearance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Theme Selection */}
            <div className="card-float p-6">
              <h4 className="text-base font-semibold text-text-primary mb-4">Theme</h4>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value as typeof theme)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${theme === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-glass-border hover:border-primary/50 bg-glass'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === option.value ? 'bg-primary text-white' : 'bg-surface text-text-secondary'
                      }`}>
                      {themeIcons[option.value]}
                    </div>
                    <span className="text-sm font-medium text-text-primary">{option.label}</span>
                    {theme === option.value && (
                      <Check size={16} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="card-float p-6">
              <h4 className="text-base font-semibold text-text-primary mb-4">Accent Color</h4>
              <div className="flex flex-wrap gap-3">
                {accentColorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      setAccentColor(color.value);
                      setHasChanges(true);
                    }}
                    className={`w-10 h-10 rounded-xl transition-all ${accentColor === color.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                      }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  >
                    {accentColor === color.value && (
                      <Check size={16} className="text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Density */}
            <div className="card-float p-6">
              <h4 className="text-base font-semibold text-text-primary mb-4">Display Density</h4>
              <div className="space-y-2">
                {densityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDensity(option.value as typeof density);
                      setHasChanges(true);
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${density === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-glass-border hover:border-primary/50 bg-glass'
                      }`}
                  >
                    <div>
                      <span className="text-sm font-medium text-text-primary">{option.label}</span>
                      <p className="text-xs text-text-muted mt-0.5">{option.description}</p>
                    </div>
                    {density === option.value && (
                      <Check size={18} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'organization':
        return (
          <motion.div
            key="organization"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Organization Info */}
            <div className="card-float p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {mockOrganization.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary">{mockOrganization.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">{mockOrganization.industry}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium uppercase">
                      {mockOrganization.plan}
                    </span>
                    <span className="text-xs text-text-muted">{mockOrganization.size}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="card-float p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-text-primary flex items-center gap-2">
                  <Users size={18} />
                  Team Members
                </h4>
                <span className="text-xs text-text-muted">{mockTeamMembers.length} members</span>
              </div>
              <div className="space-y-3">
                {mockTeamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-3 rounded-xl bg-glass border border-glass-border flex items-center justify-between ${member.status === 'inactive' ? 'opacity-50' : ''
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-medium text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{member.name}</p>
                        <p className="text-xs text-text-muted">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        {roleIcons[member.role]}
                        <span className="capitalize">{member.role}</span>
                      </span>
                      <span className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-success' :
                        member.status === 'invited' ? 'bg-warning' : 'bg-text-muted'
                        }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'about':
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* App Info */}
            <div className="card-float p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg">
                <span className="text-2xl font-bold">A</span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary">{appInfo.name}</h3>
              <p className="text-sm text-text-secondary mt-1 italic">{appInfo.tagline}</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-text-muted">
                <span>v{appInfo.version}</span>
                <span>•</span>
                <span>Build {appInfo.buildNumber}</span>
              </div>
            </div>

            {/* Links */}
            <div className="card-float p-6">
              <h4 className="text-base font-semibold text-text-primary mb-4">Resources</h4>
              <div className="space-y-2">
                {[
                  { icon: FileText, label: 'Documentation', href: appInfo.links.documentation },
                  { icon: HelpCircle, label: 'Support', href: appInfo.links.support },
                  { icon: FileText, label: 'Changelog', href: appInfo.links.changelog },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-glass border border-glass-border hover:border-primary/50 transition-all group"
                  >
                    <span className="flex items-center gap-3 text-sm text-text-primary">
                      <link.icon size={18} className="text-text-muted group-hover:text-primary transition-colors" />
                      {link.label}
                    </span>
                    <ExternalLink size={14} className="text-text-muted group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="card-float p-6">
              <h4 className="text-base font-semibold text-text-primary mb-4">Legal</h4>
              <div className="flex gap-4 text-sm">
                <a href={appInfo.links.privacy} className="text-text-secondary hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href={appInfo.links.terms} className="text-text-secondary hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Made with love */}
            <div className="text-center text-xs text-text-muted flex items-center justify-center gap-1">
              Made with <Heart size={12} className="text-error" /> for the apparel industry
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex flex-none items-center justify-between mb-6 px-1">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Settings</h2>
          <span className="text-xs text-text-muted mt-1 font-medium">
            Manage your profile, appearance, and preferences
          </span>
        </div>

        {/* Save Button */}
        <AnimatePresence>
          {hasChanges && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-hover shadow-glow-primary transition-all"
            >
              <Save size={16} />
              Save Changes
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-56 flex-shrink-0">
          <nav className="card-float p-2 space-y-1">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-glass'
                  }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto pr-2">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
