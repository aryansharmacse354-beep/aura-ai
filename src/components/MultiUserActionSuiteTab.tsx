import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Truck, 
  Factory, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  TrendingDown, 
  TrendingUp, 
  HeartPulse, 
  Wind, 
  Flame, 
  TreePine, 
  Navigation, 
  Clock, 
  Calculator, 
  Check, 
  Play, 
  Compass, 
  Layers, 
  HardDriveDownload, 
  Radio, 
  Satellite, 
  Drone, 
  FileText, 
  RotateCcw,
  Zap,
  DollarSign,
  Heart,
  MapPin,
  MessageSquare,
  ThumbsUp,
  Plus,
  Filter,
  Search,
  CheckCircle,
  Tag
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { AQIMeasurement, UserRole, HealthCondition, PinnedCommunityNote } from '../types';
import { INITIAL_PINNED_COMMUNITY_NOTES } from '../data/mockData';

interface MultiUserActionSuiteTabProps {
  currentCityData: AQIMeasurement;
}

type ActivePersonaTab = 'municipal' | 'citizen' | 'transit' | 'enterprise' | 'annotations';

export const MultiUserActionSuiteTab: React.FC<MultiUserActionSuiteTabProps> = ({
  currentCityData
}) => {
  const [activePersona, setActivePersona] = useState<ActivePersonaTab>('municipal');

  // =========================================================================
  // 1. MUNICIPAL ENVIRONMENTAL AGENCIES STATES
  // =========================================================================
  const [oddEvenBan, setOddEvenBan] = useState<boolean>(true);
  const [industrialThrottle, setIndustrialThrottle] = useState<number>(35); // 35% throttle
  const [stubbleEnforcement, setStubbleEnforcement] = useState<number>(60); // 60% compliance
  const [waterMistCannons, setWaterMistCannons] = useState<number>(24); // 24 cannons active
  const [municipalSimResult, setMunicipalSimResult] = useState<{
    projectedAQI: number;
    aqiDrop: number;
    healthcareSavingsMillion: number;
    hospitalAdmissionsAverted: number;
  } | null>(null);

  // =========================================================================
  // 2. VULNERABLE CITIZENS STATES
  // =========================================================================
  const [userHealth, setUserHealth] = useState<HealthCondition>('asthma');
  const [userAge, setUserAge] = useState<number>(34);
  const [targetActivity, setTargetActivity] = useState<'jogging' | 'cycling' | 'walking' | 'labor'>('jogging');
  const [citizenRiskAssessment, setCitizenRiskAssessment] = useState<{
    safeExertionMinutes: number;
    inhalationRisk: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical';
    recommendedMask: string;
    cleanPathExposureCut: number;
    advisoryMessage: string;
  } | null>(null);

  // =========================================================================
  // 3. SMART CITY TRANSIT & URBAN PLANNERS STATES
  // =========================================================================
  const [greenCorridorActive, setGreenCorridorActive] = useState<boolean>(true);
  const [evBusAllocation, setEvBusAllocation] = useState<number>(75); // 75% zero-emission
  const [signalGreenExtensionSec, setSignalGreenExtensionSec] = useState<number>(15); // +15s green
  const [transitSimResult, setTransitSimResult] = useState<{
    tailpipeEmissionCutPercent: number;
    freightCongestionReduction: number;
    flushedStagnationPercent: number;
  } | null>(null);

  // =========================================================================
  // 4. HEALTHCARE & INDUSTRIAL ENTERPRISE STATES
  // =========================================================================
  const [hospitalSurgeDays, setHospitalSurgeDays] = useState<number>(3);
  const [hvacPreFilterStatus, setHvacPreFilterStatus] = useState<'idle' | 'prefiltering' | 'isolated'>('prefiltering');
  const [boilerOperatingCapacity, setBoilerOperatingCapacity] = useState<number>(65); // 65% limit
  const [enterpriseResult, setEnterpriseResult] = useState<{
    projectedRespiratoryBeds: number;
    indoorAqiMaintained: number;
    carbonCreditsAudited: number;
    complianceScore: number;
  } | null>(null);

  // =========================================================================
  // 5. COLLABORATIVE PINNED COMMUNITY NOTES STATES
  // =========================================================================
  const [pinnedNotes, setPinnedNotes] = useState<PinnedCommunityNote[]>(INITIAL_PINNED_COMMUNITY_NOTES);
  const [selectedNoteCategory, setSelectedNoteCategory] = useState<string>('All');
  const [selectedNoteSeverity, setSelectedNoteSeverity] = useState<string>('All');
  const [noteSearchQuery, setNoteSearchQuery] = useState<string>('');
  const [showAddNoteModal, setShowAddNoteModal] = useState<boolean>(false);
  const [activeCommentNoteId, setActiveCommentNoteId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Form states for creating a new pinned note
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteLocation, setNewNoteLocation] = useState(currentCityData.cityName + ' Core');
  const [newNoteLat, setNewNoteLat] = useState(currentCityData.lat.toFixed(4));
  const [newNoteLng, setNewNoteLng] = useState(currentCityData.lng.toFixed(4));
  const [newNoteCategory, setNewNoteCategory] = useState<'Incident' | 'Sensor Calibration' | 'Health Hazard' | 'Policy Enforcement' | 'Clean Shelter' | 'Community Report'>('Incident');
  const [newNoteSeverity, setNewNoteSeverity] = useState<'Low' | 'Moderate' | 'High' | 'Critical'>('Critical');
  const [newNoteDescription, setNewNoteDescription] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('Diesel, Smog, Air Filter');

  // Source Speciation Attribution Chart Data (from Slide 3 & Slide 6)
  const sourceAttributionData = [
    { name: 'Vehicular Traffic (Diesel / Petrol)', value: 38, color: '#f59e0b' },
    { name: 'Industrial Boilers & Thermal Stacks', value: 28, color: '#ef4444' },
    { name: 'Agricultural Stubble Burning', value: 24, color: '#ec4899' },
    { name: 'Construction & Road Dust', value: 10, color: '#8b5cf6' }
  ];

  // Run Municipal Agency Simulation
  const handleRunMunicipalSimulation = () => {
    const totalReduction = 
      (oddEvenBan ? 18 : 0) + 
      Math.round(industrialThrottle * 0.45) + 
      Math.round(stubbleEnforcement * 0.35) + 
      Math.min(15, Math.round(waterMistCannons * 0.4));
    
    const newAqi = Math.max(45, currentCityData.aqi - totalReduction);
    const drop = currentCityData.aqi - newAqi;
    const savings = Number(((drop * 1.85) + 22.4).toFixed(1));
    const admissions = Math.round(drop * 48);

    setMunicipalSimResult({
      projectedAQI: newAqi,
      aqiDrop: drop,
      healthcareSavingsMillion: savings,
      hospitalAdmissionsAverted: admissions
    });
  };

  // Run Citizen Exertion Assessment
  const handleRunCitizenAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    let baseMinutes = 60;
    if (currentCityData.aqi > 300) baseMinutes = 10;
    else if (currentCityData.aqi > 200) baseMinutes = 20;
    else if (currentCityData.aqi > 150) baseMinutes = 35;
    else if (currentCityData.aqi > 100) baseMinutes = 45;

    if (userHealth === 'asthma' || userHealth === 'copd' || userHealth === 'cardiovascular') {
      baseMinutes = Math.round(baseMinutes * 0.5);
    }
    if (userAge > 60 || userAge < 12) {
      baseMinutes = Math.round(baseMinutes * 0.7);
    }
    if (targetActivity === 'jogging' || targetActivity === 'labor') {
      baseMinutes = Math.round(baseMinutes * 0.75);
    }

    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical' = 'Moderate';
    if (currentCityData.aqi > 300) riskLevel = 'Critical';
    else if (currentCityData.aqi > 200) riskLevel = 'Severe';
    else if (currentCityData.aqi > 150) riskLevel = 'High';
    else if (currentCityData.aqi > 100) riskLevel = 'Moderate';
    else riskLevel = 'Low';

    const mask = currentCityData.aqi > 200 ? 'N95 / N99 Particulate Respirator with Exhalation Valve' : 'Standard 3-Ply / N95 Mask';

    setCitizenRiskAssessment({
      safeExertionMinutes: Math.max(5, baseMinutes),
      inhalationRisk: riskLevel,
      recommendedMask: mask,
      cleanPathExposureCut: 38.5,
      advisoryMessage: `For ${targetActivity} in ${currentCityData.cityName} (AQI ${currentCityData.aqi}), keep high-intensity exertion below ${Math.max(5, baseMinutes)} minutes. Use AuraPredict Clean-Path Routing to cut particulate dose by up to 38.5%.`
    });
  };

  // Run Transit Planner Simulation
  const handleRunTransitSim = () => {
    const tailpipeCut = Math.round((evBusAllocation * 0.42) + (greenCorridorActive ? 16 : 0));
    const congestionCut = greenCorridorActive ? 28 : 10;
    const flushRate = Math.round(signalGreenExtensionSec * 1.8 + 14);

    setTransitSimResult({
      tailpipeEmissionCutPercent: tailpipeCut,
      freightCongestionReduction: congestionCut,
      flushedStagnationPercent: flushRate
    });
  };

  // Run Healthcare & Enterprise Simulation
  const handleRunEnterpriseSim = () => {
    const beds = Math.round((currentCityData.aqi / 10) * 4.8);
    const indoorAQI = hvacPreFilterStatus === 'prefiltering' ? Math.round(currentCityData.aqi * 0.18) : Math.round(currentCityData.aqi * 0.55);
    const carbonCredits = Math.round((100 - boilerOperatingCapacity) * 42.5);

    setEnterpriseResult({
      projectedRespiratoryBeds: beds,
      indoorAqiMaintained: indoorAQI,
      carbonCreditsAudited: carbonCredits,
      complianceScore: 97.8
    });
  };

  // Handle Note Upvote
  const handleToggleUpvote = (noteId: string) => {
    setPinnedNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        const isUpvoted = !!note.hasUpvoted;
        return {
          ...note,
          hasUpvoted: !isUpvoted,
          upvotes: isUpvoted ? note.upvotes - 1 : note.upvotes + 1
        };
      }
      return note;
    }));
  };

  // Handle Adding a Comment
  const handleAddComment = (noteId: string) => {
    if (!newCommentText.trim()) return;
    const commentObj = {
      id: `c_${Date.now()}`,
      authorName: 'Active User (Citizen / Field Officer)',
      authorRole: 'citizen' as const,
      text: newCommentText.trim(),
      timestamp: 'Just now'
    };

    setPinnedNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          comments: [...note.comments, commentObj]
        };
      }
      return note;
    }));

    setNewCommentText('');
  };

  // Handle Submitting New Pinned Note
  const handleCreateNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteDescription.trim()) return;

    const newNote: PinnedCommunityNote = {
      id: `note_pin_${Date.now()}`,
      title: newNoteTitle.trim(),
      category: newNoteCategory,
      severity: newNoteSeverity,
      lat: parseFloat(newNoteLat) || currentCityData.lat,
      lng: parseFloat(newNoteLng) || currentCityData.lng,
      locationName: newNoteLocation.trim() || `${currentCityData.cityName} District Grid`,
      authorRole: 'field_officer',
      authorName: 'Field Inspector (AuraPredict)',
      timestamp: 'Just now',
      description: newNoteDescription.trim(),
      upvotes: 1,
      hasUpvoted: true,
      status: 'Open',
      verifiedByOfficial: true,
      comments: [],
      tags: newNoteTags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setPinnedNotes(prev => [newNote, ...prev]);
    setShowAddNoteModal(false);
    setNewNoteTitle('');
    setNewNoteDescription('');
  };

  // Filtered pinned notes
  const filteredNotes = pinnedNotes.filter(n => {
    const matchesCategory = selectedNoteCategory === 'All' || n.category === selectedNoteCategory;
    const matchesSeverity = selectedNoteSeverity === 'All' || n.severity === selectedNoteSeverity;
    const matchesSearch = noteSearchQuery.trim() === '' || 
      n.title.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
      n.locationName.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
      (n.tags && n.tags.some(t => t.toLowerCase().includes(noteSearchQuery.toLowerCase())));
    return matchesCategory && matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                Slide 6 Blueprint • 5 Multi-Stakeholder Modules
              </span>
              <span className="text-slate-400 text-xs font-mono">Real-Time Environmental Toolkits & Collaborative Notes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center space-x-2">
              <span>Multi-User Stakeholder Action Suite</span>
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl">
              Tailored environmental intelligence and proactive decision levers mapped specifically for government agencies, vulnerable citizens, transit planners, industrial enterprises, and collaborative field note responders.
            </p>
          </div>

          <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-2xl flex items-center space-x-2 font-mono text-xs text-emerald-400 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Target: {currentCityData.cityName} (AQI {currentCityData.aqi})</span>
          </div>
        </div>

        {/* 5 Persona Selector Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-5">
          {/* Persona 1 */}
          <button
            onClick={() => setActivePersona('municipal')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activePersona === 'municipal'
                ? 'bg-slate-950 border-emerald-500 text-slate-100 shadow-md shadow-emerald-500/10'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-xs">Municipal Policy</span>
            </div>
            <p className="text-[10px] text-slate-400">Pollution Control & Bans</p>
          </button>

          {/* Persona 2 */}
          <button
            onClick={() => setActivePersona('citizen')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activePersona === 'citizen'
                ? 'bg-slate-950 border-teal-500 text-slate-100 shadow-md shadow-teal-500/10'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-teal-400" />
              <span className="font-extrabold text-xs">Vulnerable Citizens</span>
            </div>
            <p className="text-[10px] text-slate-400">Asthma, Exertion Limits</p>
          </button>

          {/* Persona 3 */}
          <button
            onClick={() => setActivePersona('transit')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activePersona === 'transit'
                ? 'bg-slate-950 border-cyan-500 text-slate-100 shadow-md shadow-cyan-500/10'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span className="font-extrabold text-xs">Smart City Transit</span>
            </div>
            <p className="text-[10px] text-slate-400">EV Corridors & Signals</p>
          </button>

          {/* Persona 4 */}
          <button
            onClick={() => setActivePersona('enterprise')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activePersona === 'enterprise'
                ? 'bg-slate-950 border-amber-500 text-slate-100 shadow-md shadow-amber-500/10'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Factory className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-xs">Healthcare & Enterprise</span>
            </div>
            <p className="text-[10px] text-slate-400">Hospital Surges & HVAC</p>
          </button>

          {/* Persona 5: Collaborative Pinned Notes */}
          <button
            onClick={() => setActivePersona('annotations')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activePersona === 'annotations'
                ? 'bg-slate-950 border-violet-500 text-slate-100 shadow-md shadow-violet-500/10'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="w-4 h-4 text-violet-400" />
              <span className="font-extrabold text-xs">Collaborative Pins</span>
            </div>
            <p className="text-[10px] text-slate-400">Community Notes & Incidents ({pinnedNotes.length})</p>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: MUNICIPAL ENVIRONMENTAL AGENCIES
          ===================================================================== */}
      {activePersona === 'municipal' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-sm text-slate-100">
                    Municipal Emergency Policy Simulator & Action Levers
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  GRAP Stage IV Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">Odd-Even Vehicular Rationing</span>
                    <button
                      type="button"
                      onClick={() => setOddEvenBan(!oddEvenBan)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        oddEvenBan ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {oddEvenBan ? 'Enforced' : 'Off'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">Restricts 50% of non-electric passenger vehicles.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">Industrial Output Throttle</span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">{industrialThrottle}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={industrialThrottle}
                    onChange={(e) => setIndustrialThrottle(parseInt(e.target.value) || 0)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Caps thermal power plants and boiler smokestacks.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">Stubble Enforcement Compliance</span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">{stubbleEnforcement}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={stubbleEnforcement}
                    onChange={(e) => setStubbleEnforcement(parseInt(e.target.value) || 0)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Satellite drone monitoring over agricultural grids.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">Anti-Smog Water Mist Cannons</span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">{waterMistCannons} Units</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="2"
                    value={waterMistCannons}
                    onChange={(e) => setWaterMistCannons(parseInt(e.target.value) || 0)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Deploys pressurized particulate washout across hotspots.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunMunicipalSimulation}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Simulate Emergency Executive Order Impact</span>
              </button>

              {municipalSimResult && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Projected AQI</div>
                      <div className="text-lg font-black font-mono text-emerald-400">{municipalSimResult.projectedAQI} AQI</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Immediate AQI Drop</div>
                      <div className="text-lg font-black font-mono text-teal-400">-{municipalSimResult.aqiDrop} Pts</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Healthcare Savings</div>
                      <div className="text-lg font-black font-mono text-cyan-400">${municipalSimResult.healthcareSavingsMillion}M</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Hospital Visits Saved</div>
                      <div className="text-lg font-black font-mono text-emerald-300">{municipalSimResult.hospitalAdmissionsAverted}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h4 className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5 border-b border-slate-800 pb-3">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <span>Urban PM2.5 Speciation Attribution</span>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceAttributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      innerRadius={40}
                      paddingAngle={3}
                    >
                      {sourceAttributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5">
                {sourceAttributionData.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-300">{s.name}</span>
                    </div>
                    <span className="font-mono text-slate-400 font-bold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: VULNERABLE CITIZENS & PATIENTS
          ===================================================================== */}
      {activePersona === 'citizen' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <HeartPulse className="w-5 h-5 text-teal-400" />
                  <h3 className="font-extrabold text-sm text-slate-100">
                    Personalized Inhalation Risk & Outdoor Exertion Calculator
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">
                  Medical Grade
                </span>
              </div>

              <form onSubmit={handleRunCitizenAssessment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Vulnerability Condition</label>
                    <select
                      value={userHealth}
                      onChange={(e) => setUserHealth(e.target.value as HealthCondition)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    >
                      <option value="asthma">Asthma / Hyperactive Airway</option>
                      <option value="copd">COPD / Chronic Bronchitis</option>
                      <option value="cardiovascular">Cardiovascular Disease</option>
                      <option value="elderly">Senior Citizen (65+)</option>
                      <option value="child">Child / Pediatric</option>
                      <option value="pregnant">Pregnancy</option>
                      <option value="outdoor_worker">Outdoor Daily Laborer</option>
                      <option value="athlete">High-Performance Athlete</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Age</label>
                    <input
                      type="number"
                      value={userAge}
                      onChange={(e) => setUserAge(parseInt(e.target.value) || 30)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Planned Activity</label>
                    <select
                      value={targetActivity}
                      onChange={(e) => setTargetActivity(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    >
                      <option value="jogging">Outdoor Jogging / Running</option>
                      <option value="cycling">Road Cycling / Commute</option>
                      <option value="walking">Walking / Errands</option>
                      <option value="labor">Heavy Physical Labor</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20"
                >
                  <HeartPulse className="w-4 h-4" />
                  <span>Calculate Safe Outdoor Exertion Window</span>
                </button>
              </form>

              {citizenRiskAssessment && (
                <div className="bg-slate-950 border border-teal-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Max Safe Window</div>
                      <div className="text-lg font-black font-mono text-teal-400">{citizenRiskAssessment.safeExertionMinutes} Mins</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Inhalation Risk</div>
                      <div className="text-lg font-black font-mono text-red-400">{citizenRiskAssessment.inhalationRisk}</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 sm:col-span-2">
                      <div className="text-[10px] font-mono text-slate-400">Recommended Respirator</div>
                      <div className="text-xs font-bold text-slate-200 truncate">{citizenRiskAssessment.recommendedMask}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {citizenRiskAssessment.advisoryMessage}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h4 className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5 border-b border-slate-800 pb-3">
                <Navigation className="w-4 h-4 text-teal-400" />
                <span>Clean-Air Navigator Integration</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly to our clean-air micro-routing engine to bypass high-emission traffic canyons and industrial plumes.
              </p>
              <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-300 rounded-2xl font-mono text-[11px]">
                Average Inhalation Dose Cut: 38.5%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: SMART CITY TRANSIT & URBAN PLANNERS
          ===================================================================== */}
      {activePersona === 'transit' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-extrabold text-sm text-slate-100">
                    Dynamic Freight Diversion & Traffic Signal Flushing
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">
                  Fleet & ITS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">Freight Green Wave</span>
                    <button
                      type="button"
                      onClick={() => setGreenCorridorActive(!greenCorridorActive)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        greenCorridorActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {greenCorridorActive ? 'Active' : 'Off'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">Automated freight bypass around school & hospital zones.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">EV Bus Fleet Split</span>
                    <span className="font-mono text-cyan-400 font-bold text-xs">{evBusAllocation}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={evBusAllocation}
                    onChange={(e) => setEvBusAllocation(parseInt(e.target.value) || 20)}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Zero-emission transit prioritization for dense corridors.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">Signal Flush Extension</span>
                    <span className="font-mono text-cyan-400 font-bold text-xs">+{signalGreenExtensionSec}s</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={signalGreenExtensionSec}
                    onChange={(e) => setSignalGreenExtensionSec(parseInt(e.target.value) || 5)}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Reduces diesel vehicle stop-and-go idle spikes.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunTransitSim}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
              >
                <Truck className="w-4 h-4" />
                <span>Simulate Dynamic Traffic Flush Levers</span>
              </button>

              {transitSimResult && (
                <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Tailpipe Emission Cut</div>
                      <div className="text-lg font-black font-mono text-cyan-400">-{transitSimResult.tailpipeEmissionCutPercent}%</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Freight Congestion Relief</div>
                      <div className="text-lg font-black font-mono text-emerald-400">-{transitSimResult.freightCongestionReduction}%</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Stagnation Flush Rate</div>
                      <div className="text-lg font-black font-mono text-teal-400">+{transitSimResult.flushedStagnationPercent}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h4 className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5 border-b border-slate-800 pb-3">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Real-Time Traffic Inversion Sync</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                During low boundary layer heights (&lt;250m), freight traffic is automatically rerouted to elevated peripheral rings to prevent ground-level micro-spikes.
              </p>
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-2xl font-mono text-[11px]">
                Active Inversion Cap: 340m (Normal Dispersion)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: HEALTHCARE & INDUSTRIAL ENTERPRISE
          ===================================================================== */}
      {activePersona === 'enterprise' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Factory className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-sm text-slate-100">
                    Hospital Surge Forecasting & Smart Building HVAC Sync
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  B2B & Healthcare
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <label className="font-bold text-xs text-slate-200 block">Smart HVAC Filter Sync</label>
                  <select
                    value={hvacPreFilterStatus}
                    onChange={(e) => setHvacPreFilterStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl text-amber-400 font-mono text-xs focus:outline-none"
                  >
                    <option value="prefiltering">Auto Pre-Filtering Active</option>
                    <option value="isolated">100% Recirculation Isol</option>
                    <option value="idle">Standard HVAC Bypass</option>
                  </select>
                  <p className="text-[11px] text-slate-400">Pre-filters indoor air before outdoor smog settles.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">Boiler Capacity Cap</span>
                    <span className="font-mono text-amber-400 font-bold text-xs">{boilerOperatingCapacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="5"
                    value={boilerOperatingCapacity}
                    onChange={(e) => setBoilerOperatingCapacity(parseInt(e.target.value) || 30)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Industrial output throttle for compliance credits.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">Surge Horizon</span>
                    <span className="font-mono text-amber-400 font-bold text-xs">{hospitalSurgeDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={hospitalSurgeDays}
                    onChange={(e) => setHospitalSurgeDays(parseInt(e.target.value) || 1)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Hospital ICU/ER respiratory influx forecast.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunEnterpriseSim}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
              >
                <Building2 className="w-4 h-4" />
                <span>Simulate Hospital Admission Surges & HVAC Pre-Filtration</span>
              </button>

              {enterpriseResult && (
                <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Projected ER Beds</div>
                      <div className="text-lg font-black font-mono text-amber-400">{enterpriseResult.projectedRespiratoryBeds} Beds</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Indoor Maintained AQI</div>
                      <div className="text-lg font-black font-mono text-emerald-400">{enterpriseResult.indoorAqiMaintained} AQI</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Carbon Credits</div>
                      <div className="text-lg font-black font-mono text-teal-400">+{enterpriseResult.carbonCreditsAudited} tCO2e</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Audit Compliance</div>
                      <div className="text-lg font-black font-mono text-cyan-400">{enterpriseResult.complianceScore}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h4 className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Carbon Credit & Compliance Auditing</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Leverages immutable time-series audit logs to certify municipal and industrial emission reductions for global carbon credit markets.
              </p>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-2xl font-mono text-[11px]">
                Certification Ledger: Verified SHA-256 Emission Decrements
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: COLLABORATIVE PINNED ANNOTATIONS & COMMUNITY NOTES
          ===================================================================== */}
      {activePersona === 'annotations' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header & Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-black text-slate-100">
                    Collaborative Field Notes & Incident Map Pins
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time spatial annotations pinned by citizens, field inspectors, analysts, and city planners on local coordinate grids.
                </p>
              </div>

              <button
                onClick={() => setShowAddNoteModal(true)}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-violet-500/20 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Pin New Note on Map</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={noteSearchQuery}
                  onChange={(e) => setNoteSearchQuery(e.target.value)}
                  placeholder="Search pins, tags, locations..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <select
                  value={selectedNoteCategory}
                  onChange={(e) => setSelectedNoteCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Incident">Incidents & Violations</option>
                  <option value="Sensor Calibration">Sensor Calibration / Drift</option>
                  <option value="Health Hazard">Health Hazards</option>
                  <option value="Policy Enforcement">Policy Enforcement</option>
                  <option value="Clean Shelter">Clean Shelters & HEPA</option>
                  <option value="Community Report">Community Reports</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedNoteSeverity}
                  onChange={(e) => setSelectedNoteSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="All">All Severities</option>
                  <option value="Critical">Critical Severity</option>
                  <option value="High">High Severity</option>
                  <option value="Moderate">Moderate Severity</option>
                  <option value="Low">Low Severity</option>
                </select>
              </div>
            </div>

            {/* Note Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredNotes.map((note) => {
                const isCritical = note.severity === 'Critical';
                const isHigh = note.severity === 'High';
                const isMod = note.severity === 'Moderate';

                return (
                  <div
                    key={note.id}
                    className="bg-slate-950 border border-slate-800/90 hover:border-violet-500/40 rounded-2xl p-4.5 flex flex-col justify-between space-y-3 transition-all shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            isHigh ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            isMod ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {note.severity}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {note.category}
                          </span>
                        </div>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          note.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                          note.status === 'Mitigated' ? 'bg-teal-500/20 text-teal-400' :
                          note.status === 'Under Investigation' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {note.status}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-100 line-clamp-2">
                        {note.title}
                      </h4>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span className="truncate">{note.locationName}</span>
                        <span>({note.lat.toFixed(3)}, {note.lng.toFixed(3)})</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {note.description}
                      </p>

                      {/* Tags */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex items-center space-x-1.5 flex-wrap gap-1 pt-1">
                          {note.tags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-violet-300 border border-violet-500/20">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer: Author, Verification, Upvote, Comments */}
                    <div className="border-t border-slate-800/80 pt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          {note.verifiedByOfficial && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Verified by Air Quality Inspector" />
                          )}
                          <span className="font-medium text-slate-300 truncate max-w-[140px]">{note.authorName}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">{note.timestamp}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => handleToggleUpvote(note.id)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                            note.hasUpvoted 
                              ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50' 
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${note.hasUpvoted ? 'fill-current text-violet-400' : ''}`} />
                          <span>{note.upvotes}</span>
                        </button>

                        <button
                          onClick={() => setActiveCommentNoteId(activeCommentNoteId === note.id ? null : note.id)}
                          className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{note.comments.length} Comments</span>
                        </button>
                      </div>

                      {/* Comment Thread Box */}
                      {activeCommentNoteId === note.id && (
                        <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5 animate-in fade-in duration-150">
                          <div className="text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-1 flex items-center justify-between">
                            <span>COMMUNITY DISCUSSION ({note.comments.length})</span>
                          </div>

                          <div className="max-h-36 overflow-y-auto space-y-2 custom-scrollbar">
                            {note.comments.length === 0 ? (
                              <p className="text-[11px] text-slate-500 italic">No comments yet. Start the discussion.</p>
                            ) : (
                              note.comments.map((c) => (
                                <div key={c.id} className="p-2 bg-slate-950 rounded-lg text-xs space-y-1">
                                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <span className="font-bold text-slate-200">{c.authorName}</span>
                                    <span>{c.timestamp}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300">{c.text}</p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Add Comment Input */}
                          <div className="flex items-center space-x-1.5 pt-1">
                            <input
                              type="text"
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              placeholder="Write a field comment or update..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment(note.id);
                              }}
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                            />
                            <button
                              onClick={() => handleAddComment(note.id)}
                              className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Pinned Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-violet-400" />
                <h3 className="font-black text-slate-100 text-base">Pin New Collaborative Note</h3>
              </div>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateNewNote} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Title / Headline</label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g., Heavy Smog Plume from Brick Kilns"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Category</label>
                  <select
                    value={newNoteCategory}
                    onChange={(e) => setNewNoteCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500"
                  >
                    <option value="Incident">Incident</option>
                    <option value="Sensor Calibration">Sensor Calibration</option>
                    <option value="Health Hazard">Health Hazard</option>
                    <option value="Policy Enforcement">Policy Enforcement</option>
                    <option value="Clean Shelter">Clean Shelter</option>
                    <option value="Community Report">Community Report</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Severity</label>
                  <select
                    value={newNoteSeverity}
                    onChange={(e) => setNewNoteSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Location Name</label>
                  <input
                    type="text"
                    value={newNoteLocation}
                    onChange={(e) => setNewNoteLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Latitude</label>
                  <input
                    type="text"
                    value={newNoteLat}
                    onChange={(e) => setNewNoteLat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Longitude</label>
                  <input
                    type="text"
                    value={newNoteLng}
                    onChange={(e) => setNewNoteLng(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Detailed Field Report / Advisory</label>
                <textarea
                  value={newNoteDescription}
                  onChange={(e) => setNewNoteDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the incident, observed concentration, affected population, or mitigating actions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newNoteTags}
                  onChange={(e) => setNewNoteTags(e.target.value)}
                  placeholder="Diesel, Stubble, School Zone, HEPA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-violet-500/20"
              >
                <MapPin className="w-4 h-4" />
                <span>Publish Pinned Note to Map Network</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
