/**
 * Analytics Dashboard Page
 * Presentation-ready analytics with auto-cycle mode for client meetings
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Play,
  Pause,
  Presentation,
  Filter,
  Calendar,
  TrendingUp,
  Clock,
  Target,
  Briefcase,
  Calculator,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Activity,
  PieChart,
} from 'lucide-react';
import {
  analyticsKPIs,
  usageTrendsData,
  usageTrendsDataKeys,
  moduleUsageData,
  moduleUsageDataKeys,
  performanceMetrics,
  recentActivityData,
  monthlySummary,
  monthlySummaryDataKeys,
  insightsHighlights,
  presentationSlides,
} from '../../mocks/analytics';
import { GaugeChart } from '../../components/ui/display/GaugeChart';
import { BarChartComponent } from '../../components/ui/display/BarChart';
import { LineChartComponent } from '../../components/ui/display/LineChart';

// Icon mapping for KPIs
const iconMap: Record<string, React.ReactNode> = {
  calculator: <Calculator size={20} />,
  target: <Target size={20} />,
  clock: <Clock size={20} />,
  briefcase: <Briefcase size={20} />,
};

// Auto-cycle speed options (in seconds)
const CYCLE_SPEEDS = [
  { value: 5000, label: '5s' },
  { value: 10000, label: '10s' },
  { value: 15000, label: '15s' },
];

export function AnalyticsPage() {
  // Presentation mode state
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isAutoCycling, setIsAutoCycling] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [cycleSpeed, setCycleSpeed] = useState(CYCLE_SPEEDS[1].value);
  const [cycleProgress, setCycleProgress] = useState(0);

  // Time range filter
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Auto-cycle effect
  useEffect(() => {
    if (!isPresentationMode || !isAutoCycling) {
      setCycleProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setCycleProgress((prev) => {
        if (prev >= 100) {
          // Move to next slide
          setCurrentSlideIndex((idx) => (idx + 1) % presentationSlides.length);
          return 0;
        }
        return prev + (100 / (cycleSpeed / 100));
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isPresentationMode, isAutoCycling, cycleSpeed]);

  // Escape key to exit presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPresentationMode) {
        setIsPresentationMode(false);
        setIsAutoCycling(false);
      }
      if (isPresentationMode) {
        if (e.key === 'ArrowRight') {
          setCurrentSlideIndex((idx) => (idx + 1) % presentationSlides.length);
          setCycleProgress(0);
        }
        if (e.key === 'ArrowLeft') {
          setCurrentSlideIndex((idx) => (idx - 1 + presentationSlides.length) % presentationSlides.length);
          setCycleProgress(0);
        }
        if (e.key === ' ') {
          e.preventDefault();
          setIsAutoCycling((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode]);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((idx) => (idx + 1) % presentationSlides.length);
    setCycleProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((idx) => (idx - 1 + presentationSlides.length) % presentationSlides.length);
    setCycleProgress(0);
  }, []);

  const currentSlide = useMemo(() => presentationSlides[currentSlideIndex], [currentSlideIndex]);

  // Render presentation slide content
  const renderSlideContent = () => {
    switch (currentSlideIndex) {
      case 0: // Performance Overview
        return (
          <div className="grid grid-cols-2 gap-8 h-full">
            <div className="grid grid-cols-2 gap-4">
              {analyticsKPIs.map((kpi) => (
                <motion.div
                  key={kpi.id}
                  className="card-float p-6 flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {kpi.icon ? iconMap[kpi.icon] || <BarChart3 size={20} /> : <BarChart3 size={20} />}
                    </div>
                    <span className="text-sm text-text-secondary font-medium">{kpi.title}</span>
                  </div>
                  <div>
                    <span className="text-4xl font-bold text-text-primary">
                      {kpi.value.toLocaleString()}{kpi.unit}
                    </span>
                    {kpi.trend && (
                      <div className={`text-sm mt-2 flex items-center gap-1 ${kpi.trend.direction === 'up' ? 'text-success' :
                        kpi.trend.direction === 'down' ? 'text-error' : 'text-text-muted'
                        }`}>
                        <TrendingUp size={14} className={kpi.trend.direction === 'down' ? 'rotate-180' : ''} />
                        {kpi.trend.value}% {kpi.trend.label}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="card-float p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-text-primary mb-4">System Performance</h3>
              <div className="flex-1 flex items-center justify-center gap-8">
                {Object.entries(performanceMetrics).map(([key, metric]) => (
                  <div key={key} className="text-center">
                    <GaugeChart
                      value={typeof metric.value === 'number' && metric.value <= 100 ? metric.value : (metric.value / metric.target) * 100}
                      max={100}
                      size="md"
                      showValue
                    />
                    <p className="text-sm text-text-secondary mt-2">{metric.label}</p>
                    <p className="text-lg font-semibold text-text-primary">{metric.value}{metric.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 1: // Usage Trends
        return (
          <div className="grid grid-cols-2 gap-8 h-full">
            <div className="card-float p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Weekly Usage Trends</h3>
              <div className="flex-1">
                <LineChartComponent data={usageTrendsData} dataKeys={usageTrendsDataKeys} height={280} showLegend={false} />
              </div>
            </div>
            <div className="card-float p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Module Popularity</h3>
              <div className="flex-1">
                <BarChartComponent data={moduleUsageData} dataKeys={moduleUsageDataKeys} height={280} showLegend={false} />
              </div>
            </div>
          </div>
        );
      case 2: // Project Activity
        return (
          <div className="grid grid-cols-2 gap-8 h-full">
            <div className="card-float p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
              <div className="flex-1 space-y-3 overflow-auto">
                {recentActivityData.map((activity) => (
                  <div key={activity.id} className="p-4 rounded-xl bg-glass border border-glass-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-text-primary">{activity.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${activity.status === 'completed' ? 'bg-success/20 text-success' :
                        activity.status === 'in-progress' ? 'bg-primary/20 text-primary' :
                          'bg-glass text-text-muted'
                        }`}>
                        {activity.status}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-glass overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${activity.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-float p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Monthly Summary</h3>
              <div className="flex-1">
                <BarChartComponent data={monthlySummary} dataKeys={monthlySummaryDataKeys} height={280} showLegend={false} />
              </div>
            </div>
          </div>
        );
      case 3: // Key Insights
        return (
          <div className="grid grid-cols-3 gap-6 h-full">
            {insightsHighlights.map((insight) => (
              <motion.div
                key={insight.id}
                className="card-float p-6 flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${insight.type === 'success' ? 'bg-success/20 text-success' :
                  insight.type === 'info' ? 'bg-primary/20 text-primary' :
                    'bg-warning/20 text-warning'
                  }`}>
                  <Sparkles size={24} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{insight.title}</h3>
                <p className="text-sm text-text-secondary flex-1">{insight.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-text-primary">{insight.metric}</span>
                  <span className="text-xs text-text-muted">{insight.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Main dashboard view (non-presentation)
  if (!isPresentationMode) {
    return (
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="flex flex-none items-center justify-between mb-6 px-1">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Usage Analytics</h2>
            <span className="text-xs text-text-muted mt-1 font-medium flex items-center gap-1.5">
              <Activity size={12} />
              Real-time Insights • {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}ly View
            </span>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-glass border border-glass-border">
              {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${timeRange === range
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
                    }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-glass-border mx-2" />

            <button
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
              title="Filter"
            >
              <Filter size={18} />
            </button>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
              title="Date Range"
            >
              <Calendar size={18} />
            </button>
            <button
              onClick={() => {
                setIsPresentationMode(true);
                setCurrentSlideIndex(0);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-hover shadow-glow-primary transition-all"
            >
              <Presentation size={16} />
              Present
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-auto min-h-0">
          <div className="grid grid-cols-4 gap-4 pb-4">
            {/* KPI Cards */}
            {analyticsKPIs.map((kpi, index) => (
              <motion.div
                key={kpi.id}
                className="card-float p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {kpi.icon ? iconMap[kpi.icon] || <BarChart3 size={20} /> : <BarChart3 size={20} />}
                  </div>
                  {kpi.trend && (
                    <div className={`text-xs font-medium flex items-center gap-1 ${kpi.trend.direction === 'up' ? 'text-success' :
                      kpi.trend.direction === 'down' ? 'text-error' : 'text-text-muted'
                      }`}>
                      <TrendingUp size={12} className={kpi.trend.direction === 'down' ? 'rotate-180' : ''} />
                      {kpi.trend.value}%
                    </div>
                  )}
                </div>
                <p className="text-2xl font-bold text-text-primary">
                  {kpi.value.toLocaleString()}{kpi.unit}
                </p>
                <p className="text-xs text-text-muted mt-1">{kpi.title}</p>
              </motion.div>
            ))}

            {/* Usage Trends Chart */}
            <div className="col-span-2 card-float p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text-primary">Usage Trends</h3>
                <PieChart size={16} className="text-text-muted" />
              </div>
              <LineChartComponent data={usageTrendsData} dataKeys={usageTrendsDataKeys} height={180} showLegend={false} />
            </div>

            {/* Module Usage Chart */}
            <div className="col-span-2 card-float p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text-primary">Module Usage</h3>
                <BarChart3 size={16} className="text-text-muted" />
              </div>
              <BarChartComponent data={moduleUsageData} dataKeys={moduleUsageDataKeys} height={180} showLegend={false} />
            </div>

            {/* Insights */}
            {insightsHighlights.map((insight, index) => (
              <motion.div
                key={insight.id}
                className="card-float p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center ${insight.type === 'success' ? 'bg-success/20 text-success' :
                  insight.type === 'info' ? 'bg-primary/20 text-primary' :
                    'bg-warning/20 text-warning'
                  }`}>
                  <Sparkles size={16} />
                </div>
                <h4 className="text-sm font-semibold text-text-primary mb-1">{insight.title}</h4>
                <p className="text-xs text-text-secondary line-clamp-2">{insight.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-text-primary">{insight.metric}</span>
                  <span className="text-xs text-text-muted">{insight.timestamp}</span>
                </div>
              </motion.div>
            ))}

            {/* Monthly Summary */}
            <div className="card-float p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text-primary">Monthly Summary</h3>
                <Calendar size={16} className="text-text-muted" />
              </div>
              <BarChartComponent data={monthlySummary} dataKeys={monthlySummaryDataKeys} height={180} showLegend={false} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Presentation Mode
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-bg flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Presentation Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-text-primary">{currentSlide.title}</h1>
            <span className="text-sm text-text-muted">
              {currentSlideIndex + 1} / {presentationSlides.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Cycle Speed Selector */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-glass border border-glass-border">
              {CYCLE_SPEEDS.map((speed) => (
                <button
                  key={speed.value}
                  onClick={() => setCycleSpeed(speed.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${cycleSpeed === speed.value
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  {speed.label}
                </button>
              ))}
            </div>

            {/* Play/Pause */}
            <button
              onClick={() => setIsAutoCycling(!isAutoCycling)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isAutoCycling
                ? 'bg-primary text-white shadow-glow-primary'
                : 'bg-glass text-text-secondary hover:text-primary border border-glass-border'
                }`}
            >
              {isAutoCycling ? <Pause size={18} /> : <Play size={18} />}
            </button>

            {/* Exit */}
            <button
              onClick={() => {
                setIsPresentationMode(false);
                setIsAutoCycling(false);
              }}
              className="px-4 py-2 rounded-full text-sm font-medium bg-glass text-text-primary hover:bg-surface border border-glass-border transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {isAutoCycling && (
          <div className="px-6">
            <div className="w-full h-1 rounded-full bg-glass overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${cycleProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}

        {/* Slide Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              className="h-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderSlideContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 p-6">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-glass text-text-secondary hover:text-primary border border-glass-border transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {presentationSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlideIndex(index);
                  setCycleProgress(0);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentSlideIndex
                  ? 'bg-primary w-6'
                  : 'bg-glass hover:bg-text-muted'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-glass text-text-secondary hover:text-primary border border-glass-border transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Keyboard Hints */}
        <div className="absolute bottom-6 left-6 text-xs text-text-muted">
          <span className="opacity-50">← → Navigate • Space Play/Pause • Esc Exit</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
