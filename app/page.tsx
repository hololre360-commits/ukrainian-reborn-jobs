'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { Job, Language, Theme, ViewMode } from '@/lib/types';
import { initialJobs } from '@/lib/jobs';

// Types for modals
type ModalType = 'job' | 'apply' | 'moderator-login' | 'job-form' | null;

export default function UkrainianRebornJobs() {
  // State
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [currentJobs, setCurrentJobs] = useState<Job[]>(initialJobs);
  const [lang, setLang] = useState<Language>('ua');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isModerator, setIsModerator] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  // Modals & Current selections
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [moderatorPassword, setModeratorPassword] = useState('');

  // Form state for add/edit
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    category: 'IT та розробка',
    experience: 'Middle',
    type: 'Повна зайнятість',
    description: '',
  });

  // Load from localStorage
  useEffect(() => {
    const savedJobs = localStorage.getItem('ukrainianRebornJobs');
    if (savedJobs) {
      const parsed = JSON.parse(savedJobs);
      setJobs(parsed);
      setCurrentJobs(parsed);
    }

    const savedModerator = localStorage.getItem('isModerator') === 'true';
    setIsModerator(savedModerator);

    const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Save jobs to localStorage
  const saveJobs = (updatedJobs: Job[]) => {
    localStorage.setItem('ukrainianRebornJobs', JSON.stringify(updatedJobs));
  };

  // Theme handler
  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    html.classList.remove('theme-dark', 'theme-light', 'theme-reborn');
    html.classList.add(`theme-${newTheme}`);
    
    if (newTheme === 'light') {
      document.body.classList.remove('bg-[#0a0a0a]', 'text-[#f5f5f5]');
      document.body.classList.add('bg-[#fafafa]', 'text-[#18181b]');
    } else {
      document.body.classList.remove('bg-[#fafafa]', 'text-[#18181b]');
      document.body.classList.add('bg-[#0a0a0a]', 'text-[#f5f5f5]');
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Language handler
  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    applyFilters(newLang);
  };

  // Apply filters
  const applyFilters = (currentLang = lang) => {
    const term = searchTerm.toLowerCase().trim();

    const filtered = jobs.filter((job) => {
      const title = currentLang === 'ua' ? job.title_ua : job.title_en;
      const desc = currentLang === 'ua' ? job.description_ua : job.description_en;

      const matchesSearch =
        !term ||
        title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        desc.toLowerCase().includes(term);

      const matchesCategory = !categoryFilter || job.category === categoryFilter;
      const matchesLocation = !locationFilter || job.location === locationFilter;
      const matchesExperience = !experienceFilter || job.experience === experienceFilter;

      return matchesSearch && matchesCategory && matchesLocation && matchesExperience;
    });

    setCurrentJobs(filtered);
  };

  // Update filters when they change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, categoryFilter, locationFilter, experienceFilter, jobs, lang]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setLocationFilter('');
    setExperienceFilter('');
  };

  // Open job detail modal
  const openJobModal = (jobId: number) => {
    setSelectedJobId(jobId);
    setActiveModal('job');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedJobId(null);
    setEditingJobId(null);
    setModeratorPassword('');
    setFormData({
      title: '', company: '', location: '', salary: '',
      category: 'IT та розробка', experience: 'Middle', type: 'Повна зайнятість', description: ''
    });
  };

  // Apply to job
  const handleApply = () => {
    closeModal();
    setActiveModal('apply');
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
    toast.success('Заявку успішно надіслано! Ми зв’яжемося з вами найближчим часом.', {
      description: 'Дякуємо за інтерес до Ukrainian Reborn.',
    });
  };

  // Moderator login
  const handleModeratorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (moderatorPassword === 'reborn2026') {
      setIsModerator(true);
      localStorage.setItem('isModerator', 'true');
      closeModal();
      toast.success('Ви увійшли в режим модератора');
    } else {
      toast.error('Невірний пароль');
    }
  };

  const logoutModerator = () => {
    setIsModerator(false);
    localStorage.removeItem('isModerator');
    toast.info('Ви вийшли з режиму модератора');
  };

  // Open add/edit form
  const openJobForm = (jobId?: number) => {
    if (jobId) {
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        setEditingJobId(jobId);
        setFormData({
          title: job.title_ua,
          company: job.company,
          location: job.location,
          salary: job.salary,
          category: job.category,
          experience: job.experience,
          type: job.type,
          description: job.description_ua,
        });
      }
    } else {
      setEditingJobId(null);
      setFormData({
        title: '', company: '', location: '', salary: '',
        category: 'IT та розробка', experience: 'Middle', type: 'Повна зайнятість', description: ''
      });
    }
    closeModal();
    setActiveModal('job-form');
  };

  // Save job (add or edit)
  const saveJob = (e: React.FormEvent) => {
    e.preventDefault();

    const newJobData: Partial<Job> = {
      title_ua: formData.title,
      title_en: formData.title,
      company: formData.company,
      location: formData.location,
      salary: formData.salary,
      category: formData.category,
      experience: formData.experience,
      type: formData.type,
      description_ua: formData.description,
      description_en: formData.description,
      requirements: ["\u0414\u043e\u0441\u0432\u0456\u0434 \u0440\u043e\u0431\u043e\u0442\u0438 \u0437\u0430 \u0441\u043f\u0435\u0446\u0456\u0430\u043b\u044c\u043d\u0456\u0441\u0442\u044e", "\u0412\u0438\u0441\u043e\u043a\u0438\u0439 \u0440\u0456\u0432\u0435\u043d\u044c \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0456", "\u0413\u043e\u0442\u043e\u0432\u043d\u0456\u0441\u0442\u044c \u0434\u043e \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u043e\u0457 \u0440\u043e\u0431\u043e\u0442\u0438"],
      benefits: ["\u041a\u043e\u043d\u043a\u0443\u0440\u0435\u043d\u0442\u043d\u0430 \u0437\u0430\u0440\u043f\u043b\u0430\u0442\u0430", "\u0413\u043d\u0443\u0447\u043a\u0438\u0439 \u0433\u0440\u0430\u0444\u0456\u043a", "\u041c\u043e\u0436\u043b\u0438\u0432\u0456\u0441\u0442\u044c \u043f\u0440\u043e\u0444\u0435\u0441\u0456\u0439\u043d\u043e\u0433\u043e \u0437\u0440\u043e\u0441\u0442\u0430\u043d\u043d\u044f"],
      postedText: "\u0449\u043e\u0439\u043d\u043e",
    };

    let updatedJobs: Job[];

    if (editingJobId) {
      updatedJobs = jobs.map(job =>
        job.id === editingJobId ? { ...job, ...newJobData } : job
      );
      toast.success('\u0412\u0430\u043a\u0430\u043d\u0441\u0456\u044e у\u0441\u043f\u0456\u0448\u043d\u043e о\u043d\u043e\u0432\u043b\u0435\u043d\u043e');
    } else {
      const newJob: Job = {
        id: Date.now(),
        posted: new Date().toISOString().split('T')[0],
        ...newJobData,
      } as Job;
      updatedJobs = [newJob, ...jobs];
      toast.success('\u041d\u043e\u0432\u0443 \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u044e у\u0441\u043f\u0456\u0448\u043d\u043e \u0434\u043e\u0434\u0430\u043d\u043e');
    }

    setJobs(updatedJobs);
    setCurrentJobs(updatedJobs);
    saveJobs(updatedJobs);
    closeModal();
  };

  // Delete job
  const deleteJob = (jobId: number) => {
    if (!confirm('\u0412\u0438 \u0432\u043f\u0435\u0432\u043d\u0435\u043d\u0456, \u0449\u043e \u0445\u043e\u0447\u0435\u0442\u0435 \u0432\u0438\u0434\u0430\u043b\u0438\u0442\u0438 \u0446\u044e \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u044e?')) return;

    const updatedJobs = jobs.filter(j => j.id !== jobId);
    setJobs(updatedJobs);
    setCurrentJobs(updatedJobs);
    saveJobs(updatedJobs);
    toast.success('\u0412\u0430\u043a\u0430\u043d\u0441\u0456\u044e \u0432\u0438\u0434\u0430\u043b\u0435\u043d\u043e');
  };

  // Get current selected job
  const selectedJob = selectedJobId ? jobs.find(j => j.id === selectedJobId) : null;

  // Active filters display
  const activeFilters = [
    searchTerm && { label: `\u041f\u043e\u0448\u0443\u043a: "${searchTerm}"` , clear: () => setSearchTerm('') },
    categoryFilter && { label: categoryFilter, clear: () => setCategoryFilter('') },
    locationFilter && { label: locationFilter, clear: () => setLocationFilter('') },
    experienceFilter && { label: experienceFilter, clear: () => setExperienceFilter('') },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="min-h-screen">
      <Header 
        lang={lang} 
        setLang={handleSetLang} 
        theme={theme} 
        setTheme={setTheme} 
        isModerator={isModerator} 
        onModeratorClick={() => isModerator ? logoutModerator() : setActiveModal('moderator-login')}
      />

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-x-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm mb-6">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="font-medium">187 активних вакан\u0441\u0456\u0439 • 64 ко\u043c\u043f\u0430\u043d\u0456\u0457 • 12 к\u0440\u0430\u0457\u043d</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
          \u0417\u043d\u0430\u0439\u0434\u0438 \u043c\u043e\u0436\u043b\u0438\u0432\u043e\u0441\u0442\u0456,<br />
          <span className="bg-gradient-to-r from-[#9f1239] via-[#b91c1c] to-[#9f1239] bg-clip-text text-transparent">\u0449\u043e \u0432\u0456\u0434\u0440\u043e\u0434\u0436\u0443\u044e\u0442\u044c</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-xl text-zinc-400 mb-10">
          \u0412\u0430\u043a\u0430\u043d\u0441\u0456\u0457 \u0434\u043b\u044f \u0443\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u043e\u0457 \u0441\u043f\u0456\u043b\u044c\u043d\u043e\u0442\u0438. \u0412\u0456\u0434\u0434\u0430\u043b\u0435\u043d\u0430 \u0440\u043e\u0431\u043e\u0442\u0430, \u043f\u043e\u0437\u0438\u0446\u0456\u0457 \u0432 \u0423\u043a\u0440\u0430\u0457\u043d\u0456 \u0442\u0430 \u0437\u0430 \u043a\u043e\u0440\u0434\u043e\u043d\u043e\u043c.
        </p>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="\u041f\u043e\u0448\u0443\u043a \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u0439 (React, \u043c\u0435\u043d\u0435\u0434\u0436\u0435\u0440, \u0432\u0456\u0434\u0431\u0443\u0434\u043e\u0432\u0430...)"
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#9f1239] transition-colors text-lg px-7 py-5 rounded-3xl pl-14 placeholder:text-zinc-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-6 top-6 text-xl text-zinc-500" />
          </div>
        </div>
      </section>

      {/* VACANCIES SECTION */}
      <section id="vacancies" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-y-4">
          <div>
            <h2 className="text-5xl font-bold tracking-tighter">\u0410\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u0456 \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u0457</h2>
            <p className="text-zinc-400 mt-1">\u0417\u043d\u0430\u0439\u0434\u0438 \u0440\u043e\u0431\u043e\u0442\u0443, \u044f\u043a\u0430 \u043c\u0430\u0454 \u0437\u043d\u0430\u0447\u0435\u043d\u043d\u044f</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center bg-zinc-900 rounded-2xl p-1 border border-zinc-800 self-start md:self-auto">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-5 py-2 text-sm font-medium flex items-center gap-x-2 rounded-[14px] transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-zinc-300 hover:text-white'}`}
            >
              \u0421\u0456\u0442\u043a\u0430
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-5 py-2 text-sm font-medium flex items-center gap-x-2 rounded-[14px] transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'text-zinc-300 hover:text-white'}`}
            >
              \u0421\u043f\u0438\u0441\u043e\u043a
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">\u041f\u041e\u0428\u0423\u041a</label>
              <input
                type="text"
                placeholder="\u041d\u0430\u0437\u0432\u0430 \u043f\u043e\u0441\u0430\u0434\u0438, \u043a\u043e\u043c\u043f\u0430\u043d\u0456\u044f..."
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-[#9f1239] rounded-2xl px-5 py-3 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">\u041a\u0410\u0422\u0415\u0413\u041e\u0420\u0406\u042f</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 text-sm">
                <option value="">\u0423\u0441\u0456 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0456\u0457</option>
                <option value="IT \u0442\u0430 \u0440\u043e\u0437\u0440\u043e\u0431\u043a\u0430">IT \u0442\u0430 \u0440\u043e\u0437\u0440\u043e\u0431\u043a\u0430</option>
                <option value="\u0414\u0438\u0437\u0430\u0439\u043d">\u0414\u0438\u0437\u0430\u0439\u043d</option>
                <option value="\u041c\u0430\u0440\u043a\u0435\u0442\u0438\u043d\u0433">\u041c\u0430\u0440\u043a\u0435\u0442\u0438\u043d\u0433 \u0442\u0430 \u043a\u043e\u043c\u0443\u043d\u0456\u043a\u0430\u0446\u0456\u0457</option>
                <option value="\u041c\u0435\u043d\u0435\u0434\u0436\u043c\u0435\u043d\u0442">\u041c\u0435\u043d\u0435\u0434\u0436\u043c\u0435\u043d\u0442</option>
                <option value="\u041e\u0441\u0432\u0456\u0442\u0430">\u041e\u0441\u0432\u0456\u0442\u0430 \u0442\u0430 \u043d\u0430\u0432\u0447\u0430\u043d\u043d\u044f</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">\u041b\u041e\u041a\u0410\u0426\u0406\u042f</label>
              <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 text-sm">
                <option value="">\u0423\u0441\u0456 \u043b\u043e\u043a\u0430\u0446\u0456\u0457</option>
                <option value="\u0412\u0456\u0434\u0434\u0430\u043b\u0435\u043d\u0430 \u0440\u043e\u0431\u043e\u0442\u0430">\u0412\u0456\u0434\u0434\u0430\u043b\u0435\u043d\u0430 \u0440\u043e\u0431\u043e\u0442\u0430</option>
                <option value="\u041a\u0438\u0457\u0432">\u041a\u0438\u0457\u0432</option>
                <option value="\u041b\u044c\u0432\u0456\u0432">\u041b\u044c\u0432\u0456\u0432</option>
                <option value="\u0412\u0430\u0440\u0448\u0430\u0432\u0430">\u0412\u0430\u0440\u0448\u0430\u0432\u0430</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">\u0414\u041e\u0421\u0412\u0406\u0414</label>
              <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 text-sm">
                <option value="">\u0411\u0443\u0434\u044c-\u044f\u043a\u0438\u0439 \u0434\u043e\u0441\u0432\u0456\u0434</option>
                <option value="Junior">Junior</option>
                <option value="Middle">Middle</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilters.map((filter, index) => (
                <div key={index} className="inline-flex items-center gap-x-2 px-4 py-1.5 bg-zinc-800 text-sm rounded-2xl border border-zinc-700">
                  <span>{filter.label}</span>
                  <button onClick={filter.clear} className="text-zinc-400 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button onClick={clearFilters} className="text-xs px-3 py-1.5 text-zinc-400 hover:text-white underline">\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0432\u0441\u0435</button>
            </div>
          )}
        </div>

        {/* Jobs Grid/List */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          <AnimatePresence>
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => {
                const title = lang === 'ua' ? job.title_ua : job.title_en;
                const description = lang === 'ua' ? job.description_ua : job.description_en;

                return (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="job-card bg-zinc-900 border border-zinc-700 rounded-3xl p-6 cursor-pointer hover:border-zinc-600 group"
                    onClick={() => openJobModal(job.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-semibold text-xl tracking-tighter group-hover:text-[#9f1239] transition-colors">{title}</div>
                        <div className="text-zinc-400 mt-0.5">{job.company}</div>
                      </div>
                      
                      {isModerator && (
                        <div className="flex gap-x-1 opacity-70 group-hover:opacity-100" onClick={e => e.stopPropagation()}>
                          <button onClick={() => openJobForm(job.id)} className="p-2 hover:bg-zinc-800 rounded-xl">
                            <span className="text-sm">\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438</span>
                          </button>
                          <button onClick={() => deleteJob(job.id)} className="p-2 hover:bg-red-950 text-red-400 rounded-xl">
                            \u0412\u0438\u0434\u0430\u043b\u0438\u0442\u0438
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="text-xs px-3 py-1 rounded-2xl bg-zinc-800 flex items-center gap-1">
                        {job.location}
                      </div>
                      <div className="text-xs px-3 py-1 rounded-2xl bg-emerald-950 text-emerald-400 font-medium">
                        {job.salary}
                      </div>
                      <div className="text-xs px-3 py-1 rounded-2xl bg-zinc-800">
                        {job.experience}
                      </div>
                    </div>

                    <p className="text-sm text-zinc-400 line-clamp-3 mb-5">{description}</p>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">{job.postedText}</span>
                      <div className="flex gap-x-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openJobModal(job.id)} className="px-4 py-2 text-xs font-semibold rounded-2xl border border-zinc-600 hover:bg-zinc-800">
                          \u0414\u0435\u0442\u0430\u043b\u044c\u043d\u0456\u0448\u0435
                        </button>
                        <button onClick={() => { setSelectedJobId(job.id); handleApply(); }} className="px-5 py-2 text-xs font-semibold rounded-2xl bg-[#9f1239] hover:bg-[#be123c] text-white">
                          \u041f\u043e\u0434\u0430\u0442\u0438 \u0437\u0430\u044f\u0432\u043a\u0443
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-zinc-400">
                \u0412\u0430\u043a\u0430\u043d\u0441\u0456\u0439 \u043d\u0435 \u0437\u043d\u0430\u0439\u0434\u0435\u043d\u043e. \u0421\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0437\u043c\u0456\u043d\u0438\u0442\u0438 \u0444\u0456\u043b\u044c\u0442\u0440\u0438.
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Floating Add Button for Moderator */}
      {isModerator && (
        <button
          onClick={() => openJobForm()}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-x-3 px-6 py-4 rounded-2xl bg-[#9f1239] hover:bg-[#be123c] text-white font-semibold shadow-2xl"
        >
          <Plus className="w-5 h-5" /> \u0414\u043e\u0434\u0430\u0442\u0438 \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u044e
        </button>
      )}

      {/* JOB DETAIL MODAL */}
      <AnimatePresence>
        {activeModal === 'job' && selectedJob && (
          <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={closeModal}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-8 py-6 border-b border-zinc-700 flex justify-between">
                <div>
                  <div className="text-3xl font-semibold tracking-tighter">{lang === 'ua' ? selectedJob.title_ua : selectedJob.title_en}</div>
                  <div className="text-xl text-zinc-400 mt-1">{selectedJob.company}</div>
                </div>
                <button onClick={closeModal} className="text-3xl text-zinc-400 hover:text-white">\u00d7</button>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm flex items-center gap-2">{selectedJob.location}</div>
                  <div className="px-4 py-2 bg-emerald-950 text-emerald-400 rounded-2xl text-sm font-medium">{selectedJob.salary}</div>
                  <div className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">{selectedJob.experience} \u2022 {selectedJob.type}</div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h4 className="font-semibold mb-3 text-lg">\u041f\u0440\u043e \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u044e</h4>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line">{lang === 'ua' ? selectedJob.description_ua : selectedJob.description_en}</p>
                </div>
              </div>

              <div className="p-8 border-t border-zinc-700 flex gap-4 bg-zinc-950">
                <button onClick={handleApply} className="flex-1 py-4 rounded-2xl bg-[#9f1239] hover:bg-[#be123c] font-semibold text-lg">
                  \u041f\u043e\u0434\u0430\u0442\u0438 \u0437\u0430\u044f\u0432\u043a\u0443
                </button>
                <button onClick={closeModal} className="px-8 py-4 rounded-2xl border border-zinc-700 font-medium">\u0417\u0430\u043a\u0440\u0438\u0442\u0438</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLY MODAL */}
      <AnimatePresence>
        {activeModal === 'apply' && selectedJob && (
          <div className="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="modal bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-lg p-8" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-semibold mb-1">\u041f\u043e\u0434\u0430\u0442\u0438 \u0437\u0430\u044f\u0432\u043a\u0443</h2>
              <p className="text-zinc-400 mb-6">{lang === 'ua' ? selectedJob.title_ua : selectedJob.title_en}</p>

              <form onSubmit={submitApplication} className="space-y-5">
                <input type="text" placeholder="\u0406\u043c'\u044f \u0442\u0430 \u043f\u0440\u0438\u0437\u0432\u0438\u0449\u0435" required className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="email" placeholder="Email" required className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" />
                  <input type="tel" placeholder="\u0422\u0435\u043b\u0435\u0444\u043e\u043d" className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" />
                </div>
                <textarea placeholder="\u0421\u0443\u043f\u0440\u043e\u0432\u0456\u0434\u043d\u0438\u0439 \u043b\u0438\u0441\u0442" rows={4} className="w-full bg-zinc-950 border border-zinc-700 rounded-3xl px-5 py-4" />
                
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 py-4 rounded-2xl border border-zinc-700">\u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438</button>
                  <button type="submit" className="flex-1 py-4 rounded-2xl bg-[#9f1239] hover:bg-[#be123c] font-semibold">\u041d\u0430\u0434\u0456\u0441\u043b\u0430\u0442\u0438 \u0437\u0430\u044f\u0432\u043a\u0443</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODERATOR LOGIN */}
      <AnimatePresence>
        {activeModal === 'moderator-login' && (
          <div className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="modal bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-sm p-8" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-[#9f1239]" />
                </div>
                <div className="font-semibold text-2xl">\u041f\u0430\u043d\u0435\u043b\u044c \u043c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440\u0430</div>
              </div>

              <form onSubmit={handleModeratorLogin}>
                <input 
                  type="password" 
                  placeholder="\u041f\u0430\u0440\u043e\u043b\u044c" 
                  value={moderatorPassword}
                  onChange={(e) => setModeratorPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-4 text-center text-lg tracking-[3px]" 
                />
                <button type="submit" className="mt-4 w-full py-4 rounded-2xl bg-[#9f1239] hover:bg-[#be123c] font-semibold">\u0423\u0432\u0456\u0439\u0442\u0438</button>
              </form>
              <p className="text-center text-xs text-zinc-500 mt-4">\u0422\u0435\u0441\u0442\u043e\u0432\u0438\u0439 \u043f\u0430\u0440\u043e\u043b\u044c: reborn2026</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD/EDIT JOB FORM MODAL */}
      <AnimatePresence>
        {activeModal === 'job-form' && (
          <div className="fixed inset-0 z-[130] bg-black/70 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="modal bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-2xl p-8" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-semibold mb-6">{editingJobId ? '\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u044e' : '\u0414\u043e\u0434\u0430\u0442\u0438 \u043d\u043e\u0432\u0443 \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u044e'}</h2>
              
              <form onSubmit={saveJob} className="space-y-5">
                <input type="text" placeholder="\u041d\u0430\u0437\u0432\u0430 \u043f\u043e\u0441\u0430\u0434\u0438" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="\u041a\u043e\u043c\u043f\u0430\u043d\u0456\u044f" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" />
                  <input type="text" placeholder="\u041b\u043e\u043a\u0430\u0446\u0456\u044f" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="\u0417\u0430\u0440\u043f\u043b\u0430\u0442\u0430 (USD)" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" />
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3">
                    <option>IT \u0442\u0430 \u0440\u043e\u0437\u0440\u043e\u0431\u043a\u0430</option>
                    <option>\u0414\u0438\u0437\u0430\u0439\u043d</option>
                    <option>\u041c\u0430\u0440\u043a\u0435\u0442\u0438\u043d\u0433</option>
                    <option>\u041c\u0435\u043d\u0435\u0434\u0436\u043c\u0435\u043d\u0442</option>
                    <option>\u041e\u0441\u0432\u0456\u0442\u0430</option>
                  </select>
                  <select value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3">
                    <option>Junior</option>
                    <option>Middle</option>
                    <option>Senior</option>
                  </select>
                </div>

                <textarea placeholder="\u041e\u043f\u0438\u0441 \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u0457" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={4} className="w-full bg-zinc-950 border border-zinc-700 rounded-3xl px-5 py-4" />

                <div className="flex justify-end gap-x-3 pt-4">
                  <button type="button" onClick={closeModal} className="px-8 py-3 rounded-2xl border border-zinc-700">\u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438</button>
                  <button type="submit" className="px-10 py-3 rounded-2xl bg-[#9f1239] hover:bg-[#be123c] font-semibold text-white">
                    {editingJobId ? '\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0437\u043c\u0456\u043d\u0438' : '\u0414\u043e\u0434\u0430\u0442\u0438 \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u044e'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Community teaser */}
      <section id="community" className="bg-zinc-900 border-t border-zinc-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1 bg-zinc-800 rounded-full text-sm font-medium mb-4">\u0421\u041f\u0406\u041b\u042c\u041d\u041e\u0422\u0410</div>
          <h2 className="text-4xl font-semibold tracking-tight mb-4">\u041c\u0438 \u043d\u0435 \u043f\u0440\u043e\u0441\u0442\u043e \u0448\u0443\u043a\u0430\u0454\u043c\u043e \u0440\u043e\u0431\u043e\u0442\u0443.<br />\u041c\u0438 \u0432\u0456\u0434\u0440\u043e\u0434\u0436\u0443\u0454\u043c\u043e \u0423\u043a\u0440\u0430\u0457\u043d\u0443 \u0440\u0430\u0437\u043e\u043c.</h2>
          <p className="text-zinc-400 max-w-md mx-auto">\u041f\u0440\u0438\u0454\u0434\u043d\u0443\u0439\u0441\u044f \u0434\u043e \u0441\u043f\u0456\u043b\u044c\u043d\u043e\u0442\u0438 \u0442\u0430\u043b\u0430\u043d\u043e\u0432\u0438\u0442\u0438\u0445 \u0443\u043a\u0440\u0430\u0457\u043d\u0446\u0456\u0432, \u044f\u043a\u0456 \u0431\u0443\u0434\u0443\u044e\u0442\u044c \u043c\u0430\u0439\u0431\u0443\u0442\u0454.</p>
        </div>
      </section>
    </div>
  );
}