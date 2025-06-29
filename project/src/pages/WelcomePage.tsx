import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Database,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Filter,
  Upload,
  Download,
  Settings,
  Eye,
  Lock,
  Sparkles,
  Award,
  Target,
  Layers,
  Rocket,
  Heart,
  ChevronRight,
  Quote,
  Infinity,
  Brain,
  Lightbulb,
  Cpu,
  Wifi,
  Cloud,
  Monitor,
  Smartphone,
  ExternalLink
} from 'lucide-react';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  const [showDemo, setShowDemo] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 4000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced machine learning algorithms predict student behavior and optimize conversion rates automatically',
      color: 'from-violet-500 via-purple-500 to-indigo-600',
      bgColor: 'bg-violet-500',
      lightBg: 'bg-violet-50',
      textColor: 'text-violet-600',
      gradient: 'bg-gradient-to-br from-violet-400/20 to-purple-600/20'
    },
    {
      icon: Infinity,
      title: 'Unlimited Scale',
      description: 'Handle billions of records with quantum-speed processing and real-time analytics across global institutions',
      color: 'from-emerald-500 via-teal-500 to-cyan-600',
      bgColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      gradient: 'bg-gradient-to-br from-emerald-400/20 to-teal-600/20'
    },
    {
      icon: Lightbulb,
      title: 'Smart Automation',
      description: 'Intelligent workflows that learn from your patterns and automate complex admission processes seamlessly',
      color: 'from-amber-500 via-orange-500 to-red-600',
      bgColor: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-600',
      gradient: 'bg-gradient-to-br from-amber-400/20 to-orange-600/20'
    },
    {
      icon: Globe,
      title: 'Global Communication',
      description: 'Multi-channel messaging across 50+ platforms with AI-powered personalization and sentiment analysis',
      color: 'from-rose-500 via-pink-500 to-purple-600',
      bgColor: 'bg-rose-500',
      lightBg: 'bg-rose-50',
      textColor: 'text-rose-600',
      gradient: 'bg-gradient-to-br from-rose-400/20 to-pink-600/20'
    },
    {
      icon: Cpu,
      title: 'Quantum Analytics',
      description: 'Real-time insights powered by quantum computing with predictive modeling and advanced visualizations',
      color: 'from-blue-500 via-indigo-500 to-purple-600',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      gradient: 'bg-gradient-to-br from-blue-400/20 to-indigo-600/20'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Military-grade encryption with blockchain verification and zero-trust architecture for ultimate protection',
      color: 'from-cyan-500 via-blue-500 to-indigo-600',
      bgColor: 'bg-cyan-500',
      lightBg: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      gradient: 'bg-gradient-to-br from-cyan-400/20 to-blue-600/20'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Director, ABC Educational Institute',
      content: 'EduCRM Pro revolutionized our admission process. We achieved a 85% increase in conversions and reduced operational costs by 60%.',
      rating: 5,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      company: 'ABC Educational Institute',
      students: '50,000+',
      improvement: '+85%'
    },
    {
      name: 'Priya Sharma',
      role: 'CRM Manager, XYZ Coaching Center',
      content: 'The AI-powered insights are incredible. Our team efficiency improved by 300% and we can now handle 10x more students effortlessly.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      company: 'XYZ Coaching Center',
      students: '25,000+',
      improvement: '+300%'
    },
    {
      name: 'Amit Patel',
      role: 'Operations Head, DEF Academy',
      content: 'Phenomenal ROI! The automation features saved us 200+ hours per week and increased our revenue by 150% in just 6 months.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      company: 'DEF Academy',
      students: '75,000+',
      improvement: '+150%'
    }
  ];

  const stats = [
    { label: 'Global Institutions', value: '10,000+', icon: GraduationCap, color: 'from-blue-500 to-cyan-500' },
    { label: 'Student Records', value: '500M+', icon: Users, color: 'from-emerald-500 to-teal-500' },
    { label: 'Daily Interactions', value: '2M+', icon: MessageSquare, color: 'from-purple-500 to-pink-500' },
    { label: 'Success Rate', value: '95%+', icon: TrendingUp, color: 'from-orange-500 to-red-500' }
  ];

  const portalFeatures = [
    {
      title: 'Backend Portal',
      subtitle: 'Ultimate System Control',
      description: 'God-mode access with quantum-level system management and universal configuration capabilities',
      color: 'from-red-500 via-rose-500 to-pink-600',
      icon: Database,
      features: ['AI User Management', 'Quantum Analytics', 'Global Security', 'System Intelligence'],
      bgPattern: 'bg-gradient-to-br from-red-50 to-rose-100',
      loginUrl: '/login?portal=admin',
      demoCredentials: { email: 'rakshigowda628@gmail.com', password: 'Rakshi@01' }
    },
    {
      title: 'Manager Portal',
      subtitle: 'Strategic Command Center',
      description: 'Executive-level tools for managing institutional empires with predictive intelligence and automation',
      color: 'from-blue-500 via-indigo-500 to-purple-600',
      icon: GraduationCap,
      features: ['Team Orchestration', 'Smart Data Upload', 'Predictive Reports', 'Automated Operations'],
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      loginUrl: '/login?portal=manager',
      demoCredentials: { email: 'manager@educrm.com', password: 'manager123' }
    },
    {
      title: 'Executive Portal',
      subtitle: 'Conversion Machine',
      description: 'High-performance interface designed for maximum efficiency and conversion optimization',
      color: 'from-green-500 via-emerald-500 to-teal-600',
      icon: Phone,
      features: ['Smart Call System', 'AI Student Insights', 'Automated Workflows', 'Performance Boost'],
      bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-100',
      loginUrl: '/login?portal=executive',
      demoCredentials: { email: 'executive@educrm.com', password: 'exec123' }
    }
  ];

  const handlePortalAccess = (portal: any) => {
    // Store portal selection and redirect to login
    localStorage.setItem('selectedPortal', portal.loginUrl.split('=')[1]);
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Interactive mouse follower */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '7s', animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                EduCRM Pro
              </h1>
              <p className="text-gray-400 text-sm font-medium">Next-Gen AI Education Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium group"
            >
              <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
            <button
              onClick={onGetStarted}
              className="relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
            >
              <span className="relative z-10">Launch Platform</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 rounded-full text-sm font-semibold mb-8 animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 10,000+ Global Institutions
            </span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-pulse">
              Future of
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Education
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              is Here
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            Revolutionary AI-powered CRM platform that transforms educational institutions into 
            conversion powerhouses. Experience quantum-level performance with unlimited scale, 
            intelligent automation, and predictive analytics that deliver unprecedented results.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <button
              onClick={onGetStarted}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transform"
            >
              <span className="relative z-10 flex items-center justify-center">
                <Rocket className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                Launch Revolution
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="group flex items-center justify-center px-10 py-5 border-2 border-gray-600 text-gray-300 rounded-2xl font-bold text-xl hover:border-gray-400 hover:bg-gray-800/50 transition-all duration-300 backdrop-blur-sm"
            >
              <Play className="w-6 h-6 mr-3 group-hover:scale-125 transition-transform" />
              Experience Demo
            </button>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-110 transform">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-4 bg-gradient-to-r ${stat.color} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-semibold group-hover:text-gray-300 transition-colors">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-32 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 rounded-full text-sm font-semibold mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Quantum-Powered Features
            </span>
            <h2 className="text-6xl font-black text-white mb-8">
              Beyond
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Imagination</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience features that redefine what's possible in educational technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative cursor-pointer transition-all duration-700 hover:scale-105 ${
                  activeFeature === index ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                {/* Glowing background */}
                <div className={`absolute inset-0 ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-10 border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-500">
                  <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-r ${feature.color} mb-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors text-lg">
                    {feature.description}
                  </p>
                  <div className="mt-8 flex items-center text-sm font-semibold text-gray-500 group-hover:text-blue-400 transition-colors">
                    Explore feature
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="px-6 py-32 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 rounded-full text-sm font-semibold mb-8">
              <Layers className="w-4 h-4 mr-2" />
              Choose Your Portal
            </span>
            <h2 className="text-6xl font-black text-white mb-8">
              Direct Portal
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"> Access</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access your dedicated portal directly with role-specific features and capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {portalFeatures.map((portal, index) => (
              <div key={index} className="group relative">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-10 border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-500 hover:scale-105 transform">
                  <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-r ${portal.color} mb-8 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500`}>
                    <portal.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">{portal.title}</h3>
                  <p className="text-xl font-semibold text-gray-400 mb-6">{portal.subtitle}</p>
                  <p className="text-gray-400 mb-8 leading-relaxed text-lg">{portal.description}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {portal.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                        <CheckCircle className="w-6 h-6 mr-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Demo Credentials */}
                  <div className="mb-8 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                    <p className="text-xs text-gray-400 mb-2 font-medium">Demo Credentials:</p>
                    <div className="text-xs text-gray-300 space-y-1">
                      <div>Email: {portal.demoCredentials.email}</div>
                      <div>Password: {portal.demoCredentials.password}</div>
                    </div>
                  </div>

                  {/* Portal Access Button */}
                  <button
                    onClick={() => handlePortalAccess(portal)}
                    className={`w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r ${portal.color} text-white rounded-xl hover:shadow-lg transition-all duration-300 font-bold text-lg group-hover:scale-105 transform`}
                  >
                    <ExternalLink className="w-5 h-5 mr-3" />
                    Access {portal.title}
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Universal Access Button */}
          <div className="text-center mt-16">
            <div className="inline-block p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl">
              <button
                onClick={onGetStarted}
                className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
              >
                <Shield className="w-5 h-5 inline mr-3" />
                Universal Portal Access
                <span className="text-gray-400 text-sm block mt-1">Choose your portal after login</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-32 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500/20 to-rose-500/20 backdrop-blur-sm border border-pink-500/30 text-pink-300 rounded-full text-sm font-semibold mb-8">
              <Heart className="w-4 h-4 mr-2" />
              Success Stories
            </span>
            <h2 className="text-6xl font-black text-white mb-8">
              Transforming
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent"> Lives</span>
            </h2>
            <p className="text-xl text-gray-300">Real results from real institutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-10 border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-500 hover:scale-105 transform">
                  <div className="flex mb-8">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current group-hover:scale-110 transition-transform" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <Quote className="w-10 h-10 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                  <p className="text-gray-300 mb-8 italic leading-relaxed font-medium text-lg group-hover:text-white transition-colors">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-gray-600 group-hover:border-blue-400 transition-colors"
                      />
                      <div>
                        <div className="font-bold text-white text-lg">{testimonial.name}</div>
                        <div className="text-gray-400 text-sm">{testimonial.role}</div>
                        <div className="text-blue-400 text-sm font-medium">{testimonial.company}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">{testimonial.improvement}</div>
                      <div className="text-xs text-gray-500">{testimonial.students}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-blue-500/50 text-blue-300 rounded-full text-sm font-semibold mb-8 animate-pulse">
              <Rocket className="w-4 h-4 mr-2" />
              Ready for Transformation?
            </span>
          </div>
          
          <h2 className="text-7xl md:text-8xl font-black text-white mb-12 leading-tight">
            Your Success Story
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Starts Now
            </span>
          </h2>
          
          <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
            Join the revolution. Transform your institution into a conversion powerhouse 
            and achieve results that seemed impossible before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <button
              onClick={onGetStarted}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl font-black text-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transform"
            >
              <span className="relative z-10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 mr-4 group-hover:animate-spin" />
                Start Revolution
                <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-3 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="group flex items-center justify-center px-12 py-6 border-2 border-gray-600 text-gray-300 rounded-2xl font-black text-2xl hover:border-gray-400 hover:bg-gray-800/50 transition-all duration-300 backdrop-blur-sm hover:scale-105 transform"
            >
              <Calendar className="w-8 h-8 mr-4 group-hover:scale-125 transition-transform" />
              Book Demo
            </button>
          </div>

          <div className="mt-16 text-gray-400 text-lg">
            <p>✨ No commitment required • 🚀 Setup in minutes • 💯 Results guaranteed</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 relative border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-8 md:mb-0">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <div className="text-white font-black text-2xl">EduCRM Pro</div>
                <div className="text-gray-400 text-sm">Next-Gen AI Education Platform</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-gray-400 text-sm mb-3">
                © 2024 EduCRM Pro. Revolutionizing education worldwide.
              </div>
              <div className="flex items-center justify-center md:justify-end space-x-6 text-gray-500 text-sm">
                <span className="flex items-center hover:text-blue-400 transition-colors cursor-pointer">
                  <Shield className="w-4 h-4 mr-2" />
                  Quantum Security
                </span>
                <span className="flex items-center hover:text-emerald-400 transition-colors cursor-pointer">
                  <Award className="w-4 h-4 mr-2" />
                  AI Certified
                </span>
                <span className="flex items-center hover:text-purple-400 transition-colors cursor-pointer">
                  <Globe className="w-4 h-4 mr-2" />
                  Global Scale
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 max-w-lg w-full border border-gray-700 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                <Play className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Experience the Future</h3>
              <p className="text-gray-400 text-lg">
                Get a personalized demo and witness the transformation firsthand.
              </p>
            </div>
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
              <input
                type="text"
                placeholder="Institution Name"
                className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setShowDemo(false)}
                  className="flex-1 px-6 py-4 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-colors font-semibold text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDemo(false);
                    onGetStarted();
                  }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-lg hover:scale-105 transform"
                >
                  Launch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};